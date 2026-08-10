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
3. Apply the Supabase migration from supabase/migrations/001_init_schema.sql.
4. Start the app with npm run dev.

## Supabase

Create a Supabase project and apply the SQL schema from supabase/migrations/001_init_schema.sql.

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
