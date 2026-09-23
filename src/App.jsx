import { useState, useEffect, useRef } from 'react'
import Brief from './screens/Brief.jsx'
import Results from './screens/Results.jsx'
import Shortlist from './screens/Shortlist.jsx'
import Compare from './screens/Compare.jsx'
import QuestionsPanel from './screens/QuestionsPanel.jsx'
import { CANDIDATE_POOL, INITIAL_BRIEF, QUESTIONS, pickBatch, getTargetCard } from './data.js'
import { soundFX } from './utils/audio.js'

import RetroPreviewGallery from './components/pixel/RetroPreviewGallery.jsx'
import ResultsPreviewGallery from './components/results-dirs/ResultsPreviewGallery.jsx'
import ArcadeLab from './screens/ArcadeLab.jsx'
import CompareModal from './components/modals/CompareModal.jsx'
import ShortlistModal from './components/modals/ShortlistModal.jsx'

import { generateGeminiBrandNames, getGeminiKey } from './services/geminiService.js'
import { checkDomainAvailability, checkDomainsBatch } from './services/domainService.js'

const REGENS_BEFORE_QUESTION = 3

const HUNTER_RANKS = [
  { title: 'NOVICE SCOUT', minXp: 0, nextXp: 25 },
  { title: 'DOMAIN HUNTER', minXp: 25, nextXp: 60 },
  { title: 'BRAND ALCHEMIST', minXp: 60, nextXp: 100 },
  { title: 'TRADEMARK TITAN', minXp: 100, nextXp: Infinity },
]

function getHunterRank(xp) {
  if (xp >= 100) return HUNTER_RANKS[3]
  if (xp >= 60) return HUNTER_RANKS[2]
  if (xp >= 25) return HUNTER_RANKS[1]
  return HUNTER_RANKS[0]
}

export default function App() {
  const [view, setView] = useState(() => {
    if (typeof window !== 'undefined' && window.location.search.includes('view=results')) {
      return 'results'
    }
    return 'brief'
  })
  const [questionsOpen, setQuestionsOpen] = useState(false)

  const [brief, setBrief] = useState(INITIAL_BRIEF)
  const [targetCard, setTargetCard] = useState(() => getTargetCard(CANDIDATE_POOL, INITIAL_BRIEF))
  const [generation, setGeneration] = useState(0)
  const [results, setResults] = useState(() => pickBatch(CANDIDATE_POOL, [], INITIAL_BRIEF, 0))
  const [filters, setFilters] = useState({ tld: 'any', length: 'any' })
  const [shortlist, setShortlist] = useState([])
  const [compareSel, setCompareSel] = useState([])
  const [answers, setAnswers] = useState({})
  const [regenCount, setRegenCount] = useState(0)
  const [pendingQuestion, setPendingQuestion] = useState(null)
  const [apiNotice, setApiNotice] = useState(null)

  // Gamification: Audio state, Hunter XP, Card HOLD/LOCK
  const [soundMuted, setSoundMuted] = useState(() => soundFX.getMuted())
  const [xp, setXp] = useState(0)
  const hunterRank = getHunterRank(xp)
  const prevRankRef = useRef(hunterRank.title)
  const [levelUpToast, setLevelUpToast] = useState(null)
  const [lockedSlots, setLockedSlots] = useState(new Set())
  const isSearchingRef = useRef(false)

  // Modal overlays for Compare & Shortlist
  const [compareModalOpen, setCompareModalOpen] = useState(false)
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false)

  // Celebrate on rank advancement with guaranteed auto-dismiss timer
  useEffect(() => {
    if (hunterRank.title !== prevRankRef.current) {
      prevRankRef.current = hunterRank.title
      soundFX.playFanfare()
      setLevelUpToast(hunterRank)
      const timer = setTimeout(() => {
        setLevelUpToast(null)
      }, 3200)
      return () => clearTimeout(timer)
    }
  }, [hunterRank.title])

  const toggleSound = () => {
    const next = !soundMuted
    soundFX.setMuted(next)
    setSoundMuted(next)
    if (!next) soundFX.playCoin()
  }

  const addXp = (amount) => {
    setXp((prev) => Math.max(0, prev + amount))
  }

  const toggleLock = (slotIndex) => {
    setLockedSlots((prev) => {
      const next = new Set(prev)
      if (next.has(slotIndex)) next.delete(slotIndex)
      else next.add(slotIndex)
      return next
    })
  }

  const firstUnanswered = (a) => {
    const idx = QUESTIONS.findIndex((_, i) => !(a[i] || '').trim())
    return idx === -1 ? null : idx
  }

  // Real domain check runner for a set of candidate items
  const enrichWithRealDomainChecks = async (candidates, currentTarget) => {
    const domainsToCheck = []
    if (currentTarget) {
      domainsToCheck.push(`${currentTarget.domain}${currentTarget.tld}`)
    }
    for (const c of candidates) {
      domainsToCheck.push(`${c.domain}${c.tld}`)
    }

    const domainMap = await checkDomainsBatch(domainsToCheck)

    // Update target card state
    if (currentTarget) {
      const fullTarget = `${currentTarget.domain}${currentTarget.tld}`
      const targetState = domainMap[fullTarget] || 'unknown'
      setTargetCard((prev) => (prev ? { ...prev, state: targetState } : prev))
    }

    // Update candidates state
    setResults((prev) =>
      prev.map((item) => {
        const full = `${item.domain}${item.tld}`
        if (domainMap[full] && domainMap[full] !== 'unknown') {
          return { ...item, state: domainMap[full] }
        }
        return item
      })
    )
  }

  const findNames = async (values) => {
    if (isSearchingRef.current) return
    isSearchingRef.current = true

    setBrief(values)
    setGeneration(0)
    setLockedSlots(new Set())
    setFilters({ tld: 'any', length: 'any' })
    setRegenCount(0)
    setPendingQuestion(null)
    setApiNotice(null)
    soundFX.playSpin()

    const initialTarget = getTargetCard(CANDIDATE_POOL, values)
    const targetWithChecking = initialTarget ? { ...initialTarget, state: 'checking' } : null
    setTargetCard(targetWithChecking)

    // 1. INSTANT ZERO-LATENCY TRANSITION: Show tailored candidates and switch to Results immediately
    const immediateBatch = pickBatch(CANDIDATE_POOL, [], values, 0, answers).map((c) => ({
      ...c,
      state: 'checking',
    }))
    setResults(immediateBatch)
    setView('results')

    // 2. Immediately initiate live Google DoH check on subject & initial candidates
    enrichWithRealDomainChecks(immediateBatch, targetWithChecking)

    // 3. Concurrently fetch Gemini AI creative names in the background
    try {
      if (getGeminiKey()) {
        const aiCandidates = await generateGeminiBrandNames({ brief: values, generation: 0, answers })
        if (aiCandidates && aiCandidates.length >= 5) {
          const aiBatch = aiCandidates.slice(0, 5).map((c) => ({ ...c, state: 'checking' }))
          setResults(aiBatch)
          // Run live Google DoH check on newly arrived AI names
          await enrichWithRealDomainChecks(aiBatch, targetWithChecking)
        }
      }
    } catch (err) {
      console.warn('Gemini generation notice:', err)
      if (err.isDailyLimit || err.status === 429) {
        setApiNotice({
          isDailyLimit: true,
          message: 'Daily Gemini API limit reached (429: Quota Exhausted). Showing local candidates.',
          suggestion: 'Daily rate limit reached. The free tier quota resets daily.',
        })
      }
    } finally {
      isSearchingRef.current = false
    }
  }

  const regenerate = async () => {
    if (pendingQuestion !== null) return
    if (lockedSlots.size === 5) return // all locked

    soundFX.playSpin()
    const nextGen = generation + 1
    setGeneration(nextGen)

    // 1. INSTANT ZERO-LATENCY ROLL (0ms): Populate fresh candidates derived from brief immediately
    const freshCandidates = pickBatch(
      CANDIDATE_POOL,
      results.map((r) => r.domain),
      brief,
      nextGen,
      answers
    ).map((c) => ({ ...c, state: 'checking' }))

    // Preserve locked slots strictly in place, replace unlocked slots instantly
    const updatedBatch = results.map((oldCard, idx) =>
      lockedSlots.has(idx) ? oldCard : freshCandidates[idx] || oldCard
    )
    setResults(updatedBatch)

    // 2. INSTANT LIVE DOMAIN CHECK: Check newly spawned unlocked candidates with Google DoH (~100ms)
    const unlockedToCheck = updatedBatch.filter((_, idx) => !lockedSlots.has(idx))
    enrichWithRealDomainChecks(unlockedToCheck, null)

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

    // 3. NON-BLOCKING BACKGROUND AI: Fetch creative names in background without stalling UI
    if (getGeminiKey()) {
      generateGeminiBrandNames({ brief, generation: nextGen, answers })
        .then((aiCandidates) => {
          if (aiCandidates && aiCandidates.length >= 5) {
            setResults((current) => {
              const enriched = current.map((oldCard, idx) =>
                lockedSlots.has(idx) ? oldCard : aiCandidates[idx] || oldCard
              )
              const newlyAdded = enriched.filter((_, idx) => !lockedSlots.has(idx))
              enrichWithRealDomainChecks(newlyAdded, null)
              return enriched
            })
          }
        })
        .catch((err) => {
          console.warn('Gemini background enrichment notice on regenerate:', err)
          if (err.isDailyLimit || err.status === 429) {
            setApiNotice({
              isDailyLimit: true,
              message: 'Daily Gemini API limit reached (429: Quota Exhausted). Showing local candidates.',
              suggestion: 'Daily rate limit reached. The free tier quota resets daily.',
            })
          }
        })
    }
  }

  // Keyboard shortcut: Pressing 'r' or 'R' regenerates when viewing results
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'r' || e.key === 'R') {
        const tag = document.activeElement?.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA') return
        if (view === 'results' && pendingQuestion === null && lockedSlots.size < 5) {
          e.preventDefault()
          regenerate()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [view, pendingQuestion, brief, lockedSlots, results])

  const registerSelection = () => setRegenCount(0)

  const toggleShortlist = (item) => {
    registerSelection()
    const isSaved = shortlist.some((s) => s.domain === item.domain)
    if (isSaved) {
      addXp(-10)
      setShortlist((list) => list.filter((s) => s.domain !== item.domain))
    } else {
      addXp(10)
      setShortlist((list) => [...list, item])
    }
  }

  const toggleCompare = (item) => {
    registerSelection()
    if (soundFX) soundFX.playLock()
    setCompareSel((sel) => {
      if (sel.some((s) => s.domain === item.domain)) return sel.filter((s) => s.domain !== item.domain)
      if (sel.length < 2) return [...sel, item]
      return [sel[1], item]
    })
  }

  const saveAnswer = (index, value) => {
    setAnswers((a) => ({ ...a, [index]: value }))
    addXp(5)
  }

  const answerFollowUp = (index, value) => {
    const nextAnswers = { ...answers, [index]: value }
    setAnswers(nextAnswers)
    setPendingQuestion(null)
    addXp(5)
    soundFX.playSpin()
    const nextGen = generation + 1
    setGeneration(nextGen)
    const freshPool = pickBatch(CANDIDATE_POOL, results.map((r) => r.domain), brief, nextGen, nextAnswers)
    setResults((prev) =>
      prev.map((oldCard, idx) => (lockedSlots.has(idx) ? oldCard : freshPool[idx] || oldCard))
    )
  }

  const skipFollowUp = () => setPendingQuestion(null)

  return (
    <div className="min-h-full bg-canvas">
      {/* GLOBAL TOP NAVIGATION */}
      <nav className="flex items-center justify-between border-b-2 border-black bg-white px-4 sm:px-6 py-3 font-meta text-[12px] shadow-[0_2px_0px_0px_#000]">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={() => setView('brief')}
            className="font-pixel text-[13px] tracking-tight text-ink hover:text-[#ff2a8d] transition-colors cursor-pointer"
          >
            GOMUMMY
          </button>
          <div className="flex flex-wrap gap-2 sm:gap-2.5 items-center">
            {/* 01 BRIEF */}
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                setView('brief')
                setCompareModalOpen(false)
                setShortlistModalOpen(false)
              }}
              className={`font-pixel text-[10px] sm:text-[11px] px-3 py-1 border-2 transition-all pixel-btn cursor-pointer ${
                view === 'brief' && !compareModalOpen && !shortlistModalOpen
                  ? 'bg-[#ff2a8d] text-white border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-[#faf8f5] text-black border-black hover:bg-black hover:text-white'
              }`}
            >
              01 BRIEF
            </button>

            {/* 02 RESULTS */}
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                setView('results')
                setCompareModalOpen(false)
                setShortlistModalOpen(false)
              }}
              className={`font-pixel text-[10px] sm:text-[11px] px-3 py-1 border-2 transition-all pixel-btn cursor-pointer ${
                view === 'results' && !compareModalOpen && !shortlistModalOpen
                  ? 'bg-[#ff2a8d] text-white border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-[#faf8f5] text-black border-black hover:bg-black hover:text-white'
              }`}
            >
              02 RESULTS
            </button>

            {/* SHORTLIST (POP-UP MODAL) */}
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                setShortlistModalOpen(true)
              }}
              className={`font-pixel text-[10px] sm:text-[11px] px-3 py-1 border-2 transition-all pixel-btn cursor-pointer flex items-center gap-1.5 ${
                shortlistModalOpen
                  ? 'bg-[#ff2a8d] text-white border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-[#faf8f5] text-black border-black hover:bg-black hover:text-white'
              }`}
            >
              <span>★ SHORTLIST</span>
              {shortlist.length > 0 && (
                <span className={`px-1.5 py-0.2 text-[9px] font-bold ${shortlistModalOpen ? 'bg-black text-white' : 'bg-[#ff2a8d] text-white'}`}>
                  {shortlist.length}
                </span>
              )}
            </button>

            {/* COMPARE (POP-UP MODAL) */}
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                setCompareModalOpen(true)
              }}
              className={`font-pixel text-[10px] sm:text-[11px] px-3 py-1 border-2 transition-all pixel-btn cursor-pointer flex items-center gap-1.5 ${
                compareModalOpen
                  ? 'bg-[#ff2a8d] text-white border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-[#faf8f5] text-black border-black hover:bg-black hover:text-white'
              }`}
            >
              <span>VS COMPARE</span>
              {compareSel.length > 0 && (
                <span className={`px-1.5 py-0.2 text-[9px] font-bold ${compareModalOpen ? 'bg-black text-white' : 'bg-black text-white'}`}>
                  {compareSel.length}/2
                </span>
              )}
            </button>

            {/* QUESTIONS PANEL */}
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                setQuestionsOpen(true)
              }}
              className={`font-pixel text-[10px] sm:text-[11px] px-3 py-1 border-2 transition-all pixel-btn cursor-pointer flex items-center gap-1.5 ${
                questionsOpen
                  ? 'bg-[#ff2a8d] text-white border-black shadow-[2px_2px_0px_0px_#000]'
                  : 'bg-[#faf8f5] text-black border-black hover:bg-black hover:text-white'
              }`}
            >
              <span>? QUESTIONS</span>
              {Object.keys(answers).length > 0 && (
                <span className="bg-black text-white px-1.5 py-0.2 text-[9px] font-bold">
                  {Object.keys(answers).length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Global Controls & Gamified Hunter Stats Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Global Sound FX Toggle */}
          <button
            type="button"
            onClick={toggleSound}
            title={soundMuted ? 'Turn Sound ON' : 'Mute Sound'}
            className={`flex items-center gap-1 border-2 border-black px-2.5 py-1 font-pixel text-[10px] transition-all pixel-btn cursor-pointer ${
              soundMuted ? 'bg-[#cac4d0] text-[#737373]' : 'bg-[#22c55e] text-black font-bold'
            }`}
          >
            <span>{soundMuted ? '🔇 SFX: OFF' : '🔊 SFX: ON'}</span>
          </button>

          {/* Hunter Stats Meter */}
          <div className="hidden md:flex items-center gap-1.5 border-2 border-black bg-[#faf8f5] px-2.5 py-1 font-pixel text-[10px] shadow-[2px_2px_0px_0px_#000]">
            <span className="text-[#ff2a8d]">RANK:</span>
            <span className="bg-black text-white px-1.5 py-0.5">{hunterRank.title}</span>
            <span className="bg-[#ff2a8d] text-white px-1.5 py-0.5">★ {xp} XP</span>
            <span className="bg-white text-black border border-black px-1 py-0.5 font-mono text-[10px] font-bold">
              ROLL #{generation}
            </span>
          </div>
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
          soundFX={soundFX}
          xp={xp}
          hunterRank={hunterRank}
        />
      )}

      {view === 'results' && (
        <Results
          brief={brief}
          targetCard={targetCard}
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
          soundFX={soundFX}
          xp={xp}
          hunterRank={hunterRank}
          lockedSlots={lockedSlots}
          onToggleLock={toggleLock}
          levelUpToast={levelUpToast}
          onDismissToast={() => setLevelUpToast(null)}
          apiNotice={apiNotice}
          onDismissNotice={() => setApiNotice(null)}
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
      {view === 'arcade-lab' && (
        <ArcadeLab onBackToApp={() => setView('results')} />
      )}
      {/* Animated Pop-Up Modals */}
      {compareModalOpen && (
        <CompareModal
          compareSel={compareSel}
          shortlist={shortlist}
          onRemove={toggleCompare}
          onToggleShortlist={toggleShortlist}
          onClose={() => setCompareModalOpen(false)}
          soundFX={soundFX}
        />
      )}

      {shortlistModalOpen && (
        <ShortlistModal
          shortlist={shortlist}
          onRemove={toggleShortlist}
          onClose={() => setShortlistModalOpen(false)}
          soundFX={soundFX}
        />
      )}

      {questionsOpen && (
        <QuestionsPanel answers={answers} onSave={saveAnswer} onClose={() => setQuestionsOpen(false)} />
      )}
    </div>
  )
}
