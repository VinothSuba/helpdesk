# Helpdesk

Monorepo helpdesk app: `client/` (React + Vite), `server/` (Express 5), `shared/` (types).

## Stack

- **Runtime**: Bun (package manager + server runtime). Prisma CLI requires Node 22 (`nvm use 22`).
- **Server**: Express 5, Prisma 7, PostgreSQL (port 5433 via Docker)
- **Client**: React 19, Vite 6, react-hook-form
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
bun prisma/seed.ts                  # seed admin user
```

## Auth

- Better Auth config: `server/src/lib/auth.ts`
- Client auth: `client/src/lib/auth-client.ts`
- Sign-up is disabled (`disableSignUp: true`). Users are created via seed or admin API.
- Auth handler mounted **before** `express.json()` in `server/src/index.ts` (Better Auth parses its own body).
- Express 5 route: `app.all("/api/auth/*splat", ...)` — must use `*splat` not `*`.
- `requireAuth` middleware: `server/src/middleware/auth.ts`
- Default admin: `admin@helpdesk.com` / `admin123`

## Project Structure

```
client/src/
  lib/auth-client.ts    # Better Auth React client
  pages/LoginPage.tsx   # Sign-in form (react-hook-form)
  App.tsx               # Session-gated root component

server/src/
  lib/auth.ts           # Better Auth server config
  lib/db.ts             # Prisma client
  middleware/auth.ts     # requireAuth Express middleware
  types/express.d.ts    # Request type augmentation (user/session)
  routes/health.ts      # Health check endpoint
  index.ts              # Express app entry

server/prisma/
  schema.prisma         # User, Session, Account, Verification, Ticket, TicketMessage
  seed.ts               # Admin user seeder (uses Better Auth API)

shared/src/
  index.ts              # Shared TypeScript interfaces
```

## Environment Variables

Server `.env` (gitignored):

| Variable | Purpose |
|----------|---------|
| `PORT` | Server port (default 3001) |
| `CLIENT_URL` | CORS origin (default http://localhost:5173) |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Session signing secret (generate: `openssl rand -base64 32`) |
