import puppeteer from 'puppeteer-core'

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'

async function run() {
  console.log('Testing rank toast auto-dismissal...')
  const browser = await puppeteer.launch({
    executablePath: edgePath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,950'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1280, height: 950 })

  try {
    await page.goto('http://localhost:5178/', { waitUntil: 'networkidle0' })

    // Go to Results
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('02 RESULTS'))
      if (btn) btn.click()
    })
    await new Promise(r => setTimeout(r, 500))

    // Shortlist 3 cards to trigger promotion to DOMAIN HUNTER
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        const btns = Array.from(document.querySelectorAll('.arcade-scanlines button')).filter(b => b.innerText === 'SHORTLIST')
        if (btns[0]) btns[0].click()
      })
      await new Promise(r => setTimeout(r, 300))
    }

    // Check toast appeared
    const toastAppeared = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('RANK PROMOTION UNLOCKED'))
    })
    if (!toastAppeared) throw new Error('Toast failed to appear!')
    console.log('✓ Toast appeared immediately upon reaching 30 XP!')

    // Wait 3.6 seconds for the auto-dismiss timer (3200ms)
    console.log('Waiting 3.6s for auto-dismiss...')
    await new Promise(r => setTimeout(r, 3600))

    // Verify toast is gone
    const toastGone = await page.evaluate(() => {
      return !Array.from(document.querySelectorAll('*')).some(el => el.textContent.includes('RANK PROMOTION UNLOCKED'))
    })
    if (!toastGone) throw new Error('Toast is STILL STUCK on the screen after 3.6s!')
    console.log('✓ Toast successfully AUTO-DISMISSED and is no longer on screen!')

    console.log('\n🎉 Auto-dismissal fix verified!')
  } catch (err) {
    console.error('❌ Failed:', err)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

run()
