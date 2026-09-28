import React from 'react'

/**
 * AudioOscilloscope: Precision Laboratory CRT Audio Waveform & Spectrum Analyzer
 * Replicating an authentic analog hardware oscilloscope screen:
 * - Phosphor green CRT monitor glow with dark glass bezel
 * - Fine graticule gridlines (laboratory reticle)
 * - Dynamic animated waveform / spectrum bars during pronunciation speech
 * - Clean baseline resting state with subtle heartbeat sweep
 */
export default function AudioOscilloscope({
  active = false,
  tone = 'Balanced',
  compact = false,
  className = '',
}) {
  // Height and bar profiles based on tone
  const barHeightsActive = [
    'h-2', 'h-3.5', 'h-4', 'h-2.5', 'h-4', 'h-3', 'h-4', 'h-2', 'h-3.5', 'h-1.5'
  ]

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#0a100c] border border-[#1d2d22] rounded px-1.5 py-0.5 shadow-inner select-none font-mono ${
        active ? 'ring-1 ring-[#22c55e]/50 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : ''
      } ${className}`}
      title={active ? 'Oscilloscope: Speech Audio Stream Active' : 'Oscilloscope: Standby'}
    >
      {/* Mini CRT Scope Screen */}
      <div className="relative w-12 sm:w-14 h-4 bg-[#080d0a] rounded-xs overflow-hidden flex items-center justify-center border border-[#142318]">
        {/* CRT Horizontal Graticule Centerline */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-[#22c55e]/15 pointer-events-none" />
        
        {/* CRT Vertical Sub-division Marks */}
        <div className="absolute inset-y-0 left-1/4 w-px bg-[#22c55e]/10 pointer-events-none" />
        <div className="absolute inset-y-0 left-2/4 w-px bg-[#22c55e]/15 pointer-events-none" />
        <div className="absolute inset-y-0 left-3/4 w-px bg-[#22c55e]/10 pointer-events-none" />

        {active ? (
          /* Animated Speech Frequency Bars */
          <div className="flex items-center justify-between w-full px-1 h-3.5 gap-[2px] z-10">
            <span className="w-1 bg-[#22c55e] rounded-full animate-bounce shadow-[0_0_4px_#22c55e]" style={{ animationDuration: '320ms', animationDelay: '0ms', height: '65%' }} />
            <span className="w-1 bg-[#22c55e] rounded-full animate-bounce shadow-[0_0_4px_#22c55e]" style={{ animationDuration: '280ms', animationDelay: '80ms', height: '95%' }} />
            <span className="w-1 bg-[#4ade80] rounded-full animate-bounce shadow-[0_0_4px_#22c55e]" style={{ animationDuration: '350ms', animationDelay: '140ms', height: '80%' }} />
            <span className="w-1 bg-[#22c55e] rounded-full animate-bounce shadow-[0_0_4px_#22c55e]" style={{ animationDuration: '260ms', animationDelay: '40ms', height: '100%' }} />
            <span className="w-1 bg-[#4ade80] rounded-full animate-bounce shadow-[0_0_4px_#22c55e]" style={{ animationDuration: '340ms', animationDelay: '120ms', height: '70%' }} />
            <span className="w-1 bg-[#22c55e] rounded-full animate-bounce shadow-[0_0_4px_#22c55e]" style={{ animationDuration: '300ms', animationDelay: '60ms', height: '85%' }} />
            <span className="w-1 bg-[#22c55e] rounded-full animate-bounce shadow-[0_0_4px_#22c55e]" style={{ animationDuration: '360ms', animationDelay: '160ms', height: '55%' }} />
          </div>
        ) : (
          /* Baseline Phosphor Trace with Idle Breathing Pulse */
          <svg className="w-full h-full z-10" viewBox="0 0 56 16" preserveAspectRatio="none">
            <path
              d="M 0 8 L 18 8 L 22 5 L 26 11 L 30 8 L 56 8"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.2"
              className="opacity-45"
            />
            {/* Tiny traveling sweep blip */}
            <circle cx="28" cy="8" r="1.5" fill="#4ade80" className="opacity-80 animate-ping" />
          </svg>
        )}

        {/* Scanline Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(34,197,94,0.06)_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Hardware Status Pill: LIVE vs OSC */}
      <div className="flex items-center gap-1">
        <span
          className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
            active
              ? 'bg-[#22c55e] shadow-[0_0_6px_#22c55e] animate-pulse'
              : 'bg-[#15803d]/40'
          }`}
        />
        <span
          className={`text-[9px] font-black tracking-widest uppercase ${
            active ? 'text-[#4ade80]' : 'text-neutral-500'
          }`}
        >
          {active ? 'LIVE' : 'OSC'}
        </span>
      </div>
    </div>
  )
}
