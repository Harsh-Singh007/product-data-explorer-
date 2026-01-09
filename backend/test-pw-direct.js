const { chromium } = require('playwright');

async function test() {
    console.log('Launching browser...');
    try {
        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();
        console.log('Navigating...');
        await page.goto('https://www.worldofbooks.com/en-gb/collections/childrens-books', { waitUntil: 'networkidle' });
        const title = await page.title();
        console.log('Title:', title);
        const products = await page.$$('.product-card');
        console.log('Products found:', products.length);
        await browser.close();
    } catch (e) {
        console.error('Error:', e);
    }
}

test();
