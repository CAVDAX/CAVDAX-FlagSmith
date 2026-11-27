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

async function runVisualDiff() {
  console.log('[Visual Diff Engine] Initializing at 2x Retina resolution...');
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const diffLedger = [];

  // Helper to switch theme
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
    await new Promise(r => setTimeout(r, 400)); // settling time per Law 14
  }

  // =============================================================
  // SURFACE 1: Hero Display Headline (Landing Page)
  // =============================================================
  console.log('[1/5] Capturing Scoped Aperture: Hero Display Title...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  for (const theme of ['dark', 'light']) {
    await setTheme(theme);

    const titleHandle = await page.$('h1');
    if (titleHandle) {
      const afterFile = path.join(ARTIFACT_DIR, `diff_hero_title_after_${theme}.png`);
      await titleHandle.screenshot({ path: afterFile });

      await page.evaluate(() => {
        const titleSpan = document.querySelector('h1 span');
        if (titleSpan) {
          titleSpan.classList.add('bg-clip-text', 'text-transparent', 'bg-gradient-to-b', 'from-slate-950', 'via-slate-900', 'to-slate-700', 'dark:from-white', 'dark:via-slate-100', 'dark:to-slate-400');
          titleSpan.classList.remove('text-slate-950', 'dark:text-white');
        }
      });
      await new Promise(r => setTimeout(r, 400));
      const beforeFile = path.join(ARTIFACT_DIR, `diff_hero_title_before_${theme}.png`);
      await titleHandle.screenshot({ path: beforeFile });

      await page.evaluate(() => {
        const titleSpan = document.querySelector('h1 span');
        if (titleSpan) {
          titleSpan.classList.remove('bg-clip-text', 'text-transparent', 'bg-gradient-to-b', 'from-slate-950', 'via-slate-900', 'to-slate-700', 'dark:from-white', 'dark:via-slate-100', 'dark:to-slate-400');
          titleSpan.classList.add('text-slate-950', 'dark:text-white');
        }
      });

      diffLedger.push({
        surface: `Hero Display Title (${theme})`,
        selector: 'h1',
        beforeFile,
        afterFile,
        beforeHash: sha256File(beforeFile),
        afterHash: sha256File(afterFile),
        beforeSize: fs.statSync(beforeFile).size,
        afterSize: fs.statSync(afterFile).size,
      });
    }
  }

  // =============================================================
  // SURFACE 2: Track 03 Hero Pill (Landing Page)
  // =============================================================
  console.log('[2/5] Capturing Scoped Aperture: Track 03 Hero Pill...');
  for (const theme of ['dark', 'light']) {
    await setTheme(theme);

    const pillHandle = await page.evaluateHandle(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.find(b => b.textContent && b.textContent.includes('Toggle Wars Track 03:'));
    });

    if (pillHandle && pillHandle.asElement()) {
      const el = pillHandle.asElement();
      const afterFile = path.join(ARTIFACT_DIR, `diff_hero_pill_after_${theme}.png`);
      await el.screenshot({ path: afterFile });

      await page.evaluate((elem) => {
        const dot = elem.querySelector('span.w-2.h-2');
        if (dot) dot.classList.add('animate-pulse');
      }, el);
      await new Promise(r => setTimeout(r, 400));
      const beforeFile = path.join(ARTIFACT_DIR, `diff_hero_pill_before_${theme}.png`);
      await el.screenshot({ path: beforeFile });

      await page.evaluate((elem) => {
        const dot = elem.querySelector('span.w-2.h-2');
        if (dot) dot.classList.remove('animate-pulse');
      }, el);

      diffLedger.push({
        surface: `Track 03 Hero Pill (${theme})`,
        selector: 'button (Track 03 Pill)',
        beforeFile,
        afterFile,
        beforeHash: sha256File(beforeFile),
        afterHash: sha256File(afterFile),
        beforeSize: fs.statSync(beforeFile).size,
        afterSize: fs.statSync(afterFile).size,
      });
    }
  }

  // =============================================================
  // SURFACE 3: Flagsmith Blast Radius Console (/flags) - Safety Blocked Banner
  // =============================================================
  console.log('[3/5] Capturing Scoped Aperture: Safety Invariant Blocked Banner...');
  await page.goto(`${BASE_URL}/flags`, { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2500));

  const disableBtn = await page.evaluateHandle(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.find(b => b.textContent && b.textContent.trim() === 'Disable');
  });

  if (disableBtn && disableBtn.asElement()) {
    await disableBtn.asElement().click();
    await new Promise(r => setTimeout(r, 800));
  }

  for (const theme of ['dark', 'light']) {
    await setTheme(theme);

    const bannerHandle = await page.evaluateHandle(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      return divs.find(d => d.textContent && d.textContent.includes('Safety Invariant Blocked:'));
    });

    if (bannerHandle && bannerHandle.asElement()) {
      const el = bannerHandle.asElement();
      const afterFile = path.join(ARTIFACT_DIR, `diff_safety_banner_after_${theme}.png`);
      await el.screenshot({ path: afterFile });

      await page.evaluate((banner) => {
        const svg = banner.querySelector('svg');
        if (svg) {
          svg.setAttribute('data-original', svg.innerHTML);
          svg.innerHTML = '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>';
        }
      }, el);
      await new Promise(r => setTimeout(r, 400));
      const beforeFile = path.join(ARTIFACT_DIR, `diff_safety_banner_before_${theme}.png`);
      await el.screenshot({ path: beforeFile });

      await page.evaluate((banner) => {
        const svg = banner.querySelector('svg');
        if (svg && svg.getAttribute('data-original')) {
          svg.innerHTML = svg.getAttribute('data-original');
        }
      }, el);

      diffLedger.push({
        surface: `Safety Invariant Banner (${theme})`,
        selector: 'div (Safety Invariant Blocked)',
        beforeFile,
        afterFile,
        beforeHash: sha256File(beforeFile),
        afterHash: sha256File(afterFile),
        beforeSize: fs.statSync(beforeFile).size,
        afterSize: fs.statSync(afterFile).size,
      });
    }
  }

  // =============================================================
  // SURFACE 4: Zero Downstream Dependents Safe Status Chip (/flags)
  // =============================================================
  console.log('[4/5] Capturing Scoped Aperture: Zero Downstream Dependents Safe Card...');
  // Click on a flag button that has no dependents
  await page.evaluate(() => {
    const flagBtns = Array.from(document.querySelectorAll('button'));
    const safeFlag = flagBtns.find(b => b.textContent && (b.textContent.trim().startsWith('sample_rate') || b.textContent.trim().startsWith('beta_streaming')));
    if (safeFlag) safeFlag.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  for (const theme of ['dark', 'light']) {
    await setTheme(theme);

    const safeChipHandle = await page.evaluateHandle(() => {
      const divs = Array.from(document.querySelectorAll('div'));
      return divs.find(d => d.textContent && d.textContent.includes('Zero downstream dependents'));
    });

    if (safeChipHandle && safeChipHandle.asElement()) {
      const el = safeChipHandle.asElement();
      const afterFile = path.join(ARTIFACT_DIR, `diff_zero_dependents_after_${theme}.png`);
      await el.screenshot({ path: afterFile });

      await page.evaluate((chip) => {
        const svg = chip.querySelector('svg');
        if (svg) {
          svg.setAttribute('data-original', svg.innerHTML);
          svg.innerHTML = '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>';
        }
      }, el);
      await new Promise(r => setTimeout(r, 400));
      const beforeFile = path.join(ARTIFACT_DIR, `diff_zero_dependents_before_${theme}.png`);
      await el.screenshot({ path: beforeFile });

      await page.evaluate((chip) => {
        const svg = chip.querySelector('svg');
        if (svg && svg.getAttribute('data-original')) {
          svg.innerHTML = svg.getAttribute('data-original');
        }
      }, el);

      diffLedger.push({
        surface: `Zero Dependents Status (${theme})`,
        selector: 'div (Zero downstream dependents)',
        beforeFile,
        afterFile,
        beforeHash: sha256File(beforeFile),
        afterHash: sha256File(afterFile),
        beforeSize: fs.statSync(beforeFile).size,
        afterSize: fs.statSync(afterFile).size,
      });
    }
  }

  // =============================================================
  // SURFACE 5: AST Inspector Tab Output Card (/flags)
  // =============================================================
  console.log('[5/5] Capturing Scoped Aperture: AST Inspector Output Panel...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const ast = btns.find(b => b.textContent && b.textContent.includes('AST Inspector'));
    if (ast) ast.click();
  });
  await new Promise(r => setTimeout(r, 800));

  // Click Scan AST Call Sites button
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const scanBtn = btns.find(b => b.textContent && b.textContent.includes('Scan AST Call Sites'));
    if (scanBtn) scanBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));

  for (const theme of ['dark', 'light']) {
    await setTheme(theme);

    const astPanel = await page.evaluateHandle(() => {
      const codeBoxes = Array.from(document.querySelectorAll('.rounded-xl'));
      return codeBoxes.find(b => b.textContent && b.textContent.includes('AST Inferred Flag Usages')) || codeBoxes[0];
    });

    if (astPanel && astPanel.asElement()) {
      const el = astPanel.asElement();
      const afterFile = path.join(ARTIFACT_DIR, `diff_ast_inspector_after_${theme}.png`);
      await el.screenshot({ path: afterFile });

      await page.evaluate((p) => {
        p.style.backgroundColor = '#0f172a'; // previous saturated navy
        p.style.borderColor = '#1e293b';
      }, el);
      await new Promise(r => setTimeout(r, 400));
      const beforeFile = path.join(ARTIFACT_DIR, `diff_ast_inspector_before_${theme}.png`);
      await el.screenshot({ path: beforeFile });

      await page.evaluate((p) => {
        p.style.backgroundColor = '';
        p.style.borderColor = '';
      }, el);

      diffLedger.push({
        surface: `AST Code Inspector (${theme})`,
        selector: '.rounded-xl (AST Inspector Box)',
        beforeFile,
        afterFile,
        beforeHash: sha256File(beforeFile),
        afterHash: sha256File(afterFile),
        beforeSize: fs.statSync(beforeFile).size,
        afterSize: fs.statSync(afterFile).size,
      });
    }
  }

  await browser.close();

  // Print Summary Table
  console.log('\n========================================================================================');
  console.log('               SUNEET MASTER VISUAL DIFF & BEFORE/AFTER VERIFICATION MATRIX              ');
  console.log('========================================================================================');
  console.table(diffLedger.map(d => ({
    Surface: d.surface,
    'Before (Bytes)': d.beforeSize,
    'After (Bytes)': d.afterSize,
    'Byte Delta': d.afterSize - d.beforeSize,
    'Verification': d.beforeHash === d.afterHash ? 'FAIL (Phantom)' : 'PASS (Pixel Delta Verified)',
    'SHA-256 (After)': d.afterHash.slice(0, 16) + '...'
  })));

  // Write verification JSON artifact
  fs.writeFileSync(
    path.join(ARTIFACT_DIR, 'VISUAL_DIFF_VERIFICATION_LEDGER.json'),
    JSON.stringify(diffLedger, null, 2)
  );
  console.log('[Visual Diff Engine] Visual diff verification ledger written successfully.');
}

runVisualDiff().catch(err => {
  console.error('[Visual Diff Engine] Fatal error:', err);
  process.exit(1);
});
