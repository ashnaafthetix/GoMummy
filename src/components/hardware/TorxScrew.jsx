import React from 'react'

/**
 * Photorealistic milled metal Torx screw head.
 * Features a countersunk socket, directional metallic gradient,
 * crisp 6-point Torx recess, and specular lighting highlight.
 */
export default function TorxScrew({ size = 12, className = '' }) {
  const half = size / 2
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none pointer-events-none drop-shadow-[0_1px_1px_rgba(0,0,0,0.3)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        {/* Outer Counterbore Shadow */}
        <radialGradient id="screwSocket" cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#1e1d1a" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0a0a09" stopOpacity="0.8" />
        </radialGradient>

        {/* Brushed Metal Screw Head */}
        <linearGradient id="screwMetal" x1="20%" y1="15%" x2="80%" y2="85%">
          <stop offset="0%" stopColor="#f4f3f0" />
          <stop offset="35%" stopColor="#d5d1c8" />
          <stop offset="60%" stopColor="#b4afa4" />
          <stop offset="85%" stopColor="#e2ded6" />
          <stop offset="100%" stopColor="#8a857b" />
        </linearGradient>

        {/* Recessed Slot Depth */}
        <linearGradient id="recessShadow" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1a1917" />
          <stop offset="100%" stopColor="#3d3a35" />
        </linearGradient>
      </defs>

      {/* Countersink well */}
      <circle cx="12" cy="12" r="11.5" fill="url(#screwSocket)" />
      
      {/* Screw Head disc */}
      <circle cx="12" cy="12" r="9.5" fill="url(#screwMetal)" stroke="#8e897f" strokeWidth="0.5" />
      
      {/* Specular Edge Ring Highlight */}
      <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="0.5" />

      {/* 6-Lobe Torx Star Recess */}
      <path
        d="M12 7.2 L13.3 9.8 L16.2 9.8 L14.5 12 L16.2 14.2 L13.3 14.2 L12 16.8 L10.7 14.2 L7.8 14.2 L9.5 12 L7.8 9.8 L10.7 9.8 Z"
        fill="url(#recessShadow)"
      />

      {/* Center Pin & Reflection */}
      <circle cx="12" cy="12" r="1.6" fill="#1c1b18" />
      <circle cx="12.4" cy="11.6" r="0.6" fill="rgba(255,255,255,0.75)" />
    </svg>
  )
}
