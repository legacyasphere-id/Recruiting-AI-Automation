# services/

Custom TypeScript services — the code half of the hybrid architecture (decision D-001). Populated from **Phase III – The Oracle** onward.

## What belongs here

- Claude API calls: prompt construction, classification, summaries, draft replies
- JSON schema definitions and validation for every AI boundary (Zod)
- Business logic: business-day calculations, follow-up rules
- Unit tests alongside the code they test

## What does not belong here

- Integration plumbing (Gmail/Slack/Calendly triggers and sends) — that lives in n8n (`workflows/`)
- Database migrations — those live in `supabase/`

Runtime: TypeScript on Node 22, strict mode. See [docs/CONVENTIONS.md](../docs/CONVENTIONS.md).
