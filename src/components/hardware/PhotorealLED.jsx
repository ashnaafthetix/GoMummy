import React from 'react'

/**
 * Photorealistic physical countersunk LED indicator diode.
 * Includes dark bezel bezel ring, inner glass lens dome, specular reflection,
 * and realistic emissive light bloom.
 */
export default function PhotorealLED({
  status = 'available', // 'available' (emerald), 'checking' (amber), 'registered' / 'taken' (red/muted), 'pink' (accent)
  size = 10,
  className = '',
}) {
  const isAvail = status === 'available'
  const isChecking = status === 'checking'
  const isPink = status === 'pink'
  const isOff = status === 'registered' || status === 'taken'

  // Colors
  const coreColor = isAvail
    ? '#10b981'
    : isChecking
    ? '#f59e0b'
    : isPink
    ? '#ff2a85'
    : '#71717a'

  const glowColor = isAvail
    ? 'rgba(16, 185, 129, 0.65)'
    : isChecking
    ? 'rgba(245, 158, 11, 0.65)'
    : isPink
    ? 'rgba(255, 42, 133, 0.65)'
    : 'transparent'

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Outer Countersunk Bezel (Dark chamfer recess) */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: 'linear-gradient(180deg, #181715 0%, #2e2c28 100%)',
          boxShadow: 'inset 0 1px 1.5px rgba(0,0,0,0.8), 0 1px 0 rgba(255,255,255,0.7)',
        }}
      />

      {/* Emissive Aura (Aura light bleed onto plastic chassis) */}
      {!isOff && (
        <div
          className={`absolute rounded-full pointer-events-none ${isChecking ? 'animate-ping' : ''}`}
          style={{
            width: size * 2.2,
            height: size * 2.2,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(1.5px)',
          }}
        />
      )}

      {/* Internal Glass Lens Dome */}
      <div
        className={`relative rounded-full overflow-hidden ${isChecking ? 'animate-pulse' : ''}`}
        style={{
          width: Math.max(4, size - 3),
          height: Math.max(4, size - 3),
          background: isOff
            ? 'linear-gradient(135deg, #4b4b52 0%, #27272a 100%)'
            : isAvail
            ? 'radial-gradient(circle at 35% 30%, #6ee7b7 0%, #10b981 45%, #047857 100%)'
            : isChecking
            ? 'radial-gradient(circle at 35% 30%, #fde68a 0%, #f59e0b 45%, #b45309 100%)'
            : 'radial-gradient(circle at 35% 30%, #ff80b8 0%, #ff2a85 45%, #be0e58 100%)',
          boxShadow: isOff
            ? 'inset 0 1px 1px rgba(0,0,0,0.6)'
            : `0 0 ${size * 0.7}px ${coreColor}, inset 0 1px 1px rgba(255,255,255,0.6)`,
        }}
      >
        {/* Specular Glare Highlight (curved reflection on glass) */}
        <div
          className="absolute rounded-full"
          style={{
            top: '15%',
            left: '20%',
            width: '35%',
            height: '25%',
            background: 'rgba(255, 255, 255, 0.85)',
            filter: 'blur(0.2px)',
          }}
        />
      </div>
    </div>
  )
}
