// Native Web Audio API 8-Bit Retro Sound Effects Engine
// Generates authentic arcade synthesizer bleeps, pings, and fanfares
// Zero external audio files or network requests required.

class RetroAudioEngine {
  constructor() {
    this.ctx = null
    this.isMuted = false
    this.profile = 'relay' // 'relay' | 'synth' | 'tape'
  }

  setProfile(profile) {
    if (['relay', 'synth', 'tape'].includes(profile)) {
      this.profile = profile
    }
  }

  getProfile() {
    return this.profile
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setMuted(muted) {
    this.isMuted = muted
    if (muted) {
      this.stopAmbientLoop()
    } else {
      this.init()
      this.startAmbientLoop()
    }
  }

  getMuted() {
    return this.isMuted
  }

  // Soothing procedural 8-bit ambient background chirp
  playSoftChirp() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const baseFreq = 1600 + Math.random() * 500
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(baseFreq, now)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.35, now + 0.08)
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.95, now + 0.16)

    gain.gain.setValueAtTime(0.025, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.22)

    if (Math.random() > 0.4) {
      setTimeout(() => {
        if (this.isMuted || !this.ctx) return
        const echoTime = this.ctx.currentTime
        const osc2 = this.ctx.createOscillator()
        const gain2 = this.ctx.createGain()
        osc2.type = 'triangle'
        osc2.frequency.setValueAtTime(baseFreq * 1.25, echoTime)
        osc2.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, echoTime + 0.07)
        gain2.gain.setValueAtTime(0.018, echoTime)
        gain2.gain.exponentialRampToValueAtTime(0.001, echoTime + 0.15)
        osc2.connect(gain2)
        gain2.connect(this.ctx.destination)
        osc2.start(echoTime)
        osc2.stop(echoTime + 0.15)
      }, 130)
    }
  }

  startAmbientLoop() {
    this.stopAmbientLoop()
    if (this.isMuted) return

    const scheduleNext = () => {
      const delay = 7000 + Math.random() * 7000
      this.ambientTimer = setTimeout(() => {
        this.playSoftChirp()
        scheduleNext()
      }, delay)
    }
    scheduleNext()
  }

  stopAmbientLoop() {
    if (this.ambientTimer) {
      clearTimeout(this.ambientTimer)
      this.ambientTimer = null
    }
  }

  // Rapid slot-machine spin chirp
  playSpin() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99]

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, now + i * 0.04)

      gain.gain.setValueAtTime(0.08, now + i * 0.04)
      gain.gain.exponentialRampToValueAtTime(0.001, now + (i + 1) * 0.04)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now + i * 0.04)
      osc.stop(now + (i + 1) * 0.04)
    })
  }

  // Classic high-pitched coin / star collect chime
  playCoin() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    // Note 1: B5
    const osc1 = this.ctx.createOscillator()
    const gain1 = this.ctx.createGain()
    osc1.type = 'square'
    osc1.frequency.setValueAtTime(987.77, now)
    gain1.gain.setValueAtTime(0.12, now)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08)
    osc1.connect(gain1)
    gain1.connect(this.ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.08)

    // Note 2: E6
    const osc2 = this.ctx.createOscillator()
    const gain2 = this.ctx.createGain()
    osc2.type = 'square'
    osc2.frequency.setValueAtTime(1318.51, now + 0.08)
    gain2.gain.setValueAtTime(0.14, now + 0.08)
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
    osc2.connect(gain2)
    gain2.connect(this.ctx.destination)
    osc2.start(now + 0.08)
    osc2.stop(now + 0.35)
  }

  // Mechanical latch lock click
  playLock() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(160, now)
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.06)

    gain.gain.setValueAtTime(0.2, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.06)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.06)
  }

  // Mechanical latch release
  playUnlock() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'triangle'
    osc.frequency.setValueAtTime(240, now)
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.07)

    gain.gain.setValueAtTime(0.15, now)
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.07)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.07)
  }

  // Available domain chime
  playAvailable() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, now) // D5
    osc.frequency.setValueAtTime(880.0, now + 0.06) // A5

    gain.gain.setValueAtTime(0.12, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.25)
  }

  // Taken domain buzz
  playTaken() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    osc.type = 'sawtooth'
    osc.frequency.setValueAtTime(110, now)

    gain.gain.setValueAtTime(0.07, now)
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)

    osc.connect(gain)
    gain.connect(this.ctx.destination)

    osc.start(now)
    osc.stop(now + 0.12)
  }

  // Triumphant level-up / achievement fanfare
  playFanfare() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const chord = [523.25, 659.25, 783.99, 1046.5] // C5, E5, G5, C6

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()

      osc.type = 'square'
      osc.frequency.setValueAtTime(freq, now + idx * 0.08)

      gain.gain.setValueAtTime(0.1, now + idx * 0.08)
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.3)

      osc.connect(gain)
      gain.connect(this.ctx.destination)

      osc.start(now + idx * 0.08)
      osc.stop(now + idx * 0.08 + 0.3)
    })
  }

  // Tactile rotary knob step tick (Profile-specific acoustic texture)
  playTick() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    if (this.profile === 'synth') {
      // Warm analog sine chirp with subtle harmonic
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(880, now)
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.035)

      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.035)
    } else if (this.profile === 'tape') {
      // Mechanical ratchet cassette reel detent
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(560, now)
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.025)

      gain.gain.setValueAtTime(0.09, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.025)
    } else {
      // Default: RELAY (Crisp high-speed industrial microswitch transient)
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(1400, now)
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.022)

      gain.gain.setValueAtTime(0.12, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.022)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.022)
    }
  }

  // Tactile mechanical keycap depression thud (Profile-specific acoustic texture)
  playKeyThud() {
    if (this.isMuted) return
    this.init()
    if (!this.ctx) return

    const now = this.ctx.currentTime

    if (this.profile === 'synth') {
      // Warm resonant analog filter drop
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(280, now)
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.06)

      gain.gain.setValueAtTime(0.15, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.06)
    } else if (this.profile === 'tape') {
      // Heavy cassette transport solenoid latch clunk
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(130, now)
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.07)

      gain.gain.setValueAtTime(0.2, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.07)
    } else {
      // Default: RELAY (Heavy solid keycap bottom-out thud)
      const osc = this.ctx.createOscillator()
      const gain = this.ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(190, now)
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.05)

      gain.gain.setValueAtTime(0.18, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)

      osc.connect(gain)
      gain.connect(this.ctx.destination)
      osc.start(now)
      osc.stop(now + 0.05)
    }
  }
}

export const soundFX = new RetroAudioEngine()
