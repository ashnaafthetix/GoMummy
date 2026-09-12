import { useState } from 'react'
import Direction1Omnibox from './Direction1Omnibox.jsx'
import Direction2Arcade from './Direction2Arcade.jsx'
import Direction3Dossier from './Direction3Dossier.jsx'

export default function RetroPreviewGallery({ onFindNames, onBackToApp }) {
  const [activeTab, setActiveTab] = useState('d1')

  const directions = [
    {
      id: 'd1',
      title: '01 // HERO OMNIBOX',
      subtitle: 'Perplexity / Raycast Archetype',
      distinction: 'Single dominant central input with secondary fields tucked into an expandable bottom HUD drawer.',
    },
    {
      id: 'd2',
      title: '02 // 3-CARD ARCADE',
      subtitle: 'Modular Matrix Archetype',
      distinction: 'Splits 3 inputs into 3 equal-height modular slots side-by-side with a docked full-width [START] CTA.',
    },
    {
      id: 'd3',
      title: '03 // SPEC DOSSIER',
      subtitle: 'Spec Sheet / Notion Archetype',
      distinction: 'Continuous vertical ruled spec sheet split by a jagged pixel perforation divider into structured rows.',
    },
  ]

  return (
    <div className="min-h-screen bg-[#faf8f5] text-black">
      {/* Top Gallery Navigation Bar */}
      <header className="sticky top-0 z-50 border-b-4 border-black bg-white px-4 py-3 shadow-md">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="bg-[#ff2a8d] px-2.5 py-1 font-pixel text-[12px] text-white">
              RESEARCH PREVIEWS
            </span>
            <span className="font-pixel text-[13px] text-black">
              RETRO ACID PINK &amp; PIXEL DIRECTIONS
            </span>
          </div>

          {/* Direction Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {directions.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveTab(d.id)}
                className={`border-2 border-black px-3 py-1.5 font-pixel text-[11px] transition-all ${
                  activeTab === d.id
                    ? 'bg-[#ff2a8d] text-white shadow-[3px_3px_0px_0px_#000]'
                    : 'bg-[#fafafa] text-black hover:bg-white'
                }`}
              >
                {d.title}
              </button>
            ))}

            {onBackToApp && (
              <button
                type="button"
                onClick={onBackToApp}
                className="ml-2 border-2 border-black bg-black px-3 py-1.5 font-mono text-[11px] font-bold text-white hover:bg-[#4a4a4a]"
              >
                ← BACK TO GOMUMMY
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Direction Info Banner */}
      <div className="border-b-2 border-black bg-[#ff2a8d] px-4 py-2.5 text-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-2 font-mono text-[12px]">
          <div>
            <span className="font-pixel text-[11px] uppercase mr-2">
              {directions.find((d) => d.id === activeTab)?.subtitle}:
            </span>
            <span>{directions.find((d) => d.id === activeTab)?.distinction}</span>
          </div>
          <span className="font-pixel text-[10px] bg-black text-white px-2 py-0.5">
            INTERACTIVE PREVIEW
          </span>
        </div>
      </div>

      {/* Main Preview Screen Display */}
      <main className="mx-auto max-w-[1200px] p-4 sm:p-8">
        {activeTab === 'd1' && <Direction1Omnibox onFindNames={onFindNames} />}
        {activeTab === 'd2' && <Direction2Arcade onFindNames={onFindNames} />}
        {activeTab === 'd3' && <Direction3Dossier onFindNames={onFindNames} />}
      </main>

      {/* Footer Specs */}
      <footer className="border-t-4 border-black bg-white p-6 text-center font-mono text-[11px] text-[#737373]">
        GoMummy Design Explorations • Attached Reference Aesthetic: Hot Pink (#ff2a8d), Pixel Silkscreen, Notebook Grid, Stark Black
      </footer>
    </div>
  )
}
