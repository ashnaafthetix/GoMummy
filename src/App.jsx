import { useState, useEffect, useRef } from 'react'
import Brief from './screens/Brief.jsx'
import TactileBriefConsole from './screens/TactileBriefConsole.jsx'
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
import TerminalFrame from './components/terminal/TerminalFrame.jsx'
import IdentityViewfinder from './components/hardware/IdentityViewfinder.jsx'

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
  const [briefStep, setBriefStep] = useState('input') // 'input' | 'flavor'

  const [brief, setBrief] = useState(INITIAL_BRIEF)
  const [targetCard, setTargetCard] = useState(() => getTargetCard(CANDIDATE_POOL, INITIAL_BRIEF))
  const [generation, setGeneration] = useState(0)
  const [results, setResults] = useState(() => pickBatch(CANDIDATE_POOL, [], INITIAL_BRIEF, 0))
  const [batchHistory, setBatchHistory] = useState(() => [pickBatch(CANDIDATE_POOL, [], INITIAL_BRIEF, 0)])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [filters, setFilters] = useState({ tld: 'any', length: 'any' })
  const [shortlist, setShortlist] = useState([])
  const [compareSel, setCompareSel] = useState([])
  const [answers, setAnswers] = useState({})
  const [regenCount, setRegenCount] = useState(0)
  const [pendingQuestion, setPendingQuestion] = useState(null)
  const [apiNotice, setApiNotice] = useState(null)

  // Gamification: Audio state, Hunter XP, Card HOLD/LOCK
  const [soundMuted, setSoundMuted] = useState(() => soundFX.getMuted())
  const [soundProfile, setSoundProfile] = useState(() => soundFX.getProfile())
  const [xp, setXp] = useState(0)
  const hunterRank = getHunterRank(xp)
  const prevRankRef = useRef(hunterRank.title)
  const [levelUpToast, setLevelUpToast] = useState(null)
  const [lockedSlots, setLockedSlots] = useState(new Set())
  const isSearchingRef = useRef(false)

  // Modal overlays for Compare & Shortlist
  const [compareModalOpen, setCompareModalOpen] = useState(false)
  const [shortlistModalOpen, setShortlistModalOpen] = useState(false)
  const [viewfinderCard, setViewfinderCard] = useState(null)

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

  const cycleSoundProfile = () => {
    if (soundMuted) {
      soundFX.setMuted(false)
      setSoundMuted(false)
      soundFX.playCoin()
      return
    }
    const profiles = ['relay', 'synth', 'tape']
    const nextIdx = (profiles.indexOf(soundProfile) + 1) % profiles.length
    const nextProf = profiles[nextIdx]
    soundFX.setProfile(nextProf)
    setSoundProfile(nextProf)
    soundFX.playTick()
  }

  // Ambient soft retro chirp loop - activates when sound is enabled
  useEffect(() => {
    if (!soundMuted) {
      soundFX.startAmbientLoop()
    } else {
      soundFX.stopAmbientLoop()
    }
    return () => {
      soundFX.stopAmbientLoop()
    }
  }, [soundMuted])

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
    setBatchHistory([immediateBatch])
    setHistoryIndex(0)
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
          setBatchHistory((prev) => {
            const copy = [...prev]
            copy[0] = aiBatch
            return copy
          })
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
    setBatchHistory((prev) => {
      const nextHistory = [...prev.slice(0, historyIndex + 1), updatedBatch]
      return nextHistory
    })
    setHistoryIndex((prev) => prev + 1)

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
              setBatchHistory((prev) => {
                const copy = [...prev]
                copy[copy.length - 1] = enriched
                return copy
              })
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

  // Session Tape Deck History Scrub Handlers
  const handleRewindBatch = () => {
    if (historyIndex > 0) {
      const targetIdx = historyIndex - 1
      setHistoryIndex(targetIdx)
      const pastBatch = batchHistory[targetIdx] || []
      const merged = pastBatch.map((card, i) => (lockedSlots.has(i) ? results[i] : card))
      setResults(merged)
      enrichWithRealDomainChecks(merged, targetCard)
      if (soundFX) soundFX.playTick()
    }
  }

  const handleForwardBatch = () => {
    if (historyIndex < batchHistory.length - 1) {
      const targetIdx = historyIndex + 1
      setHistoryIndex(targetIdx)
      const forwardBatch = batchHistory[targetIdx] || []
      const merged = forwardBatch.map((card, i) => (lockedSlots.has(i) ? results[i] : card))
      setResults(merged)
      enrichWithRealDomainChecks(merged, targetCard)
      if (soundFX) soundFX.playTick()
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
    <TerminalFrame
      currentView={view}
      onViewChange={(newView) => {
        if (soundFX) soundFX.playLock()
        setView(newView)
        setCompareModalOpen(false)
        setShortlistModalOpen(false)
        if (newView === 'brief') setBriefStep('input')
      }}
      soundMuted={soundMuted}
      onToggleSound={toggleSound}
      soundProfile={soundProfile}
      onCycleSoundProfile={cycleSoundProfile}
      hunterRank={hunterRank}
      xp={xp}
      shortlistCount={shortlist.length}
      compareCount={compareSel.length}
      questionsCount={Object.keys(answers).length}
      onOpenShortlist={() => {
        if (soundFX) soundFX.playLock()
        setShortlistModalOpen(true)
      }}
      onOpenCompare={() => {
        if (soundFX) soundFX.playLock()
        setCompareModalOpen(true)
      }}
      onOpenQuestions={() => {
        if (soundFX) soundFX.playLock()
        setQuestionsOpen(true)
      }}
      briefStep={briefStep}
      onBriefStepChange={setBriefStep}
      onFindNames={() => findNames(brief)}
      onRegenerate={regenerate}
      canSubmit={Boolean(brief.name?.trim() || brief.description?.trim())}
      isSearching={isSearchingRef.current}
    >
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
        <TactileBriefConsole
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
          historyIndex={historyIndex}
          totalBatches={Math.max(1, batchHistory.length)}
          onRewindBatch={handleRewindBatch}
          onForwardBatch={handleForwardBatch}
          onOpenViewfinder={setViewfinderCard}
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
      {/* Animated Pop-Up Modals & Docked Trays */}
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

      {/* Real-World Identity Scope Viewfinder */}
      {viewfinderCard && (
        <IdentityViewfinder
          card={viewfinderCard}
          onClose={() => setViewfinderCard(null)}
          onToggleShortlist={toggleShortlist}
          isShortlisted={shortlist.some((s) => s.domain === viewfinderCard.domain)}
          soundFX={soundFX}
        />
      )}

      {questionsOpen && (
        <QuestionsPanel
          answers={answers}
          onSave={saveAnswer}
          onClose={() => setQuestionsOpen(false)}
          soundFX={soundFX}
        />
      )}

      {/* Persistent Docked Hardware Quick Latch Bar (when trays are closed and items exist) */}
      {!compareModalOpen && !shortlistModalOpen && !viewfinderCard && !questionsOpen && (shortlist.length > 0 || compareSel.length > 0) && (
        <div className="fixed bottom-4 right-4 sm:right-8 z-40 flex items-center gap-2 font-mono hardware-tray-slide-up">
          {shortlist.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                setShortlistModalOpen(true)
              }}
              className="tactile-chiclet px-3.5 py-2 rounded-xl text-neutral-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xl border border-amber-400 bg-white hover:border-black active:translate-y-0.5"
              title="Open docked shortlist portfolio tray"
            >
              <span className="text-amber-500">⭐</span>
              <span>SHORTLIST</span>
              <span className="px-1.5 py-0.2 bg-amber-400 text-black font-black text-[10px] rounded-full">
                {shortlist.length}
              </span>
            </button>
          )}

          {compareSel.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (soundFX) soundFX.playLock()
                setCompareModalOpen(true)
              }}
              className="tactile-chiclet px-3.5 py-2 rounded-xl text-neutral-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xl border border-neutral-300 bg-white hover:border-black active:translate-y-0.5"
              title="Open docked dual compare tray"
            >
              <span>⚖️</span>
              <span>COMPARE</span>
              <span className="px-1.5 py-0.2 bg-black text-white font-black text-[10px] rounded-full">
                {compareSel.length}
              </span>
            </button>
          )}
        </div>
      )}
    </TerminalFrame>
  )
}
