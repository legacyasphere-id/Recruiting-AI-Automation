# scripts/

Setup and development utility scripts.

## Conventions

- Each script begins with a header comment: what it does, when to run it, what it needs from `.env`.
- Scripts read secrets from the environment — never hardcode credentials (see [docs/SECRETS.md](../docs/SECRETS.md)).
- Keep scripts idempotent where possible: running one twice should not corrupt state.
