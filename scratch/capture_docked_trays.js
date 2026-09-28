import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function captureDockedTrays() {
  console.log('Launching browser to capture docked hardware trays...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1366, height: 960 },
  })

  const page = await browser.newPage()

  try {
    console.log('Navigating to http://localhost:5178/ ...')
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 1200))

    // Click 'FIND NAMES' button to enter results
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]')
      if (btn) btn.click()
    })
    await new Promise((r) => setTimeout(r, 1500))

    // Shortlist two cards and compare two cards
    await page.evaluate(() => {
      const cards = document.querySelectorAll('[data-slot-card="true"]')
      if (cards.length >= 2) {
        const starBtn1 = cards[0].querySelector('button[title*="Shortlist"]')
        const starBtn2 = cards[1].querySelector('button[title*="Shortlist"]')
        if (starBtn1) starBtn1.click()
        if (starBtn2) starBtn2.click()

        const compareBtn1 = cards[0].querySelector('button[title*="Compare"]')
        const compareBtn2 = cards[1].querySelector('button[title*="Compare"]')
        if (compareBtn1) compareBtn1.click()
        if (compareBtn2) compareBtn2.click()
      }
    })
    await new Promise((r) => setTimeout(r, 600))

    // Capture screen with persistent bottom dock bar visible
    const shotDock = path.join(ARTIFACT_DIR, 'docked_step4_latch_bar.png')
    await page.screenshot({ path: shotDock, fullPage: true })
    console.log('Captured Dock Latch Bar:', shotDock)

    // Click 'SHORTLIST' in top nav or dock latch to open docked shortlist tray
    await page.evaluate(() => {
      const shortlistBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('SHORTLIST'))
      if (shortlistBtn) shortlistBtn.click()
    })
    await new Promise((r) => setTimeout(r, 800))

    const shotShortlist = path.join(ARTIFACT_DIR, 'docked_step4_shortlist_tray.png')
    await page.screenshot({ path: shotShortlist, fullPage: false })
    console.log('Captured Docked Shortlist Tray:', shotShortlist)

    // Close shortlist tray via Esc
    await page.keyboard.press('Escape')
    await new Promise((r) => setTimeout(r, 500))

    // Click 'COMPARE' in top nav or dock latch to open docked compare tray
    await page.evaluate(() => {
      const compareBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('COMPARE'))
      if (compareBtn) compareBtn.click()
    })
    await new Promise((r) => setTimeout(r, 800))

    const shotCompare = path.join(ARTIFACT_DIR, 'docked_step4_compare_tray.png')
    await page.screenshot({ path: shotCompare, fullPage: false })
    console.log('Captured Docked Compare Tray:', shotCompare)

  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
  }
}

captureDockedTrays()
