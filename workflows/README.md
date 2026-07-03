# workflows/

n8n workflow JSON exports live here. Populated from **Phase II – The Messenger** onward.

## Conventions

- File naming: `NN-phase-name.json`, where `NN` is the phase number — e.g. `02-messenger-gmail-intake.json`, `05-watcher-follow-up-digest.json`.
- Export from n8n via *Download* (or `n8n export:workflow`), commit the JSON as-is.
- **Before committing:** verify the export contains no credential values or private webhook URLs (n8n strips credentials by default — check the diff anyway; see [docs/SECRETS.md](../docs/SECRETS.md)).
- Re-export after every meaningful workflow change so git history tracks workflow evolution.
