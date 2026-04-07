---
name: Auth configuration patterns
description: Better Auth setup in helpdesk -- secret handling, session config, middleware chain, sign-up disabled
type: project
---

Better Auth with email/password, sign-up disabled, database sessions via Prisma adapter.

- Secret sourced from BETTER_AUTH_SECRET env var but NOT validated at startup (critical gap flagged 2026-04-07)
- Session: 7-day expiry, 1-day update age
- Auth handler mounted before express.json() (Better Auth parses its own body)
- requireAuth middleware converts Express headers to Headers via unsafe cast
- requireAdmin chains after requireAuth, checks req.user.role === "admin"
- Role is a custom additionalField with input:false (cannot be set via API)
- No rate limiting on auth endpoints (flagged 2026-04-07)

**Why:** Auth is the highest-value attack surface; these patterns inform all future route reviews.
**How to apply:** Every new route review should verify requireAuth/requireAdmin middleware. Watch for secret validation fix.
