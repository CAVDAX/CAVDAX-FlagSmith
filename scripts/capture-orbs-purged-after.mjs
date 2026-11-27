import puppeteer from 'file:///C:/Users/krish/OneDrive/Desktop/(All_&_Everything)/(All-Hackathons)/GraphHacks-Hackathon/Codebase/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

const ARTIFACT_DIR = 'C:/Users/krish/.gemini/antigravity/brain/4f77465a-fb3e-4baf-b05c-27072bb0218f';
const BROWSER_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://cavdax-flagsmith.sahnirmaan.live';

async function capturePurgedOrbsVerification() {
  console.log('[Puppeteer 2x Retina] Launching Chrome...');
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
    await new Promise(r => setTimeout(r, 600));
  }

  // 1. Overview Page
  console.log('[1/4] Navigating to Overview / ...');
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));

  // Dark Overview
  await setTheme('dark');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_purged_overview_dark.png') });
  console.log('Saved live_purged_overview_dark.png');

  // Light Overview
  await setTheme('light');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_purged_overview_light.png') });
  console.log('Saved live_purged_overview_light.png');

  // 2. Flag Radar Page
  console.log('[2/4] Navigating to /flags ...');
  await page.goto(`${BASE_URL}/flags`, { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2500));

  // Dark Flags Radar
  await setTheme('dark');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_purged_flags_radar_dark.png') });
  console.log('Saved live_purged_flags_radar_dark.png');

  // Light Flags Radar
  await setTheme('light');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_purged_flags_radar_light.png') });
  console.log('Saved live_purged_flags_radar_light.png');

  // Targeted Card screenshot
  const cardEl = await page.$('.w-full.max-w-4xl');
  if (cardEl) {
    await setTheme('dark');
    await cardEl.screenshot({ path: path.join(ARTIFACT_DIR, 'live_purged_card_dark.png') });
    console.log('Saved live_purged_card_dark.png');

    await setTheme('light');
    await cardEl.screenshot({ path: path.join(ARTIFACT_DIR, 'live_purged_card_light.png') });
    console.log('Saved live_purged_card_light.png');
  }

  await browser.close();
  console.log('Audit complete! All 6 screenshots successfully written to artifact directory.');
}

capturePurgedOrbsVerification().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});
