# Get Draped — AI Personal Styling Platform

**ARIA** (Aesthetic Realtime Intelligence Advisor) analyzes a user's photo and curates 3 complete outfit recommendations tailored to their body type, skin tone, occasion, and location — with real brands, real prices, and direct shopping links.

**Live:** [get-drape.com](https://get-drape.com) · Powered by [WestSideAI](https://www.westsideai.org)

---

## The Business Case

### The Problem

Fashion retail faces three compounding challenges:

- **Returns cost the industry $816 billion globally per year** — the leading cause is items that don't suit the buyer's body type or personal style
- **Conversion rates on fashion e-commerce average just 1–3%** — most shoppers browse without buying because they can't visualize how something will look on them specifically
- **Personalization at scale is expensive** — hiring human stylists or personal shoppers is reserved for luxury clients, leaving the mass market underserved

### What Get Draped Does

Get Draped puts an AI personal stylist in front of every shopper, regardless of budget or brand tier. In under 60 seconds, ARIA delivers:

- A body type and skin tone analysis
- 3 curated full outfits (top, bottom, shoes, bag, accessory)
- Brand recommendations matched to the user's location and market
- Direct shopping links to real products

This is the experience that previously required a £200/hour personal stylist — now available at scale.

---

## Business Use Cases

### For Fashion Retailers & E-commerce Brands

| Use Case | Impact |
|---|---|
| **Pre-purchase styling assistant** | Embed on product pages to show shoppers how items work in a full outfit — drives cross-sell and increases basket size |
| **Returns reduction** | Shoppers who receive personalized fit/style guidance return fewer items — directly improving margin |
| **Brand discovery** | ARIA introduces shoppers to complementary brands they wouldn't have searched for independently — increases affiliate and referral revenue |
| **Conversion lift** | Personalized recommendations convert at 3–5× the rate of generic product listings |

### For Fashion Brands

| Use Case | Impact |
|---|---|
| **Own-brand integration** | White-label ARIA to surface your product catalog exclusively — every recommendation drives the user back to your store |
| **Occasion marketing** | Wedding season, festival drops, back-to-school — occasion-based recommendations tie into campaign moments with precision |
| **Regional market penetration** | Location-aware recommendations route users to country-specific storefronts and stock — critical for international expansion |
| **Customer data (privacy-safe)** | Aggregate session data (body types, occasions, preferred styles by region) provides anonymized market intelligence — no PII, no image storage |

### For Multi-brand Marketplaces & Platforms

| Use Case | Impact |
|---|---|
| **Stylist-as-a-feature** | Add AI styling as a premium tier offering to differentiate from pure-search competitors |
| **Loyalty and retention** | Personalized styling creates habitual return visits — the platform becomes a destination, not just a search engine |
| **Influencer and social commerce** | Style recommendations are shareable moments — built-in virality drives top-of-funnel acquisition at near-zero CAC |

---

## Key Differentiators

**Privacy-first by design.** Photos are never stored — processed in server RAM and discarded the moment analysis completes. This is a genuine competitive advantage when selling to enterprise retail clients with data governance obligations.

**Market-aware recommendations.** ARIA knows where the user is and routes them to brands and storefronts available in their market — India gets Myntra and Ajio, UK gets Zalando and M&S, US gets Nordstrom and Revolve.

**Occasion intelligence.** Recommendations aren't just about the garment — they're contextual. A job interview outfit looks different from a beach holiday or a wedding guest look.

**State-of-the-art vision AI.** Powered by Anthropic Claude's vision capabilities — the same model family used by leading enterprise AI deployments.

---

## Project Overview

Get Draped is a privacy-first AI styling platform. Users upload a photo, select their gender and occasion, optionally share their location, and receive a full style profile from ARIA. No image is ever stored: photos are processed in server RAM and discarded the moment analysis completes.

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

---

## Built by WestSideAI

[WestSideAI](https://www.westsideai.org) builds AI-powered products at the intersection of technology and consumer experience.
