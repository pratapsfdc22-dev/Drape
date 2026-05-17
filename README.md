# Drape — Your AI Personal Stylist

ARIA (AI Recommendation & Image Analyst) analyzes your photo and curates 3 complete outfit recommendations tailored to your body type, skin tone, and occasion — with real brands, real prices, and direct shopping links.

**Live:** [get-drape.com](https://get-drape.com)

---

## Project Overview

Drape is a privacy-first AI styling app. Users upload a photo, choose an occasion, and receive a full style profile from ARIA — powered by Claude's vision capabilities. No image is ever stored: photos are processed in server RAM and discarded the moment analysis completes.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  React + Vite + Tailwind + Framer Motion         │
│  Hosted on Vercel (get-drape.com)                │
└────────────────────┬────────────────────────────┘
                     │ HTTPS (multipart/form-data)
                     ▼
┌─────────────────────────────────────────────────┐
│              Express API Server                  │
│  Hosted on Railway (api.get-drape.com)           │
│                                                  │
│  1. Multer receives photo → stores in RAM only   │
│  2. Sharp resizes image → stays in RAM           │
│  3. Sends base64 to Claude API                   │
│  4. Nulls buffer immediately after               │
│  5. Returns JSON outfit recommendations          │
└──────────┬──────────────────────┬───────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐   ┌─────────────────────────┐
│  Anthropic API   │   │       Supabase           │
│  Claude vision   │   │  Auth + session logs     │
│  (analysis only) │   │  (no image data, ever)   │
└──────────────────┘   └─────────────────────────┘
```

---

## Privacy Architecture

Photos are **never stored**. The full lifecycle:

1. User selects a photo in the browser (held in `URL.createObjectURL` in browser memory)
2. On submit, sent via HTTPS to the Express server
3. Multer's `memoryStorage()` holds it as a `Buffer` in Node.js process memory
4. Sharp resizes it (still in RAM); original buffer nulled immediately
5. Resized image converted to base64 and sent to Claude API
6. base64 string and resized buffer both nulled after the API call
7. JSON result returned to the browser — no image data included
8. Node.js GC reclaims all memory

Nothing is written to disk. Nothing is stored in Supabase. Nothing is logged that could identify the image content.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Framer Motion 11 |
| Routing | React Router 6 |
| Backend | Node.js, Express 4 |
| Image handling | Multer (memory storage), Sharp |
| AI | Anthropic Claude with vision (model via `CLAUDE_MODEL` env var) |
| Auth + DB | Supabase |
| Frontend hosting | Vercel |
| Backend hosting | Railway |

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/pratapsfdc22-dev/Drape.git
cd Drape
```

### 2. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 3. Configure environment variables

**client/.env** (copy from `client/.env.example`)
```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**server/.env** (copy from `server/.env.example`)
```
PORT=3001
CLIENT_URL=http://localhost:5173
ANTHROPIC_API_KEY=your_anthropic_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
CLAUDE_MODEL=claude-sonnet-4-6
NODE_ENV=development
```

### 4. Run locally

```bash
# Terminal 1 — API server
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Environment Variables Reference

### Client (`client/.env`)

| Variable | Description |
|---|---|
| `VITE_API_URL` | Express API base URL (`http://localhost:3001` locally, `https://api.get-drape.com` in prod) |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase public anon key (safe to expose) |

### Server (`server/.env`)

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on (Railway sets this automatically) |
| `CLIENT_URL` | Allowed CORS origin (`https://get-drape.com` in prod) |
| `ANTHROPIC_API_KEY` | Anthropic API key — keep secret |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon key (used for JWT verification) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — keep secret |
| `CLAUDE_MODEL` | Claude model ID (e.g. `claude-sonnet-4-6`) |
| `NODE_ENV` | `development` or `production` |

---

## Deployment

This is a monorepo. Vercel deploys `client/` and Railway deploys `server/` — both trigger automatically on every push to `main`.

### Vercel (frontend)

1. Import repo at vercel.com/new
2. Set **Root Directory** → `client`
3. Framework auto-detects as **Vite**
4. Add env vars: `VITE_API_URL`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
5. Add custom domain: `get-drape.com`

### Railway (backend)

1. New Project → Deploy from GitHub → select `Drape`
2. Set **Root Directory** → `server`
3. Add all `server/.env` variables via the Variables tab
4. Add custom domain: `api.get-drape.com`
5. Health check path: `/health`

---

## Supabase Schema

```sql
create table style_sessions (
  id          uuid        primary key default gen_random_uuid(),
  user_id     uuid        references auth.users(id) on delete cascade,
  occasion    text        not null,
  body_type   text,
  outfit_count int,
  created_at  timestamptz not null default now()
);
```

Only authenticated users generate session rows. Guest analyses produce no database writes. No image data or personally identifiable information beyond the authenticated user ID is stored.
