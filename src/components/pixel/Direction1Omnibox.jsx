import { useState } from 'react'
import { PixelDivider, PixelDino, PixelHeart } from './PixelElements.jsx'

/**
 * DIRECTION 1: The Hero Omnibox with Pixel HUD Drawer
 *
 * Structural Distinction:
 * Anchors everything around a single dominant pixel-bordered search textarea front-and-center,
 * keeping secondary fields (description, competitor collisions, TLD tags) tucked inside an
 * expandable bottom HUD drawer that reveals inline tags and chip toggles only on interaction.
 */
export default function Direction1Omnibox({ onFindNames }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [tld, setTld] = useState('.com')
  const [drawerOpen, setDrawerOpen] = useState(false)

  const canSubmit = name.trim() || description.trim() || competitors.trim()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!canSubmit) return
    onFindNames?.({ name, description, competitors, tld })
  }

  return (
    <div className="notebook-grid relative flex min-h-[640px] flex-col justify-between border-4 border-black p-6 sm:p-12 font-meta">
      {/* Top Retro Pixel Banner */}
      <div className="flex items-center justify-between border-b-2 border-black pb-4">
        <div className="flex items-center gap-2">
          <PixelDino className="size-6 text-[#22c55e]" />
          <span className="font-pixel text-[13px] tracking-wider text-black">GOMUMMY // v1.0</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="bg-[#ff2a8d] px-2 py-0.5 font-pixel text-[10px] text-white">
            01 // HERO OMNIBOX
          </span>
          <span className="border border-black bg-white px-2 py-0.5 font-mono text-[11px]">
            [HUD DRAWER]
          </span>
        </div>
      </div>

      {/* Main Omnibox Section */}
      <div className="mx-auto my-auto w-full max-w-[680px] py-8">
        <div className="mb-6 text-center">
          <h2 className="font-pixel text-[24px] sm:text-[34px] tracking-tight text-black leading-tight">
            NAME SEARCH IS OUR ART
          </h2>
          <p className="mt-2 font-mono text-[12px] uppercase tracking-widest text-[#4a4a4a]">
            CHECK AVAILABILITY • HARVEST AVAILABLE DOMAINS
          </p>
        </div>

        {/* Primary Omnibox Input Frame */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="border-4 border-black bg-white p-4 sm:p-6 pixel-shadow transition-shadow focus-within:shadow-[6px_6px_0px_0px_#ff2a8d]">
            <div className="flex items-center justify-between border-b-2 border-black pb-2 mb-3">
              <label className="font-pixel text-[11px] text-black">
                &gt; PRIMARY SUBJECT:
              </label>
              <span className="font-mono text-[10px] text-[#737373]">
                PRESS ENTER OR EXPAND HUD
              </span>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Acme, Nimbus, Velvet..."
              className="w-full bg-transparent font-pixel text-[18px] sm:text-[22px] text-black outline-none placeholder:text-[#c0c0c0]"
            />

            {/* Bottom inline drawer toggler bar */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-dashed border-[#e5e5e5] pt-3">
              <button
                type="button"
                onClick={() => setDrawerOpen(!drawerOpen)}
                className="flex items-center gap-2 border border-black bg-[#faf8f5] px-3 py-1 font-mono text-[11px] font-bold uppercase transition-colors hover:bg-black hover:text-white"
              >
                <span>{drawerOpen ? '[-]' : '[+]'}</span>
                <span>{drawerOpen ? 'HIDE FLAVOR SPEC' : 'ADD FLAVOR & KEYWORDS'}</span>
                {(description || competitors) && (
                  <span className="bg-[#ff2a8d] px-1 text-white text-[9px] rounded-none">ACTIVE</span>
                )}
              </button>

              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] font-bold uppercase text-[#737373]">TLD:</span>
                {['.com', '.io', '.ai'].map((ext) => (
                  <button
                    key={ext}
                    type="button"
                    onClick={() => setTld(ext)}
                    className={`px-2 py-0.5 font-mono text-[11px] font-bold border ${
                      tld === ext
                        ? 'border-black bg-black text-white'
                        : 'border-[#cac4d0] bg-white text-black hover:border-black'
                    }`}
                  >
                    {ext}
                  </button>
                ))}
              </div>
            </div>

            {/* Expandable HUD Drawer for Secondary Fields */}
            {drawerOpen && (
              <div className="mt-4 space-y-3 border-t-2 border-black bg-[#fef7ff] p-4">
                <div>
                  <div className="flex justify-between font-mono text-[10px] uppercase font-bold text-[#171717] mb-1">
                    <span>Brand Flavor / Description</span>
                    <span>{description.length}/1,000</span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={1000}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe tone, market, persona..."
                    className="w-full border-2 border-black bg-white p-2 font-mono text-[12px] text-black outline-none focus:border-[#ff2a8d]"
                  />
                </div>

                <div>
                  <div className="font-mono text-[10px] uppercase font-bold text-[#171717] mb-1">
                    Competitors & Keywords to Avoid
                  </div>
                  <input
                    type="text"
                    value={competitors}
                    onChange={(e) => setCompetitors(e.target.value)}
                    placeholder="e.g. Stripe, Shopify, LemonSqueezy..."
                    className="w-full border-2 border-black bg-white p-2 font-mono text-[12px] text-black outline-none focus:border-[#ff2a8d]"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Chunky Action Bar */}
          <div className="mt-6 flex items-center justify-between">
            <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#4a4a4a]">
              <PixelHeart className="size-4 text-[#ff2a8d]" />
              <span>3-Input Model Ready</span>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full sm:w-auto border-4 border-black bg-[#ff2a8d] px-8 py-3.5 font-pixel text-[14px] text-white pixel-shadow hover:translate-x-0.5 hover:translate-y-0.5 active:translate-x-1 active:translate-y-1 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              RUN CHECK &amp; GENERATE &gt;
            </button>
          </div>
        </form>
      </div>

      {/* Decorative Bottom Pixel Jagged Trim */}
      <div className="mt-6">
        <PixelDivider color="#ff2a8d" height={14} />
      </div>
    </div>
  )
}
