# Implementation Plan

## Phase 1: Project Setup & Foundation

- [ ] 1.1 Initialize monorepo structure (`/client`, `/server`, `/shared`)
- [ ] 1.2 Set up Express.js server with TypeScript, ESM, linting (oxlint), and formatting (oxfmt)
- [ ] 1.3 Set up React client with Vite, TypeScript
- [ ] 1.4 Set up PostgreSQL with Prisma ORM and initial schema (users, sessions)
- [ ] 1.6 Docker Compose for local development (Postgres,server, client)
- [ ] 1.7 Environment config and shared types between client/server

## Phase 2: Authentication & User Management

- [ ] 2.1 Prisma schema: users table (id, email, password_hash, name, role: admin/agent)
- [ ] 2.2 Prisma schema: sessions table (id, token, user_id, expires_at)
- [ ] 2.3 Password hashing (bcrypt) and session token generation
- [ ] 2.4 Auth endpoints: POST `/auth/login`, POST `/auth/logout`
- [ ] 2.5 Session middleware — validate cookie, attach user to request
- [ ] 2.6 Seed script: create default admin on first deploy
- [ ] 2.7 Admin endpoints: CRUD agents (POST/GET/PATCH/DELETE `/users`)
- [ ] 2.8 Login page (frontend)
- [ ] 2.9 User management page — admin only (frontend)
- [ ] 2.10 Protected route wrapper and auth context (frontend)

## Phase 3: Ticket CRUD & Core UI

- [ ] 3.1 Prisma schema: tickets table (id, subject, body, status, category, created_at, updated_at)
- [ ] 3.2 Prisma schema: ticket_messages table (id, ticket_id, sender, body, created_at)
- [ ] 3.3 Ticket endpoints: POST `/tickets`, GET `/tickets`, GET `/tickets/:id`, PATCH `/tickets/:id`
- [ ] 3.4 Filtering and pagination on GET `/tickets` (by status, category, assigned agent)
- [ ] 3.5 Assign ticket to agent: PATCH `/tickets/:id/assign`
- [ ] 3.6 Ticket list page with filters and pagination (frontend)
- [ ] 3.7 Ticket detail page — conversation thread, status controls (frontend)
- [ ] 3.8 Agent reply form — send a response on a ticket (frontend)

## Phase 4: Email Integration

- [ ] 4.1 Inbound email webhook endpoint (SendGrid/Postmark parse)
- [ ] 4.2 Parse incoming email into ticket (extract subject, body, sender email)
- [ ] 4.3 Match reply emails to existing tickets (by thread ID or subject)
- [ ] 4.4 Outbound email — send agent/AI responses back to the student
- [ ] 4.5 BullMQ job: queue outbound emails (retry on failure)

## Phase 5: AI Features

- [ ] 5.1 Claude API integration — shared service with prompt helpers
- [ ] 5.2 Auto-classification: assign category to new tickets via Claude
- [ ] 5.3 BullMQ job: classify ticket on creation (async)
- [ ] 5.4 AI summary: generate a short summary for long ticket threads
- [ ] 5.5 AI-suggested reply: generate a draft response for agent review
- [ ] 5.6 Suggested reply UI — agent can accept, edit, or discard (frontend)
- [ ] 5.7 Summary display on ticket detail page (frontend)

## Phase 6: Knowledge Base & RAG

- [ ] 6.1 Enable pgvector extension in Postgres
- [ ] 6.2 Prisma schema: knowledge_articles table (id, title, content, embedding)
- [ ] 6.3 Embedding generation pipeline — chunk and embed articles via Claude/OpenAI embeddings
- [ ] 6.4 RAG retrieval: similarity search on ticket content to find relevant articles
- [ ] 6.5 Feed retrieved context into AI response generation prompts
- [ ] 6.6 Admin UI: manage knowledge base articles (CRUD) (frontend)

## Phase 7: Dashboard & Analytics

- [ ] 7.1 Dashboard endpoint: GET `/dashboard/stats` (open/resolved/closed counts, by category, by agent)
- [ ] 7.2 Dashboard page with summary cards and charts (frontend)
- [ ] 7.3 Ticket volume over time chart
- [ ] 7.4 AI accuracy/override tracking (did agent use, edit, or discard AI suggestion?)

## Phase 8: Deployment & Production

- [ ] 8.1 Multi-stage Dockerfile for server (build + runtime)
- [ ] 8.2 Multi-stage Dockerfile for client (build + nginx)
- [ ] 8.3 Production Docker Compose / Railway config
- [ ] 8.4 Database migrations strategy for production
- [ ] 8.5 Environment variables and secrets management
- [ ] 8.6 Health check endpoints
- [ ] 8.7 Seed default admin on first deploy
