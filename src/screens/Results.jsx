import { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import { PixelDivider, PixelDino, PixelHeart, PixelSparkle } from '../components/pixel/PixelElements.jsx'

const TLD_OPTIONS = ['any', '.com', '.io', '.ai']
const LENGTH_OPTIONS = [
  { key: 'any', label: 'ANY' },
  { key: 'short', label: 'SHORT (≤10)' },
  { key: 'long', label: 'LONG (>10)' },
]

function matchesFilters(item, filters) {
  if (filters.tld !== 'any' && item.tld !== filters.tld) return false
  if (filters.length === 'short' && item.domain.length > 10) return false
  if (filters.length === 'long' && item.domain.length <= 10) return false
  return true
}

/**
 * GoMummy S2 Results Screen:
 * - Direction B: Top sticky control header with filters & sole "Regenerate 5 More [R]" action.
 * - Direction C: Single-column continuous card feed.
 * - Direction B features in Direction C cards: 'Also check' extension strip + 'Compare' action toggle.
 * - Bottom "roll next 5 candidates" card removed.
 */
export default function Results({
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
  onNavigateToBrief,
}) {
  const [copiedDomain, setCopiedDomain] = useState(null)
  const [answerDraft, setAnswerDraft] = useState('')

  const visible = results.filter((r) => matchesFilters(r, filters))

  const copy = async (fullDomain) => {
    try {
      await navigator.clipboard.writeText(fullDomain)
    } catch {
      // clipboard permission fallback
    }
    setCopiedDomain(fullDomain)
    setTimeout(() => setCopiedDomain((d) => (d === fullDomain ? null : d)), 1500)
  }

  return (
    <main className="notebook-grid min-h-[calc(100vh-65px)] pb-24 pt-6 px-4 sm:px-10 text-black font-meta selection:bg-[#ff2a8d] selection:text-white">
      <div className="mx-auto max-w-[860px]">
        {/* TOP STICKY CONTROL HEADER (from Direction B) */}
        <div className="sticky top-16 z-30 mb-8 border-4 border-black bg-white p-4 sm:p-5 pixel-shadow">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <PixelDino className="size-5 text-[#22c55e]" />
                <span className="bg-black text-white px-2 py-0.5 font-pixel text-[10px]">
                  S2 // RESULTS FEED
                </span>
                <span className="font-mono text-[11px] text-[#737373]">1-COL CARD STREAM</span>
                {onNavigateToBrief && (
                  <button
                    type="button"
                    onClick={onNavigateToBrief}
                    className="ml-2 border-2 border-black bg-[#faf8f5] px-2.5 py-0.5 font-mono text-[10px] font-bold text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    ← EDIT BRIEF (S1)
                  </button>
                )}
              </div>
              <div className="mt-1.5">
                <p className="font-meta text-[11px] font-bold uppercase tracking-[1px] text-[#737373]">
                  AVAILABLE NAMES FOR
                </p>
                <h1 className="font-pixel text-[22px] sm:text-[28px] text-black leading-tight">
                  {brief.name || 'YOUR BRAND'}
                </h1>
              </div>
            </div>

            {/* Top Controls: TLD + Length + Sole Regenerate Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              {/* TLD Filters */}
              <div className="flex items-center gap-1 border-2 border-black bg-[#faf8f5] p-1">
                <span className="font-pixel text-[9px] uppercase px-1.5 text-[#737373]">TLD:</span>
                {TLD_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, tld: opt })}
                    className={`px-2 py-0.5 font-mono text-[11px] font-bold border transition-colors ${
                      filters.tld === opt
                        ? 'bg-black text-white border-black'
                        : 'bg-transparent text-black border-transparent hover:border-black'
                    }`}
                  >
                    {opt === 'any' ? 'ALL' : opt}
                  </button>
                ))}
              </div>

              {/* Length Filters */}
              <div className="hidden sm:flex items-center gap-1 border-2 border-black bg-[#faf8f5] p-1">
                {LENGTH_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => onFiltersChange({ ...filters, length: opt.key })}
                    className={`px-2 py-0.5 font-mono text-[11px] font-bold border transition-colors ${
                      filters.length === opt.key
                        ? 'bg-black text-white border-black'
                        : 'bg-transparent text-black border-transparent hover:border-black'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Sole Regenerate Control */}
              <button
                type="button"
                onClick={onRegenerate}
                disabled={pendingQuestion !== null}
                className="border-3 border-black bg-[#ff2a8d] px-5 py-2 font-pixel text-[12px] text-white pixel-shadow hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                <span>REGENERATE 5 MORE</span>
                <span className="bg-black px-1.5 py-0.2 text-[9px] text-white">[R]</span>
              </button>
            </div>
          </div>
        </div>

        {/* Batch Info Sub-bar */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-6">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff2a8d] text-white px-2 py-0.5 font-pixel text-[10px]">
              BATCH 01 // 5 GENERATED CANDIDATES
            </span>
            <span className="font-mono text-[11px] text-[#737373]">
              SHOWING {visible.length} OF {results.length} CANDIDATES
            </span>
          </div>
          <span className="font-mono text-[11px] text-[#737373]">
            SHORTLISTED ({shortlist.length}) • COMPARING ({compareSel.length}/2)
          </span>
        </div>

        {/* SINGLE-COLUMN CARD STACK (from Direction C + Direction B features) */}
        {visible.length === 0 ? (
          <div className="border-4 border-black bg-white p-8 text-center pixel-shadow">
            <p className="font-pixel text-[14px] text-black">NO CANDIDATES MATCH FILTER SETTINGS.</p>
            <button
              type="button"
              onClick={() => onFiltersChange({ tld: 'any', length: 'any' })}
              className="mt-4 border-2 border-black bg-[#faf8f5] px-4 py-2 font-mono text-[12px] font-bold hover:bg-black hover:text-white transition-colors"
            >
              RESET ALL FILTERS
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {visible.map((r, idx) => {
              const isShort = shortlist.some((s) => s.domain === r.domain)
              const isComp = compareSel.some((s) => s.domain === r.domain)

              return (
                <ResultCard
                  key={r.domain}
                  slotNumber={idx + 1}
                  name={r.name}
                  domain={r.domain}
                  tld={r.tld}
                  availability={r.state}
                  tlds={['.io', '.ai']}
                  copiedDomain={copiedDomain}
                  onCopy={copy}
                  isShortlisted={isShort}
                  onToggleShortlist={() => onToggleShortlist(r)}
                  isCompared={isComp}
                  onToggleCompare={() => onToggleCompare(r)}
                />
              )
            })}
          </div>
        )}

        {/* IN-STREAM BRAND QUESTION CARD (surfaces after 3 regens without selection) */}
        {pendingQuestion && (
          <div className="mt-8 border-4 border-[#ff2a8d] bg-white p-6 sm:p-8 pixel-shadow">
            <div className="flex items-center gap-2 font-pixel text-[11px] text-black mb-3">
              <span className="bg-[#ff2a8d] text-white px-2.5 py-1">IN-STREAM PROMPT</span>
              <span className="font-bold">ANSWER TO SHARPEN SUBSEQUENT BATCHES:</span>
            </div>
            <p className="font-mono text-[15px] font-bold text-black mb-4">{pendingQuestion}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <textarea
                rows={2}
                autoFocus
                value={answerDraft}
                onChange={(e) => setAnswerDraft(e.target.value)}
                placeholder="Type answer to steer next batch..."
                className="flex-1 border-2 border-black p-3 font-mono text-[13px] outline-none focus:border-[#ff2a8d]"
              />
              <div className="flex sm:flex-col gap-2 shrink-0">
                <button
                  type="button"
                  disabled={!answerDraft.trim()}
                  onClick={() => {
                    onAnswerFollowUp(answerDraft)
                    setAnswerDraft('')
                  }}
                  className="flex-1 border-2 border-black bg-black text-white px-6 py-2 font-pixel text-[11px] hover:bg-[#ff2a8d] disabled:opacity-40 transition-colors"
                >
                  APPLY ANSWER
                </button>
                <button
                  type="button"
                  onClick={onSkipFollowUp}
                  className="border-2 border-[#cac4d0] bg-white px-4 py-2 font-mono text-[11px] font-bold hover:border-black transition-colors"
                >
                  SKIP
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Decorative Zig-Zag Trim */}
        <div className="mt-14">
          <PixelDivider color="#ff2a8d" height={16} />
        </div>
      </div>
    </main>
  )
}
