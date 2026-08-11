# Local Development

1. Copy .env.example to .env.local.
2. Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
3. Run npm install.
4. Apply migrations in order:
	- supabase/migrations/001_init_schema.sql
	- supabase/migrations/002_phase1_hardening.sql
	- supabase/migrations/003_storage_place_photos.sql
5. Optionally run supabase/seed.sql to import initial feature data.
6. Start the app with npm run dev.
