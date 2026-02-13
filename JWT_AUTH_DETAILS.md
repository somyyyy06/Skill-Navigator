# LearnAI JWT Authentication - Implementation Details

## Overview

LearnAI now uses JWT (JSON Web Tokens) for authentication instead of Replit Auth. This allows it to run independently on any machine with Node.js and PostgreSQL.

## Architecture

```
┌─────────────────┐
│   Browser       │
│  (localStorage) │
└────────┬────────┘
         │ JWT Token
         │
┌────────▼────────┐
│  React App      │
│  (client/)      │
└────────┬────────┘
         │ API Requests + Auth Header
         │
┌────────▼────────────────────┐
│  Express Server (server/)    │
│  - JWT Middleware            │
│  - Auth Routes               │
│  - Protected API Routes      │
└────────┬────────────────────┘
         │
┌────────▼────────┐
│  PostgreSQL DB  │
│  - users table  │
│  - roadmaps     │
│  - progress     │
└─────────────────┘
```

## Authentication Flow

### Registration (Sign Up)
```
1. User enters: email, password, firstName, lastName
2. Frontend: POST /api/auth/register with credentials
3. Backend:
   - Validate input with Zod schema
   - Check if email already exists
   - Hash password with bcryptjs (10 rounds)
   - Insert user into database
   - Generate JWT token: jwt.sign({ id, email }, JWT_SECRET)
4. Frontend: 
   - Receive token and user data
   - Store token in localStorage
   - Redirect to dashboard
5. Subsequent requests: Include header: Authorization: Bearer <token>
```

### Login
```
1. User enters: email, password
2. Frontend: POST /api/auth/login with credentials
3. Backend:
   - Find user by email
   - Compare password with bcryptjs.compare()
   - Generate JWT token if match
4. Frontend: Store token, redirect to dashboard
```

### Protected Requests
```
1. Frontend sends request:
   GET /api/auth/user
   Authorization: Bearer eyJhbGc...

2. Backend jwtMiddleware:
   - Extract token from Authorization header
   - Verify token signature: jwt.verify(token, JWT_SECRET)
   - Add req.user = { id, email } if valid
   - Return 401 if invalid/expired

3. Route handler accesses req.user
```

## Database Schema

### Users Table (Updated)
```typescript
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  passwordHash: varchar("password_hash"),  // NEW: for local auth
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
```

## API Endpoints

### POST /api/auth/register
**Create a new account**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Response (201):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

Error (400):
```json
{
  "message": "Email already registered"
}
```

### POST /api/auth/login
**Authenticate existing user**

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

Error (401):
```json
{
  "message": "Invalid email or password"
}
```

### GET /api/auth/user
**Get current user info (protected)**

Request:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Response (200):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "profileImageUrl": null
}
```

Error (401):
```json
{
  "message": "Invalid or expired token"
}
```

## Frontend Implementation

### useAuth Hook
Location: `client/src/hooks/use-auth.ts`

```typescript
const {
  user,              // Current user object or null
  isLoading,         // Loading state
  isAuthenticated,   // Boolean: !!user
  login,             // Function: (credentials) => void
  isLoggingIn,       // Boolean: login in progress
  loginError,        // String: error message
  register,          // Function: (credentials) => void
  isRegistering,     // Boolean: register in progress
  registerError,     // String: error message
  logout,            // Function: () => void
  isLoggingOut,      // Boolean: logout in progress
} = useAuth();
```

### Usage Example
```typescript
function MyComponent() {
  const { user, login, isLoggingIn, loginError } = useAuth();

  const handleLogin = async (email, password) => {
    login({ email, password });
  };

  if (!user) return <div>Not logged in</div>;

  return <div>Welcome, {user.firstName}!</div>;
}
```

### Token Storage
- **Location**: `localStorage.getItem("auth_token")`
- **Set on**: Login/Register success
- **Cleared on**: Logout or 401 response
- **Included in**: All API requests via Authorization header

## Backend Implementation

### JWT Middleware
Location: `server/middleware/jwtAuth.ts`

```typescript
// Middleware function that verifies JWT on protected routes
app.get("/api/protected", jwtMiddleware, (req, res) => {
  console.log(req.user); // { id: "...", email: "..." }
  res.json({ message: "success" });
});
```

### Auth Routes
Location: `server/replit_integrations/auth/localAuth.ts`

Exports: `registerLocalAuthRoutes(app: Express)`
- Registers POST /api/auth/register
- Registers POST /api/auth/login
- Registers GET /api/auth/user (with jwtMiddleware)

## Configuration

### Environment Variables
```env
JWT_SECRET=your_jwt_secret_key_change_this_in_production_87654321
DATABASE_URL=postgres://postgres:password@localhost:5432/learnai
SESSION_SECRET=your_session_secret_key_change_this_in_production_12345678
```

### JWT Settings
- **Algorithm**: HS256 (HMAC SHA-256)
- **Expiration**: 7 days (configured in `server/middleware/jwtAuth.ts`)
- **Signing Key**: `process.env.JWT_SECRET`

To change expiration:
```typescript
// In server/middleware/jwtAuth.ts
export function generateJWT(payload: any, expiresIn = '7d'): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn });
}

// Or pass different value:
generateJWT(payload, '24h')  // 24 hours
generateJWT(payload, '30d')  // 30 days
```

## Security Implementation

### Password Hashing
```typescript
import bcryptjs from 'bcryptjs';

// Hash on registration
const passwordHash = await bcryptjs.hash(password, 10);

// Verify on login
const isMatch = await bcryptjs.compare(password, user.passwordHash);
```

- **Algorithm**: bcrypt with 10 salt rounds
- **Never stored**: Plain text passwords are never stored
- **Hashed columns**: `passwordHash` in users table

### Token Security
```typescript
// Token creation
const token = jwt.sign(
  { id: user.id, email: user.email },
  process.env.JWT_SECRET!,
  { expiresIn: '7d' }
);

// Token verification
const payload = jwt.verify(token, process.env.JWT_SECRET!);
```

- **Signature verification**: Prevents token tampering
- **Expiration validation**: Tokens expire after 7 days
- **Secret key**: Stored in environment variables (never in code)

### Error Handling
```typescript
// Invalid token → 401
// Expired token → 401
// Missing Authorization header → 401
// Server errors → 500
```

## Validation

### Registration Schema
```typescript
const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
});
```

### Login Schema
```typescript
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
```

## Migration from Replit Auth

### What Changed
- ❌ Removed: OpenID Connect with Replit
- ✅ Added: JWT tokens + password-based auth
- ❌ Removed: Session-based auth
- ✅ Added: Stateless JWT validation

### Data Migration
- Existing Replit users: `id` field preserved from UUID
- New field: `passwordHash` for local users
- Sessions table: Still present but unused in JWT mode

### Frontend Changes
- ❌ Old: `window.location.href = "/api/login"`
- ✅ New: `navigate('/auth')` to auth page
- ❌ Old: `credentials: "include"`
- ✅ New: `Authorization: Bearer <token>` header

## Testing the Auth System

### Register a User (cURL)
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login (cURL)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Get User Info (cURL)
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -X GET http://localhost:5000/api/auth/user \
  -H "Authorization: Bearer $TOKEN"
```

## File Reference

| File | Purpose |
|------|---------|
| `server/middleware/jwtAuth.ts` | JWT verification & generation |
| `server/replit_integrations/auth/localAuth.ts` | Login/register/user endpoints |
| `server/replit_integrations/auth/routes.ts` | Route registration |
| `client/src/hooks/use-auth.ts` | Frontend auth management |
| `client/src/pages/auth.tsx` | Login/signup UI |
| `shared/models/auth.ts` | Database schema |

## Extending the System

### Add Custom Claims to JWT
```typescript
const token = generateJWT({
  id: user.id,
  email: user.email,
  role: user.role,  // Add custom claims
  permissions: ['read', 'write'],
});
```

### Use JWT Middleware on Routes
```typescript
app.post('/api/protected-endpoint', jwtMiddleware, async (req, res) => {
  const userId = req.user!.id;
  // Handle request
});
```

### Change Token Expiration per User
```typescript
generateJWT(payload, user.type === 'admin' ? '30d' : '7d')
```

## Production Checklist

- [ ] Change JWT_SECRET to random 32+ character string
- [ ] Change SESSION_SECRET to random 32+ character string
- [ ] Use HTTPS (set `secure: true` in cookies)
- [ ] Use managed PostgreSQL (not local)
- [ ] Set NODE_ENV=production
- [ ] Run `npm audit` and fix vulnerabilities
- [ ] Add rate limiting to auth endpoints
- [ ] Add CORS configuration
- [ ] Add logging/monitoring
- [ ] Test all auth flows
- [ ] Set up automated backups for database
- [ ] Configure firewall rules

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-02  
**Framework**: Express.js + React + Drizzle ORM  
**Auth Method**: JWT + bcryptjs
