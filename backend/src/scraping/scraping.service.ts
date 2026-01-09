import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { chromium, Browser } from 'playwright';
import { ScrapeJob, ScrapeStatus } from './entities/scrape-job.entity';
import { Navigation } from '../navigation/entities/navigation.entity';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { ProductDetail } from '../product/entities/product-detail.entity';

@Injectable()
export class ScrapingService {
    private readonly logger = new Logger(ScrapingService.name);
    private readonly baseUrl = 'https://www.worldofbooks.com';
    private browser: Browser | null = null;

    constructor(
        @InjectRepository(ScrapeJob) private scrapeJobRepo: Repository<ScrapeJob>,
        @InjectRepository(Navigation) private navRepo: Repository<Navigation>,
        @InjectRepository(Category) private categoryRepo: Repository<Category>,
        @InjectRepository(Product) private productRepo: Repository<Product>,
        @InjectRepository(ProductDetail) private productDetailRepo: Repository<ProductDetail>,
    ) { }

    private async getBrowser() {
        if (!this.browser) {
            this.browser = await chromium.launch({ headless: true });
        }
        return this.browser;
    }

    async scrapeNavigation() {
        this.logger.log('Starting navigation scrape...');
        const browser = await this.getBrowser();
        const page = await browser.newPage();
        try {
            await page.goto(this.baseUrl, { waitUntil: 'networkidle' });

            const navItems = await page.$$eval('.header__menu-item', (els) => {
                return els.map(el => {
                    const anchor = el as HTMLAnchorElement;
                    return {
                        title: anchor.innerText?.trim() || anchor.textContent?.trim() || '',
                        url: anchor.href,
                    };
                }).filter(n => n.title && n.url);
            });

            this.logger.log(`Found ${navItems.length} potential navigation items.`);

            for (const item of navItems) {
                if (!item.url.includes('worldofbooks.com')) continue;

                const urlObj = new URL(item.url);
                const segments = urlObj.pathname.split('/').filter(Boolean);
                const slug = segments.pop() || 'home';

                await this.saveNavigation({ ...item, slug });
            }
        } catch (e) {
            this.logger.error('Error scraping navigation', e);
        } finally {
            await page.close();
        }
    }

    async scrapeCategory(category: Category) {
        this.logger.log(`[DEBUG] Scraping category: ${category.title} (${category.slug})`);
        const browser = await this.getBrowser();
        const page = await browser.newPage();
        try {
            let targetUrl = category.url;
            if (!targetUrl || !targetUrl.startsWith('http')) {
                targetUrl = `${this.baseUrl}/en-gb/collections/${category.slug}`;
                if (!category.slug.endsWith('-books')) {
                    // Some collections might need -books suffix, others not. 
                    // The subagent used /en-gb/collections/fiction-books
                }
                this.logger.log(`[DEBUG] Constructed fallback URL: ${targetUrl}`);
            }

            this.logger.log(`[DEBUG] Navigating to: ${targetUrl}`);

            await page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

            // Wait for either the search results or a generic grid
            const productSelectors = [
                '.ais-InfiniteHits-item',
                '.product-card-wrapper',
                '.grid__item',
                '.card-wrapper'
            ];

            let foundSelector = '';
            for (const selector of productSelectors) {
                try {
                    await page.waitForSelector(selector, { timeout: 10000 });
                    foundSelector = selector;
                    this.logger.log(`[DEBUG] Found products using selector: ${selector}`);
                    break;
                } catch (e) {
                    continue;
                }
            }

            if (!foundSelector) {
                this.logger.warn(`[DEBUG] No product cards found for ${category.slug}.`);
                return;
            }

            const products = await page.$$eval(foundSelector, (els) => {
                return els.map(el => {
                    const titleEl = el.querySelector('a.full-unstyled-link, .card__heading a, .card__heading, h3, .h5');
                    const priceEl = el.querySelector('.price, .price-item--sale, .price-item--regular, .price-item');
                    const imgEl = el.querySelector('img');
                    const linkEl = el.querySelector('a.full-unstyled-link, .card__heading a, a');

                    if (!titleEl || !linkEl) return null;

                    const href = (linkEl as HTMLAnchorElement).href;

                    return {
                        title: titleEl.textContent?.trim() || '',
                        price: priceEl?.textContent?.replace(/[^\d.]/g, '') || '0',
                        currency: 'GBP',
                        imageUrl: imgEl?.getAttribute('src') || '',
                        sourceUrl: href,
                        sourceId: href.split('/').filter(Boolean).pop() || ''
                    };
                }).filter(p => p && p.title && p.sourceUrl);
            });

            this.logger.log(`[DEBUG] Found ${products.length} products for ${category.title}.`);

            for (const p of products) {
                await this.saveProduct(p, category);
            }
        } catch (e) {
            this.logger.error(`[DEBUG] Error scraping category ${category.slug}`, e.stack);
        } finally {
            await page.close();
        }
    }

    async scrapeProductDetail(product: Product) {
        this.logger.log(`Starting product detail scrape for ${product.title}...`);
        const browser = await this.getBrowser();
        const page = await browser.newPage();
        try {
            await page.goto(product.sourceUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });

            // Wait for description or table
            await Promise.race([
                page.waitForSelector('section[id*="product_accordion_summary"]', { timeout: 10000 }),
                page.waitForSelector('.additional-info-table', { timeout: 10000 })
            ]).catch(() => this.logger.warn('Timed out waiting for detail selectors, trying anyway...'));

            const description = await page.$eval('section[id*="product_accordion_summary"] .panel, .product-accordion .panel, .panel, .product__description', el => el.textContent?.trim() || '').catch(() => '');

            const specs: any = {};
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
            } catch (e) {
                this.logger.warn(`Error parsing specs for product ${product.id}: ${e.message}`);
            }

            await this.saveProductDetail(product, { description, specs });
            this.logger.log(`Successfully scraped details for ${product.title}`);
        } catch (e) {
            this.logger.error(`Error scraping product detail ${product.id}`, e.stack);
        } finally {
            await page.close();
        }
    }

    private async saveProduct(data: any, category: Category) {
        let product = await this.productRepo.findOne({ where: { sourceId: data.sourceId } });
        if (!product) {
            product = this.productRepo.create({
                sourceId: data.sourceId,
                title: data.title,
                price: parseFloat(data.price),
                currency: data.currency,
                imageUrl: data.imageUrl,
                sourceUrl: data.sourceUrl,
                category: category,
                lastScrapedAt: new Date(),
            });
        } else {
            product.price = parseFloat(data.price);
            product.lastScrapedAt = new Date();
            product.category = category;
        }
        await this.productRepo.save(product);
    }

    private async saveProductDetail(product: Product, data: any) {
        let detail = await this.productDetailRepo.findOne({ where: { productId: product.id } });
        if (!detail) {
            detail = this.productDetailRepo.create({
                product: product,
                description: data.description,
                specs: data.specs,
            });
        } else {
            detail.description = data.description;
            detail.specs = data.specs;
        }
        await this.productDetailRepo.save(detail);
    }

    private async saveNavigation(item: any) {
        let nav = await this.navRepo.findOne({ where: { slug: item.slug } });
        if (!nav) {
            nav = this.navRepo.create({
                title: item.title,
                slug: item.slug,
                url: item.url,
                lastScrapedAt: new Date(),
            });
        } else {
            nav.lastScrapedAt = new Date();
        }
        await this.navRepo.save(nav);

        let cat = await this.categoryRepo.findOne({ where: { slug: item.slug } });
        if (!cat) {
            cat = this.categoryRepo.create({
                title: item.title,
                slug: item.slug,
                url: item.url,
                navigation: nav
            });
            await this.categoryRepo.save(cat);
        }
    }
}
