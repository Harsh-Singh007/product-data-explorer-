const { chromium } = require('playwright');
const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_d58NSkyVrQgH@ep-snowy-salad-ahe5h27u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function scrapeSingleProduct(browser, pg, prod) {
    const page = await browser.newPage();
    try {
        console.log(`📖 Scraping: ${prod.title}`);
        await page.goto(prod.sourceUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

        await Promise.race([
            page.waitForSelector('section[id*="product_accordion_summary"]', { timeout: 10000 }),
            page.waitForSelector('.additional-info-table', { timeout: 10000 }),
            page.waitForSelector('.product__description', { timeout: 10000 }),
            page.waitForSelector('.panel', { timeout: 10000 })
        ]).catch(() => { });

        const description = await page.$eval('section[id*="product_accordion_summary"] .panel, .product-accordion .panel, .panel, .product__description, [id*="description"]', el => el.textContent?.trim() || '').catch(() => '');

        const specs = {};
        try {
            const rows = await page.$$('.additional-info-table tr, .product-details__item');
            for (const row of rows) {
                const label = await row.$eval('td:nth-child(1), .label', el => el.textContent?.trim()).catch(() => '');
                const value = await row.$eval('td:nth-child(2), .value', el => el.textContent?.trim()).catch(() => '');
                if (label && value) {
                    const key = label.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');
                    if (key) specs[key] = value;
                }
            }
        } catch (e) { }

        console.log(`  ✨ ${prod.title}: Description length: ${description.length}`);

        await pg.query(
            `INSERT INTO product_detail ("productId", description, specs) 
             VALUES ($1, $2, $3) 
             ON CONFLICT ("productId") DO UPDATE SET description = $2, specs = $3`,
            [prod.id, description || 'This treasure is waiting for its next reader.', JSON.stringify(specs)]
        );
    } catch (err) {
        console.error(`  ❌ Error for ${prod.title}: ${err.message}`);
    } finally {
        await page.close();
    }
}

async function massScrapeDetails() {
    const pg = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await pg.connect();
    console.log('✅ Connected to Neon Postgres');

    const browser = await chromium.launch({ headless: true });
    const CONCURRENCY = 5; // Scrape 5 books at once

    try {
        while (true) {
            // Get products without descriptions
            const res = await pg.query(`
                SELECT p.id, p.title, p."sourceUrl" 
                FROM product p 
                LEFT JOIN product_detail pd ON p.id = pd."productId" 
                WHERE pd.description IS NULL OR pd.description = '' OR pd.description = 'This treasure is waiting for its next reader.'
                LIMIT 50
            `);

            if (res.rows.length === 0) {
                console.log('🎉 All products have descriptions!');
                break;
            }

            console.log(`🚀 Processing batch of ${res.rows.length} products (Concurrency: ${CONCURRENCY})...`);

            // Process in smaller sub-batches to control concurrency
            for (let i = 0; i < res.rows.length; i += CONCURRENCY) {
                const batch = res.rows.slice(i, i + CONCURRENCY);
                await Promise.all(batch.map(prod => scrapeSingleProduct(browser, pg, prod)));
            }

            console.log('--- Batch Finish ---\n');
        }

    } finally {
        await browser.close();
        await pg.end();
        console.log('\n🏁 Full Detail Scrape completed!');
    }
}

massScrapeDetails();
