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

async function auditDevConsole() {
  console.log('[Dev Console Slop Audit] Launching Puppeteer at 2x Retina...');
  const browser = await puppeteer.launch({
    executablePath: BROWSER_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });

  const consoleLogs = [];
  page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

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

  console.log('[1/3] Navigating to /dev...');
  await page.goto(`${BASE_URL}/dev`, { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));

  for (const theme of ['dark', 'light']) {
    console.log(`[Dev Console Audit] Capturing ${theme.toUpperCase()} mode...`);
    await setTheme(theme);

    // Full viewport capture
    const fullPath = path.join(ARTIFACT_DIR, `dev_console_audit_${theme}.png`);
    await page.screenshot({ path: fullPath, fullPage: false });
    console.log(`  -> Full Viewport (${theme}): ${fullPath} (${sha256File(fullPath).slice(0, 16)}...)`);

    // Banner capture
    const banner = await page.$('.rounded-xl.border.border-emerald-500\\/30');
    if (banner) {
      const bannerPath = path.join(ARTIFACT_DIR, `diff_dev_banner_before_${theme}.png`);
      await banner.screenshot({ path: bannerPath });
      console.log(`  -> Banner (${theme}): ${bannerPath} (${sha256File(bannerPath).slice(0, 16)}...)`);
    }

    // Grid capture
    const grid = await page.$('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    if (grid) {
      const gridPath = path.join(ARTIFACT_DIR, `diff_dev_grid_before_${theme}.png`);
      await grid.screenshot({ path: gridPath });
      console.log(`  -> Grid (${theme}): ${gridPath} (${sha256File(gridPath).slice(0, 16)}...)`);
    }

    // Diagnostic Workbench capture
    const bench = await page.$('.rounded-xl.border.border-white\\/10.bg-\\[\\#0B0D11\\]:last-child') || await page.$('.rounded-xl.border.border-white\\/10');
    if (bench) {
      const benchPath = path.join(ARTIFACT_DIR, `diff_dev_bench_before_${theme}.png`);
      await bench.screenshot({ path: benchPath });
      console.log(`  -> Bench (${theme}): ${benchPath} (${sha256File(benchPath).slice(0, 16)}...)`);
    }
  }

  await browser.close();
  console.log('[Dev Console Slop Audit] Complete! Console logs recorded:', consoleLogs.length);
}

auditDevConsole().catch(err => {
  console.error('[Dev Console Audit] Error:', err);
  process.exit(1);
});
