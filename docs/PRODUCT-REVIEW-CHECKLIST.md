# Product Review Checklist

Sphere Method v2.1 review gate, adapted to this system. Run before **any release, delivery, or phase exit** (`/product-review`). A phase does not close with unchecked critical items.

## Security

- [ ] API keys in environment variables / n8n credential store — never hardcoded (see [SECRETS.md](SECRETS.md))
- [ ] All external inputs validated and sanitized (email bodies, webhook payloads, AI output)
- [ ] Authorization checks on every protected route / endpoint
- [ ] Rate limiting on public and auth endpoints
- [ ] SQL injection protection via parameterized queries / Supabase client
- [ ] Gmail OAuth scopes are minimum required for the current phase (read-only until Phase VII)

## Database

- [ ] Relationships defined with foreign keys
- [ ] Indexes on frequently queried columns (thread IDs, contact emails, draft status)
- [ ] Audit logs for sensitive data changes (actor + timestamp)
- [ ] Migrations are reversible
- [ ] N+1 queries identified and resolved

## Performance

- [ ] Pagination on all list endpoints
- [ ] Debounce on search/filter inputs (any UI surface)
- [ ] Caching strategy defined where needed
- [ ] Heavy tasks (AI calls, batch processing) run in background workflows, not request paths
- [ ] Assets optimized and lazy-loaded (any UI surface)

## Maintainability

- [ ] No duplicated code — DRY applied
- [ ] Business logic separated from I/O and n8n plumbing (see [CONVENTIONS.md](CONVENTIONS.md))
- [ ] Inline documentation on complex functions only (constraints, invariants)
- [ ] Consistent naming per conventions
- [ ] Another developer could maintain this from the docs alone

## UX (any human-facing surface: Slack messages, review queue, emails)

- [ ] Loading/progress feedback on async operations
- [ ] Error states with user-friendly messages
- [ ] Empty states handled gracefully
- [ ] Mobile responsiveness verified (if web UI)
- [ ] Accessibility basics checked (contrast, labels)

## AI

- [ ] Prompt injection risks addressed (email content is untrusted input — never let it steer instructions)
- [ ] Token costs monitored and bounded per call
- [ ] Model fallback strategy defined
- [ ] AI output schema-validated before storage, display, or send
- [ ] Context window managed efficiently (strip quoted threads, cap body sizes)
- [ ] **Human approval enforced before any outbound send** (Guardian gate)
