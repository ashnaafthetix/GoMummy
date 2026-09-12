import { useState } from 'react'
import { PixelDivider, PixelDino, PixelHeart, PixelSparkle } from './PixelElements.jsx'

/**
 * DIRECTION 2: The 3-Card Arcade Matrix
 *
 * Structural Distinction:
 * Splits the 3-input model into three distinct, equal-height chunky pink-and-white
 * pixelated modular cards side-by-side (or stacked on mobile) with separate entry steps,
 * culminating in a bold, full-width [LET'S GO!] bitmapped CTA block docked at the base.
 */
export default function Direction2Arcade({ onFindNames }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [tld, setTld] = useState('.com')

  const canSubmit = name.trim() || description.trim() || competitors.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    onFindNames?.({ name, description, competitors, tld })
  }

  return (
    <div className="notebook-grid relative flex min-h-[640px] flex-col justify-between border-4 border-black p-6 sm:p-10 font-meta">
      {/* Arcade Header */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-4 border-black pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#ff2a8d] px-2 py-0.5 font-pixel text-[11px] text-white">
                SELECT YOUR WEAPON
              </span>
              <span className="font-pixel text-[11px] text-black">// ARCADE 3-CARD MODE</span>
            </div>
            <h1 className="mt-2 font-pixel text-[26px] sm:text-[32px] text-black">
              CONFIGURE YOUR SEARCH
            </h1>
          </div>

          {/* TLD Arcade Selector */}
          <div className="flex items-center gap-2 border-2 border-black bg-white p-1.5 pixel-shadow">
            <span className="font-pixel text-[9px] uppercase px-1">TLD:</span>
            {['.com', '.io', '.ai'].map((ext) => (
              <button
                key={ext}
                type="button"
                onClick={() => setTld(ext)}
                className={`px-3 py-1 font-pixel text-[11px] transition-colors ${
                  tld === ext
                    ? 'bg-[#ff2a8d] text-white'
                    : 'bg-transparent text-black hover:bg-[#fafafa]'
                }`}
              >
                {ext}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Card Modular Grid */}
        <form onSubmit={handleSubmit} className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: The Name */}
            <div className="flex flex-col justify-between border-4 border-black bg-white p-5 pixel-shadow transition-transform hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <span className="bg-black px-2 py-0.5 font-pixel text-[10px] text-white">
                    SLOT 01
                  </span>
                  <PixelSparkle className="size-4 text-[#ff2a8d]" />
                </div>
                <h3 className="font-pixel text-[14px] text-black">SUBJECT NAME</h3>
                <p className="mt-1 font-mono text-[11px] text-[#737373]">
                  A brand name already in mind? Test its availability.
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Nimbus"
                    className="w-full border-2 border-black bg-[#faf8f5] p-2.5 font-pixel text-[13px] text-black outline-none focus:bg-white focus:border-[#ff2a8d]"
                  />
                </div>
              </div>
              <div className="mt-4 border-t-2 border-dashed border-[#e5e5e5] pt-2 font-mono text-[10px] text-[#4a4a4a]">
                STATUS: {name.trim() ? 'READY' : 'OPTIONAL'}
              </div>
            </div>

            {/* Card 2: Description Flavor */}
            <div className="flex flex-col justify-between border-4 border-black bg-white p-5 pixel-shadow transition-transform hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <span className="bg-black px-2 py-0.5 font-pixel text-[10px] text-white">
                    SLOT 02
                  </span>
                  <PixelDino className="size-4 text-[#22c55e]" />
                </div>
                <h3 className="font-pixel text-[14px] text-black">BRAND FLAVOR</h3>
                <p className="mt-1 font-mono text-[11px] text-[#737373]">
                  What are you building? Tone, audience, or vibes.
                </p>
                <div className="mt-4">
                  <textarea
                    rows={3}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short summary of what you are making..."
                    className="w-full border-2 border-black bg-[#faf8f5] p-2.5 font-mono text-[12px] text-black outline-none focus:bg-white focus:border-[#ff2a8d]"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-between border-t-2 border-dashed border-[#e5e5e5] pt-2 font-mono text-[10px] text-[#4a4a4a]">
                <span>LENGTH: {description.length}/1000</span>
                <span>{description.trim() ? 'READY' : 'OPTIONAL'}</span>
              </div>
            </div>

            {/* Card 3: Competitors & Collisions */}
            <div className="flex flex-col justify-between border-4 border-black bg-white p-5 pixel-shadow transition-transform hover:-translate-y-1">
              <div>
                <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
                  <span className="bg-black px-2 py-0.5 font-pixel text-[10px] text-white">
                    SLOT 03
                  </span>
                  <PixelHeart className="size-4 text-[#ff2a8d]" />
                </div>
                <h3 className="font-pixel text-[14px] text-black">COLLISION ZONE</h3>
                <p className="mt-1 font-mono text-[11px] text-[#737373]">
                  Competitors to steer clear of and keywords to avoid.
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    placeholder="e.g. Stripe, Linear..."
                    className="w-full border-2 border-black bg-[#faf8f5] p-2.5 font-mono text-[12px] text-black outline-none focus:bg-white focus:border-[#ff2a8d]"
                  />
                </div>
              </div>
              <div className="mt-4 border-t-2 border-dashed border-[#e5e5e5] pt-2 font-mono text-[10px] text-[#4a4a4a]">
                STATUS: {competitors.trim() ? 'FILTER ON' : 'OPTIONAL'}
              </div>
            </div>
          </div>

          {/* Full-Width Arcade Base CTA */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full border-4 border-black bg-[#ff2a8d] py-4 text-center font-pixel text-[16px] tracking-wider text-white pixel-shadow hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              [ PRESS START // GENERATE NAMES WITH SELECTED SLOTS ]
            </button>
          </div>
        </form>
      </div>

      {/* Retro Bottom Trim */}
      <div className="mt-8">
        <PixelDivider color="#ff2a8d" height={14} />
      </div>
    </div>
  )
}
