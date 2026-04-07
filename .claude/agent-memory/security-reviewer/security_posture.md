---
name: Baseline security posture
description: Key security gaps identified in initial comprehensive review (2026-04-07)
type: project
---

Initial review found 13 issues (2 critical, 4 high, 4 medium, 3 low). Key gaps:

- No BETTER_AUTH_SECRET validation at startup (critical)
- Hardcoded weak passwords in seed script (critical)
- No rate limiting on any endpoints
- No security headers (helmet not installed)
- No global error handler
- Health endpoint leaks user count and logs full errors
- Client auth baseURL hardcoded to localhost
- better-auth not pinned as server dependency
- senderType on TicketMessage is String not enum

**Why:** Establishes the baseline so future reviews can track remediation progress.
**How to apply:** On subsequent reviews, check if these have been addressed. Avoid re-flagging fixed issues.
