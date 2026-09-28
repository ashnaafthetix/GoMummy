import React from 'react'
import { checkSocialHandles } from '../../services/domainService.js'
import PhotorealLED from './PhotorealLED.jsx'

/**
 * Photorealistic Social Handle Beacon Strip.
 * Shows status across X, Instagram, GitHub, and TikTok using micro LEDs.
 */
export default function SocialBeaconStrip({ handle = '', className = '' }) {
  const status = checkSocialHandles(handle)

  const items = [
    { key: 'x', label: 'X', stat: status.x },
    { key: 'ig', label: 'IG', stat: status.ig },
    { key: 'gh', label: 'GH', stat: status.gh },
    { key: 'tik', label: 'TIK', stat: status.tik },
  ]

  const freeCount = items.filter((i) => i.stat === 'available').length

  return (
    <div
      title={`Social Handles for @${handle}: ${freeCount}/4 Free (X: ${status.x}, IG: ${status.ig}, GH: ${status.gh}, TIK: ${status.tik})`}
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#ece8df] border border-[#d6d0c4] text-[9px] font-mono select-none ${className}`}
    >
      <span className="text-neutral-500 font-bold uppercase tracking-tight">@:</span>
      <div className="flex items-center gap-1.5">
        {items.map((it) => (
          <div key={it.key} className="flex items-center gap-0.5" title={`${it.label}: ${it.stat}`}>
            <span className="text-[8px] font-extrabold text-neutral-600">{it.label}</span>
            <PhotorealLED
              status={it.stat === 'available' ? 'available' : 'registered'}
              size={6}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
