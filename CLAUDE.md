# Helpdesk

Monorepo helpdesk app: `client/` (React + Vite), `server/` (Express 5), `shared/` (types).

## Stack

- **Runtime**: Bun (package manager + server runtime). Prisma CLI requires Node 22 (`nvm use 22`).
- **Server**: Express 5, Prisma 7, PostgreSQL (port 5433 via Docker)
- **Client**: React 19, Vite 6, React Router 7, react-hook-form + Zod, shadcn/ui (Tailwind CSS 4)
- **Auth**: Better Auth with email/password (sign-up disabled), database sessions, Prisma adapter
- **Types**: Shared workspace package (`shared/`) for cross-boundary types

## Dev Commands

```bash
bun run dev            # start both server + client
bun run dev:server     # server only (port 3001)
bun run dev:client     # client only (port 5173)
docker compose up postgres -d  # start PostgreSQL
```

### Database (run from `server/`)

```bash
nvm use 22                          # required for Prisma CLI
npx prisma migrate dev --name <name>
npx prisma generate
npx prisma db push                  # sync schema without migration
SEED_ADMIN_PASSWORD=... SEED_AGENT_PASSWORD=... bun prisma/seed.ts  # seed users
```

## Auth

- Better Auth config: `server/src/lib/auth.ts` (validates `BETTER_AUTH_SECRET` at startup, fails if missing or < 32 chars)
- Client auth: `client/src/lib/auth-client.ts`
- Sign-up is disabled (`disableSignUp: true`). Users are created via seed or admin API.
- Auth handler mounted **before** `express.json()` in `server/src/index.ts` (Better Auth parses its own body).
- Express 5 route: `app.all("/api/auth/*splat", ...)` — must use `*splat` not `*`.
- `requireAuth` middleware: `server/src/middleware/auth.ts`
- `requireAdmin` middleware: chains after `requireAuth`, returns 403 for non-admin users
- Auth endpoints are rate-limited (20 requests per 15 min window via `express-rate-limit`).
- Default admin: `admin@helpdesk.com` (password set via `SEED_ADMIN_PASSWORD` env var)
- Default agent: `agent@helpdesk.com` (password set via `SEED_AGENT_PASSWORD` env var)

## Routing & Authorization

- **Client routing**: React Router (`BrowserRouter`) in `App.tsx`. Authenticated users see `NavBar` + routed pages; unauthenticated users see `LoginPage`.
- **Role-based routes**: `RequireRole` component wraps routes that need a specific role (redirects to `/` otherwise).
- **Nav visibility**: `NavBar` conditionally renders links based on `session.user.role` (e.g., Users link is admin-only).
- **Server protection**: Admin-only API routes use `requireAuth` + `requireAdmin` middleware chain.
- **Better Auth `role` field**: Custom field on user, not included in Better Auth's default session type. Access via cast: `(session.user as { role?: string }).role`.
- **Form validation**: Login uses Zod schema via `@hookform/resolvers/zod`. Import Zod as `zod/v4`.

## Project Structure

```
client/src/
  components/
    ui/                   # shadcn/ui components (Button, Input, Label, Card)
    NavBar.tsx            # Top nav bar (admin-only links gated by role)
    RequireRole.tsx       # Route guard — redirects if role doesn't match
  lib/auth-client.ts      # Better Auth React client
  lib/utils.ts            # cn() utility for Tailwind class merging
  pages/
    LoginPage.tsx         # Sign-in form (Zod + react-hook-form + shadcn)
    DashboardPage.tsx     # Dashboard (placeholder)
    UsersPage.tsx         # User management (admin-only, placeholder)
  App.tsx                 # BrowserRouter + session-gated routing
  index.css               # Tailwind CSS + theme variables

server/src/
  lib/auth.ts             # Better Auth server config
  lib/db.ts               # Prisma client
  middleware/auth.ts       # requireAuth + requireAdmin Express middleware
  types/express.d.ts      # Request type augmentation (user/session)
  routes/
    health.ts             # Health check endpoint
    users.ts              # GET /api/users (admin-only)
  index.ts                # Express app entry

server/prisma/
  schema.prisma           # User, Session, Account, Verification, Ticket, TicketMessage
  seed.ts                 # Admin user seeder (uses Better Auth API)

shared/src/
  index.ts                # Shared TypeScript interfaces
```

## Environment Variables

Server `.env` (gitignored):

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default 3001) |
| `CLIENT_URL` | CORS origin (default http://localhost:5173) |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Session signing secret, min 32 chars (generate: `openssl rand -base64 32`) |
| `SEED_ADMIN_PASSWORD` | Admin password for seed script |
| `SEED_AGENT_PASSWORD` | Agent password for seed script |

Client `.env` (gitignored):

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Server URL (default http://localhost:3001) |
