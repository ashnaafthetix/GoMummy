import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  console.log('=====================================================');
  console.log('VERIFYING 4 SITUATIONS (NOTHING, TOO MUCH, WRONG, WAITING)');
  console.log('Zero live requests spent — tested via built-in code presets');
  console.log('=====================================================');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 950 },
  });
  const page = await browser.newPage();
  
  let geminiCalls = 0;
  page.on('request', (req) => {
    if (req.url().includes('generativelanguage.googleapis.com') && req.method() === 'POST') {
      geminiCalls++;
    }
  });

  await page.goto('http://localhost:5178/?view=results', { waitUntil: 'networkidle2' });
  await page.waitForSelector('[data-slot-card="true"]');

  const clickPreset = async (label) => {
    await page.evaluate((txt) => {
      const btns = Array.from(document.querySelectorAll('button'));
      const b = btns.find((el) => el.innerText.includes(txt));
      if (b) b.click();
    }, label);
    await new Promise((r) => setTimeout(r, 400));
  };

  // 1. TEST SITUATION 1: NOTHING
  console.log('Testing Situation 1: NOTHING (Empty filter match)...');
  await clickPreset('1: NOTHING');
  const emptyStateRendered = await page.evaluate(() => {
    return document.body.innerText.includes('ZERO CANDIDATES MATCH FILTER');
  });
  console.log('  -> Empty State Detected:', emptyStateRendered);
  await page.screenshot({ path: 'situation-1-nothing.png' });

  // 2. TEST SITUATION 2: TOO MUCH
  console.log('Testing Situation 2: TOO MUCH (Extreme text & layout stress)...');
  await clickPreset('2: TOO MUCH');
  const tooMuchData = await page.evaluate(() => {
    const card = document.querySelector('[data-slot-card="true"]');
    const h2 = card ? card.querySelector('h2')?.innerText : '';
    const domain = card ? card.querySelector('p')?.innerText : '';
    return { h2, domain };
  });
  console.log('  -> Longest Headline Rendered:', tooMuchData.h2);
  console.log('  -> Longest Domain Rendered:', tooMuchData.domain);
  await page.screenshot({ path: 'situation-2-too-much.png' });

  // 3. TEST SITUATION 3: WRONG
  console.log('Testing Situation 3: WRONG (HTTP 429 quota exhaustion notice)...');
  await clickPreset('3: WRONG');
  const wrongNotice = await page.evaluate(() => {
    return document.body.innerText.includes('GEMINI QUOTA 429 NOTIFICATION');
  });
  console.log('  -> 429 Quota Notice Detected:', wrongNotice);
  await page.screenshot({ path: 'situation-3-wrong.png' });

  // 4. TEST SITUATION 4: WAITING
  console.log('Testing Situation 4: WAITING (In-flight resolution & checking badges)...');
  await clickPreset('4: WAITING');
  const checkingCount = await page.evaluate(() => {
    const badges = Array.from(document.querySelectorAll('span'));
    return badges.filter((el) => el.innerText.includes('CHECKING...')).length;
  });
  console.log('  -> Active "CHECKING..." Beacons on Screen:', checkingCount);
  await page.screenshot({ path: 'situation-4-waiting.png' });

  // 5. RETURN TO NORMAL
  console.log('Returning to Situation 0: NORMAL...');
  await clickPreset('0: NORMAL');
  const normalCardsCount = await page.evaluate(() => {
    return document.querySelectorAll('[data-slot-card="true"]').length;
  });
  console.log('  -> Normal Cards Restored:', normalCardsCount);
  await page.screenshot({ path: 'situation-0-normal.png' });

  console.log('=====================================================');
  console.log(`TOTAL REAL GEMINI REQUESTS SPENT: ${geminiCalls}`);
  console.log('=====================================================');

  await browser.close();

  if (emptyStateRendered && tooMuchData.h2 && wrongNotice && checkingCount >= 5 && geminiCalls === 0) {
    console.log('ALL FOUR SITUATIONS PASSED VERIFICATION WITH ZERO SPENT QUOTA!');
    process.exit(0);
  } else {
    console.error('VERIFICATION FAILED!');
    process.exit(1);
  }
})();
