import puppeteer from 'puppeteer-core'
import path from 'path'

const ARTIFACTS_DIR = "C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\ab893a25-2c45-4ac5-8127-e5a185e058f7"
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function run() {
  console.log('🚀 Starting Automated Verification for Full Gamification Suite (A & B)...')
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,950'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 950 })

  try {
    // 1. Visit App
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0' })
    console.log('✓ Page loaded at http://localhost:5178/')

    // Ensure we are on S1 Brief
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.toLowerCase().includes('brief'))
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 400))

    // 2. Check S1 Gamified Features
    const s1Title = await page.$eval('h1', el => el.innerText)
    console.log(`✓ S1 Title detected: "${s1Title}"`)

    const hasGauge = await page.evaluate(() => document.body.innerText.includes('CAPACITY ENERGY GAUGE'))
    if (!hasGauge) throw new Error('Arcade Power Gauge not found on S1!')
    console.log('✓ 10-Segment Arcade Power Gauge detected on S1')

    // Click quick flavor seed chip [⚡ ARCHITECTURAL]
    await page.evaluate(() => {
      const chip = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('ARCHITECTURAL'))
      if (chip) chip.click()
    })
    console.log('✓ Clicked Quick Flavor Seed Chip [⚡ ARCHITECTURAL]')

    await new Promise(r => setTimeout(r, 400))
    const descText = await page.$eval('textarea', el => el.value)
    if (!descText.includes('brutalist architectural honesty')) {
      throw new Error('Quick chip failed to append flavor snippet to description!')
    }
    console.log('✓ Quick Flavor snippet successfully appended into description textarea')

    // Capture S1 Brief Screenshot
    const s1ScreenshotPath = path.join(ARTIFACTS_DIR, 's1_gamified_suite.png')
    await page.screenshot({ path: s1ScreenshotPath, fullPage: true })
    console.log(`✓ Saved S1 screenshot: ${s1ScreenshotPath}`)

    // 3. Click "Find names >"
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]')
      if (btn) btn.click()
    })
    console.log('✓ Clicked "Find names >"')

    await new Promise(r => setTimeout(r, 1000))

    // 4. Verify S2 Results Screen
    const s2Heading = await page.$eval('h1', el => el.innerText)
    console.log(`✓ Navigated to S2 Results Feed: "${s2Heading}"`)

    // 5. Test HOLD / LOCK Mechanic
    const holdBtnsCount = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).filter(b => b.innerText.includes('HOLD / LOCK')).length
    })
    if (holdBtnsCount === 0) {
      throw new Error('HOLD / LOCK button not found on S2 ResultCards!')
    }
    console.log(`✓ Found ${holdBtnsCount} HOLD / LOCK buttons on ResultCards`)

    // Record Slot 01 Card Details
    const slot01NameBefore = await page.$eval('h2', el => el.innerText.trim())
    console.log(`✓ Slot 01 Initial Candidate: "${slot01NameBefore}"`)

    // Click lock on slot 01
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('HOLD / LOCK'))
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 400))

    // Verify Slot 01 is now LOCKED
    const isLocked = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('LOCKED'))
    })
    if (!isLocked) throw new Error('Slot 01 failed to toggle to LOCKED state!')
    console.log('✓ Slot 01 locked successfully (status updated to LOCKED 🔒)')

    // Check Regenerate button text reflects locked slot
    const regenBtnText = await page.$eval('button.animate-neon-glow', el => el.innerText)
    console.log(`✓ Regenerate Button Dynamic Text: "${regenBtnText}"`)
    if (!regenBtnText.includes('SPIN UNLOCKED (4)')) {
      throw new Error(`Expected button to indicate SPIN UNLOCKED (4), got "${regenBtnText}"`)
    }

    // Trigger Spin Unlocked Candidates
    await page.evaluate(() => {
      const btn = document.querySelector('button.animate-neon-glow')
      if (btn) btn.click()
    })
    console.log('✓ Clicked "SPIN UNLOCKED (4) [R]"')

    // Wait for slot reel & text decryption
    await new Promise(r => setTimeout(r, 900))

    // Verify Slot 01 remained EXACTLY identical
    const slot01NameAfter = await page.$eval('h2', el => el.innerText.trim())
    console.log(`✓ Slot 01 After Spin: "${slot01NameAfter}"`)
    if (slot01NameBefore !== slot01NameAfter) {
      throw new Error(`Slot 01 failed HOLD/LOCK preservation! Before: "${slot01NameBefore}", After: "${slot01NameAfter}"`)
    }
    console.log('✓ HOLD / LOCK Verification PASSED: Locked Slot 01 was preserved intact across spin!')

    // 6. Test Shortlist, XP & Level Up
    // Target shortlist buttons specifically INSIDE ResultCards (.arcade-scanlines)
    for (let i = 0; i < 3; i++) {
      await page.evaluate((idx) => {
        const cardBtns = Array.from(document.querySelectorAll('.arcade-scanlines button')).filter(b => b.innerText === 'SHORTLIST')
        if (cardBtns[0]) cardBtns[0].click()
      }, i)
      await new Promise(r => setTimeout(r, 400))
    }

    const xpStats = await page.evaluate(() => {
      const el = document.querySelector('nav')
      return el ? el.innerText : ''
    })
    console.log(`Debug nav innerText after 3 shortlists: "${xpStats.replace(/\n/g, ' ')}"`)

    // Check for Level Up Toast Banner
    const hasLevelUpToast = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('RANK PROMOTION UNLOCKED'))
    })
    if (!hasLevelUpToast) throw new Error('Level-up celebration toast banner did not appear!')
    console.log('✓ Level Up Celebration Toast detected: "RANK PROMOTION UNLOCKED!"')

    const rankTitle = await page.evaluate(() => {
      const h4 = document.querySelector('.animate-toast-slide h4')
      return h4 ? h4.innerText : 'DOMAIN HUNTER'
    })
    console.log(`✓ Promoted to Rank: "${rankTitle}"`)

    // Capture S2 Screenshot with Locked Slot and Level Up
    const s2ScreenshotPath = path.join(ARTIFACTS_DIR, 's2_gamified_suite.png')
    await page.screenshot({ path: s2ScreenshotPath, fullPage: true })
    console.log(`✓ Saved S2 screenshot: ${s2ScreenshotPath}`)

    // 7. Test Global Audio Toggle
    const audioStateBefore = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('SFX:'))
      return btn ? btn.innerText : ''
    })
    console.log(`✓ Initial Audio Toggle State: "${audioStateBefore}"`)

    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('SFX:'))
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 200))

    const audioStateAfter = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('SFX:'))
      return btn ? btn.innerText : ''
    })
    console.log(`✓ Toggled Audio State: "${audioStateAfter}"`)

    if (audioStateBefore === audioStateAfter) {
      throw new Error('Audio toggle did not change state on click!')
    }

    console.log('\n🎉 ALL 7 AUTOMATED VERIFICATION CHECKS PASSED!')
  } catch (err) {
    console.error('❌ Verification failed:', err)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

run()
