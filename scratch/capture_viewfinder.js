import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function captureViewfinder() {
  console.log('Launching browser to capture Identity Viewfinder...')
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

    // Click 'FIND NAMES' button
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]')
      if (btn) btn.click()
    })
    await new Promise((r) => setTimeout(r, 1500))

    // Click 👁️ Viewfinder button on the first candidate card
    await page.evaluate(() => {
      const card = document.querySelector('[data-slot-card="true"]')
      if (card) {
        const eyeBtn = card.querySelector('button[title*="Identity Scope"]')
        if (eyeBtn) eyeBtn.click()
      }
    })
    await new Promise((r) => setTimeout(r, 800))

    const shotViewfinder = path.join(ARTIFACT_DIR, 'step5_identity_viewfinder.png')
    await page.screenshot({ path: shotViewfinder, fullPage: false })
    console.log('Captured Identity Viewfinder:', shotViewfinder)

  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
  }
}

captureViewfinder()
