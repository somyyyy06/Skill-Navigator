# 🎓 Skill Navigator - AI-Powered Learning Platform

An intelligent learning platform that generates personalized AI roadmaps, tracks progress with detailed metrics, and provides video-based learning resources for various tech skills.

## 📋 Features

- **🤖 AI-Powered Roadmap Generation** - Generate custom learning paths using Google Gemini AI
- **📊 Learning Analytics** - Track time spent, attempts, progress, and estimated completion
- **🎬 Video-Based Learning** - Curated YouTube tutorials for each learning step
- **🔐 JWT Authentication** - Secure user authentication and session management
- **📈 ML-Powered Insights** - Machine learning predictions for personalized recommendations
- **🎨 Responsive UI** - Modern, gradient-based interface with TailwindCSS
- **🐳 Docker Ready** - Complete containerization for easy deployment
- **📱 Mobile Friendly** - Works seamlessly on desktop and mobile devices

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL 16 |
| **ORM** | Drizzle ORM |
| **AI/ML** | Google Gemini 3.5 Flash, TensorFlow.js |
| **Authentication** | JWT |
| **Package Manager** | npm |
| **Containerization** | Docker & Docker Compose |

## 📦 Prerequisites

### Option 1: Docker (Recommended)
- Docker Desktop (v20.10+)
- Docker Compose (v2.0+)
- Disk space: ~2GB

### Option 2: Local Development
- Node.js (v20+)
- npm (v10+)
- PostgreSQL (v16+)
- ~500MB disk space

## 🚀 Quick Start

### Using Docker (Recommended - 3 commands)

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/skill-navigator.git
cd skill-navigator

# 2. Setup environment
cp .env.example .env
# Edit .env with your API keys (see below)

# 3. Build and deploy
docker-compose build
docker-compose up -d

# Application will be available at http://localhost:5000
```

### Local Development Setup

```bash
# 1. Clone and install dependencies
git clone https://github.com/yourusername/skill-navigator.git
cd skill-navigator
npm install

# 2. Create environment file
cp .env.example .env

# 3. Make sure PostgreSQL is running on localhost:5433
# Edit .env with your database credentials

# 4. Start development server
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## 🔧 Environment Configuration

Copy `.env.example` to `.env` and add your values:

```env
# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@localhost:5433/learnai

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production

# AI/ML (Get from https://ai.google.dev/)
GEMINI_API_KEY=your_google_gemini_api_key_here

# Server Configuration
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

⚠️ **IMPORTANT**: Never commit `.env` to GitHub. It's already in `.gitignore`.

## 📚 Available Commands

### Development
```bash
npm run dev        # Start dev server (backend + frontend)
npm run build      # Build for production
npm run preview    # Preview production build locally
npm run check      # TypeScript type checking
```

### Docker
```bash
docker-compose up -d              # Start all services
docker-compose down               # Stop services
docker-compose logs -f app        # View application logs
docker-compose ps                 # Check running services
docker-compose restart            # Restart services
```

### Database
```bash
npm run db:push                   # Apply schema changes
```

## 🗂️ Project Structure

```
skill-navigator/
├── client/                        # React frontend (Vite)
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   ├── pages/                # Page components
│   │   ├── hooks/                # Custom React hooks
│   │   ├── lib/                  # Utilities & helpers
│   │   └── main.tsx              # Entry point
│   └── index.html
├── server/                        # Express.js backend
│   ├── index.ts                  # Server entry point
│   ├── routes.ts                 # API routes
│   ├── db.ts                     # Database initialization
│   ├── middleware/               # Authentication middleware
│   └── storage.ts                # Business logic
├── shared/                        # Shared code
│   ├── schema.ts                 # Database schema (Drizzle)
│   ├── models/                   # TypeScript interfaces
│   └── routes.ts                 # Route definitions
├── migrations/                    # SQL migrations
├── Dockerfile                     # Container configuration
├── docker-compose.yml            # Development services
├── docker-compose.prod.yml       # Production services
├── .env.example                  # Environment template
└── package.json
```

## 📖 Documentation

- **[DEPLOY.md](./DEPLOY.md)** - ⭐ **START HERE** - Simple 15-minute deployment guide
- **[QUICK_DEPLOYMENT_COMMANDS.md](./QUICK_DEPLOYMENT_COMMANDS.md)** - Copy-paste commands
- **[DOCKER_TROUBLESHOOTING.md](./DOCKER_TROUBLESHOOTING.md)** - Solutions to common issues

## 🚢 Deployment

### Quick Start (15 minutes)
See **[DEPLOY.md](./DEPLOY.md)** for step-by-step instructions.

**Best option for you:**
1. **Test locally** - Run `docker-compose up -d` and test at `http://localhost:5000`
2. **Deploy to Render.com** - Push to GitHub, connect Render, set environment variables, done! ✅

### Options:
- **Render.com (Recommended)** - Free tier, HTTPS included, easiest setup
- **DigitalOcean** - More control, production-grade ($4/month)
- **Local Docker** - For testing before cloud deployment

Full instructions in [DEPLOY.md](./DEPLOY.md) - takes just 15 minutes!

## 🐛 Troubleshooting

### Port already in use
```bash
# Windows PowerShell
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :5000
kill -9 <PID>
```

### Database connection error
```bash
# Verify PostgreSQL is running
docker-compose ps

# Check logs
docker-compose logs postgres

# Verify DATABASE_URL in .env
```

### Cannot connect to Gemini API
- Verify API key in `.env`
- Check quota at https://ai.google.dev/
- Ensure key has access to `generateContent` API

## 🔐 Security

⚠️ **Never commit `.env` file to version control**

Your `.gitignore` already includes:
- `.env`
- `.env.local`
- `.env.production`
- `node_modules/`
- `dist/`

### Production Security Checklist
- [ ] Change `JWT_SECRET` to a cryptographically random string
- [ ] Use HTTPS/SSL certificates
- [ ] Set `NODE_ENV=production`
- [ ] Use strong database passwords
- [ ] Enable PostgreSQL SSL connections
- [ ] Regular security audits: `npm audit`
- [ ] Keep dependencies updated: `npm update`
- [ ] Configure firewall rules
- [ ] Enable database backups

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support & Community

- 📧 **Email**: support@skillnavigator.com
- 💬 **GitHub Issues**: [Report bugs](https://github.com/yourusername/skill-navigator/issues)
- 📚 **Documentation**: [Full guides](./DOCKER_ONE_PAGE.md)

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Social learning features
- [ ] Peer code review
- [ ] Certification badges
- [ ] Advanced analytics
- [ ] CI/CD pipeline
- [ ] PostgreSQL replication (HA)
- [ ] Redis caching layer

## 📊 Project Statistics

- **Total Roadmaps**: 9+ learning paths
- **Video Resources**: 100+ curated tutorials
- **Learning Steps**: 150+ interactive lessons
- **Supported Skills**: JavaScript, TypeScript, React, Node.js, Database Design, and more

## ✨ Acknowledgments

- Google Gemini AI
- React and Node.js communities
- Docker for containerization
- PostgreSQL community

---

**Made with ❤️ for learners everywhere**

Last updated: February 2026 | [License](LICENSE) | [Issues](https://github.com/yourusername/skill-navigator/issues)
