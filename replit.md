# LearnAI - AI-Powered Learning Roadmap Platform

## Overview

LearnAI is an AI-powered learning platform that provides structured learning roadmaps with progress tracking and AI mentorship. Users can explore curated roadmaps, enroll in learning paths, track daily progress, and receive guidance from an AI chatbot mentor. The platform uses Replit Auth for authentication and integrates OpenAI for the chat functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, built using Vite
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and data fetching
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style variant)
- **UI Components**: Radix UI primitives for accessibility, Framer Motion for animations
- **Charts**: Recharts for data visualization on the dashboard

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod schema validation
- **Build System**: Custom build script using esbuild for server, Vite for client
- **Session Management**: express-session with PostgreSQL store (connect-pg-simple)

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines all database tables
- **Key Tables**:
  - `users` and `sessions` for authentication
  - `roadmaps` and `steps` for learning content
  - `enrollments` and `progress` for user learning state
  - `dailyStats` for activity tracking
  - `conversations` and `messages` for AI chat history

### Authentication
- **Provider**: Replit Auth (OpenID Connect)
- **Implementation**: Passport.js with openid-client strategy
- **Session Storage**: PostgreSQL-backed sessions with 7-day TTL
- **Protected Routes**: `isAuthenticated` middleware guards API endpoints

### AI Chat Integration
- **Provider**: OpenAI via Replit AI Integrations
- **Streaming**: Server-Sent Events (SSE) for real-time chat responses
- **Storage**: Conversations and messages persisted to PostgreSQL
- **Voice Support**: Audio utilities available for voice chat (WebM/Opus recording, PCM16 playback)

### Project Structure
```
├── client/           # React frontend
│   └── src/
│       ├── components/  # UI components (chat, layout, shadcn/ui)
│       ├── hooks/       # Custom React hooks (auth, chat, roadmaps)
│       ├── pages/       # Page components (dashboard, roadmaps, learning)
│       └── lib/         # Utilities (queryClient, auth-utils)
├── server/           # Express backend
│   ├── replit_integrations/  # Auth, chat, audio, image modules
│   ├── routes.ts     # API route definitions
│   └── storage.ts    # Database operations
├── shared/           # Shared code between client/server
│   ├── schema.ts     # Drizzle database schema
│   ├── routes.ts     # API route contracts with Zod
│   └── models/       # Auth and chat model definitions
└── migrations/       # Drizzle database migrations
```

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Authentication
- **Replit Auth**: OAuth/OIDC provider using `ISSUER_URL` and `REPL_ID`
- **Session Secret**: `SESSION_SECRET` environment variable required

### AI Services
- **OpenAI API**: Accessed through Replit AI Integrations
  - `AI_INTEGRATIONS_OPENAI_API_KEY`: API key
  - `AI_INTEGRATIONS_OPENAI_BASE_URL`: Custom base URL for Replit proxy
- **Features Used**: Chat completions with streaming, image generation (gpt-image-1), speech-to-text

### Frontend Dependencies
- **shadcn/ui**: Pre-built accessible components (configured in `components.json`)
- **Radix UI**: Underlying primitive components
- **TanStack Query**: Data fetching and caching
- **Framer Motion**: Page transitions and animations
- **Recharts**: Dashboard analytics charts

### Development Tools
- **Vite**: Frontend dev server and bundler with HMR
- **esbuild**: Server-side bundling for production
- **drizzle-kit**: Database migration tool (`npm run db:push`)