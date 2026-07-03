# supabase/

Database schema and migrations for the CRM (Memory layer). Populated in **Phase IV – The Memory**.

## Conventions

- Migrations are managed with the Supabase CLI and live in `supabase/migrations/`.
- Every migration must be reversible.
- Schema follows snake_case with plural table names (see [docs/CONVENTIONS.md](../docs/CONVENTIONS.md)).
- Planned core tables (designed in Phase IV): `contacts`, `conversations`, `activities`, `drafts` — with audit columns (`created_at`, `updated_at`, actor) throughout.
