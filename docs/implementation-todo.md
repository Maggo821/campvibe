# CampVibe Umsetzungs-TODO (Soll-Ist)

Stand: 2026-08-11

Legende:
- Erledigt: umgesetzt und im Code vorhanden
- Teilweise: Grundfunktion vorhanden, aber Spezifikation noch nicht komplett
- Offen: noch nicht oder nur als Platzhalter

## 1) Foundation und Infrastruktur

- Erledigt: Tech Stack mit Next.js App Router, TypeScript, Tailwind, Supabase, MapLibre, Vercel vorbereitet
- Erledigt: .env.example vorhanden ([.env.example](.env.example))
- Erledigt: README und lokale Setup-Doku vorhanden ([README.md](README.md), [docs/local-development.md](docs/local-development.md), [docs/vercel-deployment.md](docs/vercel-deployment.md))
- Erledigt: PWA-Grundlage mit Manifest, Robots, Sitemap vorhanden ([src/app/manifest.ts](src/app/manifest.ts), [src/app/robots.ts](src/app/robots.ts), [src/app/sitemap.ts](src/app/sitemap.ts))
- Teilweise: PWA vollstaendig (Install-UX, Caching/Offline-Strategie) noch nicht final

## 2) Datenbank und Security

- Erledigt: Kernschema inkl. geforderter Tabellen vorhanden ([supabase/migrations/001_init_schema.sql](supabase/migrations/001_init_schema.sql))
- Erledigt: Hardening, Trigger, Constraints, RLS-Nachschaerfung vorhanden ([supabase/migrations/002_phase1_hardening.sql](supabase/migrations/002_phase1_hardening.sql))
- Erledigt: Storage-Bucket und Policies fuer place photos vorhanden ([supabase/migrations/003_storage_place_photos.sql](supabase/migrations/003_storage_place_photos.sql))
- Erledigt: Delete-Policy fuer eigene Places erstellt ([supabase/migrations/004_places_delete_policy.sql](supabase/migrations/004_places_delete_policy.sql))
- Offen (Ops): Migration 004 im Supabase-Projekt ausfuehren

## 3) Auth und Multi-User-Basis

- Erledigt: Supabase Auth Flow und Callback vorhanden ([src/app/auth/callback/route.ts](src/app/auth/callback/route.ts), [src/components/auth/AuthPanel.tsx](src/components/auth/AuthPanel.tsx))
- Erledigt: User-gebundene Bewertungen/Status im Modell getrennt vom Place
- Teilweise: Gruppen-Features sind im Schema vorbereitet, aber UI/Flows noch nicht ausgebaut

## 4) Navigation, Shell, Mobile-First

- Erledigt: Bottom Navigation fuer Mobile ([src/components/layout/BottomNavigation.tsx](src/components/layout/BottomNavigation.tsx))
- Teilweise: Floating Action Button mit 3 Aktionen fehlt noch

## 5) Places (CRUD)

- Erledigt: Place anlegen per Step-Flow ([src/components/places/PlaceCreateWizard.tsx](src/components/places/PlaceCreateWizard.tsx), [src/app/places/new/actions.ts](src/app/places/new/actions.ts))
- Erledigt: Place lesen in Detail/My Places/Discover/Map
- Erledigt: Place bearbeiten inkl. strukturierter Felder ([src/app/places/[id]/edit/page.tsx](src/app/places/%5Bid%5D/edit/page.tsx), [src/components/places/PlaceEditForm.tsx](src/components/places/PlaceEditForm.tsx))
- Erledigt: Place loeschen fuer eigene Plaetze (Server Action + UI) ([src/app/places/[id]/edit/actions.ts](src/app/places/%5Bid%5D/edit/actions.ts))

## 6) Features

- Erledigt: Features als eigene Tabelle und N:N-Verknuepfung
- Erledigt: Auswahl in Create/Edit
- Teilweise: Eigene Features dynamisch vom User anlegen ist noch nicht als UI-Flow umgesetzt
- Teilweise: Restliche englische Begriffe im Bestand koennen je nach gespeicherten Altwerten noch auftauchen

## 7) Nearby Places

- Erledigt: Nearby Place anlegen und mit Place verknuepfen ([src/app/places/[id]/nearby/new/actions.ts](src/app/places/%5Bid%5D/nearby/new/actions.ts))
- Erledigt: Anzeige auf Place Detail
- Teilweise: Gruppierung nach Auf dem Platz / Fusslaeufig / Umgebung fehlt noch
- Teilweise: Nearby-Kategorien noch nicht durchgaengig in Deutsch gemappt

## 8) Ratings (Vibe, Environment, Visit)

- Erledigt: Place Vibe Ratings und Environment Ratings pro User
- Erledigt: Slider-/Rating-Eingaben fuer Place Create/Edit
- Teilweise: Visit Rating ist technisch angelegt, UX und Detailtiefe koennen noch erweitert werden

## 9) Visits

- Erledigt: Visit anlegen mit zentralen Feldern ([src/components/places/NewVisitForm.tsx](src/components/places/NewVisitForm.tsx), [src/app/places/[id]/visit/new/actions.ts](src/app/places/%5Bid%5D/visit/new/actions.ts))
- Erledigt: Visit-Liste auf Place Detail
- Teilweise: Erweiterte Visit-Rating-Facetten laut Vollspezifikation sind noch ausbaubar

## 10) Fotos

- Erledigt: Place-Fotos beim Anlegen hochladen
- Erledigt: Place-Fotos nachtraeglich in Edit hochladen/loeschen
- Teilweise: Visit-Fotos als eigener kompletter UI-Flow fehlen noch

## 11) Map und Discover

- Erledigt: MapLibre Karte mit Markern und Popup-Infos ([src/components/map/MapLibreMap.tsx](src/components/map/MapLibreMap.tsx))
- Teilweise: Map-Filter laut Vollspezifikation noch unvollstaendig (aktuell primär Status)
- Teilweise: Discover-Filter UI vorhanden, aber Radius/Umgebung/Vibe/Negative-Filter noch nicht vollstaendig
- Offen: Marker-Clustering vorbereitet, aber nicht implementiert

## 12) Home und My Places

- Teilweise: Home mit Headline und Quick Actions vorhanden, aber spezifizierte Sections noch nicht komplett differenziert (z. B. Zuletzt besucht, Unsere Favoriten separat)
- Erledigt: My Places und Status-Unterseiten vorhanden ([src/app/(app-shell)/my-places/page.tsx](src/app/(app-shell)/my-places/page.tsx), [src/app/(app-shell)/my-places/[status]/page.tsx](src/app/(app-shell)/my-places/%5Bstatus%5D/page.tsx))

## 13) Komponenten-Architektur gegen Zielbild

- Erledigt: PlaceCard, Map-Komponente, BottomNavigation, EmptyState
- Teilweise: Weitere gewuenschte Bausteine fehlen noch als eigene Komponenten (PlaceMarker, VibeSlider, RatingSlider, FeatureChip, StatusChip, NearbyPlaceCard, VisitCard, PhotoGallery, FloatingActionButton, FilterSheet)

## 14) Priorisierte Next Steps

1. Blocker zuerst: Migration 004 in Supabase ausfuehren und Delete-Ende-zu-Ende testen.
2. Vollstaendige Deutsch-Lokalisierung durchziehen (Nearby-Kategorien, Restlabels, ggf. Alt-Daten-Mapping in UI).
3. Discover + Map Filter auf Spezifikationsumfang bringen (Radius/Umgebung/Vibe/Negativfilter).
4. Nearby-Gruppierung auf Detailseite implementieren (Auf dem Platz/Fusslaeufig/Umgebung).
5. Visit-Fotos und erweiterte Visit-Rating-UX finalisieren.
6. Floating Action Button und fehlende UI-Komponenten extrahieren.
7. PWA Polishing (Installfluss, Caching-Strategie, Touch-Optimierungen und Tests).

## 15) Definition of Done fuer V1 privat

- Alle Kern-Flows funktionieren mit echter Supabase-DB: Create, Read, Update, Delete, Fotos, Status, Nearby, Visits.
- Keine offensichtlichen englischen UI-Reste mehr.
- Discover/Map Filter decken den spezifizierten Kernumfang ab.
- Security: RLS fuer alle relevanten Tabellen pruefbar aktiv, keine sensitiven Keys im Client.
- Mobile UX ohne Brueche in den Hauptflows (Anlegen, Bearbeiten, Finden, Merken).
