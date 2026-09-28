import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function checkLiveUI() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 850 },
  })

  const page = await browser.newPage()

  try {
    console.log('Navigating to http://localhost:5178/ ...')
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0', timeout: 15000 })
    await new Promise((r) => setTimeout(r, 1500))

    const shot1 = path.join(ARTIFACT_DIR, 'live_workstation_brief.png')
    await page.screenshot({ path: shot1 })
    console.log('Captured live Brief workstation:', shot1)

    // Click 02 RESULTS
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const resBtn = btns.find((b) => b.innerText.includes('02 RESULTS'))
      if (resBtn) resBtn.click()
    })
    await new Promise((r) => setTimeout(r, 2000))

    const shot2 = path.join(ARTIFACT_DIR, 'live_workstation_results.png')
    await page.screenshot({ path: shot2 })
    console.log('Captured live Results workstation:', shot2)

  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
  }
}

checkLiveUI()
