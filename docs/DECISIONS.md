# Decision Log

Lightweight architecture decision records. Newest at the bottom. Format: context → decision → consequences. Log anything a future maintainer would ask "why?" about.

---

## D-001 — Orchestration: n8n + custom TypeScript code (hybrid)

**Date:** 2026-07-02 · **Status:** Accepted

**Context:** The system is integration-heavy (Gmail, Slack, Calendly, cron) but has an AI core (prompts, schema validation, business rules) that must be testable and reviewable. Options considered: pure n8n, pure custom code, hybrid.

**Decision:** n8n handles triggers and third-party integrations; a thin TypeScript layer handles Claude calls, JSON validation, and business logic. n8n workflows are exported to `workflows/` for version control.

**Consequences:** Two runtimes to operate, but each does what it's best at. AI logic gets unit tests and types; integration plumbing stays visual and fast to change. Workflow exports become a portfolio artifact (Phase IX/X).

---

## D-002 — CRM / data layer: Supabase (Postgres)

**Date:** 2026-07-02 · **Status:** Accepted

**Context:** The Memory phase needs relational integrity (contacts ↔ conversations ↔ activities), an audit trail, and easy API access from both n8n and code. Options: Supabase, Airtable, Notion, self-hosted MySQL/Postgres.

**Decision:** Supabase — real Postgres with foreign keys and reversible migrations, auto-generated REST API, row-level security for any future client-facing surface.

**Consequences:** Automation-grade querying and integrity; slightly less "browseable" for non-technical users than Airtable (mitigable later with a simple view or the Supabase dashboard).

---

## D-003 — Nature: portfolio build with real integrations

**Date:** 2026-07-02 · **Status:** Accepted

**Context:** The system reconstructs a real client engagement. It could be a mock-driven demo or a live system.

**Decision:** Build to production quality against real accounts (own Gmail/Slack/Calendly), showcased as portfolio proof in Phase X.

**Consequences:** Real OAuth, real error paths, and real operational concerns from day one — slower than mocks but the result is credible. Security and approval flows are treated as production requirements, not demo props.

---

## D-004 — Delivery: strict phase gating

**Date:** 2026-07-02 · **Status:** Accepted

**Context:** The Engineering Handbook defines 10 phases, each ending with "approved before advancing." The Sphere Method's biggest failure mode is building ahead of validation.

**Decision:** No phase begins until the previous phase's exit criteria are met and the owner explicitly approves. Current phase is tracked in `CONTEXT.md`.

**Consequences:** Slower start, fewer rewrites. Every phase leaves documentation and a reviewable artifact behind.

---

## D-005 — Sphere Method embedded as repo artifacts

**Date:** 2026-07-03 · **Status:** Accepted

**Context:** PR #1 review feedback from the owner: "still lean to the method." The Sphere Method existed only implicitly in the docs; sessions could drift from it.

**Decision:** Embed the method as first-class files: `CLAUDE.md` (auto-loaded session bootstrap with session rules, phase commands, and the Handbook↔Sphere phase mapping) and `docs/PRODUCT-REVIEW-CHECKLIST.md` (the v2.1 review gate adapted to this system).

**Consequences:** Every AI session in this repo self-configures to the methodology without a manual `/sphere-init`. Phase gates and the review checklist become enforceable references, not tribal knowledge.

---

## D-006 — Messenger classifier as a standalone HTTP service, on Haiku 4.5

**Date:** 2026-07-03 · **Status:** Accepted

**Context:** Phase II needs the AI classification logic to be testable and typed (D-001 hybrid split). n8n must call it per email. Options for hosting: n8n Code node with inline logic, Supabase Edge Function, standalone HTTP service. Separately: which model to classify with. The first draft defaulted to `claude-opus-4-8`; owner review flagged that classification (intent/urgency/requires_reply/summary/contact extraction into a fixed schema) is a bounded, well-structured task better matched to a smaller model, with Opus/Fable-tier reasoning reserved for Phase III's generative draft-reply work.

**Decision:** A small Fastify service (`services/messenger`) exposing `POST /classify`. Claude is called with the API's structured-outputs feature (`messages.parse` + Zod v4 schema). Default model is **`claude-haiku-4-5`**, overridable via `CLAUDE_MODEL` for a harder classification workload if one emerges. Adaptive thinking (`thinking: {type: "adaptive"}`) is only sent for models that support it (Opus 4.6+/Sonnet 4.6+/Fable 5) — Haiku 4.5 doesn't, so it's omitted whenever `CLAUDE_MODEL` resolves to a Haiku model, avoiding a 400. No sampling params. Email content is treated as untrusted data (prompt-injection defense in the system prompt). Failures return HTTP 502 so n8n routes them to the dead-letter output.

**Consequences:** The AI boundary has unit tests (mocked client, including a case per model tier) — including confirming Haiku output still validates against the Zod schema — strict validation, and versioned prompts. Lower per-classification cost and latency at inbox volume than Opus. One extra process to host next to n8n (deploy target decided before Phase V/VI). Note: the SDK's `zodOutputFormat` helper requires Zod v4 — Zod v3 schemas fail at runtime. **Open follow-up:** the Haiku swap has not yet been validated against a real Claude API call (no `ANTHROPIC_API_KEY` was available in the build environment) — only the mocked test suite. Live accuracy validation happens during the Phase II end-to-end pass (see CONTEXT.md).
