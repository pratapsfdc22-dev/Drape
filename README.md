# Drape — Your AI Personal Stylist

ARIA (AI Recommendation & Image Analyst) analyzes your photo and recommends outfits tailored to your body type, color palette, and occasion.

**Privacy first:** photos are processed entirely in server RAM and discarded immediately after analysis. Nothing is ever written to disk or stored in any database.

---

## Project Structure

```
drape/
├── client/    # React + Vite + Tailwind — deploys to Vercel
└── server/    # Node.js + Express — deploys to Railway
```

## Quick Start

### 1. Install dependencies

```bash
cd client && npm install
cd ../server && npm install
```

### 2. Configure environment variables

**client/.env**
```
VITE_API_URL=http://localhost:3001
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**server/.env**
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

### 3. Run locally

```bash
# Terminal 1 — API server
cd server && npm run dev

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Framer Motion 11 |
| Backend | Node.js, Express 4 |
| Auth + DB | Supabase (accounts + anonymous session logs) |
| Image handling | Multer (memory storage only — no disk writes) |
| AI | Anthropic Claude (model set via `CLAUDE_MODEL` env var) with vision |

## Deployment

| Service | Target |
|---|---|
| Frontend | Vercel — connect `client/` directory |
| Backend | Railway — connect `server/` directory |

Set all environment variables in each platform's dashboard. No additional build config needed.

---

## Supabase Schema

Create a `session_logs` table for anonymous analytics:

```sql
create table session_logs (
  id uuid primary key default gen_random_uuid(),
  occasion text not null,
  created_at timestamptz not null default now()
);
```

No user-identifiable data or images are ever stored.

---

## Privacy

- Photos are uploaded via HTTPS to the Express server
- Multer stores the file in process memory (`Buffer`) only
- The buffer is sent to the Claude API and then goes out of scope
- Node.js GC reclaims the memory — no persistence of any kind
- Session logs record only the occasion string and timestamp
