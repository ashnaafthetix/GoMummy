import React, { useState } from 'react'
import PhotorealLED from './PhotorealLED.jsx'

/**
 * Photorealistic Tape Deck & Batch History Scrubber.
 * Inspired by Teenage Engineering TP-7 and Dieter Rams reel-to-reel recorders.
 * Allows rewinding and stepping through all rolled candidate batches in memory.
 */
export default function TapeDeckScrubber({
  historyIndex = 0,
  totalBatches = 1,
  onRewind,
  onForward,
  soundFX,
  className = '',
}) {
  const canRewind = historyIndex > 0
  const canForward = historyIndex < totalBatches - 1
  const [isSpinning, setIsSpinning] = useState(false)

  const triggerSpoolAnimation = () => {
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 300)
  }

  const handleRewindClick = (e) => {
    e.stopPropagation()
    if (!canRewind) return
    triggerSpoolAnimation()
    if (soundFX) soundFX.playTick()
    if (onRewind) onRewind()
  }

  const handleForwardClick = (e) => {
    e.stopPropagation()
    if (!canForward) return
    triggerSpoolAnimation()
    if (soundFX) soundFX.playTick()
    if (onForward) onForward()
  }

  return (
    <div
      className={`hardware-inset-panel rounded-xl px-2.5 py-1.5 flex items-center gap-2.5 select-none font-mono ${className}`}
      title="Session Tape Deck: Scrub through previously rolled candidate batches"
    >
      {/* Mechanical Spool Assembly */}
      <div className="flex items-center gap-1.5">
        {/* Left Tape Spool Hub */}
        <div
          className={`w-4 h-4 rounded-full border border-neutral-400 bg-gradient-to-tr from-[#cac4b8] to-[#ffffff] relative flex items-center justify-center transition-transform duration-300 shadow-2xs ${
            isSpinning ? '-rotate-180' : ''
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#1e1c18]" />
          <div className="absolute w-full h-[0.5px] bg-neutral-400" />
        </div>

        {/* Right Tape Spool Hub */}
        <div
          className={`w-4 h-4 rounded-full border border-neutral-400 bg-gradient-to-tr from-[#cac4b8] to-[#ffffff] relative flex items-center justify-center transition-transform duration-300 shadow-2xs ${
            isSpinning ? '-rotate-180' : ''
          }`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#1e1c18]" />
          <div className="absolute w-full h-[0.5px] bg-neutral-400" />
        </div>
      </div>

      {/* Mechanical Odometer / Batch Counter */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#181715] text-white border border-neutral-700 shadow-inner">
        <PhotorealLED status="pink" size={6} />
        <span className="text-[10px] font-bold tracking-widest text-[#ff2a85]">
          REEL
        </span>
        <span className="text-[10px] font-bold text-neutral-300">
          0{historyIndex + 1}/0{totalBatches}
        </span>
      </div>

      {/* Tactile Hardware Transport Controls */}
      <div className="flex items-center gap-1">
        {/* Rewind ⏪ */}
        <button
          type="button"
          onClick={handleRewindClick}
          disabled={!canRewind}
          title={canRewind ? 'Rewind to previous batch' : 'At earliest batch'}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
            canRewind
              ? 'bg-white border-neutral-300 text-neutral-800 hover:border-black active:translate-y-0.5 shadow-2xs'
              : 'bg-neutral-200/50 border-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          REW ⏪
        </button>

        {/* Forward ⏩ */}
        <button
          type="button"
          onClick={handleForwardClick}
          disabled={!canForward}
          title={canForward ? 'Step forward to next batch' : 'At latest batch'}
          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer border ${
            canForward
              ? 'bg-white border-neutral-300 text-neutral-800 hover:border-black active:translate-y-0.5 shadow-2xs'
              : 'bg-neutral-200/50 border-neutral-200 text-neutral-400 cursor-not-allowed'
          }`}
        >
          FWD ⏩
        </button>
      </div>
    </div>
  )
}
