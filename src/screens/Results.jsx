import React, { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import SubjectCheckBanner from '../components/SubjectCheckBanner.jsx'
import TorxScrew from '../components/hardware/TorxScrew.jsx'
import TapeDeckScrubber from '../components/hardware/TapeDeckScrubber.jsx'
import { getDomainPrice, analyzePhonetics } from '../services/domainService.js'

export default function Results({
  brief,
  targetCard,
  results = [],
  filters,
  onFiltersChange,
  shortlist = [],
  compareSel = [],
  pendingQuestion,
  onRegenerate,
  onToggleShortlist,
  onToggleCompare,
  onAnswerFollowUp,
  onSkipFollowUp,
  onNavigateToBrief,
  soundFX,
  xp = 0,
  hunterRank,
  lockedSlots = new Set(),
  onToggleLock,
  levelUpToast,
  onDismissToast,
  apiNotice,
  onDismissNotice,
  historyIndex = 0,
  totalBatches = 1,
  onRewindBatch,
  onForwardBatch,
  onOpenViewfinder,
}) {
  const [copiedDomain, setCopiedDomain] = useState(null)
  const [activeTldFilter, setActiveTldFilter] = useState('all')
  const [activeToneFilter, setActiveToneFilter] = useState('all')

  const copy = async (fullDomain) => {
    try {
      await navigator.clipboard.writeText(fullDomain)
    } catch {
      // fallback
    }
    setCopiedDomain(fullDomain)
    if (soundFX) soundFX.playTick()
    setTimeout(() => setCopiedDomain(null), 1500)
  }

  // Filter candidates
  const filteredResults = results.filter((r) => {
    if (activeTldFilter !== 'all' && r.tld !== activeTldFilter) return false
    if (activeToneFilter !== 'all') {
      const phonetics = analyzePhonetics(r.domain)
      if (phonetics.tone.toLowerCase() !== activeToneFilter.toLowerCase()) return false
    }
    return true
  })

  return (
    <div className="w-full max-w-[1240px] mx-auto px-2 sm:px-4 pb-12 font-mono select-none">
      
      {/* 1. TOP HEADER BANNER (👾 GOMUMMY // SYSTEM V1.0) */}
      <div className="flex flex-wrap items-center justify-between text-xs tracking-wider text-neutral-500 mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-[#ff2a85] text-sm">👾</span>
          <span className="font-bold text-neutral-800">GOMUMMY // SYSTEM V1.0 -</span>
        </div>
        <div className="font-semibold tracking-widest text-[11px] text-neutral-500">
          ----- JOB 02 // CANDIDATE INSTRUMENTATION FEED
        </div>
      </div>

      {/* 2. RETRO-FUTURISTIC MAIN TITLE */}
      <div className="text-center my-4 sm:my-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 font-display uppercase leading-tight">
          DOMAIN SEARCH IS OUR ART
        </h1>
        <p className="text-xs sm:text-sm font-bold tracking-widest text-neutral-500 uppercase mt-1">
          AVAILABLE ALTERNATIVES VERIFIED VIA GOOGLE DOH
        </p>
      </div>

      {/* API Notice / Quota Toast */}
      {apiNotice && (
        <div className="mb-4 bg-amber-50 border border-amber-300 rounded-xl p-3 text-amber-900 text-xs font-mono flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{apiNotice.message}</span>
          </div>
          {onDismissNotice && (
            <button
              type="button"
              onClick={onDismissNotice}
              className="text-amber-800 font-bold hover:text-black cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {/* 3. MOLDED CREAM WORKSTATION FEED CHASSIS */}
      <div className="hardware-chassis-shell relative rounded-[28px] sm:rounded-[36px] p-4 sm:p-7 overflow-hidden text-neutral-800 mb-6">
        
        {/* Photorealistic Milled Metal Torx Screws */}
        <TorxScrew size={14} className="absolute left-4 top-4" />
        <TorxScrew size={14} className="absolute right-4 top-4" />
        <TorxScrew size={14} className="absolute left-4 bottom-4" />
        <TorxScrew size={14} className="absolute right-4 bottom-4" />

        {/* Action Bar: Back to Brief, Filter Chips, and Transport Cluster */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#dbd6cc]">
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onNavigateToBrief}
              className="tactile-chiclet px-3.5 py-1.5 rounded-xl text-neutral-800 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>←</span>
              <span>BACK TO BRIEF</span>
            </button>

            <div className="h-4 w-px bg-neutral-300 hidden sm:block mx-1" />

            {/* Filter Chips */}
            <span className="text-[10px] font-bold text-neutral-400 uppercase mr-0.5">Filter:</span>
            {['all', '.com', '.io', '.ai', '.co'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => {
                  if (soundFX) soundFX.playTick()
                  setActiveTldFilter(t)
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeTldFilter === t
                    ? 'bg-neutral-900 text-white shadow-2xs'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:border-black'
                }`}
              >
                {t === 'all' ? 'All TLDs' : t}
              </button>
            ))}

            {['all', 'punchy', 'smooth'].map((tone) => (
              <button
                key={tone}
                type="button"
                onClick={() => {
                  if (soundFX) soundFX.playTick()
                  setActiveToneFilter(tone)
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activeToneFilter === tone
                    ? 'bg-[#ff2a85] text-white shadow-2xs'
                    : 'bg-white border border-neutral-300 text-neutral-700 hover:border-[#ff2a85]'
                }`}
              >
                {tone === 'all' ? 'All Tones' : tone === 'punchy' ? '⚡ Punchy' : '☁️ Smooth'}
              </button>
            ))}
          </div>

          {/* Transport Cluster: Tape Deck Scrubber + Master Regenerate */}
          <div className="flex items-center gap-2 sm:gap-2.5 self-start lg:self-auto shrink-0 w-full sm:w-auto justify-between sm:justify-start flex-wrap sm:flex-nowrap">
            <TapeDeckScrubber
              historyIndex={historyIndex}
              totalBatches={totalBatches}
              onRewind={onRewindBatch}
              onForward={onForwardBatch}
              soundFX={soundFX}
            />

            <button
              type="button"
              onClick={() => {
                if (soundFX) {
                  soundFX.playKeyThud()
                  soundFX.playSpin()
                }
                onRegenerate()
              }}
              className="tactile-pink-btn px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-white font-mono text-[11px] sm:text-xs font-black tracking-wider transition-all cursor-pointer flex items-center gap-1.5 sm:gap-2 shadow-sm shrink-0"
              title="Generate 5 new candidate names (Shortcut: R)"
            >
              <span>↻ REGENERATE</span>
              <span className="bg-black/60 px-1.5 py-0.5 rounded text-[10px] border border-white/20">
                R
              </span>
            </button>
          </div>

        </div>

        {/* JOB 01: Subject Check Hero Banner */}
        <SubjectCheckBanner
          brief={brief}
          targetCard={targetCard}
          copiedDomain={copiedDomain}
          onCopy={copy}
          onToggleShortlist={onToggleShortlist}
          isShortlisted={shortlist.some((s) => s.domain === targetCard?.domain)}
          onToggleCompare={onToggleCompare}
          isCompared={compareSel.some((c) => c.domain === targetCard?.domain)}
          soundFX={soundFX}
          onOpenViewfinder={onOpenViewfinder}
        />

        {/* JOB 02: Modular Industrial Instrument Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResults.map((candidate, idx) => {
            const isShortlisted = shortlist.some((s) => s.domain === candidate.domain)
            const isCompared = compareSel.some((c) => c.domain === candidate.domain)
            const isLocked = lockedSlots.has(idx)

            return (
              <ResultCard
                key={`${candidate.domain}-${idx}`}
                slotNumber={idx + 1}
                name={candidate.name || candidate.domain}
                domain={candidate.domain}
                tld={candidate.tld || '.com'}
                state={candidate.state}
                availability={candidate.state}
                category={candidate.category}
                rationale={candidate.rationale}
                isShortlisted={isShortlisted}
                onToggleShortlist={() => onToggleShortlist(candidate)}
                isCompared={isCompared}
                onToggleCompare={() => onToggleCompare(candidate)}
                isLocked={isLocked}
                onToggleLock={() => onToggleLock(idx)}
                copiedDomain={copiedDomain}
                onCopy={copy}
                soundFX={soundFX}
                onOpenViewfinder={onOpenViewfinder}
              />
            )
          })}
        </div>

      </div>

      {/* 4. BOTTOM AUXILIARY BAR */}
      <div className="flex flex-wrap items-center justify-between text-xs text-neutral-500 mt-4 px-2">
        <button
          type="button"
          onClick={onNavigateToBrief}
          className="tactile-chiclet px-3.5 py-2 rounded-xl text-neutral-700 font-bold hover:text-black transition-all cursor-pointer flex items-center gap-2"
        >
          <span>←</span>
          <span>Edit Brand Brief &amp; Parameters</span>
        </button>

        <div className="font-bold tracking-widest text-[11px] text-neutral-400 uppercase mt-2 sm:mt-0">
          SHAPES IDEAS INTO OWNABLE NAMES.
        </div>
      </div>

    </div>
  )
}
