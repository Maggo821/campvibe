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

## Deployment

Deploy to Vercel and add the same environment variables in the Vercel project settings.
