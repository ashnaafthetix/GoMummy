/**
 * Google Gemini API Client for GoMummy
 *
 * Connects to gemini-3.6-flash using the VITE_GEMINI_API_KEY environment variable.
 * Enforces structured JSON output for 5-10 brand candidates tailored to the 3-input model.
 *
 * Specific Error Detection:
 * - Detects HTTP 429 (RESOURCE_EXHAUSTED) for daily/rate limits and tags `isDailyLimit: true`.
 */

const GEMINI_MODEL = 'gemini-3.6-flash'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

export function getGeminiKey() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) {
    return import.meta.env.VITE_GEMINI_API_KEY.trim()
  }
  if (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY) {
    return process.env.VITE_GEMINI_API_KEY.trim()
  }
  return ''
}

export function cleanDomainSlug(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
}

/**
 * Generate candidate brand names via Google Gemini API
 */
export async function generateGeminiBrandNames({ brief, generation = 0, answers = {} }) {
  // Intercept for simulating rate limit / in-flight loading state without burning real quota
  if (
    typeof window !== 'undefined' &&
    (window.__SIMULATE_RATE_LIMIT || new URLSearchParams(window.location.search).get('simulate') === '429')
  ) {
    await new Promise((resolve) => setTimeout(resolve, 800))
    const err = new Error('Daily Gemini API limit reached (429: Quota Exhausted).')
    err.status = 429
    err.isDailyLimit = true
    throw err
  }

  const apiKey = getGeminiKey()
  if (!apiKey) {
    const err = new Error('No Gemini API key found in .env.local')
    err.isMissingKey = true
    throw err
  }

  const answeredPrompts = Object.entries(answers)
    .filter(([_, ans]) => (ans || '').trim())
    .map(([idx, ans]) => `- Brand Strategy Q#${idx}: "${ans}"`)
    .join('\n')

  // Extract Hardware Control Parameters
  const creativity = typeof brief?.creativity === 'number' ? brief.creativity : 65
  const faders = brief?.faders || { innovative: 75, simple: 50, premium: 80 }
  const simpleVal = typeof faders.simple === 'number' ? faders.simple : 50
  const premiumVal = typeof faders.premium === 'number' ? faders.premium : 80
  const innovVal = typeof faders.innovative === 'number' ? faders.innovative : 75

  // 1. Dynamic Temperature based on Creativity Dial (0% = 0.25 focused/literal, 100% = 0.98 inventive/abstract)
  const baseTemp = 0.25 + (creativity / 100) * 0.7
  const temperature = Math.min(1.0, Math.max(0.2, baseTemp + Math.min(0.1, generation * 0.03)))

  // 2. Naming Archetype Guidance based on Creativity
  let archetypeInstruction = ''
  if (creativity < 35) {
    archetypeInstruction = `NAMING ARCHETYPE: STRICTLY COMPOUND & LITERAL.
Combine 2 real, evocative English words with direct connection to the brief (e.g. CraftJoinery, UrbanHardwood, SolidTimber). Avoid made-up words or abstract coinages.`
  } else if (creativity <= 70) {
    archetypeInstruction = `NAMING ARCHETYPE: EVOCATIVE & BALANCED BLENDS.
Create rich, metaphoric pairings, sensory associations, or dual-concept names (e.g. Loom & Carbon, Hearth & Frame, Foundry Grain, Solid Oak). Memorable, grounded, and dignified.`
  } else {
    archetypeInstruction = `NAMING ARCHETYPE: INVENTED NEOLOGISMS & MODERN ABSTRACTS.
Invent punchy, coined words, synthetic portmanteaus, and futuristic abstract roots (e.g. Kroma, Velocraft, Atelierhub, Nexis, Formline). High distinctiveness.`
  }

  // 3. Length & Syllable Constraints based on Simple Fader
  let simplicityInstruction = ''
  if (simpleVal > 65) {
    simplicityInstruction = `SYLLABLE CONSTRAINT (SIMPLE FADER AT ${simpleVal}%): Keep every candidate strictly 1 to 2 syllables and under 9 letters. Ultra-punchy, high cognitive fluency, effortless to pronounce.`
  } else if (simpleVal < 35) {
    simplicityInstruction = `LENGTH FREEDOM (SIMPLE FADER AT ${simpleVal}%): Multi-word expressions, rich compound nouns, or artisan studio titles (e.g. "Solid Wood Atelier") are welcome.`
  } else {
    simplicityInstruction = `SYLLABLE CONSTRAINT: Balance brevity with distinctiveness (around 2-3 syllables).`
  }

  // 4. Tone Bias based on Premium Fader
  let toneInstruction = ''
  if (premiumVal > 65) {
    toneInstruction = `PREMIUM / HERITAGE BIAS (PREMIUM FADER AT ${premiumVal}%): Radiate architectural elegance, luxury restraint, noble materials, bespoke craftsmanship, and heirloom longevity.`
  } else if (premiumVal < 35) {
    toneInstruction = `ACCESSIBILITY BIAS (PREMIUM FADER AT ${premiumVal}%): Approachable, casual, democratic, friendly, and startup-ready.`
  } else {
    toneInstruction = `TONE BIAS: Refined, balanced commercial appeal.`
  }

  // 5. Engineering / Innovation Bias based on Innovative Fader
  let innovationInstruction = ''
  if (innovVal > 65) {
    innovationInstruction = `INNOVATION FOCUS (INNOVATIVE FADER AT ${innovVal}%): Emphasize modular circularity, precision joinery, engineering honesty, and next-generation utility.`
  }

  const prompt = `You are GoMummy, a world-class brand naming assistant and domain strategist.
Generate 10 brand name ideas calibrated specifically to the following hardware console settings:

HARDWARE CONSOLE PARAMETERS:
- Creativity Dial: ${creativity}% (Temperature: ${temperature.toFixed(2)})
- Simplicity Fader: ${simpleVal}%
- Premium / Heritage Fader: ${premiumVal}%
- Innovation Fader: ${innovVal}%

STRATEGIC DIRECTIVES:
${archetypeInstruction}
${simplicityInstruction}
${toneInstruction}
${innovationInstruction ? innovationInstruction + '\n' : ''}
BRIEF DETAILS:
- Primary Subject Name: "${brief.name || 'N/A'}"
- Brand Description & Tone: "${brief.description || 'N/A'}"
- Competitors & Negative Keywords (NEVER copy or collide): "${brief.competitors || 'N/A'}"
- Preferred TLD: "${brief.tld || '.com'}"
${answeredPrompts ? `Additional Strategic Inputs:\n${answeredPrompts}` : ''}
Generation Batch Offset: ${generation}

CRITICAL RULES:
1. Provide creative, memorable, brandable names tailored strictly to the hardware parameters above.
2. Avoid generic corporate clutter (no "Solutions", "Enterprises", "LLC", "Consulting").
3. DO NOT collide with competitor names.
4. Distribute TLDs naturally across .com, .io, and .ai.
5. Return ONLY a valid JSON array of objects with keys:
   - "name": String (Display brand name, e.g. "Loom & Carbon" or "Atelierhub")
   - "slug": String (alphanumeric domain slug without extension, e.g. "loomcarbon")
   - "tld": String (".com", ".io", or ".ai")
   - "rationale": String (1 punchy sentence why it fits the brief & hardware faders)

Respond ONLY with the JSON array, no markdown fences, no explanatory text.`

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: 1000,
      responseMimeType: 'application/json',
    },
  }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 25000)

  let res
  try {
    res = await fetch(`${API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })
  } catch (netErr) {
    clearTimeout(timer)
    if (netErr.name === 'AbortError') {
      const err = new Error('Gemini API call timed out after 25s.')
      err.isTimeout = true
      throw err
    }
    const err = new Error(netErr.message || 'Network connection failed while calling Gemini API.')
    err.isNetwork = true
    throw err
  }
  clearTimeout(timer)

  // Handle Rate Limit / Daily Quota Exhaustion explicitly
  if (res.status === 429) {
    const err = new Error('Daily Gemini API limit reached (429: Quota Exhausted).')
    err.status = 429
    err.isDailyLimit = true
    throw err
  }

  if (!res.ok) {
    let errorDetail = ''
    try {
      const errorJson = await res.json()
      errorDetail = errorJson?.error?.message || ''
      if (errorJson?.error?.status === 'RESOURCE_EXHAUSTED') {
        const err = new Error('Daily Gemini API limit reached (429: Quota Exhausted).')
        err.status = 429
        err.isDailyLimit = true
        throw err
      }
    } catch {
      // json parse fallback
    }
    const err = new Error(errorDetail || `Gemini API returned error HTTP ${res.status}`)
    err.status = res.status
    throw err
  }

  const data = await res.json()
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '[]'

  let parsed = []
  try {
    parsed = JSON.parse(rawText)
  } catch {
    // If markdown backticks were included despite mime-type
    const match = rawText.match(/\[[\s\S]*\]/)
    if (match) {
      parsed = JSON.parse(match[0])
    } else {
      throw new Error("Unable to parse Gemini candidate names JSON response.")
    }
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Gemini returned an empty candidate list.')
  }

  // Sanitize and normalize items
  const validTlds = ['.com', '.io', '.ai']
  return parsed.map((item) => {
    const slug = cleanDomainSlug(item.slug || item.domain || item.name)
    const tld = validTlds.includes(item.tld) ? item.tld : '.com'
    const altTlds = validTlds.filter((t) => t !== tld)
    return {
      name: item.name || slug,
      domain: slug,
      tld,
      tlds: altTlds,
      state: 'checking', // initial state before domain check
      tags: slug.length <= 8 ? ['short'] : ['descriptive'],
      rationale: item.rationale || '',
    }
  }).filter((item) => item.domain.length >= 3 && item.domain.length <= 25)
}
