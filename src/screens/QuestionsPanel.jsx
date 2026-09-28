import React, { useEffect } from 'react'
import { QUESTIONS } from '../data.js'

export default function QuestionsPanel({ answers = {}, onSave, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-xs p-4 sm:p-6 font-mono"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="hardware-chassis-shell relative my-8 w-full max-w-[760px] rounded-[28px] p-6 sm:p-8 shadow-2xl text-neutral-800"
      >
        {/* Corner Hex Screws */}
        <span className="absolute left-3 top-3 text-[10px] text-neutral-400 select-none">✜</span>
        <span className="absolute right-3 top-3 text-[10px] text-neutral-400 select-none">✜</span>
        <span className="absolute left-3 bottom-3 text-[10px] text-neutral-400 select-none">✜</span>
        <span className="absolute right-3 bottom-3 text-[10px] text-neutral-400 select-none">✜</span>

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#dbd6cc] gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-[#ff2a85] text-white text-xs font-black rounded">
              ? STRATEGIC CALIBRATION
            </span>
            <span className="font-display font-black text-lg text-neutral-900 tracking-tight">
              BRAND DISCOVERY DECK
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="tactile-chiclet p-1.5 px-3 rounded-lg text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            ✕ CLOSE [ESC]
          </button>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed mb-6 font-mono">
          Calibrate brand positioning, phonetic resonance, and category constraints. Insights directly steer future candidate synthesis.
        </p>

        {/* Questions list */}
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {QUESTIONS.map((q, i) => (
            <div key={q} className="hardware-subpanel-bay p-4 rounded-xl border border-neutral-300">
              <p className="text-xs font-bold text-neutral-900 mb-2 flex items-center gap-2">
                <span className="bg-black text-white px-2 py-0.5 text-[10px] font-black rounded">
                  Q0{i + 1}
                </span>
                <span>{q}</span>
              </p>
              <div className="hardware-inset-panel rounded-xl p-3">
                <textarea
                  value={answers[i] || ''}
                  onChange={(e) => onSave(i, e.target.value)}
                  placeholder="Type strategic calibration answer..."
                  rows={2}
                  className="w-full bg-transparent text-xs font-mono text-neutral-800 focus:outline-none resize-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[#dbd6cc] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="tactile-pink-btn px-6 py-2 rounded-xl text-white text-xs font-black tracking-wider cursor-pointer shadow-sm"
          >
            SAVE CALIBRATION &amp; RETURN ➔
          </button>
        </div>
      </div>
    </div>
  )
}
