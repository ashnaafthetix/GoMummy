/**
 * SubjectCheckBanner — S2 Job 01 Hero Component for GoMummy
 *
 * Implements the approved retro-arcade visual language (Direction B & C hybrid):
 * - Distinct, persistent top banner answering: "Is my requested brand domain free?"
 * - Prominent "TOP PICK // SUBJECT CHECK" badge with hot-pink accent & glowing beacon
 * - Headline brand name in bold Silkscreen typography
 * - Clean domain display with availability badge (AVAILABLE / TAKEN with strikethrough)
 * - Multi-TLD status chips (.com, .io, .ai)
 * - Quick actions: COPY DOMAIN, SHORTLIST (★), and COMPARE (VS)
 * - Perforated jagged bottom pixel trim divider
 */
import { useState } from 'react'
import { PixelDivider, PixelSparkle } from './pixel/PixelElements.jsx'
import { useDecryptedText } from '../utils/useDecryptedText.js'

export default function SubjectCheckBanner({
  brief,
  targetCard,
  copiedDomain,
  onCopy,
  onToggleShortlist,
  isShortlisted = false,
  onToggleCompare,
  isCompared = false,
  soundFX,
}) {
  const [burst, setBurst] = useState(false)

  if (!brief?.name || !targetCard) return null

  const isChecking = targetCard.state === 'checking'
  const isAvail = targetCard.state === 'available'
  const fullDomain = `${targetCard.domain}${targetCard.tld}`
  const isCopied = copiedDomain === fullDomain

  // Decryption cipher effect on initial render
  const displayName = useDecryptedText(targetCard.name, targetCard.name, true)
  const displaySlug = useDecryptedText(targetCard.domain, targetCard.domain, true)
  const displayFullDomain = `${displaySlug}${targetCard.tld}`

  const handleShortlistClick = () => {
    if (!isShortlisted) {
      setBurst(true)
      if (soundFX) soundFX.playCoin()
      setTimeout(() => setBurst(false), 900)
    } else {
      if (soundFX) soundFX.playLock()
    }
    onToggleShortlist && onToggleShortlist(targetCard)
  }

  const handleCompareClick = () => {
    if (soundFX) soundFX.playLock()
    onToggleCompare && onToggleCompare(targetCard)
  }

  return (
    <div className="relative mb-8 border-4 border-black bg-white pixel-shadow transition-transform">
      {/* SCANLINE / CRT ACCENT */}
      <div className="relative p-5 sm:p-7 arcade-scanlines overflow-hidden">
        {/* HEADER BADGE ROW */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff2a8d] text-white px-2.5 py-0.5 font-pixel text-[10px] tracking-wider shadow-[2px_2px_0px_0px_#000]">
              JOB 01 // TARGET DOMAIN CHECK
            </span>
            <span className="font-mono text-[10px] text-[#737373] hidden sm:inline">
              PRIMARY SUBJECT
            </span>
          </div>

          {/* AVAILABILITY BEACON BADGE */}
          <div className="flex items-center gap-2">
            {isChecking ? (
              <span className="flex items-center gap-1.5 border-2 border-black bg-[#f59e0b] px-2.5 py-0.5 font-pixel text-[10px] font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                <span className="size-2 rounded-full bg-white animate-ping" />
                CHECKING...
              </span>
            ) : isAvail ? (
              <span className="flex items-center gap-1.5 border-2 border-black bg-[#22c55e] px-2.5 py-0.5 font-pixel text-[10px] font-bold text-black shadow-[2px_2px_0px_0px_#000]">
                <span className="size-2 rounded-full bg-white animate-pulse" />
                AVAILABLE
              </span>
            ) : (
              <span className="flex items-center gap-1.5 border-2 border-black bg-black px-2.5 py-0.5 font-pixel text-[10px] font-bold text-white shadow-[2px_2px_0px_0px_#ff2a8d]">
                <span className="size-2 rounded-full bg-[#ff2a8d]" />
                TAKEN
              </span>
            )}
          </div>
        </div>

        {/* MAIN BODY: NAME + DOMAIN + ACTIONS */}
        <div className="mt-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1 max-w-full">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-pixel text-[24px] sm:text-[32px] tracking-tight text-black leading-tight break-words max-w-full">
                {displayName}
              </h2>
              {isAvail && <PixelSparkle className="size-5 text-[#ff2a8d] animate-spin" />}
            </div>

            <p
              className={`font-mono text-[16px] sm:text-[18px] tracking-tight break-all ${
                isChecking
                  ? 'text-[#f59e0b] font-bold'
                  : isAvail
                  ? 'text-black font-bold'
                  : 'text-[#737373] line-through decoration-black decoration-2'
              }`}
            >
              {displayFullDomain}
            </p>

            {/* EXTENSIONS STRIP (.com / .io / .ai) */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="font-pixel text-[9px] uppercase text-[#737373] mr-1">
                ALSO CHECK:
              </span>
              {(targetCard.tlds || ['.com', '.io', '.ai'].filter((t) => t !== targetCard.tld)).map((ext) => (
                <span
                  key={ext}
                  className="font-mono text-[11px] font-bold px-2 py-0.5 border border-black bg-[#faf8f5] text-black"
                >
                  {ext}
                </span>
              ))}
              <span className="font-mono text-[11px] text-[#737373] ml-1">
                {isAvail ? '• primary ext free' : '• check alternate tlds'}
              </span>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
            {/* COPY DOMAIN */}
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playCoin()
                onCopy && onCopy(fullDomain)
              }}
              className={`border-2 border-black px-3.5 py-2 font-pixel text-[11px] transition-all cursor-pointer ${
                isCopied
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-[#faf8f5] shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              {isCopied ? '✓ COPIED' : 'COPY DOMAIN'}
            </button>

            {/* SHORTLIST */}
            <button
              type="button"
              onClick={handleShortlistClick}
              className={`border-2 border-black px-3.5 py-2 font-pixel text-[11px] transition-all cursor-pointer ${
                isShortlisted
                  ? 'bg-[#ff2a8d] text-white shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-white text-black hover:bg-[#faf8f5] shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              {isShortlisted ? '★ SHORTLISTED' : '★ SHORTLIST'}
            </button>

            {/* COMPARE */}
            <button
              type="button"
              onClick={handleCompareClick}
              className={`border-2 border-black px-3 py-2 font-pixel text-[11px] transition-all cursor-pointer ${
                isCompared
                  ? 'bg-black text-white shadow-[2px_2px_0px_0px_#ff2a8d]'
                  : 'bg-white text-black hover:bg-[#faf8f5] shadow-[2px_2px_0px_0px_#000]'
              }`}
            >
              {isCompared ? '✓ COMPARING' : 'VS'}
            </button>
          </div>
        </div>
      </div>

      {/* JAGGED PIXEL TOOTH DIVIDER AT BOTTOM */}
      <PixelDivider color="#000000" height={10} className="mt-[-2px]" />
    </div>
  )
}
