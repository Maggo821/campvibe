# Vercel Deployment

1. Create a Vercel project for the CampVibe repository.
2. Add the environment variables from .env.example.
3. Configure the build command as npm run build.
4. Deploy the project.
5. Set up a Supabase project and apply migrations in order:
	- supabase/migrations/001_init_schema.sql
	- supabase/migrations/002_phase1_hardening.sql
	- supabase/migrations/003_storage_place_photos.sql
6. In Supabase Auth URL configuration, set:
	- Site URL = your production Vercel URL/custom domain
	- Redirect URL = /auth/callback for localhost and production domains
