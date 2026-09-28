import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function captureMobileAndQuestions() {
  console.log('Launching browser to capture Questions tray and Mobile responsive layout...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1366, height: 960 },
  })

  const page = await browser.newPage()

  try {
    // 1. Desktop: Open Questions Panel
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 1000))

    await page.evaluate(() => {
      const qBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('QUESTIONS'))
      if (qBtn) qBtn.click()
    })
    await new Promise((r) => setTimeout(r, 800))

    const shotQ = path.join(ARTIFACT_DIR, 'docked_questions_tray.png')
    await page.screenshot({ path: shotQ, fullPage: false })
    console.log('Captured Docked Questions Tray:', shotQ)

    // Close questions
    await page.keyboard.press('Escape')
    await new Promise((r) => setTimeout(r, 500))

    // 2. Mobile Viewport (iPhone 14 / 15 Pro: 393 x 852)
    await page.setViewport({ width: 393, height: 852, isMobile: true, hasTouch: true })
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 1000))

    const shotMobileS1 = path.join(ARTIFACT_DIR, 'mobile_s1_brief.png')
    await page.screenshot({ path: shotMobileS1, fullPage: false })
    console.log('Captured Mobile S1 Brief:', shotMobileS1)

    // Click 'FIND NAMES' on mobile
    await page.evaluate(() => {
      const btn = document.querySelector('button[type="submit"]')
      if (btn) btn.click()
    })
    await new Promise((r) => setTimeout(r, 1500))

    const shotMobileS2 = path.join(ARTIFACT_DIR, 'mobile_s2_results.png')
    await page.screenshot({ path: shotMobileS2, fullPage: false })
    console.log('Captured Mobile S2 Results:', shotMobileS2)

  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
  }
}

captureMobileAndQuestions()
