import { useState } from 'react'

const EXAMPLE_IDEAS = [
  { label: 'Sustainable fashion', snippet: 'Modular circular apparel from organic linen and low-impact dyes' },
  { label: 'AI study companion', snippet: 'Context-aware revision assistant that builds spaced repetition flashcards' },
  { label: 'Modern coffee brand', snippet: 'Direct-trade anaerobic microlot beans roasted in micro batches' },
  { label: 'Home organization', snippet: 'Architectural joinery shelving and modular storage cubes' },
  { label: 'Health & wellness', snippet: 'Cold-pressed adaptogenic elixirs with zero synthetic additives' },
]

const FLAVOR_SEEDS = [
  { label: '🔥 ARCHITECTURAL', snippet: 'brutalist architectural honesty, exposed structural joinery' },
  { label: '🌿 ZERO PLASTIC', snippet: 'zero synthetic veneers, 100% circular disassembled flat-pack' },
  { label: '⭐ QUIET NORDIC', snippet: 'whisper-quiet Scandinavian refinement, natural grain patina' },
  { label: '🔧 HEIRLOOM UTILITY', snippet: 'generational longevity, visible tactile hardware' },
  { label: '🧪 RECLAIMED CRAFT', snippet: 'reclaimed urban hardwood, low-carbon extruded aluminum' },
]

export default function Brief({
  initial,
  onFindNames,
  onOpenQuestions,
  soundFX,
  xp = 0,
  hunterRank,
  briefStep = 'input',
  onBriefStepChange,
}) {
  const [name, setName] = useState(initial?.name || 'Loom & Carbon')
  const [description, setDescription] = useState(
    initial?.description ||
      'An independent industrial craft atelier creating modular architectural furniture, heritage shelving, and solid joinery tables from reclaimed urban hardwood and low-carbon extruded aluminum. Designed uncompromisingly for generational longevity, disassembled flat-pack circularity, and visible exposed fasteners that invite repair rather than disposal. We balance brutalist physical honesty with whisper-quiet Scandinavian refinement: zero synthetic veneers, zero fast-trend planned obsolescence, and zero greenwashed claims.'
  )
  const [competitors, setCompetitors] = useState(
    initial?.competitors || 'Article, Floyd, Maiden Home, Herman Miller, sustainable, heirloom, modular'
  )
  const [tld, setTld] = useState(initial?.tld || '.com')
  const [isFocused, setIsFocused] = useState(false)

  const canSubmit = Boolean(name.trim() || description.trim() || competitors.trim())
  const charCount = description.length
  const charMax = 1000
  const charPercent = Math.min(100, Math.round((charCount / charMax) * 100))
  const totalSegments = 10
  const activeSegments = Math.round((charPercent / 100) * totalSegments)

  const handleChipClick = (seed) => {
    if (soundFX) soundFX.playCoin()
    if (description.includes(seed.snippet)) return
    const updated = description.trim()
      ? `${description.trim()} Also embracing ${seed.snippet}.`
      : seed.snippet
    setDescription(updated.slice(0, charMax))
  }

  const handleExampleClick = (ex) => {
    if (soundFX) soundFX.playCoin()
    setName(ex.label)
    setDescription(ex.snippet)
  }

  const handleTldChange = (ext) => {
    if (soundFX) soundFX.playLock()
    setTld(ext)
  }

  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (!canSubmit) return
    if (soundFX) soundFX.playSpin()
    // Directly launches search and goes straight to Results — NO POPUP!
    onFindNames({ name, description, competitors, tld })
  }

  return (
    <div className="relative w-full h-full select-text">
      {/* ============================================================== */}
      {/* VIEW 1A: PRIMARY QUICK ENTRY (Matching media_1790426178643.jpg) */}
      {/* ============================================================== */}
      {briefStep === 'input' && (
        <form onSubmit={handleSubmit} className="relative w-full h-full overflow-hidden select-none">
          
          {/* Drifting 8-bit Pixel Clouds over the painted sky */}
          <div className="absolute top-[3%] left-[10%] animate-cloud-slow opacity-75 pointer-events-none select-none">
            <svg width="56" height="20" viewBox="0 0 68 24" fill="none">
              <rect x="12" width="40" height="24" fill="white" />
              <rect x="0" y="8" width="68" height="16" fill="white" />
            </svg>
          </div>
          <div className="absolute top-[6%] right-[14%] animate-cloud-fast opacity-70 pointer-events-none select-none">
            <svg width="44" height="16" viewBox="0 0 52 20" fill="none">
              <rect x="10" width="32" height="20" fill="white" />
              <rect x="0" y="6" width="52" height="14" fill="white" />
            </svg>
          </div>

          {/* 1. Real Interactive Text Input Box (Seamless Inset Coverage) */}
          <div
            className="absolute z-20 flex items-center"
            style={{ left: '9.3%', top: '54.5%', width: '67.8%', height: '10.2%' }}
          >
            <div className="relative w-full h-full">
              <input
                type="text"
                value={name}
                autoFocus
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Loom & Carbon, Nimbus, Velvet..."
                className="w-full h-full bg-[#faf8f5] border-none outline-none font-terminal text-[24px] sm:text-[28px] tracking-wide text-[#1f1d1a] caret-[#ff2a8d] px-2.5 flex items-center rounded-xs"
              />
              {/* Subtle pink laser scan line on focus */}
              {isFocused && <div className="input-scanner-line" />}
            </div>
          </div>

          {/* 2. Pink Arrow Button ➔ (Navigates to Strategic Flavor Step) */}
          <button
            type="button"
            onClick={() => {
              if (soundFX) soundFX.playLock()
              if (onBriefStepChange) onBriefStepChange('flavor')
            }}
            className="absolute z-20 cursor-pointer rounded-xs hover:shadow-[0_0_14px_rgba(255,42,141,0.7)] hover:bg-[#ff2a8d]/15 active:translate-y-0.5 active:bg-black/20 transition-all"
            style={{ left: '81.58%', top: '53.60%', width: '11.57%', height: '12.06%' }}
            title="Customize brand flavor and competitors"
          >
            <span className="sr-only">Customize brand flavor</span>
          </button>

          {/* 3. TLD Selector Buttons (.com, .io, .ai) */}
          {/* Active Overlay if .io is selected */}
          {tld === '.io' && (
            <>
              {/* Inactive overlay over .com */}
              <div
                className="absolute z-20 rounded-xs font-pixel text-[10px] sm:text-[11px] font-bold flex items-center justify-center bg-[#faf8f5] text-black border-2 border-[#1f1d1a] shadow-[0_2px_0_#000] pointer-events-none"
                style={{ left: '18.26%', top: '69.37%', width: '10.96%', height: '7.89%' }}
              >
                .com
              </div>
              {/* Active overlay over .io */}
              <div
                className="absolute z-20 rounded-xs font-pixel text-[10px] sm:text-[11px] font-bold flex items-center justify-center bg-[#1f1d1a] text-white border-2 border-black shadow-[0_0_8px_rgba(255,42,141,0.6),0_2px_0_#ff2a8d] pointer-events-none"
                style={{ left: '30.59%', top: '69.37%', width: '9.44%', height: '7.89%' }}
              >
                .io
              </div>
            </>
          )}

          {/* Active Overlay if .ai is selected */}
          {tld === '.ai' && (
            <>
              {/* Inactive overlay over .com */}
              <div
                className="absolute z-20 rounded-xs font-pixel text-[10px] sm:text-[11px] font-bold flex items-center justify-center bg-[#faf8f5] text-black border-2 border-[#1f1d1a] shadow-[0_2px_0_#000] pointer-events-none"
                style={{ left: '18.26%', top: '69.37%', width: '10.96%', height: '7.89%' }}
              >
                .com
              </div>
              {/* Active overlay over .ai */}
              <div
                className="absolute z-20 rounded-xs font-pixel text-[10px] sm:text-[11px] font-bold flex items-center justify-center bg-[#1f1d1a] text-white border-2 border-black shadow-[0_0_8px_rgba(255,42,141,0.6),0_2px_0_#ff2a8d] pointer-events-none"
                style={{ left: '40.94%', top: '69.37%', width: '9.44%', height: '7.89%' }}
              >
                .ai
              </div>
            </>
          )}

          {/* Clickable hitboxes for TLDs */}
          <button
            type="button"
            onClick={() => handleTldChange('.com')}
            className="absolute z-25 cursor-pointer rounded-xs hover:bg-black/5 active:bg-black/15 transition-colors"
            style={{ left: '18.26%', top: '69.37%', width: '10.96%', height: '7.89%' }}
            title="Prefer .com domains"
          >
            <span className="sr-only">.com</span>
          </button>

          <button
            type="button"
            onClick={() => handleTldChange('.io')}
            className="absolute z-25 cursor-pointer rounded-xs hover:bg-black/5 active:bg-black/15 transition-colors"
            style={{ left: '30.59%', top: '69.37%', width: '9.44%', height: '7.89%' }}
            title="Prefer .io domains"
          >
            <span className="sr-only">.io</span>
          </button>

          <button
            type="button"
            onClick={() => handleTldChange('.ai')}
            className="absolute z-25 cursor-pointer rounded-xs hover:bg-black/5 active:bg-black/15 transition-colors"
            style={{ left: '40.94%', top: '69.37%', width: '9.44%', height: '7.89%' }}
            title="Prefer .ai domains"
          >
            <span className="sr-only">.ai</span>
          </button>

          {/* 4. Strategic Flavor Link */}
          <button
            type="button"
            onClick={() => {
              if (soundFX) soundFX.playLock()
              if (onBriefStepChange) onBriefStepChange('flavor')
            }}
            className="absolute z-20 cursor-pointer font-mono text-[10px] sm:text-[11px] text-[#615b50] hover:text-[#ff2a8d] hover:underline flex items-center gap-1 text-right justify-end"
            style={{ left: '55.0%', top: '70.5%', width: '38.0%', height: '6.0%' }}
          >
            <span>[+] Add flavor &amp; negative keywords</span>
          </button>

          {/* 5. Example Ideas Clickable Zones */}
          {EXAMPLE_IDEAS.map((ex, idx) => {
            const positions = [
              { left: '21.76%', width: '13.39%' },
              { left: '36.23%', width: '12.63%' },
              { left: '50.23%', width: '13.24%' },
              { left: '64.54%', width: '12.94%' },
              { left: '78.23%', width: '12.94%' },
            ]
            const pos = positions[idx]
            return (
              <button
                key={ex.label}
                type="button"
                onClick={() => handleExampleClick(ex)}
                title={`Click to use idea: ${ex.label}`}
                className="absolute z-20 cursor-pointer rounded-xs border border-transparent hover:border-[#ff2a8d] hover:bg-[#ff2a8d]/15 active:scale-95 transition-all text-transparent"
                style={{
                  left: pos.left,
                  top: '82.37%',
                  width: pos.width,
                  height: '4.64%',
                }}
              >
                {ex.label}
              </button>
            )
          })}
        </form>
      )}

      {/* ============================================================== */}
      {/* VIEW 1B: STRATEGIC FLAVOR & COMPETITORS (Matching flavor benchmark) */}
      {/* ============================================================== */}
      {briefStep === 'flavor' && (
        <div className="relative w-full h-full overflow-y-auto p-3 sm:p-4 font-mono select-text bg-[#faf8f5]/95 custom-retro-scroll">
          <form onSubmit={handleSubmit} className="max-w-[620px] mx-auto space-y-3.5">
            
            {/* Header with Title and Close */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#ff2a8d] text-white px-2 py-0.5 font-pixel text-[10px] font-bold">
                  02 // BRAND FLAVOR &amp; DESCRIPTION
                </span>
                <span className="font-pixel text-[10px] text-[#22c55e] animate-pulse">👾</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-black">
                  <span className="text-[#ff2a8d] font-bold">{charCount}</span> / {charMax} ({charPercent}%)
                </span>
                <button
                  type="button"
                  onClick={onOpenQuestions}
                  className="arcade-btn-white size-6 flex items-center justify-center font-pixel text-[10px] cursor-pointer"
                  title="Questions"
                >
                  ?
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (soundFX) soundFX.playLock()
                    if (onBriefStepChange) onBriefStepChange('input')
                  }}
                  className="arcade-btn-pink size-6 flex items-center justify-center font-pixel text-[10px] cursor-pointer"
                  title="Close and return to input"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Creative Energy Meter */}
            <div className="bg-[#1a1816] p-1.5 border-2 border-black rounded-xs">
              <div className="flex items-center justify-between px-1 mb-1 font-pixel text-[8px] text-[#9c9384]">
                <span>CREATIVE ENERGY GAUGE</span>
                <span className="text-[#00f59b]">POTENCY [{activeSegments}/10]</span>
              </div>
              <div className="grid grid-cols-10 gap-1 h-3">
                {Array.from({ length: totalSegments }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-full transition-all duration-200 ${
                      idx < activeSegments
                        ? 'bg-[#ff2a8d] shadow-[0_0_6px_#ff2a8d]'
                        : 'bg-[#332f2a]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Flavor Seed Chips */}
            <div>
              <p className="font-pixel text-[8px] text-[#736d61] mb-1">
                ✨ CLICK TO INJECT FLAVOR SEED CHIPS (+10%):
              </p>
              <div className="flex flex-wrap gap-1">
                {FLAVOR_SEEDS.map((seed) => (
                  <button
                    key={seed.label}
                    type="button"
                    onClick={() => handleChipClick(seed)}
                    className="border border-black bg-white hover:bg-black hover:text-white px-2 py-0.5 font-pixel text-[8px] font-bold cursor-pointer rounded-xs transition-colors"
                  >
                    {seed.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand Description Textarea */}
            <div>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, charMax))}
                placeholder="Describe tone, market, audience, aesthetic adjectives, physical materials..."
                className="w-full border-2 border-black bg-white p-2.5 font-mono text-[11px] text-black outline-none focus:border-[#ff2a8d] leading-relaxed rounded-xs"
              />
            </div>

            {/* Competitors & Keywords to Avoid */}
            <div className="pt-2 border-t border-[#ded5c2]">
              <div className="flex items-center justify-between mb-1">
                <span className="bg-black text-white px-2 py-0.5 font-pixel text-[9px]">
                  03 // COMPETITORS &amp; KEYWORDS TO AVOID
                </span>
                <span className="text-[#22c55e] font-pixel text-[8px] flex items-center gap-1">
                  <span>🛡️</span>
                  <span>COLLISION SHIELD ACTIVE</span>
                </span>
              </div>
              <input
                type="text"
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                placeholder="e.g. Article, Floyd, Herman Miller, sustainable, modular..."
                className="w-full border-2 border-black bg-white p-2 font-mono text-[11px] text-black outline-none focus:border-[#ff2a8d] rounded-xs"
              />
            </div>

            {/* Bottom Actions inside Flavor Mode */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  if (soundFX) soundFX.playLock()
                  if (onBriefStepChange) onBriefStepChange('input')
                }}
                className="arcade-btn-white px-4 py-1.5 font-mono text-[11px] font-bold rounded cursor-pointer"
              >
                ← BACK
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="arcade-btn-pink px-6 py-2 font-pixel text-[11px] tracking-wider rounded font-bold cursor-pointer disabled:opacity-40"
              >
                GENERATE RESULTS ➔
              </button>
            </div>

          </form>
        </div>
      )}
    </div>
  )
}
