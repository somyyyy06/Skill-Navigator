# ?? Skill Navigator - AI-Powered Learning Platform

An intelligent learning platform that generates personalized roadmaps for mastering tech skills, powered by Google Gemini AI. Track your progress with detailed analytics, access curated video resources, and leverage ML-driven insights for an optimized learning journey.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://github.com/somyyyy06/Skill-Navigator)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://www.docker.com/)

## ? Key Features

- **?? AI-Powered Roadmap Generation** - Create custom learning paths using Google Gemini AI
- **?? Advanced Analytics** - Track time spent, progress metrics, and completion estimates  
- **?? Curated Video Resources** - Hand-picked YouTube tutorials for each learning step
- **?? Secure Authentication** - JWT-based user authentication with session management
- **?? ML-Driven Insights** - Predictive analytics for personalized learning recommendations
- **?? Modern UI** - Responsive interface built with React 18 and TailwindCSS
- **?? Docker Ready** - Complete containerization for seamless deployment
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
- Google Gemini 3.5 Flash
- TensorFlow.js for predictions

**DevOps**
- Docker & Docker Compose
- Multi-stage builds for optimization

## ?? Quick Start

### Prerequisites

- Docker Desktop (v20.10+)
- Docker Compose (v2.0+)
- Node.js 20+ (for local development)

### Installation

```bash
# Clone the repository
git clone https://github.com/somyyyy06/Skill-Navigator.git
cd Skill-Navigator

# Copy environment template
cp .env.example .env

# Edit .env with your credentials:
# - Get GEMINI_API_KEY from https://ai.google.dev/
# - Generate a secure JWT_SECRET (32+ characters)
# - Configure database credentials

# Build and start with Docker
docker-compose build
docker-compose up -d

# Access the application
# Open http://localhost:5000
```

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Frontend: http://localhost:5173
# Backend: http://localhost:5000
```

## ?? Documentation

- **[Deployment Guide](./DEPLOY.md)** - Step-by-step deployment instructions for production

## ??? Project Structure

```
skill-navigator/
+-- client/              # React frontend
�   +-- src/
�   �   +-- components/  # Reusable UI components
�   �   +-- pages/       # Page components
�   �   +-- hooks/       # Custom React hooks
�   �   +-- lib/         # Utilities and helpers
�   +-- public/
+-- server/              # Express.js backend
�   +-- routes.ts        # API endpoints
�   +-- db.ts            # Database configuration
�   +-- middleware/      # Auth middleware
�   +-- ml/              # ML prediction models
+-- shared/              # Shared TypeScript types
+-- migrations/          # Database migrations
+-- Dockerfile           # Container configuration
+-- docker-compose.yml   # Docker orchestration
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

Deploy to production in minutes using Docker:

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d
```

For detailed deployment instructions including Render.com, Railway, and DigitalOcean, see [DEPLOY.md](./DEPLOY.md).

## ?? Available Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run check        # TypeScript type checking

# Docker
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f app        # View logs

# Database
npm run db:push                   # Apply schema changes
```

## ?? Environment Variables

Create a `.env` file with the following:

```env
DATABASE_URL=postgresql://user:password@localhost:5433/learnai
JWT_SECRET=your-secure-jwt-secret-min-32-chars
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=production
PORT=5000
CORS_ORIGIN=http://localhost:5000
```

**?? Security**: Never commit `.env` to version control

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
