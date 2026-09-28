import React from 'react'
import TactileConsoleHeader from './TactileConsoleHeader.jsx'

/**
 * TerminalFrame: High-Fidelity Retro-Futuristic Industrial Hardware Workstation
 * Benchmarked 1:1 against the user-provided console reference:
 * - Technical blueprint crosshair grid background with "+" registration marks
 * - Top molded capsule navigation bar with hot-pink "• 01 BRIEF" and hardware SFX switch
 * - Living tactile interactive controls: turnable spun-aluminum dial, draggable vertical faders, chiclets, and buttons
 */
export default function TerminalFrame({
  children,
  currentView,
  onViewChange,
  soundMuted,
  onToggleSound,
  hunterRank,
  xp = 0,
  shortlistCount = 0,
  compareCount = 0,
  questionsCount = 0,
  onOpenShortlist,
  onOpenCompare,
  onOpenQuestions,
  soundFX,
}) {
  return (
    <div className="blueprint-cross-grid min-h-screen w-full flex flex-col justify-start items-center py-2 sm:py-4 px-2 sm:px-4 md:px-6 text-neutral-900 selection:bg-[#ff2a85] selection:text-white font-mono relative overflow-x-clip">
      
      {/* Precision Blueprint Crosshair Corner Marks (+) */}
      <span className="fixed left-4 top-4 text-xs font-mono font-bold text-neutral-400 select-none pointer-events-none">+</span>
      <span className="fixed right-4 top-4 text-xs font-mono font-bold text-neutral-400 select-none pointer-events-none">+</span>
      <span className="fixed left-4 bottom-4 text-xs font-mono font-bold text-neutral-400 select-none pointer-events-none">+</span>
      <span className="fixed right-4 bottom-4 text-xs font-mono font-bold text-neutral-400 select-none pointer-events-none">+</span>

      {/* 1. TOP CAPSULE NAVIGATION BAR */}
      <TactileConsoleHeader
        currentView={currentView}
        onViewChange={onViewChange}
        soundMuted={soundMuted}
        onToggleSound={onToggleSound}
        shortlistCount={shortlistCount}
        compareCount={compareCount}
        onOpenShortlist={onOpenShortlist}
        onOpenCompare={onOpenCompare}
        onOpenQuestions={onOpenQuestions}
        soundFX={soundFX}
      />

      {/* 2. LIVING CONTENT VIEWPORT */}
      <div className="w-full max-w-[1240px] mx-auto">
        {children}
      </div>

    </div>
  )
}
