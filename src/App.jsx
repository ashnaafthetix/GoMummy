import { useState } from 'react'
import Brief from './screens/Brief.jsx'
import Results from './screens/Results.jsx'
import Shortlist from './screens/Shortlist.jsx'
import Compare from './screens/Compare.jsx'
import QuestionsPanel from './screens/QuestionsPanel.jsx'
import { CANDIDATE_POOL, INITIAL_BRIEF, QUESTIONS, pickBatch } from './data.js'

import RetroPreviewGallery from './components/pixel/RetroPreviewGallery.jsx'
import ResultsPreviewGallery from './components/results-dirs/ResultsPreviewGallery.jsx'

const REGENS_BEFORE_QUESTION = 3

export default function App() {
  const [view, setView] = useState('brief')
  const [questionsOpen, setQuestionsOpen] = useState(false)

  const [brief, setBrief] = useState(INITIAL_BRIEF)
  const [results, setResults] = useState(() => pickBatch(CANDIDATE_POOL))
  const [filters, setFilters] = useState({ tld: 'any', length: 'any' })
  const [shortlist, setShortlist] = useState([])
  const [compareSel, setCompareSel] = useState([])
  const [answers, setAnswers] = useState({})
  const [regenCount, setRegenCount] = useState(0)
  const [pendingQuestion, setPendingQuestion] = useState(null)

  const firstUnanswered = (a) => {
    const idx = QUESTIONS.findIndex((_, i) => !(a[i] || '').trim())
    return idx === -1 ? null : idx
  }

  const findNames = (values) => {
    setBrief(values)
    setResults(pickBatch(CANDIDATE_POOL))
    setFilters({ tld: 'any', length: 'any' })
    setRegenCount(0)
    setPendingQuestion(null)
    setView('results')
  }

  const regenerate = () => {
    if (pendingQuestion !== null) return
    setResults((prev) => pickBatch(CANDIDATE_POOL, prev.map((r) => r.domain)))
    setRegenCount((n) => {
      const next = n + 1
      if (next >= REGENS_BEFORE_QUESTION) {
        const idx = firstUnanswered(answers)
        if (idx !== null) {
          setPendingQuestion(idx)
          return 0
        }
      }
      return next
    })
  }

  const registerSelection = () => setRegenCount(0)

  const toggleShortlist = (item) => {
    registerSelection()
    setShortlist((list) =>
      list.some((s) => s.domain === item.domain)
        ? list.filter((s) => s.domain !== item.domain)
        : [...list, item]
    )
  }

  const toggleCompare = (item) => {
    registerSelection()
    setCompareSel((sel) => {
      if (sel.some((s) => s.domain === item.domain)) return sel.filter((s) => s.domain !== item.domain)
      if (sel.length < 2) return [...sel, item]
      return [sel[1], item]
    })
  }

  const saveAnswer = (index, value) => setAnswers((a) => ({ ...a, [index]: value }))

  const answerFollowUp = (index, value) => {
    saveAnswer(index, value)
    setPendingQuestion(null)
    setResults((prev) => pickBatch(CANDIDATE_POOL, prev.map((r) => r.domain)))
  }

  const skipFollowUp = () => setPendingQuestion(null)

  return (
    <div className="min-h-full bg-canvas">
      <nav className="flex items-center gap-6 border-b border-border bg-paper px-6 py-4 font-meta text-[12px]">
        <span className="font-bold tracking-tight text-ink">GoMummy</span>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setView('results-previews')}
            className={`font-pixel text-[11px] px-2 py-0.5 border ${
              view === 'results-previews'
                ? 'bg-[#ff2a8d] text-white border-black'
                : 'text-black border-[#e5e5e5] hover:border-black'
            }`}
          >
            ★ RESULTS (3 DIRS)
          </button>
          {['brief', 'results', 'shortlist', 'compare'].map((name) => (
            <button
              key={name}
              onClick={() => setView(name)}
              className={view === name ? 'font-semibold text-ink' : 'text-meta'}
            >
              {name}
              {name === 'shortlist' && shortlist.length > 0 ? ` (${shortlist.length})` : ''}
              {name === 'compare' && compareSel.length > 0 ? ` (${compareSel.length})` : ''}
            </button>
          ))}
          <button onClick={() => setQuestionsOpen(true)} className="text-meta">
            questions{Object.keys(answers).length > 0 ? ` (${Object.keys(answers).length})` : ''}
          </button>
        </div>
      </nav>

      {view === 'results-previews' && (
        <ResultsPreviewGallery
          brief={brief}
          results={results}
          filters={filters}
          onFiltersChange={setFilters}
          shortlist={shortlist}
          compareSel={compareSel}
          pendingQuestion={pendingQuestion !== null ? QUESTIONS[pendingQuestion] : null}
          onRegenerate={regenerate}
          onToggleShortlist={toggleShortlist}
          onToggleCompare={toggleCompare}
          onAnswerFollowUp={(value) => answerFollowUp(pendingQuestion, value)}
          onSkipFollowUp={skipFollowUp}
        />
      )}

      {view === 'brief' && (
        <Brief
          initial={brief}
          onFindNames={findNames}
          onOpenQuestions={() => setQuestionsOpen(true)}
        />
      )}

      {view === 'results' && (
        <Results
          brief={brief}
          results={results}
          filters={filters}
          onFiltersChange={setFilters}
          shortlist={shortlist}
          compareSel={compareSel}
          pendingQuestion={pendingQuestion !== null ? QUESTIONS[pendingQuestion] : null}
          onRegenerate={regenerate}
          onToggleShortlist={toggleShortlist}
          onToggleCompare={toggleCompare}
          onAnswerFollowUp={(value) => answerFollowUp(pendingQuestion, value)}
          onSkipFollowUp={skipFollowUp}
          onNavigateToBrief={() => setView('brief')}
        />
      )}
      {view === 'retro-previews' && (
        <RetroPreviewGallery
          onFindNames={(values) => {
            findNames(values)
            setView('results')
          }}
          onBackToApp={() => setView('brief')}
        />
      )}
      {view === 'shortlist' && (
        <Shortlist shortlist={shortlist} onRemove={toggleShortlist} onNavigate={setView} />
      )}
      {view === 'compare' && (
        <Compare compareSel={compareSel} onRemove={toggleCompare} onNavigate={setView} />
      )}

      {questionsOpen && (
        <QuestionsPanel answers={answers} onSave={saveAnswer} onClose={() => setQuestionsOpen(false)} />
      )}
    </div>
  )
}
