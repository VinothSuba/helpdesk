# Tech Stack

## Frontend

| Layer | Choice |
|-------|--------|
| Framework | React (Vite) |
| UI | shadcn/ui + Tailwind CSS |
| State/Fetching | TanStack Query |
| Routing | React Router |

## Backend

| Layer | Choice |
|-------|--------|
| API | Express.js (TypeScript) |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | Database sessions (cookie-based, sessions table in Postgres) |
| Background Jobs | BullMQ + Redis |

## AI

| Layer | Choice |
|-------|--------|
| LLM | Claude API (Anthropic SDK) |
| Knowledge Base | RAG with pgvector |

## Email

| Layer | Choice |
|-------|--------|
| Inbound/Outbound | SendGrid or Postmark |

## Infrastructure

| Layer | Choice |
|-------|--------|
| Containerization | Docker (multi-stage builds) |
| Hosting | Railway or AWS (ECS/Fargate) |
| Database Hosting | Railway Postgres or AWS RDS |
