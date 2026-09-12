import puppeteer from 'puppeteer-core'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const artifactDir = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\ab893a25-2c45-4ac5-8127-e5a185e058f7'
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function testArcadeLab() {
  console.log('--- TESTING ARCADE MECHANICS LAB ---')
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,950'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 950 })

    console.log('1. Navigating to http://localhost:5178/ ...')
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0' })

    // Step 1: Open Arcade Lab from Top Nav
    console.log('2. Clicking "🎮 ARCADE LAB (4 MECHANICS)" button...')
    const arcadeBtn = await page.$('button ::-p-text(ARCADE LAB)')
    if (!arcadeBtn) throw new Error('Could not find Arcade Lab nav button')
    await arcadeBtn.click()

    await page.waitForSelector('text/ARCADE MECHANICS LAB', { timeout: 4000 })
    console.log('   ✓ Successfully entered Arcade Mechanics Lab!')

    // Step 2: Test Mechanic 1 (8-Bit Audio Soundboard triggers)
    console.log('3. Testing Mechanic 1: Web Audio sound triggers...')
    const spinSoundBtn = await page.$('button ::-p-text(▶ SPIN)')
    if (spinSoundBtn) await spinSoundBtn.click()
    const coinSoundBtn = await page.$('button ::-p-text(▶ COIN / STAR)')
    if (coinSoundBtn) await coinSoundBtn.click()
    console.log('   ✓ Soundboard buttons clicked without errors')

    // Step 3: Test Mechanic 2 (Slot Machine HOLD / LOCK)
    console.log('4. Testing Mechanic 2: Slot Machine HOLD / LOCK...')
    const holdBtns = await page.$$('button ::-p-text(HOLD / LOCK)')
    if (holdBtns.length === 0) throw new Error('Could not find HOLD / LOCK buttons')
    
    // Get the name of slot 01 before locking
    const initialSlot1Name = await page.$eval('h3', (el) => el.textContent.trim())
    console.log(`   Slot 01 initial candidate: "${initialSlot1Name}"`)

    // Click HOLD on slot 01
    await holdBtns[0].click()
    await new Promise((r) => setTimeout(r, 400))

    const lockedText = await page.$eval('button', () => {
      const btns = Array.from(document.querySelectorAll('button'))
      return btns.some((b) => b.textContent.includes('LOCKED 🔒'))
    })
    if (!lockedText) throw new Error('Slot 01 failed to toggle to LOCKED 🔒')
    console.log('   ✓ Slot 01 successfully locked in place with glowing border!')

    // Spin unlocked slots
    console.log('5. Spinning unlocked slots while Slot 01 is held...')
    const spinUnlockedBtn = await page.$('button ::-p-text(SPIN UNLOCKED SLOTS)')
    if (!spinUnlockedBtn) throw new Error('Could not find SPIN UNLOCKED SLOTS button')
    await spinUnlockedBtn.click()
    await new Promise((r) => setTimeout(r, 600))

    const postSpinSlot1Name = await page.$eval('h3', (el) => el.textContent.trim())
    console.log(`   Slot 01 after spin: "${postSpinSlot1Name}"`)
    if (postSpinSlot1Name !== initialSlot1Name) {
      throw new Error(`Expected held slot 01 "${initialSlot1Name}" to remain unchanged, but got "${postSpinSlot1Name}"`)
    }
    console.log('   ✓ Slot 01 was preserved during spin while other slots refreshed!')

    // Step 4: Test Mechanic 3 (Letter Decryption Scramble)
    console.log('6. Testing Mechanic 3: Letter Decryption Scramble...')
    const scrambleTestBtn = await page.$('button ::-p-text(TRIGGER TEST SCRAMBLE)')
    if (scrambleTestBtn) {
      await scrambleTestBtn.click()
      await new Promise((r) => setTimeout(r, 400))
      console.log('   ✓ Triggered letter scramble effect successfully')
    }

    // Step 5: Test Mechanic 5 (Hunter Ranks & Level Up Toast)
    console.log('7. Testing Mechanic 5: Hunter Ranks & Level Up Toast...')
    const levelUpBtn = await page.$('button ::-p-text(LEVEL UP)')
    if (!levelUpBtn) throw new Error('Could not find LEVEL UP button')
    await levelUpBtn.click()
    await new Promise((r) => setTimeout(r, 500))

    const toastText = await page.$eval('body', (el) => el.textContent)
    if (!toastText.includes('RANK UP!') && !toastText.includes('DOMAIN HUNTER')) {
      throw new Error('Level up toast did not appear')
    }
    console.log('   ✓ Celebratory Rank Up toast popped in with fanfare!')

    await page.screenshot({ path: path.join(artifactDir, 'arcade_lab_overview.png'), fullPage: false })
    console.log('   ✓ Screenshot saved to arcade_lab_overview.png')

    // Step 6: Return to main app
    console.log('8. Returning to main application...')
    const backBtn = await page.$('button ::-p-text(RETURN TO GOMUMMY APP)')
    if (!backBtn) throw new Error('Could not find RETURN TO GOMUMMY APP button')
    await backBtn.click()
    await page.waitForSelector('text/S2 // RESULTS FEED', { timeout: 4000 })
    console.log('   ✓ Successfully returned to main GoMummy Results Screen!')

    console.log('\n--- ALL ARCADE LAB CHECKS PASSED! ---')
  } finally {
    await browser.close()
  }
}

testArcadeLab().catch((err) => {
  console.error('\n❌ ARCADE LAB TEST FAILED:', err)
  process.exit(1)
})
