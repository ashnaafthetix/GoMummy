import { useState } from 'react'
import {
  exportDossierMarkdown,
  exportDossierHtml,
  copyDossierMarkdown,
} from '../services/dossierService.js'

export default function Shortlist({ shortlist = [], onRemove, onNavigate }) {
  const [copied, setCopied] = useState(false)
  const [copiedDossier, setCopiedDossier] = useState(false)

  const copyList = async () => {
    const text = shortlist.map((s) => `${s.domain}${s.tld || '.com'}`).join('\n')
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // clipboard permission denied
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const handleCopyDossier = async () => {
    const ok = await copyDossierMarkdown(shortlist, 'GoMummy Brand Expedition')
    if (ok) {
      setCopiedDossier(true)
      setTimeout(() => setCopiedDossier(false), 2000)
    }
  }

  return (
    <main className="flex justify-center bg-canvas px-6 py-10 sm:px-16 sm:py-16">
      <div className="flex w-full max-w-[700px] flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-[28px] font-bold leading-[30px] tracking-[-0.4px] text-ink">
              Shortlist Portfolio
            </h1>
            <p className="font-meta text-xs text-meta mt-1">
              {shortlist.length} candidate domains saved to active ledger
            </p>
          </div>

          {shortlist.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDossier}
                className="border border-ink bg-paper px-3 py-2 font-mono text-[11px] font-bold text-ink hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Copy structured executive markdown dossier to clipboard"
              >
                {copiedDossier ? '✓ Copied Dossier' : '📋 Copy Dossier'}
              </button>
              <button
                type="button"
                onClick={() => exportDossierMarkdown(shortlist, 'GoMummy Brand Expedition')}
                className="border border-ink bg-paper px-3 py-2 font-mono text-[11px] font-bold text-ink hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Download Pitch Dossier Markdown file"
              >
                📄 Dossier (.md)
              </button>
              <button
                type="button"
                onClick={() => exportDossierHtml(shortlist, 'GoMummy Brand Expedition')}
                className="border border-ink bg-black text-white px-3 py-2 font-mono text-[11px] font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Download standalone HTML presentation ready to print or save as PDF"
              >
                🖨️ Presentation (.html)
              </button>
              <button
                type="button"
                onClick={copyList}
                className="border border-border bg-paper px-3 py-2 font-meta text-[11px] font-semibold text-meta hover:text-ink transition-colors cursor-pointer"
              >
                {copied ? 'Copied ✓' : 'List only'}
              </button>
            </div>
          )}
        </div>

        {shortlist.length === 0 ? (
          <div className="border border-border bg-paper px-5 py-10 text-center">
            <p className="font-meta text-[12px] text-meta">
              Nothing shortlisted yet. Shortlist a name from the results screen.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('results')}
              className="mt-4 font-meta text-[12px] font-semibold text-ink"
            >
              Go to results →
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            {shortlist.map((item) => (
              <div key={item.domain} className="flex items-center justify-between border-b border-border py-4">
                <div className="flex flex-col gap-0.5">
                  <p className="font-meta text-[14px] font-semibold text-ink">{item.name}</p>
                  <p className="font-meta text-[12px] text-meta">
                    {item.domain}
                    {item.tld}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item)}
                  className="font-meta text-[12px] font-semibold text-meta hover:text-ink"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
