# Conventions

Rules that keep this codebase maintainable by someone other than its author. Apply them from the first file onward.

## Naming

| Context | Convention | Example |
|---|---|---|
| Files & folders | kebab-case | `email-parser.ts`, `follow-up-watcher/` |
| n8n workflow exports | `NN-phase-name.json` (NN = phase number) | `02-messenger-gmail-intake.json` |
| Database (tables, columns) | snake_case, plural tables | `contacts`, `activity_logs.created_at` |
| TypeScript variables/functions | camelCase | `classifyEmail()` |
| TypeScript types/interfaces | PascalCase | `EmailClassification` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Environment variables | SCREAMING_SNAKE_CASE | `ANTHROPIC_API_KEY` |

## Folder rules

- `workflows/` — n8n JSON exports only. Every export is committed with credentials stripped (n8n does this by default — verify before committing).
- `services/` — TypeScript on Node 22. One service per folder with its own `package.json` only if it deploys independently; otherwise share a single package.
- `supabase/` — migrations via Supabase CLI (`supabase/migrations/`). Migrations must be reversible.
- `scripts/` — one-off setup/dev utilities; each script starts with a comment stating what it does and when to run it.
- `docs/` — living documents. Update the doc in the same PR as the change it describes.

## Git

- **Branches:** `main` is phase-gated — it only receives work that passed its phase review. Working branches: `claude/*` (AI sessions), `feature/*`, `fix/*`.
- **Commits:** imperative mood, concise subject, body explains *why* when non-obvious. One logical change per commit.
- **No secrets in git, ever.** `.env` is ignored; only `.env.example` (names + comments, no values) is committed.

## Code style (TypeScript)

- Strict mode (`"strict": true`); no `any` at module boundaries.
- Validate all external data (Claude output, webhook payloads) with a schema library (e.g. Zod) before use — parse, don't assume.
- Business logic lives in plain functions, separated from I/O, so it can be unit-tested without n8n or network access.
- Comment only what code can't say: constraints, invariants, links to decisions.

## AI-boundary rules

- Every Claude call has: a versioned prompt, an expected JSON schema, validation, a bounded retry, and a dead-letter path.
- Log token usage per call; keep costs observable (Phase VIII formalizes this).
- Never render or send AI output to a human/external channel without validation (and, for outbound email, human approval).

## Phase discipline (Sphere Method)

- Check `CONTEXT.md` for the current phase before starting work; don't build ahead of the gate.
- Log every significant decision in `docs/DECISIONS.md` with rationale.
- Run the Product Review Checklist (Sphere Method v2.1) before any release or phase exit.
- Update `CONTEXT.md` at the end of every working session.
