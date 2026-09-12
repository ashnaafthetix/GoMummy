import { useEffect, useState } from 'react'
import { PixelDivider, PixelSparkle, PixelHeart } from '../pixel/PixelElements.jsx'

export default function ShortlistModal({
  shortlist = [],
  onRemove,
  onClose,
  soundFX,
}) {
  const [copiedAll, setCopiedAll] = useState(false)
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

  const copySingle = async (domain) => {
    try {
      await navigator.clipboard.writeText(domain)
    } catch {
      // fallback
    }
    if (soundFX) soundFX.playAvailable()
    setCopiedDomain(domain)
    setTimeout(() => setCopiedDomain(null), 1500)
  }

  const copyAll = async () => {
    const text = shortlist.map((s) => `${s.domain}${s.tld}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // fallback
    }
    if (soundFX) soundFX.playCoin()
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
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
            <PixelSparkle className="size-6 text-[#ff2a8d] animate-spin" />
            <span className="bg-[#ff2a8d] text-white px-2.5 py-0.5 font-pixel text-[11px]">
              SAVED SHORTLIST
            </span>
            <span className="bg-black text-white px-2 py-0.5 font-pixel text-[10px]">
              ★ {shortlist.length} NAMES SAVED
            </span>
          </div>

          <div className="flex items-center gap-3">
            {shortlist.length > 0 && (
              <button
                type="button"
                onClick={copyAll}
                className={`border-2 border-black px-3.5 py-1 font-mono text-[11px] font-bold transition-all pixel-btn cursor-pointer ${
                  copiedAll ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {copiedAll ? `COPIED ALL (${shortlist.length})! ✓` : `COPY ALL (${shortlist.length})`}
              </button>
            )}

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
        </div>

        {/* Modal Main Content */}
        {shortlist.length === 0 ? (
          <div className="border-3 border-dashed border-black bg-white p-10 text-center space-y-4">
            <div className="inline-block p-3 border-2 border-black bg-[#faf8f5] animate-bounce">
              <PixelHeart className="size-8 text-[#ff2a8d]" />
            </div>
            <h3 className="font-pixel text-[18px] text-black">NO CANDIDATES SHORTLISTED YET</h3>
            <p className="font-mono text-[12px] text-[#737373] max-w-[440px] mx-auto">
              Save on-brand names from the results screen by clicking <span className="text-[#ff2a8d] font-bold">[SHORTLIST ★]</span>. Each saved name awards <span className="text-[#22c55e] font-bold">+10 XP</span> toward your Hunter Rank.
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
          <div>
            {/* Side-by-Side Responsive Grid of Saved Candidates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
              {shortlist.map((item, idx) => {
                const fullDomain = `${item.domain}${item.tld}`
                const isAvail = item.state === 'available'
                const isCopied = copiedDomain === fullDomain

                return (
                  <div
                    key={item.domain}
                    className="border-3 border-black bg-white p-5 pixel-shadow flex flex-col justify-between transition-transform hover:-translate-y-0.5"
                  >
                    <div>
                      {/* Item Header */}
                      <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-2.5">
                        <span className="bg-black text-white px-2 py-0.5 font-pixel text-[9px]">
                          ITEM #{String(idx + 1).padStart(2, '0')}
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

                      {/* Name & Domain */}
                      <h4 className="font-pixel text-[20px] sm:text-[22px] text-black leading-tight">
                        {item.name}
                      </h4>
                      <p
                        className={`mt-1 font-mono text-[14px] font-bold ${
                          isAvail ? 'text-black' : 'text-[#8a8a8a] line-through'
                        }`}
                      >
                        {fullDomain}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex items-center justify-between border-t-2 border-dashed border-[#e5e5e5] pt-2.5">
                      <button
                        type="button"
                        onClick={() => copySingle(fullDomain)}
                        className={`border-2 border-black px-3 py-1 font-mono text-[10px] font-bold pixel-btn cursor-pointer ${
                          isCopied ? 'bg-black text-white' : 'bg-[#faf8f5] hover:bg-black hover:text-white'
                        }`}
                      >
                        {isCopied ? 'COPIED! ✓' : 'COPY'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRemove(item)}
                        className="border-2 border-[#cac4d0] bg-white px-2.5 py-1 font-mono text-[10px] font-bold text-[#737373] hover:border-black hover:text-black pixel-btn cursor-pointer"
                      >
                        REMOVE (-10 XP)
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Bottom Decorative Divider */}
        <div className="mt-6">
          <PixelDivider color="#ff2a8d" height={10} />
        </div>
      </div>
    </div>
  )
}
