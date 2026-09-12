import { useState } from 'react'
import { PixelDivider, PixelDino, PixelHeart, PixelSparkle } from './PixelElements.jsx'

/**
 * DIRECTION 3: The Dossier / Spec Sheet with Jagged Perforation
 *
 * Structural Distinction:
 * Organizes the fields as a continuous vertical, ruled-grid spec sheet separated by the image’s
 * signature pixel zig-zag divider, where the primary name input serves as an oversized document
 * title and the constraints/competitors flow as structured metadata key-value rows below it.
 */
export default function Direction3Dossier({ onFindNames }) {
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
    <div className="notebook-grid relative flex min-h-[640px] flex-col justify-between border-4 border-black p-6 sm:p-12 font-meta">
      {/* Top Dossier Header Strip */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-black pb-3">
          <div className="flex items-center gap-3">
            <span className="border-2 border-black bg-black px-2 py-0.5 font-pixel text-[10px] text-white">
              FORM GM-84
            </span>
            <span className="font-mono text-[11px] uppercase tracking-wider text-black">
              BRAND SPECIFICATION DOSSIER
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[11px]">
            <span className="text-[#737373]">DOC ID:</span>
            <span className="font-bold text-[#ff2a8d]">#902-PALS</span>
          </div>
        </div>

        {/* Spec Sheet Form */}
        <form onSubmit={handleSubmit} className="mt-8 max-w-[800px] mx-auto bg-white border-4 border-black pixel-shadow">
          {/* Section 1: Document Hero Title (Primary Subject) */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#737373] uppercase mb-2">
              <span>FIELD 01 // PRIMARY SUBJECT IDENTIFIER</span>
              <span className="bg-[#ff2a8d] text-white px-2 py-0.5 font-pixel text-[9px]">
                HERO FIELD
              </span>
            </div>

            <div className="relative border-b-4 border-black pb-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ENTER BRAND OR DOMAIN HERE..."
                className="w-full bg-transparent font-pixel text-[22px] sm:text-[30px] text-black outline-none placeholder:text-[#d0d0d0]"
              />
            </div>
            <p className="mt-2 font-mono text-[11px] text-[#737373]">
              Leave blank to brainstorm solely from brand flavor and collision constraints.
            </p>
          </div>

          {/* Jagged Pixel Cutout Perforation Divider */}
          <div className="w-full bg-[#faf8f5] py-1 border-y-2 border-black">
            <PixelDivider color="#ff2a8d" height={12} />
          </div>

          {/* Section 2: Structured Metadata Key-Value Rows */}
          <div className="divide-y-2 divide-black">
            {/* Row A: Brand Description */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-5 sm:p-6 bg-white gap-3 sm:gap-6">
              <div className="sm:col-span-4">
                <span className="font-pixel text-[11px] text-black block">02. BRAND FLAVOR</span>
                <span className="font-mono text-[10px] text-[#737373] block mt-1">
                  Product description, mission, or target market keywords.
                </span>
              </div>
              <div className="sm:col-span-8">
                <textarea
                  rows={3}
                  maxLength={1000}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Minimalist dev tools for modern engineering teams..."
                  className="w-full border-2 border-black bg-[#faf8f5] p-3 font-mono text-[12px] text-black outline-none focus:bg-white focus:border-[#ff2a8d]"
                />
                <div className="flex justify-end font-mono text-[10px] text-[#737373] mt-1">
                  {description.length}/1000 CHARACTERS
                </div>
              </div>
            </div>

            {/* Row B: Collision Constraints */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-5 sm:p-6 bg-white gap-3 sm:gap-6">
              <div className="sm:col-span-4">
                <span className="font-pixel text-[11px] text-black block">03. COLLISION FILTER</span>
                <span className="font-mono text-[10px] text-[#737373] block mt-1">
                  Competitor brands and terms that must not overlap.
                </span>
              </div>
              <div className="sm:col-span-8">
                <input
                  type="text"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  placeholder="e.g. Datadog, New Relic, Grafana"
                  className="w-full border-2 border-black bg-[#faf8f5] p-3 font-mono text-[12px] text-black outline-none focus:bg-white focus:border-[#ff2a8d]"
                />
              </div>
            </div>

            {/* Row C: Preferred TLD */}
            <div className="grid grid-cols-1 sm:grid-cols-12 p-5 sm:p-6 bg-white gap-3 sm:gap-6 items-center">
              <div className="sm:col-span-4">
                <span className="font-pixel text-[11px] text-black block">04. TARGET EXTENSION</span>
                <span className="font-mono text-[10px] text-[#737373] block mt-1">
                  Top-level domain priority.
                </span>
              </div>
              <div className="sm:col-span-8 flex items-center gap-3">
                {['.com', '.io', '.ai'].map((ext) => (
                  <button
                    key={ext}
                    type="button"
                    onClick={() => setTld(ext)}
                    className={`px-4 py-2 border-2 border-black font-pixel text-[11px] transition-colors ${
                      tld === ext
                        ? 'bg-[#ff2a8d] text-white'
                        : 'bg-white text-black hover:bg-[#fafafa]'
                    }`}
                  >
                    {ext}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Dossier Bottom Action Bar */}
          <div className="border-t-4 border-black bg-[#faf8f5] p-5 sm:p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-mono text-[11px] text-[#4a4a4a]">
              <PixelDino className="size-5 text-[#22c55e]" />
              <span>STATUS: READY FOR EXECUTION</span>
            </div>

            <button
              type="submit"
              disabled={!canSubmit}
              className="border-4 border-black bg-black px-8 py-3.5 font-pixel text-[13px] text-white pixel-shadow hover:bg-[#ff2a8d] hover:border-black active:translate-x-0.5 active:translate-y-0.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              [ SUBMIT DOSSIER &amp; RUN SEARCH ]
            </button>
          </div>
        </form>
      </div>

      {/* Decorative Bottom Trim */}
      <div className="mt-8">
        <PixelDivider color="#ff2a8d" height={14} />
      </div>
    </div>
  )
}
