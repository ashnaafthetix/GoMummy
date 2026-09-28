import React, { useState, useEffect } from 'react'
import { getDomainPrice, analyzePhonetics, generateSmartAffixes } from '../services/domainService.js'
import TorxScrew from './hardware/TorxScrew.jsx'
import PhotorealLED from './hardware/PhotorealLED.jsx'
import SocialBeaconStrip from './hardware/SocialBeaconStrip.jsx'

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

  const [activeSlug, setActiveSlug] = useState(targetCard.domain)
  const [overrideAvail, setOverrideAvail] = useState(null)

  useEffect(() => {
    setActiveSlug(targetCard.domain)
    setOverrideAvail(null)
  }, [targetCard.domain])

  const isChecking = targetCard.state === 'checking'
  const isAvail = overrideAvail ? overrideAvail === 'available' : targetCard.state === 'available'
  const fullDomain = `${activeSlug}${targetCard.tld || '.com'}`
  const isCopied = copiedDomain === fullDomain

  const priceInfo = getDomainPrice(targetCard.tld || '.com')
  const phonetics = analyzePhonetics(targetCard.name || brief.name)
  const affixes = generateSmartAffixes(targetCard.domain).slice(0, 4)

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
      {/* Photorealistic Milled Metal Torx Screws in Corners */}
      <TorxScrew size={13} className="absolute left-3.5 top-3.5" />
      <TorxScrew size={13} className="absolute right-3.5 top-3.5" />
      <TorxScrew size={13} className="absolute left-3.5 bottom-3.5" />
      <TorxScrew size={13} className="absolute right-3.5 bottom-3.5" />

      {/* Top Telemetry Line */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-[#d8d3c7] px-1">
        <div className="flex items-center gap-2">
          <PhotorealLED status="pink" size={10} />
          <span className="text-xs font-mono font-bold tracking-widest text-neutral-900 uppercase">
            TARGET DOMAIN CHECK // {targetCard.tld || '.com'}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <SocialBeaconStrip handle={activeSlug} />
          <span className="px-2 py-0.5 bg-black text-white font-mono text-[10px] font-bold rounded">
            DNS: GOOGLE DOH
          </span>
          <span className="px-2 py-0.5 bg-neutral-200/80 text-neutral-800 font-mono text-[10px] font-bold rounded">
            {phonetics.syllables} syl • {phonetics.tone}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center px-1">
        {/* Left Information Bay */}
        <div className="md:col-span-8 space-y-2">
          <div className="flex items-baseline gap-3">
            <h2 className="text-3xl sm:text-4xl font-display font-black tracking-tight text-neutral-900 leading-tight">
              {targetCard.name || brief.name}
            </h2>
            <button
              type="button"
              onClick={handleSpeak}
              title="Pronounce brand name"
              className="text-neutral-400 hover:text-black transition-colors cursor-pointer text-sm"
            >
              🔊
            </button>
          </div>

          {/* Full domain with LED Beacon & Pricing */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2.5 bg-white px-3.5 py-1.5 rounded-lg border border-[#cfc9be] shadow-2xs">
              <span className="font-bold text-neutral-900">{fullDomain}</span>
              <PhotorealLED
                status={isChecking ? 'checking' : isAvail ? 'available' : 'registered'}
                size={10}
              />
              <span
                className={`font-black uppercase text-[11px] ${
                  isChecking
                    ? 'text-amber-600'
                    : isAvail
                    ? 'text-emerald-700'
                    : 'text-neutral-500'
                }`}
              >
                {isChecking ? 'Checking DNS...' : isAvail ? 'AVAILABLE' : 'TAKEN / REGISTERED'}
              </span>
            </div>

            <div className="bg-[#edeae2] px-3 py-1.5 rounded-lg border border-[#d6d0c4] text-xs font-mono font-bold text-neutral-700">
              1st Year: <span className="text-neutral-900 font-extrabold">${priceInfo.reg}</span> • Renewal: ${priceInfo.renew}/yr
            </div>
          </div>

          {/* Smart .com Affixes (when target domain is taken) */}
          {!isAvail && (
            <div className="pt-2 mt-2 border-t border-dashed border-[#d8d3c7]">
              <div className="flex items-center gap-2 mb-1.5 text-[10px] font-mono font-bold text-neutral-600 uppercase">
                <span>⚡ SMART .COM AFFIX ALTERNATIVES:</span>
                <span className="text-emerald-700 font-extrabold">AVAILABLE TO CLAIM</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {affixes.map((aff) => {
                  const isAffSelected = activeSlug === aff.slug
                  return (
                    <button
                      key={aff.slug}
                      type="button"
                      onClick={() => {
                        if (soundFX) soundFX.playKeyThud()
                        setActiveSlug(aff.slug)
                        setOverrideAvail('available')
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer border ${
                        isAffSelected
                          ? 'bg-neutral-900 border-black text-white shadow-xs'
                          : 'bg-white border-neutral-300 text-neutral-800 hover:border-black'
                      }`}
                    >
                      {aff.label} ➔
                    </button>
                  )
                })}
              </div>
            </div>
          )}
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
                if (onToggleShortlist) onToggleShortlist({ ...targetCard, domain: activeSlug })
              }}
              className={`p-2 rounded-xl border font-mono text-xs font-bold transition-all cursor-pointer ${
                isShortlisted
                  ? 'bg-amber-400 border-amber-500 text-black shadow-xs'
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
                if (onToggleCompare) onToggleCompare({ ...targetCard, domain: activeSlug })
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
