import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function captureRetroStates() {
  console.log('Launching browser to capture Retro Terminal UI states...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1366, height: 960 },
  })

  const page = await browser.newPage()

  try {
    // 1A. S1 BRIEF SCREEN (Quick Entry - media_1790426178643.jpg)
    console.log('Navigating to http://localhost:5178/ ...')
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 1200))

    const shot1 = path.join(ARTIFACT_DIR, 'retro_01_brief_screen.png')
    await page.screenshot({ path: shot1, fullPage: true })
    console.log('Captured Retro State 1A (S1 Quick Entry Brief):', shot1)

    // 1B. S1 BRAND FLAVOR & COMPETITORS SCREEN (media_1790426148438.jpg)
    console.log('Opening Advanced Brand Flavor view...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const flavorBtn = btns.find((b) => b.innerText.includes('ADVANCED BRAND FLAVOR') || b.innerText.includes('➔'))
      if (flavorBtn) flavorBtn.click()
    })
    await new Promise((r) => setTimeout(r, 800))

    const shot1b = path.join(ARTIFACT_DIR, 'retro_01b_flavor_screen.png')
    await page.screenshot({ path: shot1b, fullPage: true })
    console.log('Captured Retro State 1B (Brand Flavor & Competitors):', shot1b)

    // Return to Quick Entry
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const backBtn = btns.find((b) => b.innerText.includes('← BACK'))
      if (backBtn) backBtn.click()
    })
    await new Promise((r) => setTimeout(r, 600))

    // 2. CLICK 'FIND NAMES' DIRECTLY — VERIFY DIRECT TRANSITION TO 02 RESULTS WITH ZERO POPUPS!
    console.log('Clicking FIND NAMES directly from Quick Entry...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const findBtn = btns.find((b) => b.innerText.includes('FIND NAMES'))
      if (findBtn) findBtn.click()
    })
    await new Promise((r) => setTimeout(r, 2000))

    const shot2 = path.join(ARTIFACT_DIR, 'retro_02_results_feed.png')
    await page.screenshot({ path: shot2, fullPage: true })
    console.log('Captured Retro State 2 (S2 Results Feed):', shot2)

    console.log('All updated states captured!')
  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
  }
}

captureRetroStates()
