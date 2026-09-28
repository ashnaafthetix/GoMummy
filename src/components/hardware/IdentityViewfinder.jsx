import React, { useEffect, useState } from 'react'
import TorxScrew from './TorxScrew.jsx'
import PhotorealLED from './PhotorealLED.jsx'
import { getDomainPrice, analyzePhonetics } from '../../services/domainService.js'

/**
 * IdentityViewfinder: Photorealistic Real-World Identity Scope.
 * Visualizes any candidate brand across 3 tactile real-world artifacts:
 * 1. Desktop Browser Tab & Window Bar with SSL lock and landing viewport
 * 2. Mobile App Store Squircle Icon with procedural geometric monogram
 * 3. Minimalist Thermal Shipping Label / Industrial Kraft Stationery
 */
export default function IdentityViewfinder({
  card,
  onClose,
  onToggleShortlist,
  isShortlisted = false,
  soundFX,
}) {
  const [activeTab, setActiveTab] = useState('all') // 'all' | 'browser' | 'app' | 'thermal'
  const [copiedSpec, setCopiedSpec] = useState(false)

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

  if (!card) return null

  const brandName = card.name || card.domain || 'Brand'
  const domainSlug = (card.domain || 'brand').toLowerCase().replace(/[^a-z0-9]/g, '')
  const selectedTld = card.tld || '.com'
  const fullDomain = `${domainSlug}${selectedTld}`
  const price = getDomainPrice(selectedTld)
  const phonetics = analyzePhonetics(brandName)

  // Generate 2-letter monogram glyph
  const initials = brandName
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || brandName.substring(0, 2).toUpperCase()

  const copySpec = async () => {
    const spec = `BRAND IDENTITY SPECIFICATION
---------------------------------
Name:       ${brandName}
Domain:     ${fullDomain}
Syllables:  ${phonetics.syllables} (${phonetics.tone})
Category:   ${card.rationale?.trait || 'Digital Brand'}
Price:      $${price.reg} reg / $${price.renew} renewal
SSL:        DNS Verified (Google DoH)`
    try {
      await navigator.clipboard.writeText(spec)
    } catch {
      // fallback
    }
    if (soundFX) soundFX.playKeyThud()
    setCopiedSpec(true)
    setTimeout(() => setCopiedSpec(false), 2000)
  }

  return (
    <>
      {/* 1. Ambient Backdrop (Click to Disengage) */}
      <div
        onClick={() => {
          if (soundFX) soundFX.playTick()
          onClose()
        }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-[2px] transition-opacity cursor-pointer animate-[fadeIn_0.2s_ease-out]"
      />

      {/* 2. Docked Hardware Viewfinder Drawer Anchored to Bottom */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center justify-end pointer-events-none font-mono">
        <div
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-[1240px] px-2 sm:px-6 hardware-tray-slide-up"
        >
          <div className="hardware-tray-chassis relative rounded-t-[32px] sm:rounded-t-[40px] p-5 sm:p-7 max-h-[90vh] flex flex-col shadow-2xl text-neutral-800">
            
            {/* Precision Torx Screws in Corners */}
            <TorxScrew size={14} className="absolute left-4 top-4" />
            <TorxScrew size={14} className="absolute right-4 top-4" />

            {/* Aluminum Handle / Latch Bar */}
            <div className="flex justify-center mb-3">
              <div
                onClick={() => {
                  if (soundFX) soundFX.playTick()
                  onClose()
                }}
                className="tray-handle-latch px-8 py-1.5 rounded-full flex items-center gap-3 cursor-pointer shadow-inner hover:brightness-105 active:translate-y-0.5 transition-all"
                title="Click handle to close viewfinder"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                  ≡ IDENTITY SCOPE // CLICK HANDLE TO CLOSE
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              </div>
            </div>

            {/* Header Row */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-5 border-b border-[#dbd6cc] gap-3">
              <div className="flex items-center gap-2.5">
                <PhotorealLED status="pink" size={9} />
                <span className="px-2.5 py-0.5 bg-[#181715] text-white text-xs font-black rounded shadow-2xs">
                  👁️ REAL-WORLD SCOPE
                </span>
                <span className="font-display font-black text-lg sm:text-xl text-neutral-900 tracking-tight">
                  {brandName}
                </span>
                <span className="text-xs text-neutral-500 font-bold bg-[#ece8e0] px-2 py-0.5 rounded border border-[#d8d3c8]">
                  {fullDomain}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copySpec}
                  className="tactile-chiclet px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-800 cursor-pointer shadow-2xs"
                >
                  {copiedSpec ? '✓ SPEC COPIED' : '📋 COPY SPEC'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (soundFX) soundFX.playTick()
                    onClose()
                  }}
                  className="tactile-chiclet px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-700 hover:text-black transition-colors cursor-pointer shadow-2xs"
                >
                  ✕ CLOSE
                </button>
              </div>
            </div>

            {/* Artifact Showcase Grid (3 Columns) */}
            <div className="overflow-y-auto pr-1 flex-1 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* ------------------------------------------------------------- */}
                {/* ARTIFACT 1: DESKTOP BROWSER TAB & ACTIVE SSL WINDOW */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-white rounded-2xl border border-neutral-300 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    {/* Artifact Title */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        ARTIFACT 01 // DESKTOP WEB
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        SSL 256-BIT
                      </span>
                    </div>

                    {/* Simulated Browser Chrome Shell */}
                    <div className="rounded-xl border border-neutral-200 bg-neutral-100 overflow-hidden shadow-inner">
                      {/* Browser Window Bar */}
                      <div className="bg-[#e8e4dc] px-3 py-1.5 flex items-center justify-between border-b border-neutral-300">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] inline-block border border-black/10" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] inline-block border border-black/10" />
                          <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f] inline-block border border-black/10" />
                        </div>
                        {/* Tab Pill */}
                        <div className="bg-white px-3 py-1 rounded-t-lg border-t border-x border-neutral-300 flex items-center gap-2 text-[10px] font-bold text-neutral-700 shadow-2xs -mb-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#ff2a85] inline-block" />
                          <span className="truncate max-w-[120px]">{brandName} — Home</span>
                          <span className="text-neutral-400 text-[9px] hover:text-black cursor-pointer">✕</span>
                        </div>
                        <div className="w-6" />
                      </div>

                      {/* Omnibox URL Bar */}
                      <div className="bg-white px-3 py-1.5 border-b border-neutral-200 flex items-center gap-2 text-xs">
                        <div className="flex-1 bg-neutral-50 px-2.5 py-1 rounded-md border border-neutral-200 flex items-center gap-1.5 text-[11px] text-neutral-700">
                          <span className="text-emerald-600 text-[10px]">🔒</span>
                          <span className="font-bold text-neutral-900">{fullDomain}</span>
                          <span className="text-neutral-400">/</span>
                        </div>
                      </div>

                      {/* Landing Page Preview Viewport */}
                      <div className="p-6 bg-gradient-to-br from-white to-[#faf8f5] text-center min-h-[140px] flex flex-col justify-center items-center">
                        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-[#ff2a85] mb-1">
                          INTRODUCING {brandName.toUpperCase()}
                        </span>
                        <h4 className="font-display font-black text-2xl text-neutral-900 tracking-tight leading-tight">
                          {brandName}
                        </h4>
                        <p className="text-xs text-neutral-500 mt-1 max-w-[200px]">
                          {card.rationale?.trait || 'Modern software & industrial hardware.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>DNS Status: Active</span>
                    <span className="font-bold text-neutral-800">100% Ownable</span>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* ARTIFACT 2: MOBILE APP STORE SQUIRCLE ICON */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-white rounded-2xl border border-neutral-300 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    {/* Artifact Title */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        ARTIFACT 02 // APP MONOGRAM
                      </span>
                      <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                        iOS / macOS SQUIRCLE
                      </span>
                    </div>

                    {/* App Icon Presentation */}
                    <div className="bg-[#f5f2eb] rounded-xl p-5 border border-[#e2ddd3] flex flex-col items-center justify-center shadow-inner">
                      {/* Continuous-Curve Apple Squircle Icon */}
                      <div className="w-24 h-24 rounded-[26px] bg-gradient-to-tr from-[#141312] via-[#2a2622] to-[#ff2a85] flex flex-col items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.28)] border border-white/20 relative overflow-hidden group">
                        {/* Specular Highlight Sheen */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Procedural Geometric Monogram */}
                        <span className="font-display font-black text-3xl text-white tracking-wider relative drop-shadow-md">
                          {initials}
                        </span>
                        <div className="w-4 h-0.5 bg-[#ff2a85] rounded-full mt-0.5" />
                      </div>

                      {/* App Name and Store Details */}
                      <div className="text-center mt-3">
                        <span className="font-bold text-sm text-neutral-900 block font-display">
                          {brandName}
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mt-0.5">
                          {card.category || 'PRODUCTIVITY // UTILITIES'}
                        </span>
                        <div className="flex items-center justify-center gap-1 mt-1 text-[11px] text-amber-500">
                          <span>★★★★★</span>
                          <span className="text-neutral-500 font-bold text-[10px]">5.0 (2.4K)</span>
                        </div>
                      </div>

                      {/* App Store 'GET' Chiclet */}
                      <div className="mt-3">
                        <button
                          type="button"
                          className="px-5 py-1 rounded-full bg-neutral-900 text-white font-bold text-xs uppercase tracking-wider shadow-2xs hover:bg-[#ff2a85] transition-colors cursor-pointer"
                        >
                          GET
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Monogram: {initials}</span>
                    <span className="font-bold text-neutral-800">512px Retina Ready</span>
                  </div>
                </div>

                {/* ------------------------------------------------------------- */}
                {/* ARTIFACT 3: MINIMALIST THERMAL SHIPPING LABEL / STATIONERY */}
                {/* ------------------------------------------------------------- */}
                <div className="bg-white rounded-2xl border border-neutral-300 p-4 shadow-xs flex flex-col justify-between">
                  <div>
                    {/* Artifact Title */}
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-100">
                      <span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">
                        ARTIFACT 03 // THERMAL LABEL
                      </span>
                      <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                        KRAFT STATIONERY
                      </span>
                    </div>

                    {/* High-Contrast Industrial Courier Label */}
                    <div className="bg-[#fcfaf7] border-2 border-dashed border-neutral-400 rounded-xl p-4 font-mono text-[11px] text-neutral-900 shadow-sm relative">
                      {/* Perforation Stamp */}
                      <div className="flex justify-between items-center pb-2 mb-2 border-b-2 border-black">
                        <div className="flex items-center gap-1.5">
                          <span className="font-black text-sm tracking-tighter">GM-EXPRESS</span>
                          <span className="text-[9px] bg-black text-white px-1.5 py-0.2 font-bold rounded">PRIORITY</span>
                        </div>
                        <span className="font-bold text-[10px]">HUB: SFO / 94107</span>
                      </div>

                      {/* Consignee Data */}
                      <div className="space-y-1 my-2">
                        <div className="text-[9px] text-neutral-500 font-bold uppercase">CONSIGNEE IDENTIFIER:</div>
                        <div className="font-black text-base text-neutral-900 tracking-tight">
                          {brandName.toUpperCase()} CORP.
                        </div>
                        <div className="text-neutral-600 text-[10px]">
                          URI: https://{fullDomain}
                        </div>
                        <div className="text-[10px] text-neutral-500">
                          PHONETICS: {phonetics.syllables} SYL // {phonetics.tone.toUpperCase()}
                        </div>
                      </div>

                      {/* Procedural High-Density Barcode */}
                      <div className="my-3 pt-2 border-t border-neutral-300">
                        <div className="h-8 w-full flex items-stretch gap-[1.5px] overflow-hidden">
                          {Array.from({ length: 48 }).map((_, i) => (
                            <div
                              key={i}
                              className="bg-black shrink-0"
                              style={{
                                width: (i % 3 === 0 || i % 7 === 0) ? '3px' : '1.5px',
                                opacity: (i % 5 === 0) ? 0.35 : 1,
                              }}
                            />
                          ))}
                        </div>
                        <div className="text-center text-[9px] tracking-widest text-neutral-500 mt-1">
                          * GM-{domainSlug.toUpperCase().substring(0, 6)}-{phonetics.syllables}09 *
                        </div>
                      </div>

                      {/* Verification Stamp */}
                      <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-[9px] text-neutral-500">
                        <span>ORIGIN: GOMUMMY SYSTEM V1</span>
                        <span className="font-bold text-neutral-800">ICANN VERIFIED</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                    <span>Packaging: Thermal Matte</span>
                    <span className="font-bold text-neutral-800">100 x 150 mm</span>
                  </div>
                </div>

              </div>

              {/* Footer Summary / Quick Registration CTA */}
              <div className="bg-[#ece8e0] rounded-xl p-4 border border-[#d8d3c8] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs">
                    {initials}
                  </div>
                  <div>
                    <span className="font-bold text-sm text-neutral-900 block font-display">
                      {brandName} ({fullDomain})
                    </span>
                    <span className="text-[11px] text-neutral-600">
                      Standard Registration: ${price.reg}/1st yr • Renewal: ${price.renew}/yr
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (onToggleShortlist) onToggleShortlist(card)
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs ${
                      isShortlisted
                        ? 'bg-amber-400 text-black border border-amber-500'
                        : 'bg-white text-neutral-800 border border-neutral-300 hover:border-black'
                    }`}
                  >
                    {isShortlisted ? '★ SAVED IN SHORTLIST' : '★ SAVE TO SHORTLIST'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (soundFX) soundFX.playAvailable()
                      alert(`Redirecting to ${price.registrar} to register ${fullDomain} ($${price.reg})...`)
                    }}
                    className="tactile-pink-btn px-6 py-2 rounded-xl text-white text-xs font-black cursor-pointer shadow-sm"
                  >
                    REGISTER {fullDomain.toUpperCase()} ➔
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}
