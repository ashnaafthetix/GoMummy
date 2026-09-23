import puppeteer from 'puppeteer-core';

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

(async () => {
  console.log('=====================================================');
  console.log('ANNOUNCEMENT: SPENDING EXACTLY 1 REAL REQUEST ON KEEBCRAFT');
  console.log('Connecting Gemini API & Google DoH DNS Availability');
  console.log('=====================================================');

  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: 'new',
    defaultViewport: { width: 1280, height: 950 },
  });
  const page = await browser.newPage();
  
  let geminiCalls = 0;
  let dohCalls = 0;
  const dohDomains = [];
  
  page.on('console', (msg) => {
    console.log(`[BROWSER CONSOLE] ${msg.type().toUpperCase()}: ${msg.text()}`);
  });

  page.on('pageerror', (err) => {
    console.error(`[BROWSER UNCAUGHT ERROR]: ${err.toString()}`);
  });

  page.on('request', (req) => {
    const url = req.url();
    if (url.includes('generativelanguage.googleapis.com')) {
      if (req.method() === 'POST') {
        geminiCalls++;
        console.log(`[LIVE GEMINI GENERATION POST #${geminiCalls}]: ${url.split('?')[0]}`);
      } else {
        console.log(`[BROWSER CORS PREFLIGHT]: ${req.method()} ${url.split('?')[0]}`);
      }
    }
    if (url.includes('dns.google')) {
      dohCalls++;
      const match = url.match(/name=([^&]+)/);
      if (match) {
        dohDomains.push(decodeURIComponent(match[1]));
      }
    }
  });

  await page.goto('http://localhost:5178', { waitUntil: 'networkidle2' });
  
  // Wait for brief input field
  await page.waitForSelector('input[type="text"]', { timeout: 10000 });

  // Fill in the 3-input model for KeebCraft
  await page.evaluate(() => {
    const setVal = (el, val) => {
      const proto = el instanceof HTMLTextAreaElement ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;
      const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;
      setter.call(el, val);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    };

    const inputs = document.querySelectorAll('input[type="text"]');
    if (inputs[0]) setVal(inputs[0], 'KeebCraft');
    
    const textarea = document.querySelector('textarea');
    if (textarea) setVal(textarea, 'Artisanal custom mechanical keyboards, brass plates, tactile switches.');

    if (inputs[1]) setVal(inputs[1], 'Keychron, Mode, Rama Works');
  });

  // Short delay to ensure React state commits
  await new Promise((r) => setTimeout(r, 600));

  console.log('Submitting brief form for KeebCraft...');
  // Click the submit button directly once
  const submitBtn = await page.$('button[type="submit"]');
  if (submitBtn) {
    await submitBtn.click();
  } else {
    await page.evaluate(() => {
      document.querySelector('form')?.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    });
  }

  // Wait for Results screen to appear
  console.log('Waiting for Results screen to mount after Gemini API call...');
  await page.waitForFunction(() => {
    return document.body.innerText.includes('RESULTS FEED') || document.body.innerText.includes('AVAILABLE NAMES FOR');
  }, { timeout: 30000 });
  
  // Wait for DNS queries and decryption to settle
  console.log('Results screen loaded! Waiting for DoH DNS checks and card decryption to settle...');
  await new Promise((r) => setTimeout(r, 4500));

  // Extract rendered DOM data
  const pageData = await page.evaluate(() => {
    // Subject banner
    const subjectCard = document.querySelector('div.relative.mb-8');
    const subjectBanner = subjectCard ? subjectCard.querySelector('h2') : null;
    const subjectDomain = subjectCard ? subjectCard.querySelector('p.font-mono') : null;

    // Cards
    const cards = Array.from(document.querySelectorAll('[data-slot-card="true"]')).map((card) => {
      const heading = card.querySelector('h2')?.innerText || '';
      const domainP = card.querySelector('p')?.innerText || '';
      const fullText = card.innerText;
      let status = 'UNKNOWN';
      if (fullText.includes('AVAILABLE')) status = 'AVAILABLE';
      else if (fullText.includes('TAKEN')) status = 'TAKEN';
      return {
        heading,
        domain: domainP,
        status,
      };
    });

    // Check for API notice banner
    const notice = document.querySelector('[role="alert"]')?.innerText || '';

    return {
      subject: subjectBanner ? subjectBanner.innerText : '',
      subjectDomain: subjectDomain ? subjectDomain.innerText : '',
      notice,
      cards,
    };
  });

  console.log('=====================================================');
  console.log(`EXACT GEMINI REQUESTS SPENT: ${geminiCalls} OF 1`);
  console.log(`LIVE DOH DNS CHECKS PERFORMED: ${dohCalls}`);
  console.log(`DOH DOMAINS QUERIED: ${dohDomains.join(', ')}`);
  console.log(`SUBJECT CHECK HERO: "${pageData.subject}" (${pageData.subjectDomain})`);
  if (pageData.notice) {
    console.log(`API NOTICE ON SCREEN: ${pageData.notice}`);
  }
  console.log('LIVE CARDS RENDERED ON RESULTS SCREEN:');
  pageData.cards.forEach((c, idx) => {
    console.log(`  [Slot 0${idx + 1}] Brand: "${c.heading}" | Domain: ${c.domain} | State: ${c.status}`);
  });
  console.log('=====================================================');

  await page.screenshot({ path: 'live-services-results.png' });
  console.log('Saved screenshot to live-services-results.png');

  await browser.close();

  if (geminiCalls === 1 && pageData.cards.length >= 5) {
    console.log('SUCCESS: Exactly 1 real Gemini request was spent. Live candidates and DNS checks verified.');
    process.exit(0);
  } else {
    console.error(`VERIFICATION ERROR: Gemini calls = ${geminiCalls}, Cards = ${pageData.cards.length}`);
    process.exit(1);
  }
})();
