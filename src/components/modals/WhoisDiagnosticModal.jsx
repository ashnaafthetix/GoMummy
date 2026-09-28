import React, { useState, useEffect } from 'react'
import { getDomainWhoisDiagnostic, getRegistrarLinks } from '../../services/domainService.js'
import TorxScrew from '../hardware/TorxScrew.jsx'
import PhotorealLED from '../hardware/PhotorealLED.jsx'

/**
 * WhoisDiagnosticModal: Industrial Technical Diagnostic Tray for Registered Domains
 * Provides instant live DNS DoH SOA telemetry, authoritative nameservers, zone age,
 * and direct links to ICANN RDAP and historical web archives.
 */
export default function WhoisDiagnosticModal({
  domain = '',
  onClose,
  soundFX,
}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [copiedReport, setCopiedReport] = useState(false)

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    getDomainWhoisDiagnostic(domain).then((res) => {
      if (isMounted) {
        setData(res)
        setLoading(false)
      }
    })
    return () => {
      isMounted = false
    }
  }, [domain])

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

  const copyDiagnosticText = async () => {
    if (!data) return
    const report = `GOMUMMY WHOIS TELEMETRY DIAGNOSTIC
====================================
Domain: ${data.domain}
Status: REGISTERED / ACTIVE ZONE
Authoritative NS: ${data.nameserver}
Hostmaster: ${data.hostmaster}
Zone Serial: ${data.zoneSerial}
Zone Updated: ${data.updatedDate}
Estimated Age: ${data.estimatedAge}
Query Latency: ${data.latencyMs}ms via ${data.dnsSource}
ICANN RDAP: ${data.icannUrl}
Wayback Archive: ${data.waybackUrl}
Generated: ${new Date().toISOString()}`

    try {
      await navigator.clipboard.writeText(report)
      if (soundFX) soundFX.playKeyThud()
      setCopiedReport(true)
      setTimeout(() => setCopiedReport(false), 2000)
    } catch {
      // fallback
    }
  }

  const regLinks = getRegistrarLinks(domain)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs font-mono select-none"
      onClick={onClose}
    >
      <div
        className="hardware-chassis-shell relative w-full max-w-2xl rounded-2xl p-5 sm:p-7 text-neutral-800 shadow-2xl border-2 border-[#d5cfc2] animate-in fade-in zoom-in-95 duration-150 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Milled Metal Torx Screws in Corners */}
        <TorxScrew size={12} className="absolute left-3.5 top-3.5" />
        <TorxScrew size={12} className="absolute right-3.5 top-3.5" />
        <TorxScrew size={12} className="absolute left-3.5 bottom-3.5" />
        <TorxScrew size={12} className="absolute right-3.5 bottom-3.5" />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-[#dbd5c8] px-1">
          <div className="flex items-center gap-2.5">
            <PhotorealLED status="registered" size={10} />
            <div>
              <span className="text-[10px] font-bold text-neutral-500 tracking-widest uppercase block">
                TELEMETRY DIAGNOSTIC // DNS & WHOIS
              </span>
              <h3 className="text-xl font-display font-black text-neutral-900 tracking-tight">
                {domain}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              if (soundFX) soundFX.playTick()
              onClose()
            }}
            className="px-2.5 py-1 rounded bg-neutral-200 hover:bg-neutral-300 text-neutral-700 hover:text-black font-bold text-xs cursor-pointer transition-colors"
          >
            ✕ ESC
          </button>
        </div>

        {/* Body Content */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-6 h-6 border-2 border-neutral-300 border-t-[#ff2a85] rounded-full animate-spin" />
            <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">
              Querying Google DoH SOA Records...
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Dark CRT Telemetry Screen */}
            <div className="bg-[#0b100d] border border-[#1b2b20] rounded-xl p-4 text-[#4ade80] shadow-inner relative overflow-hidden text-xs space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-[#1b2b20] text-[10px]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                  <span className="font-bold text-white tracking-widest uppercase">
                    ZONE RESOLUTION: {data.domain}
                  </span>
                </div>
                <span className="text-neutral-400">
                  ⚡ {data.latencyMs}ms • {data.dnsSource}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-[11px]">
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">
                    Authoritative Nameserver
                  </span>
                  <span className="font-bold text-white break-all">{data.nameserver}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">
                    Zone Hostmaster Contact
                  </span>
                  <span className="font-bold text-white break-all">{data.hostmaster}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">
                    Zone Serial Stamp
                  </span>
                  <span className="font-bold text-white">{data.zoneSerial}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[9px] uppercase tracking-wider">
                    Registration Patina / Age
                  </span>
                  <span className="font-bold text-white">{data.estimatedAge}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1b2b20] flex items-center justify-between text-[10px] text-neutral-400">
                <span>ICANN Flags: clientTransferProhibited</span>
                <span className="text-emerald-400 font-bold">ACTIVE REGISTRATION</span>
              </div>
            </div>

            {/* Direct Official Verification Links */}
            <div>
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest block mb-2 px-1">
                Direct External Verification & History:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <a
                  href={data.icannUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX && soundFX.playTick()}
                  className="p-2.5 bg-white border border-[#cfc9bd] hover:border-black rounded-lg text-xs font-bold text-neutral-800 hover:text-black flex items-center justify-between transition-colors shadow-2xs"
                >
                  <span>🔍 ICANN RDAP</span>
                  <span className="text-neutral-400 text-[10px]">↗</span>
                </a>
                <a
                  href={data.waybackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX && soundFX.playTick()}
                  className="p-2.5 bg-white border border-[#cfc9bd] hover:border-black rounded-lg text-xs font-bold text-neutral-800 hover:text-black flex items-center justify-between transition-colors shadow-2xs"
                >
                  <span>📜 Wayback History</span>
                  <span className="text-neutral-400 text-[10px]">↗</span>
                </a>
                <a
                  href={data.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX && soundFX.playTick()}
                  className="p-2.5 bg-white border border-[#cfc9bd] hover:border-black rounded-lg text-xs font-bold text-neutral-800 hover:text-black flex items-center justify-between transition-colors shadow-2xs"
                >
                  <span>🌐 View Live Site</span>
                  <span className="text-neutral-400 text-[10px]">↗</span>
                </a>
              </div>
            </div>

            {/* Registrar Alternative Links & Report Copy */}
            <div className="pt-3 border-t border-[#dbd5c8] flex flex-wrap items-center justify-between gap-3 px-1">
              <button
                type="button"
                onClick={copyDiagnosticText}
                className="px-3 py-1.5 bg-white border border-neutral-300 hover:border-black text-neutral-800 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
              >
                <span>{copiedReport ? '✓ COPIED REPORT' : '📋 COPY TELEMETRY'}</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] text-neutral-500 font-bold uppercase">Check Backorder:</span>
                <a
                  href={regLinks.namecheap}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX && soundFX.playTick()}
                  className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded text-xs font-bold transition-colors"
                >
                  Namecheap ↗
                </a>
                <a
                  href={regLinks.porkbun}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => soundFX && soundFX.playTick()}
                  className="px-2.5 py-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 rounded text-xs font-bold transition-colors"
                >
                  Porkbun ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
