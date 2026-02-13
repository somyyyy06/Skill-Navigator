## Packages
recharts | For visualizing learning progress and statistics on the dashboard
framer-motion | For smooth page transitions and micro-interactions
date-fns | For formatting dates and calculating streaks
clsx | Utility for constructing className strings conditionally
tailwind-merge | Utility for merging Tailwind classes safely

## Notes
Authentication is handled via Replit Auth (use-auth.ts hook already exists).
Chat integration uses SSE (Server-Sent Events) at /api/conversations/:id/messages.
Tailwind config should be updated to include custom fonts if not already present, but index.css handles the CSS variables.

## Runtime / Platform Requirements

- Node: 18+ (Node 20 recommended)
- npm (or compatible package manager). Root uses `npm` scripts.
- Postgres: required if you run with persistent sessions / database features (`DATABASE_URL`).
- OpenAI API key (if using chat/ML features): `OPENAI_API_KEY`.

## Key Frontend Packages (high level)

- `recharts` — charts for dashboards
- `framer-motion` — animations and transitions
- `date-fns` — date formatting and utilities
- `clsx` — conditional classnames
- `tailwind-merge` — safe merging of Tailwind classes

## Notes & How to run (dev)

- This repository runs the server and serves the client via Vite middleware. From the project root run:

```
npm install
npm run dev
```

- The server will mount Vite in middleware mode and serve the client at the same port (see `server/index.ts` and `server/vite.ts`). There is no separate `client/package.json` — the root `package.json` manages dependencies and scripts.

## Environment variables (common)

- `DATABASE_URL` — Postgres connection string
- `SESSION_SECRET` — session signing secret
- `JWT_SECRET` — JWT signing secret (if used)
- `OPENAI_API_KEY` — OpenAI key for ML/chat integrations
- `PORT` — optional, defaults to 3000 or as configured

## Other notes

- To apply DB schema changes (Drizzle): `npm run db:push` (ensure `DATABASE_URL` set).
- Build (production): `npm run build` then `npm start` to run the bundled server.

If you'd like, I can expand this with exact `.env.example` keys and example values.

