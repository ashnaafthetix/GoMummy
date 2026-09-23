import { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import SubjectCheckBanner from '../components/SubjectCheckBanner.jsx'
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
 * - Direction B: Top sticky control header with filters & sole "Regenerate" action.
 * - Direction C: Single-column continuous card feed.
 * - Full Gamified Arcade Suite:
 *    1. Slot HOLD / LOCK mechanic: freeze favorite cards while spinning fresh candidates.
 *    2. Cyber letter scramble decryption effect on unlocked cards.
 *    3. 8-Bit Web Audio integration on all interactions.
 *    4. Live Hunter Rank progression bar & celebratory level-up banner.
 *    5. Direction B 'Also check' extension strip + 'Compare' action toggle preserved.
 */
export default function Results({
  brief,
  targetCard,
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
  soundFX,
  xp = 0,
  hunterRank,
  lockedSlots = new Set(),
  onToggleLock,
  levelUpToast,
  onDismissToast,
  apiNotice,
  onDismissNotice,
}) {
  const [copiedDomain, setCopiedDomain] = useState(null)
  const [answerDraft, setAnswerDraft] = useState('')

  const visible = results.filter((r) => matchesFilters(r, filters))
  const unlockedCount = 5 - lockedSlots.size
  const allLocked = lockedSlots.size === 5

  const copy = async (fullDomain) => {
    try {
      await navigator.clipboard.writeText(fullDomain)
    } catch {
      // clipboard permission fallback
    }
    setCopiedDomain(fullDomain)
    setTimeout(() => setCopiedDomain((d) => (d === fullDomain ? null : d)), 1500)
  }

  const handleRegenClick = () => {
    if (allLocked) return
    onRegenerate()
  }

  return (
    <main className="notebook-grid min-h-[calc(100vh-65px)] pb-24 pt-6 px-4 sm:px-10 text-black font-meta selection:bg-[#ff2a8d] selection:text-white">
      <div className="mx-auto max-w-[860px]">
        {/* CELEBRATORY LEVEL UP POP-IN BANNER */}
        {levelUpToast && (
          <div
            onClick={onDismissToast}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-50 animate-toast-slide cursor-pointer"
            title="Click to dismiss toast"
          >
            <div className="flex items-center gap-3 border-4 border-black bg-white px-6 py-3 pixel-shadow-pink hover:scale-102 transition-transform">
              <span className="text-2xl animate-bounce">🏆</span>
              <div>
                <p className="font-pixel text-[10px] text-[#ff2a8d]">RANK PROMOTION UNLOCKED!</p>
                <h4 className="font-pixel text-[16px] text-black tracking-tight">{levelUpToast.title}</h4>
              </div>
              <span className="bg-black text-white px-2 py-1 font-mono text-[10px] font-bold">
                +{xp} XP
              </span>
              {onDismissToast && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDismissToast()
                  }}
                  className="ml-2 font-pixel text-[11px] text-[#737373] hover:text-black border border-black px-1.5 py-0.5 hover:bg-[#faf8f5] transition-colors cursor-pointer"
                  title="Dismiss"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        )}

        {/* API NOTIFICATION / QUOTA LIMIT BANNER */}
        {apiNotice && (
          <div className="mb-6 border-4 border-black bg-white p-4 pixel-shadow flex items-center justify-between gap-4 arcade-scanlines">
            <div className="flex items-center gap-3">
              <span className="text-2xl animate-bounce">⚠️</span>
              <div>
                <p className="font-pixel text-[10px] text-[#ff2a8d] uppercase tracking-wider">
                  {apiNotice.isDailyLimit ? 'GEMINI QUOTA 429 NOTIFICATION' : 'AI SERVICE NOTICE'}
                </p>
                <p className="font-mono text-[12px] font-bold text-black">{apiNotice.message}</p>
                {apiNotice.suggestion && (
                  <p className="font-mono text-[11px] text-[#737373] mt-0.5">{apiNotice.suggestion}</p>
                )}
              </div>
            </div>
            {onDismissNotice && (
              <button
                type="button"
                onClick={onDismissNotice}
                className="font-pixel text-[10px] border-2 border-black bg-[#faf8f5] px-2.5 py-1 hover:bg-black hover:text-white transition-colors cursor-pointer pixel-btn"
              >
                DISMISS [✕]
              </button>
            )}
          </div>
        )}

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
                    className="ml-2 border-2 border-black bg-[#faf8f5] px-2.5 py-0.5 font-mono text-[10px] font-bold text-black hover:bg-black hover:text-white transition-colors pixel-btn cursor-pointer"
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

            {/* Top Controls: TLD + Length + Regenerate Trigger */}
            <div className="flex flex-wrap items-center gap-3">
              {/* TLD Filters */}
              <div className="flex items-center gap-1 border-2 border-black bg-[#faf8f5] p-1">
                <span className="font-pixel text-[9px] uppercase px-1.5 text-[#737373]">TLD:</span>
                {TLD_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => {
                      if (soundFX) soundFX.playLock()
                      onFiltersChange({ ...filters, tld: opt })
                    }}
                    className={`px-2 py-0.5 font-mono text-[11px] font-bold border transition-colors cursor-pointer ${
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
                    onClick={() => {
                      if (soundFX) soundFX.playLock()
                      onFiltersChange({ ...filters, length: opt.key })
                    }}
                    className={`px-2 py-0.5 font-mono text-[11px] font-bold border transition-colors cursor-pointer ${
                      filters.length === opt.key
                        ? 'bg-black text-white border-black'
                        : 'bg-transparent text-black border-transparent hover:border-black'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Sole Regenerate Control (reflects locked slots) */}
              <button
                type="button"
                onClick={handleRegenClick}
                disabled={pendingQuestion !== null || allLocked}
                title={allLocked ? 'Unlock at least 1 slot to spin' : 'Regenerate unlocked slots [R]'}
                className="border-3 border-black bg-[#ff2a8d] px-5 py-2 font-pixel text-[12px] text-white pixel-btn-pink transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer animate-neon-glow"
              >
                <span>
                  {lockedSlots.size > 0
                    ? `SPIN UNLOCKED (${unlockedCount})`
                    : 'REGENERATE 5 MORE'}
                </span>
                <span className="bg-black px-1.5 py-0.2 text-[9px] text-white">[R]</span>
              </button>
            </div>
          </div>
        </div>

        {/* JOB 01: PERSISTENT SUBJECT DOMAIN CHECK HERO BANNER */}
        <SubjectCheckBanner
          brief={brief}
          targetCard={targetCard}
          copiedDomain={copiedDomain}
          onCopy={copy}
          onToggleShortlist={onToggleShortlist}
          isShortlisted={shortlist.some((s) => s.domain === targetCard?.domain)}
          onToggleCompare={onToggleCompare}
          isCompared={compareSel.some((s) => s.domain === targetCard?.domain)}
          soundFX={soundFX}
        />

        {/* Batch Info & Gamified Arcade Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-2.5 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#ff2a8d] text-white px-2.5 py-0.5 font-pixel text-[10px] shadow-[2px_2px_0px_0px_#000]">
              JOB 02 // 5 ALTERNATIVE CANDIDATES
            </span>

            {lockedSlots.size > 0 && (
              <span className="bg-black text-white px-2 py-0.5 font-pixel text-[10px] shadow-[2px_2px_0px_0px_#ff2a8d]">
                🔒 {lockedSlots.size} HELD IN PLACE
              </span>
            )}
            <span className="font-mono text-[11px] text-[#737373]">
              SHOWING {visible.length} OF {results.length}
            </span>
          </div>

          {/* Hunter Stats & Progression */}
          <div className="flex flex-wrap items-center gap-2 font-pixel text-[10px]">
            {hunterRank && (
              <div className="flex items-center gap-1.5 border-2 border-black bg-[#faf8f5] px-2.5 py-0.5">
                <span className="text-[#ff2a8d]">RANK:</span>
                <span className="font-bold text-black">{hunterRank.title}</span>
                <span className="text-[#737373]">({xp}/{hunterRank.nextXp} XP)</span>
              </div>
            )}
            <span className={`px-2.5 py-0.5 border-2 border-black transition-colors ${shortlist.length > 0 ? 'bg-[#ff2a8d] text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-black'}`}>
              ★ {shortlist.length} SHORTLISTED
            </span>
            <span className={`px-2 py-0.5 border-2 border-black ${compareSel.length > 0 ? 'bg-black text-white shadow-[2px_2px_0px_0px_#000]' : 'bg-white text-black'}`}>
              VS {compareSel.length}/2 COMPARING
            </span>
          </div>
        </div>

        {/* SINGLE-COLUMN CARD STACK */}
        {visible.length === 0 ? (
          <div className="border-4 border-black bg-white p-8 sm:p-12 text-center pixel-shadow relative arcade-scanlines mb-6">
            <div className="inline-block bg-[#ff2a8d] text-white px-3 py-1 font-pixel text-[11px] mb-3 shadow-[2px_2px_0px_0px_#000]">
              // ZERO CANDIDATES MATCH FILTER
            </div>
            <h3 className="font-pixel text-[20px] sm:text-[24px] text-black tracking-tight">
              NO DOMAIN IDEAS FOUND
            </h3>
            <p className="mt-2 font-mono text-[13px] text-[#737373] max-w-[500px] mx-auto">
              No candidates in this batch match your active filters (<span className="font-bold text-black font-mono">TLD: {filters.tld}</span>, <span className="font-bold text-black font-mono">LENGTH: {filters.length}</span>).
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onFiltersChange({ tld: 'any', length: 'any' })}
                className="border-2 border-black bg-[#faf8f5] px-4 py-2 font-mono text-[12px] font-bold hover:bg-black hover:text-white transition-colors pixel-btn cursor-pointer"
              >
                RESET ALL FILTERS
              </button>
              <button
                type="button"
                onClick={handleRegenClick}
                className="border-2 border-black bg-[#ff2a8d] text-white px-4 py-2 font-pixel text-[11px] hover:bg-black transition-colors pixel-btn-pink cursor-pointer shadow-[2px_2px_0px_0px_#000]"
              >
                ROLL FRESH BATCH [R]
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {visible.map((r, idx) => {
              const originalIndex = results.findIndex((item) => item.domain === r.domain)
              const slotIdx = originalIndex !== -1 ? originalIndex : idx
              const isLocked = lockedSlots.has(slotIdx)
              const isShort = shortlist.some((s) => s.domain === r.domain)
              const isComp = compareSel.some((s) => s.domain === r.domain)

              return (
                <ResultCard
                  key={`${r.domain}-${slotIdx}`}
                  slotNumber={slotIdx + 1}
                  name={r.name}
                  domain={r.domain}
                  tld={r.tld}
                  availability={r.state}
                  tlds={r.tlds && r.tlds.length > 0 ? r.tlds : ['.com', '.io', '.ai'].filter((t) => t !== r.tld)}
                  copiedDomain={copiedDomain}
                  onCopy={copy}
                  isShortlisted={isShort}
                  onToggleShortlist={() => onToggleShortlist(r)}
                  isCompared={isComp}
                  onToggleCompare={() => onToggleCompare(r)}
                  isLocked={isLocked}
                  onToggleLock={() => onToggleLock && onToggleLock(slotIdx)}
                  soundFX={soundFX}
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
                  className="flex-1 border-2 border-black bg-black text-white px-6 py-2 font-pixel text-[11px] hover:bg-[#ff2a8d] disabled:opacity-40 transition-colors pixel-btn cursor-pointer"
                >
                  APPLY ANSWER
                </button>
                <button
                  type="button"
                  onClick={onSkipFollowUp}
                  className="border-2 border-[#cac4d0] bg-white px-4 py-2 font-mono text-[11px] font-bold hover:border-black transition-colors pixel-btn cursor-pointer"
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
