import puppeteer from 'file:///C:/Users/krish/OneDrive/Desktop/(All_&_Everything)/(All-Hackathons)/GraphHacks-Hackathon/Codebase/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import path from 'path';
import fs from 'fs';

const ARTIFACT_DIR = 'C:/Users/krish/.gemini/antigravity/brain/4f77465a-fb3e-4baf-b05c-27072bb0218f';
const BROWSER_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://cavdax-flagsmith.sahnirmaan.live';

async function runAudit() {
  console.log('[Puppeteer Audit] Launching Chrome at:', BROWSER_PATH);
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  const networkErrors = [];
  page.on('response', res => {
    if (res.status() >= 400 && !res.url().includes('favicon')) {
      networkErrors.push({ url: res.url(), status: res.status() });
    }
  });

  const results = {};

  try {
    // 1. Landing Page
    console.log('[1/6] Auditing Landing Page...');
    await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const landingShot = path.join(ARTIFACT_DIR, 'cavdax_flagsmith_landing_hero.png');
    await page.screenshot({ path: landingShot, fullPage: false });
    results.landing = { status: 'captured', path: landingShot };

    // 2. Flagsmith Blast Radius Console (/flags)
    console.log('[2/6] Auditing Flagsmith Blast Radius Console (/flags)...');
    await page.goto(`${BASE_URL}/flags`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2500));
    const flagsShot = path.join(ARTIFACT_DIR, 'cavdax_flagsmith_blast_radius_radar.png');
    await page.screenshot({ path: flagsShot, fullPage: false });
    results.flags = { status: 'captured', path: flagsShot };

    // 3. Test AST Inspector Tab on /flags
    console.log('[3/6] Testing AST Inspector Tab & Analysis...');
    const astTabBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('AST Code Inspector'));
    });
    if (astTabBtn && astTabBtn.asElement()) {
      await astTabBtn.asElement().click();
      await new Promise(r => setTimeout(r, 1200));

      const scanBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent && b.textContent.includes('Analyze Code AST'));
      });
      if (scanBtn && scanBtn.asElement()) {
        await scanBtn.asElement().click();
        await new Promise(r => setTimeout(r, 2500));
      }
    }
    const astShot = path.join(ARTIFACT_DIR, 'cavdax_flagsmith_ast_inspector.png');
    await page.screenshot({ path: astShot, fullPage: false });
    results.astInspector = { status: 'tested_and_captured', path: astShot };

    // 4. Connect MCP Page (/mcp)
    console.log('[4/6] Auditing Connect MCP Page (/mcp)...');
    await page.goto(`${BASE_URL}/mcp`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const mcpShot = path.join(ARTIFACT_DIR, 'cavdax_flagsmith_mcp_page.png');
    await page.screenshot({ path: mcpShot, fullPage: false });
    results.mcp = { status: 'captured', path: mcpShot };

    // 5. Audit Page (/audit)
    console.log('[5/6] Auditing Architecture Audit Page (/audit)...');
    await page.goto(`${BASE_URL}/audit`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const auditShot = path.join(ARTIFACT_DIR, 'cavdax_flagsmith_audit_page.png');
    await page.screenshot({ path: auditShot, fullPage: false });
    results.audit = { status: 'captured', path: auditShot };

    // 6. Tier Benefits Page (/tiers)
    console.log('[6/6] Auditing Tier Benefits Page (/tiers)...');
    await page.goto(`${BASE_URL}/tiers`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 2000));
    const tiersShot = path.join(ARTIFACT_DIR, 'cavdax_flagsmith_tier_benefits.png');
    await page.screenshot({ path: tiersShot, fullPage: false });
    results.tiers = { status: 'captured', path: tiersShot };

    console.log('AUDIT COMPLETE.');
    console.log('Console Errors:', consoleErrors.length);
    console.log('Network Errors:', networkErrors.length);
    if (consoleErrors.length > 0) console.log('Console Errors Sample:', consoleErrors.slice(0, 5));
    if (networkErrors.length > 0) console.log('Network Errors Sample:', networkErrors.slice(0, 5));

  } catch (err) {
    console.error('Audit failure:', err);
  } finally {
    await browser.close();
  }
}

runAudit();
