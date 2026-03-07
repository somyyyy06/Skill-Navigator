# ?? Skill Navigator - AI-Powered Learning Platform

An intelligent learning platform that generates personalized roadmaps for mastering tech skills, powered by Google Gemini AI. Track your progress with detailed analytics, access curated video resources, and leverage ML-driven insights for an optimized learning journey.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://github.com/somyyyy06/Skill-Navigator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-20+-green)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/postgresql-16-blue)](https://www.postgresql.org/)

## ? Key Features

- **?? AI-Powered Roadmap Generation** - Create custom learning paths using Google Gemini AI
- **?? Advanced Analytics** - Track time spent, progress metrics, and completion estimates  
- **?? Curated Video Resources** - Hand-picked YouTube tutorials for each learning step
- **?? Secure Authentication** - JWT-based user authentication with session management
- **?? ML-Driven Insights** - Predictive analytics for personalized learning recommendations
- **?? Modern UI** - Responsive interface built with React 18 and TailwindCSS
- **?? Fully Responsive** - Optimized experience across all devices

## ??? Tech Stack

**Frontend**
- React 18 with TypeScript
- Vite for blazing-fast builds
- TailwindCSS for styling
- Framer Motion for animations
- shadcn/ui component library

**Backend**
- Node.js + Express.js
- PostgreSQL 16 database
- Drizzle ORM
- JWT authentication

**AI/ML**
- Google Gemini 1.5 Flash
- TensorFlow.js for predictions

## ?? Quick Start

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js 20+** - [Download here](https://nodejs.org/)
- **PostgreSQL 16** - [Download here](https://www.postgresql.org/download/)
- **npm** (comes with Node.js)

### Step 1: Clone the Repository

```bash
git clone https://github.com/somyyyy06/Skill-Navigator.git
cd Skill-Navigator
```

### Step 2: Install PostgreSQL

#### Windows
1. Download PostgreSQL 16 from [official website](https://www.postgresql.org/download/windows/)
2. Run the installer and remember the password you set for the `postgres` user
3. Default port is `5432`

#### macOS
```bash
brew install postgresql@16
brew services start postgresql@16
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### Step 3: Create Database

Open PostgreSQL command line (psql) or pgAdmin and run:

```sql
CREATE DATABASE learnai;
CREATE USER crisis WITH PASSWORD 'crisis123';
GRANT ALL PRIVILEGES ON DATABASE learnai TO crisis;
```

Or use the PostgreSQL command line:

```bash
# Windows (Run as Administrator in Command Prompt)
psql -U postgres

# Mac/Linux
sudo -u postgres psql
```

Then execute the SQL commands above.

### Step 4: Configure Environment Variables

Copy the example environment file and update it with your credentials:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your credentials:

```env
# Database Configuration
DB_USER=crisis
DB_PASSWORD=crisis123
DB_NAME=learnai
DB_PORT=5432
DATABASE_URL=postgresql://crisis:crisis123@localhost:5432/learnai

# Server Configuration
NODE_ENV=development
PORT=5000
HOST=0.0.0.0

# JWT Secret (IMPORTANT: Change this to a random 32+ character string!)
JWT_SECRET=your-very-secure-random-secret-key-at-least-32-characters-long

# API Keys
# Get your Gemini API key from: https://ai.google.dev/
GEMINI_API_KEY=your-gemini-api-key-here

# CORS Configuration
CORS_ORIGIN=http://localhost:5000
```

**Important Notes:**
- Change `JWT_SECRET` to a secure random string (at least 32 characters)
- Get your `GEMINI_API_KEY` from [Google AI Studio](https://ai.google.dev/)
- Update `DB_PORT` if your PostgreSQL uses a different port (check your PostgreSQL installation)

### Step 5: Install Dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 6: Apply Database Migrations

Run the SQL migration files in order:

```bash
# Connect to your database
psql -U crisis -d learnai

# Or on Windows with full path
psql -U crisis -h localhost -d learnai
```

Then in the psql terminal, run each migration:

```sql
\i migrations/add_assessments_table.sql
\i migrations/add_ml_tracking_tables.sql
\i migrations/add_new_roadmaps.sql
\i migrations/add_order_column_to_steps.sql
\i migrations/update_backend_steps_videos.sql
\i migrations/update_frontend_steps_videos.sql
```

**Alternative:** Use Drizzle to push the schema:

```bash
npm run db:push
```

### Step 7: Start the Development Server

```bash
npm run dev
```

The application will start on:
- **Backend API:** http://localhost:5000
- **Frontend:** Served by backend at http://localhost:5000

Open your browser and navigate to http://localhost:5000 to see the application!

### Step 8: Create Your First Account

1. Click "Sign Up" on the landing page
2. Create an account with your email and password
3. Login and start exploring roadmaps!

## ?? Troubleshooting

### Common Issues

**1. Database Connection Error**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** 
- Ensure PostgreSQL is running: `pg_ctl status` or check Services on Windows
- Verify the `DATABASE_URL` in your `.env` file
- Check if PostgreSQL is using port 5432 or a different port

**2. Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution:**
- Change `PORT` in `.env` to a different port (e.g., `5001`)
- Or kill the process using port 5000

**3. Gemini API Error**
```
Error: Gemini API key is invalid
```
**Solution:**
- Get a valid API key from [Google AI Studio](https://ai.google.dev/)
- Update `GEMINI_API_KEY` in `.env`
- Restart the development server

**4. Migration Errors**
```
ERROR: relation "users" already exists
```
**Solution:**
- If using `npm run db:push`, you don't need to run SQL migrations manually
- Drop the database and recreate it if you want to start fresh:
```sql
DROP DATABASE learnai;
CREATE DATABASE learnai;
```

**5. Module Not Found Errors**
```
Cannot find module 'express'
```
**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
rm -rf client/node_modules client/package-lock.json
npm install
cd client && npm install && cd ..
```

## ?? Available Commands

## ?? Project Structure

```
skill-navigator/
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities and helpers
│   └── public/
├── server/              # Express.js backend
│   ├── routes.ts        # API endpoints
│   ├── db.ts            # Database configuration
│   ├── middleware/      # Auth middleware
│   └── ml/              # ML prediction models
├── shared/              # Shared TypeScript types
├── migrations/          # Database SQL migrations
├── .env.example         # Environment variables template
└── package.json         # Project dependencies
```

## ?? Core Functionality

### Roadmap Generation
Generate personalized learning roadmaps for various tech domains:
- Frontend Development (React, Vue)
- Backend Development (Node.js, Python)
- Database Design
- DevOps & Cloud
- Machine Learning
- And more...

### Progress Tracking
- Real-time progress monitoring
- Time tracking per learning step
- Attempt counting and analysis
- Completion predictions using ML

### Learning Resources
Each roadmap step includes:
- Detailed descriptions
- Curated video tutorials
- Practical implementation guides
- Estimated completion time

## ?? Deployment

For production deployment instructions to platforms like Render.com, Railway, and Heroku, see [DEPLOY.md](./DEPLOY.md).

**Production Build:**

```bash
# Build the application
npm run build

# Start production server
npm run start
```

Make sure to set `NODE_ENV=production` and use secure values for `JWT_SECRET` in production.

## ?? Available Commands

```bash
# Development
npm run dev          # Start development server (backend + frontend)
npm run build        # Build for production
npm run start        # Start production server
npm run check        # TypeScript type checking

# Database
npm run db:push      # Apply schema changes using Drizzle
```

## ?? Project Structure

## ?? Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## ?? License

This project is licensed under the MIT License.

## ?? Acknowledgments

- Google Gemini AI for intelligent roadmap generation
- The open-source community for amazing tools and libraries

---

**Built with ?? for learners everywhere**

[Report Bug](https://github.com/somyyyy06/Skill-Navigator/issues) � [Request Feature](https://github.com/somyyyy06/Skill-Navigator/issues)
