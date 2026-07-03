# CONTEXT.md — Project Memory

> Sphere Method v2.1 session memory. Read this first at the start of every session; update it at the end (`/context.md update`).

## Project brief

- **Name:** Recruiting AI Automation
- **Type:** Internal Tool / Portfolio system (production quality, real integrations)
- **Owner:** Yoga — Legacya Sphere
- **Methodology:** Sphere Method v2.1 + Recruiting AI Automation Engineering Handbook (10 phases)
- **Stack:** n8n (orchestration) + TypeScript on Node 22 (AI logic) · Claude API · Supabase (Postgres) · Gmail · Slack · Calendly

## Current phase

**Phase I – The Foundation** — status: **implementation complete, awaiting owner approval to advance to Phase II.**

Phase I exit criteria: architecture documented, repo structure in place, conventions and secrets strategy written, README complete, approved by owner.

## Phase roadmap

| # | Phase | Focus | Status |
|---|---|---|---|
| I | The Foundation | Repo, architecture, conventions, secrets, README | 🟡 In review |
| II | The Messenger | Gmail trigger, parsing, AI classification | ⬜ Not started |
| III | The Oracle | Prompts, JSON schemas, validation, draft replies | ⬜ Not started |
| IV | The Memory | CRM schema, contacts, activities, audit trail | ⬜ Not started |
| V | The Watcher | Follow-up detection, Slack digest, business days | ⬜ Not started |
| VI | The Clockkeeper | Calendly, scheduling suggestions, conflict prevention | ⬜ Not started |
| VII | The Guardian | Approval workflow, review queue, draft lifecycle | ⬜ Not started |
| VIII | The Blacksmith | Retries, alerts, logging, idempotency, fallbacks | ⬜ Not started |
| IX | The Archivist | README, setup guide, workflow exports, Loom | ⬜ Not started |
| X | The Legacy | Portfolio, screenshots, diagrams, lessons learned | ⬜ Not started |

## Decision log (summary)

Full log with rationale: [docs/DECISIONS.md](docs/DECISIONS.md)

1. **D-001** — Orchestration: n8n + custom TypeScript code (hybrid)
2. **D-002** — CRM/data layer: Supabase (Postgres)
3. **D-003** — Nature: portfolio build with real integrations, production quality
4. **D-004** — Delivery: strict phase gating; each phase approved before the next begins
5. **D-005** — Sphere Method embedded as repo artifacts (CLAUDE.md bootstrap + review checklist)

## Current focus

- [x] Phase I deliverables created (structure, docs, env strategy)
- [ ] Owner reviews Phase I and approves via phase gate
- [ ] Next: Phase II – The Messenger (n8n Gmail trigger + parsing + classification workflow)

## Open questions

- Which Gmail account will be the production inbox (personal vs dedicated recruiting address)?
- Where will n8n run — n8n Cloud or self-hosted (VPS/Docker)? Affects webhook URLs and credential storage (see docs/SECRETS.md).
- Slack delivery target: incoming webhook to a single channel, or a Slack app with interactive approval buttons (relevant for Phase VII)?

## Session log

| Date | Summary |
|---|---|
| 2026-07-02 | Project initiated. Source docs ingested (Handbook Masterplan, Sphere Method v2.1). Stack decisions D-001…D-004 made. Phase I foundation built: repo structure, architecture docs, conventions, secrets strategy, README. |
| 2026-07-03 | PR #1 review feedback ("lean to the method"): Sphere Method embedded as repo artifacts — CLAUDE.md session bootstrap (session rules, phase commands, methodology mapping) and docs/PRODUCT-REVIEW-CHECKLIST.md (D-005). |
