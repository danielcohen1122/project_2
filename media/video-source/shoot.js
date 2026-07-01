const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');

(async () => {
  const dir = '/tmp/claude-0/-home-user-project-2/cefb6be1-f20f-5ae5-aad8-4ae795c98c78/scratchpad';
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--no-sandbox','--force-color-profile=srgb','--font-render-hinting=none']
  });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  for (let i = 1; i <= 8; i++) {
    await page.goto('file://' + path.join(dir, 'scenes.html') + '?s=' + i, { waitUntil: 'networkidle' });
    await page.waitForFunction('window.__ready === true', { timeout: 15000 }).catch(()=>{});
    await page.waitForTimeout(400);
    const out = path.join(dir, 'frames', 'scene' + i + '.png');
    await page.screenshot({ path: out });
    console.log('shot', out);
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
