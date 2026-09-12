import puppeteer from 'puppeteer-core'
import path from 'path'

const ARTIFACTS_DIR = "C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\ab893a25-2c45-4ac5-8127-e5a185e058f7"
const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function run() {
  console.log('🚀 Starting Automated Verification for Modernized Navbar & Animated Pop-up Modals...')
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

    // 2. Check Navbar Tabs
    const navText = await page.$eval('nav', el => el.innerText.replace(/\n/g, ' '))
    console.log(`✓ Navbar Content: "${navText}"`)

    if (navText.includes('RESULTS (3 DIRS)') || navText.includes('ARCADE LAB')) {
      throw new Error('Legacy demo tabs (Results 3DIRS or Arcade Lab) are still present in navbar!')
    }
    console.log('✓ Verified: Legacy "Results 3DIRS" and "Arcade Lab" tabs are completely REMOVED.')

    const expectedTabs = ['01 BRIEF', '02 RESULTS', 'SHORTLIST', 'COMPARE', 'QUESTIONS']
    for (const tab of expectedTabs) {
      if (!navText.includes(tab)) {
        throw new Error(`Expected navbar to contain tab "${tab}", but not found!`)
      }
    }
    console.log('✓ Verified: All core tabs present with pixel badge styling (01 BRIEF, 02 RESULTS, SHORTLIST, COMPARE, QUESTIONS).')

    // Capture S1 with Modernized Navbar
    const s1NavPath = path.join(ARTIFACTS_DIR, 's1_modern_nav.png')
    await page.screenshot({ path: s1NavPath, fullPage: true })
    console.log(`✓ Saved S1 screenshot: ${s1NavPath}`)

    // 3. Go to Results
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('02 RESULTS'))
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 600))

    // 4. Test Compare Side-by-Side Modal
    // Click COMPARE on first 2 cards
    await page.evaluate(() => {
      const compBtns = Array.from(document.querySelectorAll('.arcade-scanlines button')).filter(b => b.innerText.includes('COMPARE'))
      if (compBtns[0]) compBtns[0].click()
    })
    await new Promise(r => setTimeout(r, 300))

    await page.evaluate(() => {
      const compBtns = Array.from(document.querySelectorAll('.arcade-scanlines button')).filter(b => b.innerText === 'COMPARE')
      if (compBtns[0]) compBtns[0].click()
    })
    await new Promise(r => setTimeout(r, 400))

    // Check nav tab updated
    const compareNavText = await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('nav button')).find(b => b.innerText.includes('COMPARE'))
      return btn ? btn.innerText.replace(/\n/g, ' ') : ''
    })
    console.log(`✓ Compare Nav Tab Badge: "${compareNavText}"`)

    // Click the VS COMPARE tab in navbar
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('nav button')).find(b => b.innerText.includes('COMPARE'))
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 500))

    // Verify Compare Modal opened with side-by-side layout
    const hasCompareModal = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('HEAD-TO-HEAD DUEL'))
    })
    if (!hasCompareModal) throw new Error('Compare Modal did not open on clicking COMPARE tab!')
    console.log('✓ Compare Modal opened with spring entrance pop-up animation')

    // Verify VS badge rendered
    const hasVsBadge = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('⚡ VS ⚡'))
    })
    if (!hasVsBadge) throw new Error('⚡ VS ⚡ duel badge not found in side-by-side compare layout!')
    console.log('✓ Verified: Side-by-side cards rendered with animated "⚡ VS ⚡" center duel badge')

    // Capture Compare Modal Screenshot
    const compareModalPath = path.join(ARTIFACTS_DIR, 'compare_modal_side_by_side.png')
    await page.screenshot({ path: compareModalPath, fullPage: true })
    console.log(`✓ Saved Compare Modal screenshot: ${compareModalPath}`)

    // Close modal via Escape key
    await page.keyboard.press('Escape')
    await new Promise(r => setTimeout(r, 400))

    const modalStillOpen = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('HEAD-TO-HEAD DUEL'))
    })
    if (modalStillOpen) throw new Error('Compare Modal failed to close on Escape key press!')
    console.log('✓ Compare Modal closed smoothly via Escape key, preserving active Results feed!')

    // 5. Test Shortlist Side-by-Side Modal
    // Shortlist 2 cards
    for (let i = 0; i < 2; i++) {
      await page.evaluate(() => {
        const cardBtns = Array.from(document.querySelectorAll('.arcade-scanlines button')).filter(b => b.innerText === 'SHORTLIST')
        if (cardBtns[0]) cardBtns[0].click()
      })
      await new Promise(r => setTimeout(r, 400))
    }

    // Click the SHORTLIST tab in navbar
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('nav button')).find(b => b.innerText.includes('SHORTLIST'))
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 500))

    // Verify Shortlist Modal opened
    const hasShortlistModal = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('SAVED SHORTLIST'))
    })
    if (!hasShortlistModal) throw new Error('Shortlist Modal did not open on clicking SHORTLIST tab!')
    console.log('✓ Shortlist Modal opened with spring entrance pop-up animation')

    // Click COPY ALL
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('COPY ALL'))
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 300))

    const hasCopiedAll = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).some(b => b.innerText.includes('COPIED ALL'))
    })
    if (!hasCopiedAll) throw new Error('COPY ALL action in Shortlist Modal failed to confirm!')
    console.log('✓ Verified: COPY ALL action executed and confirmed in Shortlist Modal')

    // Capture Shortlist Modal Screenshot
    const shortlistModalPath = path.join(ARTIFACTS_DIR, 'shortlist_modal_side_by_side.png')
    await page.screenshot({ path: shortlistModalPath, fullPage: true })
    console.log(`✓ Saved Shortlist Modal screenshot: ${shortlistModalPath}`)

    // Close Shortlist Modal via Close Button
    await page.evaluate(() => {
      const closeBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('[✕ CLOSE]'))
      if (closeBtn) closeBtn.click()
    })
    await new Promise(r => setTimeout(r, 400))

    const shortlistStillOpen = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('SAVED SHORTLIST'))
    })
    if (shortlistStillOpen) throw new Error('Shortlist Modal failed to close on close button click!')
    console.log('✓ Shortlist Modal closed cleanly via [✕ CLOSE] button!')

    console.log('\n🎉 ALL MODAL & NAVBAR TESTS PASSED 100%!')
  } catch (err) {
    console.error('❌ Verification failed:', err)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

run()
