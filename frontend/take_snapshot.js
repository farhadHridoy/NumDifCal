const puppeteer = require('puppeteer');

(async () => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1080 });
    
    page.setDefaultNavigationTimeout(60000);
    
    console.log("Navigating to home...");
    await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 2000));
    await page.screenshot({ path: 'C:\\Users\\farhad\\.gemini\\antigravity-ide\\brain\\0979ab73-d1a5-4d6a-9508-a8070653f136\\snapshot_home.png', fullPage: true });
    
    console.log("Navigating to calculator...");
    await page.goto('http://localhost:3000/calculator', { waitUntil: 'domcontentloaded' });
    // wait for animations and build
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({ path: 'C:\\Users\\farhad\\.gemini\\antigravity-ide\\brain\\0979ab73-d1a5-4d6a-9508-a8070653f136\\snapshot_calculator.png' });
    
    console.log("Loading example...");
    // Click 'Load Example'
    const loadExampleBtn = await page.$('button[aria-label="Load example"]');
    if (loadExampleBtn) {
        await loadExampleBtn.click();
        await new Promise(r => setTimeout(r, 1000));
        
        // Click the first example
        const examples = await page.$$('button:has-text("Cubic")');
        if (examples.length > 0) {
             await examples[0].click();
             await new Promise(r => setTimeout(r, 1000));
             
             // Click Calculate
             const calcBtn = await page.$('button[aria-label="Calculate derivative"]');
             if (calcBtn) {
                 await calcBtn.click();
                 await new Promise(r => setTimeout(r, 5000)); // wait for api
                 await page.screenshot({ path: 'C:\\Users\\farhad\\.gemini\\antigravity-ide\\brain\\0979ab73-d1a5-4d6a-9508-a8070653f136\\snapshot_result.png', fullPage: true });
             }
        }
    }

    console.log("Snapshots taken successfully.");
    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
