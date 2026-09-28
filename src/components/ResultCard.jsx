import React, { useState } from 'react'
import { getDomainPrice, analyzePhonetics } from '../services/domainService.js'

export default function ResultCard({
  name,
  domain,
  tld = '.com',
  state,
  availability,
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
  soundFX,
}) {
  const [selectedTld, setSelectedTld] = useState(tld || '.com')
  const currentStatus = availability || state || 'available'
  const isChecking = currentStatus === 'checking'
  const isAvail = currentStatus === 'available'
  const fullDomain = `${domain}${selectedTld}`
  const isCopied = copiedDomain === fullDomain

  const priceInfo = getDomainPrice(selectedTld)
  const phonetics = analyzePhonetics(name)

  const handleSpeak = (e) => {
    e.stopPropagation()
    if (soundFX) soundFX.playTick()
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(name)
      utterance.rate = 0.95
      window.speechSynthesis.speak(utterance)
    }
  }

  const handleRegisterClick = (e) => {
    e.stopPropagation()
    if (soundFX) soundFX.playAvailable()
    alert(`Redirecting to ${priceInfo.registrar} to register ${fullDomain} ($${priceInfo.reg}/yr)...`)
  }

  const handleCopyClick = (e) => {
    e.stopPropagation()
    if (soundFX) soundFX.playKeyThud()
    if (onCopy) onCopy(fullDomain)
  }

  return (
    <div
      data-slot-card="true"
      className={`hardware-chassis-shell relative rounded-2xl p-5 transition-all duration-150 select-none flex flex-col justify-between ${
        isLocked
          ? 'border-[#ff2a85] shadow-[0_0_15px_rgba(255,42,133,0.35)]'
          : 'hover:-translate-y-1 hover:shadow-lg'
      } ${className}`}
    >
      {/* Corner Hex Screws */}
      <span className="absolute left-2.5 top-2.5 text-[9px] text-neutral-400 select-none">✜</span>
      <span className="absolute right-2.5 top-2.5 text-[9px] text-neutral-400 select-none">✜</span>
      <span className="absolute left-2.5 bottom-2.5 text-[9px] text-neutral-400 select-none">✜</span>
      <span className="absolute right-2.5 bottom-2.5 text-[9px] text-neutral-400 select-none">✜</span>

      {/* Top Instrument Header */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#dbd6cc] px-1">
          
          {/* Module Slot & Linguistics Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-mono font-black rounded tracking-wider">
              MOD // 0{slotNumber}
            </span>
            <span className="px-2 py-0.5 bg-neutral-200/80 text-neutral-800 text-[10px] font-mono font-bold rounded">
              {phonetics.syllables} syl
            </span>
            <span
              className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                phonetics.tone === 'Punchy'
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : phonetics.tone === 'Smooth'
                  ? 'bg-sky-100 text-sky-900 border border-sky-300'
                  : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
              }`}
            >
              {phonetics.tone}
            </span>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            {/* Audio Voice Listen Button */}
            <button
              type="button"
              onClick={handleSpeak}
              title="Pronounce Acoustic Sound"
              className="p-1 rounded-md text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              🔊
            </button>

            {/* Lock / Hold Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (onToggleLock) onToggleLock()
              }}
              title={isLocked ? 'Unlock slot for regeneration' : 'Hold / Lock this candidate'}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                isLocked
                  ? 'bg-[#ff2a85] text-white shadow-xs'
                  : 'bg-neutral-200 text-neutral-600 hover:text-black'
              }`}
            >
              {isLocked ? '🔒 HELD' : 'HOLD'}
            </button>

            {/* Shortlist Star Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (soundFX) soundFX.playKeyThud()
                if (onToggleShortlist) onToggleShortlist()
              }}
              title="Save to Shortlist"
              className={`p-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                isShortlisted
                  ? 'bg-amber-400 text-black shadow-xs'
                  : 'text-neutral-400 hover:text-amber-500'
              }`}
            >
              ★
            </button>

            {/* Compare Toggle Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (soundFX) soundFX.playTick()
                if (onToggleCompare) onToggleCompare()
              }}
              title="Compare side-by-side"
              className={`p-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                isCompared
                  ? 'bg-black text-white'
                  : 'text-neutral-400 hover:text-black'
              }`}
            >
              ⚖️
            </button>
          </div>

        </div>

        {/* Brand Name Headline */}
        <div className="px-1 mb-1">
          <h3 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-neutral-900 leading-tight">
            {name}
          </h3>
        </div>

        {/* Subline: Domain & Live Google DoH Status & Pricing */}
        <div className="flex items-center justify-between text-xs font-mono px-1 mb-4 pb-2 border-b border-neutral-200">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-neutral-800">
              {domain}{selectedTld}
            </span>
            <span
              className={`w-2 h-2 rounded-full inline-block ${
                isChecking
                  ? 'bg-amber-400 animate-ping'
                  : isAvail
                  ? 'bg-emerald-500 shadow-[0_0_6px_#10b981]'
                  : 'bg-red-500'
              }`}
            />
            <span
              className={`text-[11px] font-bold ${
                isChecking
                  ? 'text-amber-600'
                  : isAvail
                  ? 'text-emerald-700'
                  : 'text-red-600'
              }`}
            >
              {isChecking ? 'Checking...' : isAvail ? 'Available' : 'Registered'}
            </span>
          </div>

          {/* Pricing Display */}
          <div className="text-right">
            <span className="font-black text-neutral-900 text-sm">
              ${priceInfo.reg}
            </span>
            <span className="text-[10px] text-neutral-400">/yr</span>
          </div>
        </div>

        {/* 5-Extension Price Matrix */}
        <div className="bg-[#ece8e0] border border-[#d8d3c8] rounded-xl p-2.5 mb-4 shadow-inner">
          <div className="flex items-center justify-between text-[9px] font-mono font-bold text-neutral-500 mb-1.5 uppercase">
            <span>EXTENSION MATRIX:</span>
            <span>Click to switch TLD</span>
          </div>

          <div className="grid grid-cols-5 gap-1">
            {['.com', '.io', '.ai', '.co', '.xyz'].map((ext) => {
              const p = getDomainPrice(ext)
              const isSelected = selectedTld === ext
              return (
                <button
                  key={ext}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (soundFX) soundFX.playTick()
                    setSelectedTld(ext)
                  }}
                  className={`py-1 px-0.5 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    isSelected
                      ? 'bg-[#ff2a85] border-[#d90f61] text-white shadow-xs'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400'
                  }`}
                >
                  <span className="text-[10px] font-mono font-bold leading-tight">
                    {ext}
                  </span>
                  <span className={`text-[8px] font-mono ${isSelected ? 'text-pink-100' : 'text-neutral-500'}`}>
                    ${p.reg}
                  </span>
                  <span
                    className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected ? 'bg-white' : isAvail ? 'bg-emerald-400' : 'bg-red-400'
                    }`}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Card Footer: Copy & Register Actions */}
      <div className="pt-2 border-t border-[#dbd6cc] flex items-center justify-between gap-2 px-1">
        <button
          type="button"
          onClick={handleCopyClick}
          className="px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 hover:text-black font-mono text-[11px] font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
        >
          {isCopied ? '✓ COPIED' : '📋 COPY'}
        </button>

        <button
          type="button"
          onClick={handleRegisterClick}
          className="tactile-pink-btn px-4 py-1.5 text-white font-mono text-xs font-black rounded-lg cursor-pointer flex items-center gap-1 shadow-sm"
        >
          <span>BUY ${priceInfo.reg}</span>
          <span className="text-[10px]">↗</span>
        </button>
      </div>

    </div>
  )
}
