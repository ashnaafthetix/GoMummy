import { useState, useEffect, useRef } from 'react'
import { soundFX } from '../utils/audio.js'
import { PixelDivider, PixelDino, PixelSparkle, PixelHeart } from '../components/pixel/PixelElements.jsx'
import { CANDIDATE_POOL, pickBatch } from '../data.js'

const GLYPHS = '#&X08?!*$@+='

// Scramble text hook for mechanic 3
function useDecryptedText(targetText, isTriggering = false) {
  const [displayText, setDisplayText] = useState(targetText)

  useEffect(() => {
    if (!isTriggering) {
      setDisplayText(targetText)
      return
    }

    let frame = 0
    const totalFrames = 12
    const interval = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const revealedLength = Math.floor(progress * targetText.length)

      const scrambled = targetText
        .split('')
        .map((char, idx) => {
          if (char === ' ') return ' '
          if (idx < revealedLength) return char
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')

      setDisplayText(scrambled)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setDisplayText(targetText)
      }
    }, 28)

    return () => clearInterval(interval)
  }, [targetText, isTriggering])

  return displayText
}

function ScrambleCardHeading({ text, isSpinning }) {
  const decrypted = useDecryptedText(text, isSpinning)
  return <span>{decrypted}</span>
}

export default function ArcadeLab({ onBackToApp }) {
  // Feature toggles for comparison
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [scrambleEnabled, setScrambleEnabled] = useState(true)
  const [holdEnabled, setHoldEnabled] = useState(true)
  const [ranksEnabled, setRanksEnabled] = useState(true)

  // Gamified progression state (Mechanic 5)
  const [xp, setXp] = useState(20)
  const [rollCount, setRollCount] = useState(1)
  const [unlockedAchievements, setUnlockedAchievements] = useState(['FIRST_LOOK'])
  const [toast, setToast] = useState(null)

  // Slot machine candidate feed
  const [cards, setCards] = useState(() => pickBatch(CANDIDATE_POOL).slice(0, 5))
  // Mechanic 2: Set of locked slot indices (0..4)
  const [lockedSlots, setLockedSlots] = useState(new Set())
  // Mechanic 3: Trigger state for letter decryption
  const [isSpinning, setIsSpinning] = useState(false)
  // Shortlisted set in lab
  const [shortlist, setShortlist] = useState([])
  const [copiedDomain, setCopiedDomain] = useState(null)

  // Sync audio toggle with audio engine
  useEffect(() => {
    soundFX.setMuted(!audioEnabled)
  }, [audioEnabled])

  // Compute Hunter Rank
  const getRank = (currentXp) => {
    if (currentXp >= 120) return { title: 'TRADEMARK TITAN', lvl: 4, next: 200, badgeBg: 'bg-[#ff2a8d]' }
    if (currentXp >= 70) return { title: 'BRAND ALCHEMIST', lvl: 3, next: 120, badgeBg: 'bg-[#8a2be2]' }
    if (currentXp >= 30) return { title: 'DOMAIN HUNTER', lvl: 2, next: 70, badgeBg: 'bg-[#0ea5e9]' }
    return { title: 'NOVICE SCOUT', lvl: 1, next: 30, badgeBg: 'bg-[#22c55e]' }
  }

  const currentRank = getRank(xp)

  const triggerToast = (msg, sub) => {
    setToast({ msg, sub })
    if (audioEnabled) soundFX.playFanfare()
    setTimeout(() => setToast(null), 3200)
  }

  // Handle slot lock / hold (Mechanic 2)
  const toggleLock = (idx) => {
    if (!holdEnabled) return
    setLockedSlots((prev) => {
      const next = new Set(prev)
      if (next.has(idx)) {
        next.delete(idx)
        if (audioEnabled) soundFX.playUnlock()
      } else {
        next.add(idx)
        if (audioEnabled) soundFX.playLock()
        // Reward locking with XP
        if (ranksEnabled) {
          addXp(5, 'SLOT LOCKED: HOLD ACTIVE')
        }
      }
      return next
    })
  }

  const addXp = (amount, reason = '') => {
    setXp((prev) => {
      const nextXp = prev + amount
      const oldRank = getRank(prev)
      const newRank = getRank(nextXp)
      if (newRank.lvl > oldRank.lvl) {
        triggerToast(`RANK UP! ${newRank.title}`, `Reached Level ${newRank.lvl} (+${amount} XP)`)
      }
      return nextXp
    })
  }

  // Handle spin / regenerate with HOLD & Scramble
  const spinReels = () => {
    if (audioEnabled) soundFX.playSpin()
    setIsSpinning(true)
    setRollCount((r) => r + 1)

    // Pull new candidates
    const excluded = cards.map((c) => c.domain)
    const freshBatch = pickBatch(CANDIDATE_POOL, excluded)

    setTimeout(() => {
      setCards((prev) => {
        return prev.map((oldCard, idx) => {
          if (lockedSlots.has(idx)) {
            // Keep locked card!
            return oldCard
          }
          // Swap in fresh card for unlocked slots
          return freshBatch[idx] || oldCard
        })
      })
      setIsSpinning(false)

      if (ranksEnabled) {
        addXp(2)
        if (rollCount + 1 === 5 && !unlockedAchievements.includes('HIGH_ROLLER')) {
          setUnlockedAchievements((a) => [...a, 'HIGH_ROLLER'])
          triggerToast('ACHIEVEMENT UNLOCKED: HIGH ROLLER!', 'Spun 5 candidate batches (+25 XP)')
          addXp(25)
        }
      }
    }, scrambleEnabled ? 300 : 80)
  }

  const handleShortlist = (card) => {
    const isSaved = shortlist.some((s) => s.domain === card.domain)
    if (isSaved) {
      setShortlist((s) => s.filter((item) => item.domain !== card.domain))
      if (audioEnabled) soundFX.playTaken()
    } else {
      setShortlist((s) => [...s, card])
      if (audioEnabled) soundFX.playCoin()
      if (ranksEnabled) {
        addXp(10)
        triggerToast('+10 XP // CANDIDATE SAVED!', `${card.name} added to shortlist`)
      }
    }
  }

  const copyDomain = (domain) => {
    navigator.clipboard?.writeText(domain)
    setCopiedDomain(domain)
    if (audioEnabled) soundFX.playAvailable()
    setTimeout(() => setCopiedDomain(null), 1500)
  }

  return (
    <main className="notebook-grid min-h-screen pb-24 pt-6 px-4 sm:px-10 text-black font-meta selection:bg-[#ff2a8d] selection:text-white">
      {/* Level Up / Achievement Toast Banner */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 animate-bounce flex items-center gap-3 border-4 border-black bg-[#ff2a8d] p-4 text-white pixel-shadow shadow-[6px_6px_0px_0px_#000]">
          <PixelSparkle className="size-6 text-white animate-spin" />
          <div>
            <p className="font-pixel text-[13px] tracking-wider uppercase">{toast.msg}</p>
            <p className="font-mono text-[11px] text-white/90">{toast.sub}</p>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[900px]">
        {/* Header HUD with Back Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-4 border-black bg-white p-5 pixel-shadow mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#ff2a8d] text-white px-2 py-0.5 font-pixel text-[10px]">
                GAMIFICATION SANDBOX
              </span>
              <span className="font-mono text-[11px] text-[#737373]">[PREVIEW LAB]</span>
            </div>
            <h1 className="font-pixel text-[24px] sm:text-[30px] leading-tight text-black">
              ARCADE MECHANICS LAB
            </h1>
            <p className="font-mono text-[12px] text-[#4a4a4a]">
              Test and compare mechanics: 8-Bit Audio, Slot HOLD/LOCK, Decryption Scramble, & Hunter Ranks.
            </p>
          </div>
          <button
            type="button"
            onClick={onBackToApp}
            className="border-3 border-black bg-[#faf8f5] px-4 py-2 font-mono text-[12px] font-bold text-black hover:bg-black hover:text-white transition-colors pixel-btn cursor-pointer"
          >
            ← RETURN TO GOMUMMY APP
          </button>
        </div>

        {/* MECHANIC CONTROLS & TOGGLES MATRIX */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* Box 1: 8-Bit Web Audio Synthesizer */}
          <div className="border-4 border-black bg-white p-5 pixel-shadow">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[11px] font-bold">1. 8-BIT AUDIO SYNTH</span>
                <span className="bg-black text-white px-1.5 py-0.2 font-pixel text-[9px]">
                  WEB AUDIO API
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`px-2.5 py-1 font-pixel text-[10px] border-2 border-black transition-colors cursor-pointer pixel-btn ${
                  audioEnabled ? 'bg-[#22c55e] text-black font-bold' : 'bg-[#faf8f5] text-[#8a8a8a]'
                }`}
              >
                {audioEnabled ? 'AUDIO: ON ♫' : 'AUDIO: MUTED 🔇'}
              </button>
            </div>
            <p className="font-mono text-[11px] text-[#737373] mb-3">
              Generates square/triangle wave arcade chimes mathematically in browser. Test triggers:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => soundFX.playSpin()}
                className="border-2 border-black bg-[#faf8f5] px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-black hover:text-white pixel-btn cursor-pointer"
              >
                ▶ SPIN
              </button>
              <button
                type="button"
                onClick={() => soundFX.playCoin()}
                className="border-2 border-black bg-[#faf8f5] px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-black hover:text-white pixel-btn cursor-pointer"
              >
                ▶ COIN / STAR
              </button>
              <button
                type="button"
                onClick={() => soundFX.playAvailable()}
                className="border-2 border-black bg-[#faf8f5] px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-black hover:text-white pixel-btn cursor-pointer"
              >
                ▶ AVAILABLE
              </button>
              <button
                type="button"
                onClick={() => soundFX.playTaken()}
                className="border-2 border-black bg-[#faf8f5] px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-black hover:text-white pixel-btn cursor-pointer"
              >
                ▶ TAKEN BUZZ
              </button>
              <button
                type="button"
                onClick={() => soundFX.playLock()}
                className="border-2 border-black bg-[#faf8f5] px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-black hover:text-white pixel-btn cursor-pointer"
              >
                ▶ LOCK
              </button>
              <button
                type="button"
                onClick={() => soundFX.playFanfare()}
                className="border-2 border-black bg-[#ff2a8d] text-white px-2.5 py-1 font-mono text-[10px] font-bold pixel-btn cursor-pointer"
              >
                ▶ FANFARE
              </button>
            </div>
          </div>

          {/* Box 2: Slot Machine "HOLD / LOCK" Mechanic */}
          <div className="border-4 border-black bg-white p-5 pixel-shadow">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[11px] font-bold">2. SLOT "HOLD / LOCK"</span>
                <span className="bg-[#ff2a8d] text-white px-1.5 py-0.2 font-pixel text-[9px]">
                  PRACTICAL CASINO
                </span>
              </div>
              <button
                type="button"
                onClick={() => setHoldEnabled(!holdEnabled)}
                className={`px-2.5 py-1 font-pixel text-[10px] border-2 border-black transition-colors cursor-pointer pixel-btn ${
                  holdEnabled ? 'bg-[#ff2a8d] text-white' : 'bg-[#faf8f5] text-[#8a8a8a]'
                }`}
              >
                {holdEnabled ? 'ACTIVE [ON]' : 'DISABLED'}
              </button>
            </div>
            <p className="font-mono text-[11px] text-[#737373] mb-3">
              Click <strong>[🔒 HOLD]</strong> on any card to freeze that candidate. When you spin, locked cards remain while unlocked slots reroll!
            </p>
            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span className="font-bold">CURRENTLY LOCKED:</span>
              <span className="bg-black text-white px-2 py-0.5 font-pixel text-[10px]">
                {lockedSlots.size} OF 5 SLOTS
              </span>
              {lockedSlots.size > 0 && (
                <button
                  type="button"
                  onClick={() => setLockedSlots(new Set())}
                  className="text-[#ff2a8d] underline font-bold ml-2 cursor-pointer"
                >
                  CLEAR ALL LOCKS
                </button>
              )}
            </div>
          </div>

          {/* Box 3: Decryption / Letter Scramble */}
          <div className="border-4 border-black bg-white p-5 pixel-shadow">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[11px] font-bold">3. LETTER DECRYPTION</span>
                <span className="bg-black text-white px-1.5 py-0.2 font-pixel text-[9px]">
                  CYBER TUMBLER
                </span>
              </div>
              <button
                type="button"
                onClick={() => setScrambleEnabled(!scrambleEnabled)}
                className={`px-2.5 py-1 font-pixel text-[10px] border-2 border-black transition-colors cursor-pointer pixel-btn ${
                  scrambleEnabled ? 'bg-[#22c55e] text-black font-bold' : 'bg-[#faf8f5] text-[#8a8a8a]'
                }`}
              >
                {scrambleEnabled ? 'ACTIVE [ON]' : 'DISABLED'}
              </button>
            </div>
            <p className="font-mono text-[11px] text-[#737373] mb-3">
              Text rapidly flickers through random cybernetic runes on spin before snapping into place.
            </p>
            <button
              type="button"
              onClick={() => {
                setIsSpinning(true)
                if (audioEnabled) soundFX.playSpin()
                setTimeout(() => setIsSpinning(false), 300)
              }}
              className="border-2 border-black bg-[#faf8f5] px-3 py-1 font-mono text-[11px] font-bold hover:bg-black hover:text-white pixel-btn cursor-pointer"
            >
              ▶ TRIGGER TEST SCRAMBLE
            </button>
          </div>

          {/* Box 5: Hunter Ranks & Achievements */}
          <div className="border-4 border-black bg-white p-5 pixel-shadow">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[11px] font-bold">5. HUNTER RANKS &amp; XP</span>
                <span className="bg-[#22c55e] text-black font-pixel text-[9px] font-bold">
                  PROGRESSION
                </span>
              </div>
              <button
                type="button"
                onClick={() => setRanksEnabled(!ranksEnabled)}
                className={`px-2.5 py-1 font-pixel text-[10px] border-2 border-black transition-colors cursor-pointer pixel-btn ${
                  ranksEnabled ? 'bg-[#ff2a8d] text-white' : 'bg-[#faf8f5] text-[#8a8a8a]'
                }`}
              >
                {ranksEnabled ? 'ACTIVE [ON]' : 'DISABLED'}
              </button>
            </div>
            <div className="flex items-center justify-between mb-2 font-pixel text-[11px]">
              <span className={`${currentRank.badgeBg} text-white px-2 py-0.5 border border-black`}>
                LVL {currentRank.lvl}: {currentRank.title}
              </span>
              <span className="font-bold">★ {xp} XP</span>
            </div>
            <div className="h-2 w-full bg-[#e5e5e5] border border-black mb-3 overflow-hidden">
              <div
                className="h-full bg-[#ff2a8d] transition-all duration-300"
                style={{ width: `${Math.min(100, (xp / currentRank.next) * 100)}%` }}
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => addXp(15, 'MANUAL TEST REWARD')}
                className="border-2 border-black bg-[#faf8f5] px-2.5 py-1 font-mono text-[10px] font-bold hover:bg-black hover:text-white pixel-btn cursor-pointer"
              >
                +15 XP
              </button>
              <button
                type="button"
                onClick={() => addXp(50, 'LEVEL-UP TEST')}
                className="border-2 border-black bg-black text-white px-2.5 py-1 font-mono text-[10px] font-bold pixel-btn cursor-pointer"
              >
                LEVEL UP (+50 XP)
              </button>
            </div>
          </div>
        </div>

        {/* COMBINED INTERACTIVE SLOT MACHINE ARENA */}
        <div className="border-4 border-black bg-white p-6 sm:p-8 pixel-shadow mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-4 mb-6">
            <div>
              <span className="bg-black text-white px-2 py-0.5 font-pixel text-[10px]">
                SLOT MACHINE FEED // 5 REELS
              </span>
              <h2 className="font-pixel text-[20px] sm:text-[24px] text-black mt-1">
                COMBINED ARCADE DEMONSTRATION
              </h2>
            </div>

            {/* Primary Spin Lever Button */}
            <button
              type="button"
              onClick={spinReels}
              className="border-4 border-black bg-[#ff2a8d] px-8 py-3.5 font-pixel text-[14px] text-white pixel-btn-pink active:translate-x-1 active:translate-y-1 transition-all cursor-pointer animate-neon-glow flex items-center gap-2"
            >
              <span>SPIN UNLOCKED SLOTS</span>
              <span className="bg-black px-2 py-0.5 text-[10px] text-white">[R]</span>
            </button>
          </div>

          {/* The 5 Interactive Arcade Cards */}
          <div className="space-y-4">
            {cards.map((card, idx) => {
              const isLocked = lockedSlots.has(idx)
              const isShort = shortlist.some((s) => s.domain === card.domain)
              const isAvail = card.state === 'available'
              const fullDomain = `${card.domain}${card.tld}`
              const isCopied = copiedDomain === fullDomain

              return (
                <div
                  key={`${card.domain}-${idx}`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                  className={`relative border-4 border-black transition-all p-5 sm:p-6 animate-slot-reel ${
                    isLocked
                      ? 'bg-[#fff0f6] border-[#ff2a8d] shadow-[4px_4px_0px_0px_#ff2a8d]'
                      : 'bg-white pixel-shadow hover:-translate-y-0.5'
                  }`}
                >
                  {/* Top Slot Header Bar */}
                  <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 font-pixel text-[10px] ${
                          isLocked ? 'bg-[#ff2a8d] text-white' : 'bg-black text-white'
                        }`}
                      >
                        SLOT 0{idx + 1}
                      </span>
                      <span className="font-mono text-[11px] text-[#737373]">
                        PRIMARY: {card.tld.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Mechanic 2: HOLD / LOCK Button */}
                      {holdEnabled && (
                        <button
                          type="button"
                          onClick={() => toggleLock(idx)}
                          className={`border-2 px-3 py-0.5 font-pixel text-[10px] transition-all cursor-pointer pixel-btn ${
                            isLocked
                              ? 'border-[#ff2a8d] bg-[#ff2a8d] text-white font-bold'
                              : 'border-black bg-[#faf8f5] text-black hover:bg-black hover:text-white'
                          }`}
                        >
                          {isLocked ? 'LOCKED 🔒' : 'HOLD / LOCK 🔓'}
                        </button>
                      )}

                      {/* Status badge */}
                      <span
                        className={`font-pixel text-[10px] px-2.5 py-0.5 border-2 inline-flex items-center gap-1.5 ${
                          isAvail
                            ? 'border-black bg-[#22c55e] text-black font-bold shadow-[2px_2px_0px_0px_#000]'
                            : 'border-[#cac4d0] bg-[#faf8f5] text-[#737373]'
                        }`}
                      >
                        {isAvail && <span className="inline-block size-1.5 bg-black animate-ping" />}
                        <span>{isAvail ? 'AVAILABLE' : 'TAKEN'}</span>
                      </span>
                    </div>
                  </div>

                  {/* Name with Decryption Scramble (Mechanic 3) */}
                  <div className="flex flex-wrap items-baseline justify-between gap-4">
                    <div>
                      <h3 className="font-pixel text-[24px] sm:text-[28px] text-black leading-tight">
                        <ScrambleCardHeading text={card.name} isSpinning={isSpinning && !isLocked} />
                      </h3>
                      <p
                        className={`mt-1 font-mono text-[15px] font-bold ${
                          isAvail ? 'text-black' : 'text-[#8a8a8a] line-through'
                        }`}
                      >
                        {fullDomain}
                      </p>
                    </div>

                    {/* Actions: Copy & Shortlist with Sound FX */}
                    <div className="flex items-center gap-2 font-mono text-[11px]">
                      <button
                        type="button"
                        onClick={() => copyDomain(fullDomain)}
                        className="font-bold border-2 border-black px-3 py-1.5 bg-[#faf8f5] hover:bg-black hover:text-white transition-all pixel-btn cursor-pointer"
                      >
                        {isCopied ? 'COPIED! ✓' : 'COPY DOMAIN'}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShortlist(card)}
                        className={`border-2 px-3 py-1.5 font-bold transition-all pixel-btn cursor-pointer ${
                          isShort
                            ? 'border-[#ff2a8d] bg-[#ff2a8d] text-white animate-coin-bling'
                            : 'border-black bg-white hover:bg-black hover:text-white'
                        }`}
                      >
                        {isShort ? 'SHORTLISTED ★' : 'SHORTLIST'}
                      </button>
                    </div>
                  </div>

                  {/* Bottom Jagged Pixel Divider */}
                  <div className="mt-4 pt-2 border-t border-dashed border-[#e5e5e5]">
                    <PixelDivider color={isLocked ? '#ff2a8d' : '#000000'} height={8} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center font-mono text-[12px] text-[#737373]">
          GOMUMMY ARCADE LAB // COMBINED PROTOTYPE READY FOR REVIEW
        </div>
      </div>
    </main>
  )
}
