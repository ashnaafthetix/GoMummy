import React, { useState } from 'react'
import { getDomainPrice, analyzePhonetics, getPrimaryRegistrarUrl } from '../services/domainService.js'
import TorxScrew from '../components/hardware/TorxScrew.jsx'
import PhotorealLED from '../components/hardware/PhotorealLED.jsx'

export default function Compare({ compareSel = [], onRemove, onNavigate, soundFX }) {
  const [copiedDomain, setCopiedDomain] = useState(null)

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
    <main className="w-full">
      <div className="relative rounded-[28px] bg-gradient-to-b from-[#fbf9f5] via-[#f4efe6] to-[#ebe5da] border-[2px] border-[#d8d3c8] p-4 sm:p-7 md:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.9)_inset] font-mono">
        {/* Photorealistic Milled Metal Torx Screws */}
        <TorxScrew size={14} className="absolute left-4 top-4" />
        <TorxScrew size={14} className="absolute right-4 top-4" />
        <TorxScrew size={14} className="absolute left-4 bottom-4" />
        <TorxScrew size={14} className="absolute right-4 bottom-4" />

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#dbd6cc]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                if (onNavigate) onNavigate('results')
              }}
              className="tactile-chiclet px-3.5 py-1.5 rounded-xl text-neutral-800 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>←</span>
              <span>BACK TO RESULTS</span>
            </button>

            <div className="h-4 w-px bg-neutral-300 hidden sm:block mx-1" />

            <div className="flex items-center gap-2">
              <PhotorealLED status="pink" size={9} />
              <h1 className="font-display text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                SIDE-BY-SIDE COMPARE BAY
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-black tracking-wider">
                {compareSel.length}/2 DOCKED
              </span>
            </div>
          </div>

          {compareSel.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-mono text-neutral-500">
              <span>Max 2 items compared side-by-side</span>
            </div>
          )}
        </div>

        {/* Content Area */}
        {compareSel.length < 2 ? (
          <div className="rounded-2xl border border-dashed border-[#dbd6cc] bg-[#f2ede4]/70 p-8 sm:p-14 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-xl shadow-inner">
              ⚖️
            </div>
            <h2 className="font-display text-lg font-bold text-neutral-900">
              {compareSel.length === 0 ? 'Nothing to compare yet' : '1 name docked — need 2 to compare'}
            </h2>
            <p className="font-mono text-xs text-neutral-500 max-w-[440px] leading-relaxed">
              {compareSel.length === 0
                ? 'Add two or more names to compare from the results screen.'
                : 'Add one more name from the results screen to unlock real side-by-side comparison.'}
            </p>
            {compareSel.length === 1 && (
              <div className="mt-1 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-[#d8d3c8] bg-white font-mono text-xs text-neutral-800 shadow-2xs">
                <span className="font-bold">{compareSel[0].name || compareSel[0].domain}</span>
                <span className="text-neutral-500 text-[11px]">({compareSel[0].domain}{compareSel[0].tld || '.com'})</span>
                <button
                  type="button"
                  onClick={() => {
                    if (soundFX) soundFX.playKeyThud()
                    onRemove(compareSel[0])
                  }}
                  className="ml-2 w-5 h-5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-red-600 font-bold flex items-center justify-center cursor-pointer transition-colors"
                  title="Remove name"
                >
                  ✕
                </button>
              </div>
            )}
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                if (onNavigate) onNavigate('results')
              }}
              className="mt-3 tactile-pink-btn px-5 py-2 rounded-xl text-white font-mono text-xs font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <span>{compareSel.length === 0 ? 'EXPLORE RESULTS' : 'SELECT SECOND NAME'}</span>
              <span>→</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {compareSel.map((item, idx) => {
              const fullDomain = `${item.domain}${item.tld || '.com'}`
              const price = getDomainPrice(item.tld || '.com')
              const phonetics = analyzePhonetics(item.name || item.domain)
              const tco3yr = (price.reg + price.renew * 2).toFixed(2)
              const isAvail = item.state === 'available'
              const isChecking = item.state === 'checking'

              return (
                <div
                  key={item.domain}
                  className="rounded-2xl border-[1.5px] border-[#d8d3c8] bg-gradient-to-b from-[#ffffff] via-[#faf8f4] to-[#f3efe6] p-5 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.9)_inset] flex flex-col justify-between gap-4 font-mono transition-all"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#ece8de]">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-black text-white text-[10px] font-black tracking-wider">
                          SLOT 0{idx + 1} // CANDIDATE {idx === 0 ? 'A' : 'B'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                            isAvail
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : isChecking
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isAvail ? 'bg-emerald-500' : isChecking ? 'bg-amber-500 animate-pulse' : 'bg-neutral-400'
                            }`}
                          />
                          {isAvail ? 'AVAILABLE' : isChecking ? 'CHECKING' : 'TAKEN'}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleSpeak(item.name || item.domain)}
                          className="w-7 h-7 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-600 text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="Listen to pronunciation"
                        >
                          🔊
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (soundFX) soundFX.playKeyThud()
                            onRemove(item)
                          }}
                          className="w-7 h-7 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-500 hover:text-red-600 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                          title="Undock from comparison"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Headline */}
                    <h3 className="text-2xl sm:text-3xl font-display font-black text-neutral-900 tracking-tight leading-tight">
                      {item.name || item.domain}
                    </h3>
                    <div className="text-xs font-mono font-bold text-neutral-600 mb-3.5 mt-0.5">
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
                      <div className="p-4 text-center bg-gradient-to-br from-white to-neutral-100 min-h-[88px] flex flex-col justify-center items-center">
                        <span className="font-display font-black text-lg text-neutral-900 tracking-wider">
                          {(item.name || item.domain).toUpperCase()}
                        </span>
                        <p className="text-[11px] text-neutral-500 mt-0.5 max-w-xs line-clamp-2">
                          {item.rationale?.trait || 'Precision digital brand identity and platform.'}
                        </p>
                      </div>
                    </div>

                    {/* Registrar Cost Breakdown */}
                    <div className="rounded-xl p-3 mb-4 text-xs font-mono border border-[#d8d3c8] bg-white/70">
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
                        <div className="flex justify-between pt-1 border-t border-[#ece8de]">
                          <span className="text-neutral-600 font-semibold">3-Year Projected TCO:</span>
                          <span className="font-black text-neutral-900">${tco3yr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Linguistics & Phonetics */}
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4">
                      <div className="bg-white/80 border border-neutral-200 p-2 rounded-lg">
                        <div className="text-[9px] text-neutral-400 font-bold">SYLLABLES</div>
                        <div className="font-bold text-neutral-800">{phonetics.syllables} syl</div>
                      </div>
                      <div className="bg-white/80 border border-neutral-200 p-2 rounded-lg">
                        <div className="text-[9px] text-neutral-400 font-bold">TONE</div>
                        <div className="font-bold text-neutral-800">{phonetics.tone}</div>
                      </div>
                      <div className="bg-white/80 border border-neutral-200 p-2 rounded-lg">
                        <div className="text-[9px] text-neutral-400 font-bold">LENGTH</div>
                        <div className="font-bold text-neutral-800">{item.domain.length} chars</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-dashed border-[#ece8de]">
                    <button
                      type="button"
                      onClick={() => copy(fullDomain)}
                      className="tactile-chiclet px-2.5 py-1 rounded text-[10px] font-bold text-neutral-700 cursor-pointer"
                    >
                      {copiedDomain === fullDomain ? '✓ COPIED' : 'COPY DOMAIN'}
                    </button>

                    <a
                      href={getPrimaryRegistrarUrl(fullDomain)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (soundFX) soundFX.playAvailable()
                      }}
                      className="tactile-chiclet px-3 py-1 rounded text-[10px] font-black text-neutral-900 hover:text-black flex items-center gap-1 cursor-pointer"
                    >
                      <span>REGISTER</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              )
            })}

            {/* If only 1 item is docked, show open receptacle slot */}
            {compareSel.length === 1 && (
              <div className="rounded-2xl border-2 border-dashed border-[#dbd6cc] bg-[#f2ede4]/40 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[360px]">
                <div className="w-10 h-10 rounded-full border border-neutral-300 flex items-center justify-center text-neutral-400 text-lg">
                  +
                </div>
                <div className="font-display font-bold text-sm text-neutral-700">
                  SLOT 02 OPEN
                </div>
                <p className="font-mono text-xs text-neutral-500 max-w-[280px]">
                  Click the ⚖️ button on any other candidate card to dock it here for side-by-side comparison.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (soundFX) soundFX.playLock()
                    if (onNavigate) onNavigate('results')
                  }}
                  className="tactile-chiclet px-4 py-1.5 rounded-lg text-xs font-bold text-neutral-800"
                >
                  Browse Candidates →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}

