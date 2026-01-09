const { chromium } = require('playwright');

async function test() {
    console.log('Launching browser...');
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const baseUrl = 'https://www.worldofbooks.com';
    const slug = 'fiction';

    // Logic from ScrapingService
    let targetUrl = `${baseUrl}/en-gb/collections/${slug}-books`;
    console.log(`Navigating to: ${targetUrl}`);

    try {
        await page.goto(targetUrl, { waitUntil: 'networkidle', timeout: 60000 });
        console.log('Page Title:', await page.title());

        const productSelectors = ['.ais-InfiniteHits-item', '.product-card-wrapper', '.card-wrapper', '.grid__item'];
        let foundSelector = '';

        for (const selector of productSelectors) {
            try {
                await page.waitForSelector(selector, { timeout: 10000 });
                foundSelector = selector;
                console.log(`Found products using selector: ${selector}`);
                break;
            } catch (e) {
                console.log(`Selector ${selector} not found`);
                continue;
            }
        }

        if (!foundSelector) {
            console.log('No selectors matched');
            await browser.close();
            return;
        }

        const products = await page.$$eval(foundSelector, (els) => {
            return els.map(el => {
                const titleEl = el.querySelector('.card__heading, h3, .h5');
                const priceEl = el.querySelector('.price-item--sale, .price-item--regular, .price-item, .price');
                const imgEl = el.querySelector('img');
                const linkEl = el.querySelector('a.full-unstyled-link, .card__heading a, a');

                if (!titleEl || !linkEl) return null;

                return {
                    title: titleEl.textContent?.trim() || '',
                    price: priceEl?.textContent?.trim() || '0',
                    sourceUrl: (linkEl).href,
                };
            }).filter(p => p && p.title);
        });

        console.log(`Found ${products.length} products`);
        if (products.length > 0) {
            console.log('First product:', products[0]);
        }

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
}

test();
