import { useState } from 'react'
import DirectionAResults from './DirectionAResults.jsx'
import DirectionBResults from './DirectionBResults.jsx'
import DirectionCResults from './DirectionCResults.jsx'

export default function ResultsPreviewGallery(props) {
  const [activeTab, setActiveTab] = useState('dir-b')

  const directions = [
    {
      id: 'dir-a',
      title: 'DIR A // TERMINAL LEDGER',
      subtitle: 'Dense 1-Col List',
      dock: 'Sticky Bottom Floating Dock',
      desc: 'Single-column high-density table-like ledger. Fast scan lines; regenerate sits docked in a persistent bottom arcade HUD bar.',
    },
    {
      id: 'dir-b',
      title: 'DIR B // MODULAR ARCADE GRID',
      subtitle: 'Balanced 2-Col Grid',
      dock: 'Top Control Header',
      desc: '2-column balanced cartridge cards with generous breathing room. Regenerate sits directly in the top header beside the filters.',
    },
    {
      id: 'dir-c',
      title: 'DIR C // CONTINUOUS FEED',
      subtitle: '1-Col In-Stream Stack',
      dock: 'In-Stream Terminal Card',
      desc: 'Vertical card stream with perforated pixel zig-zag dividers. Regenerate sits as a distinct batch-end action card.',
    },
  ]

  const current = directions.find((d) => d.id === activeTab)

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Top Gallery Navigation Bar */}
      <div className="sticky top-0 z-50 border-b-4 border-black bg-white px-4 py-3 shadow-md">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#ff2a8d] px-2.5 py-1 font-pixel text-[11px] text-white">
              RESULTS RESEARCH
            </span>
            <span className="font-pixel text-[12px] text-black">
              3 RESULTS DIRECTIONS
            </span>
          </div>

          {/* Direction Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {directions.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveTab(d.id)}
                className={`border-2 border-black px-3 py-1 font-pixel text-[11px] transition-all ${
                  activeTab === d.id
                    ? 'bg-[#ff2a8d] text-white shadow-[3px_3px_0px_0px_#000]'
                    : 'bg-[#fafafa] text-black hover:bg-white'
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Structural Distinction Summary Bar */}
      <div className="border-b-2 border-black bg-[#ff2a8d] px-4 py-2 text-white">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 font-mono text-[12px]">
          <div>
            <span className="font-pixel text-[11px] uppercase mr-2 font-bold">
              {current?.subtitle} • {current?.dock}:
            </span>
            <span>{current?.desc}</span>
          </div>
          <span className="font-pixel text-[9px] bg-black text-white px-2 py-0.5">
            INTERACTIVE PREVIEW
          </span>
        </div>
      </div>

      {/* Render Active Results Direction */}
      <div>
        {activeTab === 'dir-a' && <DirectionAResults {...props} />}
        {activeTab === 'dir-b' && <DirectionBResults {...props} />}
        {activeTab === 'dir-c' && <DirectionCResults {...props} />}
      </div>
    </div>
  )
}
