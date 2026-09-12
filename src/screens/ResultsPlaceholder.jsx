import { useState } from 'react'
import ResultCard from '../components/ResultCard.jsx'
import { PixelDino, PixelDivider, PixelSparkle } from '../components/pixel/PixelElements.jsx'

/**
 * Placeholder S2 Results Body
 *
 * Serves as the connected destination for S1 (Brief) in this step.
 * Renders the navigation shell connection, brief summary, and a preview of the
 * shared ResultCard component across different states before full S2 content is built.
 *
 * Adheres strictly to the finalized retro-pixel visual direction:
 * - Google Fonts Silkscreen display font & Space Mono metadata
 * - Notebook grid canvas & high-contrast black borders with #ff2a8d accents
 * - Perforated jagged bottom pixel divider
 * - Bidirectional navigation to S1 with zero dead-ends
 */
export default function ResultsPlaceholder({ brief, onNavigateToBrief }) {
  const [copiedDomain, setCopiedDomain] = useState(null)
  const [shortlisted, setShortlisted] = useState({})
  const [compared, setCompared] = useState({})

  const sld = (brief.name || 'Loom & Carbon')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
  const primaryTld = brief.tld || '.com'

  const sampleCards = [
    {
      slotNumber: 1,
      name: brief.name || 'Loom & Carbon',
      domain: sld || 'loomandcarbon',
      tld: primaryTld,
      availability: 'available',
      tlds: [
        { ext: '.io', available: true },
        { ext: '.ai', available: false },
      ],
    },
    {
      slotNumber: 2,
      name: 'Foundry Grain',
      domain: 'foundrygrain',
      tld: '.com',
      availability: 'taken',
      tlds: [
        { ext: '.io', available: true },
        { ext: '.ai', available: true },
      ],
    },
  ]

  const handleCopy = (fullDomain) => {
    try {
      navigator.clipboard.writeText(fullDomain)
    } catch {
      // clipboard fallback
    }
    setCopiedDomain(fullDomain)
    setTimeout(() => setCopiedDomain((d) => (d === fullDomain ? null : d)), 1500)
  }

  const toggleShortlist = (domain) => {
    setShortlisted((prev) => ({ ...prev, [domain]: !prev[domain] }))
  }

  const toggleCompare = (domain) => {
    setCompared((prev) => ({ ...prev, [domain]: !prev[domain] }))
  }

  return (
    <main className="notebook-grid min-h-[calc(100vh-65px)] pb-20 pt-8 px-4 sm:px-12 text-black font-meta selection:bg-[#ff2a8d] selection:text-white">
      <div className="mx-auto max-w-[840px]">
        {/* Top Header Strip */}
        <div className="border-4 border-black bg-white p-5 sm:p-6 pixel-shadow mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <PixelDino className="size-5 text-[#22c55e]" />
                <span className="bg-black text-white px-2 py-0.5 font-pixel text-[10px]">
                  S2 // RESULTS (SHELL PLACEHOLDER)
                </span>
                <span className="border-2 border-black bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-black">
                  [SHELL CONNECTED]
                </span>
              </div>
              <p className="font-meta text-[11px] font-bold uppercase tracking-[1px] text-[#737373]">
                SEARCHED BRIEF SUBJECT:
              </p>
              <h1 className="font-pixel text-[24px] sm:text-[32px] text-black leading-tight">
                {brief.name || 'Loom & Carbon'}
              </h1>
            </div>

            <button
              type="button"
              onClick={onNavigateToBrief}
              className="border-3 border-black bg-[#faf8f5] px-5 py-2.5 font-mono text-[12px] font-bold hover:bg-black hover:text-white transition-all pixel-shadow cursor-pointer flex items-center gap-2"
            >
              <span>← EDIT BRIEF (S1)</span>
            </button>
          </div>
        </div>

        {/* Informative Shell Notice */}
        <div className="border-2 border-dashed border-black bg-[#faf8f5] p-4 sm:p-5 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <PixelSparkle className="size-3.5 text-[#ff2a8d]" />
            <p className="font-pixel text-[11px] text-black">
              NAVIGATION SHELL ACTIVE: S1 &lt;—&gt; S2
            </p>
          </div>
          <p className="font-mono text-[12px] text-[#4a4a4a]">
            Brief carried over cleanly from S1. Demonstrating shared{' '}
            <span className="font-bold text-black">&lt;ResultCard /&gt;</span> component below
            with props for <span className="bg-black text-white px-1 font-pixel text-[9px]">name</span>,{' '}
            <span className="bg-black text-white px-1 font-pixel text-[9px]">domain</span>,{' '}
            <span className="bg-black text-white px-1 font-pixel text-[9px]">availability</span>, and{' '}
            <span className="bg-black text-white px-1 font-pixel text-[9px]">tlds</span> indicators.
          </p>
        </div>

        {/* Shared Component Preview using props: name, domain, availability, tlds */}
        <div className="space-y-6">
          {sampleCards.map((c) => (
            <ResultCard
              key={c.domain}
              slotNumber={c.slotNumber}
              name={c.name}
              domain={c.domain}
              tld={c.tld}
              availability={c.availability}
              tlds={c.tlds}
              copiedDomain={copiedDomain}
              onCopy={handleCopy}
              isShortlisted={Boolean(shortlisted[c.domain])}
              onToggleShortlist={() => toggleShortlist(c.domain)}
              isCompared={Boolean(compared[c.domain])}
              onToggleCompare={() => toggleCompare(c.domain)}
            />
          ))}
        </div>

        {/* Decorative Bottom Trim */}
        <div className="mt-12">
          <PixelDivider color="#ff2a8d" height={16} />
        </div>
      </div>
    </main>
  )
}
