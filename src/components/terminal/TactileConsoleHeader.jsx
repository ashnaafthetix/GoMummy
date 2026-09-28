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
    <header className="w-full max-w-[1240px] mx-auto mb-6 px-2 sm:px-4">
      {/* Molded White/Cream Capsule Bar */}
      <div className="relative rounded-full bg-gradient-to-b from-[#ffffff] via-[#f7f5f0] to-[#ece8e1] border-[2px] border-[#d8d4cc] px-4 py-2 sm:py-2.5 shadow-[0_8px_20px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.9)_inset] flex flex-wrap items-center justify-between gap-3 font-mono">
        
        {/* Subtle Corner Screws on Header */}
        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[9px] text-neutral-400 select-none">✜</span>
        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-neutral-400 select-none">✜</span>

        {/* Brand Identity */}
        <div className="flex items-center gap-2 pl-3">
          <span className="font-mono font-black text-sm sm:text-base tracking-wider text-black">
            GOMUMMY
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff2a85] inline-block animate-pulse" />
        </div>

        {/* Center Capsule Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-0.5">
          {/* 01 BRIEF TAB */}
          <button
            type="button"
            onClick={() => handleTabClick('brief')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-black tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              currentView === 'brief'
                ? 'bg-gradient-to-r from-[#ff3b94] to-[#ff2079] text-white shadow-[0_3px_10px_rgba(255,32,121,0.45),0_1px_0_rgba(255,255,255,0.4)_inset] border border-[#d90f61] translate-y-[-1px]'
                : 'bg-white/80 hover:bg-white text-neutral-700 hover:text-black border border-neutral-300/80 shadow-xs'
            }`}
          >
            {currentView === 'brief' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
            <span>01 BRIEF</span>
          </button>

          {/* 02 RESULTS TAB */}
          <button
            type="button"
            onClick={() => handleTabClick('results')}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-black tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
              currentView === 'results'
                ? 'bg-gradient-to-r from-[#ff3b94] to-[#ff2079] text-white shadow-[0_3px_10px_rgba(255,32,121,0.45),0_1px_0_rgba(255,255,255,0.4)_inset] border border-[#d90f61] translate-y-[-1px]'
                : 'bg-white/80 hover:bg-white text-neutral-700 hover:text-black border border-neutral-300/80 shadow-xs'
            }`}
          >
            {currentView === 'results' && (
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            )}
            <span>02 RESULTS</span>
          </button>

          {/* ★ SHORTLIST TAB */}
          <button
            type="button"
            onClick={() => handleTabClick('shortlist', onOpenShortlist)}
            className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/80 hover:bg-white text-neutral-700 hover:text-black border border-neutral-300/80 shadow-xs transition-all cursor-pointer flex items-center gap-1.5 active:translate-y-0.5"
          >
            <span>★ SHORTLIST</span>
            {shortlistCount > 0 && (
              <span className="px-1.5 py-0.2 bg-[#ff2a85] text-white text-[10px] font-black rounded-full">
                {shortlistCount}
              </span>
            )}
          </button>

          {/* VS COMPARE TAB */}
          <button
            type="button"
            onClick={() => handleTabClick('compare', onOpenCompare)}
            className="px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/80 hover:bg-white text-neutral-700 hover:text-black border border-neutral-300/80 shadow-xs transition-all cursor-pointer flex items-center gap-1 active:translate-y-0.5"
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
            <span>? QUESTIONS</span>
          </button>
        </nav>

        {/* Right SFX Audio Switch & Speaker */}
        <div className="flex items-center gap-2 pr-3">
          <button
            type="button"
            onClick={() => {
              if (soundFX) soundFX.playSoftChirp()
              onToggleSound()
            }}
            className="p-1 rounded-full text-neutral-600 hover:text-black transition-colors cursor-pointer"
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

          {/* Tactile Hardware Capsule Switch for SFX */}
          <div
            onClick={onToggleSound}
            className="flex items-center gap-1.5 bg-[#141518] px-2.5 py-1 rounded-full border border-neutral-700 shadow-inner cursor-pointer hover:border-neutral-500 transition-colors select-none"
            title="Toggle Procedural Audio SFX"
          >
            <span className={`text-[10px] font-black tracking-wider ${soundMuted ? 'text-neutral-500' : 'text-emerald-400'}`}>
              SFX : {soundMuted ? 'OFF' : 'ON'}
            </span>
            <div className={`w-3.5 h-3.5 rounded-full transition-transform border border-neutral-600 ${
              soundMuted
                ? 'bg-neutral-600'
                : 'bg-gradient-to-b from-[#ffffff] to-[#c4c7cc] shadow-[0_0_6px_#22c55e]'
            }`} />
          </div>
        </div>

      </div>
    </header>
  )
}
