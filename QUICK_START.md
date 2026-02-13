# Quick Start Checklist

## What's Already Done ✅

The following has been configured in your codebase:
- [x] JWT authentication system with bcryptjs password hashing
- [x] Backend login/register/user endpoints
- [x] Frontend authentication UI and hooks
- [x] Database schema updated with password field
- [x] All npm dependencies added and installed
- [x] Environment variables configured

## What YOU Need to Do

### 1️⃣ Install PostgreSQL (If Not Already Installed)

**Download from:** https://www.postgresql.org/download/windows/

**During installation:**
- Remember the password you set for user `postgres`
- Default port is 5432 (keep it)
- Don't skip the installation

**Verify installation:**
```powershell
psql --version
```

---

### 2️⃣ Create the Database

Open PowerShell and run:

```powershell
psql -U postgres
```

When prompted, enter your PostgreSQL password.

In the `psql` prompt, type:
```sql
CREATE DATABASE learnai;
\q
```

---

### 3️⃣ Update .env with Your PostgreSQL Password

Edit `.env` in your project root and update:

```env
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/learnai
```

Replace `YOUR_PASSWORD` with the password you set when installing PostgreSQL.

---

### 4️⃣ Initialize the Database Schema

Open PowerShell in your project folder:

```powershell
cd "c:\Users\somya\OneDrive\Skill-Navigator-1"
npm run db:push
```

This creates all tables in PostgreSQL.

---

### 5️⃣ Start the Development Server

```powershell
npm run dev
```

Wait for the message: `serving on port 5000`

Open your browser to: **http://localhost:5000**

---

## First Time Using the App

1. Click **"Create Account"** (or go to http://localhost:5000/auth)
2. Fill in:
   - Email: anything@example.com
   - Password: at least 6 characters
   - First Name & Last Name
3. Click **Create Account**
4. You're logged in! 🎉

## Stop the Server

Press `Ctrl+C` in PowerShell

---

## Troubleshooting

### PostgreSQL Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Start PostgreSQL or verify it's running

**Windows**: Open Services app and start PostgreSQL service

### Database Already Exists
```
Error: CREATE DATABASE failed
```
**Solution:** You already created it. Skip and run `npm run db:push`

### Wrong Password Error
```
Error: password authentication failed
```
**Solution:** Update .env with correct PostgreSQL password

### Port 5000 Already in Use
```
Error: EADDRINUSE: address already in use :::5000
```
**Solution:** Kill the process or use a different port:
```powershell
$env:PORT=3000; npm run dev
```

---

## Files You've Received

- `README.md` - Overview and features
- `SETUP_GUIDE.md` - Detailed setup documentation
- Updated source code with JWT authentication

---

## That's It! 🚀

After completing the 5 steps above, your LearnAI app will be:
- ✅ Running locally on your machine
- ✅ Using your local PostgreSQL database
- ✅ With full JWT-based authentication
- ✅ Ready to use and develop on

Happy learning!
