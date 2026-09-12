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
import { PixelDivider } from './pixel/PixelElements.jsx'

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
}) {
  const currentStatus = availability || state || 'available'
  const isAvail = currentStatus === 'available'
  const fullDomain = `${domain}${tld}`
  const isCopied = copiedDomain === fullDomain

  return (
    <div
      className={`border-4 border-black bg-white pixel-shadow overflow-hidden transition-transform hover:-translate-y-0.5 ${className}`}
    >
      <div className="p-6 sm:p-7">
        {/* Card Top Strip */}
        <div className="flex items-center justify-between border-b-2 border-black pb-2.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="bg-black text-white px-2 py-0.5 font-pixel text-[10px]">
              SLOT {String(slotNumber).padStart(2, '0')}
            </span>
            <span className="font-mono text-[11px] text-[#737373]">
              PRIMARY: {tld.toUpperCase()}
            </span>
          </div>
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

        {/* Main Name & Domain Identity Row */}
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <div>
            <h2 className="font-pixel text-[26px] sm:text-[32px] text-black leading-tight">
              {name}
            </h2>
            <p
              className={`mt-1 font-mono text-[16px] font-bold ${
                isAvail ? 'text-black' : 'text-[#8a8a8a] line-through'
              }`}
            >
              {fullDomain}
            </p>
          </div>

          {/* Primary Actions: Copy & Shortlist */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-[11px]">
            {onCopy && (
              <button
                type="button"
                onClick={() => onCopy(fullDomain)}
                className="font-bold border-2 border-black px-3 py-1.5 bg-[#faf8f5] hover:bg-black hover:text-white transition-colors cursor-pointer"
              >
                {isCopied ? 'COPIED! ✓' : 'COPY DOMAIN'}
              </button>
            )}
            {onToggleShortlist && (
              <button
                type="button"
                onClick={onToggleShortlist}
                className={`border-2 px-3 py-1.5 font-bold transition-colors cursor-pointer ${
                  isShortlisted
                    ? 'border-[#ff2a8d] bg-[#ff2a8d] text-white'
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
                <span
                  key={ext}
                  className={`border px-2.5 py-0.5 font-bold transition-colors ${
                    isAvailable
                      ? 'border-black bg-[#faf8f5] text-black'
                      : 'border-[#cac4d0] bg-[#f0ede6] text-[#8a8a8a] line-through'
                  }`}
                  title={isAvailable ? `${ext} is available` : `${ext} is taken`}
                >
                  {domain}{ext}
                </span>
              )
            })}
          </div>

          {/* Compare Button on Extreme Right */}
          {onToggleCompare && (
            <button
              type="button"
              onClick={onToggleCompare}
              className={`border-2 px-3 py-1 font-bold transition-colors cursor-pointer ${
                isCompared
                  ? 'border-black bg-black text-white'
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
