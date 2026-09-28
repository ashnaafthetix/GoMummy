import React, { useEffect, useState } from 'react'
import { getDomainPrice, analyzePhonetics } from '../../services/domainService.js'
import TorxScrew from '../hardware/TorxScrew.jsx'

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
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto font-mono"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="hardware-chassis-shell relative w-full max-w-[1020px] my-auto rounded-[28px] p-6 sm:p-8 shadow-2xl text-neutral-800"
      >
        {/* Photorealistic Milled Metal Torx Screws */}
        <TorxScrew size={12} className="absolute left-3.5 top-3.5" />
        <TorxScrew size={12} className="absolute right-3.5 top-3.5" />
        <TorxScrew size={12} className="absolute left-3.5 bottom-3.5" />
        <TorxScrew size={12} className="absolute right-3.5 bottom-3.5" />

        {/* Modal Header */}
        <div className="flex flex-wrap items-center justify-between pb-3 mb-6 border-b border-[#dbd6cc] gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-400 text-black text-xs font-black rounded">
              ⭐ PORTFOLIO LEDGER
            </span>
            <span className="font-display font-black text-lg text-neutral-900 tracking-tight">
              SAVED DOMAINS &amp; VALUATION
            </span>
            <span className="px-2 py-0.5 bg-black text-white text-[10px] font-bold rounded">
              {shortlist.length} ASSETS
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="tactile-chiclet p-1.5 px-3 rounded-lg text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            ✕ CLOSE
          </button>
        </div>

        {shortlist.length === 0 ? (
          <div className="py-12 text-center text-neutral-500">
            <div className="text-3xl mb-2">⭐</div>
            <p className="font-bold text-sm">YOUR SHORTLIST IS CURRENTLY EMPTY</p>
            <p className="text-xs text-neutral-400 mt-1">
              Click the ★ icon on any domain card to add it to your portfolio ledger.
            </p>
          </div>
        ) : (
          <div>
            {/* Top Metric Overview Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-[#ece8e0] border border-[#d8d3c8] rounded-xl p-3.5">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                  1st-Year Acquisition
                </span>
                <div className="text-2xl font-black text-neutral-900 mt-1">
                  ${totalYr1.toFixed(2)}
                </div>
                <span className="text-[10px] text-neutral-500">Initial registration total</span>
              </div>

              <div className="bg-[#ece8e0] border border-[#d8d3c8] rounded-xl p-3.5">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                  Annual Renewal Cost
                </span>
                <div className="text-2xl font-black text-neutral-900 mt-1">
                  ${totalRenew.toFixed(2)}<span className="text-xs text-neutral-400">/yr</span>
                </div>
                <span className="text-[10px] text-neutral-500">Subsequent yearly maintenance</span>
              </div>

              <div className="bg-[#ece8e0] border border-[#d8d3c8] rounded-xl p-3.5">
                <span className="text-[10px] font-mono font-bold text-neutral-500 uppercase">
                  3-Year Projected Holding TCO
                </span>
                <div className="text-2xl font-black text-neutral-900 mt-1">
                  ${(totalYr1 + totalRenew * 2).toFixed(2)}
                </div>
                <span className="text-[10px] text-neutral-500">Full 36-month holding cost</span>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={copyAll}
                  className="tactile-chiclet px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-800 cursor-pointer"
                >
                  {copiedAll ? '✓ COPIED ALL' : '📋 COPY ALL'}
                </button>
                <button
                  type="button"
                  onClick={exportCsv}
                  className="tactile-chiclet px-3.5 py-1.5 rounded-lg text-xs font-bold text-neutral-800 cursor-pointer"
                >
                  📥 EXPORT CSV
                </button>
              </div>

              <button
                type="button"
                onClick={() => alert(`Bulk checkout cart prepared for ${shortlist.length} domains ($${totalYr1.toFixed(2)})...`)}
                className="tactile-pink-btn px-5 py-2 rounded-xl text-white text-xs font-black cursor-pointer shadow-sm"
              >
                BULK REGISTER ALL (${totalYr1.toFixed(2)}) ➔
              </button>
            </div>

            {/* Table of Saved Domains */}
            <div className="bg-white rounded-2xl border border-neutral-300 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead className="bg-[#ece8e0] border-b border-[#d8d3c8] text-neutral-500 text-[10px] uppercase">
                    <tr>
                      <th className="py-3 px-4">Domain</th>
                      <th className="py-3 px-4">Syllables &amp; Tone</th>
                      <th className="py-3 px-4">Registrar</th>
                      <th className="py-3 px-4">1st Year</th>
                      <th className="py-3 px-4">Renewal</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {shortlist.map((item) => {
                      const fullDomain = `${item.domain}${item.tld || '.com'}`
                      const p = getDomainPrice(item.tld || '.com')
                      const ph = analyzePhonetics(item.name || item.domain)

                      return (
                        <tr key={item.domain} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="py-3 px-4 font-bold text-neutral-900">
                            <div>{item.name || item.domain}</div>
                            <div className="text-[11px] text-neutral-400">{fullDomain}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 bg-neutral-100 rounded text-[10px] font-bold text-neutral-700 mr-1.5">
                              {ph.syllables} syl
                            </span>
                            <span className="px-2 py-0.5 bg-amber-50 text-amber-800 rounded text-[10px] font-bold border border-amber-200">
                              {ph.tone}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-neutral-600">
                            {p.registrar}
                          </td>
                          <td className="py-3 px-4 font-black text-neutral-900">
                            ${p.reg}
                          </td>
                          <td className="py-3 px-4 text-neutral-500">
                            ${p.renew}/yr
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                type="button"
                                onClick={() => copySingle(fullDomain)}
                                className="p-1.5 bg-neutral-100 hover:bg-neutral-200 rounded text-xs cursor-pointer"
                                title="Copy"
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
                                title="Remove"
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
  )
}
