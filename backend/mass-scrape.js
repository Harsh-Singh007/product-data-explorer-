const { chromium } = require('playwright');
const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_d58NSkyVrQgH@ep-snowy-salad-ahe5h27u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const baseUrl = 'https://www.worldofbooks.com';

async function massScrape() {
    const pg = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
    await pg.connect();
    console.log('✅ Connected to Neon Postgres');

    const browser = await chromium.launch({ headless: true });

    try {
        // Get empty categories
        const res = await pg.query(`
            SELECT c.id, c.title, c.slug, c.url 
            FROM category c 
            LEFT JOIN product p ON c.id = p."categoryId" 
            GROUP BY c.id, c.title, c.slug, c.url
            HAVING COUNT(p.id) = 0
            LIMIT 50
        `);

        console.log(`🚀 Starting mass scrape for ${res.rows.length} categories...`);

        for (const cat of res.rows) {
            console.log(`\n📂 Scraping: ${cat.title} (${cat.slug})`);
            const page = await browser.newPage();

            try {
                let targetUrl = cat.url;
                if (!targetUrl || !targetUrl.startsWith('http')) {
                    targetUrl = `${baseUrl}/en-gb/collections/${cat.slug}`;
                }

                console.log(`  🔗 URL: ${targetUrl}`);
                await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });

                // Wait for products
                const productSelectors = ['.ais-InfiniteHits-item', '.product-card-wrapper', '.grid__item', '.card-wrapper'];
                let foundSelector = '';
                for (const sel of productSelectors) {
                    try {
                        await page.waitForSelector(sel, { timeout: 5000 });
                        foundSelector = sel;
                        break;
                    } catch (e) { }
                }

                if (!foundSelector) {
                    console.log(`  ❌ No products found.`);
                    continue;
                }

                const products = await page.$$eval(foundSelector, (els) => {
                    return els.map(el => {
                        const titleEl = el.querySelector('a.full-unstyled-link, .card__heading a, .card__heading, h3, .h5');
                        const priceEl = el.querySelector('.price, .price-item--sale, .price-item--regular, .price-item');
                        const imgEl = el.querySelector('img');
                        const linkEl = el.querySelector('a.full-unstyled-link, .card__heading a, a');

                        if (!titleEl || !linkEl) return null;

                        const href = linkEl.href;
                        return {
                            title: titleEl.textContent?.trim() || '',
                            price: priceEl?.textContent?.replace(/[^\d.]/g, '') || '0',
                            currency: 'GBP',
                            imageUrl: imgEl?.getAttribute('src') || '',
                            sourceUrl: href,
                            sourceId: href.split('/').filter(Boolean).pop() || ''
                        };
                    }).filter(p => p && p.title && p.sourceUrl).slice(0, 20); // Limit to 20 per category for speed
                });

                console.log(`  ✨ Found ${products.length} products`);

                for (const p of products) {
                    await pg.query(
                        `INSERT INTO product ("sourceId", title, price, currency, "imageUrl", "sourceUrl", "categoryId", "lastScrapedAt") 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, NOW()) 
                         ON CONFLICT ("sourceId") DO UPDATE SET "categoryId" = $7`,
                        [p.sourceId, p.title, parseFloat(p.price), p.currency, p.imageUrl, p.sourceUrl, cat.id]
                    );
                }

                await pg.query(`UPDATE category SET "productCount" = $1, "lastScrapedAt" = NOW() WHERE id = $2`, [products.length, cat.id]);

            } catch (err) {
                console.error(`  ❌ Error: ${err.message}`);
            } finally {
                await page.close();
            }
        }

    } finally {
        await browser.close();
        await pg.end();
        console.log('\n🏁 Mass scrape completed!');
    }
}

massScrape();
