import { useState } from 'react'
import {
  exportDossierMarkdown,
  exportDossierHtml,
  copyDossierMarkdown,
} from '../services/dossierService.js'
import { getDomainPrice, analyzePhonetics, getPrimaryRegistrarUrl } from '../services/domainService.js'
import TorxScrew from '../components/hardware/TorxScrew.jsx'
import PhotorealLED from '../components/hardware/PhotorealLED.jsx'

export default function Shortlist({ shortlist = [], onRemove, onNavigate, soundFX }) {
  const [copied, setCopied] = useState(false)
  const [copiedDossier, setCopiedDossier] = useState(false)
  const [copiedDomain, setCopiedDomain] = useState(null)

  const copyList = async () => {
    const text = shortlist.map((s) => `${s.domain}${s.tld || '.com'}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // clipboard permission denied
    }
    if (soundFX) soundFX.playKeyThud()
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleCopyDossier = async () => {
    if (soundFX) soundFX.playKeyThud()
    const ok = await copyDossierMarkdown(shortlist, 'GoMummy Brand Expedition')
    if (ok) {
      setCopiedDossier(true)
      setTimeout(() => setCopiedDossier(false), 2000)
    }
  }

  const copySingle = async (domain) => {
    try {
      await navigator.clipboard.writeText(domain)
    } catch {
      // fallback
    }
    if (soundFX) soundFX.playTick()
    setCopiedDomain(domain)
    setTimeout(() => setCopiedDomain(null), 1500)
  }

  return (
    <main className="w-full">
      <div className="relative rounded-[28px] bg-gradient-to-b from-[#fbf9f5] via-[#f4efe6] to-[#ebe5da] border-[2px] border-[#d8d3c8] p-4 sm:p-7 md:p-8 shadow-[0_16px_40px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.9)_inset] font-mono">
        {/* Photorealistic Milled Metal Torx Screws */}
        <TorxScrew size={14} className="absolute left-4 top-4" />
        <TorxScrew size={14} className="absolute right-4 top-4" />
        <TorxScrew size={14} className="absolute left-4 bottom-4" />
        <TorxScrew size={14} className="absolute right-4 bottom-4" />

        {/* Action Bar: Navigation & Export Cluster */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#dbd6cc]">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                if (onNavigate) onNavigate('results')
              }}
              className="tactile-chiclet px-3.5 py-1.5 rounded-xl text-neutral-800 font-mono text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            >
              <span>←</span>
              <span>BACK TO RESULTS</span>
            </button>

            <div className="h-4 w-px bg-neutral-300 hidden sm:block mx-1" />

            <div className="flex items-center gap-2">
              <PhotorealLED status="pink" size={9} />
              <h1 className="font-display text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
                SHORTLIST PORTFOLIO
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-black text-white text-[10px] font-black tracking-wider">
                {shortlist.length} SAVED
              </span>
            </div>
          </div>

          {/* Export & Sharing Cluster */}
          {shortlist.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDossier}
                className="tactile-chiclet px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold text-neutral-800 hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
                title="Copy structured executive markdown dossier to clipboard"
              >
                <span>{copiedDossier ? '✓' : '📋'}</span>
                <span>{copiedDossier ? 'COPIED DOSSIER' : 'COPY DOSSIER'}</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (soundFX) soundFX.playKeyThud()
                  exportDossierMarkdown(shortlist, 'GoMummy Brand Expedition')
                }}
                className="tactile-chiclet px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold text-neutral-800 hover:text-black transition-all cursor-pointer flex items-center gap-1.5"
                title="Download Pitch Dossier Markdown file"
              >
                <span>📄</span>
                <span>DOSSIER (.MD)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  if (soundFX) soundFX.playKeyThud()
                  exportDossierHtml(shortlist, 'GoMummy Brand Expedition')
                }}
                className="tactile-pink-btn px-3 py-1.5 rounded-lg font-mono text-[11px] font-black text-white transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                title="Download standalone HTML presentation ready to print or save as PDF"
              >
                <span>🖨️</span>
                <span>PRESENTATION (.HTML)</span>
              </button>
              <button
                type="button"
                onClick={copyList}
                className="tactile-chiclet px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold text-neutral-600 hover:text-neutral-900 transition-all cursor-pointer"
                title="Copy plain list of domains"
              >
                {copied ? '✓ COPIED' : 'LIST ONLY'}
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        {shortlist.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#dbd6cc] bg-[#f2ede4]/70 p-8 sm:p-14 text-center flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-500 text-xl font-bold shadow-inner">
              ★
            </div>
            <h2 className="font-display text-lg font-bold text-neutral-900">
              No candidate names shortlisted yet
            </h2>
            <p className="font-mono text-xs text-neutral-500 max-w-[440px] leading-relaxed">
              Click the <span className="font-bold text-amber-600">★</span> star button on any candidate card in the results console to pin your favorites to this persistent portfolio ledger.
            </p>
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                if (onNavigate) onNavigate('results')
              }}
              className="mt-3 tactile-pink-btn px-5 py-2 rounded-xl text-white font-mono text-xs font-black tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm"
            >
              <span>EXPLORE CANDIDATES</span>
              <span>→</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shortlist.map((item, idx) => {
              const fullDomain = `${item.domain}${item.tld || '.com'}`
              const pricing = getDomainPrice(item.tld || '.com')
              const phonetics = analyzePhonetics(item.name || item.domain)
              const isAvail = item.state === 'available'
              const isChecking = item.state === 'checking'

              return (
                <div
                  key={`${item.domain}-${idx}`}
                  className="rounded-2xl border-[1.5px] border-[#d8d3c8] bg-gradient-to-b from-[#ffffff] via-[#faf8f4] to-[#f3efe6] p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.06),0_1px_0_rgba(255,255,255,0.9)_inset] flex flex-col justify-between gap-3 font-mono transition-all hover:border-neutral-400"
                >
                  <div className="flex items-start justify-between gap-2 border-b border-[#ece8de] pb-3">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        ENTRY #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="font-display text-xl sm:text-2xl font-black text-neutral-900 tracking-tight leading-tight">
                        {item.name || item.domain}
                      </h3>
                      <span className="text-xs font-mono font-bold text-neutral-600 mt-0.5">
                        {fullDomain}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Availability Pill */}
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 ${
                          isAvail
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : isChecking
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-neutral-100 text-neutral-600 border border-neutral-300'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isAvail ? 'bg-emerald-500' : isChecking ? 'bg-amber-500 animate-pulse' : 'bg-neutral-400'
                          }`}
                        />
                        {isAvail ? 'AVAILABLE' : isChecking ? 'CHECKING' : 'TAKEN'}
                      </span>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => {
                          if (soundFX) soundFX.playKeyThud()
                          onRemove(item)
                        }}
                        className="w-7 h-7 rounded-lg border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-500 hover:text-red-600 text-xs font-bold flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove from shortlist"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Metadata: Phonetics & Pricing */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-neutral-600 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700 font-bold">
                        {phonetics.syllables} {phonetics.syllables === 1 ? 'syl' : 'syls'}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-neutral-100 border border-neutral-200 text-neutral-700 font-bold">
                        {phonetics.tone}
                      </span>
                      {item.category && (
                        <span className="text-[10px] text-neutral-400 font-bold uppercase">
                          {item.category}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                      <span>{pricing.reg}/yr</span>
                    </div>
                  </div>

                  {/* Action Row */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-dashed border-[#ece8de]">
                    <button
                      type="button"
                      onClick={() => copySingle(fullDomain)}
                      className="tactile-chiclet px-2.5 py-1 rounded text-[10px] font-bold text-neutral-700 cursor-pointer"
                    >
                      {copiedDomain === fullDomain ? '✓ COPIED' : 'COPY DOMAIN'}
                    </button>

                    <a
                      href={getPrimaryRegistrarUrl(fullDomain)}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => {
                        if (soundFX) soundFX.playAvailable()
                      }}
                      className="tactile-chiclet px-3 py-1 rounded text-[10px] font-black text-neutral-900 hover:text-black flex items-center gap-1 cursor-pointer"
                    >
                      <span>REGISTER</span>
                      <span>↗</span>
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

