import puppeteer from 'puppeteer-core'
import path from 'path'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const ARTIFACT_DIR = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\241f370b-b59d-4e26-8bf0-6e10ebc4f116'

async function captureAllLilacScreens() {
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1366, height: 900 },
  })

  const page = await browser.newPage()

  try {
    console.log('Navigating to https://namegenius-lilac.vercel.app/ ...')
    await page.goto('https://namegenius-lilac.vercel.app/', { waitUntil: 'networkidle0', timeout: 25000 })
    await new Promise((r) => setTimeout(r, 2000))

    // 1. Click "RESULTS" button
    console.log('Clicking RESULTS tab...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find((el) => el.innerText.includes('RESULTS'))
      if (b) b.click()
    })
    await new Promise((r) => setTimeout(r, 1500))
    const shotResults = path.join(ARTIFACT_DIR, 'lilac_results_screen.png')
    await page.screenshot({ path: shotResults, fullPage: true })
    console.log('Captured RESULTS screen:', shotResults)

    // 2. Click "SAVED" button
    console.log('Clicking SAVED tab...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find((el) => el.innerText.includes('SAVED'))
      if (b) b.click()
    })
    await new Promise((r) => setTimeout(r, 1200))
    const shotSaved = path.join(ARTIFACT_DIR, 'lilac_saved_screen.png')
    await page.screenshot({ path: shotSaved, fullPage: true })
    console.log('Captured SAVED screen:', shotSaved)

    // 3. Click "COMPARE" button
    console.log('Clicking COMPARE tab...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find((el) => el.innerText.includes('COMPARE'))
      if (b) b.click()
    })
    await new Promise((r) => setTimeout(r, 1200))
    const shotCompare = path.join(ARTIFACT_DIR, 'lilac_compare_screen.png')
    await page.screenshot({ path: shotCompare, fullPage: true })
    console.log('Captured COMPARE screen:', shotCompare)

    // 4. Click "LAB" button
    console.log('Clicking LAB tab...')
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'))
      const b = btns.find((el) => el.innerText.includes('LAB'))
      if (b) b.click()
    })
    await new Promise((r) => setTimeout(r, 1200))
    const shotLab = path.join(ARTIFACT_DIR, 'lilac_lab_screen.png')
    await page.screenshot({ path: shotLab, fullPage: true })
    console.log('Captured LAB screen:', shotLab)

    // Let's also inspect if there's domain pricing on RESULTS
    const resultsData = await page.evaluate(() => {
      // Return text snippets containing $ or USD or price or cards
      const allText = document.body.innerText
      const priceMatches = allText.match(/\$\d+(\.\d+)?/g) || []
      const cardHeaders = Array.from(document.querySelectorAll('h2, h3, h4, [class*="card"]')).map(el => el.innerText.trim()).filter(Boolean)
      return { priceMatches, cardHeaders: cardHeaders.slice(0, 15) }
    })
    console.log('Results data:', JSON.stringify(resultsData, null, 2))

  } catch (err) {
    console.error('Error during capture:', err)
  } finally {
    await browser.close()
  }
}

captureAllLilacScreens()
