import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function inspectLilac() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 },
  })

  const page = await browser.newPage()

  try {
    console.log('Navigating to https://namegenius-lilac.vercel.app/ ...')
    await page.goto('https://namegenius-lilac.vercel.app/', { waitUntil: 'networkidle0', timeout: 20000 })
    await new Promise((r) => setTimeout(r, 2000))

    const shot1 = path.join(ARTIFACT_DIR, 'namegenius_lilac_home.png')
    await page.screenshot({ path: shot1, fullPage: true })
    console.log('Screenshot saved to:', shot1)

    // Inspect elements, title, headings, and structure
    const data = await page.evaluate(() => {
      const title = document.title
      const h1s = Array.from(document.querySelectorAll('h1, h2, h3')).map(h => h.innerText.trim())
      const buttons = Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(Boolean)
      const inputs = Array.from(document.querySelectorAll('input, textarea')).map(i => ({ placeholder: i.placeholder, value: i.value }))
      return { title, h1s, buttons: buttons.slice(0, 25), inputs }
    })

    console.log('Page Data:', JSON.stringify(data, null, 2))

  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
  }
}

inspectLilac()
