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

    const batch1 = await page.$$eval('h2', (els) => els.map((el) => el.textContent.trim()))
    console.log(`   Batch 1 (5 cards): ${JSON.stringify(batch1)}`)
    if (batch1.length !== 5) {
      throw new Error(`Expected exactly 5 cards in results feed, got: ${batch1.length}`)
    }
    if (batch1[0] !== 'Loom & Carbon') {
      throw new Error(`Expected Slot 01 to be the target subject 'Loom & Carbon', got: "${batch1[0]}"`)
    }
    console.log('   ✓ Slot 01 successfully initialized with target candidate "Loom & Carbon"')

    // Step 4: Test regenerate button swaps in a new, different batch
    console.log('5. Testing "REGENERATE 5 MORE [R]" button swaps in a new batch...')
    const regenBtn = await page.$('button ::-p-text(REGENERATE 5 MORE)')
    if (!regenBtn) throw new Error('Could not find REGENERATE 5 MORE button')
    await regenBtn.click()
    await new Promise((r) => setTimeout(r, 500))

    const batch2 = await page.$$eval('h2', (els) => els.map((el) => el.textContent.trim()))
    console.log(`   Batch 2 (5 cards): ${JSON.stringify(batch2)}`)
    if (batch2.length !== 5) {
      throw new Error('Expected 5 cards after regenerate')
    }
    // Verify that batch2 is different from batch1
    const overlap1_2 = batch1.filter((name) => batch2.includes(name))
    console.log(`   Overlap between Batch 1 and Batch 2: ${JSON.stringify(overlap1_2)}`)
    if (overlap1_2.length === 5) {
      throw new Error('Expected batch 2 to swap in new, different cards')
    }
    console.log('   ✓ Regenerate successfully swapped in a different batch')

    // Step 5: Test keyboard shortcut [R] swaps in a third distinct batch
    console.log('6. Testing keyboard shortcut "r" swaps in another distinct batch...')
    await page.keyboard.press('r')
    await new Promise((r) => setTimeout(r, 500))
    const batch3 = await page.$$eval('h2', (els) => els.map((el) => el.textContent.trim()))
    console.log(`   Batch 3 (5 cards): ${JSON.stringify(batch3)}`)
    if (batch3.length !== 5) {
      throw new Error('Expected 5 cards after keyboard regenerate')
    }
    const overlap2_3 = batch2.filter((name) => batch3.includes(name))
    console.log(`   Overlap between Batch 2 and Batch 3: ${JSON.stringify(overlap2_3)}`)
    if (overlap2_3.length === 5) {
      throw new Error('Expected batch 3 to swap in new, different cards')
    }
    console.log('   ✓ Keyboard shortcut [R] successfully swapped in a 3rd distinct batch')

    // Step 6: Test card interaction (shortlist)
    console.log('7. Testing shortlist interaction...')
    let clickedText = null
    const buttons = await page.$$('button')
    for (const btn of buttons) {
      const text = await (await btn.getProperty('textContent')).jsonValue()
      if (text.includes('SHORTLIST') && !text.includes('SHORTLISTED')) {
        clickedText = text
        await btn.evaluate((b) => b.click())
        await new Promise((r) => setTimeout(r, 600))
        break
      }
    }
    const updatedPageText = await page.$eval('body', (el) => el.textContent)
    if (!updatedPageText.includes('SHORTLISTED ★')) {
      throw new Error(`Shortlist button interaction failed to toggle. Clicked button was: "${clickedText}"`)
    }
    console.log('   ✓ Shortlist button successfully toggled to SHORTLISTED ★')

    await page.screenshot({ path: path.join(artifactDir, 's2_results_feed.png'), fullPage: false })
    console.log('   ✓ S2 screenshot saved to s2_results_feed.png')

    // Step 7: Return to S1 and test typing a custom real input
    console.log('8. Returning to S1 to test custom real input...')
    const backBtn = await page.$('button ::-p-text(← EDIT BRIEF (S1))')
    if (!backBtn) throw new Error('Could not find "← EDIT BRIEF (S1)" button on S2')
    await backBtn.click()
    await page.waitForSelector('text/DOMAIN SEARCH IS OUR ART', { timeout: 4000 })
    console.log('   ✓ Returned to S1')

    // Change input to a new real input: "Velvet Forge"
    console.log('9. Entering custom real input "Velvet Forge" into S1...')
    const nameInput = await page.$('input[type="text"]')
    await nameInput.click()
    await page.keyboard.down('Control')
    await page.keyboard.press('A')
    await page.keyboard.up('Control')
    await page.keyboard.press('Backspace')
    await nameInput.type('Velvet Forge')

    const newSubmitBtn = await page.$('button[type="submit"]')
    await newSubmitBtn.click()
    await page.waitForSelector('text/S2 // RESULTS FEED', { timeout: 4000 })

    const newTitle = await page.$eval('h1', (el) => el.textContent.trim())
    console.log(`   New S2 Title: "${newTitle}"`)
    if (newTitle !== 'Velvet Forge') {
      throw new Error(`Expected S2 title to be 'Velvet Forge', got "${newTitle}"`)
    }

    const customBatch1 = await page.$$eval('h2', (els) => els.map((el) => el.textContent.trim()))
    console.log(`   Custom Input Batch 1: ${JSON.stringify(customBatch1)}`)
    if (customBatch1[0] !== 'Velvet Forge') {
      throw new Error(`Expected Slot 01 to be 'Velvet Forge', got "${customBatch1[0]}"`)
    }

    // Regenerate on custom input
    console.log('10. Testing regenerate on custom input...')
    const customRegenBtn = await page.$('button ::-p-text(REGENERATE 5 MORE)')
    await customRegenBtn.click()
    await new Promise((r) => setTimeout(r, 500))

    const customBatch2 = await page.$$eval('h2', (els) => els.map((el) => el.textContent.trim()))
    console.log(`   Custom Input Batch 2 (after regenerate): ${JSON.stringify(customBatch2)}`)
    if (customBatch2.length !== 5) {
      throw new Error('Expected 5 cards after custom regenerate')
    }
    const customOverlap = customBatch1.filter((n) => customBatch2.includes(n))
    if (customOverlap.length === 5) {
      throw new Error('Expected custom regenerate to produce a different batch')
    }
    console.log('   ✓ Custom real input produced real, different results on regenerate!')

    await page.screenshot({ path: path.join(artifactDir, 's2_custom_results.png'), fullPage: false })
    console.log('   ✓ Custom results screenshot saved to s2_custom_results.png')

    console.log('\n--- ALL ACCEPTANCE CHECKS PASSED SUCCESSFULLY! ---')
  } finally {
    await browser.close()
  }
}

runTests().catch((err) => {
  console.error('\n❌ TEST FAILED:', err)
  process.exit(1)
})
