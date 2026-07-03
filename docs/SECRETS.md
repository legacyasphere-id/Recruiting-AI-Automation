# Secrets & Environment Strategy

How credentials are stored, who consumes them, and what never touches git.

## The rule

**No secret value is ever committed.** Git holds only `.env.example` — variable names and comments. Real values live in exactly two places:

| Store | Holds | Consumed by |
|---|---|---|
| **n8n credential store** (encrypted with `N8N_ENCRYPTION_KEY`) | OAuth-based integrations: Gmail OAuth2, Slack, Calendly connections created inside n8n | n8n workflow nodes |
| **`.env` file** (local / host environment, git-ignored) | API keys consumed by code: Claude, Supabase; plus n8n's own encryption key | TypeScript services in `services/`, scripts |

Why the split: OAuth flows (Gmail especially) are painful to manage by hand — n8n handles token refresh and stores tokens encrypted. Plain API keys are simpler and belong with the code that uses them, injected via environment.

## Environment variables

Canonical list lives in [`.env.example`](../.env.example). Summary:

| Variable | Used by | Notes |
|---|---|---|
| `ANTHROPIC_API_KEY` | services | Claude API — classification, drafts |
| `SUPABASE_URL` | services, n8n | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | services (server-side only) | Full-access key — never ship to a browser |
| `SUPABASE_ANON_KEY` | future client surfaces | Safe for client use with RLS enabled |
| `SLACK_WEBHOOK_URL` | n8n / services | Digest + review notifications channel |
| `CALENDLY_API_TOKEN` | n8n / services | Personal access token for availability lookups |
| `N8N_ENCRYPTION_KEY` | n8n host | Encrypts the n8n credential store — back it up; losing it orphans all stored credentials |
| `TZ` | everywhere | Business-day logic (Watcher) depends on a consistent timezone, e.g. `Asia/Jakarta` |

## Practices

1. **Rotation:** rotate any key on suspicion of exposure, on collaborator offboarding, and routinely (quarterly is fine at this scale). Rotation steps per provider get documented in Phase IX's setup guide.
2. **Least privilege:** the Gmail OAuth scope should be the minimum needed per phase — read-only until Phase VII introduces sending.
3. **Separation:** if/when a real client instance exists, it gets its own Supabase project, Gmail credentials, and n8n instance — no shared secrets between portfolio and client environments.
4. **Verification before commit:** n8n exports strip credentials by default, but eyeball every `workflows/*.json` diff for tokens/URLs before committing.
5. **Backups:** `N8N_ENCRYPTION_KEY` and the `.env` file are backed up in a password manager (not in the repo, not in cloud notes).

## If a secret leaks

1. Rotate the key at the provider immediately.
2. If it was committed: rotate first, then purge from git history (`git filter-repo`), then force-push — and assume the old value is public forever regardless.
3. Log the incident and the fix in `docs/DECISIONS.md`.
