import React, { useEffect, useState } from 'react'
import { getDomainPrice, analyzePhonetics } from '../../services/domainService.js'
import TorxScrew from '../hardware/TorxScrew.jsx'

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
        if (soundFX) soundFX.playTick()
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
    if (soundFX) soundFX.playTick()
    setCopiedDomain(domain)
    setTimeout(() => setCopiedDomain(null), 1500)
  }

  const handleSpeak = (word) => {
    if (soundFX) soundFX.playTick()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    }
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto font-mono"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="hardware-chassis-shell relative w-full max-w-[1020px] my-auto rounded-[28px] p-6 sm:p-8 shadow-2xl text-neutral-800"
      >
        {/* Photorealistic Milled Metal Torx Screws */}
        <TorxScrew size={12} className="absolute left-3.5 top-3.5" />
        <TorxScrew size={12} className="absolute right-3.5 top-3.5" />
        <TorxScrew size={12} className="absolute left-3.5 bottom-3.5" />
        <TorxScrew size={12} className="absolute right-3.5 bottom-3.5" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#dbd6cc]">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-black text-white text-xs font-black rounded">
              ⚖️ DUAL DOCK
            </span>
            <span className="font-display font-black text-lg text-neutral-900 tracking-tight">
              HEAD-TO-HEAD DOMAIN COMPARE
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="tactile-chiclet p-1.5 px-3 rounded-lg text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            ✕ CLOSE
          </button>
        </div>

        {compareSel.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            <div className="text-3xl mb-2">⚖️</div>
            <p className="font-bold text-sm">NO DOMAINS SELECTED FOR COMPARISON</p>
            <p className="text-xs text-neutral-400 mt-1">
              Click the ⚖️ button on any domain card to compare side-by-side.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compareSel.map((item, idx) => {
              const fullDomain = `${item.domain}${item.tld || '.com'}`
              const isShort = shortlist.some((s) => s.domain === item.domain)
              const price = getDomainPrice(item.tld || '.com')
              const phonetics = analyzePhonetics(item.name || item.domain)
              const tco3yr = (price.reg + price.renew * 2).toFixed(2)

              return (
                <div
                  key={item.domain}
                  className="bg-white rounded-2xl border border-neutral-300 p-5 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100">
                      <span className="text-[10px] font-mono font-black text-neutral-500 uppercase">
                        CANDIDATE {idx === 0 ? 'A' : 'B'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.name || item.domain)}
                          className="text-neutral-400 hover:text-black text-xs cursor-pointer"
                          title="Listen"
                        >
                          🔊
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemove(item)}
                          className="text-xs text-neutral-400 hover:text-red-600 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 className="text-3xl font-display font-black text-neutral-900 tracking-tight mb-1">
                      {item.name || item.domain}
                    </h3>
                    <div className="text-xs font-mono font-bold text-neutral-500 mb-4">
                      {fullDomain}
                    </div>

                    {/* Simulated Live Website Hero Preview */}
                    <div className="rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden mb-4 shadow-inner">
                      <div className="bg-neutral-200 px-3 py-1 flex items-center gap-1.5 border-b border-neutral-300">
                        <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                        <span className="text-[9px] font-mono text-neutral-500 truncate ml-1">
                          https://www.{fullDomain}
                        </span>
                      </div>
                      <div className="p-4 text-center bg-gradient-to-br from-white to-neutral-100 min-h-[100px] flex flex-col justify-center items-center">
                        <span className="font-display font-black text-lg text-neutral-900 tracking-wider">
                          {(item.name || item.domain).toUpperCase()}
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {item.rationale?.trait || 'Next-generation industrial software & branding.'}
                        </p>
                      </div>
                    </div>

                    {/* Registrar Cost Breakdown */}
                    <div className="bg-[#ece8e0] border border-[#d8d3c8] rounded-xl p-3 mb-4 text-xs font-mono">
                      <div className="text-[10px] font-bold text-neutral-500 uppercase mb-2">
                        REGISTRAR PRICING ANALYSIS
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Year 1 Registration:</span>
                          <span className="font-bold text-neutral-900">${price.reg}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-600">Annual Renewal Rate:</span>
                          <span className="font-bold text-neutral-900">${price.renew}/yr</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-[#d8d3c8]">
                          <span className="text-neutral-600">3-Year Projected TCO:</span>
                          <span className="font-black text-neutral-900">${tco3yr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Linguistics */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4">
                      <div className="bg-neutral-100 p-2 rounded-lg">
                        <div className="text-[9px] text-neutral-400">SYLLABLES</div>
                        <div className="font-bold">{phonetics.syllables} syl</div>
                      </div>
                      <div className="bg-neutral-100 p-2 rounded-lg">
                        <div className="text-[9px] text-neutral-400">TONE</div>
                        <div className="font-bold">{phonetics.tone}</div>
                      </div>
                      <div className="bg-neutral-100 p-2 rounded-lg">
                        <div className="text-[9px] text-neutral-400">LENGTH</div>
                        <div className="font-bold">{item.domain.length} chars</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                    <button
                      type="button"
                      onClick={() => copy(fullDomain)}
                      className="py-2 px-3 bg-white border border-neutral-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                    >
                      {copiedDomain === fullDomain ? '✓' : '📋'}
                    </button>
                    <button
                      type="button"
                      onClick={() => onToggleShortlist(item)}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                        isShort
                          ? 'bg-amber-400 border-amber-500 text-black'
                          : 'bg-white border-neutral-300 text-neutral-600'
                      }`}
                    >
                      ★
                    </button>
                    <button
                      type="button"
                      onClick={() => alert(`Redirecting to registrar for ${fullDomain} ($${price.reg})...`)}
                      className="tactile-pink-btn flex-1 py-2 rounded-xl text-white text-xs font-black cursor-pointer shadow-sm text-center"
                    >
                      REGISTER ${price.reg} ➔
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
