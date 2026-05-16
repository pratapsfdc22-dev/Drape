import Anthropic from '@anthropic-ai/sdk'
import sharp from 'sharp'
import { AI_CONFIG } from '../config/ai.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are ARIA, the AI engine inside Drape — an elite personal styling assistant.
You analyze a person's photo to understand their body type, proportions,
skin tone, and natural aesthetic. Then you curate 3 complete outfit
recommendations perfectly suited to them and their occasion.

CRITICAL: Respond ONLY with valid JSON. No markdown. No explanation.
No preamble. Raw JSON only.

JSON structure:
{
  "bodyAnalysis": {
    "bodyType": "e.g. Hourglass / Rectangle / Pear / Apple / Inverted Triangle",
    "skinTone": "e.g. Fair / Light / Medium / Olive / Tan / Deep",
    "colorPalette": ["#hexcolor1", "#hexcolor2", "#hexcolor3"],
    "styleNotes": "2-3 sentences of personalized insight about their natural style"
  },
  "outfits": [
    {
      "id": 1,
      "name": "Creative outfit name",
      "vibe": "One word e.g. Chic / Bold / Romantic / Fresh / Powerful",
      "description": "2 sentences on the look and why it suits this person",
      "pieces": [
        {
          "item": "Item name e.g. Wide-leg trousers",
          "brand": "Real brand name e.g. Zara",
          "price": "$XX–$XX",
          "url": "Real brand category URL"
        }
      ],
      "stylingTip": "One specific actionable styling tip",
      "accentColor": "#hexcolor"
    }
  ],
  "overallAdvice": "2-3 sentences of occasion-specific style advice"
}

Use REAL brands from this list with REAL category page URLs:
Zara (zara.com), H&M (hm.com), ASOS (asos.com), Nordstrom (nordstrom.com),
Net-a-Porter (net-a-porter.com), Revolve (revolve.com),
Anthropologie (anthropologie.com), Free People (freepeople.com),
Mango (mango.com), & Other Stories (stories.com),
Reformation (thereformation.com), Everlane (everlane.com),
Banana Republic (bananarepublic.gap.com), J.Crew (jcrew.com),
Lululemon (lululemon.com), Uniqlo (uniqlo.com), COS (cosstores.com)

Each outfit must have 4–5 pieces (top, bottom or dress, shoes, bag, accessory).`

function buildUserMessage(occasion, customPrompt) {
  let text = `Analyze this person and recommend outfits for: ${occasion}.`
  if (customPrompt) text += ` ${customPrompt}`
  return text
}

async function callClaude(base64Image, imageMediaType, userText, strict = false) {
  const systemPrompt = strict
    ? `${SYSTEM_PROMPT}\n\nYou previously returned invalid JSON. Return ONLY a raw JSON object. No markdown fences, no explanation, nothing else.`
    : SYSTEM_PROMPT

  const message = await client.messages.create({
    model: AI_CONFIG.model,
    max_tokens: AI_CONFIG.maxTokens,
    system: systemPrompt,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: imageMediaType,
              data: base64Image
            }
          },
          { type: 'text', text: userText }
        ]
      }
    ]
  })

  return message.content[0].text.trim()
}

function extractJSON(raw) {
  const match = raw.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

export async function analyzeWithClaude(imageBuffer, imageMediaType, occasion, customPrompt = '') {
  // Resize to max 1200px wide at 80% quality — stays in RAM, never touches disk
  let resizedBuffer = await sharp(imageBuffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer()

  let base64Image = resizedBuffer.toString('base64')
  resizedBuffer = null // free resized buffer immediately

  const userText = buildUserMessage(occasion, customPrompt)

  let raw = await callClaude(base64Image, 'image/jpeg', userText)
  let result = extractJSON(raw)

  if (!result) {
    // Retry once with a stricter prompt
    raw = await callClaude(base64Image, 'image/jpeg', userText, true)
    result = extractJSON(raw)
  }

  // Free image data from memory before returning
  imageBuffer = null
  base64Image = null

  if (!result) {
    throw new Error('ARIA returned an unreadable response. Please try again.')
  }

  return result
}
