import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function capturePhotoreal() {
  console.log('Launching browser to capture updated photorealistic UI...')
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

    const shot1 = path.join(ARTIFACT_DIR, 'photoreal_s1_brief.png')
    await page.screenshot({ path: shot1, fullPage: true })
    console.log('Captured Photoreal S1 Brief Console:', shot1)

    // Click 'FIND NAMES' button
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]')
      if (btn) btn.click()
    })
    await new Promise((r) => setTimeout(r, 1500))

    const shot2 = path.join(ARTIFACT_DIR, 'photoreal_s2_simple_cards.png')
    await page.screenshot({ path: shot2, fullPage: true })
    console.log('Captured Photoreal S2 Simple Cards:', shot2)

  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
  }
}

capturePhotoreal()
