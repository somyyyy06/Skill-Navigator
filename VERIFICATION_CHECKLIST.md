# LearnAI Local Setup - Verification Checklist

Use this checklist to verify your setup is complete and working correctly.

## ✅ Code Changes Complete

- [x] JWT authentication middleware created
- [x] Login/Register/User endpoints created
- [x] Frontend auth hook updated with JWT support
- [x] Auth UI pages created (login/signup)
- [x] Database schema updated with passwordHash
- [x] Environment variables configured
- [x] Dependencies installed (bcryptjs, jsonwebtoken)
- [x] Type definitions added
- [x] Route protection updated
- [x] Error handling implemented

## 🏗️ System Setup Checklist

### PostgreSQL Installation
- [ ] Downloaded PostgreSQL from postgresql.org
- [ ] Installed PostgreSQL successfully
- [ ] Remembered the `postgres` user password
- [ ] Verified installation: `psql --version` works

### Database Creation
- [ ] Created database named `learnai`
  ```powershell
  psql -U postgres
  CREATE DATABASE learnai;
  \q
  ```

### Environment Configuration
- [ ] Edited `.env` file
- [ ] Updated DATABASE_URL with correct password
  ```
  DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/learnai
  ```
- [ ] Verified JWT_SECRET is set
- [ ] Verified SESSION_SECRET is set

### Database Schema
- [ ] Ran `npm run db:push` successfully
- [ ] Tables created in PostgreSQL
- [ ] No migration errors

### Development Server
- [ ] Ran `npm run dev` successfully
- [ ] Server listening on port 5000
- [ ] No startup errors in console

## 🌐 Application Testing

### Visit the App
- [ ] Opened http://localhost:5000 in browser
- [ ] Landing page loads correctly
- [ ] No console errors

### Create Account
- [ ] Clicked "Create Account" or "Log in" button
- [ ] Navigated to http://localhost:5000/auth
- [ ] Signup form visible
- [ ] Successfully created test account
- [ ] No errors during registration

### Login
- [ ] Logged out (if needed)
- [ ] Entered correct email and password
- [ ] Login successful
- [ ] Token stored in localStorage (check DevTools → Application → localStorage)
- [ ] Redirected to dashboard

### Protected Routes
- [ ] Dashboard loads after login
- [ ] Can access roadmaps
- [ ] Can navigate to learning content
- [ ] Getting logged out redirects to auth page

### Logout
- [ ] Logout button works
- [ ] Redirected to auth page
- [ ] localStorage token cleared

## 🔍 Technical Verification

### Frontend (Browser DevTools)
1. Open DevTools (F12)
2. Go to Application tab
3. Check localStorage:
   - [ ] `auth_token` exists after login
   - [ ] Token starts with `eyJ` (base64 encoded)
   - [ ] Token cleared after logout

### Network Tab
1. Open DevTools → Network tab
2. Make a request to `/api/auth/user`
3. Check request headers:
   - [ ] `Authorization: Bearer <token>` header present
   - [ ] Status 200 if authenticated
   - [ ] Status 401 if not authenticated

### Server Console
1. Running terminal shows:
   - [ ] `serving on port 5000`
   - [ ] POST requests to `/api/auth/register` and `/api/auth/login`
   - [ ] GET request to `/api/auth/user`
   - [ ] No error messages

## 📊 Database Verification

### Check PostgreSQL
```powershell
psql -U postgres -d learnai

# List tables
\dt

# Check users table
SELECT * FROM users;

# Check if passwordHash column exists
\d users
```

- [ ] Users table exists
- [ ] passwordHash column exists
- [ ] Test user is in database
- [ ] passwordHash is hashed (not plain text)

## 🔐 Security Verification

### Password Security
- [ ] Passwords are hashed (not stored as plain text)
- [ ] bcryptjs hashing works (slow password hashing)

### Token Security
- [ ] JWT token is signed (includes `.` separators)
- [ ] Token expires after 7 days
- [ ] Token cannot be modified in DevTools

### API Security
- [ ] Unauthenticated requests return 401
- [ ] Expired tokens return 401
- [ ] Invalid emails show generic error
- [ ] Wrong passwords show generic error

## 📝 Documentation

- [ ] README.md - Present and contains overview
- [ ] SETUP_GUIDE.md - Contains detailed setup steps
- [ ] QUICK_START.md - Contains quick setup checklist
- [ ] JWT_AUTH_DETAILS.md - Contains technical details
- [ ] SETUP_SUMMARY.md - Contains this summary
- [ ] This file - Setup verification checklist

## 🎯 Before Production

Before deploying to production, verify:

- [ ] Change JWT_SECRET to random 32+ character string
- [ ] Change SESSION_SECRET to random 32+ character string
- [ ] Use HTTPS (not HTTP)
- [ ] Use managed PostgreSQL (not local)
- [ ] Set NODE_ENV=production
- [ ] Run `npm audit` and address vulnerabilities
- [ ] Configure CORS properly
- [ ] Add rate limiting to auth endpoints
- [ ] Set up logging/monitoring
- [ ] Test on actual production database
- [ ] Set up automated backups
- [ ] Test with production domain/URL

## 🚨 Common Issues & Solutions

### Issue: Cannot connect to database
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Fix:**
- Ensure PostgreSQL is running
- Verify password in .env
- Try: `psql -U postgres` to test connection

### Issue: Module not found
```
Error: Cannot find module 'bcryptjs'
```
**Fix:**
- Run: `npm install`

### Issue: Migration fails
```
Error: ECONNREFUSED or relation "users" does not exist
```
**Fix:**
- Verify database exists: `psql -U postgres -d learnai`
- Run: `npm run db:push`

### Issue: Port already in use
```
Error: EADDRINUSE: address already in use :::5000
```
**Fix:**
- Kill process: `taskkill /F /PID <PID>`
- Or use different port: `$env:PORT=3000; npm run dev`

### Issue: Login not working
```
Error: Invalid token or unauthorized
```
**Fix:**
- Clear localStorage and try again
- Verify JWT_SECRET in .env is set
- Restart server: `npm run dev`

## ✨ Success Indicators

You'll know everything is working when:

✅ Landing page loads at http://localhost:5000
✅ Can create new account at /auth
✅ Can login with created credentials
✅ Dashboard displays after login
✅ Token visible in localStorage
✅ Can access protected routes
✅ Logout clears token and redirects to auth
✅ No errors in browser console
✅ No errors in server console
✅ Database has user record with hashed password

## 📚 Next Steps

After verification:

1. **Explore the App**
   - Check out different learning roadmaps
   - Test navigation and features

2. **Optional: Add OpenAI**
   - Get API key from openai.com
   - Add to .env: `OPENAI_API_KEY=...`
   - Restart server

3. **Customize**
   - Change colors/theme
   - Update learning content
   - Customize branding

4. **Deploy** (when ready)
   - Follow production checklist
   - Choose hosting (Vercel, Heroku, AWS, etc.)
   - Deploy database and server

---

**Congratulations!** Your LearnAI is now fully set up for local development! 🎉

For help, refer to the documentation files:
- QUICK_START.md
- SETUP_GUIDE.md
- JWT_AUTH_DETAILS.md
