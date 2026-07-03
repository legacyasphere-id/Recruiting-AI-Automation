# Phase II — Live End-to-End Runbook

This is the exit-criteria pass for Phase II. It has to run on your own machine/n8n instance — a remote build container can't complete a Gmail OAuth consent flow or host a persistent n8n install, so this step was never going to run inside the session that built the code.

## 1. Run the Messenger service

```bash
cd services/messenger
npm install
export ANTHROPIC_API_KEY=sk-ant-...   # your key
npm run build && npm start
# → listening on :8787; confirm with: curl localhost:8787/healthz
```

`GET /healthz` should return `{"status":"ok","model":"claude-haiku-4-5"}`.

## 2. Import the workflow into n8n

1. n8n → **Workflows → Import from File** → select `workflows/02-messenger-gmail-intake.json`.
2. Open the **Gmail Trigger** node → create/select a Gmail OAuth2 credential scoped to the dedicated recruiting inbox, **read-only** scope (`gmail.readonly`) — see `docs/SECRETS.md` for why OAuth lives in n8n's credential store, not `.env`.
3. Open the **Classify Email** node → set the `CLASSIFIER_URL` environment variable on your n8n instance (or edit the node's URL directly) to point at the running service, e.g. `http://localhost:8787` (or wherever it's reachable from n8n).
4. Save and activate the workflow.

## 3. Golden path

Send yourself one real, realistic recruiting email to the connected inbox (e.g. a recruiter-outreach or interview-scheduling message). Confirm in the n8n execution log:

- [ ] Gmail Trigger fires and the raw message reaches **Prepare Payload**
- [ ] **Classify Email** returns `200` with a `classification` object matching the schema in `services/messenger/src/schema.ts`
- [ ] `intent`, `urgency`, `requires_reply` look correct for the email you sent
- [ ] The **Requires Reply?** branch routes to the correct placeholder (draft pipeline vs CRM) based on `requires_reply`

## 4. Failure path (dead-letter)

Force a bad input to confirm the error branch — easiest is to temporarily point `CLASSIFIER_URL` at a wrong port/host, or stop the service, then re-trigger on a test email (or use n8n's "Execute Node" on **Classify Email** with a manually crafted item missing `body`).

- [ ] **Classify Email** returns non-2xx (400 for a malformed payload, or a connection error if the service is down)
- [ ] Execution routes to **Dead Letter (Phase VIII: alert)** cleanly, not to **Requires Reply?**
- [ ] Restore `CLASSIFIER_URL` / restart the service afterward

## 5. Haiku accuracy spot-check (D-006 follow-up)

D-006 swapped the default model from Opus to `claude-haiku-4-5` for cost/latency, but that swap has only been validated against the mocked test suite — not a real API call. While running the golden path above, eyeball the classification output against 2–3 real emails of different types (a recruiter cold-outreach, an interview-scheduling message, a rejection or follow-up) and confirm:

- [ ] `intent` matches your own read of the email
- [ ] `contact.name` / `contact.company` are extracted correctly (or `null` when genuinely absent — not hallucinated)
- [ ] `summary` is accurate and not vague/generic
- [ ] `mentioned_dates` captures anything date/time-related in the email

If Haiku's output is noticeably weaker on any of these, that's the point to bump `CLAUDE_MODEL` back to `claude-sonnet-5` or `claude-opus-4-8` before merging — the code already supports either via the env var, no further changes needed.

## 6. Report back

Once the golden path, the dead-letter path, and the Haiku spot-check are all clean: tell me and I'll merge PR #2. If anything looks off, flag it and I'll fix before merge.
