/**
 * Brand Pitch Dossier Generation Service
 * 
 * Produces executive-grade brand dossiers for shortlisted domain candidates.
 * Supports:
 * - Structured Markdown Pitch Dossier (.md)
 * - Standalone Responsive HTML Presentation (.html) with print/save-to-PDF styles
 * - 1-Click Clipboard Markdown copy
 * - Zero external runtime dependencies (pure client-side Blob & URI downloads)
 */

import {
  getDomainPrice,
  analyzePhonetics,
  getRegistrarLinks,
  getPrimaryRegistrarUrl,
  checkSocialHandles,
} from './domainService.js'

/**
 * Generate Structured Executive Markdown Dossier
 */
export function generateMarkdownDossier({
  shortlist = [],
  projectName = 'GoMummy Brand Expedition',
  creator = 'GoMummy Tactical Workstation',
}) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const totalYr1 = shortlist.reduce((sum, s) => sum + getDomainPrice(s.tld || '.com').reg, 0)
  const totalRenew = shortlist.reduce((sum, s) => sum + getDomainPrice(s.tld || '.com').renew, 0)
  const total3Yr = totalYr1 + totalRenew * 2

  let md = `# BRAND PITCH DOSSIER: ${projectName.toUpperCase()}\n`
  md += `> **Strategic Domain Acquisition & Brand Identity Dossier**\n\n`
  md += `- **Date Generated:** ${dateStr}\n`
  md += `- **Compiled By:** ${creator}\n`
  md += `- **Candidate Assets:** ${shortlist.length} domains shortlisted\n\n`
  md += `---\n\n`

  // 1. Executive Summary & Financial Valuation
  md += `## 1. EXECUTIVE VALUATION & ACQUISITION CAPITAL\n\n`
  md += `| Investment Metric | Valuation | Strategic Notes |\n`
  md += `| :--- | :--- | :--- |\n`
  md += `| **1st-Year Initial Acquisition Capital** | **$${totalYr1.toFixed(2)}** | Combined first-year registration checkout cost |\n`
  md += `| **Annual Recurring Maintenance** | **$${totalRenew.toFixed(2)}/yr** | Projected ongoing renewal expense |\n`
  md += `| **3-Year Total Cost of Ownership (TCO)** | **$${total3Yr.toFixed(2)}** | Full 36-month holding capital reserve |\n`
  md += `| **Average Cost per Candidate** | **$${(shortlist.length ? totalYr1 / shortlist.length : 0).toFixed(2)}** | Blended average initial asset outlay |\n\n`

  // 2. Candidate Portfolio Matrix
  md += `## 2. CANDIDATE PORTFOLIO MATRIX\n\n`
  md += `| # | Brand Name | Primary Domain | Cadence | Tone | Year 1 ($) | Renew ($) | 1-Click Acquisition Cart |\n`
  md += `| :-: | :--- | :--- | :--- | :--- | :-: | :-: | :--- |\n`

  shortlist.forEach((item, index) => {
    const fullDomain = `${item.domain}${item.tld || '.com'}`
    const price = getDomainPrice(item.tld || '.com')
    const phonetics = analyzePhonetics(item.name || item.domain)
    const primaryUrl = getPrimaryRegistrarUrl(fullDomain)
    const brandName = item.name || item.domain

    md += `| ${index + 1} | **${brandName}** | \`${fullDomain}\` | ${phonetics.syllables} syl | ${phonetics.tone} | $${price.reg.toFixed(2)} | $${price.renew.toFixed(2)}/yr | [Cart Link](${primaryUrl}) |\n`
  })
  md += `\n`

  // 3. Individual Candidate Profiles
  md += `## 3. IN-DEPTH ASSET STRATEGY & PHONETIC PROFILES\n\n`

  shortlist.forEach((item, index) => {
    const fullDomain = `${item.domain}${item.tld || '.com'}`
    const price = getDomainPrice(item.tld || '.com')
    const phonetics = analyzePhonetics(item.name || item.domain)
    const brandName = item.name || item.domain
    const links = getRegistrarLinks(fullDomain)
    const socials = checkSocialHandles(item.domain)

    md += `### ${index + 1}. ${brandName.toUpperCase()} — \`${fullDomain}\`\n\n`
    md += `**Acoustic & Linguistic Architecture:**\n`
    md += `- **Cadence & Syllable Count:** ${phonetics.syllables} syllable${phonetics.syllables > 1 ? 's' : ''}\n`
    md += `- **Tonal Character:** ${phonetics.tone} (optimized for memorability and friction-free vocal sharing)\n`
    md += `- **Brand Resonance:** Crisp pronunciation profile suited for global tech, enterprise, and direct-to-consumer positioning.\n\n`

    md += `**Social Handle Landscape (@${item.domain}):**\n`
    md += `- **X (Twitter):** ${socials.x === 'available' ? '🟢 Likely Available' : '🟡 Review Required'}\n`
    md += `- **Instagram:** ${socials.ig === 'available' ? '🟢 Likely Available' : '🟡 Review Required'}\n`
    md += `- **GitHub:** ${socials.gh === 'available' ? '🟢 Likely Available' : '🟡 Review Required'}\n`
    md += `- **TikTok:** ${socials.tik === 'available' ? '🟢 Likely Available' : '🟡 Review Required'}\n\n`

    md += `**Acquisition Economics & Deep Links:**\n`
    md += `- **Initial Registration:** $${price.reg.toFixed(2)} (via ${price.registrar})\n`
    md += `- **Annual Renewal:** $${price.renew.toFixed(2)}/yr\n`
    md += `- **Direct Cart Deep Links:**\n`
    md += `  - [Register on Porkbun](${links.porkbun})\n`
    md += `  - [Register on Namecheap](${links.namecheap})\n`
    md += `  - [Register on Cloudflare](${links.cloudflare})\n\n`
    md += `---\n\n`
  })

  // 4. Acquisition Protocol
  md += `## 4. RECOMMENDED ACQUISITION PROTOCOL\n\n`
  md += `1. **Founder / Stakeholder Consensus:** Review and select top 2 prioritized candidates from the matrix above.\n`
  md += `2. **Immediate Registrar Lock:** Execute purchase via the direct cart links before publicly circulating names to avoid predatory domain front-running or sniping.\n`
  md += `3. **WHOIS Privacy & DNS Security:** Ensure WHOIS Privacy Protection and DNSSEC are enabled during registrar checkout (standard on Porkbun and Cloudflare).\n`
  md += `4. **Multi-Channel Trademark Clearing:** Conduct standard USPTO / WIPO trademark conflict clearance for selected candidates.\n\n`

  md += `_\n\n`
  md += `*Generated automatically by GoMummy Tactical Brand Workstation // Confidential Brand Strategy*\n`

  return md
}

/**
 * Generate Standalone Responsive HTML Presentation Dossier
 * Fully styled with printable (@media print) rules for 1-click "Print to PDF".
 */
export function generateHtmlDossier({
  shortlist = [],
  projectName = 'GoMummy Brand Expedition',
}) {
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const totalYr1 = shortlist.reduce((sum, s) => sum + getDomainPrice(s.tld || '.com').reg, 0)
  const totalRenew = shortlist.reduce((sum, s) => sum + getDomainPrice(s.tld || '.com').renew, 0)
  const total3Yr = totalYr1 + totalRenew * 2

  const rowsHtml = shortlist
    .map((item, idx) => {
      const fullDomain = `${item.domain}${item.tld || '.com'}`
      const price = getDomainPrice(item.tld || '.com')
      const ph = analyzePhonetics(item.name || item.domain)
      const primaryUrl = getPrimaryRegistrarUrl(fullDomain)
      const brandName = item.name || item.domain

      return `
        <tr>
          <td style="font-weight: 700; color: #1e293b;">${idx + 1}</td>
          <td style="font-weight: 800; font-size: 15px; color: #0f172a;">${brandName}</td>
          <td><span class="domain-pill">${fullDomain}</span></td>
          <td><span class="badge badge-gray">${ph.syllables} syl</span></td>
          <td><span class="badge badge-amber">${ph.tone}</span></td>
          <td style="font-weight: 700; color: #0f172a;">$${price.reg.toFixed(2)}</td>
          <td style="color: #64748b;">$${price.renew.toFixed(2)}/yr</td>
          <td>
            <a href="${primaryUrl}" target="_blank" rel="noopener noreferrer" class="btn-buy">
              Buy Cart ➔
            </a>
          </td>
        </tr>
      `
    })
    .join('')

  const cardsHtml = shortlist
    .map((item, idx) => {
      const fullDomain = `${item.domain}${item.tld || '.com'}`
      const price = getDomainPrice(item.tld || '.com')
      const ph = analyzePhonetics(item.name || item.domain)
      const brandName = item.name || item.domain
      const links = getRegistrarLinks(fullDomain)
      const socials = checkSocialHandles(item.domain)

      return `
        <div class="asset-card">
          <div class="asset-card-header">
            <div>
              <div class="asset-number">OPTION 0${idx + 1}</div>
              <h3 class="asset-title">${brandName}</h3>
              <div class="asset-domain">${fullDomain}</div>
            </div>
            <div class="asset-price-box">
              <div class="price-val">$${price.reg.toFixed(2)}</div>
              <div class="price-sub">1st Year // Renew $${price.renew.toFixed(2)}/yr</div>
            </div>
          </div>

          <div class="asset-grid">
            <div class="asset-box">
              <div class="box-label">Acoustics & Phonetics</div>
              <div class="box-val">${ph.syllables} Syllables // ${ph.tone} Tone</div>
              <div class="box-desc">Aerodynamic vocal projection with natural phonological balance.</div>
            </div>
            <div class="asset-box">
              <div class="box-label">Social Namespace Check</div>
              <div class="social-tags">
                <span class="social-tag ${socials.x === 'available' ? 'tag-green' : 'tag-neutral'}">X: ${socials.x}</span>
                <span class="social-tag ${socials.ig === 'available' ? 'tag-green' : 'tag-neutral'}">IG: ${socials.ig}</span>
                <span class="social-tag ${socials.gh === 'available' ? 'tag-green' : 'tag-neutral'}">GH: ${socials.gh}</span>
                <span class="social-tag ${socials.tik === 'available' ? 'tag-green' : 'tag-neutral'}">TikTok: ${socials.tik}</span>
              </div>
            </div>
          </div>

          <div class="registrar-links">
            <span class="box-label" style="display:inline-block; margin-right: 12px;">Instant 1-Click Carts:</span>
            <a href="${links.porkbun}" target="_blank" rel="noopener noreferrer" class="link-btn">Porkbun ↗</a>
            <a href="${links.namecheap}" target="_blank" rel="noopener noreferrer" class="link-btn">Namecheap ↗</a>
            <a href="${links.cloudflare}" target="_blank" rel="noopener noreferrer" class="link-btn">Cloudflare ↗</a>
          </div>
        </div>
      `
    })
    .join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand Pitch Dossier - ${projectName}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg: #f8fafc;
      --card-bg: #ffffff;
      --border: #e2e8f0;
      --text-main: #0f172a;
      --text-muted: #64748b;
      --accent: #d97706;
      --accent-light: #fef3c7;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: var(--bg);
      color: var(--text-main);
      font-family: var(--font-sans);
      line-height: 1.5;
      padding: 0 0 60px 0;
      -webkit-font-smoothing: antialiased;
    }
    
    /* Top Sticky Action Toolbar */
    .top-toolbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(15, 23, 42, 0.95);
      backdrop-filter: blur(8px);
      color: #fff;
      padding: 12px 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    .top-toolbar .logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      font-size: 14px;
      letter-spacing: 0.5px;
    }
    .top-toolbar .logo-badge {
      background: #f59e0b;
      color: #000;
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 900;
    }
    .top-actions {
      display: flex;
      gap: 10px;
    }
    .btn-action {
      background: #ffffff;
      color: #0f172a;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      transition: all 0.15s ease;
    }
    .btn-action:hover {
      background: #f1f5f9;
      transform: translateY(-1px);
    }
    .btn-action.btn-primary {
      background: #f59e0b;
      color: #000;
    }
    .btn-action.btn-primary:hover {
      background: #d97706;
      color: #fff;
    }

    /* Container */
    .container {
      max-width: 1080px;
      margin: 40px auto 0;
      padding: 0 24px;
    }

    /* Executive Hero Header */
    .dossier-hero {
      background: #ffffff;
      border-radius: 20px;
      border: 1px solid var(--border);
      padding: 36px 40px;
      margin-bottom: 28px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04);
      position: relative;
      overflow: hidden;
    }
    .dossier-hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #f59e0b, #ec4899, #3b82f6);
    }
    .hero-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      font-family: var(--font-mono);
      font-size: 12px;
      color: var(--text-muted);
    }
    .hero-tag {
      background: #f1f5f9;
      color: #334155;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      font-size: 11px;
    }
    .hero-title {
      font-size: 32px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: var(--text-main);
      margin-bottom: 8px;
    }
    .hero-subtitle {
      font-size: 15px;
      color: var(--text-muted);
      max-width: 680px;
    }

    /* Valuation Metric Strip */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      margin-bottom: 32px;
    }
    .metric-card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 22px 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    }
    .metric-label {
      font-size: 11px;
      font-weight: 700;
      font-family: var(--font-mono);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: var(--text-muted);
      margin-bottom: 8px;
    }
    .metric-value {
      font-size: 28px;
      font-weight: 900;
      color: var(--text-main);
      line-height: 1.1;
    }
    .metric-sub {
      font-size: 12px;
      color: var(--text-muted);
      margin-top: 6px;
    }

    /* Section Headers */
    .section-title {
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 16px;
      color: var(--text-main);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Table */
    .table-container {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 36px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.03);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 13px;
    }
    thead {
      background: #f8fafc;
      border-bottom: 1px solid var(--border);
    }
    th {
      padding: 12px 16px;
      font-size: 11px;
      font-weight: 700;
      font-family: var(--font-mono);
      text-transform: uppercase;
      color: var(--text-muted);
      letter-spacing: 0.5px;
    }
    td {
      padding: 14px 16px;
      border-bottom: 1px solid #f1f5f9;
      vertical-align: middle;
    }
    tbody tr:last-child td {
      border-bottom: none;
    }
    tbody tr:hover {
      background: #fafbfd;
    }
    .domain-pill {
      font-family: var(--font-mono);
      font-size: 12px;
      color: #334155;
      background: #f1f5f9;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      font-family: var(--font-mono);
    }
    .badge-gray {
      background: #f1f5f9;
      color: #475569;
    }
    .badge-amber {
      background: #fef3c7;
      color: #92400e;
      border: 1px solid #fde68a;
    }
    .btn-buy {
      background: #0f172a;
      color: #ffffff;
      padding: 6px 12px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 700;
      font-size: 11px;
      font-family: var(--font-mono);
      transition: background 0.15s ease;
      display: inline-block;
    }
    .btn-buy:hover {
      background: #334155;
    }

    /* Individual Asset Cards */
    .assets-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-bottom: 40px;
    }
    .asset-card {
      background: #ffffff;
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.03);
      page-break-inside: avoid;
    }
    .asset-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 18px;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 16px;
    }
    .asset-number {
      font-size: 10px;
      font-weight: 800;
      font-family: var(--font-mono);
      color: var(--accent);
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .asset-title {
      font-size: 22px;
      font-weight: 900;
      color: var(--text-main);
    }
    .asset-domain {
      font-family: var(--font-mono);
      font-size: 13px;
      color: #64748b;
      margin-top: 2px;
    }
    .asset-price-box {
      text-align: right;
    }
    .price-val {
      font-size: 22px;
      font-weight: 900;
      color: var(--text-main);
    }
    .price-sub {
      font-size: 11px;
      color: var(--text-muted);
      font-family: var(--font-mono);
    }
    .asset-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }
    .asset-box {
      background: #f8fafc;
      border-radius: 12px;
      padding: 14px 16px;
      border: 1px solid #f1f5f9;
    }
    .box-label {
      font-size: 11px;
      font-weight: 700;
      font-family: var(--font-mono);
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 4px;
    }
    .box-val {
      font-size: 13px;
      font-weight: 700;
      color: var(--text-main);
      margin-bottom: 4px;
    }
    .box-desc {
      font-size: 12px;
      color: var(--text-muted);
    }
    .social-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 6px;
    }
    .social-tag {
      font-size: 11px;
      font-family: var(--font-mono);
      padding: 2px 7px;
      border-radius: 5px;
      font-weight: 600;
    }
    .tag-green {
      background: #dcfce7;
      color: #166534;
    }
    .tag-neutral {
      background: #f1f5f9;
      color: #475569;
    }
    .registrar-links {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 8px;
      padding-top: 12px;
      border-top: 1px solid #f8fafc;
    }
    .link-btn {
      font-size: 11px;
      font-weight: 700;
      font-family: var(--font-mono);
      color: #3b82f6;
      background: #eff6ff;
      border: 1px solid #dbeafe;
      padding: 4px 10px;
      border-radius: 6px;
      text-decoration: none;
      transition: all 0.15s ease;
    }
    .link-btn:hover {
      background: #3b82f6;
      color: #ffffff;
    }

    /* Footer */
    .dossier-footer {
      text-align: center;
      font-size: 12px;
      color: var(--text-muted);
      font-family: var(--font-mono);
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid var(--border);
    }

    /* Print Specific Styles */
    @media print {
      body {
        background: #ffffff !important;
        padding: 0 !important;
      }
      .top-toolbar {
        display: none !important;
      }
      .container {
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
      }
      .dossier-hero {
        border: 1px solid #cbd5e1 !important;
        box-shadow: none !important;
        page-break-after: avoid;
      }
      .metric-card, .table-container, .asset-card {
        border: 1px solid #cbd5e1 !important;
        box-shadow: none !important;
      }
      .btn-buy, .link-btn {
        display: none !important;
      }
      .asset-card {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
      @page {
        margin: 1.5cm;
        size: letter;
      }
    }
  </style>
</head>
<body>
  <!-- Sticky Action Toolbar (Hidden during Print) -->
  <div class="top-toolbar">
    <div class="logo">
      <span>GOMUMMY</span>
      <span class="logo-badge">EXECUTIVE PITCH</span>
      <span>//</span>
      <span style="color: #94a3b8; font-weight: 500;">BRAND DOSSIER</span>
    </div>
    <div class="top-actions">
      <button class="btn-action" onclick="copyMarkdown()">
        📋 Copy Markdown
      </button>
      <button class="btn-action btn-primary" onclick="window.print()">
        🖨️ Print / Save to PDF
      </button>
    </div>
  </div>

  <div class="container">
    <!-- Hero Header -->
    <div class="dossier-hero">
      <div class="hero-meta">
        <span class="hero-tag">CONFIDENTIAL</span>
        <span>DATE: ${dateStr.toUpperCase()}</span>
        <span>•</span>
        <span>${shortlist.length} ASSETS SHORTLISTED</span>
      </div>
      <h1 class="hero-title">${projectName}</h1>
      <p class="hero-subtitle">
        Comprehensive brand naming &amp; domain acquisition dossier. Prepared for founder alignment, executive review, and instant registrar acquisition.
      </p>
    </div>

    <!-- Valuation Metrics -->
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">1st-Year Initial Capital</div>
        <div class="metric-value">$${totalYr1.toFixed(2)}</div>
        <div class="metric-sub">Full portfolio registration cost</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Annual Recurring Renewal</div>
        <div class="metric-value">$${totalRenew.toFixed(2)}<span style="font-size:14px; color:#64748b; font-weight:500;">/yr</span></div>
        <div class="metric-sub">Subsequent yearly maintenance</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">3-Year Holding TCO</div>
        <div class="metric-value">$${total3Yr.toFixed(2)}</div>
        <div class="metric-sub">36-Month total domain ownership reserve</div>
      </div>
    </div>

    <!-- Portfolio Comparison Table -->
    <h2 class="section-title">⭐ Candidate Portfolio Matrix</h2>
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Brand Name</th>
            <th>Primary Domain</th>
            <th>Cadence</th>
            <th>Tone</th>
            <th>Year 1</th>
            <th>Renewal</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          ${rowsHtml}
        </tbody>
      </table>
    </div>

    <!-- Detailed Candidate Cards -->
    <h2 class="section-title">🔍 In-Depth Asset Profiles &amp; Acquisition Vectors</h2>
    <div class="assets-list">
      ${cardsHtml}
    </div>

    <!-- Acquisition Protocol -->
    <div class="asset-card" style="background: #f8fafc;">
      <h3 style="font-size: 16px; font-weight: 800; margin-bottom: 8px;">🛡️ Recommended Acquisition Protocol</h3>
      <ol style="font-size: 13px; color: #475569; padding-left: 20px; line-height: 1.8;">
        <li><strong>Consensus Lock:</strong> Align on the top 2 candidate domains with your founding team or investment committee.</li>
        <li><strong>Immediate Cart Registration:</strong> Use direct 1-click cart links to checkout immediately to prevent automated domain front-running.</li>
        <li><strong>Privacy &amp; Security:</strong> Ensure WHOIS Privacy Protection and DNSSEC are enabled upon checkout.</li>
        <li><strong>Trademark Clearance:</strong> Perform preliminary trademark clearance searches in primary target markets.</li>
      </ol>
    </div>

    <!-- Footer -->
    <div class="dossier-footer">
      Generated by GoMummy Tactical Brand Workstation • Confidential Brand Asset
    </div>
  </div>

  <script id="dossier-raw-md" type="text/plain">
${generateMarkdownDossier({ shortlist, projectName }).replace(/<\//g, '<\\/')}
  </script>
  <script>
    function copyMarkdown() {
      const raw = document.getElementById('dossier-raw-md');
      const text = raw ? raw.textContent.trim() : (document.title + "\\n" + window.location.href);
      navigator.clipboard.writeText(text).then(() => {
        const btn = document.querySelector('.btn-action');
        if (btn) {
          const old = btn.innerHTML;
          btn.innerHTML = '✓ Copied Markdown!';
          setTimeout(() => { btn.innerHTML = old; }, 2000);
        }
      });
    }
  </script>
</body>
</html>`
}

/**
 * Trigger client-side file download with zero backend
 */
export function downloadFile(content, filename, mimeType = 'text/plain;charset=utf-8') {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 1-Click Export Markdown Dossier
 */
export function exportDossierMarkdown(shortlist, projectName) {
  const md = generateMarkdownDossier({ shortlist, projectName })
  downloadFile(md, 'gomummy_brand_pitch_dossier.md', 'text/markdown;charset=utf-8')
}

/**
 * 1-Click Export HTML / Print-to-PDF Presentation
 */
export function exportDossierHtml(shortlist, projectName) {
  const html = generateHtmlDossier({ shortlist, projectName })
  downloadFile(html, 'gomummy_brand_pitch_presentation.html', 'text/html;charset=utf-8')
}

/**
 * 1-Click Copy Dossier Markdown to Clipboard
 */
export async function copyDossierMarkdown(shortlist, projectName) {
  const md = generateMarkdownDossier({ shortlist, projectName })
  try {
    await navigator.clipboard.writeText(md)
    return true
  } catch (err) {
    console.error('Clipboard copy error:', err)
    return false
  }
}
