import React from 'react'

/**
 * Reusable pixelated zig-zag divider inspired by the attached reference image's
 * hot pink header / footer pixel cutouts.
 */
export function PixelDivider({ color = '#ff2a8d', height = 16, flip = false, className = '' }) {
  return (
    <div
      className={`w-full overflow-hidden leading-none ${className}`}
      style={{
        transform: flip ? 'rotate(180deg)' : 'none',
        height: `${height}px`,
      }}
    >
      <svg
        width="100%"
        height={height}
        viewBox="0 0 1200 16"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="pixel-zag" width="24" height="16" patternUnits="userSpaceOnUse">
          {/* Jagged stepped 8-bit tooth */}
          <path
            d="M0 0 H24 V4 H20 V8 H16 V12 H12 V16 H8 V12 H4 V8 H0 V4 Z"
            fill={color}
          />
        </pattern>
        <rect width="100%" height={height} fill="url(#pixel-zag)" />
      </svg>
    </div>
  )
}

/**
 * Pixel icon badge inspired by the reference comp's 8-bit icons (dino, heart, skull)
 */
export function PixelHeart({ className = 'size-4 text-black' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 3h3v2H2zM7 3h2v2H7zM11 3h3v2h-3zM1 5h14v3H1zM2 8h12v2H2zM4 10h8v2H4zM6 12h4v2H6zM7 14h2v2H7z" />
    </svg>
  )
}

export function PixelDino({ className = 'size-5 text-[#22c55e]' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2h6v2h-2v2h2v4h-2V8h-2V6h-2V2zM10 8h2v2h-2V8zm-2 2h2v2H8v-2zm-2 2h2v2H6v-2zm-2 2h2v4H4v-4zm6 2h8v2h-8v-2zm0 2h10v2h-10v-2zm-4 2h12v2H6v-2zm2 2h2v2H8v-2zm8 0h2v2h-2v-2z" />
    </svg>
  )
}

export function PixelSparkle({ className = 'size-4 text-[#ff2a8d]' }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M7 1h2v3H7zM7 12h2v3H7zM1 7h3v2H1zM12 7h3v2h-3zM4 4h2v2H4zM10 4h2v2h-2zM4 10h2v2H4zM10 10h2v2h-2z" />
    </svg>
  )
}
