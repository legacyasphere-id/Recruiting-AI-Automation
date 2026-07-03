# messenger

Phase II service: turns a raw inbound email into validated, structured metadata.

## API

### `POST /classify`

Request (sent by the n8n intake workflow per Gmail message):

```json
{
  "message_id": "18c...",
  "thread_id": "18c...",
  "from": "Sarah Lee <sarah@acme.com>",
  "to": "you@yourdomain.com",
  "subject": "Interview scheduling",
  "body": "raw plain-text body",
  "received_at": "Tue, 1 Jul 2026 09:12:00 +0700"
}
```

Response `200`: `{ message_id, classification, model, prompt_version, usage }` where `classification` matches [`src/schema.ts`](src/schema.ts) (`intent`, `urgency`, `requires_reply`, `summary`, `contact`, `mentioned_dates`).

Errors: `400 invalid_request` (bad payload), `502 classification_failed` (Claude call or validation failed — n8n dead-letters the item).

### `GET /healthz`

Liveness + configured model.

## Behavior

- Quoted reply history and signatures are stripped before classification (`src/email-parser.ts`); bodies are capped at 20k chars.
- Claude is called with structured outputs (`messages.parse` + Zod schema) — output that doesn't validate never leaves the service.
- Email content is wrapped in `<email>` tags and treated as untrusted data (prompt-injection defense).
- The system prompt is cached (`cache_control: ephemeral`) to cut input cost across emails.

## Development

```bash
npm install
npm test          # vitest, no API key needed (client is mocked)
npm run dev       # tsx watch, needs ANTHROPIC_API_KEY
npm run build && npm start
```

Env: `ANTHROPIC_API_KEY` (required at runtime), `CLAUDE_MODEL` (default `claude-opus-4-8`), `CLASSIFIER_PORT` (default 8787), `CLASSIFIER_HOST`.
