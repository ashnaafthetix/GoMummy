import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function captureReferenceMatch() {
  console.log('Launching browser to capture Reference Match, Sticky Header, and Heading Isolation...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1366, height: 960 },
  })

  const page = await browser.newPage()

  try {
    // 1. Screen 1 (Brief) at Desktop initial view
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 1200))

    const shotS1Initial = path.join(ARTIFACT_DIR, 'screen1_reference_match.png')
    await page.screenshot({ path: shotS1Initial, fullPage: false })
    console.log('Captured Screen 1 Reference Match:', shotS1Initial)

    // 2. Scroll down 350px on Screen 1 to test sticky frozen navbar
    await page.evaluate(() => window.scrollBy(0, 350))
    await new Promise((r) => setTimeout(r, 600))

    const shotS1Scrolled = path.join(ARTIFACT_DIR, 'screen1_sticky_header_scrolled.png')
    await page.screenshot({ path: shotS1Scrolled, fullPage: false })
    console.log('Captured Screen 1 Sticky Header Scrolled:', shotS1Scrolled)

    // Scroll back to top
    await page.evaluate(() => window.scrollTo(0, 0))
    await new Promise((r) => setTimeout(r, 300))

    // 3. Click 'FIND NAMES' to transition to Screen 2 (Results)
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]')
      if (btn) btn.click()
    })
    await new Promise((r) => setTimeout(r, 1500))

    // 4. Verify Screen 2 has NO 'DOMAIN SEARCH IS OUR ART' headline
    const shotS2Initial = path.join(ARTIFACT_DIR, 'screen2_no_duplicate_headline.png')
    await page.screenshot({ path: shotS2Initial, fullPage: false })
    console.log('Captured Screen 2 without Duplicate Headline:', shotS2Initial)

    // 5. Scroll down 450px on Screen 2 to verify sticky frozen navbar over candidate cards
    await page.evaluate(() => window.scrollBy(0, 450))
    await new Promise((r) => setTimeout(r, 600))

    const shotS2Scrolled = path.join(ARTIFACT_DIR, 'screen2_sticky_header_scrolled.png')
    await page.screenshot({ path: shotS2Scrolled, fullPage: false })
    console.log('Captured Screen 2 Sticky Header Scrolled:', shotS2Scrolled)

  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
  }
}

captureReferenceMatch()
