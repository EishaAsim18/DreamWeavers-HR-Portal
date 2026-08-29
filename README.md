# DreamWeavers HRMS

A responsive HR portal with employee management, daily attendance, tasks,
calendar, teams, documents, reports, administration, notifications, settings,
profile management, and an authenticated AI assistant.

## Current deployment

- API: `https://hr-portal-api-production-3cf2.up.railway.app/api`
- Health check: `https://hr-portal-api-production-3cf2.up.railway.app/api/health`
- PostgreSQL: Railway-managed database in the same private project network
- Administrator email: `dweavers788@gmail.com`

The deployment password and all service keys are environment secrets and are
not stored in this repository.

## Tech stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS, TanStack Query,
  React Router, Framer Motion, Recharts, FullCalendar, and Three.js
- Backend: Node.js, Express, TypeScript, JWT, Zod, and bcrypt
- Database: PostgreSQL with Prisma ORM and migrations
- Hosting: Railway for API/database; the Vite frontend can run locally or on
  any static host such as Vercel

## Run locally

Requirements: Node.js 20 or newer.

```powershell
npm ci
npm run db:generate
npm run build

cd apps/web
npm ci
npm run dev
```

Copy the provided `.env.example` files to `.env`/`.env.local` and fill in your
own values. Never commit the resulting environment files.

## Important environment variables

The API uses `DATABASE_URL`, `JWT_SECRET`, `CORS_ORIGIN`, `ADMIN_EMAIL`,
`SEED_ADMIN_EMAIL`, `SEED_DEFAULT_PASSWORD`, and optional `GROQ_API_KEY`.
The frontend uses only `VITE_API_URL`.

## Verification

```powershell
npm run build

cd apps/web
npm run lint
npm run build
```

See `docs/DEPLOY_VERCEL.md` for static frontend deployment instructions.
