# Recruiting AI Automation

Production-quality recruiting inbox automation with a human in the loop. Incoming recruiting emails are classified by Claude, logged into a Supabase CRM, watched for stale follow-ups, matched against Calendly availability, and answered with AI-drafted replies — **nothing is sent without human approval**.

Built by [Yoga P. Effendi](https://github.com/legacyasphere-id) — Legacya Sphere. Developed with the Sphere Method v2.1 and the Recruiting AI Automation Engineering Handbook.

## How it works

```
Gmail inbox ──▶ n8n trigger ──▶ Claude classification (strict JSON)
                                      │
                                      ▼
                             Supabase CRM (contacts, activities, audit)
                                      │
              ┌───────────────────────┼──────────────────────┐
              ▼                       ▼                      ▼
      Follow-up Watcher       Calendly availability    AI draft reply
      (Slack digest)                                         │
                                                             ▼
                                              Human approval queue ──▶ send
```

Full detail: [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)

## Stack

| Layer | Choice |
|---|---|
| Orchestration | n8n (triggers, integrations) + TypeScript services (AI logic) |
| AI | Claude API — classification, summaries, draft replies |
| CRM / Database | Supabase (Postgres) |
| Integrations | Gmail, Slack, Calendly |

## Phase roadmap

The build follows a 10-phase plan; each phase is documented, implemented, tested, and approved before the next begins.

| # | Phase | Focus | Status |
|---|---|---|---|
| I | The Foundation | Repo, architecture, conventions, secrets strategy | ✅ In review |
| II | The Messenger | Gmail trigger, parsing, AI classification | ⬜ Planned |
| III | The Oracle | Prompt engineering, JSON schemas, draft replies | ⬜ Planned |
| IV | The Memory | CRM schema, contacts, activities, audit trail | ⬜ Planned |
| V | The Watcher | Follow-up detection, Slack digest, business-day logic | ⬜ Planned |
| VI | The Clockkeeper | Calendly integration, scheduling suggestions | ⬜ Planned |
| VII | The Guardian | Approval workflow, review queue, draft lifecycle | ⬜ Planned |
| VIII | The Blacksmith | Retries, alerts, logging, idempotency | ⬜ Planned |
| IX | The Archivist | Docs, setup guide, workflow exports | ⬜ Planned |
| X | The Legacy | Portfolio, screenshots, deployment, lessons learned | ⬜ Planned |

## Repository layout

| Path | Purpose |
|---|---|
| [`CONTEXT.md`](CONTEXT.md) | Project memory — current phase, decisions, next actions |
| [`docs/`](docs/) | Architecture, conventions, secrets strategy, decision log |
| [`workflows/`](workflows/) | n8n workflow JSON exports (Phase II+) |
| [`services/`](services/) | TypeScript services — classification, schemas (Phase III+) |
| [`supabase/`](supabase/) | Database migrations and schema (Phase IV) |
| [`scripts/`](scripts/) | Setup and development utility scripts |

## Getting started

1. Copy `.env.example` to `.env` and fill in your credentials (see [docs/SECRETS.md](docs/SECRETS.md) — never commit `.env`).
2. Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the system design.
3. Check [CONTEXT.md](CONTEXT.md) for the current phase and focus.

A full setup guide ships in Phase IX.

## License

[MIT](LICENSE) © 2026 Yoga P. Effendi
