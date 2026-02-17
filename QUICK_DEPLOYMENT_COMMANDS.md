# ⚡ Quick Deployment Commands

See [DEPLOY.md](./DEPLOY.md) for full guide. Here are the commands:

## 🟡 Local Docker Test (5 min)

```bash
docker-compose build
docker-compose up -d
# Open: http://localhost:5000
docker-compose down
```

## 🟢 Deploy to Render.com (10 min - BEST OPTION)

1. Sign up: https://www.render.com/ (connect GitHub)
2. New Web Service → Connect skill-navigator
3. Set env vars (DATABASE_URL, JWT_SECRET, GEMINI_API_KEY, etc)
4. Click Deploy
5. Wait 5-10 min → Get live URL with HTTPS ✅

## 🟠 Deploy to DigitalOcean (20 min)

```bash
# On DigitalOcean droplet:
apt-get update && apt-get install git -y
git clone https://github.com/YOUR_USERNAME/skill-navigator.git
cd skill-navigator
nano .env  # Add credentials
docker-compose build
docker-compose up -d
# Visit: http://YOUR_DROPLET_IP:5000
```

---

**Start with Render.com - easiest path! 👉 [DEPLOY.md](./DEPLOY.md)**
