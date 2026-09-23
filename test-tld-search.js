import puppeteer from 'puppeteer-core'

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function runTest() {
  console.log('Launching browser...')
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 900 },
  })

  const page = await browser.newPage()
  page.on('console', (msg) => console.log('BROWSER LOG:', msg.text()))

  try {
    console.log('Navigating to http://localhost:5178/ ...')
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0', timeout: 15000 })

    // If on S1 Brief, click FIND NAMES [SPACE] or 02 RESULTS tab
    const findBtn = await page.$('button[type="submit"]')
    if (findBtn) {
      console.log('Clicking FIND NAMES button on S1 Brief...')
      await findBtn.click()
    } else {
      console.log('Clicking 02 RESULTS tab...')
      const resultsTab = await page.waitForSelector('xpath///button[contains(., "02 RESULTS")]')
      await resultsTab.click()
    }

    // Wait for ResultCards to render
    await page.waitForSelector('div[slotNumber], h2', { timeout: 5000 })
    await new Promise((r) => setTimeout(r, 800)) // allow cipher animation to finish

    // Extract all visible candidate cards and their primary TLDs
    const getCardInfo = async () => {
      return await page.evaluate(() => {
        const cards = Array.from(document.querySelectorAll('div[data-slot-card]'))
        return cards.map((card) => {
          const h2 = card.querySelector('h2')
          const name = h2 ? h2.textContent.trim() : ''
          const domainEl = card.querySelector('p.font-mono')
          const fullDomain = domainEl ? domainEl.textContent.trim() : ''
          return { name, fullDomain }
        })
      })
    }

    let cards = await getCardInfo()
    console.log('Initial Results Batch Cards:', cards)

    const tlds = cards.map(c => {
      if (c.fullDomain.endsWith('.com')) return '.com'
      if (c.fullDomain.endsWith('.io')) return '.io'
      if (c.fullDomain.endsWith('.ai')) return '.ai'
      return 'other'
    })
    console.log('TLD distribution:', tlds)

    if (!tlds.includes('.io')) throw new Error('Expected at least one .io domain in results!')
    if (!tlds.includes('.ai')) throw new Error('Expected at least one .ai domain in results!')
    if (!tlds.includes('.com')) throw new Error('Expected at least one .com domain in results!')
    console.log('✓ Verified: .com, .io, and .ai domains are all present in batch!')

    // Test clicking .io filter
    console.log('Clicking [.io] filter...')
    const ioFilterBtn = await page.waitForSelector('xpath///button[contains(., ".io")]')
    await ioFilterBtn.click()
    await new Promise((r) => setTimeout(r, 400))

    let ioFiltered = await getCardInfo()
    console.log('.io Filtered Cards:', ioFiltered)
    if (ioFiltered.length === 0) throw new Error('Expected .io cards to be visible, got 0!')
    if (!ioFiltered.every(c => c.fullDomain.endsWith('.io'))) {
      throw new Error('Non-.io cards appeared under .io filter!')
    }
    console.log(`✓ Verified: ${ioFiltered.length} .io card(s) cleanly displayed under .io filter!`)

    // Test clicking .ai filter
    console.log('Clicking [.ai] filter...')
    const aiFilterBtn = await page.waitForSelector('xpath///button[contains(., ".ai")]')
    await aiFilterBtn.click()
    await new Promise((r) => setTimeout(r, 400))

    let aiFiltered = await getCardInfo()
    console.log('.ai Filtered Cards:', aiFiltered)
    if (aiFiltered.length === 0) throw new Error('Expected .ai cards to be visible, got 0!')
    if (!aiFiltered.every(c => c.fullDomain.endsWith('.ai'))) {
      throw new Error('Non-.ai cards appeared under .ai filter!')
    }
    console.log(`✓ Verified: ${aiFiltered.length} .ai card(s) cleanly displayed under .ai filter!`)

    // Click ALL filter to restore
    console.log('Clicking [ALL] filter...')
    const allFilterBtn = await page.waitForSelector('xpath///button[contains(., "ALL")]')
    await allFilterBtn.click()
    await new Promise((r) => setTimeout(r, 400))

    // Capture screenshot of results with multi-TLD badges
    const screenshotPath = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\ab893a25-2c45-4ac5-8127-e5a185e058f7\\multi_tld_results_screen.png'
    await page.screenshot({ path: screenshotPath, fullPage: false })
    console.log(`Screenshot saved to: ${screenshotPath}`)

    // Test Regenerate to ensure new batch also has .io and .ai
    console.log('Clicking REGENERATE 5 MORE...')
    const regenBtn = await page.waitForSelector('xpath///button[contains(., "REGENERATE 5 MORE")]')
    await regenBtn.click()
    await new Promise((r) => setTimeout(r, 900))

    cards = await getCardInfo()
    console.log('Regenerated Batch Cards:', cards)
    const regenTlds = cards.map(c => {
      if (c.fullDomain.endsWith('.com')) return '.com'
      if (c.fullDomain.endsWith('.io')) return '.io'
      if (c.fullDomain.endsWith('.ai')) return '.ai'
      return 'other'
    })
    console.log('Regen TLD distribution:', regenTlds)
    if (!regenTlds.includes('.io')) throw new Error('Expected .io domain in regenerated batch!')
    if (!regenTlds.includes('.ai')) throw new Error('Expected .ai domain in regenerated batch!')
    console.log('✓ Verified: Regenerated batch also has .io and .ai domains!')

    console.log('\nALL TLD VERIFICATION TESTS PASSED SUCCESSFULLY! 🎉')
  } catch (err) {
    console.error('Test failed:', err)
    process.exitCode = 1
  } finally {
    await browser.close()
  }
}

runTest()
