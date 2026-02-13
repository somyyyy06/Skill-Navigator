# LearnAI Local Setup Guide

## Prerequisites Setup

### 1. Install PostgreSQL

**Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the setup wizard
3. **Important**: Remember the password you set for the `postgres` superuser
4. Accept default port `5432`
5. When asked to install Stack Builder, you can skip it

**Verify Installation:**
```powershell
psql --version
```

### 2. Create the Database

Open PowerShell and connect to PostgreSQL:

```powershell
# Connect to PostgreSQL as the postgres superuser
psql -U postgres
```

When prompted, enter the password you created during installation.

Inside the `psql` prompt, run:

```sql
CREATE DATABASE learnai;
\q
```

This creates the `learnai` database. You're now ready to configure the app.

## Application Setup

### 1. Update Environment Variables

The `.env` file is already created. Verify it contains:

```env
DATABASE_URL=postgres://postgres:password@localhost:5432/learnai
SESSION_SECRET=your_session_secret_key_change_this_in_production_12345678
JWT_SECRET=your_jwt_secret_key_change_this_in_production_87654321
OPENAI_API_KEY=your_openai_api_key
```

**Replace the values:**
- `password` - the PostgreSQL password you set during installation
- `JWT_SECRET` - Keep as is or generate a random string for production
- `SESSION_SECRET` - Keep as is or generate a random string for production
- `OPENAI_API_KEY` - Optional, only needed if using AI features

### 2. Initialize Database Schema

With PostgreSQL running and the database created, push the schema:

```powershell
cd "c:\Users\somya\OneDrive\Skill-Navigator-1"
npm run db:push
```

This command:
- Connects to your local PostgreSQL
- Creates all necessary tables (users, roadmaps, sessions, etc.)
- Applies all migrations

### 3. Start Development Server

```powershell
npm run dev
```

This starts the development server, typically on `http://localhost:5000`

## First-Time Usage

### Create Your First Account

1. Open `http://localhost:5000` in your browser
2. Look for a "Sign Up" or "Register" button
3. Fill in:
   - Email: your_email@example.com
   - Password: at least 6 characters
   - First Name
   - Last Name
4. Click Register

### Login

1. Click "Login"
2. Enter the email and password you created
3. You're now authenticated with JWT token stored in localStorage

## Project Architecture

### Backend (Express + Drizzle ORM)
- **Location**: `server/`
- **Auth System**: JWT-based (`server/middleware/jwtAuth.ts`)
- **Auth Routes**: `server/replit_integrations/auth/localAuth.ts`
- **Database**: PostgreSQL with Drizzle ORM
- **API Routes**: `server/routes.ts`

### Frontend (React + Vite)
- **Location**: `client/src/`
- **Auth Hook**: `client/src/hooks/use-auth.ts` - Manages JWT token in localStorage
- **Pages**: Dashboard, Landing, Learning View, etc.
- **Components**: Reusable UI components using Radix UI + Tailwind CSS

## Key Configuration Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (DATABASE_URL, JWT_SECRET, etc.) |
| `drizzle.config.ts` | Database configuration |
| `package.json` | Dependencies and scripts |
| `tsconfig.json` | TypeScript configuration |
| `vite.config.ts` | Frontend build configuration |
| `shared/schema.ts` | Database schema definitions |

## Available Scripts

```bash
npm run dev        # Start development server (backend + frontend)
npm run build      # Build for production
npm run start       # Start production server
npm run db:push    # Push database schema changes
npm run check      # Type check with TypeScript
```

## Troubleshooting

### PostgreSQL Connection Error
**Error**: `ECONNREFUSED` on port 5432

**Solution**:
1. Start PostgreSQL service (Windows: Services app or `psql -U postgres`)
2. Verify the password in `.env` matches your PostgreSQL password
3. Check DATABASE_URL format: `postgres://postgres:YOUR_PASSWORD@localhost:5432/learnai`

### Module Not Found Errors
**Error**: `Cannot find module 'bcryptjs'` or similar

**Solution**:
```bash
npm install
```

### Port Already in Use
**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:
```powershell
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use a different port
$env:PORT=3000; npm run dev
```

### Database Schema Out of Sync
**Solution**:
```bash
npm run db:push
```

## Security Notes

### For Production
1. **Change JWT_SECRET and SESSION_SECRET** to cryptographically secure random strings
2. **Use environment variables** - don't commit secrets to git
3. **Enable HTTPS** - set `secure: true` in cookie options
4. **Database**: Use managed PostgreSQL (AWS RDS, Heroku Postgres, etc.)
5. **Keep dependencies updated**: `npm audit fix`

### Current Auth Flow
- User registers → Password hashed with bcryptjs → Stored in database
- User login → Password verified → JWT token generated → Stored in localStorage
- Protected requests → Include JWT in Authorization header → Verified by middleware

## Next Steps

1. ✅ Set up local PostgreSQL database
2. ✅ Install dependencies with `npm install`
3. ✅ Push database schema with `npm run db:push`
4. ✅ Start dev server with `npm run dev`
5. Create your first account and explore the app
6. (Optional) Set up OpenAI API key for AI features
7. (Optional) Customize branding and content in the UI

## Support

For issues:
1. Check PostgreSQL is running and accessible
2. Verify `.env` file has correct values
3. Run `npm install` to ensure all dependencies are installed
4. Check browser console for client-side errors
5. Check terminal output for server-side errors
