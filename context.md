# Drape — Claude Code Context Setter
# Paste this as your FIRST message at the start of every Claude Code session

I am building a web app called "Drape" — an AI-powered personal styling app
at get-drape.com. The AI persona inside is called ARIA.

Tech stack:
- Frontend: React + Vite + Tailwind CSS + Framer Motion — deploy to Vercel
- Backend: Node.js + Express — deploy to Railway
- Auth + DB: Supabase (user accounts and session logs only)
- Image handling: In-memory ONLY via Multer — no cloud storage, no disk writes
- AI: Anthropic Claude — model read from process.env.CLAUDE_MODEL
- Repo: GitHub

Model configuration rule:
- Never hardcode the Claude model string anywhere in the codebase
- Always read from process.env.CLAUDE_MODEL with a hardcoded fallback default in server/config/ai.js
- All AI config lives in server/config/ai.js

Core privacy rule:
- User photos are NEVER stored
- Held in server RAM → sent to Claude API → discarded immediately
- This is non-negotiable

Branding:
- App name: Drape
- AI persona: ARIA
- Domain: get-drape.com
- API subdomain: api.get-drape.com
- Tagline: "Your AI Personal Stylist"
- Colors: Deep charcoal #1a1a1a, warm cream #f5f0e8, gold accent #c9a84c
- Fonts: Playfair Display (headings) + DM Sans (body)

Infrastructure:
- Frontend hosting: Vercel
- Backend hosting: Railway
- Auth + DB: Supabase
- Domain registrar: get-drape.com (registered)
- No image cloud storage (Cloudinary removed by design)

Remember this context for all subsequent prompts in this session.