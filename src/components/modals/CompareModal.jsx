import { useEffect, useState } from 'react'
import { PixelDivider, PixelDino, PixelSparkle } from '../pixel/PixelElements.jsx'

export default function CompareModal({
  compareSel = [],
  onRemove,
  onClose,
  onToggleShortlist,
  shortlist = [],
  soundFX,
}) {
  const [copiedDomain, setCopiedDomain] = useState(null)

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (soundFX) soundFX.playLock()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, soundFX])

  const copy = async (domain) => {
    try {
      await navigator.clipboard.writeText(domain)
    } catch {
      // fallback
    }
    if (soundFX) soundFX.playAvailable()
    setCopiedDomain(domain)
    setTimeout(() => setCopiedDomain(null), 1500)
  }

  const handleRemove = (item) => {
    if (soundFX) soundFX.playUnlock()
    onRemove(item)
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[940px] my-auto border-4 border-black bg-[#faf8f5] p-6 sm:p-8 pixel-shadow-pink animate-popup-spring"
      >
        {/* Modal Top Strip */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 mb-6 gap-3">
          <div className="flex items-center gap-2.5">
            <PixelDino className="size-6 text-[#22c55e]" />
            <span className="bg-black text-white px-2.5 py-0.5 font-pixel text-[11px]">
              HEAD-TO-HEAD DUEL
            </span>
            <span className="font-mono text-[11px] text-[#737373]">
              COMPARING [{compareSel.length}/2]
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              if (soundFX) soundFX.playLock()
              onClose()
            }}
            className="flex items-center gap-1.5 border-2 border-black bg-white px-3 py-1 font-pixel text-[10px] hover:bg-black hover:text-white transition-colors pixel-btn cursor-pointer"
          >
            <span>[✕ CLOSE]</span>
            <span className="text-[#737373]">[ESC]</span>
          </button>
        </div>

        {/* Modal Main Content */}
        {compareSel.length === 0 ? (
          <div className="border-3 border-dashed border-black bg-white p-10 text-center space-y-4">
            <div className="inline-block p-3 border-2 border-black bg-[#faf8f5] animate-bounce">
              <span className="text-3xl">⚔️</span>
            </div>
            <h3 className="font-pixel text-[18px] text-black">NO CANDIDATES IN COMPARISON YET</h3>
            <p className="font-mono text-[12px] text-[#737373] max-w-[440px] mx-auto">
              Click <span className="text-[#ff2a8d] font-bold">[COMPARE]</span> on any 2 cards in the Results feed to inspect them side by side in this arena.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="border-2 border-black bg-[#ff2a8d] px-6 py-2.5 font-pixel text-[11px] text-white pixel-btn-pink cursor-pointer"
            >
              RETURN TO RESULTS FEED →
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Side-by-Side Cards Arena */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative items-stretch">
              {compareSel.map((item, idx) => {
                const fullDomain = `${item.domain}${item.tld}`
                const isAvail = item.state === 'available'
                const isShort = shortlist.some((s) => s.domain === item.domain)
                const isCopied = copiedDomain === fullDomain

                return (
                  <div
                    key={item.domain}
                    className="relative border-4 border-black bg-white p-6 pixel-shadow flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Header Strip */}
                      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                        <span className="bg-black text-white px-2 py-0.5 font-pixel text-[9px]">
                          FIGHTER 0{idx + 1}
                        </span>
                        <span
                          className={`font-pixel text-[9px] px-2 py-0.5 border-2 inline-flex items-center gap-1 ${
                            isAvail
                              ? 'border-black bg-[#22c55e] text-black font-bold'
                              : 'border-[#cac4d0] bg-[#faf8f5] text-[#737373]'
                          }`}
                        >
                          {isAvail && <span className="size-1.5 bg-black animate-ping" />}
                          <span>{isAvail ? 'AVAILABLE' : 'TAKEN'}</span>
                        </span>
                      </div>

                      {/* Brand Name & Primary Domain */}
                      <h3 className="font-pixel text-[24px] sm:text-[28px] text-black leading-tight tracking-tight">
                        {item.name}
                      </h3>
                      <p
                        className={`mt-1 font-mono text-[15px] font-bold ${
                          isAvail ? 'text-black' : 'text-[#8a8a8a] line-through'
                        }`}
                      >
                        {fullDomain}
                      </p>

                      {/* Comparison Details Table */}
                      <div className="mt-5 space-y-2.5 border-t-2 border-dashed border-[#e5e5e5] pt-3 font-mono text-[11px]">
                        <div className="flex justify-between items-center">
                          <span className="text-[#737373] uppercase">PRIMARY TLD:</span>
                          <span className="font-bold text-black">{item.tld}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#737373] uppercase">CHAR LENGTH:</span>
                          <span className="font-bold text-black">{item.domain.length} CHARACTERS</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#737373] uppercase">PRONUNCIATION:</span>
                          <span className="font-bold text-black">NATURAL / CRISP</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[#737373] uppercase">ALT EXTENSIONS:</span>
                          <span className="font-bold text-black">
                            {(item.tlds && item.tlds.length > 0
                              ? item.tlds
                              : ['.com', '.io', '.ai'].filter((t) => t !== item.tld)
                            )
                              .map((t) => `${(typeof t === 'string' ? t : t.ext || t.tld).toUpperCase()} (CHECK)`)
                              .join(' • ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-2 border-t-2 border-black pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => copy(fullDomain)}
                          className={`border-2 border-black px-3 py-1 font-mono text-[11px] font-bold pixel-btn cursor-pointer ${
                            isCopied ? 'bg-black text-white' : 'bg-[#faf8f5] hover:bg-black hover:text-white'
                          }`}
                        >
                          {isCopied ? 'COPIED! ✓' : 'COPY'}
                        </button>
                        {onToggleShortlist && (
                          <button
                            type="button"
                            onClick={() => onToggleShortlist(item)}
                            className={`border-2 px-3 py-1 font-mono text-[11px] font-bold pixel-btn cursor-pointer ${
                              isShortShort(isShort)
                                ? 'border-[#ff2a8d] bg-[#ff2a8d] text-white'
                                : 'border-black bg-white hover:bg-black hover:text-white'
                            }`}
                          >
                            {isShort ? 'SAVED ★' : 'SHORTLIST'}
                          </button>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="border-2 border-[#cac4d0] bg-white px-2.5 py-1 font-mono text-[10px] font-bold text-[#737373] hover:border-black hover:text-black transition-colors pixel-btn cursor-pointer"
                      >
                        REMOVE
                      </button>
                    </div>
                  </div>
                )
              })}

              {/* Waiting for 2nd card placeholder if only 1 is selected */}
              {compareSel.length === 1 && (
                <div className="border-4 border-dashed border-[#cac4d0] bg-white/60 p-8 flex flex-col items-center justify-center text-center">
                  <div className="p-3 border-2 border-black bg-white mb-3">
                    <PixelSparkle className="size-6 text-[#ff2a8d] animate-spin" />
                  </div>
                  <h4 className="font-pixel text-[14px] text-black">WAITING FOR CHALLENGER 02</h4>
                  <p className="font-mono text-[11px] text-[#737373] mt-1 max-w-[260px]">
                    Select one more candidate from your search results to compare head-to-head.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-4 border-2 border-black bg-black text-white px-4 py-1.5 font-pixel text-[10px] pixel-btn cursor-pointer"
                  >
                    PICK SECOND CANDIDATE →
                  </button>
                </div>
              )}
            </div>

            {/* Centered Duel Emblem between side-by-side cards */}
            {compareSel.length === 2 && (
              <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none items-center justify-center">
                <div className="border-4 border-black bg-[#ff2a8d] px-3.5 py-2 font-pixel text-[14px] text-white shadow-[4px_4px_0px_0px_#000] animate-bounce">
                  ⚡ VS ⚡
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Decorative Divider */}
        <div className="mt-8">
          <PixelDivider color="#ff2a8d" height={12} />
        </div>
      </div>
    </div>
  )
}

function isShortShort(isShort) {
  return isShort
}
