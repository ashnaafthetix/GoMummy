import React, { useState, useEffect, useRef } from 'react'
import { getDomainPrice, generateSmartAffixes, analyzePhonetics, getPrimaryRegistrarUrl } from '../services/domainService.js'
import TorxScrew from './hardware/TorxScrew.jsx'
import PhotorealLED from './hardware/PhotorealLED.jsx'
import SocialBeaconStrip from './hardware/SocialBeaconStrip.jsx'
import AudioOscilloscope from './hardware/AudioOscilloscope.jsx'

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
  onOpenViewfinder,
  onOpenWhois,
  category,
  rationale,
}) {
  const [selectedTld, setSelectedTld] = useState(tld || '.com')
  const [activeSlug, setActiveSlug] = useState(domain)
  const [overrideAvail, setOverrideAvail] = useState(null)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const speakTimeoutRef = useRef(null)

  // 3D Specular Tilt Physics State
  const cardRef = useRef(null)
  const [tilt, setTilt] = useState({
    rotX: 0,
    rotY: 0,
    glareX: 50,
    glareY: 50,
    glareOpacity: 0,
    isHovered: false,
  })

  useEffect(() => {
    setActiveSlug(domain)
    setOverrideAvail(null)
  }, [domain])

  const currentStatus = overrideAvail || availability || state || 'available'
  const isChecking = currentStatus === 'checking'
  const isAvail = currentStatus === 'available'
  const fullDomain = `${activeSlug}${selectedTld}`
  const isCopied = copiedDomain === fullDomain

  const priceInfo = getDomainPrice(selectedTld)
  const affixes = generateSmartAffixes(domain).slice(0, 3)
  const phonetics = analyzePhonetics(name)

  // Format readable phonetic syllable chunks (e.g. LOOM • CAR • BON)
  const syllablesText = (name || '')
    .replace(/([a-z])([A-Z])/g, '$1 • $2')
    .replace(/\s+/g, ' • ')
    .toUpperCase()

  const handleSpeak = (e) => {
    e.stopPropagation()
    if (soundFX) soundFX.playTick()
    setIsSpeaking(true)
    if (speakTimeoutRef.current) clearTimeout(speakTimeoutRef.current)

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(name)
      utterance.rate = 0.95
      utterance.onend = () => {
        speakTimeoutRef.current = setTimeout(() => setIsSpeaking(false), 200)
      }
      utterance.onerror = () => {
        setIsSpeaking(false)
      }
      window.speechSynthesis.speak(utterance)
      // Safety auto-dismiss fallback
      speakTimeoutRef.current = setTimeout(() => setIsSpeaking(false), 2200)
    } else {
      speakTimeoutRef.current = setTimeout(() => setIsSpeaking(false), 1600)
    }
  }

  // 3D Specular Tilt Physics Handlers
  const handlePointerMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = Math.max(0, Math.min(1, x / rect.width))
    const py = Math.max(0, Math.min(1, y / rect.height))
    
    // Max ±5.5 degree realistic mechanical card tilt
    const rotX = (py - 0.5) * -11
    const rotY = (px - 0.5) * 11

    setTilt({
      rotX,
      rotY,
      glareX: px * 100,
      glareY: py * 100,
      glareOpacity: 0.38,
      isHovered: true,
    })
  }

  const handlePointerLeave = () => {
    setTilt((prev) => ({
      ...prev,
      rotX: 0,
      rotY: 0,
      glareOpacity: 0,
      isHovered: false,
    }))
  }

  const handleRegisterClick = (e) => {
    e.stopPropagation()
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

  const handleCopyClick = (e) => {
    e.stopPropagation()
    if (soundFX) soundFX.playKeyThud()
    if (onCopy) onCopy(fullDomain)
  }

  return (
    <div
      ref={cardRef}
      data-slot-card="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: tilt.isHovered
          ? `perspective(1000px) rotateX(${tilt.rotX.toFixed(2)}deg) rotateY(${tilt.rotY.toFixed(2)}deg) translateZ(4px) scale3d(1.015, 1.015, 1.015)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale3d(1, 1, 1)',
        transition: tilt.isHovered
          ? 'transform 0.08s ease-out, box-shadow 0.08s ease-out'
          : 'transform 0.45s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.45s cubic-bezier(0.2, 0.8, 0.2, 1)',
        boxShadow: tilt.isHovered
          ? '0 20px 40px -10px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06), 0 1px 0 rgba(255,255,255,0.9) inset'
          : undefined,
        transformStyle: 'preserve-3d',
      }}
      className={`photoreal-card relative rounded-xl p-5 select-none flex flex-col justify-between overflow-hidden ${
        isLocked
          ? 'border-[#ff2a85] ring-2 ring-[#ff2a85]/20 shadow-[0_0_20px_rgba(255,42,133,0.25)]'
          : ''
      } ${className}`}
    >
      {/* Dynamic Anisotropic Specular Glare Sheen */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl overflow-hidden z-20 transition-opacity duration-300"
        style={{
          opacity: tilt.glareOpacity,
          background: `radial-gradient(circle 320px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.2) 35%, rgba(255,255,255,0) 70%)`,
          mixBlendMode: 'overlay',
        }}
      />
      {/* Photorealistic Milled Metal Torx Screws in Corners */}
      <TorxScrew size={11} className="absolute left-2.5 top-2.5" />
      <TorxScrew size={11} className="absolute right-2.5 top-2.5" />
      <TorxScrew size={11} className="absolute left-2.5 bottom-2.5" />
      <TorxScrew size={11} className="absolute right-2.5 bottom-2.5" />

      {/* Top Header: Clean Hardware Metadata & Controls */}
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#e2ddd3] px-1">
          {/* Module Serial, Status LED, and Social Beacons */}
          <div className="flex items-center gap-2 flex-wrap">
            <PhotorealLED
              status={isChecking ? 'checking' : isAvail ? 'available' : 'registered'}
              size={9}
            />
            <span className="font-mono text-[10px] font-bold text-neutral-500 tracking-widest uppercase">
              MOD 0{slotNumber}
            </span>
            <SocialBeaconStrip handle={activeSlug} />
          </div>

          {/* Minimal Tactile Action Pills */}
          <div className="flex items-center gap-1.5">
            {/* Real-World Identity Viewfinder Scope */}
            {onOpenViewfinder && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (soundFX) soundFX.playLock()
                  onOpenViewfinder({
                    name,
                    domain: activeSlug,
                    tld: selectedTld,
                    rationale,
                    category,
                  })
                }}
                title="Open Real-World Identity Scope (Browser tab, App icon, Shipping label)"
                className="w-6 h-6 rounded flex items-center justify-center text-xs text-neutral-500 hover:text-black hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                👁️
              </button>
            )}

            {/* Audio Voice Listen Button */}
            <button
              type="button"
              onClick={handleSpeak}
              title="Pronounce brand name"
              className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-all cursor-pointer ${
                isSpeaking
                  ? 'bg-[#22c55e] text-white shadow-[0_0_8px_#22c55e] scale-105'
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-200'
              }`}
            >
              🔊
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
              className={`w-6 h-6 rounded flex items-center justify-center text-xs transition-all cursor-pointer ${
                isCompared
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-400 hover:text-black hover:bg-neutral-200'
              }`}
            >
              ⚖️
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
              className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold transition-all cursor-pointer ${
                isShortlisted
                  ? 'bg-amber-400 text-black shadow-xs'
                  : 'text-neutral-400 hover:text-amber-500 hover:bg-neutral-200'
              }`}
            >
              ★
            </button>

            {/* Hold / Lock Switch */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                if (onToggleLock) onToggleLock()
              }}
              title={isLocked ? 'Unlock slot for regeneration' : 'Hold this card from regenerating'}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all cursor-pointer ${
                isLocked
                  ? 'bg-[#ff2a85] text-white shadow-xs'
                  : 'bg-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-300'
              }`}
            >
              {isLocked ? '🔒 HELD' : 'HOLD'}
            </button>
          </div>
        </div>

        {/* Phonetic Syllable Track & Real-Time Audio Oscilloscope */}
        <div className="flex items-center justify-between text-[10px] font-mono px-1 mb-1.5 pb-1 border-b border-dashed border-[#e6e2d8]">
          <div className="flex items-center gap-1.5 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-bold tracking-wider text-neutral-400">PHON:</span>
            <span className="tracking-wider text-neutral-800 font-bold text-[10px]">
              {syllablesText}
            </span>
            <span className="text-[9px] px-1 py-0.2 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 font-bold">
              {phonetics.tone}
            </span>
          </div>

          {/* Interactive Oscilloscope Scope Monitor */}
          <div className="shrink-0 pl-1.5">
            <AudioOscilloscope active={isSpeaking} tone={phonetics.tone} />
          </div>
        </div>

        {/* Brand Name Headline */}
        <div className="px-1 mb-1">
          <h3 className="text-2xl sm:text-[28px] font-display font-extrabold tracking-tight text-neutral-900 leading-snug">
            {name}
          </h3>
        </div>

        {/* Clean Domain & Availability Line */}
        <div className="flex items-center justify-between text-xs font-mono px-1 mb-3.5 pb-2.5 border-b border-[#e2ddd3]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 text-sm tracking-tight">
              {activeSlug}{selectedTld}
            </span>
            <button
              type="button"
              onClick={!isAvail ? (e) => {
                e.stopPropagation()
                if (soundFX) soundFX.playLock()
                if (onOpenWhois) onOpenWhois(fullDomain)
              } : undefined}
              className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase transition-all flex items-center gap-1 ${
                isChecking
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : isAvail
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 hover:text-black cursor-pointer border border-neutral-300'
              }`}
              title={!isAvail ? 'Inspect WHOIS and live DNS telemetry' : 'Domain is free to register'}
            >
              <span>{isChecking ? 'Checking...' : isAvail ? 'Available' : 'Registered'}</span>
              {!isAvail && <span className="text-[9px] text-neutral-500">🔍</span>}
            </button>
          </div>

          <div className="text-right">
            <span className="font-extrabold text-neutral-900 text-sm">
              ${priceInfo.reg}
            </span>
            <span className="text-[10px] text-neutral-500 font-medium">/yr</span>
          </div>
        </div>

        {/* Streamlined Tactile TLD Chiclet Selector */}
        <div className="px-1 mb-3">
          <div className="flex items-center gap-1.5">
            {['.com', '.io', '.ai', '.co'].map((ext) => {
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
                    setActiveSlug(domain)
                    setOverrideAvail(null)
                  }}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-center transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-[#ff2a85] border-[#d90f61] text-white shadow-xs'
                      : 'bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-[11px] font-mono font-bold">
                    {ext}
                  </span>
                  <span className={`text-[9px] font-mono ${isSelected ? 'text-pink-100' : 'text-neutral-500'}`}>
                    ${p.reg}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Smart .com Affix Fallback Strip (when base domain is registered/taken) */}
        {!isAvail && (
          <div className="px-1 mb-3 pt-2 border-t border-dashed border-[#d8d3c7]">
            <div className="flex items-center justify-between text-[9px] font-mono font-bold text-neutral-500 mb-1.5">
              <span>SMART .COM AFFIXES:</span>
              <span className="text-emerald-700 font-extrabold">FREE ALTERNATIVES</span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {affixes.map((aff) => {
                const isAffSelected = activeSlug === aff.slug && selectedTld === '.com'
                return (
                  <button
                    key={aff.slug}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (soundFX) soundFX.playKeyThud()
                      setActiveSlug(aff.slug)
                      setSelectedTld('.com')
                      setOverrideAvail('available')
                    }}
                    title={`Switch to free alternative: ${aff.label}`}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                      isAffSelected
                        ? 'bg-neutral-900 border-black text-white shadow-2xs'
                        : 'bg-white border-neutral-300 text-neutral-800 hover:border-neutral-500'
                    }`}
                  >
                    {aff.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Card Footer: Clear & Decisive Actions */}
      <div className="pt-2 border-t border-[#e2ddd3] flex items-center justify-between gap-3 px-1">
        <button
          type="button"
          onClick={handleCopyClick}
          className="px-3.5 py-1.5 bg-white border border-neutral-300 text-neutral-700 hover:text-black font-mono text-[11px] font-bold rounded-lg cursor-pointer transition-colors shadow-2xs"
        >
          {isCopied ? '✓ COPIED' : '📋 COPY'}
        </button>

        <button
          type="button"
          onClick={handleRegisterClick}
          className={`${
            isAvail
              ? 'tactile-pink-btn text-white'
              : 'bg-neutral-900 hover:bg-black text-white border border-neutral-800'
          } px-4 sm:px-5 py-2 font-mono text-xs font-black rounded-lg cursor-pointer flex items-center gap-1.5 shadow-sm transition-all`}
        >
          <span>{isAvail ? 'BUY DOMAIN' : 'WHOIS INTEL'}</span>
          <span className="text-[11px]">{isAvail ? '➔' : '🔍'}</span>
        </button>
      </div>
    </div>
  )
}
