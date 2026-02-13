# Skill Navigator — Quick Start

Short guide to clone, install and run this repository locally.

## Requirements

- Node.js 18+ (Node 20 recommended)
- npm (or compatible package manager)
- Postgres (for `DATABASE_URL` and persistent features)
- Optional: OpenAI API key for ML/chat features

## Clone

```bash
git clone <REPO_URL>
cd Skill-Navigator-1
```

## Install

```bash
npm install
```

## Environment

Create a `.env` file in the project root with the required values. Common variables:

- `DATABASE_URL` - Postgres connection string
- `SESSION_SECRET` - session signing secret
- `JWT_SECRET` - JWT signing secret (if used)
- `OPENAI_API_KEY` - OpenAI API key for chat/ML features
- `PORT` - optional

You can inspect `server` source and `shared` schema to find additional expected env keys.

## Run (development)

Dev server starts the backend and serves the frontend via Vite middleware. From project root:

```bash
npm run dev
```

Open http://localhost:3000 (or the `PORT` you set).

## Build & Run (production)

```bash
npm run build
npm start
```

The `build` script runs Vite to build the client and bundles the server to `dist/index.cjs`.

## Database

If you use Drizzle to manage schema, run migrations/push after setting `DATABASE_URL`:

```bash
npm run db:push
```

There is a sample migration file at `migrations/add_ml_tracking_tables.sql`.

## Useful scripts (root `package.json`)

- `npm run dev` — start server in development (server uses Vite middleware)
- `npm run build` — build client (Vite) and bundle server
- `npm start` — run production bundle
- `npm run check` — TypeScript check
- `npm run db:push` — apply Drizzle schema push

## Notes

- The client is in the `client/` folder and is served by the server in dev mode (no separate `client/package.json`).
- If you prefer to run only the server, the server entry is `server/index.ts` and is started by `npm run dev`.
- For Windows: `cross-env` is used in scripts so environment flags in scripts work cross-platform.

## Contributing

Open issues or submit PRs. If you'd like, I can create a `.env.example` and a simple `scripts/` commit with these README changes and push them for you.

---

If you want, I can now commit these two files and create a `.env.example` with suggested placeholders.
# LearnAI - Local Setup Complete ✅

Your LearnAI project has been configured for local development with JWT-based authentication. Here's what has been set up:

## 🔧 What's Been Done

### Backend Changes
- ✅ **JWT Authentication** - Created secure JWT middleware in `server/middleware/jwtAuth.ts`
- ✅ **Auth Routes** - New endpoints in `server/replit_integrations/auth/localAuth.ts`:
  - `POST /api/auth/register` - Create new accounts
  - `POST /api/auth/login` - User login
  - `GET /api/auth/user` - Get current user (requires JWT token)
- ✅ **Password Security** - Added bcryptjs for secure password hashing
- ✅ **Database Schema** - Updated users table with `passwordHash` field

### Frontend Changes  
- ✅ **Auth Hook** - Updated `client/src/hooks/use-auth.ts` with:
  - JWT token storage in localStorage
  - `login()` and `register()` functions
  - Automatic token injection in API requests
- ✅ **Auth Pages** - Created complete login/signup UI in `client/src/pages/auth.tsx`
- ✅ **Protected Routes** - Updated routing to use `/auth` instead of Replit auth

### Environment & Dependencies
- ✅ **Dependencies Installed** - Added `bcryptjs`, `jsonwebtoken`, and type definitions
- ✅ **.env Configured** - Database URL, JWT and session secrets ready

## 🚀 Getting Started

### Prerequisites
1. **PostgreSQL installed** on your machine
2. **Node.js and npm** installed

### Step 1: Create PostgreSQL Database

Open PowerShell and run:

```powershell
psql -U postgres
```

Then in the psql prompt:

```sql
CREATE DATABASE learnai;
\q
```

### Step 2: Update .env with PostgreSQL Password

Edit `.env` and change:
```env
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/learnai
```

Replace `YOUR_PASSWORD` with your PostgreSQL password.

### Step 3: Initialize Database

```powershell
npm run db:push
```

This creates all tables including the updated users table with password support.

### Step 4: Start Development Server

```powershell
npm run dev
```

Open `http://localhost:5000` in your browser.

## 📱 Using the App

### First Login
1. Click **"Create Account"** on the auth page
2. Fill in your details and create a password
3. You'll be logged in automatically
4. Your JWT token is stored in localStorage

### How JWT Works
1. Login/Register generates a token
2. Token stored in browser's localStorage
3. All requests include token in `Authorization: Bearer <token>` header
4. Backend verifies token on protected routes
5. Logout clears the token

## 📁 Key Files

| File | Purpose |
|------|---------|
| `server/middleware/jwtAuth.ts` | JWT verification middleware |
| `server/replit_integrations/auth/localAuth.ts` | Login/register endpoints |
| `client/src/hooks/use-auth.ts` | Frontend auth logic |
| `client/src/pages/auth.tsx` | Login/signup UI |
| `.env` | Environment variables |
| `SETUP_GUIDE.md` | Detailed setup instructions |

## ⚙️ Configuration

### Environment Variables (.env)
```env
DATABASE_URL=postgres://postgres:password@localhost:5432/learnai
SESSION_SECRET=your_session_secret_key_change_this_in_production
JWT_SECRET=your_jwt_secret_key_change_this_in_production
OPENAI_API_KEY=your_openai_api_key  # Optional
```

### JWT Token Expiration
Default: 7 days (set in `server/middleware/jwtAuth.ts`)

To change: Update `expiresIn` parameter in `generateJWT()` calls

## 🔒 Security Notes

### Development
- Default secrets are fine for local testing
- Tokens stored in localStorage (accessible to JS)

### Production
1. **Change JWT_SECRET** to a cryptographically secure random string
2. **Change SESSION_SECRET** to a random value
3. **Use HTTPS** (enables secure cookies)
4. **Use managed database** (AWS RDS, Heroku Postgres, etc.)
5. **Run** `npm audit` to check for vulnerabilities
6. **Consider** moving sensitive token operations to secure cookies (httpOnly)

## 📚 API Endpoints

### Authentication
```
POST /api/auth/register
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
Response: { token: "...", user: {...} }

POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}
Response: { token: "...", user: {...} }

GET /api/auth/user
Authorization: Bearer <token>
Response: { id: "...", email: "...", firstName: "...", ... }
```

### Other Endpoints
All existing endpoints work as before. Protected endpoints require the JWT token in the Authorization header.

## 🐛 Troubleshooting

### "Cannot connect to PostgreSQL"
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Try connecting manually: `psql -U postgres`

### "Module not found" errors
```bash
npm install
```

### Compilation errors
```bash
npm run check
```

### Database schema issues
```bash
npm run db:push
```

## 📞 Support Files

- **SETUP_GUIDE.md** - Comprehensive setup instructions
- **README.md** - This file

## ✨ Next Steps

1. ✅ Create an account and test login
2. Explore the dashboard
3. (Optional) Set up OpenAI API key for AI features
4. (Optional) Customize the UI and branding
5. Test protected routes with your JWT token

---

**Happy learning!** 🚀

For any issues, check the setup guide or verify your PostgreSQL connection.
