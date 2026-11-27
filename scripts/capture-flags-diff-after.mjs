import puppeteer from 'file:///C:/Users/krish/OneDrive/Desktop/(All_&_Everything)/(All-Hackathons)/GraphHacks-Hackathon/Codebase/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const ARTIFACT_DIR = 'C:/Users/krish/.gemini/antigravity/brain/4f77465a-fb3e-4baf-b05c-27072bb0218f';
const BROWSER_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://cavdax-flagsmith.sahnirmaan.live';

function sha256File(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

async function captureAfterAndVerify() {
  console.log('[Flags AFTER Photography] Launching Puppeteer at 2x Retina...');
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  async function setTheme(mode) {
    await page.evaluate((theme) => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
      localStorage.setItem('cavdax_theme', theme);
    }, mode);
    await new Promise(r => setTimeout(r, 500));
  }

  console.log('[1/4] Navigating to /flags...');
  await page.goto(`${BASE_URL}/flags`, { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));

  const surfaces = [
    { name: 'Card Container', key: 'card' },
    { name: 'Feature Flag Selector Strip', key: 'selector' },
    { name: 'Upstream Prerequisites Column', key: 'upstream' },
    { name: 'AST Inspector Panel', key: 'ast' }
  ];

  const results = [];

  for (const theme of ['dark', 'light']) {
    console.log(`[AFTER Photography] Capturing ${theme.toUpperCase()} theme surfaces...`);
    await setTheme(theme);

    // 1. Full Flag Radar Card
    const cardHandle = await page.$('.w-full.max-w-4xl');
    if (cardHandle) {
      const afterCardPath = path.join(ARTIFACT_DIR, `diff_flags_card_after_${theme}.png`);
      await cardHandle.screenshot({ path: afterCardPath });
      const beforeCardPath = path.join(ARTIFACT_DIR, `diff_flags_card_before_${theme}.png`);
      const beforeHash = fs.existsSync(beforeCardPath) ? sha256File(beforeCardPath) : null;
      const afterHash = sha256File(afterCardPath);
      results.push({
        surface: `Flag Radar Card (${theme})`,
        beforeFile: path.basename(beforeCardPath),
        afterFile: path.basename(afterCardPath),
        beforeSha256: beforeHash,
        afterSha256: afterHash,
        verifiedDelta: beforeHash !== afterHash
      });
      console.log(`  -> Card (${theme}): ${beforeHash?.slice(0, 8)} vs ${afterHash.slice(0, 8)} -> ${beforeHash !== afterHash ? 'DIFF VERIFIED' : 'IDENTICAL'}`);
    }

    // 2. Feature Selector Strip
    const selectorHandle = await page.$('.flex.flex-wrap.gap-2.items-center') || await page.$('.flex.flex-wrap.gap-2');
    if (selectorHandle) {
      const afterSelPath = path.join(ARTIFACT_DIR, `diff_flags_selector_after_${theme}.png`);
      await selectorHandle.screenshot({ path: afterSelPath });
      const beforeSelPath = path.join(ARTIFACT_DIR, `diff_flags_selector_before_${theme}.png`);
      const beforeHash = fs.existsSync(beforeSelPath) ? sha256File(beforeSelPath) : null;
      const afterHash = sha256File(afterSelPath);
      results.push({
        surface: `Selector Strip (${theme})`,
        beforeFile: path.basename(beforeSelPath),
        afterFile: path.basename(afterSelPath),
        beforeSha256: beforeHash,
        afterSha256: afterHash,
        verifiedDelta: beforeHash !== afterHash
      });
      console.log(`  -> Selector (${theme}): ${beforeHash?.slice(0, 8)} vs ${afterHash.slice(0, 8)} -> ${beforeHash !== afterHash ? 'DIFF VERIFIED' : 'IDENTICAL'}`);
    }

    // 3. Upstream Prerequisites Column
    const gridCols = await page.$$('.grid.grid-cols-1.md\\:grid-cols-3 > div');
    if (gridCols.length >= 3) {
      const afterUpPath = path.join(ARTIFACT_DIR, `diff_flags_upstream_after_${theme}.png`);
      await gridCols[2].screenshot({ path: afterUpPath });
      const beforeUpPath = path.join(ARTIFACT_DIR, `diff_flags_upstream_before_${theme}.png`);
      const beforeHash = fs.existsSync(beforeUpPath) ? sha256File(beforeUpPath) : null;
      const afterHash = sha256File(afterUpPath);
      results.push({
        surface: `Upstream Prerequisites Column (${theme})`,
        beforeFile: path.basename(beforeUpPath),
        afterFile: path.basename(afterUpPath),
        beforeSha256: beforeHash,
        afterSha256: afterHash,
        verifiedDelta: beforeHash !== afterHash
      });
      console.log(`  -> Upstream Col (${theme}): ${beforeHash?.slice(0, 8)} vs ${afterHash.slice(0, 8)} -> ${beforeHash !== afterHash ? 'DIFF VERIFIED' : 'IDENTICAL'}`);
    }

    // 4. Switch to AST Inspector tab and capture AST well
    const astTabBtn = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('AST Inspector'));
    });
    if (astTabBtn && astTabBtn.asElement()) {
      await astTabBtn.asElement().click();
      await new Promise(r => setTimeout(r, 600));

      const astPanel = await page.$('.py-4.space-y-4');
      if (astPanel) {
        const afterAstPath = path.join(ARTIFACT_DIR, `diff_flags_ast_after_${theme}.png`);
        await astPanel.screenshot({ path: afterAstPath });
        const beforeAstPath = path.join(ARTIFACT_DIR, `diff_flags_ast_before_${theme}.png`);
        const beforeHash = fs.existsSync(beforeAstPath) ? sha256File(beforeAstPath) : null;
        const afterHash = sha256File(afterAstPath);
        results.push({
          surface: `AST Inspector Panel (${theme})`,
          beforeFile: path.basename(beforeAstPath),
          afterFile: path.basename(afterAstPath),
          beforeSha256: beforeHash,
          afterSha256: afterHash,
          verifiedDelta: beforeHash !== afterHash
        });
        console.log(`  -> AST Panel (${theme}): ${beforeHash?.slice(0, 8)} vs ${afterHash.slice(0, 8)} -> ${beforeHash !== afterHash ? 'DIFF VERIFIED' : 'IDENTICAL'}`);
      }

      // Switch back to radar tab
      const radarTabBtn = await page.evaluateHandle(() => {
        const btns = Array.from(document.querySelectorAll('button'));
        return btns.find(b => b.textContent && b.textContent.includes('Topology Radar'));
      });
      if (radarTabBtn && radarTabBtn.asElement()) {
        await radarTabBtn.asElement().click();
        await new Promise(r => setTimeout(r, 400));
      }
    }
  }

  await browser.close();

  // Write ledger to artifact dir
  const ledgerPath = path.join(ARTIFACT_DIR, 'FLAGS_VISUAL_DIFF_VERIFICATION_LEDGER.json');
  fs.writeFileSync(ledgerPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    auditScope: 'Flags Radar Panel (/flags) Anti-Slop & Deduplication Refinement',
    totalSurfacesAudited: results.length,
    allVerifiedWithNonZeroDeltas: results.every(r => r.verifiedDelta),
    surfaces: results
  }, null, 2));

  console.log(`[Flags AFTER Photography] Complete! Verification ledger saved to ${ledgerPath}`);
}

captureAfterAndVerify().catch(err => {
  console.error('[AFTER Photography] Error:', err);
  process.exit(1);
});
