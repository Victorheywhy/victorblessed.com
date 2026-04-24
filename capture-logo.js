const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();

  await page.setViewport({ width: 500, height: 500, deviceScaleFactor: 2 });

  const filePath = 'file:///' + path.resolve('logo-export.html').replace(/\\/g, '/');
  await page.goto(filePath, { waitUntil: 'networkidle0' });

  // Wait for font to load
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({
    path: 'victor-blessed-logo.png',
    omitBackground: true,
    fullPage: false
  });

  console.log('✅ PNG saved: victor-blessed-logo.png');
  await browser.close();
})();
