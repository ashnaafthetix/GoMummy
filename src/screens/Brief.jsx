import { useState } from 'react'
import { PixelDivider, PixelDino, PixelHeart, PixelSparkle } from '../components/pixel/PixelElements.jsx'

/**
 * GoMummy S1 Brief — Direction 1: The Hero Omnibox with Pixel HUD Drawer
 *
 * Populated State & Deliberate Decision Design:
 * - Dominant central pixel-bordered search textarea front-and-center
 * - Populated initial state with rich ~1,000 char description
 * - Expandable pixel HUD drawer open with live character capacity gauge
 * - TLD preference control with pixel badges
 * - Primary "Find names" button styled with chunky 4px retro pixel shadow
 */
export default function Brief({ initial, onFindNames, onOpenQuestions }) {
  const [name, setName] = useState(initial?.name || 'Loom & Carbon')
  const [description, setDescription] = useState(
    initial?.description ||
      'An independent industrial craft atelier creating modular architectural furniture, heritage shelving, and solid joinery tables from reclaimed urban hardwood and low-carbon extruded aluminum. Designed uncompromisingly for generational longevity, disassembled flat-pack circularity, and visible exposed fasteners that invite repair rather than disposal. We balance brutalist physical honesty with whisper-quiet Scandinavian refinement: zero synthetic veneers, zero fast-trend planned obsolescence, and zero greenwashed carbon offsets. We celebrate honest wear, oiled grain patinas, hand-stamped serial stamps, and quiet workshop utility.'
  )
  const [competitors, setCompetitors] = useState(
    initial?.competitors || 'Article, Floyd, Maiden Home, Herman Miller, sustainable, heirloom, modular'
  )
  const [tld, setTld] = useState(initial?.tld || '.com')
  const [drawerOpen, setDrawerOpen] = useState(true)

  const canSubmit = name.trim() || description.trim() || competitors.trim()
  const charCount = description.length
  const charMax = 1000
  const charPercent = Math.min(100, Math.round((charCount / charMax) * 100))

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    onFindNames({ name, description, competitors, tld })
  }

  return (
    <main className="notebook-grid flex min-h-[calc(100vh-65px)] flex-col justify-between px-4 py-8 sm:px-12 sm:py-12 text-black selection:bg-[#ff2a8d] selection:text-white">
      <div className="mx-auto w-full max-w-[820px]">
        {/* Top Micro Header HUD */}
        <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-8">
          <div className="flex items-center gap-2.5">
            <PixelDino className="size-6 text-[#22c55e]" />
            <span className="font-pixel text-[13px] tracking-wider text-black">GOMUMMY // SYSTEM v1.0</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-[#ff2a8d] px-2.5 py-0.5 font-pixel text-[10px] text-white">
              S1 // BRIEF SPEC
            </span>
            <span className="border-2 border-black bg-white px-2 py-0.5 font-mono text-[11px] font-bold text-black">
              [3-INPUT ACTIVE]
            </span>
          </div>
        </div>

        {/* Hero Title Block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 border-2 border-black bg-black px-3.5 py-1 mb-3">
            <PixelSparkle className="size-3.5 text-[#ff2a8d]" />
            <span className="font-pixel text-[10px] tracking-widest text-white uppercase">
              SUBJECT CHECK &amp; ON-BRAND GENERATOR
            </span>
          </div>
          <h1 className="font-pixel text-[28px] sm:text-[40px] leading-tight tracking-tight text-black">
            DOMAIN SEARCH IS OUR ART
          </h1>
          <p className="mt-2 font-mono text-[13px] uppercase tracking-wider text-[#4a4a4a]">
            FIND A DOMAIN &amp; BRAND NAME YOU CAN ACTUALLY OWN
          </p>
        </div>

        {/* Main Omnibox + HUD Drawer Form Container */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="border-4 border-black bg-white p-6 sm:p-8 pixel-shadow transition-shadow focus-within:shadow-[6px_6px_0px_0px_#ff2a8d]">
            {/* Primary Field 01: Name / Subject */}
            <div className="flex items-center justify-between border-b-2 border-black pb-2.5 mb-3">
              <label className="font-pixel text-[12px] text-black flex items-center gap-2">
                <span className="text-[#ff2a8d]">&gt;</span>
                <span>01 // PRIMARY SUBJECT NAME:</span>
              </label>
              <span className="font-mono text-[10px] uppercase font-bold text-[#737373]">
                {name.trim() ? '[STATUS: SPECIFIED]' : '[OPTIONAL IF FLAVOR GIVEN]'}
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Loom & Carbon, Nimbus, Velvet..."
                className="w-full bg-transparent font-pixel text-[22px] sm:text-[28px] text-black outline-none placeholder:text-[#c0c0c0]"
              />
            </div>

            {/* Omnibox Divider & HUD Toggle Bar */}
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-[#e5e5e5] pt-4">
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="flex items-center gap-2.5 border-2 border-black bg-[#faf8f5] px-4 py-1.5 font-mono text-[11px] font-bold uppercase transition-colors hover:bg-black hover:text-white"
              >
                <span className="font-pixel text-[12px]">{drawerOpen ? '[-]' : '[+]'}</span>
                <span>{drawerOpen ? 'COLLAPSE SECONDARY HUD' : 'EXPAND BRAND FLAVOR & CONSTRAINTS'}</span>
                <span className="bg-[#ff2a8d] px-1.5 py-0.5 font-pixel text-[9px] text-white">
                  POPULATED
                </span>
              </button>

              {/* TLD Preference Control */}
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold uppercase text-[#737373]">PREFER TLD:</span>
                <div className="flex items-center gap-1.5">
                  {['.com', '.io', '.ai'].map((ext) => (
                    <button
                      key={ext}
                      type="button"
                      onClick={() => setTld(ext)}
                      className={`px-3 py-1 font-mono text-[11px] font-bold border-2 transition-all ${
                        tld === ext
                          ? 'border-black bg-black text-white pixel-shadow'
                          : 'border-[#cac4d0] bg-white text-black hover:border-black'
                      }`}
                    >
                      {ext}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Expandable Pixel HUD Drawer: Description & Competitors */}
            {drawerOpen && (
              <div className="mt-5 space-y-5 border-2 border-black bg-[#faf8f5] p-4 sm:p-6 transition-all">
                {/* Field 02: Description / Flavor */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase text-[#171717] mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-black text-white px-1.5 py-0.5 font-pixel text-[9px]">02</span>
                      <span>BRAND FLAVOR / DESCRIPTION</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#ff2a8d]">{charCount} / {charMax} CHARS</span>
                      <span className="text-[#737373]">({charPercent}%)</span>
                    </div>
                  </div>

                  {/* Character gauge bar */}
                  <div className="h-1.5 w-full bg-[#e5e5e5] border border-black mb-2 overflow-hidden">
                    <div
                      className="h-full bg-[#ff2a8d] transition-all duration-300"
                      style={{ width: `${charPercent}%` }}
                    />
                  </div>

                  <textarea
                    rows={5}
                    maxLength={charMax}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tone, market, persona, physical materials, design aesthetics..."
                    className="w-full border-2 border-black bg-white p-3.5 font-mono text-[12px] leading-[19px] text-[#0a0a0a] outline-none focus:border-[#ff2a8d] transition-colors"
                  />
                  <p className="mt-1 font-mono text-[10px] text-[#737373]">
                    Shapes generative direction, linguistic tone, and semantic metaphor clusters.
                  </p>
                </div>

                {/* Field 03: Competitors & Keywords */}
                <div>
                  <div className="flex items-center justify-between font-mono text-[11px] font-bold uppercase text-[#171717] mb-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-black text-white px-1.5 py-0.5 font-pixel text-[9px]">03</span>
                      <span>COMPETITORS &amp; KEYWORDS TO AVOID</span>
                    </div>
                    <span className="border border-black bg-white px-2 py-0.5 font-mono text-[9px] text-[#ff2a8d] font-bold">
                      COLLISION SHIELD ACTIVE
                    </span>
                  </div>

                  <input
                    type="text"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    placeholder="e.g. Article, Floyd, Herman Miller, sustainable, modular..."
                    className="w-full border-2 border-black bg-white p-3 font-mono text-[12px] text-[#0a0a0a] outline-none focus:border-[#ff2a8d] transition-colors"
                  />
                  <p className="mt-1 font-mono text-[10px] text-[#737373]">
                    Prevents naming collisions and steers clear of crowded trademark territories.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={onOpenQuestions}
              className="flex items-center gap-2 font-mono text-[12px] font-bold text-[#4a4a4a] hover:text-black transition-colors"
            >
              <PixelHeart className="size-4 text-[#ff2a8d]" />
              <span>Sharpen with brand questions →</span>
            </button>

            {/* Primary Action Button: "Find names" */}
            <button
              type="submit"
              disabled={!canSubmit}
              className="border-4 border-black bg-[#ff2a8d] px-10 py-4 font-pixel text-[15px] tracking-wider text-white pixel-shadow hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Find names &gt;
            </button>
          </div>
        </form>
      </div>

      {/* Decorative Bottom Pixel Jagged Trim */}
      <div className="mx-auto w-full max-w-[820px] mt-12">
        <PixelDivider color="#ff2a8d" height={16} />
      </div>
    </main>
  )
}
