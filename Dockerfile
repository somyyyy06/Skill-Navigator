# Multi-stage build for Skill Navigator
# Stage 1: Install dependencies
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files for both root and client
COPY package*.json ./
COPY client/package*.json ./client/

# Install all dependencies (including dev dependencies for build)
RUN npm ci && cd client && npm ci

# Stage 2: Build the client (React + Vite)
FROM node:20-alpine AS client-builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Copy client source and shared code
COPY client/ ./client/
COPY shared/ ./shared/
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY components.json ./

# Build the client
RUN npm run build

# Stage 3: Build the final application image
FROM node:20-alpine AS production

WORKDIR /app

# Install dumb-init to handle signals properly
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1000 appuser && \
    adduser -D -u 1000 -G appuser appuser

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts

# Copy server build script
COPY script/ ./script/

# Copy built client from stage 1
COPY --from=client-builder /app/dist ./dist

# Copy server source code
COPY server/ ./server/
COPY shared/ ./shared/
COPY migrations/ ./migrations/
COPY drizzle.config.ts ./

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose the port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/index.cjs"]
