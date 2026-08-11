# CampVibe

CampVibe is a mobile-first travel and vanlife companion for discovering, rating, and organizing overnight stays based on lived atmosphere rather than static campground data.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase + PostgreSQL
- Supabase Auth + Storage
- MapLibre GL JS
- PWA-ready structure

## Local Setup

1. Copy .env.example to .env.local and add your Supabase credentials.
2. Install dependencies with npm install.
3. Apply Supabase migrations in order:
	- supabase/migrations/001_init_schema.sql
	- supabase/migrations/002_phase1_hardening.sql
	- supabase/migrations/003_storage_place_photos.sql
4. Start the app with npm run dev.

### Supabase Setup (with your project)

1. Open Supabase project settings and copy:
	- Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
	- anon public key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
	- service role key -> `SUPABASE_SERVICE_ROLE_KEY` (server-only)
2. In .env.local replace `[YOUR-PASSWORD]` inside `DATABASE_URL` and `DIRECT_URL`.
3. Use `DIRECT_URL` for SQL migrations (session mode pooler, port 5432).
4. Keep `DATABASE_URL` for runtime DB clients that need transaction mode (port 6543).

Example migration via psql (PowerShell):

`$env:DIRECT_URL="postgresql://..."; psql $env:DIRECT_URL -f supabase/migrations/001_init_schema.sql`

`$env:DIRECT_URL="postgresql://..."; psql $env:DIRECT_URL -f supabase/migrations/002_phase1_hardening.sql`

`$env:DIRECT_URL="postgresql://..."; psql $env:DIRECT_URL -f supabase/migrations/003_storage_place_photos.sql`

Optional seed import:

`$env:DIRECT_URL="postgresql://..."; psql $env:DIRECT_URL -f supabase/seed.sql`

## Supabase

Create a Supabase project and apply both SQL migrations from supabase/migrations.

## Current Implementation Status

- Base app shell and mobile-first navigation
- Full initial Supabase schema and seed file
- Supabase auth wiring (sign up, sign in, sign out)
- Server-side Supabase client integration for App Router
- Place create step flow (initial functional version)
- Real place insert into table `places`
- My Places and Place Detail read from Supabase when available
- All requested V1 base routes scaffolded

## Auth Flow

1. Open `/profile`.
2. Register or sign in with email/password.
3. Create places via `/places/new`.
4. Stored places are shown in `/my-places`.

## Routes (current)

- `/`
- `/map`
- `/discover`
- `/my-places`
- `/my-places/[status]`
- `/places/new`
- `/places/[id]`
- `/places/[id]/edit`
- `/places/[id]/visit/new`
- `/places/[id]/nearby/new`
- `/trips`
- `/trips/[id]`
- `/profile`

## Deployment

Deploy to Vercel and add the same environment variables in the Vercel project settings.

Recommended auth settings in Supabase dashboard:

- Site URL: your Vercel production domain
- Redirect URLs: include:
	- http://localhost:3000/auth/callback
	- https://YOUR-PROJECT.vercel.app/auth/callback
	- your custom domain callback URL when available
