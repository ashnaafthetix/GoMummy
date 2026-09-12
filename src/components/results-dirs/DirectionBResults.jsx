import { useState } from 'react'
import { PixelDivider, PixelDino, PixelHeart, PixelSparkle } from '../pixel/PixelElements.jsx'

/**
 * DIRECTION B: The Modular Arcade Grid
 *
 * Structural Distinction:
 * A balanced 2-column chunky card grid where each name is treated as an arcade cartridge card
 * with generous breathing room, and the regenerate control sits directly in the top sticky header
 * beside the filter pills (Regenerate 5 More [R]).
 */
export default function DirectionBResults({
  brief,
  results,
  filters,
  onFiltersChange,
  shortlist,
  compareSel,
  pendingQuestion,
  onRegenerate,
  onToggleShortlist,
  onToggleCompare,
  onAnswerFollowUp,
  onSkipFollowUp,
}) {
  const [copiedDomain, setCopiedDomain] = useState(null)
  const [answerDraft, setAnswerDraft] = useState('')

  const copy = async (fullDomain) => {
    try {
      await navigator.clipboard.writeText(fullDomain)
    } catch {}
    setCopiedDomain(fullDomain)
    setTimeout(() => setCopiedDomain((d) => (d === fullDomain ? null : d)), 1500)
  }

  return (
    <div className="notebook-grid relative min-h-screen pb-16 pt-6 px-4 sm:px-10 text-black font-meta">
      <div className="mx-auto max-w-[1080px]">
        {/* Top Sticky Header with Direct Regenerate Control */}
        <div className="sticky top-16 z-30 mb-8 border-4 border-black bg-white p-4 sm:p-5 pixel-shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#ff2a8d] text-white px-2 py-0.5 font-pixel text-[10px]">
                  ARCADE GRID // 02-COL
                </span>
                <span className="font-mono text-[11px] text-[#737373]">MODULAR CARTRIDGE CARDS</span>
              </div>
              <h1 className="font-pixel text-[22px] sm:text-[26px] text-black mt-1">
                AVAILABLE CANDIDATES FOR {brief.name || 'YOUR PROJECT'}
              </h1>
            </div>

            {/* Top Regenerate Action Docked with Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1 border-2 border-black p-1 bg-[#faf8f5]">
                {['any', '.com', '.io', '.ai'].map((tld) => (
                  <button
                    key={tld}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, tld })}
                    className={`px-2 py-0.5 font-mono text-[11px] font-bold border transition-colors ${
                      filters.tld === tld
                        ? 'bg-black text-white border-black'
                        : 'bg-transparent text-black border-transparent hover:border-black'
                    }`}
                  >
                    {tld}
                  </button>
                ))}
              </div>

              {/* Top Regenerate Button */}
              <button
                type="button"
                onClick={onRegenerate}
                className="border-3 border-black bg-[#ff2a8d] px-5 py-2 font-pixel text-[12px] text-white pixel-shadow hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center gap-2"
              >
                <span>REGENERATE 5 MORE</span>
                <span className="bg-black px-1.5 py-0.2 text-[9px] text-white">[R]</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2-Column Balanced Arcade Cartridge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {results.map((r, idx) => {
            const fullDomain = `${r.domain}${r.tld}`
            const isAvail = r.state === 'available'
            const isShort = shortlist.some((s) => s.domain === r.domain)
            const isComp = compareSel.some((s) => s.domain === r.domain)

            return (
              <div
                key={r.domain}
                className="border-4 border-black bg-white p-6 pixel-shadow flex flex-col justify-between transition-transform hover:-translate-y-1"
              >
                <div>
                  {/* Cartridge Header Bar */}
                  <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-4">
                    <span className="bg-black text-white px-2 py-0.5 font-pixel text-[10px]">
                      SLOT {String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-pixel text-[10px] px-2.5 py-0.5 border-2 ${
                        isAvail
                          ? 'border-black bg-[#22c55e] text-black font-bold'
                          : 'border-[#cac4d0] bg-[#faf8f5] text-[#737373]'
                      }`}
                    >
                      {isAvail ? 'AVAILABLE' : 'TAKEN'}
                    </span>
                  </div>

                  {/* Name */}
                  <h3 className="font-pixel text-[24px] sm:text-[28px] text-black leading-tight">
                    {r.name}
                  </h3>

                  {/* Domain */}
                  <p
                    className={`mt-2 font-mono text-[16px] font-bold ${
                      isAvail ? 'text-black' : 'text-[#8a8a8a] line-through'
                    }`}
                  >
                    {fullDomain}
                  </p>

                  {/* Also free section */}
                  <div className="mt-4 flex items-center gap-2 font-mono text-[11px] border-t-2 border-dashed border-[#e5e5e5] pt-3">
                    <span className="font-pixel text-[9px] text-[#737373] uppercase">Also check:</span>
                    {['.io', '.ai'].map((ext) => (
                      <span
                        key={ext}
                        className="border border-black bg-[#faf8f5] px-2 py-0.5 font-bold"
                      >
                        {r.domain}{ext}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="mt-6 flex items-center justify-between border-t-2 border-black pt-3">
                  <button
                    type="button"
                    onClick={() => copy(fullDomain)}
                    className="font-mono text-[11px] font-bold border border-black px-3 py-1 bg-[#faf8f5] hover:bg-black hover:text-white transition-colors"
                  >
                    {copiedDomain === fullDomain ? 'COPIED!' : 'COPY DOMAIN'}
                  </button>

                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <button
                      type="button"
                      onClick={() => onToggleShortlist(r)}
                      className={`border px-3 py-1 font-bold transition-colors ${
                        isShort
                          ? 'border-[#ff2a8d] bg-[#ff2a8d] text-white'
                          : 'border-black bg-white hover:bg-black hover:text-white'
                      }`}
                    >
                      {isShort ? 'SHORTLISTED ★' : 'SHORTLIST'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleCompare(r)}
                      className={`border px-3 py-1 font-bold transition-colors ${
                        isComp
                          ? 'border-black bg-black text-white'
                          : 'border-[#cac4d0] bg-white hover:border-black'
                      }`}
                    >
                      COMPARE
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Brand Follow-up Question Drawer */}
        {pendingQuestion && (
          <div className="mt-8 border-4 border-black bg-white p-6 pixel-shadow">
            <div className="flex items-center gap-2 font-pixel text-[11px] text-[#ff2a8d] mb-2">
              <PixelDino className="size-5 text-[#22c55e]" />
              <span>FOLLOW-UP PROMPT TO SHARPEN NEXT BATCH:</span>
            </div>
            <p className="font-mono text-[14px] font-bold text-black mb-3">{pendingQuestion}</p>
            <div className="flex gap-3">
              <input
                type="text"
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                placeholder="Your answer..."
                className="flex-1 border-2 border-black p-2.5 font-mono text-[12px] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  onAnswerFollowUp(answerDraft)
                  setAnswerDraft('')
                }}
                className="bg-[#ff2a8d] border-2 border-black text-white px-5 font-pixel text-[12px]"
              >
                APPLY &gt;
              </button>
            </div>
          </div>
        )}

        <div className="mt-12">
          <PixelDivider color="#ff2a8d" height={14} />
        </div>
      </div>
    </div>
  )
}
