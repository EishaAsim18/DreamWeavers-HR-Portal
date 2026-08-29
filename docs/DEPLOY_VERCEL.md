# Deploy the DreamWeavers HRMS frontend to Vercel

The frontend is a Vite single-page application. Its API and PostgreSQL database
are hosted separately on Railway.

## Vercel configuration

1. Import the repository into Vercel.
2. Set the root directory to `apps/web`.
3. Use `npm run build` as the build command and `dist` as the output directory.
4. Add this environment variable:

| Name | Value |
|---|---|
| `VITE_API_URL` | `https://hr-portal-api-production-3cf2.up.railway.app/api` |

The Groq key must not be added to Vercel or exposed through a `VITE_*` variable.
AI requests go through the authenticated Railway API, where `GROQ_API_KEY` is
stored as a server-side secret.

## Local frontend

Copy `apps/web/.env.example` to `apps/web/.env.local`, set `VITE_API_URL`, then:

```powershell
cd apps/web
npm ci
npm run dev
```

React Router rewrites are already configured in `apps/web/vercel.json`.
