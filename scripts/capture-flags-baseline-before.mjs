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

async function captureBaseline() {
  console.log('[Flags Baseline Photography] Launching Puppeteer at 2x Retina...');
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

  for (const theme of ['dark', 'light']) {
    console.log(`[Baseline Photography] Capturing ${theme.toUpperCase()} theme surfaces...`);
    await setTheme(theme);

    // 1. Full Flag Radar Card
    const cardHandle = await page.$('.w-full.max-w-4xl');
    if (cardHandle) {
      const cardPath = path.join(ARTIFACT_DIR, `diff_flags_card_before_${theme}.png`);
      await cardHandle.screenshot({ path: cardPath });
      console.log(`  -> Saved ${cardPath} (${sha256File(cardPath).slice(0, 16)}...)`);
    }

    // 2. Feature Selector Strip
    const selectorHandle = await page.$('.flex.flex-wrap.gap-2');
    if (selectorHandle) {
      const selectorPath = path.join(ARTIFACT_DIR, `diff_flags_selector_before_${theme}.png`);
      await selectorHandle.screenshot({ path: selectorPath });
      console.log(`  -> Saved ${selectorPath} (${sha256File(selectorPath).slice(0, 16)}...)`);
    }

    // 3. Upstream Prerequisites Column (The 3rd column in the grid)
    const gridCols = await page.$$('.grid.grid-cols-1.md\\:grid-cols-3 > div');
    if (gridCols.length >= 3) {
      const upstreamPath = path.join(ARTIFACT_DIR, `diff_flags_upstream_before_${theme}.png`);
      await gridCols[2].screenshot({ path: upstreamPath });
      console.log(`  -> Saved Upstream Col: ${upstreamPath} (${sha256File(upstreamPath).slice(0, 16)}...)`);
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
        const astPath = path.join(ARTIFACT_DIR, `diff_flags_ast_before_${theme}.png`);
        await astPanel.screenshot({ path: astPath });
        console.log(`  -> Saved AST Panel: ${astPath} (${sha256File(astPath).slice(0, 16)}...)`);
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
  console.log('[Baseline Photography] Successfully recorded all BEFORE surfaces.');
}

captureBaseline().catch(err => {
  console.error('[Baseline Photography] Error:', err);
  process.exit(1);
});
