# CLAUDE.md — Sphere Method Session Bootstrap

This repo runs on the **Sphere Method v2.1** (Legacya Sphere — Founder's Edition). Every AI session working here loads this file and follows it. It is the `/sphere-init` equivalent, always on.

## Project brief

- **Name:** Recruiting AI Automation
- **Type:** Internal Tool / Portfolio system (production quality, real integrations)
- **Owner:** Yoga — Legacya Sphere
- **Stack:** n8n + TypeScript (Node 22) · Claude API · Supabase · Gmail · Slack · Calendly
- **Current phase:** always check [CONTEXT.md](CONTEXT.md) — never assume.

## Methodology

The build follows the Engineering Handbook's 10 phases (Foundation → Legacy), executed with Sphere Method discipline. Mapping to the Sphere lifecycle:

| Sphere phase | Handbook phases |
|---|---|
| 0 Discovery / 1 Planning | I – The Foundation |
| 2 Design / 3 Development | II Messenger · III Oracle · IV Memory · V Watcher · VI Clockkeeper · VII Guardian |
| 4 Quality | VIII – The Blacksmith |
| 5 Release / 6 Operations | VIII–IX rollout |
| 7 Documentation | IX Archivist · X Legacy |

## Session rules (non-negotiable)

1. **Read [CONTEXT.md](CONTEXT.md) first.** It holds the current phase, decisions, and focus. Update it before the session ends.
2. **Check the current phase before suggesting next actions.** Do not build ahead of the phase gate — each phase requires owner approval before the next begins (decision D-004).
3. **Ask phase-appropriate questions before coding.**
4. **Log all major decisions** to [docs/DECISIONS.md](docs/DECISIONS.md) (ADR-lite: context → decision → consequences) and summarize in CONTEXT.md.
5. **Run the [Product Review Checklist](docs/PRODUCT-REVIEW-CHECKLIST.md)** before any release, delivery, or phase exit.
6. **Remind the owner of phase exit criteria** before moving forward.
7. **Follow [docs/CONVENTIONS.md](docs/CONVENTIONS.md)** for naming, git, and code style. **Never commit secrets** — [docs/SECRETS.md](docs/SECRETS.md).

## Phase commands

The owner may use these shorthands in any session:

| Command | Meaning |
|---|---|
| `/phase [n]` | Jump to / confirm a specific phase |
| `/phase-check` | Review exit criteria for the current phase |
| `/context.md` · `/context.md update` | Read / update project memory |
| `/product-review` | Run the full Product Review Checklist |
| `/architect` | Enter system architecture mode (see docs/ARCHITECTURE.md) |
| `/qa-check` | Pre-delivery quality check |
| `/founder-review` | Strategic product + business review |
| `/build [feature]` | Start building a specific feature (within the current phase) |
| `/doc [topic]` | Generate documentation for a topic |

## End-of-session ritual

Before ending any working session: update CONTEXT.md with what was accomplished, log decisions made, set **Current focus** to the next action, and flag open questions.
