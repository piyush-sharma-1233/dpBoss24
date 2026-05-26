# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run lint       # ESLint via next lint
npm run studio     # Open Prisma Studio (database browser)
npx prisma migrate dev   # Run database migrations
npx prisma generate      # Regenerate Prisma client (also runs on postinstall)
```

There are no automated tests in this project.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — PostgreSQL connection string
- `AUTH_SECRET` — NextAuth secret
- `AWS_REGION`, `S3_BUCKET_NAME` — AWS S3 for video uploads
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` — AWS credentials

## Architecture

**Next.js 14 App Router** app (no `src/` directory). Pages live in `app/`, shared components in `components/`, utilities in `lib/`.

### Domain

This is a Satta Matka result website ("dpboss24"). The core domain concept is a **LuckyNumber** — a single digit (0–9) recorded at a specific `time` slot on a `date`. Results are displayed as **jodiS** (two-digit pairs), where each jodi is formed by concatenating the digits from two consecutive time slots (e.g. 10:00 AM + 10:30 AM → jodi "XY"). The time slots are defined in `lib/times.ts` (24 slots from 10:00 AM to 9:30 PM in 30-min intervals).

### Data model (`prisma/schema.prisma`)

- **LuckyNumber** — `number` (single digit string), `date` (YYYY-MM-DD string), `time` (e.g. "10:00 AM"), `userId`
- **User** — `email`, `userName`, `password` (stored plain — not hashed), `id`
- **VideoLink** — `videoLink` (URL to S3 or YouTube), `userId`

Database: PostgreSQL, accessed via Prisma with the `@prisma/adapter-pg` driver (driver-adapters mode). The singleton client is at `lib/prisma.ts`.

### Auth (`auth.ts`, `auth.config.ts`, `middleware.ts`)

NextAuth v5 (beta) with credentials provider. Sessions use JWT strategy with 1-day expiry. Password comparison is plain-text (`password === user.password`). The session token carries `user.id` via custom JWT/session callbacks.

Route protection is handled in `middleware.ts`: public routes are `["/", "/login", "/charts", "/live-results"]`; all others require a session. The middleware matcher excludes `api/`, `_next/static`, `_next/image`, `favicon.ico`, and `assets/`.

### Server actions (`app/actions/action.ts`)

All database mutations and reads are implemented as Next.js Server Actions (`"use server"`). Key actions:
- `getLuckyNumbers(filter?)` — fetch results, optionally filtered by date
- `createLuckyNumber / editLuckyNumber / deleteLuckyNumber` — CRUD for results
- `getAllRowsByMonthYear(month, year)` — used by the charts page to fetch a full month
- `getAllVideoLinks()` — fetches video links and generates S3 presigned download URLs (7-day expiry)
- `doCredentialLogin / doLogout` — NextAuth wrappers

### Pages and components

| Route | Purpose |
|---|---|
| `/` | Home — live results (today's numbers + live stream) |
| `/charts` | Weekly chart — paired-row jodi table, week picker |
| `/add-results` | Protected — admin form to add/delete single-digit results |
| `/add-videos` | Protected — admin form to upload/manage video links |
| `/login` | Credentials login |

**LiveResult** (`components/Organisms/LiveResult/LiveResult.tsx`) is the main home component. It:
1. Fetches today's results on mount
2. Schedules a timer to fire at every :00 and :30 boundary (10 AM–9:30 PM) to refresh results and display a `Banner` animation for 60 seconds when a new number is available
3. Shows a live video stream embed (iframe) when no banner is animating
4. Renders `NumberRibbon` (horizontal scrolling strip) and `TableComponent` (jodi table)

**TableComponent** (`components/TableComponent/index.tsx`) renders the horizontal jodi table. It time-gates display: digits only appear after their scheduled time has passed (with 1-minute grace). The `currentResultTime` + `rollingComplete` props delay showing the most recently rolling result until the `Banner` animation finishes.

**Charts page** (`app/charts/page.tsx`) renders a weekly table where each day column shows paired rows: top digit, bottom digit, and a rowspan-2 jodi cell. Jodiys matching patterns in `redColour` array render in red; others in black.

### S3 video flow

Upload: client requests a presigned PUT URL from `/api/s3/presign` → uploads directly to S3 → saves the resulting S3 URL via `createVideoLink` server action.

Download/playback: `getAllVideoLinks()` converts stored S3 URLs to presigned GET URLs (7-day expiry) before returning them to the client.
