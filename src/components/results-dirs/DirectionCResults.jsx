import { useState } from 'react'
import { PixelDivider, PixelDino, PixelHeart, PixelSparkle } from '../pixel/PixelElements.jsx'

/**
 * DIRECTION C: The Continuous Feed with In-Stream Break Cards
 *
 * Structural Distinction:
 * A medium-density vertical stack of full-width modular cards separated by pixel zig-zag borders,
 * where the regenerate action acts as an in-stream terminal divider card pinned at the very bottom
 * of the batch ([+] ROLL NEXT 5 CANDIDATES), pushing answered brand questions directly into the feed.
 */
export default function DirectionCResults({
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
    <div className="notebook-grid relative min-h-screen pb-20 pt-6 px-4 sm:px-10 text-black font-meta">
      <div className="mx-auto max-w-[800px]">
        {/* Continuous Stream Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-black text-white px-3 py-1 font-pixel text-[10px] mb-2">
            <span>FEED STREAM // 1-COL CONTINUOUS</span>
          </div>
          <h1 className="font-pixel text-[26px] sm:text-[32px] text-black">
            CANDIDATE DISCOVERY STREAM
          </h1>
          <p className="font-mono text-[12px] text-[#737373] mt-1">
            GENERATED FOR: {brief.name || 'YOUR BRAND'} • 5 CANDIDATES IN CURRENT BATCH
          </p>
        </div>

        {/* In-Stream Card Stack */}
        <div className="space-y-6">
          {results.map((r, idx) => {
            const fullDomain = `${r.domain}${r.tld}`
            const isAvail = r.state === 'available'
            const isShort = shortlist.some((s) => s.domain === r.domain)
            const isComp = compareSel.some((s) => s.domain === r.domain)

            return (
              <div
                key={r.domain}
                className="border-4 border-black bg-white pixel-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Card Micro Strip */}
                  <div className="flex items-center justify-between border-b-2 border-black pb-2.5 mb-3">
                    <span className="font-mono text-[11px] font-bold text-[#737373]">
                      STREAM ITEM #{String(idx + 1).padStart(2, '0')}
                    </span>
                    <span
                      className={`font-pixel text-[10px] px-2.5 py-0.5 border ${
                        isAvail
                          ? 'bg-[#22c55e] text-black border-black font-bold'
                          : 'bg-[#faf8f5] text-[#737373] border-[#cac4d0]'
                      }`}
                    >
                      {isAvail ? 'AVAILABLE' : 'TAKEN'}
                    </span>
                  </div>

                  {/* Main Identity Row */}
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div>
                      <h2 className="font-pixel text-[24px] sm:text-[30px] text-black">
                        {r.name}
                      </h2>
                      <p
                        className={`mt-1 font-mono text-[15px] font-bold ${
                          isAvail ? 'text-black' : 'text-[#8a8a8a] line-through'
                        }`}
                      >
                        {fullDomain}
                      </p>
                    </div>

                    {/* Quick Inline Actions */}
                    <div className="flex items-center gap-2 font-mono text-[11px] font-bold">
                      <button
                        type="button"
                        onClick={() => copy(fullDomain)}
                        className="border border-black px-3 py-1 bg-[#faf8f5] hover:bg-black hover:text-white transition-colors"
                      >
                        {copiedDomain === fullDomain ? 'COPIED!' : 'COPY'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onToggleShortlist(r)}
                        className={`border px-3 py-1 transition-colors ${
                          isShort
                            ? 'border-[#ff2a8d] bg-[#ff2a8d] text-white'
                            : 'border-black bg-white hover:bg-black hover:text-white'
                        }`}
                      >
                        {isShort ? 'SHORTLISTED ★' : 'SHORTLIST'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* In-Stream Perforated Divider */}
                <PixelDivider color="#000000" height={10} />
              </div>
            )
          })}

          {/* IN-STREAM REGENERATE DIVIDER CARD (Positioned at bottom of batch) */}
          <div className="border-4 border-black bg-[#faf8f5] p-6 text-center pixel-shadow transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-center gap-2 font-pixel text-[11px] text-[#ff2a8d] mb-2">
              <PixelSparkle className="size-4 text-[#ff2a8d]" />
              <span>BATCH COMPLETE</span>
            </div>
            <h3 className="font-pixel text-[18px] text-black mb-1">
              WANT TO EXPLORE MORE ANGLES?
            </h3>
            <p className="font-mono text-[12px] text-[#737373] mb-5">
              Roll 5 fresh candidates tailored to your brand keywords and collision filters.
            </p>

            <button
              type="button"
              onClick={onRegenerate}
              className="w-full sm:w-auto border-4 border-black bg-[#ff2a8d] px-8 py-3.5 font-pixel text-[14px] text-white pixel-shadow hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all inline-flex items-center justify-center gap-3"
            >
              <span>[+] ROLL NEXT 5 CANDIDATES</span>
              <span className="bg-black text-white px-2 py-0.5 text-[10px]">[R]</span>
            </button>
          </div>

          {/* In-Stream Brand Follow-up Question Card if active */}
          {pendingQuestion && (
            <div className="border-4 border-[#ff2a8d] bg-white p-6 pixel-shadow">
              <div className="flex items-center gap-2 font-pixel text-[11px] text-black mb-2">
                <span className="bg-[#ff2a8d] text-white px-2 py-0.5">IN-STREAM PROMPT</span>
                <span>ANSWER TO SHARPEN SUBSEQUENT BATCHES:</span>
              </div>
              <p className="font-mono text-[14px] font-bold text-black mb-3">{pendingQuestion}</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={answerDraft}
                  onChange={(e) => setAnswerDraft(e.target.value)}
                  placeholder="Answer here..."
                  className="flex-1 border-2 border-black p-2 font-mono text-[12px] outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    onAnswerFollowUp(answerDraft)
                    setAnswerDraft('')
                  }}
                  className="bg-black text-white px-5 font-pixel text-[11px]"
                >
                  SUBMIT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
