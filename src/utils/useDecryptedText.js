import { useState, useEffect } from 'react'

const GLYPHS = '0123456789ABCDEF$#@*!%&?><~_/'

/**
 * useDecryptedText
 * Simulates a retro cyberpunk/arcade letter scramble decryption effect.
 * When targetText changes or triggerKey is incremented, cycles through glyphs for ~280ms
 * before snapping neatly into targetText.
 */
export function useDecryptedText(targetText = '', triggerKey = 0, enabled = true) {
  const [displayText, setDisplayText] = useState(targetText)

  useEffect(() => {
    if (!enabled || !targetText) {
      setDisplayText(targetText)
      return
    }

    let frame = 0
    const totalFrames = 10
    const interval = setInterval(() => {
      frame++
      const progress = frame / totalFrames
      const revealedLength = Math.floor(progress * targetText.length)

      const scrambled = targetText
        .split('')
        .map((char, idx) => {
          if (char === ' ') return ' '
          if (idx < revealedLength) return char
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        })
        .join('')

      setDisplayText(scrambled)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setDisplayText(targetText)
      }
    }, 28)

    return () => clearInterval(interval)
  }, [targetText, triggerKey, enabled])

  return displayText
}
