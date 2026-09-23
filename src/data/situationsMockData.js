/**
 * Situations Mock Data for GoMummy Results Screen (S2)
 *
 * Implements the 4 core stress states directly in code:
 * 1. NOTHING: Zero results matching active filter constraints.
 * 2. TOO MUCH: Extreme text density, 35+ character brand names, long domain slugs, tag overflow.
 * 3. WRONG: Quota exhaustion (HTTP 429), connection drop, actionable error notice.
 * 4. WAITING: In-flight DNS checks and AI generation, checking beacons, pending resolution.
 */

export const SITUATION_PRESETS = {
  NORMAL: 'normal',
  NOTHING: 'nothing',
  TOO_MUCH: 'too_much',
  WRONG: 'wrong',
  WAITING: 'waiting',
}

export const SITUATIONS_DATA = {
  // Situation 1: NOTHING (Empty state)
  nothing: {
    cards: [],
    targetCard: {
      name: 'Loom & Carbon',
      domain: 'loomandcarbon',
      tld: '.ai',
      state: 'taken',
      tlds: ['.com', '.io'],
      tags: ['short'],
    },
    notice: null,
    emptyMessage: {
      title: '// ZERO CANDIDATES MATCH FILTER',
      description: 'No candidates in the current batch match your active TLD or length filters.',
      suggestion: 'Relax your filter options or roll a fresh batch of 5 brand ideas.',
    },
  },

  // Situation 2: TOO MUCH (Extreme length & layout stress)
  too_much: {
    targetCard: {
      name: 'Supercalifragilistic Architectural Craft Atelier',
      domain: 'supercalifragilisticarchitecturalcraftatelier',
      tld: '.com',
      state: 'available',
      tlds: ['.io', '.ai'],
      tags: ['heritage-joinery', 'circular-flatpack', 'low-carbon-extrusion', 'zero-veneer-guarantee'],
      rationale:
        'A maximalist brand name designed to stress test container widths, word-breaking, font-size responsiveness, and flex wrapping without bursting the 4px black borders.',
    },
    cards: [
      {
        name: 'Bespoke Generational Joinery & Modular Extrusion Labs',
        domain: 'bespokegenerationaljoineryandmodularextrusionlabs',
        tld: '.com',
        state: 'available',
        tlds: ['.io', '.ai'],
        tags: ['architectural-honesty', 'generational-utility', 'exposed-fasteners', 'repair-first'],
        rationale: 'Extremely long compound title verifying flex baseline alignment and button collision avoidance.',
      },
      {
        name: 'International Consortium of Sustainable Hardwood Craftspeople',
        domain: 'internationalconsortiumofsustainablehardwoodcraftspeople',
        tld: '.io',
        state: 'taken',
        tlds: ['.com', '.ai'],
        tags: ['multi-word-title', 'reclaimed-grain', 'circular-system', 'workshop-patina'],
        rationale: 'Long taken domain verifying line-through styling across full container width without text overflow.',
      },
      {
        name: 'Ultra-Quiet Whisper Scandinavian Refinement Atelier',
        domain: 'ultraquietwhisperscandinavianrefinementatelier',
        tld: '.ai',
        state: 'available',
        tlds: ['.com', '.io'],
        tags: ['nordic-minimalism', 'natural-oil-finish', 'acoustic-paneling', 'precision-milled'],
        rationale: 'Verifies multi-badge wrap behavior in card footer across mobile and desktop breakpoints.',
      },
      {
        name: 'Low-Carbon Disassembled Circular Flat-Pack Systems HQ',
        domain: 'lowcarbondisassembledcircularflatpacksystemshq',
        tld: '.com',
        state: 'available',
        tlds: ['.io', '.ai'],
        tags: ['flat-pack', 'zero-glue', 'recycled-aluminum', 'hardware-visibility'],
        rationale: 'Stresses alternative TLD button wrapping and compare toggle positioning.',
      },
      {
        name: 'The Non-Planned-Obsolescence Generational Furniture Foundry',
        domain: 'thenonplannedobsolescencegenerationalfurniturefoundry',
        tld: '.io',
        state: 'taken',
        tlds: ['.com', '.ai'],
        tags: ['lifetime-warranty', 'serial-stamped', 'honest-wear', 'brutalist-craft'],
        rationale: 'Verifies slot number strip layout stability when titles stretch across multiple lines.',
      },
    ],
    notice: null,
  },

  // Situation 3: WRONG (HTTP 429 Quota Exhaustion / Network Failure)
  wrong: {
    notice: {
      isDailyLimit: true,
      code: '429',
      status: 'RESOURCE_EXHAUSTED',
      message: 'Daily Gemini API limit reached (429: Quota Exhausted). Showing local fallback candidates for now.',
      suggestion: 'The live AI generation quota has been exhausted for today. Local craft candidates remain fully active with live DNS checks.',
    },
    targetCard: {
      name: 'KeebCraft',
      domain: 'keebcraft',
      tld: '.com',
      state: 'taken',
      tlds: ['.io', '.ai'],
      tags: ['short'],
    },
    cards: [
      {
        name: 'Keychroncraft',
        domain: 'keychroncraft',
        tld: '.com',
        state: 'available',
        tlds: ['.io', '.ai'],
        tags: ['descriptive'],
        rationale: 'Local heuristic fallback candidate generated safely without network dependency.',
      },
      {
        name: 'Brassflow',
        domain: 'brassflow',
        tld: '.io',
        state: 'available',
        tlds: ['.com', '.ai'],
        tags: ['short'],
        rationale: 'Fallback candidate with live Google DoH availability status verification.',
      },
      {
        name: 'GetKeebcraft',
        domain: 'getkeebcraft',
        tld: '.ai',
        state: 'available',
        tlds: ['.com', '.io'],
        tags: ['short'],
        rationale: 'Prefix pattern derived safely from the user brief.',
      },
      {
        name: 'Tactilely',
        domain: 'tactilely',
        tld: '.ai',
        state: 'available',
        tlds: ['.com', '.io'],
        tags: ['short'],
        rationale: 'Suffix pattern derived from the brief description.',
      },
      {
        name: 'Atelier Nordic',
        domain: 'ateliernordic',
        tld: '.com',
        state: 'taken',
        tlds: ['.io', '.ai'],
        tags: ['descriptive'],
        rationale: 'Curated craft backup card to ensure uninterrupted 5-slot feed.',
      },
    ],
  },

  // Situation 4: WAITING (In-flight / checking status)
  waiting: {
    targetCard: {
      name: 'KeebCraft',
      domain: 'keebcraft',
      tld: '.com',
      state: 'checking',
      tlds: ['.io', '.ai'],
      tags: ['short'],
    },
    cards: [
      {
        name: 'BrassTactile',
        domain: 'brasstactile',
        tld: '.com',
        state: 'checking',
        tlds: ['.io', '.ai'],
        tags: ['descriptive'],
        rationale: 'Resolving authoritative SOA DNS record via Google DoH...',
      },
      {
        name: 'KeebForge',
        domain: 'keebforge',
        tld: '.io',
        state: 'checking',
        tlds: ['.com', '.ai'],
        tags: ['short'],
        rationale: 'Querying dns.google/resolve?name=keebforge.io&type=SOA...',
      },
      {
        name: 'SwitchCraft',
        domain: 'switchcraft',
        tld: '.ai',
        state: 'checking',
        tlds: ['.com', '.io'],
        tags: ['short'],
        rationale: 'Checking zone registration status in background...',
      },
      {
        name: 'PlateMod',
        domain: 'platemod',
        tld: '.com',
        state: 'checking',
        tlds: ['.io', '.ai'],
        tags: ['short'],
        rationale: 'Awaiting authoritative nameserver response...',
      },
      {
        name: 'CustomClick',
        domain: 'customclick',
        tld: '.io',
        state: 'checking',
        tlds: ['.com', '.ai'],
        tags: ['short'],
        rationale: 'DNS response pending...',
      },
    ],
    notice: null,
  },
}
