import React from 'react'

export default function TactileConsoleHeader({
  currentView,
  onViewChange,
  soundMuted,
  onToggleSound,
  shortlistCount = 0,
  compareCount = 0,
  onOpenShortlist,
  onOpenCompare,
  onOpenQuestions,
  soundFX,
}) {
  const handleTabClick = (view, callback) => {
    if (soundFX) soundFX.playKeyThud()
    if (callback) callback()
    else onViewChange(view)
  }

  return (
    <header className="sticky top-2 sm:top-3 z-40 w-full max-w-[1240px] mx-auto mb-4 sm:mb-6 px-2 sm:px-4">
      {/* Molded White/Cream Capsule Bar */}
      <div className="relative rounded-2xl sm:rounded-full bg-gradient-to-b from-[#ffffff] via-[#f7f5f0] to-[#ece8e1] border-[2px] border-[#d8d4cc] px-3 sm:px-4 py-2 sm:py-2.5 shadow-[0_8px_24px_rgba(0,0,0,0.1),0_1px_0_rgba(255,255,255,0.95)_inset] flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 font-mono">
        
        {/* Subtle Corner Screws on Header */}
        <span className="hidden sm:block absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-neutral-400 select-none">✜</span>
        <span className="hidden sm:block absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-neutral-400 select-none">✜</span>

        {/* Brand Identity */}
        <div className="flex items-center gap-2 pl-1 sm:pl-3">
          <span className="font-display font-black text-base sm:text-lg tracking-wider text-black">
            GOMUMMY
          </span>
          <span className="w-2 h-2 rounded-full bg-[#ff2a85] inline-block shadow-[0_0_8px_#ff2a85]" />
        </div>

        {/* Center Capsule Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto max-w-full py-0.5 no-scrollbar scroll-smooth">
          {/* 01 BRIEF TAB */}
          <button
            type="button"
            onClick={() => handleTabClick('brief')}
            className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              currentView === 'brief'
                ? 'bg-gradient-to-r from-[#ff3b94] via-[#ff2079] to-[#e60067] text-white shadow-[0_3px_12px_rgba(255,32,121,0.5),0_1px_0_rgba(255,255,255,0.5)_inset] border border-[#d90f61] translate-y-[-1px]'
                : 'bg-white/80 hover:bg-white text-neutral-600 hover:text-black border border-neutral-300/80 shadow-xs'
            }`}
          >
            {currentView === 'brief' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#fff]" />
            )}
            <span>01 BRIEF</span>
          </button>

          {/* 02 RESULTS TAB */}
          <button
            type="button"
            onClick={() => handleTabClick('results')}
            className={`px-3.5 sm:px-5 py-1.5 rounded-full text-xs font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 ${
              currentView === 'results'
                ? 'bg-gradient-to-r from-[#ff3b94] via-[#ff2079] to-[#e60067] text-white shadow-[0_3px_12px_rgba(255,32,121,0.5),0_1px_0_rgba(255,255,255,0.5)_inset] border border-[#d90f61] translate-y-[-1px]'
                : 'bg-white/80 hover:bg-white text-neutral-600 hover:text-black border border-neutral-300/80 shadow-xs'
            }`}
          >
            {currentView === 'results' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_4px_#fff]" />
            )}
            <span>02 RESULTS</span>
          </button>

          {/* ★ SHORTLIST TAB */}
          <button
            type="button"
            onClick={() => handleTabClick('shortlist', onOpenShortlist)}
            className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/80 hover:bg-white text-neutral-700 hover:text-black border border-neutral-300/80 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
          >
            <span className="text-amber-500">★</span>
            <span>SHORTLIST</span>
            {shortlistCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#ff2a85] text-white text-[10px] font-black rounded-full shadow-2xs">
                {shortlistCount}
              </span>
            )}
          </button>

          {/* VS COMPARE TAB */}
          <button
            type="button"
            onClick={() => handleTabClick('compare', onOpenCompare)}
            className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/80 hover:bg-white text-neutral-700 hover:text-black border border-neutral-300/80 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
          >
            <span>VS COMPARE</span>
            {compareCount > 0 && (
              <span className="px-1.5 py-0.2 bg-black text-white text-[10px] font-black rounded-full">
                {compareCount}
              </span>
            )}
          </button>

          {/* ? QUESTIONS TAB */}
          <button
            type="button"
            onClick={() => handleTabClick('questions', onOpenQuestions)}
            className="px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-bold bg-white/80 hover:bg-white text-neutral-700 hover:text-black border border-neutral-300/80 shadow-xs transition-all cursor-pointer flex items-center gap-1 active:translate-y-0.5"
          >
            <span className="text-neutral-500">?</span>
            <span>QUESTIONS</span>
          </button>
        </nav>

        {/* Right Section: Divider, Volume Speaker & SFX Audio Switch */}
        <div className="flex items-center gap-2 pr-2">
          {/* Subtle Vertical Divider Line */}
          <div className="h-5 w-px bg-neutral-300 mx-1 hidden sm:block" />

          {/* Speaker Icon Button */}
          <button
            type="button"
            onClick={() => {
              if (soundFX) soundFX.playSoftChirp()
              onToggleSound()
            }}
            className="p-1.5 rounded-full text-neutral-600 hover:text-black transition-colors cursor-pointer"
            title={soundMuted ? 'Unmute SFX' : 'Mute SFX'}
          >
            {soundMuted ? (
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-neutral-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>

          {/* Tactile Hardware Capsule Switch with Green LED and Silver Rotary Knob */}
          <div
            onClick={onToggleSound}
            className="flex items-center gap-2 bg-[#121316] pl-2.5 pr-1 py-1 rounded-full border border-neutral-700 shadow-inner cursor-pointer hover:border-neutral-500 transition-colors select-none"
            title="Toggle Procedural Audio SFX"
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              soundMuted ? 'bg-neutral-600' : 'bg-[#22c55e] shadow-[0_0_6px_#22c55e]'
            }`} />
            <span className={`text-[10px] font-black tracking-wider ${soundMuted ? 'text-neutral-500' : 'text-emerald-400'}`}>
              SFX : {soundMuted ? 'OFF' : 'ON'}
            </span>
            {/* Metallic Silver Rotary Dial */}
            <div className="w-4 h-4 rounded-full bg-gradient-to-b from-[#ffffff] via-[#e2e0d8] to-[#9c978e] border border-neutral-400 shadow-sm flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-tr from-[#9c978e] to-[#ffffff] border border-neutral-500/40" />
            </div>
          </div>
        </div>

      </div>
    </header>
  )
}
