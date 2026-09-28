import React, { useState, useEffect, useRef } from 'react'
import { getDomainPrice, analyzePhonetics, generateSmartAffixes, getPrimaryRegistrarUrl } from '../services/domainService.js'
import TorxScrew from './hardware/TorxScrew.jsx'
import PhotorealLED from './hardware/PhotorealLED.jsx'
import SocialBeaconStrip from './hardware/SocialBeaconStrip.jsx'
import AudioOscilloscope from './hardware/AudioOscilloscope.jsx'

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
  onOpenViewfinder,
  onOpenWhois,
}) {
  if (!brief?.name || !targetCard) return null

  const [activeSlug, setActiveSlug] = useState(targetCard.domain)
  const [overrideAvail, setOverrideAvail] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speakTimeoutRef = useRef(null)

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
    setIsSpeaking(true)
    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current)

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(targetCard.name || brief.name)
      utterance.rate = 0.95
      utterance.onend = () => {
        speakTimeoutRef.current = setTimeout(() => setIsSpeaking(false), 200)
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
      }
      window.speechSynthesis.speak(utterance)
      speakTimeoutRef.current = setTimeout(() => setIsSpeaking(false), 2200)
    } else {
      speakTimeoutRef.current = setTimeout(() => setIsSpeaking(false), 1600)
    }
  }

  const handleRegisterClick = () => {
    if (!isAvail && onOpenWhois) {
      if (soundFX) soundFX.playLock()
      onOpenWhois(fullDomain)
      return
    }
    if (soundFX) soundFX.playAvailable()
    const targetUrl = getPrimaryRegistrarUrl(fullDomain)
    if (typeof window !== 'undefined') {
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    }
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
          <AudioOscilloscope active={isSpeaking} tone={phonetics.tone} />
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
              className={`p-1.5 rounded transition-all cursor-pointer text-sm ${
                isSpeaking
                  ? 'bg-[#22c55e] text-white shadow-[0_0_8px_#22c55e] scale-110'
                  : 'text-neutral-400 hover:text-black hover:bg-neutral-200'
              }`}
            >
              🔊
            </button>
          </div>

          {/* Full domain with LED Beacon & Pricing */}
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-mono">
            <div
              onClick={!isAvail && onOpenWhois ? () => {
                if (soundFX) soundFX.playLock()
                onOpenWhois(fullDomain)
              } : undefined}
              className={`flex items-center gap-2.5 bg-white px-3.5 py-1.5 rounded-lg border border-[#cfc9be] shadow-2xs transition-colors ${
                !isAvail ? 'cursor-pointer hover:border-black' : ''
              }`}
              title={!isAvail ? 'Click to inspect WHOIS/DNS Telemetry Diagnostic' : undefined}
            >
              <span className="font-bold text-neutral-900">{fullDomain}</span>
              <PhotorealLED
                status={isChecking ? 'checking' : isAvail ? 'available' : 'registered'}
                size={10}
              />
              <span
                className={`font-black uppercase text-[11px] flex items-center gap-1 ${
                  isChecking
                    ? 'text-amber-600'
                    : isAvail
                    ? 'text-emerald-700'
                    : 'text-neutral-500'
                }`}
              >
                <span>{isChecking ? 'Checking DNS...' : isAvail ? 'AVAILABLE' : 'TAKEN / REGISTERED'}</span>
                {!isAvail && <span className="text-[10px]">🔍</span>}
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

            {/* Real-World Identity Viewfinder Scope */}
            {onOpenViewfinder && (
              <button
                type="button"
                onClick={() => {
                  if (soundFX) soundFX.playLock()
                  onOpenViewfinder({ ...targetCard, domain: activeSlug })
                }}
                className="p-2 rounded-xl border border-neutral-300 bg-white text-neutral-600 hover:text-black font-mono text-xs font-bold transition-all cursor-pointer shadow-2xs hover:border-black"
                title="View Real-World Identity Scope (Browser tab, App icon, Shipping label)"
              >
                👁️
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleRegisterClick}
            className={`${
              isAvail
                ? 'tactile-pink-btn text-white'
                : 'bg-neutral-900 hover:bg-black text-white border border-neutral-800'
            } w-full py-3 px-4 rounded-xl font-mono text-xs font-black tracking-wider cursor-pointer flex items-center justify-center gap-2 shadow-sm transition-all`}
          >
            <span>
              {isAvail
                ? `REGISTER ${fullDomain.toUpperCase()} ➔ $${priceInfo.reg}`
                : `WHOIS & DNS TELEMETRY DIAGNOSTIC 🔍`}
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
