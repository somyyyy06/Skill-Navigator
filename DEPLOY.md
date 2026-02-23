# 🚀 Deploy Your App - SIMPLE 15 MINUTE GUIDE

Choose ONE path. That's it. No more confusion.

---

## 🟢 BEST OPTION: Deploy to Render.com (Free HTTPS - 10 minutes)

### Why Render.com?
- ✅ **FREE tier available** (no credit card needed)
- ✅ **HTTPS automatic** (green lock in browser)
- ✅ **Easiest setup** (connect GitHub → set env → done)
- ✅ **No server management**
- ✅ **Works perfectly** for this project

### Steps:

**1. Create Account (1 min)**
```
Go to: https://www.render.com/
Sign up with GitHub (easier)
```

**2. Create Web Service (2 min)**
```
Click: New + → Web Service
Select: skill-navigator repository
Runtime: Docker
Plan: Free tier
Then: Create
```

**3. Add Environment Variables (2 min)**

In Render dashboard, go to **Environment** tab and add each line:

```
DATABASE_URL=postgresql://postgres:randompassword@localhost:5433/learnai
JWT_SECRET=your-super-secret-random-string
GEMINI_API_KEY=your-api-key-from-ai.google.dev
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://skill-navigator-xyz.onrender.com
```

**4. Deploy (3 min)**
- Click **Deploy**
- Wait 5-10 minutes for build
- Watch the build logs
- When ready, you get a live URL

**5. Test (2 min)**
```
Open: https://your-service-name.onrender.com
Create account and test!
```

✅ **DONE! Your app is LIVE with HTTPS!**

---

## 🟡 ALTERNATIVE: Test Locally First (5 minutes)

If you want to verify everything works before deploying:

```bash
# Build
docker-compose build

# Start
docker-compose up -d

# Open browser
http://localhost:5000

# Create test account and verify

# Stop
docker-compose down
```

Then follow the Render.com steps above.

---

## 🔴 ADVANCED: Deploy to DigitalOcean (Production Control - 20 min)

**If you want more control over your server:**

1. Sign up: https://www.digitalocean.com/
2. Create Droplet with "Docker on Ubuntu"
3. SSH into server:
   ```bash
   ssh -i ~/.ssh/key root@YOUR_IP
   ```
4. Inside server:
   ```bash
   apt-get update && apt-get install git -y
   cd /root
   git clone https://github.com/somyyyy06/Skill-Navigator.git
   cd Skill-Navigator
   
   # Create .env
   nano .env
   # Add: DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, etc
   
   # Deploy
   docker-compose build
   docker-compose up -d
   ```
5. Visit: `http://YOUR_DROPLET_IP:5000`

Cost: $4-5/month

---

## 🎯 RECOMMENDATION

**For you RIGHT NOW**: Use **Render.com**
- Easiest setup
- Free to start
- HTTPS included
- No server management
- Takes 10 minutes

**After you get comfortable**: Switch to DigitalOcean if you need more control or custom domain with SSL.

---

## ✅ Quick Checklist Before Deploy

- [ ] Git pushed to GitHub
- [ ] `.env` NOT in repo (check `.gitignore`)
- [ ] Project builds locally: `npm run build`
- [ ] Docker works: `docker-compose up` → `http://localhost:5000`
- [ ] You have Gemini API key ready

---

## 📘 If Something Goes Wrong

**App won't start?**
- Check logs: `docker-compose logs app`
- Verify `DATABASE_URL` is correct
- Ensure all env variables are set

**Database connection error?**
- Check PostgreSQL is running: `docker-compose ps`
- Verify database password in env

**Port already in use?**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <pid> /F

# Or use different port
```

---

**Pick Render.com and you're done in 15 minutes! 🎉**
