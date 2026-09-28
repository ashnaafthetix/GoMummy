import React, { useState, useRef, useEffect } from 'react'
import TorxScrew from '../components/hardware/TorxScrew.jsx'
import PhotorealLED from '../components/hardware/PhotorealLED.jsx'

export default function TactileBriefConsole({
  initial,
  onFindNames,
  onOpenQuestions,
  soundFX,
  xp = 0,
  hunterRank,
}) {
  const [name, setName] = useState(initial?.name || 'Loom & Carbon')
  const [description, setDescription] = useState(
    initial?.description ||
      'An independent industrial craft atelier creating modular architectural furniture, heritage shelving, and solid joinery tables from reclaimed urban hardwood and low-carbon extruded aluminum. Designed for generational longevity, disassembled flat-pack circularity, and visible exposed fasteners that invite repair rather than disposal.'
  )
  const [competitors, setCompetitors] = useState(
    initial?.competitors || 'Article, Floyd, Maiden Home, Herman Miller, sustainable, heirloom, modular'
  )
  const [tld, setTld] = useState(initial?.tld || '.com')
  const [collisionShield, setCollisionShield] = useState(true)

  // Interactive Hardware Controls State
  // 1. Spun Aluminum Radial Knob: CREATIVITY (Angle in degrees -135 to 135)
  const [creativityAngle, setCreativityAngle] = useState(15) // -135deg (0%) to +135deg (100%)
  const [isDraggingKnob, setIsDraggingKnob] = useState(false)
  const knobRef = useRef(null)

  // 2. Vertical Hardware Faders: INNOVATIVE, SIMPLE, PREMIUM (0 to 100%)
  const [faders, setFaders] = useState({
    innovative: 78,
    simple: 45,
    premium: 85,
  })
  const [activeFader, setActiveFader] = useState(null)

  // Active Flavor Tags
  const [activeFlavors, setActiveFlavors] = useState(['Architectural'])

  const flavorList = [
    { id: 'Architectural', icon: '🏷️', label: 'Architectural', snippet: 'brutalist architectural honesty, exposed structural joinery' },
    { id: 'Zero Plastic', icon: '🌱', label: 'Zero Plastic', snippet: 'zero synthetic veneers, 100% circular disassembled flat-pack' },
    { id: 'Quiet Nordic', icon: '✱', label: 'Quiet Nordic', snippet: 'whisper-quiet Scandinavian refinement, natural grain patina' },
    { id: 'Heirloom Utility', icon: '⊞', label: 'Heirloom Utility', snippet: 'generational longevity, visible tactile hardware' },
    { id: 'Reclaimed Craft', icon: '⛰️', label: 'Reclaimed Craft', snippet: 'reclaimed urban hardwood, low-carbon extruded aluminum' },
  ]

  // Handle Flavor Tag Click
  const toggleFlavor = (fl) => {
    if (soundFX) soundFX.playKeyThud()
    if (activeFlavors.includes(fl.id)) {
      setActiveFlavors(activeFlavors.filter((f) => f !== fl.id))
    } else {
      setActiveFlavors([...activeFlavors, fl.id])
      if (!description.includes(fl.snippet)) {
        const next = description.trim() ? `${description.trim()} Also featuring ${fl.snippet}.` : fl.snippet
        setDescription(next.slice(0, 1000))
      }
    }
  }

  // Handle TLD Chiclet Click
  const handleTldClick = (ext) => {
    if (soundFX) soundFX.playKeyThud()
    setTld(ext)
  }

  // Handle Knob Drag (Turnable Radial Dial)
  const handleKnobPointerDown = (e) => {
    setIsDraggingKnob(true)
    if (soundFX) soundFX.playTick()
  }

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!isDraggingKnob || !knobRef.current) return
      const rect = knobRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      let rad = Math.atan2(deltaY, deltaX)
      let deg = (rad * 180) / Math.PI + 90 // 0 at top
      if (deg > 180) deg -= 360
      // Clamp between -135 and +135
      const clamped = Math.max(-135, Math.min(135, deg))
      setCreativityAngle(clamped)
      if (soundFX) soundFX.playTick()
    }

    const handlePointerUp = () => {
      if (isDraggingKnob) setIsDraggingKnob(false)
    }

    if (isDraggingKnob) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [isDraggingKnob, soundFX])

  // Handle Vertical Fader Drag
  const handleFaderPointerDown = (key, e) => {
    setActiveFader(key)
    if (soundFX) soundFX.playTick()
  }

  useEffect(() => {
    const handleMove = (e) => {
      if (!activeFader) return
      const faderEl = document.getElementById(`fader-slot-${activeFader}`)
      if (!faderEl) return
      const rect = faderEl.getBoundingClientRect()
      const relativeY = rect.bottom - e.clientY
      const percent = Math.min(100, Math.max(0, Math.round((relativeY / rect.height) * 100)))
      setFaders((prev) => ({ ...prev, [activeFader]: percent }))
      if (soundFX) soundFX.playTick()
    }

    const handleUp = () => {
      if (activeFader) setActiveFader(null)
    }

    if (activeFader) {
      window.addEventListener('pointermove', handleMove)
      window.addEventListener('pointerup', handleUp)
    }
    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
    }
  }, [activeFader, soundFX])

  // Submit Handler
  const handleSubmit = (e) => {
    if (e) e.preventDefault()
    if (soundFX) {
      soundFX.playKeyThud()
      soundFX.playSpin()
    }
    onFindNames({
      name,
      description,
      competitors: collisionShield ? competitors : '',
      tld,
      creativity: Math.round(((creativityAngle + 135) / 270) * 100),
      faders,
    })
  }

  const charCount = description.length

  return (
    <div className="w-full max-w-[1240px] mx-auto px-2 sm:px-4 pb-12 font-mono select-none">
      
      {/* 1. TOP HEADER BANNER (👾 GOMUMMY // SYSTEM V1.0) */}
      <div className="flex flex-wrap items-center justify-between text-xs tracking-wider text-neutral-500 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[#ff2a85] text-sm">👾</span>
          <span className="font-bold text-neutral-800">GOMUMMY // SYSTEM V1.0 -</span>
        </div>
        <div className="font-semibold tracking-widest text-[11px] text-neutral-500">
          ----- DOMAIN &amp; BRAND NAME GENERATOR
        </div>
      </div>

      {/* 2. RETRO-FUTURISTIC MAIN TITLE */}
      <div className="text-center my-4 sm:my-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 font-display uppercase leading-tight">
          DOMAIN SEARCH IS OUR ART
        </h1>
        <p className="text-xs sm:text-sm font-bold tracking-widest text-neutral-500 uppercase mt-1">
          FIND A DOMAIN &amp; BRAND NAME YOU CAN ACTUALLY OWN
        </p>
      </div>

      {/* 3. MOLDED CREAM WORKSTATION HARDWARE CONSOLE */}
      <form onSubmit={handleSubmit} className="hardware-chassis-shell relative rounded-[28px] sm:rounded-[36px] p-4 sm:p-7 overflow-hidden text-neutral-800">
        
        {/* Photorealistic Milled Torx Screws in Chassis Corners */}
        <TorxScrew size={14} className="absolute left-4 top-4" />
        <TorxScrew size={14} className="absolute right-4 top-4" />
        <TorxScrew size={14} className="absolute left-4 bottom-4" />
        <TorxScrew size={14} className="absolute right-4 bottom-4" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 relative z-10">
          
          {/* ============================================================== */}
          {/* LEFT COLUMN: PERFORATED SPEAKER BAY & BRAND STAMP (2 COLS)     */}
          {/* ============================================================== */}
          <div className="lg:col-span-2 hidden lg:flex flex-col justify-between hardware-subpanel-bay p-4 relative overflow-hidden">
            
            {/* Hot-Pink Vertical Accent Handle/Lug */}
            <div className="absolute -left-1.5 top-12 w-3 h-14 bg-[#ff2a85] rounded-r-md shadow-[0_0_10px_rgba(255,42,133,0.6)]" />

            {/* Perforated Speaker Dot Grille */}
            <div className="w-full pt-2">
              <div className="grid grid-cols-6 gap-2 px-1 justify-items-center">
                {Array.from({ length: 48 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-[#201e1b] shadow-inner inline-block opacity-85"
                  />
                ))}
              </div>
            </div>

            {/* Debossed Stamped Brand Plaque */}
            <div className="mt-8 pt-4 border-t border-[#d8d4cc] text-left">
              <div className="font-display font-black text-sm text-neutral-900 tracking-wider">
                GOMUMMY
              </div>
              <div className="text-[9px] font-bold text-neutral-400 leading-tight tracking-wider uppercase mt-0.5">
                DOMAIN<br />BRAND NAME<br />GENERATOR
              </div>
            </div>

          </div>

          {/* ============================================================== */}
          {/* CENTER & RIGHT COLUMNS: INPUT BAYS, CONTROLS, FADERS (10 COLS) */}
          {/* ============================================================== */}
          <div className="lg:col-span-10 space-y-4">
            
            {/* ------------------------------------------------------------ */}
            {/* SECTION 01: PRIMARY SUBJECT NAME & TLD & CREATIVITY KNOB     */}
            {/* ------------------------------------------------------------ */}
            <div className="hardware-subpanel-bay p-4 sm:p-5">
              
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <PhotorealLED status="pink" size={8} />
                  <span className="px-2 py-0.5 bg-black text-white font-black text-[10px] rounded">
                    01
                  </span>
                  <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    PRIMARY SUBJECT NAME
                  </span>
                </div>
                <div className="text-[10px] font-bold text-neutral-400 tracking-wider uppercase">
                  STATUS : <span className="text-neutral-700">{name.trim() ? 'SPECIFIED' : 'EMPTY'}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                
                {/* Inset Typing Well */}
                <div className="hardware-inset-panel flex-1 min-w-[260px] rounded-xl px-4 py-3 flex items-center relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter target name..."
                    className="w-full bg-transparent text-xl sm:text-2xl font-bold font-mono text-neutral-900 focus:outline-none"
                  />
                  <span className="cursor-pink-blink text-[#ff2a85] text-2xl font-black select-none pointer-events-none -ml-1">
                    |
                  </span>
                </div>

                {/* Prefer TLD Chiclet Keycaps */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase mr-0.5 hidden sm:inline">
                    ◆ PREFER TLD
                  </span>
                  {['.com', '.io', '.ai'].map((ext) => (
                    <button
                      key={ext}
                      type="button"
                      onClick={() => handleTldClick(ext)}
                      className={`px-3.5 py-2 rounded-lg font-mono text-xs font-black transition-all cursor-pointer ${
                        tld === ext
                          ? 'tactile-chiclet-active'
                          : 'tactile-chiclet text-neutral-800'
                      }`}
                    >
                      {ext}
                    </button>
                  ))}
                </div>

                {/* Big Spun-Aluminum Radial Dial: CREATIVITY */}
                <div className="flex flex-col items-center justify-center pl-2">
                  <div className="relative p-1 flex items-center justify-center">
                    {/* Precision Dial Tick Ring */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-neutral-400/60 pointer-events-none" />
                    
                    <div
                      ref={knobRef}
                      onPointerDown={handleKnobPointerDown}
                      className="spun-aluminum-knob relative w-14 h-14 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
                      style={{ transform: `rotate(${creativityAngle}deg)` }}
                      title={`Creativity Knob: ${Math.round(((creativityAngle + 135) / 270) * 100)}% (Click & drag to rotate)`}
                    >
                      {/* Center Indented Core with Specular Chamfer */}
                      <div className="w-6 h-6 rounded-full bg-gradient-to-b from-[#b0b4b8] to-[#ffffff] border border-neutral-300 shadow-inner" />
                      {/* Radial Pointer Notch on top */}
                      <div className="absolute top-1 w-1 h-3 rounded-full bg-[#1c1d20] shadow-sm" />
                    </div>
                  </div>
                  <span className="text-[9px] font-black text-neutral-600 tracking-wider uppercase mt-1">
                    CREATIVITY
                  </span>
                </div>

              </div>

            </div>

            {/* ------------------------------------------------------------ */}
            {/* SECTION 02: BRAND FLAVOR & 3 VERTICAL HARDWARE FADERS        */}
            {/* ------------------------------------------------------------ */}
            <div className="hardware-subpanel-bay p-4 sm:p-5">
              
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <PhotorealLED status="pink" size={8} />
                  <span className="px-2 py-0.5 bg-black text-white font-black text-[10px] rounded">
                    02
                  </span>
                  <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    BRAND FLAVOR / DESCRIPTION
                  </span>
                </div>
                <div className="text-[10px] font-bold text-neutral-400 tracking-wider font-mono">
                  {charCount} / 1000 CHARS
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Description Textarea + Flavor Tags (9 COLS) */}
                <div className="md:col-span-9 flex flex-col justify-between">
                  
                  {/* Recessed Textarea Well */}
                  <div className="hardware-inset-panel rounded-xl p-3.5 sm:p-4 mb-3">
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value.slice(0, 1000))}
                      placeholder="Describe your brand essence, product traits, materials, and positioning..."
                      className="w-full bg-transparent text-xs sm:text-[13px] leading-relaxed font-mono text-neutral-800 focus:outline-none resize-none"
                    />
                  </div>

                  {/* 5 Tactile Flavor Tag Pills */}
                  <div className="flex flex-wrap items-center gap-2">
                    {flavorList.map((fl) => {
                      const isActive = activeFlavors.includes(fl.id)
                      return (
                        <button
                          key={fl.id}
                          type="button"
                          onClick={() => toggleFlavor(fl)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            isActive
                              ? 'tactile-chiclet-active'
                              : 'tactile-chiclet text-neutral-700'
                          }`}
                        >
                          <span>{fl.icon}</span>
                          <span>{fl.label}</span>
                        </button>
                      )
                    })}
                  </div>

                </div>

                {/* 3 Vertical Hardware Fader Tracks (3 COLS) */}
                <div className="md:col-span-3 flex items-center justify-around bg-[#ece8e0] border border-[#d8d3c8] rounded-xl p-3 shadow-inner">
                  {[
                    { key: 'innovative', label: 'INNOVATIVE', val: faders.innovative },
                    { key: 'simple', label: 'SIMPLE', val: faders.simple },
                    { key: 'premium', label: 'PREMIUM', val: faders.premium },
                  ].map((f) => (
                    <div key={f.key} className="flex flex-col items-center h-full justify-between py-1">
                      
                      {/* Vertical Slot Track */}
                      <div
                        id={`fader-slot-${f.key}`}
                        onPointerDown={(e) => handleFaderPointerDown(f.key, e)}
                        className="fader-slot-track w-2.5 h-28 relative cursor-pointer"
                        title={`${f.label}: ${f.val}% (Drag slider)`}
                      >
                        {/* Illuminated Hot-Pink Fill */}
                        <div
                          className="fader-glow-fill absolute bottom-0 left-0 right-0 transition-all duration-75"
                          style={{ height: `${f.val}%` }}
                        />

                        {/* Metallic Silver Fader Handle / Thumb */}
                        <div
                          className="fader-thumb-silver absolute -left-2.5 w-7 h-5 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center gap-0.5 shadow-md"
                          style={{ bottom: `calc(${f.val}% - 10px)` }}
                        >
                          <span className="w-4 h-[1px] bg-neutral-400" />
                          <span className="w-4 h-[1px] bg-neutral-400" />
                          <span className="w-4 h-[1px] bg-neutral-400" />
                        </div>
                      </div>

                      {/* Label Under Fader */}
                      <span className="text-[9px] font-black text-neutral-600 tracking-wider uppercase mt-2">
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>

              </div>

            </div>

            {/* ------------------------------------------------------------ */}
            {/* SECTION 03: COMPETITORS & COLLISION SHIELD & FIND NAMES CTA  */}
            {/* ------------------------------------------------------------ */}
            <div className="hardware-subpanel-bay p-4 sm:p-5">
              
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <PhotorealLED status="pink" size={8} />
                  <span className="px-2 py-0.5 bg-black text-white font-black text-[10px] rounded">
                    03
                  </span>
                  <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider">
                    COMPETITORS &amp; KEYWORDS TO AVOID
                  </span>
                </div>

                {/* Collision Shield Sliding Toggle Switch */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                    COLLISION SHIELD
                  </span>
                  <div
                    onClick={() => {
                      if (soundFX) soundFX.playSoftChirp()
                      setCollisionShield(!collisionShield)
                    }}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors cursor-pointer border flex items-center ${
                      collisionShield
                        ? 'bg-[#ff2a85] border-[#d90f61] shadow-[0_0_8px_rgba(255,42,133,0.5)]'
                        : 'bg-neutral-300 border-neutral-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                        collisionShield ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                
                {/* Recessed Input Well for Competitors (8 COLS) */}
                <div className="md:col-span-8 hardware-inset-panel rounded-xl px-4 py-3">
                  <input
                    type="text"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    placeholder="Enter competitors or terms to exclude..."
                    className="w-full bg-transparent text-xs sm:text-[13px] font-mono text-neutral-800 focus:outline-none"
                  />
                </div>

                {/* Giant Tactile Hot-Pink Find Names Button (4 COLS) */}
                <div className="md:col-span-4">
                  <button
                    type="submit"
                    className="tactile-pink-btn w-full py-3.5 px-6 rounded-2xl cursor-pointer flex items-center justify-between text-white font-display font-black text-sm tracking-wider"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">▶</span>
                      <span>FIND NAMES</span>
                    </div>

                    <div className="bg-black/85 text-white px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest border border-white/20">
                      ENTER ↵
                    </div>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>

      </form>

      {/* 4. BOTTOM AUXILIARY BAR */}
      <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 mt-4 px-2">
        <button
          type="button"
          onClick={() => {
            if (soundFX) soundFX.playSoftChirp()
            onOpenQuestions()
          }}
          className="tactile-chiclet px-3.5 py-2 rounded-xl text-neutral-700 font-bold hover:text-black transition-all cursor-pointer flex items-center gap-2"
        >
          <span className="text-[#ff2a85]">💖</span>
          <span>Sharpen with brand questions ➔</span>
        </button>

        <div className="font-bold tracking-widest text-[11px] text-neutral-400 uppercase mt-2 sm:mt-0">
          SHAPES IDEAS INTO OWNABLE NAMES.
        </div>
      </div>

    </div>
  )
}
