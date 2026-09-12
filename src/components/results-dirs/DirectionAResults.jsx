import { useState } from 'react'
import { PixelDivider, PixelDino, PixelHeart, PixelSparkle } from '../pixel/PixelElements.jsx'

/**
 * DIRECTION A: The Terminal Ledger
 *
 * Structural Distinction:
 * Strictly a single-column, high-density table-like ledger (row items with inline domain,
 * availability badge, TLD alternatives, and quick actions), keeping scan lines ultra-linear
 * while the regenerate trigger sits in a sticky bottom arcade HUD dock anchored above the viewport edge.
 */
export default function DirectionAResults({
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
    <div className="notebook-grid relative min-h-screen pb-32 pt-6 px-4 sm:px-10 text-black font-meta">
      <div className="mx-auto max-w-[960px]">
        {/* Top Header Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-black text-white px-2 py-0.5 font-pixel text-[10px]">
                LEDGER VIEW // 01-COL
              </span>
              <span className="font-mono text-[11px] text-[#737373]">DENSE SCAN MODE</span>
            </div>
            <h1 className="font-pixel text-[24px] sm:text-[30px] text-black">
              BATCH CANDIDATES FOR: {brief.name || 'YOUR BRAND'}
            </h1>
          </div>

          {/* Filters Bar */}
          <div className="flex items-center gap-2 border-2 border-black bg-white p-1.5 pixel-shadow">
            <span className="font-pixel text-[9px] uppercase px-1 text-[#737373]">TLD:</span>
            {['any', '.com', '.io', '.ai'].map((tld) => (
              <button
                key={tld}
                type="button"
                onClick={() => onFiltersChange({ ...filters, tld })}
                className={`px-2 py-0.5 font-mono text-[11px] font-bold border ${
                  filters.tld === tld
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-transparent hover:border-black'
                }`}
              >
                {tld}
              </button>
            ))}
          </div>
        </div>

        {/* High-Density Terminal Ledger Table Container */}
        <div className="border-4 border-black bg-white pixel-shadow">
          {/* Table Header Row */}
          <div className="grid grid-cols-12 gap-3 border-b-4 border-black bg-[#faf8f5] px-5 py-3 font-pixel text-[10px] uppercase text-[#737373]">
            <div className="col-span-4 sm:col-span-4">SUBJECT / BRAND</div>
            <div className="col-span-4 sm:col-span-4">PRIMARY DOMAIN &amp; STATUS</div>
            <div className="hidden sm:block sm:col-span-2">EXTENSIONS</div>
            <div className="col-span-4 sm:col-span-2 text-right">ACTIONS</div>
          </div>

          {/* Ledger Row Items */}
          <div className="divide-y-2 divide-black">
            {results.map((r, idx) => {
              const fullDomain = `${r.domain}${r.tld}`
              const isAvail = r.state === 'available'
              const isShort = shortlist.some((s) => s.domain === r.domain)
              const isComp = compareSel.some((s) => s.domain === r.domain)

              return (
                <div
                  key={r.domain}
                  className="grid grid-cols-12 gap-3 items-center px-5 py-4 hover:bg-[#fff9fb] transition-colors"
                >
                  {/* Subject Name */}
                  <div className="col-span-4 sm:col-span-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-[#737373]">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="font-pixel text-[15px] sm:text-[17px] text-black">
                        {r.name}
                      </span>
                    </div>
                  </div>

                  {/* Primary Domain & Availability Badge */}
                  <div className="col-span-4 sm:col-span-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`font-mono text-[13px] sm:text-[14px] font-bold ${
                          isAvail ? 'text-black' : 'text-[#8a8a8a] line-through'
                        }`}
                      >
                        {fullDomain}
                      </span>
                      <span
                        className={`font-pixel text-[9px] px-2 py-0.5 border ${
                          isAvail
                            ? 'bg-[#22c55e] text-black border-black font-bold'
                            : 'bg-[#faf8f5] text-[#737373] border-[#cac4d0]'
                        }`}
                      >
                        {isAvail ? 'FREE' : 'TAKEN'}
                      </span>
                    </div>
                  </div>

                  {/* Ext Alternatives */}
                  <div className="hidden sm:flex sm:col-span-2 items-center gap-1.5 font-mono text-[11px]">
                    {['.io', '.ai'].map((ext) => (
                      <span
                        key={ext}
                        className="border border-[#e5e5e5] px-1.5 py-0.2 text-[#737373]"
                      >
                        {ext}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="col-span-4 sm:col-span-2 flex items-center justify-end gap-2 font-mono text-[11px] font-bold">
                    <button
                      type="button"
                      onClick={() => copy(fullDomain)}
                      className="border border-black px-2 py-1 hover:bg-black hover:text-white transition-colors"
                      title="Copy Domain"
                    >
                      {copiedDomain === fullDomain ? 'COPIED!' : 'COPY'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleShortlist(r)}
                      className={`border px-2 py-1 transition-colors ${
                        isShort
                          ? 'border-[#ff2a8d] bg-[#ff2a8d] text-white'
                          : 'border-black bg-white hover:bg-black hover:text-white'
                      }`}
                      title="Save to Shortlist"
                    >
                      ★
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Brand Question Inline Alert if active */}
        {pendingQuestion && (
          <div className="mt-6 border-4 border-black bg-white p-5 pixel-shadow">
            <div className="flex items-center gap-2 font-pixel text-[11px] text-[#ff2a8d] mb-2">
              <PixelSparkle className="size-4 text-[#ff2a8d]" />
              <span>SHARPEN NEXT ROLL WITH BRAND QUESTION:</span>
            </div>
            <p className="font-mono text-[13px] font-bold text-black mb-3">{pendingQuestion}</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                placeholder="Type answer to steer next batch..."
                className="flex-1 border-2 border-black p-2 font-mono text-[12px] outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  onAnswerFollowUp(answerDraft)
                  setAnswerDraft('')
                }}
                className="bg-[#ff2a8d] border-2 border-black text-white px-4 font-pixel text-[11px]"
              >
                APPLY &gt;
              </button>
            </div>
          </div>
        )}
      </div>

      {/* FIXED / FLOATING BOTTOM ARCADE DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t-4 border-black bg-white/95 backdrop-blur px-4 py-3.5 shadow-2xl">
        <div className="mx-auto flex max-w-[960px] items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <PixelDino className="size-5 text-[#22c55e]" />
            <span className="font-pixel text-[11px] text-black">BATCH 01 // 5 NAMES SHOWN</span>
            <span className="font-mono text-[11px] text-[#737373]">
              SHORTLISTED: {shortlist.length}
            </span>
          </div>

          {/* Centered / Prominent Regenerate HUD Button */}
          <button
            type="button"
            onClick={onRegenerate}
            className="w-full sm:w-auto border-4 border-black bg-[#ff2a8d] px-8 py-3 font-pixel text-[14px] text-white pixel-shadow hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3"
          >
            <span>[ REGENERATE 5 MORE CANDIDATES ]</span>
            <span className="bg-black px-2 py-0.5 text-[10px] text-white">KEY: [R]</span>
          </button>
        </div>
      </div>
    </div>
  )
}
