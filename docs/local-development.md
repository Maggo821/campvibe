# Local Development

1. Copy .env.example to .env.local.
2. Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
3. Run npm install.
4. Apply supabase/migrations/001_init_schema.sql in your Supabase SQL editor.
5. Optionally run supabase/seed.sql to import initial feature data.
6. Start the app with npm run dev.
