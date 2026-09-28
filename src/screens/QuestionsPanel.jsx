import React, { useEffect } from 'react'
import { QUESTIONS } from '../data.js'
import TorxScrew from '../components/hardware/TorxScrew.jsx'
import PhotorealLED from '../components/hardware/PhotorealLED.jsx'

/**
 * Docked Hardware Questions & Strategic Calibration Deck.
 * Replaces floating modals with a physical slide-out drawer docked to the viewport bottom.
 */
export default function QuestionsPanel({
  answers = {},
  onSave,
  onClose,
  soundFX,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (soundFX) soundFX.playTick()
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, soundFX])

  const answeredCount = QUESTIONS.filter((_, i) => Boolean((answers[i] || '').trim())).length

  return (
    <>
      {/* 1. Ambient Dark Backdrop (Click to Disengage Tray) */}
      <div
        onClick={() => {
          if (soundFX) soundFX.playTick()
          onClose()
        }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] transition-opacity cursor-pointer animate-[fadeIn_0.2s_ease-out]"
      />

      {/* 2. Docked Hardware Drawer Anchored to Bottom Viewport */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center justify-end pointer-events-none font-mono">
        <div
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-[1020px] px-2 sm:px-6 hardware-tray-slide-up"
        >
          <div className="hardware-tray-chassis relative rounded-t-[32px] sm:rounded-t-[40px] p-5 sm:p-7 max-h-[88vh] flex flex-col shadow-2xl text-neutral-800">
            
            {/* Precision Milled Metal Torx Screws in Corners */}
            <TorxScrew size={14} className="absolute left-4 top-4" />
            <TorxScrew size={14} className="absolute right-4 top-4" />

            {/* Tactile Aluminum Pull Handle / Latch Bar */}
            <div className="flex justify-center mb-3">
              <div
                onClick={() => {
                  if (soundFX) soundFX.playTick()
                  onClose()
                }}
                className="tray-handle-latch px-8 py-1.5 rounded-full flex items-center gap-3 cursor-pointer shadow-inner hover:brightness-105 active:translate-y-0.5 transition-all"
                title="Click handle to collapse / disengage calibration deck"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                  ≡ CALIBRATION DECK // CLICK HANDLE TO CLOSE
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              </div>
            </div>

            {/* Tray Header Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#dbd6cc] gap-3">
              <div className="flex items-center gap-2.5">
                <PhotorealLED status="pink" size={9} />
                <span className="px-2.5 py-0.5 bg-[#ff2a85] text-white text-xs font-black rounded shadow-2xs">
                  ? STRATEGIC CALIBRATION
                </span>
                <span className="font-display font-black text-base sm:text-lg text-neutral-900 tracking-tight">
                  BRAND DISCOVERY DECK
                </span>
                <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 text-[10px] font-bold rounded">
                  {answeredCount}/{QUESTIONS.length} CALIBRATED
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (soundFX) soundFX.playTick()
                  onClose()
                }}
                className="tactile-chiclet px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-700 hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
              >
                <span>✕</span>
                <span>DISENGAGE [ESC]</span>
              </button>
            </div>

            <p className="text-xs text-neutral-600 leading-relaxed mb-4">
              Calibrate your brand positioning, phonetic cadence, and market category constraints. Responses immediately steer future candidate synthesis.
            </p>

            {/* Scrollable Questions List */}
            <div className="space-y-4 overflow-y-auto pr-1 flex-1 max-h-[56vh]">
              {QUESTIONS.map((q, i) => {
                const isAnswered = Boolean((answers[i] || '').trim())
                return (
                  <div
                    key={q}
                    className={`bg-white rounded-xl border p-4 transition-all shadow-xs ${
                      isAnswered ? 'border-neutral-300' : 'border-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs font-bold text-neutral-900 flex items-center gap-2">
                        <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black rounded">
                          Q0{i + 1}
                        </span>
                        <span>{q}</span>
                      </p>
                      {isAnswered && (
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          ✓ ACTIVE
                        </span>
                      )}
                    </div>
                    <div className="hardware-inset-panel rounded-xl p-3 border border-[#d8d3c8]">
                      <textarea
                        value={answers[i] || ''}
                        onChange={(e) => onSave(i, e.target.value)}
                        placeholder="Type strategic calibration answer..."
                        rows={2}
                        className="w-full bg-transparent text-xs font-mono text-neutral-800 placeholder:text-neutral-400 focus:outline-none resize-none"
                      />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Bottom Footer Actions */}
            <div className="mt-4 pt-3 border-t border-[#dbd6cc] flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-neutral-500">
                {answeredCount === QUESTIONS.length
                  ? '✓ All discovery parameters calibrated.'
                  : `${QUESTIONS.length - answeredCount} optional parameter(s) open.`}
              </span>

              <button
                type="button"
                onClick={() => {
                  if (soundFX) soundFX.playKeyThud()
                  onClose()
                }}
                className="tactile-pink-btn px-6 py-2 rounded-xl text-white text-xs font-black tracking-wider cursor-pointer shadow-sm"
              >
                SAVE CALIBRATION &amp; RETURN ➔
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  )
}
