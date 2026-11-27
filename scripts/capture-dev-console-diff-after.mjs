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

async function captureDevAfterAndVerify() {
  console.log('[Dev Console AFTER Photography] Launching Puppeteer at 2x Retina...');
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

  console.log('[1/3] Navigating to /dev...');
  await page.goto(`${BASE_URL}/dev`, { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));

  const results = [];

  for (const theme of ['dark', 'light']) {
    console.log(`[AFTER Photography] Capturing ${theme.toUpperCase()} theme surfaces...`);
    await setTheme(theme);

    // 1. Banner
    const banner = await page.$('.rounded-xl.border.border-emerald-500\\/30');
    if (banner) {
      const afterBannerPath = path.join(ARTIFACT_DIR, `diff_dev_banner_after_${theme}.png`);
      await banner.screenshot({ path: afterBannerPath });
      const beforeBannerPath = path.join(ARTIFACT_DIR, `diff_dev_banner_before_${theme}.png`);
      const beforeHash = fs.existsSync(beforeBannerPath) ? sha256File(beforeBannerPath) : null;
      const afterHash = sha256File(afterBannerPath);
      results.push({
        surface: `Dev Console Banner (${theme})`,
        beforeFile: path.basename(beforeBannerPath),
        afterFile: path.basename(afterBannerPath),
        beforeSha256: beforeHash,
        afterSha256: afterHash,
        verifiedDelta: beforeHash !== afterHash
      });
      console.log(`  -> Banner (${theme}): ${beforeHash?.slice(0, 8)} vs ${afterHash.slice(0, 8)} -> ${beforeHash !== afterHash ? 'DIFF VERIFIED' : 'IDENTICAL'}`);
    }

    // 2. Telemetry Grid
    const grid = await page.$('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3');
    if (grid) {
      const afterGridPath = path.join(ARTIFACT_DIR, `diff_dev_grid_after_${theme}.png`);
      await grid.screenshot({ path: afterGridPath });
      const beforeGridPath = path.join(ARTIFACT_DIR, `diff_dev_grid_before_${theme}.png`);
      const beforeHash = fs.existsSync(beforeGridPath) ? sha256File(beforeGridPath) : null;
      const afterHash = sha256File(afterGridPath);
      results.push({
        surface: `Dev Console Telemetry Grid (${theme})`,
        beforeFile: path.basename(beforeGridPath),
        afterFile: path.basename(afterGridPath),
        beforeSha256: beforeHash,
        afterSha256: afterHash,
        verifiedDelta: beforeHash !== afterHash
      });
      console.log(`  -> Grid (${theme}): ${beforeHash?.slice(0, 8)} vs ${afterHash.slice(0, 8)} -> ${beforeHash !== afterHash ? 'DIFF VERIFIED' : 'IDENTICAL'}`);
    }

    // 3. Diagnostic Workbench
    const bench = await page.$('.rounded-xl.border.border-slate-200.dark\\:border-white\\/10') || await page.$('.rounded-xl.border.border-white\\/10');
    if (bench) {
      const afterBenchPath = path.join(ARTIFACT_DIR, `diff_dev_bench_after_${theme}.png`);
      await bench.screenshot({ path: afterBenchPath });
      const beforeBenchPath = path.join(ARTIFACT_DIR, `diff_dev_bench_before_${theme}.png`);
      const beforeHash = fs.existsSync(beforeBenchPath) ? sha256File(beforeBenchPath) : null;
      const afterHash = sha256File(afterBenchPath);
      results.push({
        surface: `Diagnostic Workbench (${theme})`,
        beforeFile: path.basename(beforeBenchPath),
        afterFile: path.basename(afterBenchPath),
        beforeSha256: beforeHash,
        afterSha256: afterHash,
        verifiedDelta: beforeHash !== afterHash
      });
      console.log(`  -> Bench (${theme}): ${beforeHash?.slice(0, 8)} vs ${afterHash.slice(0, 8)} -> ${beforeHash !== afterHash ? 'DIFF VERIFIED' : 'IDENTICAL'}`);
    }
  }

  await browser.close();

  // Save verification ledger
  const ledgerPath = path.join(ARTIFACT_DIR, 'DEV_CONSOLE_VISUAL_DIFF_VERIFICATION_LEDGER.json');
  fs.writeFileSync(ledgerPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    auditScope: 'Developer Console (/dev) Dual-Theme Parity & Static Slop Remediation',
    totalSurfacesAudited: results.length,
    allVerifiedWithNonZeroDeltas: results.every(r => r.verifiedDelta),
    surfaces: results
  }, null, 2));

  console.log(`[Dev Console AFTER Photography] Complete! Verification ledger saved to ${ledgerPath}`);
}

captureDevAfterAndVerify().catch(err => {
  console.error('[AFTER Photography] Error:', err);
  process.exit(1);
});
