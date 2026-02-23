# 🚀 Skill Navigator - Deployment Guide

This guide covers both **local development** and **production deployment** for the Skill Navigator app.

---

## Prerequisites

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js)

---

## 1️⃣ Local Development Setup

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..
```

### Step 2: Set Up Database

Install and start PostgreSQL, then create your database:

```bash
# Create database
createdb -U postgres learnai

# Or using psql:
# psql -U postgres
# CREATE DATABASE learnai;
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/learnai

# Server
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# API Keys (optional for development)
GEMINI_API_KEY=your-gemini-api-key
```

### Step 4: Run Database Migrations

```bash
npm run db:push
```

### Step 5: Start Development Server

```bash
npm run dev
```

The app will be available at: **http://localhost:5000**

---

## 2️⃣ Production Deployment

### Option A: Deploy to Render.com (Easiest)

#### Why Render?
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Easy GitHub integration
- ✅ Managed PostgreSQL database
- ✅ Auto-deploy on push

#### Steps:

**1. Create Render Account**
```
Go to: https://www.render.com/
Sign up with GitHub
```

**2. Create PostgreSQL Database**
```
Dashboard → New + → PostgreSQL
Choose: Free tier
Name: skill-navigator-db
Save the internal connection string
```

**3. Create Web Service**
```
Dashboard → New + → Web Service
Connect your GitHub repo
Build Command: npm run build
Start Command: node dist/index.cjs
Plan: Free tier
```

**4. Set Environment Variables**
```
Go to: Web Service → Environment
Add these variables:
  DATABASE_URL=<Your PostgreSQL connection string>
  NODE_ENV=production
  PORT=3000
  JWT_SECRET=<Generate a random string>
  GEMINI_API_KEY=<Your API key if needed>
```

**5. Deploy**
```
Click "Deploy" - takes ~2-3 minutes
Your app will be live at: https://your-app-name.onrender.com
```

---

### Option B: Deploy to Railway.app

Railway is another excellent option with similar ease of use.

**Steps:**
1. Go to https://railway.app/ and sign up with GitHub
2. Create new project → GitHub repo
3. Add PostgreSQL plugin
4. Set environment variables
5. Deploy!

---

### Option C: Deploy to Heroku (Paid, but widely used)

```bash
# Install Heroku CLI
# Then login
heroku login

# Create app
heroku create skill-navigator

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Push code
git push heroku main

# Run migrations
heroku run npm run db:push
```

---

### Option D: Self-Hosted (DigitalOcean / AWS / Linode)

If self-hosting, use this process:

**On your server:**

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Clone your repo
git clone <your-repo-url>
cd skill-navigator

# Install dependencies
npm install && cd client && npm install && cd ..

# Create .env file with production values
nano .env

# Run migrations
npm run db:push

# Build the app
npm run build

# Use PM2 or systemd to keep it running
npm install -g pm2
pm2 start "node dist/index.cjs"
pm2 save
pm2 startup
```

---

## 3️⃣ Building for Production

To create a production build locally:

```bash
npm run build
```

This creates:
- `dist/index.cjs` - Server bundle
- `dist/public/` - Frontend assets

Start the production server:

```bash
NODE_ENV=production node dist/index.cjs
```

---

## 4️⃣ Database Migrations

To apply schema changes:

```bash
npm run db:push
```

To view schema:

```bash
# Connect to your database
psql postgresql://user:password@host:port/database

# List tables
\dt

# Describe a table
\d table_name
```

---

## 📝 Troubleshooting

### Common Issues

**Port 5000 is already in use:**
```bash
# Windows - find and kill the process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

**Database connection error:**
- Check PostgreSQL is running: `sudo systemctl status postgresql`
- Verify `DATABASE_URL` is correct in `.env`
- Ensure the database exists: `createdb -U postgres learnai`

**Build fails:**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**Migrations fail:**
```bash
# Check database connection first
psql $DATABASE_URL

# Manually run migration if needed
npm run db:push
```

---

## 📞 Quick Support Checklist

Before deploying, ensure you have:
- [ ] Node.js 20+ installed: `node --version`
- [ ] PostgreSQL running
- [ ] `.env` file created with all required variables
- [ ] App builds successfully: `npm run build`
- [ ] Database migrations applied: `npm run db:push`

---

## 🎯 Next Steps After Deployment

1. **Set up custom domain** (if self-hosted)
2. **Configure HTTPS/SSL** (automatic on Render/Railway)
3. **Set up monitoring** (optional)
4. **Configure backups** for your PostgreSQL database
5. **Monitor logs** for any errors

---

**Start with Render or Railway - they're the easiest and free to begin! 🚀**

