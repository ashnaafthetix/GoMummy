import React, { useEffect, useState } from 'react'
import { getDomainPrice, analyzePhonetics } from '../../services/domainService.js'
import TorxScrew from '../hardware/TorxScrew.jsx'
import PhotorealLED from '../hardware/PhotorealLED.jsx'

/**
 * Docked Hardware Shortlist Tray.
 * Replaces floating modals with a physical slide-out mechanical drawer docked to the viewport bottom.
 */
export default function ShortlistModal({
  shortlist = [],
  onRemove,
  onClose,
  soundFX,
}) {
  const [copiedAll, setCopiedAll] = useState(false)
  const [copiedDomain, setCopiedDomain] = useState(null)

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

  const copyAll = async () => {
    const text = shortlist.map((s) => `${s.domain}${s.tld || '.com'}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // fallback
    }
    if (soundFX) soundFX.playKeyThud()
    setCopiedAll(true)
    setTimeout(() => setCopiedAll(false), 2000)
  }

  const exportCsv = () => {
    if (soundFX) soundFX.playKeyThud()
    const rows = [
      ['Name', 'Domain', 'TLD', 'Year 1 Reg ($)', 'Renewal/yr ($)', 'Syllables', 'Tone'],
      ...shortlist.map((s) => {
        const p = getDomainPrice(s.tld || '.com')
        const ph = analyzePhonetics(s.name || s.domain)
        return [
          s.name || s.domain,
          `${s.domain}${s.tld || '.com'}`,
          s.tld || '.com',
          p.reg,
          p.renew,
          ph.syllables,
          ph.tone,
        ]
      }),
    ]
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'gomummy_saved_domains.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const totalYr1 = shortlist.reduce((sum, item) => {
    const p = getDomainPrice(item.tld || '.com')
    return sum + p.reg
  }, 0)

  const totalRenew = shortlist.reduce((sum, item) => {
    const p = getDomainPrice(item.tld || '.com')
    return sum + p.renew
  }, 0)

  return (
    <>
      {/* 1. Ambient Dark Backdrop (Click to Disengage Tray) */}
      <div
        onClick={() => {
          if (soundFX) soundFX.playTick()
          onClose()
        }}
        className="fixed inset-0 z-40 bg-black/45 backdrop-blur-[2px] transition-opacity cursor-pointer animate-[fadeIn_0.2s_ease-out]"
      />

      {/* 2. Docked Hardware Drawer Anchored to Bottom Viewport */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col items-center justify-end pointer-events-none font-mono">
        <div
          onClick={(e) => e.stopPropagation()}
          className="pointer-events-auto w-full max-w-[1240px] px-2 sm:px-6 hardware-tray-slide-up"
        >
          <div className="hardware-tray-chassis relative rounded-t-[32px] sm:rounded-t-[40px] p-5 sm:p-7 max-h-[86vh] flex flex-col shadow-2xl text-neutral-800">
            
            {/* Precision Milled Metal Torx Screws */}
            <TorxScrew size={14} className="absolute left-4 top-4" />
            <TorxScrew size={14} className="absolute right-4 top-4" />

            {/* Tactile Aluminum Pull Handle / Latch Bar */}
            <div className="flex justify-center mb-3">
              <div
                onClick={() => {
                  if (soundFX) soundFX.playTick()
                  onClose()
                }}
                className="tray-handle-latch px-8 py-1.5 rounded-full flex items-center gap-3 cursor-pointer shadow-inner hover:brightness-105 active:translate-y-0.5 transition-all"
                title="Click handle to collapse / disengage tray"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                <span className="text-[10px] font-bold tracking-widest text-neutral-600 uppercase">
                  ≡ DOCKED TRAY LATCH // DRAG OR CLICK TO CLOSE
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
              </div>
            </div>

            {/* Tray Header Bar */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-[#dbd6cc] gap-3">
              <div className="flex items-center gap-2.5">
                <PhotorealLED status="green" size={9} />
                <span className="px-2.5 py-0.5 bg-amber-400 text-black text-xs font-black rounded shadow-2xs">
                  ⭐ PORTFOLIO LEDGER
                </span>
                <span className="font-display font-black text-base sm:text-lg text-neutral-900 tracking-tight">
                  SAVED DOMAIN VALUATION &amp; ACQUISITION
                </span>
                <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded">
                  {shortlist.length} ASSETS
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (soundFX) soundFX.playTick()
                    onClose()
                  }}
                  className="tactile-chiclet px-3 py-1.5 rounded-lg text-xs font-bold text-neutral-700 hover:text-black transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                >
                  <span>✕</span>
                  <span>DISENGAGE TRAY</span>
                </button>
              </div>
            </div>

            {/* Tray Content Body */}
            {shortlist.length === 0 ? (
              <div className="py-14 text-center text-neutral-500">
                <div className="text-4xl mb-3">⭐</div>
                <p className="font-bold text-sm text-neutral-800">YOUR DOCKED SHORTLIST IS CURRENTLY EMPTY</p>
                <p className="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                  Click the ★ icon on any candidate domain card in the workstation to dock it directly into your portfolio ledger.
                </p>
              </div>
            ) : (
              <div className="overflow-y-auto pr-1 flex-1 space-y-4">
                {/* 3-Column Valuation Metric Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="hardware-inset-panel rounded-xl p-3.5 border border-[#d8d3c8]">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                      1st-Year Acquisition
                    </span>
                    <div className="text-2xl font-black text-neutral-900 mt-1">
                      ${totalYr1.toFixed(2)}
                    </div>
                    <span className="text-[10px] text-neutral-500">Initial registration capital</span>
                  </div>

                  <div className="hardware-inset-panel rounded-xl p-3.5 border border-[#d8d3c8]">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                      Annual Renewal Cost
                    </span>
                    <div className="text-2xl font-black text-neutral-900 mt-1">
                      ${totalRenew.toFixed(2)}<span className="text-xs text-neutral-400 font-normal">/yr</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">Subsequent yearly maintenance</span>
                  </div>

                  <div className="hardware-inset-panel rounded-xl p-3.5 border border-[#d8d3c8]">
                    <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                      3-Year Projected Holding TCO
                    </span>
                    <div className="text-2xl font-black text-neutral-900 mt-1">
                      ${(totalYr1 + totalRenew * 2).toFixed(2)}
                    </div>
                    <span className="text-[10px] text-neutral-500">Full 36-month holding cost</span>
                  </div>
                </div>

                {/* Bulk Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={copyAll}
                      className="tactile-chiclet px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-800 cursor-pointer shadow-2xs"
                    >
                      {copiedAll ? '✓ COPIED ALL' : '📋 COPY ALL'}
                    </button>
                    <button
                      type="button"
                      onClick={exportCsv}
                      className="tactile-chiclet px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-800 cursor-pointer shadow-2xs"
                    >
                      📥 EXPORT CSV
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (soundFX) soundFX.playKeyThud()
                      alert(`Bulk checkout cart prepared for ${shortlist.length} domains ($${totalYr1.toFixed(2)})...`)
                    }}
                    className="tactile-pink-btn px-5 py-2 rounded-xl text-white text-xs font-black cursor-pointer shadow-sm"
                  >
                    BULK REGISTER ALL (${totalYr1.toFixed(2)}) ➔
                  </button>
                </div>

                {/* Table of Saved Domains */}
                <div className="bg-white rounded-2xl border border-neutral-300 overflow-hidden shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="bg-[#ece8e0] border-b border-[#d8d3c8] text-neutral-500 text-[10px] uppercase">
                        <tr>
                          <th className="py-2.5 px-4">Domain</th>
                          <th className="py-2.5 px-4">Phonetics</th>
                          <th className="py-2.5 px-4">Registrar</th>
                          <th className="py-2.5 px-4">Year 1</th>
                          <th className="py-2.5 px-4">Renewal</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {shortlist.map((item) => {
                          const fullDomain = `${item.domain}${item.tld || '.com'}`
                          const p = getDomainPrice(item.tld || '.com')
                          const ph = analyzePhonetics(item.name || item.domain)

                          return (
                            <tr key={item.domain} className="hover:bg-neutral-50/70 transition-colors">
                              <td className="py-2.5 px-4 font-bold text-neutral-900">
                                <div>{item.name || item.domain}</div>
                                <div className="text-[11px] text-neutral-400">{fullDomain}</div>
                              </td>
                              <td className="py-2.5 px-4">
                                <span className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-bold text-neutral-700 mr-1.5">
                                  {ph.syllables} syl
                                </span>
                                <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-bold border border-amber-200">
                                  {ph.tone}
                                </span>
                              </td>
                              <td className="py-2.5 px-4 text-neutral-600">
                                {p.registrar}
                              </td>
                              <td className="py-2.5 px-4 font-black text-neutral-900">
                                ${p.reg}
                              </td>
                              <td className="py-2.5 px-4 text-neutral-500">
                                ${p.renew}/yr
                              </td>
                              <td className="py-2.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => copySingle(fullDomain)}
                                    className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded text-xs cursor-pointer"
                                    title="Copy domain"
                                  >
                                    {copiedDomain === fullDomain ? '✓' : '📋'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => alert(`Redirecting to registrar for ${fullDomain}...`)}
                                    className="px-2.5 py-1 bg-black hover:bg-neutral-800 text-white rounded text-[11px] font-bold cursor-pointer"
                                  >
                                    Buy ${p.reg}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onRemove(item)}
                                    className="p-1.5 text-neutral-400 hover:text-red-600 rounded text-xs cursor-pointer"
                                    title="Remove from shortlist"
                                  >
                                    ✕
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
