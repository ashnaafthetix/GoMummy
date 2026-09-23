/**
 * ResultCard — Canonical Shared Component for GoMummy
 *
 * Implements the approved retro-pixel visual language (Direction B & C hybrid):
 * - Slot badge (SLOT 01) & availability status (AVAILABLE / TAKEN)
 * - Headline brand name in bold pixel font (Silkscreen)
 * - Primary domain with strikethrough styling when taken
 * - Inline actions: COPY DOMAIN & SHORTLIST (★)
 * - 'Also check:' alternative TLD extension strip with COMPARE (✓) docked at bottom right
 * - Perforated jagged bottom pixel trim divider
 *
 * Props:
 *  - name: string (e.g. 'Loom & Carbon')
 *  - domain: string (e.g. 'loomandcarbon')
 *  - tld: string (e.g. '.com')
 *  - availability / state: 'available' | 'taken' | 'loading'
 *  - tlds: array of strings or objects for alternative extensions (e.g. ['.io', '.ai'])
 *  - slotNumber: number or string (e.g. 1)
 *  - onCopy, onToggleShortlist, isShortlisted, onToggleCompare, isCompared, copiedDomain
 */
import { useState } from 'react'
import { PixelDivider, PixelSparkle } from './pixel/PixelElements.jsx'
import { useDecryptedText } from '../utils/useDecryptedText.js'

export default function ResultCard({
  name,
  domain,
  tld = '.com',
  state,
  availability,
  tlds = ['.io', '.ai'],
  slotNumber = 1,
  className = '',
  onCopy,
  onToggleShortlist,
  isShortlisted = false,
  onToggleCompare,
  isCompared = false,
  copiedDomain,
  isLocked = false,
  onToggleLock,
  enableDecryption = true,
  soundFX,
}) {
  const [burst, setBurst] = useState(false)
  const currentStatus = availability || state || 'available'
  const isChecking = currentStatus === 'checking'
  const isAvail = currentStatus === 'available'
  const fullDomain = `${domain}${tld}`
  const isCopied = copiedDomain === fullDomain

  // Decryption cipher scramble for brand name & domain (only for unlocked slots)
  const displayName = useDecryptedText(name, name, enableDecryption && !isLocked)
  const displaySlug = useDecryptedText(domain, domain, enableDecryption && !isLocked)
  const displayFullDomain = `${displaySlug}${tld}`

  const handleShortlistClick = () => {
    if (!isShortlisted) {
      setBurst(true)
      if (soundFX) soundFX.playCoin()
      setTimeout(() => setBurst(false), 900)
    }
    if (onToggleShortlist) onToggleShortlist()
  }

  const handleLockClick = () => {
    if (soundFX) {
      if (isLocked) soundFX.playUnlock()
      else soundFX.playLock()
    }
    if (onToggleLock) onToggleLock()
  }

  const handleCopyClick = () => {
    if (soundFX) soundFX.playAvailable()
    if (onCopy) onCopy(fullDomain)
  }

  const animDelay = isLocked ? '0ms' : `${Math.min(4, Math.max(0, Number(slotNumber) - 1)) * 65}ms`

  return (
    <div
      data-slot-card="true"
      style={{ animationDelay: animDelay }}
      className={`relative border-4 bg-white overflow-hidden transition-all duration-200 ${
        isLocked
          ? 'border-[#ff2a8d] shadow-[5px_5px_0px_0px_#ff2a8d] animate-locked-pulse'
          : 'border-black pixel-shadow hover:-translate-y-1 animate-slot-reel'
      } arcade-scanlines ${className}`}
    >
      {/* Floating XP / Star Burst Notification on Shortlist */}
      {burst && (
        <div className="absolute top-4 right-20 z-50 pointer-events-none animate-sparkle-float flex items-center gap-1.5 border-2 border-black bg-[#ff2a8d] px-2.5 py-1 text-white font-pixel text-[11px] shadow-[3px_3px_0px_0px_#000]">
          <PixelSparkle className="size-3 text-white" />
          <span>+10 XP // SAVED ★</span>
        </div>
      )}
      <div className="p-6 sm:p-7">
        {/* Card Top Strip: Slot + Lock Button + Availability */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2.5 mb-4">
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 font-pixel text-[10px] ${isLocked ? 'bg-[#ff2a8d] text-white' : 'bg-black text-white'}`}>
              SLOT {String(slotNumber).padStart(2, '0')}
            </span>

            {/* HOLD / LOCK Slot Toggle */}
            {onToggleLock && (
              <button
                type="button"
                onClick={handleLockClick}
                title={isLocked ? 'Click to unlock this slot' : 'Hold this card while rolling next batch'}
                className={`flex items-center gap-1 border-2 border-black px-2 py-0.5 font-pixel text-[9px] tracking-wider transition-all pixel-btn cursor-pointer ${
                  isLocked
                    ? 'bg-[#ff2a8d] text-white font-bold shadow-[2px_2px_0px_0px_#000]'
                    : 'bg-[#faf8f5] text-black hover:bg-black hover:text-white'
                }`}
              >
                <span>{isLocked ? 'LOCKED 🔒' : 'HOLD / LOCK'}</span>
              </button>
            )}

            <span className="hidden sm:inline font-mono text-[11px] text-[#737373]">
              PRIMARY: {tld.toUpperCase()}
            </span>
          </div>
          <span
            className={`font-pixel text-[10px] px-2.5 py-0.5 border-2 inline-flex items-center gap-1.5 ${
              isChecking
                ? 'border-black bg-[#f59e0b] text-black font-bold shadow-[2px_2px_0px_0px_#000]'
                : isAvail
                ? 'border-black bg-[#22c55e] text-black font-bold shadow-[2px_2px_0px_0px_#000]'
                : 'border-[#cac4d0] bg-[#faf8f5] text-[#737373]'
            }`}
          >
            {isChecking && <span className="inline-block size-1.5 bg-black animate-ping" />}
            {isAvail && <span className="inline-block size-1.5 bg-black animate-ping" />}
            <span>{isChecking ? 'CHECKING...' : isAvail ? 'AVAILABLE' : 'TAKEN'}</span>
          </span>
        </div>

        {/* Main Name & Domain Identity Row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div className="max-w-full">
            <h2 className="font-pixel text-[24px] sm:text-[30px] text-black leading-tight tracking-tight break-words max-w-full">
              {displayName}
            </h2>
            <p
              className={`mt-1 font-mono text-[16px] font-bold break-all ${
                isChecking
                  ? 'text-[#f59e0b]'
                  : isAvail
                  ? 'text-black'
                  : 'text-[#8a8a8a] line-through'
              }`}
            >
              {displayFullDomain}
            </p>
          </div>

          {/* Primary Actions: Copy & Shortlist */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            {onCopy && (
              <button
                type="button"
                onClick={handleCopyClick}
                className={`font-bold border-2 border-black px-3 py-1.5 transition-all cursor-pointer pixel-btn ${
                  isCopied ? 'bg-black text-white shadow-[2px_2px_0px_0px_#22c55e]' : 'bg-[#faf8f5] hover:bg-black hover:text-white'
                }`}
              >
                {isCopied ? 'COPIED! ✓' : 'COPY DOMAIN'}
              </button>
            )}
            {onToggleShortlist && (
              <button
                type="button"
                onClick={handleShortlistClick}
                className={`border-2 px-3 py-1.5 font-bold transition-all cursor-pointer pixel-btn ${
                  isShortlisted
                    ? 'border-[#ff2a8d] bg-[#ff2a8d] text-white animate-coin-bling shadow-[2px_2px_0px_0px_#000]'
                    : 'border-black bg-white hover:bg-black hover:text-white'
                }`}
              >
                {isShortlisted ? 'SHORTLISTED ★' : 'SHORTLIST'}
              </button>
            )}
          </div>
        </div>

        {/* 'ALSO CHECK' EXTENSION STRIP + COMPARE BUTTON ON EXTREME RIGHT */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] border-t-2 border-dashed border-[#e5e5e5] pt-3.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="font-pixel text-[10px] text-[#737373] uppercase">
              Also check:
            </span>
            {tlds.map((extItem) => {
              const ext = typeof extItem === 'string' ? extItem : (extItem.ext || extItem.tld || '')
              const isAvailable =
                typeof extItem === 'object' && extItem.available !== undefined
                  ? extItem.available
                  : true
              return (
                <button
                  key={ext}
                  type="button"
                  onClick={() => onCopy && onCopy(`${domain}${ext}`)}
                  className={`border px-2.5 py-0.5 font-bold transition-colors cursor-pointer pixel-btn ${
                    isAvailable
                      ? 'border-black bg-[#faf8f5] text-black hover:border-[#ff2a8d] hover:bg-black hover:text-white'
                      : 'border-[#cac4d0] bg-[#f0ede6] text-[#8a8a8a] line-through'
                  }`}
                  title={isAvailable ? `Click to copy ${domain}${ext}` : `${domain}${ext} is taken`}
                >
                  {domain}{ext}
                </button>
              )
            })}
          </div>

          {/* Compare Button on Extreme Right */}
          {onToggleCompare && (
            <button
              type="button"
              onClick={onToggleCompare}
              className={`border-2 px-3 py-1 font-bold transition-all cursor-pointer pixel-btn ${
                isCompared
                  ? 'border-black bg-black text-white shadow-[2px_2px_0px_0px_#ff2a8d]'
                  : 'border-[#cac4d0] bg-white text-black hover:border-black'
              }`}
            >
              {isCompared ? 'COMPARING ✓' : 'COMPARE'}
            </button>
          )}
        </div>
      </div>

      {/* Perforated Jagged Bottom Divider */}
      <PixelDivider color="#000000" height={10} />
    </div>
  )
}
