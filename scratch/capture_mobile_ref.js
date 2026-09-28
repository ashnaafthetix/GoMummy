import puppeteer from 'puppeteer-core'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function run() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 393, height: 852, isMobile: true, hasTouch: true },
  })
  const page = await browser.newPage()
  await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0', timeout: 15000 })
  await new Promise((r) => setTimeout(r, 1000))
  await page.screenshot({ path: `${ARTIFACT_DIR}\\mobile_ref_s1.png` })

  await page.evaluate(() => {
    const b = document.querySelector('button[type="submit"]')
    if (b) b.click()
  })
  await new Promise((r) => setTimeout(r, 1500))
  await page.screenshot({ path: `${ARTIFACT_DIR}\\mobile_ref_s2.png` })
  await browser.close()
  console.log('Mobile screenshots captured cleanly!')
}

run()
