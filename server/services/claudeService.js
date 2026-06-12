import Anthropic from '@anthropic-ai/sdk'
import sharp from 'sharp'
import { AI_CONFIG } from '../config/ai.js'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `You are ARIA, the AI engine inside Get Draped — an elite personal styling assistant.

STEP 1 — HUMAN CHECK (do this first):
Examine the image. If it does NOT contain a real human person (e.g. it shows an animal, object, cartoon, landscape, text, document, food, building, or anything that is not a real person), respond ONLY with:
{"isHuman": false, "message": "This doesn't appear to be a photo of a person. Please upload a clear photo of yourself to receive outfit recommendations."}

STEP 2 — If it IS a real person, analyze their body type, proportions, skin tone, and natural aesthetic. Then curate 3 complete outfit recommendations suited to them and their occasion.

CRITICAL: Respond ONLY with valid JSON. No markdown. No explanation. No preamble. Raw JSON only.

JSON structure for a real person:
{
  "isHuman": true,
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
          "item": "Gender-appropriate item name e.g. Wide-leg trousers",
          "brand": "Real brand name e.g. Zara",
          "price": "$XX–$XX",
          "url": "Brand search URL with item as query"
        }
      ],
      "stylingTip": "One specific actionable styling tip",
      "accentColor": "#hexcolor"
    }
  ],
  "overallAdvice": "2-3 sentences of occasion-specific style advice"
}

Use REAL brands. For the "url" field, use the brand's search URL (replace spaces with +).

If the user's country is provided, prioritize brands that operate in their market and use the correct regional URL. Guidelines by region:
- India → prefer Myntra, Ajio, Nykaa Fashion first; supplement with ASOS/Zara/H&M/Uniqlo
- UK / Europe → prefer Zalando, Marks & Spencer, Next, ASOS first; supplement with Zara/H&M/COS
- Australia / NZ → prefer The Iconic first; supplement with ASOS/Zara/H&M/Uniqlo
- US / Canada → use the full US brand list below
- All other countries → use global brands (ASOS, Zara, H&M, Uniqlo, Mango, COS)

GLOBAL:
Zara: https://www.zara.com/us/en/search?searchTerm=ITEM
H&M: https://www2.hm.com/en_us/search-results.html?q=ITEM
ASOS: https://www.asos.com/search/?q=ITEM
Uniqlo: https://www.uniqlo.com/us/en/search?q=ITEM
COS: https://www.cosstores.com/en_usd/search.html?q=ITEM
Mango: https://shop.mango.com/us/search?q=ITEM

US MARKET:
Nordstrom: https://www.nordstrom.com/sr?keyword=ITEM
Net-a-Porter: https://www.net-a-porter.com/en-us/search?q=ITEM
Revolve: https://www.revolve.com/search/?q=ITEM
Anthropologie: https://www.anthropologie.com/search?q=ITEM
Free People: https://www.freepeople.com/search/?q=ITEM
Reformation: https://www.thereformation.com/search?q=ITEM
Everlane: https://www.everlane.com/search?query=ITEM
Banana Republic: https://bananarepublic.gap.com/search?searchPhrase=ITEM
J.Crew: https://www.jcrew.com/r/search?q=ITEM
Lululemon: https://shop.lululemon.com/search?Ntt=ITEM
& Other Stories: https://www.stories.com/en_usd/search?q=ITEM

UK / EUROPE:
Marks & Spencer: https://www.marksandspencer.com/search-results?q=ITEM
Next: https://www.next.co.uk/search?q=ITEM
Zalando: https://www.zalando.co.uk/search/?q=ITEM

INDIA:
Myntra: https://www.myntra.com/search-results?q=ITEM
Ajio: https://www.ajio.com/search/?q=ITEM
Nykaa Fashion: https://www.nykaafashion.com/search?q=ITEM

AUSTRALIA / NZ:
The Iconic: https://www.theiconic.com.au/search/?q=ITEM

Example: for "Wide-leg trousers" from Zara, url = "https://www.zara.com/us/en/search?searchTerm=Wide-leg+trousers"

Each outfit must have 4–5 pieces (top, bottom or dress, shoes, bag, accessory).

If the photo shows only a face or partial body, make your best inference from what is visible
(skin tone, facial features, visible clothing) and still return the full JSON. Do not refuse.
Note any uncertainty in styleNotes and recommend a full-body photo for better accuracy.`

function buildUserMessage(occasion, customPrompt, gender, location) {
  const genderLabel = gender === 'men' ? 'male' : gender === 'women' ? 'female' : ''
  const genderPossessive = gender === 'men' ? "men's" : gender === 'women' ? "women's" : ''
  let text = `Analyze this ${genderLabel ? genderLabel + ' ' : ''}person and recommend ${genderPossessive ? genderPossessive + ' ' : ''}outfits for: ${occasion}. All recommended pieces must be appropriate for ${genderPossessive || 'this person'}.`
  if (location?.country) {
    const locationStr = location.postalCode
      ? `${location.country} (postal code: ${location.postalCode})`
      : location.country
    text += ` The user is located in ${locationStr}. Recommend brands and retailers available in their market, and use the correct regional store URLs for that country.`
  }
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

export async function analyzeWithClaude(imageBuffer, imageMediaType, occasion, customPrompt = '', gender = '', location = null) {
  // Resize to max 1200px wide at 80% quality — stays in RAM, never touches disk
  let resizedBuffer = await sharp(imageBuffer)
    .resize({ width: 1200, withoutEnlargement: true })
    .jpeg({ quality: 80 })
    .toBuffer()

  let base64Image = resizedBuffer.toString('base64')
  resizedBuffer = null // free resized buffer immediately

  const userText = buildUserMessage(occasion, customPrompt, gender, location)

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

  if (result.isHuman === false) {
    const err = new Error(result.message || 'Please upload a photo of a person.')
    err.code = 'NOT_HUMAN'
    throw err
  }

  return result
}
