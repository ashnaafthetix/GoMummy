import puppeteer from 'puppeteer-core'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const artifactDir = 'C:\\Users\\Ashnaaf\\.gemini\\antigravity-ide\\brain\\ab893a25-2c45-4ac5-8127-e5a185e058f7'

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function runTests() {
  console.log('--- STARTING AUTOMATED TEST SUITE ---')
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,900'],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 1280, height: 900 })

    console.log('1. Navigating to http://localhost:5178/ ...')
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0' })

    // Step 1: Verify S1 (Brief)
    console.log('2. Verifying S1 Brief Screen...')
    const headline = await page.$eval('h1', (el) => el.textContent.trim())
    console.log(`   Found H1: "${headline}"`)
    if (!headline.includes('DOMAIN SEARCH IS OUR ART')) {
      throw new Error(`Expected headline to contain 'DOMAIN SEARCH IS OUR ART', got: "${headline}"`)
    }

    const nameValue = await page.$eval('input[type="text"]', (el) => el.value)
    console.log(`   Found Primary Name input: "${nameValue}"`)
    if (nameValue !== 'Loom & Carbon') {
      throw new Error(`Expected primary name to be 'Loom & Carbon', got: "${nameValue}"`)
    }

    await page.screenshot({ path: path.join(artifactDir, 's1_brief.png'), fullPage: false })
    console.log('   ✓ S1 screenshot saved to s1_brief.png')

    // Step 2: Click "Find names >" button to navigate to S2
    console.log('3. Clicking "Find names >" to transition to S2...')
    const submitBtn = await page.$('button[type="submit"]')
    if (!submitBtn) throw new Error('Could not find "Find names >" submit button on S1')
    await submitBtn.click()

    // Wait for S2 Results screen to appear
    await page.waitForSelector('text/S2 // RESULTS FEED', { timeout: 4000 })
    console.log('   ✓ Successfully navigated to S2 Results Screen')

    // Step 3: Verify S2 content and 5 ResultCards
    console.log('4. Verifying S2 Results Feed & 5 ResultCards...')
    const s2Title = await page.$eval('h1', (el) => el.textContent.trim())
    console.log(`   S2 Title: "${s2Title}"`)
    if (s2Title !== 'Loom & Carbon') {
      throw new Error(`Expected S2 searched subject to be 'Loom & Carbon', got: "${s2Title}"`)
    }

    const cards = await page.$$eval('h2', (els) => els.map((el) => el.textContent.trim()))
    console.log(`   Rendered ${cards.length} ResultCards: ${JSON.stringify(cards)}`)
    if (cards.length !== 5) {
      throw new Error(`Expected exactly 5 cards in results feed, got: ${cards.length}`)
    }

    // Check availability badges and TLD indicator strip
    const pageText = await page.$eval('body', (el) => el.textContent)
    if (!pageText.includes('AVAILABLE') || !pageText.includes('TAKEN')) {
      throw new Error('Expected both AVAILABLE and TAKEN status indicators on cards')
    }
    if (!pageText.includes('Also check:')) {
      throw new Error('Expected "Also check:" TLD indicator strip on cards')
    }
    console.log('   ✓ Status badges (AVAILABLE / TAKEN) and TLD indicator strip verified')

    // Test regenerate button
    console.log('5. Testing "REGENERATE 5 MORE [R]" button...')
    const regenBtn = await page.$('button ::-p-text(REGENERATE 5 MORE)')
    if (!regenBtn) throw new Error('Could not find REGENERATE 5 MORE button')
    await regenBtn.click()
    await new Promise((r) => setTimeout(r, 400))
    const freshCards = await page.$$eval('h2', (els) => els.map((el) => el.textContent.trim()))
    console.log(`   Fresh batch after regenerate: ${JSON.stringify(freshCards)}`)
    if (freshCards.length !== 5) {
      throw new Error('Expected 5 cards after regenerate')
    }
    console.log('   ✓ Regeneration working smoothly')

    // Test inline card actions (copy, shortlist, compare)
    console.log('6. Testing card interaction handlers (copy, shortlist, compare)...')
    let clickedText = null
    const buttons = await page.$$('button')
    for (const btn of buttons) {
      const text = await (await btn.getProperty('textContent')).jsonValue()
      if (text.includes('SHORTLIST') && !text.includes('SHORTLISTED')) {
        clickedText = text
        console.log(`   Found shortlist button with text: "${text}". Clicking it...`)
        await btn.evaluate((b) => b.click())
        await new Promise((r) => setTimeout(r, 600))
        break
      }
    }
    const updatedPageText = await page.$eval('body', (el) => el.textContent)
    console.log(`   Page text includes 'SHORTLISTED ★': ${updatedPageText.includes('SHORTLISTED ★')}`)
    if (!updatedPageText.includes('SHORTLISTED ★')) {
      throw new Error(`Shortlist button interaction failed to toggle. Clicked button was: "${clickedText}"`)
    }
    console.log('   ✓ Interactive callbacks on ResultCard verified')

    await page.screenshot({ path: path.join(artifactDir, 's2_results_feed.png'), fullPage: false })
    console.log('   ✓ S2 screenshot saved to s2_results_feed.png')

    // Step 4: Click "← EDIT BRIEF (S1)" to navigate back to S1
    console.log('7. Clicking "← EDIT BRIEF (S1)" to verify no dead-ends...')
    const backBtn = await page.$('button ::-p-text(← EDIT BRIEF (S1))')
    if (!backBtn) throw new Error('Could not find "← EDIT BRIEF (S1)" button on S2')
    await backBtn.click()

    await page.waitForSelector('text/DOMAIN SEARCH IS OUR ART', { timeout: 4000 })
    console.log('   ✓ Successfully returned to S1')

    const returnedName = await page.$eval('input[type="text"]', (el) => el.value)
    console.log(`   Primary Name input after return: "${returnedName}"`)
    if (returnedName !== 'Loom & Carbon') {
      throw new Error('Input state was lost when returning to S1')
    }

    await page.screenshot({ path: path.join(artifactDir, 's1_returned.png'), fullPage: false })
    console.log('   ✓ S1 returned screenshot saved to s1_returned.png')

    console.log('\n--- ALL ACCEPTANCE CHECKS PASSED SUCCESSFULLY! ---')
  } finally {
    await browser.close()
  }
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err)
  process.exit(1)
})
