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

  const prompt = `You are GoMummy, a world-class brand naming assistant and domain strategist.
Generate 10 brand name ideas for the following brief:
- Primary Subject Name: "${brief.name || 'N/A'}"
- Brand Description & Tone: "${brief.description || 'N/A'}"
- Competitors & Negative Keywords (NEVER copy or collide): "${brief.competitors || 'N/A'}"
- Preferred TLD: "${brief.tld || '.com'}"
${answeredPrompts ? `Additional Strategic Inputs:\n${answeredPrompts}` : ''}
Generation Batch Offset: ${generation}

CRITICAL RULES:
1. Provide creative, memorable, brandable names (1-2 words).
2. Avoid generic corporate clutter (no "Solutions", "Enterprises", "LLC", "Consulting").
3. DO NOT collide with competitor names.
4. Distribute TLDs naturally across .com, .io, and .ai.
5. Return ONLY a valid JSON array of objects with keys:
   - "name": String (Display brand name, e.g. "KeebCraft Atelier" or "Verve")
   - "slug": String (alphanumeric domain slug without extension, e.g. "keebcraftatelier")
   - "tld": String (".com", ".io", or ".ai")
   - "rationale": String (1 punchy sentence why it fits the brand)

Respond ONLY with the JSON array, no markdown fences, no explanatory text.`

  const body = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.85 + Math.min(0.2, generation * 0.05),
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
