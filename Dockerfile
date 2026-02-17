# Multi-stage build for Skill Navigator
# Stage 1: Build the client (React + Vite)
FROM node:20-alpine AS client-builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies for both root and client
RUN npm ci
RUN cd client && npm ci

# Copy client source
COPY client/ ./client/

# Build the client
RUN npm run build

# Stage 2: Build the final application image
FROM node:20-alpine

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built client from stage 1
COPY --from=client-builder /app/dist ./dist

# Copy server source code
COPY server/ ./server/
COPY shared/ ./shared/
COPY migrations/ ./migrations/
COPY script/ ./script/

# Copy environment file (optional, can be overridden at runtime)
COPY .env.example .env || true

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["npm", "run", "start"]
