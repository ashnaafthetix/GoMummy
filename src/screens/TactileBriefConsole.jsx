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

  // Stepped detents and physics refs
  const lastDetentRef = useRef(Math.round(creativityAngle / 15) * 15)
  const lastKnobAngleRef = useRef(creativityAngle)
  const lastKnobTimeRef = useRef(0)
  const knobVelocityRef = useRef(0)
  const knobAnimFrameRef = useRef(null)

  const lastFaderStepRef = useRef({
    innovative: Math.round(78 / 5) * 5,
    simple: Math.round(45 / 5) * 5,
    premium: Math.round(85 / 5) * 5,
  })

  // Handle Knob Drag (Turnable Radial Dial with stepped detents and momentum decay)
  const handleKnobPointerDown = (e) => {
    if (knobAnimFrameRef.current) cancelAnimationFrame(knobAnimFrameRef.current)
    setIsDraggingKnob(true)
    lastKnobAngleRef.current = creativityAngle
    lastKnobTimeRef.current = performance.now()
    knobVelocityRef.current = 0
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
      
      // 15° Stepped physical detents (18 distinct notches across 270°)
      const currentDetent = Math.round(clamped / 15) * 15
      if (currentDetent !== lastDetentRef.current) {
        if (soundFX) soundFX.playTick()
        lastDetentRef.current = currentDetent
      }

      // Track angular velocity for inertia
      const now = performance.now()
      const dt = now - lastKnobTimeRef.current
      if (dt > 0 && dt < 120) {
        knobVelocityRef.current = (clamped - lastKnobAngleRef.current) / dt
      }
      lastKnobTimeRef.current = now
      lastKnobAngleRef.current = clamped

      setCreativityAngle(clamped)
    }

    const handlePointerUp = () => {
      if (!isDraggingKnob) return
      setIsDraggingKnob(false)

      // Inertia momentum decay on release
      let vel = knobVelocityRef.current
      if (Math.abs(vel) > 0.12) {
        let currentAng = lastKnobAngleRef.current
        const runInertia = () => {
          vel *= 0.88 // authentic mechanical friction decay
          currentAng += vel * 16
          if (currentAng > 135) {
            currentAng = 135
            vel = 0
          } else if (currentAng < -135) {
            currentAng = -135
            vel = 0
          }

          const step = Math.round(currentAng / 15) * 15
          if (step !== lastDetentRef.current) {
            if (soundFX) soundFX.playTick()
            lastDetentRef.current = step
          }

          if (Math.abs(vel) > 0.02) {
            setCreativityAngle(currentAng)
            knobAnimFrameRef.current = requestAnimationFrame(runInertia)
          } else {
            // Clean snap to nearest 15° detent notch
            const finalSnap = Math.round(currentAng / 15) * 15
            setCreativityAngle(finalSnap)
            lastKnobAngleRef.current = finalSnap
          }
        }
        knobAnimFrameRef.current = requestAnimationFrame(runInertia)
      }
    }

    if (isDraggingKnob) {
      window.addEventListener('pointermove', handlePointerMove)
      window.addEventListener('pointerup', handlePointerUp)
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      if (knobAnimFrameRef.current) cancelAnimationFrame(knobAnimFrameRef.current)
    }
  }, [isDraggingKnob, soundFX])

  // Handle Vertical Fader Drag with 5% Calibrated Detents
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
      
      // Calibrated 5% notch detent sound
      const step = Math.round(percent / 5) * 5
      if (lastFaderStepRef.current[activeFader] !== step) {
        if (soundFX) soundFX.playTick()
        lastFaderStepRef.current[activeFader] = step
      }
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
      <div className="text-center my-6 sm:my-8">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-wider text-neutral-900 font-headline uppercase leading-none">
          DOMAIN SEARCH IS OUR ART
        </h1>
        <p className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.28em] text-neutral-500 uppercase mt-2.5 sm:mt-3">
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

        <div className="w-full space-y-4 relative z-10">
          
          {/* ------------------------------------------------------------ */}
          {/* SECTION 01: PRIMARY SUBJECT NAME & TLD & CREATIVITY KNOB     */}
          {/* ------------------------------------------------------------ */}
          <div className="hardware-subpanel-bay p-4 sm:p-5">
            
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black text-white font-black text-[10px] rounded font-mono">
                  01
                </span>
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider font-mono">
                  PRIMARY SUBJECT NAME
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">
                <span className="text-[#ff2a85] text-xs">◆</span>
                <span>PREFER TLD</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
              
              {/* Inset Typing Well with Glowing Hot-Pink Neon Border */}
              <div className="neon-pink-well bg-white flex-1 min-w-[260px] rounded-xl px-4 py-3 flex items-center relative shadow-inner">
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

              {/* Prefer TLD Chiclet Keycaps & Creativity Rotary Knob */}
              <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-4 shrink-0">
                
                {/* TLD Chiclets */}
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {['.com', '.io', '.ai'].map((ext) => (
                    <button
                      key={ext}
                      type="button"
                      onClick={() => handleTldClick(ext)}
                      className={`px-3.5 sm:px-4 py-2 rounded-xl font-mono text-xs font-black transition-all cursor-pointer ${
                        tld === ext
                          ? 'tactile-chiclet-active'
                          : 'tactile-chiclet text-neutral-800'
                      }`}
                    >
                      {ext}
                    </button>
                  ))}
                </div>

                {/* Circular Rotary Assembly with Perimeter Ticks */}
                <div className="flex flex-col items-center justify-center pl-1 sm:pl-2">
                  <div className="relative w-18 h-18 flex items-center justify-center">
                    {/* 12 Perimeter Ticks Ring */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 72 72">
                      {Array.from({ length: 12 }).map((_, i) => {
                        const angle = i * 30 * (Math.PI / 180)
                        const x1 = 36 + 32 * Math.sin(angle)
                        const y1 = 36 - 32 * Math.cos(angle)
                        const x2 = 36 + 28 * Math.sin(angle)
                        const y2 = 36 - 28 * Math.cos(angle)
                        return (
                          <line
                            key={i}
                            x1={x1}
                            y1={y1}
                            x2={x2}
                            y2={y2}
                            stroke="#847e72"
                            strokeWidth="1.25"
                            strokeLinecap="round"
                          />
                        )
                      })}
                    </svg>

                    {/* Turnable Anisotropic Aluminum Radial Dial */}
                    <div
                      ref={knobRef}
                      onPointerDown={handleKnobPointerDown}
                      className="spun-aluminum-knob-deluxe relative w-13 h-13 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center select-none"
                      style={{ transform: `rotate(${creativityAngle}deg)` }}
                      title={`Creativity Knob: ${Math.round(((creativityAngle + 135) / 270) * 100)}% (Click & drag to rotate)`}
                    >
                      {/* Indented Core with Specular Chamfer */}
                      <div className="w-5 h-5 rounded-full bg-gradient-to-b from-[#a8a49c] to-[#ffffff] border border-neutral-300 shadow-inner" />
                      {/* Radial Pointer Notch on top */}
                      <div className="absolute top-1 w-1 h-2.5 rounded-full bg-[#1c1d20] shadow-xs" />
                    </div>
                  </div>

                  <span className="text-[9px] font-black text-neutral-600 tracking-wider uppercase mt-0.5 font-mono">
                    CREATIVITY
                  </span>
                </div>

              </div>

            </div>

          </div>

          {/* ------------------------------------------------------------ */}
          {/* SECTION 02: BRAND FLAVOR & 3 VERTICAL HARDWARE FADERS        */}
          {/* ------------------------------------------------------------ */}
          <div className="hardware-subpanel-bay p-4 sm:p-5">
            
            <div className="flex flex-wrap items-center justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black text-white font-black text-[10px] rounded font-mono">
                  02
                </span>
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider font-mono">
                  BRAND FLAVOR / DESCRIPTION
                </span>
              </div>
              <div className="text-[10px] font-bold text-neutral-400 tracking-wider font-mono">
                {charCount} / 1000 CHARS
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              
              {/* Description Textarea + Flavor Tags (9 COLS) */}
              <div className="lg:col-span-9 flex flex-col justify-between">
                
                {/* Recessed Textarea Well */}
                <div className="hardware-inset-panel rounded-xl p-3.5 sm:p-4 mb-3 border border-[#d8d3c8] bg-white/70">
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

              {/* 3 Vertical Hardware Fader Tracks with Side Rulers (3 COLS) */}
              <div className="lg:col-span-3 flex items-center justify-around bg-[#ece8e0] border border-[#d8d3c8] rounded-xl p-3 shadow-inner">
                {[
                  { key: 'innovative', label: 'INNOVATIVE', val: faders.innovative },
                  { key: 'simple', label: 'SIMPLE', val: faders.simple },
                  { key: 'premium', label: 'PREMIUM', val: faders.premium },
                ].map((f) => (
                  <div key={f.key} className="flex flex-col items-center h-full justify-between py-1">
                    
                    {/* Vertical Slot Track with Side Tick Scales */}
                    <div className="flex items-center gap-1">
                      {/* Left Ruler Ticks */}
                      <div className="flex flex-col justify-between h-28 py-1 select-none text-[8px] font-mono text-neutral-400">
                        <span>-</span>
                        <span>-</span>
                        <span>-</span>
                        <span>-</span>
                        <span>-</span>
                      </div>

                      {/* Center Fader Track */}
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

                        {/* Metallic Brushed Fader Handle / Thumb with Center Grip Notch */}
                        <div
                          className="fader-thumb-metallic absolute -left-2.5 w-7.5 h-5.5 cursor-grab active:cursor-grabbing flex items-center justify-center shadow-md rounded-[4px]"
                          style={{ bottom: `calc(${f.val}% - 11px)` }}
                        >
                          <div className="w-5 h-[1.5px] bg-[#3a3731] shadow-inner" />
                        </div>
                      </div>

                      {/* Right Ruler Ticks */}
                      <div className="flex flex-col justify-between h-28 py-1 select-none text-[8px] font-mono text-neutral-400">
                        <span>-</span>
                        <span>-</span>
                        <span>-</span>
                        <span>-</span>
                        <span>-</span>
                      </div>
                    </div>

                    {/* Label Under Fader */}
                    <span className="text-[9px] font-black text-neutral-600 tracking-wider uppercase mt-2 font-mono">
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
                <span className="px-2 py-0.5 bg-black text-white font-black text-[10px] rounded font-mono">
                  03
                </span>
                <span className="text-[11px] font-bold text-neutral-700 uppercase tracking-wider font-mono">
                  COMPETITORS &amp; KEYWORDS TO AVOID
                </span>
              </div>

              {/* Collision Shield Sliding Toggle Switch */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider font-mono">
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

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Recessed Input Well for Competitors (8 COLS) */}
              <div className="lg:col-span-8 hardware-inset-panel rounded-xl px-4 py-3 border border-[#d8d3c8] bg-white/70">
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="Article, Floyd, Maiden Home, Herman Miller, sustainable, heirloom, modular"
                  className="w-full bg-transparent text-xs sm:text-[13px] font-mono text-neutral-800 focus:outline-none"
                />
              </div>

              {/* Giant Tactile Hot-Pink Find Names Button (4 COLS) */}
              <div className="lg:col-span-4">
                <button
                  type="submit"
                  className="tactile-pink-btn w-full py-3.5 px-6 rounded-2xl cursor-pointer flex items-center justify-between text-white font-mono font-black text-sm tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">▶</span>
                    <span>FIND NAMES</span>
                  </div>

                  <div className="bg-black/90 text-white px-2.5 py-1 rounded-md text-[10px] font-mono font-bold tracking-widest border border-white/20 shadow-inner">
                    ENTER ↵
                  </div>
                </button>
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
