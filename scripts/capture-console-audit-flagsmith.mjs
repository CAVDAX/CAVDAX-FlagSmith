import puppeteer from 'file:///C:/Users/krish/OneDrive/Desktop/(All_&_Everything)/(All-Hackathons)/GraphHacks-Hackathon/Codebase/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/krish/.gemini/antigravity/brain/4f77465a-fb3e-4baf-b05c-27072bb0218f';
const BROWSER_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'https://cavdax-flagsmith.sahnirmaan.live';

async function run() {
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

  // Console page
  console.log('Capturing Console...');
  await page.goto(`${BASE_URL}/console`, { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));
  await setTheme('dark');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_flagsmith_console_dark.png') });
  await setTheme('light');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_flagsmith_console_light.png') });

  // Audit page
  console.log('Capturing Audit...');
  await page.goto(`${BASE_URL}/audit`, { waitUntil: 'networkidle2', timeout: 35000 });
  await new Promise(r => setTimeout(r, 2000));
  await setTheme('dark');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_flagsmith_audit_dark.png') });
  await setTheme('light');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_flagsmith_audit_light.png') });

  await browser.close();
  console.log('Captured Console & Audit successfully!');
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
