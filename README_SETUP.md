# LearnAI - AI-Powered Learning Platform

A full-stack web application that helps users learn through structured roadmaps with AI-powered guidance. Built with React, Express.js, PostgreSQL, and JWT authentication.

## 🌟 Features

- 📚 **Structured Learning Roadmaps** - Multiple learning paths (Backend, Frontend, AI, DevOps, etc.)
- 🔐 **Secure Authentication** - JWT-based login/registration with password hashing
- 📊 **Progress Tracking** - Track learning progress, streaks, and daily statistics
- 🎯 **Step-by-Step Learning** - Detailed learning steps with resources and estimated time
- 💾 **Persistent Data** - PostgreSQL database for reliable data storage
- 🌓 **Dark/Light Theme** - Beautiful UI with theme toggle

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/download)

---

## 🚀 Installation & Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Skill-Navigator-1
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up PostgreSQL Database

#### On Windows:

1. **Install PostgreSQL** from [postgresql.org](https://www.postgresql.org/download/windows/)
   - During installation, remember the password you set for the `postgres` user
   - Keep the default port (5432)

2. **Create the database**

Open PowerShell and run:

```powershell
psql -U postgres
```

Enter your PostgreSQL password when prompted, then run:

```sql
CREATE DATABASE learnai;
\q
```

#### On macOS:

```bash
# Install PostgreSQL via Homebrew
brew install postgresql@15
brew services start postgresql@15

# Create database
psql postgres
CREATE DATABASE learnai;
\q
```

#### On Linux (Ubuntu/Debian):

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql

# Create database
sudo -u postgres psql
CREATE DATABASE learnai;
\q
```

### Step 4: Configure Environment Variables

Create a `.env` file in the project root and add:

```env
DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/learnai
SESSION_SECRET=your_session_secret_key_change_this_in_production_12345678
JWT_SECRET=your_jwt_secret_key_change_this_in_production_87654321
OPENAI_API_KEY=your_openai_api_key
```

Replace:
- `YOUR_PASSWORD` - Your PostgreSQL password
- `JWT_SECRET` & `SESSION_SECRET` - Generate random strings for production

### Step 5: Initialize Database Schema

```bash
npm run db:push
```

This command creates all necessary tables in your PostgreSQL database.

### Step 6: Start Development Server

```bash
npm run dev
```

You should see:
```
serving on port 5000
```

Visit: **http://localhost:5000**

---

## 🔐 Authentication

The application uses JWT (JSON Web Token) authentication with secure password hashing.

### Creating an Account

1. Go to http://localhost:5000
2. Click **"Log in"** button
3. Click **"Create Account"**
4. Fill in:
   - Email (e.g., user@example.com)
   - Password (minimum 6 characters)
   - First Name
   - Last Name
5. Click **"Create Account"**
6. You'll be automatically logged in and redirected to the dashboard

### How JWT Works

- **Registration**: Password is hashed with bcryptjs and stored securely
- **Login**: Credentials verified, JWT token generated
- **Storage**: Token stored in browser's `localStorage`
- **Authentication**: All API requests include the JWT token in the `Authorization` header
- **Validation**: Backend verifies token on protected routes
- **Expiration**: Tokens expire after 7 days

---

## 📁 Project Structure

```
LearnAI/
├── client/                          # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   ├── pages/                   # Page components
│   │   │   ├── auth.tsx             # Login/Signup page
│   │   │   └── dashboard.tsx        # Main dashboard
│   │   ├── hooks/
│   │   │   └── use-auth.ts          # Auth state management
│   │   └── App.tsx                  # Main app component
│   └── index.html                   # HTML entry point
│
├── server/                          # Backend (Express.js)
│   ├── middleware/
│   │   └── jwtAuth.ts               # JWT verification middleware
│   ├── replit_integrations/
│   │   ├── auth/
│   │   │   ├── localAuth.ts         # Login/Register endpoints
│   │   │   └── routes.ts            # Auth route registration
│   │   └── chat/                    # AI chat features
│   ├── db.ts                        # Database connection
│   ├── routes.ts                    # API routes
│   └── index.ts                     # Server entry point
│
├── shared/                          # Shared code
│   ├── schema.ts                    # Database schema
│   ├── models/
│   │   └── auth.ts                  # Auth models
│   └── routes.ts                    # Route definitions
│
├── .env                             # Environment variables
├── package.json                     # Dependencies
├── tsconfig.json                    # TypeScript config
└── README.md                        # This file
```

---

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start development server
npm run check        # Type check TypeScript
```

### Database

```bash
npm run db:push      # Push schema changes to database
```

### Production

```bash
npm run build        # Build for production
npm start            # Run production server
```

---

## 🔌 API Endpoints

### Authentication

```
POST /api/auth/register
  → Create new user account
  
POST /api/auth/login
  → Authenticate user and get JWT token
  
GET /api/auth/user (protected)
  → Get current user profile
```

### Roadmaps

```
GET /api/roadmaps
  → Get all learning roadmaps
  
GET /api/roadmaps/:id
  → Get specific roadmap with steps
```

### Enrollments

```
GET /api/enrollments (protected)
  → Get user's enrolled roadmaps
  
POST /api/enrollments/:roadmapId/enroll (protected)
  → Enroll in a roadmap
```

---

## 🔒 Security Considerations

### Development ✅
- `.env` file with example secrets
- JWT tokens stored in localStorage
- Password hashing with bcryptjs (10 rounds)

### Production (Before Deploying) ⚠️

1. **Change Secrets**
   ```env
   JWT_SECRET=<generate-random-32-char-string>
   SESSION_SECRET=<generate-random-32-char-string>
   ```

2. **Use Managed Database**
   - Don't use local PostgreSQL
   - Use AWS RDS, Heroku Postgres, or similar service

3. **Enable HTTPS**
   - Use SSL/TLS certificates
   - Update cookie settings for secure transport

4. **Environment Setup**
   - Set `NODE_ENV=production`
   - Run `npm audit` and fix vulnerabilities

5. **Additional Security**
   - Add rate limiting on auth endpoints
   - Configure CORS properly
   - Set up logging and monitoring
   - Enable database backups

---

## 🐛 Troubleshooting

### PostgreSQL Connection Error

**Error**: `ECONNREFUSED 127.0.0.1:5432`

**Solution**:
- Verify PostgreSQL is installed and running
- Check if port 5432 is available
- Verify DATABASE_URL in .env matches your setup

**Windows**: Start PostgreSQL from Services app
**Mac**: `brew services start postgresql@15`
**Linux**: `sudo systemctl start postgresql`

### Database Schema Error

**Error**: `relation "users" does not exist`

**Solution**:
```bash
npm run db:push
```

### Dependencies Installation Error

**Error**: `npm ERR! code ERESOLVE`

**Solution**:
```bash
npm cache clean --force
npm install
```

### Port 5000 Already in Use

**Error**: `EADDRINUSE: address already in use :::5000`

**Solution**:

Windows:
```powershell
$env:PORT=3000; npm run dev
```

Mac/Linux:
```bash
PORT=3000 npm run dev
```

### JWT/Authentication Not Working

**Solution**:
1. Clear browser localStorage
2. Verify JWT_SECRET is set in .env
3. Restart dev server
4. Check browser console for errors

---

## 📚 Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component library
- **React Query** - Data fetching
- **Wouter** - Routing

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Drizzle ORM** - Database ORM
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Input validation

### DevOps
- **Node.js** - Runtime
- **npm** - Package manager
- **Docker** (optional) - Containerization

---

## 🚀 Deployment

### Deploy to Vercel (Frontend + Backend)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

### Deploy to Heroku

```bash
heroku login
heroku create your-app-name
git push heroku main
```

### Deploy to Your Own Server

1. Install Node.js and PostgreSQL
2. Clone repository
3. Set environment variables
4. Run `npm install` and `npm run build`
5. Run `npm start` on port 3000 or 5000

---

## 📝 Development Workflow

1. Create a feature branch
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make changes and test locally
   ```bash
   npm run dev
   ```

3. Type check
   ```bash
   npm run check
   ```

4. Commit and push
   ```bash
   git add .
   git commit -m "Add your feature"
   git push origin feature/your-feature
   ```

5. Create a Pull Request

---

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Support & Issues

If you encounter any issues:

1. Check the **Troubleshooting** section above
2. Review error messages in the terminal
3. Check browser console (F12) for client-side errors
4. Verify all environment variables are set correctly
5. Ensure PostgreSQL is running and database exists

---

## 📄 License

MIT License - Feel free to use this project for personal or commercial purposes.

---

## 🙋 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

## ✨ Features Coming Soon

- [ ] AI-powered learning recommendations
- [ ] Real-time progress notifications
- [ ] Community discussion forums
- [ ] Mobile app (React Native)
- [ ] Video content support
- [ ] Code playground integration
- [ ] Certification upon completion

---

**Happy Learning!** 🚀

For detailed technical information, see:
- `JWT_AUTH_DETAILS.md` - JWT implementation
- `SETUP_GUIDE.md` - Comprehensive setup guide
- `VERIFICATION_CHECKLIST.md` - Testing checklist
