// Improved, deterministic name generator & mock candidate pool.
// Derives brandable candidates from the user's name, description, and competitors,
// blends with curated craft candidates, and cycles fresh batches on each generation.

const STOP = new Set([
  'the', 'and', 'for', 'with', 'your', 'you', 'our', 'from', 'into', 'that',
  'this', 'are', 'app', 'name', 'names', 'like', 'want', 'need', 'make',
])
const PREFIXES = ['get', 'try', 'use', 'go', 'join', 'hey']
const SUFFIXES = [
  'ly', 'labs', 'hq', 'base', 'kit', 'hub', 'flow', 'wave', 'forge', 'craft',
  'loop', 'works', 'peak', 'stack', 'sync', 'yard', 'pilot', 'scout', 'space', 'link',
]
const ABSTRACT = [
  'nova', 'lumen', 'atlas', 'ferra', 'quill', 'orbit', 'nimbus', 'cadence',
  'harbor', 'verve', 'onyx', 'sable', 'mira', 'vela', 'luma', 'riva', 'fable',
  'juno', 'halo', 'wren',
]

export function cleanSlug(str) {
  return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '')
}

function hashStr(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(a) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle(arr, rnd) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function cap(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s
}

function tokens(str) {
  return (str || '')
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((w) => w.length >= 3 && !STOP.has(w))
}

function buildCandidates(seed, mods) {
  const set = new Map()
  const add = (nameParts) => {
    const name = nameParts
    const slug = cleanSlug(name)
    if (slug.length >= 3 && slug.length <= 15 && !set.has(slug)) set.set(slug, name)
  }

  if (seed) {
    add(cap(seed))
    for (const suf of SUFFIXES) add(cap(seed) + suf)
    for (const pre of PREFIXES) add(cap(pre) + cap(seed))
  }
  for (const m of mods) {
    add(cap(m))
    for (const suf of SUFFIXES.slice(0, 10)) add(cap(m) + suf)
  }
  if (seed) {
    for (const m of mods.slice(0, 5)) add(cap(seed) + cap(m).slice(0, 4))
  }
  for (const ab of ABSTRACT) {
    add(cap(ab))
    if (seed) add(cap(ab) + cap(seed).slice(0, 4))
  }
  return set
}

export const CANDIDATE_POOL = [
  { name: 'Loom & Carbon', domain: 'loomandcarbon', tld: '.com', state: 'available', tlds: ['.io', '.ai'] },
  { name: 'Foundry Grain', domain: 'foundrygrain', tld: '.com', state: 'available', tlds: ['.io', '.ai'] },
  { name: 'Heartwood Co', domain: 'heartwoodco', tld: '.com', state: 'available', tlds: ['.io', '.ai'] },
  { name: 'Article Frame', domain: 'articleframe', tld: '.com', state: 'taken', tlds: ['.io', '.ai'] },
  { name: 'Reclaimed Form', domain: 'reclaimedform', tld: '.com', state: 'taken', tlds: ['.io', '.ai'] },
  { name: 'Grain & Ore', domain: 'grainandore', tld: '.io', state: 'available', tlds: ['.com', '.ai'] },
  { name: 'Solid Oak Co', domain: 'solidoakco', tld: '.io', state: 'available', tlds: ['.com', '.ai'] },
  { name: 'Patina', domain: 'patina', tld: '.ai', state: 'available', tlds: ['.com', '.io'] },
  { name: 'Joinery', domain: 'joinery', tld: '.com', state: 'taken', tlds: ['.io', '.ai'] },
  { name: 'Hearth & Frame', domain: 'hearthandframe', tld: '.io', state: 'available', tlds: ['.com', '.ai'] },
  { name: 'Timberline Studio', domain: 'timberlinestudio', tld: '.com', state: 'taken', tlds: ['.io', '.ai'] },
  { name: 'Knot & Beam', domain: 'knotandbeam', tld: '.com', state: 'available', tlds: ['.io', '.ai'] },
  { name: 'Ore', domain: 'ore', tld: '.ai', state: 'available', tlds: ['.com', '.io'] },
  { name: 'Repair Culture', domain: 'repairculture', tld: '.com', state: 'taken', tlds: ['.io', '.ai'] },
  { name: 'Long Grain', domain: 'longgrain', tld: '.io', state: 'available', tlds: ['.com', '.ai'] },
  { name: 'Atelier Nordic', domain: 'ateliernordic', tld: '.com', state: 'available', tlds: ['.io', '.ai'] },
  { name: 'Anvil & Ash', domain: 'anvilandash', tld: '.com', state: 'taken', tlds: ['.io', '.ai'] },
  { name: 'Bespoke Beam', domain: 'bespokebeam', tld: '.io', state: 'available', tlds: ['.com', '.ai'] },
  { name: 'Nordic Form', domain: 'nordicform', tld: '.ai', state: 'available', tlds: ['.com', '.io'] },
  { name: 'Silt & Stone', domain: 'siltandstone', tld: '.com', state: 'available', tlds: ['.io', '.ai'] },
  { name: 'Veneer Craft', domain: 'veneercraft', tld: '.com', state: 'taken', tlds: ['.io', '.ai'] },
  { name: 'ModuForge', domain: 'moduforge', tld: '.io', state: 'available', tlds: ['.com', '.ai'] },
  { name: 'Lignum', domain: 'lignum', tld: '.ai', state: 'available', tlds: ['.com', '.io'] },
  { name: 'Tenon Studio', domain: 'tenonstudio', tld: '.com', state: 'taken', tlds: ['.io', '.ai'] },
  { name: 'Urban Hardwood', domain: 'urbanhardwood', tld: '.com', state: 'available', tlds: ['.io', '.ai'] },
  { name: 'Alumicraft', domain: 'alumicraft', tld: '.io', state: 'available', tlds: ['.com', '.ai'] },
  { name: 'Kast', domain: 'kast', tld: '.ai', state: 'available', tlds: ['.com', '.io'] },
  { name: 'Dowel & Mortise', domain: 'dowelandmortise', tld: '.com', state: 'taken', tlds: ['.io', '.ai'] },
  { name: 'Formwerk', domain: 'formwerk', tld: '.io', state: 'available', tlds: ['.com', '.ai'] },
  { name: 'Cinder & Oak', domain: 'cinderandoak', tld: '.com', state: 'available', tlds: ['.io', '.ai'] },
]

export const QUESTIONS = [
  'What feeling do you want to evoke in your audience?',
  'What are the main actions you want people to take?',
  'If your company were a rare plant or animal, which would it be?',
  'What analogies fit how your business operates?',
  'How would you explain your project to a five-year-old and keep them interested?',
  'Does this concept exist in other industries, and do they use different words for it?',
  'What are a few good metaphors for what you do?',
  "What role in people's lives are you trying to fill?",
]

export const INITIAL_BRIEF = {
  name: 'Loom & Carbon',
  description:
    'An independent industrial craft atelier creating modular architectural furniture, heritage shelving, and solid joinery tables from reclaimed urban hardwood and low-carbon extruded aluminum. Designed uncompromisingly for generational longevity, disassembled flat-pack circularity, and visible exposed fasteners that invite repair rather than disposal. We balance brutalist physical honesty with whisper-quiet Scandinavian refinement: zero synthetic veneers, zero fast-trend planned obsolescence, and zero greenwashed carbon offsets. We celebrate honest wear, oiled grain patinas, hand-stamped serial stamps, and quiet workshop utility.',
  competitors: 'Article, Floyd, Maiden Home, Herman Miller, sustainable, heirloom, modular',
  tld: '.com',
}

export const ALL_TLDS = ['.com', '.io', '.ai']

export function getTargetCard(pool, briefOrTarget) {
  const briefObj =
    typeof briefOrTarget === 'string'
      ? { name: briefOrTarget, tld: '.com' }
      : briefOrTarget || INITIAL_BRIEF

  const targetName = (briefObj?.name || '').trim()
  if (!targetName) return null

  const targetTld = briefObj?.tld || '.com'
  const slug = cleanSlug(targetName)
  const existing = pool.find((c) => c.domain === slug)
  const isAvail = existing ? existing.state === 'available' : (hashStr(slug + targetTld) % 100) < 45

  return {
    name: targetName,
    domain: slug,
    tld: targetTld,
    state: isAvail ? 'available' : 'taken',
    tlds: ALL_TLDS.filter((t) => t !== targetTld),
    tags: slug.length <= 8 ? ['short'] : ['descriptive'],
  }
}

export function pickBatch(pool, excludeDomains = [], briefOrTarget = '', generation = 0, answers = {}) {
  const briefObj =
    typeof briefOrTarget === 'string'
      ? { name: briefOrTarget, tld: '.com' }
      : briefOrTarget || INITIAL_BRIEF

  const targetCard = getTargetCard(pool, briefObj)


  // Derive tokens from user's brief
  const seedTokens = tokens(briefObj?.name)
  const descTokens = tokens(briefObj?.description)
  const compTokens = tokens(briefObj?.competitors)
  const compSlugs = new Set(compTokens.map(cleanSlug))

  const seed = seedTokens[0] || descTokens[0] || compTokens[0] || 'craft'
  const baseMods = [...seedTokens.slice(1), ...descTokens.slice(0, 15), ...compTokens.slice(0, 8)]
  const answerTokens = Object.values(answers || {}).flatMap((v) => tokens(v))
  const mods = Array.from(new Set([...baseMods, ...answerTokens]))

  // Dynamic candidate synthesis with balanced TLD distribution (.com, .io, .ai)
  const dynamicCandidates = buildCandidates(seed, mods)
  const dynamicItems = []
  let dynIdx = 0
  for (const [slug, name] of dynamicCandidates) {
    if (compSlugs.has(slug)) continue
    if (targetCard && slug === targetCard.domain) continue

    const tldPick = ALL_TLDS[(hashStr(slug) + dynIdx) % ALL_TLDS.length]
    dynIdx++
    const isAvail = (hashStr(slug + tldPick) % 100) < 45
    const altTlds = ALL_TLDS.filter((t) => t !== tldPick)

    dynamicItems.push({
      name,
      domain: slug,
      tld: tldPick,
      state: isAvail ? 'available' : 'taken',
      tlds: altTlds,
      tags: slug.length <= 8 ? ['short'] : ['descriptive'],
    })
  }

  // Static pool items: preserve authentic handcrafted TLD (.com, .io, .ai)
  const staticItems = pool
    .map((c) => {
      const itemTld = c.tld || '.com'
      const altTlds =
        c.tlds && c.tlds.length > 0
          ? c.tlds
          : ALL_TLDS.filter((t) => t !== itemTld)
      return {
        ...c,
        tld: itemTld,
        tlds: altTlds,
        tags: c.tags || (c.domain.length <= 8 ? ['short'] : ['descriptive']),
      }
    })
    .filter((c) => !targetCard || c.domain !== targetCard.domain)

  // Merge & deduplicate
  const seen = new Set()
  const mergedPool = []
  for (const item of [...dynamicItems, ...staticItems]) {
    if (!seen.has(item.domain) && !compSlugs.has(item.domain)) {
      seen.add(item.domain)
      mergedPool.push(item)
    }
  }

  // Exclude domains currently visible on screen
  const available = mergedPool.filter((c) => !excludeDomains.includes(c.domain))
  const source = available.length >= 5 ? available : mergedPool

  // Deterministic shuffle with generation offset
  const rnd = mulberry32(
    hashStr(`${briefObj?.name || ''}|${briefObj?.description || ''}|${generation}`)
  )
  const shuffled = shuffle(source, rnd)

  // Assemble balanced 5-card alternative batch ensuring active representation of .com, .io, and .ai
  const selected = []
  const usedDomains = new Set()
  if (targetCard) {
    usedDomains.add(targetCard.domain)
  }


  // Ensure every batch has active representation of ALL key TLDs: .com, .io, .ai
  const presentTlds = new Set(selected.map((c) => c.tld))
  const neededTlds = ALL_TLDS.filter((tld) => !presentTlds.has(tld))

  // Find candidate for each missing TLD from shuffled pool
  for (const tld of neededTlds) {
    if (selected.length >= 5) break
    const candidate = shuffled.find((c) => c.tld === tld && !usedDomains.has(c.domain))
    if (candidate) {
      selected.push(candidate)
      usedDomains.add(candidate.domain)
    }
  }

  // Fill remaining slots up to 5 in deterministic shuffled order
  for (const c of shuffled) {
    if (selected.length >= 5) break
    if (!usedDomains.has(c.domain)) {
      selected.push(c)
      usedDomains.add(c.domain)
    }
  }

  return selected.slice(0, 5)
}
