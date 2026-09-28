import React, { useEffect, useState } from 'react'
import { getDomainPrice, analyzePhonetics, getPrimaryRegistrarUrl } from '../../services/domainService.js'
import TorxScrew from '../hardware/TorxScrew.jsx'
import PhotorealLED from '../hardware/PhotorealLED.jsx'

/**
 * Docked Hardware Compare Tray.
 * Replaces floating modals with a physical slide-out dual comparison bay docked to the viewport bottom.
 */
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
    <>
      {/* 1. Ambient Dark Backdrop (Click to Disengage Tray) */}
      <div
        onClick={() => {
          if (soundFX) soundFX.playTick()
          onClose()
        }}
        className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity cursor-pointer animate-[fadeIn_0.2s_ease-out]"
      />

      {/* 2. Docked Hardware Drawer Anchored to Bottom Viewport */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center justify-end pointer-events-none font-mono">
        <div
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-[1240px] px-2 sm:px-6 hardware-tray-slide-up"
        >
          <div className="hardware-tray-chassis relative rounded-t-[32px] sm:rounded-t-[40px] p-5 sm:p-7 max-h-[88vh] flex flex-col shadow-2xl text-neutral-800">
            
            {/* Precision Milled Metal Torx Screws */}
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
                title="Click handle to collapse / disengage compare tray"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                  ≡ DOCKED COMPARE BAY // DRAG OR CLICK TO CLOSE
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              </div>
            </div>

            {/* Tray Header Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#dbd6cc] gap-3">
              <div className="flex items-center gap-2.5">
                <PhotorealLED status="pink" size={9} />
                <span className="px-2.5 py-0.5 bg-black text-white text-xs font-black rounded shadow-2xs">
                  ⚖️ DUAL DOCK
                </span>
                <span className="font-display font-black text-base sm:text-lg text-neutral-900 tracking-tight">
                  HEAD-TO-HEAD DOMAIN SPECIFICATION COMPARE
                </span>
                <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 text-[10px] font-bold rounded">
                  {compareSel.length} DOCKED
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
                <span>DISENGAGE TRAY</span>
              </button>
            </div>

            {/* Tray Content Body */}
            {compareSel.length === 0 ? (
              <div className="py-14 text-center text-neutral-500">
                <div className="text-4xl mb-3">⚖️</div>
                <p className="font-bold text-sm text-neutral-800">NO CANDIDATE DOMAINS DOCKED FOR COMPARISON</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                  Click the ⚖️ balance scale icon on any 2 domain cards in the workstation feed to inspect them side-by-side in this hardware dock.
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto pr-1 flex-1">
                <div className={`grid grid-cols-1 ${compareSel.length > 1 ? 'md:grid-cols-2' : 'max-w-xl mx-auto'} gap-5`}>
                  {compareSel.map((item, idx) => {
                    const fullDomain = `${item.domain}${item.tld || '.com'}`
                    const isShort = shortlist.some((s) => s.domain === item.domain)
                    const price = getDomainPrice(item.tld || '.com')
                    const phonetics = analyzePhonetics(item.name || item.domain)
                    const tco3yr = (price.reg + price.renew * 2).toFixed(2)

                    return (
                      <div
                        key={item.domain}
                        className="bg-white rounded-2xl border border-neutral-300 p-5 shadow-xs flex flex-col justify-between"
                      >
                        <div>
                          {/* Card Sub-Header */}
                          <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100">
                            <span className="text-[10px] font-mono font-black text-neutral-500 uppercase tracking-widest">
                              CANDIDATE {idx === 0 ? 'A' : 'B'} // SLOT 0{idx + 1}
                            </span>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSpeak(item.name || item.domain)}
                                className="text-neutral-400 hover:text-black text-xs cursor-pointer p-1 rounded hover:bg-neutral-100"
                                title="Listen to phonetic audio"
                              >
                                🔊
                              </button>
                              <button
                                type="button"
                                onClick={() => onRemove(item)}
                                className="text-xs text-neutral-400 hover:text-red-600 cursor-pointer p-1 rounded hover:bg-neutral-100"
                                title="Undock from comparison"
                              >
                                ✕
                              </button>
                            </div>
                          </div>

                          {/* Brand Headline */}
                          <h3 className="text-2xl sm:text-3xl font-display font-black text-neutral-900 tracking-tight mb-0.5">
                            {item.name || item.domain}
                          </h3>
                          <div className="text-xs font-mono font-bold text-neutral-500 mb-3.5">
                            {fullDomain}
                          </div>

                          {/* Simulated Live Website Hero Preview */}
                          <div className="rounded-xl border border-neutral-200 bg-neutral-50 overflow-hidden mb-4 shadow-inner">
                            <div className="bg-neutral-200 px-3 py-1 flex items-center gap-1.5 border-b border-neutral-300">
                              <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                              <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
                              <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                              <span className="text-[9px] font-mono text-neutral-500 truncate ml-1 font-semibold">
                                https://www.{fullDomain}
                              </span>
                            </div>
                            <div className="p-4 text-center bg-gradient-to-br from-white to-neutral-100 min-h-[96px] flex flex-col justify-center items-center">
                              <span className="font-display font-black text-lg text-neutral-900 tracking-wider">
                                {(item.name || item.domain).toUpperCase()}
                              </span>
                              <p className="text-[11px] text-neutral-500 mt-0.5 max-w-xs">
                                {item.rationale?.trait || 'Precision digital brand identity and platform.'}
                              </p>
                            </div>
                          </div>

                          {/* Registrar Cost Breakdown */}
                          <div className="hardware-inset-panel rounded-xl p-3 mb-4 text-xs font-mono border border-[#d8d3c8]">
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
                                <span className="text-neutral-600 font-semibold">3-Year Projected TCO:</span>
                                <span className="font-black text-neutral-900">${tco3yr}</span>
                              </div>
                            </div>
                          </div>

                          {/* Linguistics & Phonetics */}
                          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4">
                            <div className="bg-neutral-100 p-2 rounded-lg">
                              <div className="text-[9px] text-neutral-400">SYLLABLES</div>
                              <div className="font-bold text-neutral-800">{phonetics.syllables} syl</div>
                            </div>
                            <div className="bg-neutral-100 p-2 rounded-lg">
                              <div className="text-[9px] text-neutral-400">TONE</div>
                              <div className="font-bold text-neutral-800">{phonetics.tone}</div>
                            </div>
                            <div className="bg-neutral-100 p-2 rounded-lg">
                              <div className="text-[9px] text-neutral-400">LENGTH</div>
                              <div className="font-bold text-neutral-800">{item.domain.length} chars</div>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                          <button
                            type="button"
                            onClick={() => copy(fullDomain)}
                            className="py-2 px-3 bg-white border border-neutral-300 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-2xs hover:border-black"
                            title="Copy full domain"
                          >
                            {copiedDomain === fullDomain ? '✓' : '📋'}
                          </button>
                          <button
                            type="button"
                            onClick={() => onToggleShortlist(item)}
                            className={`py-2 px-3 rounded-xl border text-xs font-bold cursor-pointer transition-all shadow-2xs ${
                              isShort
                                ? 'bg-amber-400 border-amber-500 text-black'
                                : 'bg-white border-neutral-300 text-neutral-600 hover:border-black'
                            }`}
                            title={isShort ? 'Saved in shortlist' : 'Add to shortlist'}
                          >
                            ★
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (soundFX) soundFX.playKeyThud()
                              window.open(getPrimaryRegistrarUrl(fullDomain), '_blank', 'noopener,noreferrer')
                            }}
                            className="tactile-pink-btn flex-1 py-2 rounded-xl text-white text-xs font-black cursor-pointer shadow-sm text-center"
                            title={`Open ${price.registrar} 1-click cart in new tab`}
                          >
                            REGISTER ${price.reg} ➔
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
