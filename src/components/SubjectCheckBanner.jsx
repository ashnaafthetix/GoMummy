import React from 'react'
import { getDomainPrice, analyzePhonetics } from '../services/domainService.js'

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
  if (!brief?.name || !targetCard) return null

  const isChecking = targetCard.state === 'checking'
  const isAvail = targetCard.state === 'available'
  const fullDomain = `${targetCard.domain}${targetCard.tld || '.com'}`
  const isCopied = copiedDomain === fullDomain

  const priceInfo = getDomainPrice(targetCard.tld || '.com')
  const phonetics = analyzePhonetics(targetCard.name || brief.name)

  const handleSpeak = () => {
    if (soundFX) soundFX.playTick()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(targetCard.name || brief.name)
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleRegisterClick = () => {
    if (soundFX) soundFX.playAvailable()
    alert(`Redirecting to registrar to claim ${fullDomain} ($${priceInfo.reg}/yr)...`)
  }

  return (
    <div className="hardware-chassis-shell relative rounded-2xl p-5 sm:p-6 mb-6 text-neutral-800 shadow-md">
      {/* Corner Hex Screws */}
      <span className="absolute left-3 top-3 text-[10px] text-neutral-400 select-none">✜</span>
      <span className="absolute right-3 top-3 text-[10px] text-neutral-400 select-none">✜</span>
      <span className="absolute left-3 bottom-3 text-[10px] text-neutral-400 select-none">✜</span>
      <span className="absolute right-3 bottom-3 text-[10px] text-neutral-400 select-none">✜</span>

      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-[#dbd6cc]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff2a85] animate-pulse inline-block shadow-[0_0_8px_#ff2a85]" />
          <span className="text-xs font-mono font-black tracking-wider text-black uppercase">
            JOB 01 // TARGET SUBJECT AVAILABILITY CHECK
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-black text-white font-mono text-[10px] font-bold rounded">
            DNS: GOOGLE DOH
          </span>
          <span className="px-2 py-0.5 bg-neutral-200 text-neutral-800 font-mono text-[10px] font-bold rounded">
            {phonetics.syllables} syl • {phonetics.tone}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* Left Information Bay */}
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-neutral-900 leading-tight">
              {targetCard.name || brief.name}
            </h2>
            <button
              type="button"
              onClick={handleSpeak}
              title="Pronounce Acoustic Sound"
              className="text-neutral-400 hover:text-black transition-colors cursor-pointer text-sm"
            >
              🔊
            </button>
          </div>

          {/* Full domain with LED Beacon & Pricing */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-neutral-300">
              <span className="font-bold text-neutral-900">{fullDomain}</span>
              <span
                className={`w-2.5 h-2.5 rounded-full inline-block ${
                  isChecking
                    ? 'bg-amber-400 animate-ping'
                    : isAvail
                    ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]'
                    : 'bg-red-500'
                }`}
              />
              <span
                className={`font-black uppercase text-[11px] ${
                  isChecking
                    ? 'text-amber-600'
                    : isAvail
                    ? 'text-emerald-700'
                    : 'text-red-600'
                }`}
              >
                {isChecking ? 'Checking DNS...' : isAvail ? 'AVAILABLE' : 'TAKEN / REGISTERED'}
              </span>
            </div>

            <div className="bg-[#ece8e0] px-3 py-1.5 rounded-lg border border-[#d8d3c8] text-xs font-mono font-bold text-neutral-700">
              1st Year: <span className="text-neutral-900 font-black">${priceInfo.reg}</span> • Renewal: ${priceInfo.renew}/yr
            </div>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-2 justify-end">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playKeyThud()
                if (onCopy) onCopy(fullDomain)
              }}
              className="flex-1 py-2 bg-white border border-neutral-300 text-neutral-700 hover:text-black font-mono text-xs font-bold rounded-xl cursor-pointer shadow-2xs transition-colors"
            >
              {isCopied ? '✓ COPIED' : '📋 COPY'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playKeyThud()
                if (onToggleShortlist) onToggleShortlist(targetCard)
              }}
              className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${
                isShortlisted
                  ? 'bg-amber-400 border-amber-500 text-black'
                  : 'bg-white border-neutral-300 text-neutral-600 hover:text-black'
              }`}
              title="Save to Shortlist"
            >
              ★
            </button>

            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playTick()
                if (onToggleCompare) onToggleCompare(targetCard)
              }}
              className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${
                isCompared
                  ? 'bg-black text-white'
                  : 'bg-white border-neutral-300 text-neutral-600 hover:text-black'
              }`}
              title="Compare side-by-side"
            >
              ⚖️
            </button>
          </div>

          <button
            type="button"
            onClick={handleRegisterClick}
            className="tactile-pink-btn w-full py-3 px-4 rounded-xl text-white font-mono text-xs font-black tracking-wider cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span>REGISTER {fullDomain.toUpperCase()} ➔ ${priceInfo.reg}</span>
          </button>
        </div>

      </div>
    </div>
  )
}
