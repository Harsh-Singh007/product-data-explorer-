import { Injectable, Logger } from '@nestjs/common';
import { PlaywrightCrawler } from 'crawlee';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ScrapeJob, ScrapeStatus } from './entities/scrape-job.entity';

@Injectable()
export class ScrapingService {
    private readonly logger = new Logger(ScrapingService.name);

    constructor(
        @InjectRepository(ScrapeJob)
        private scrapeJobRepo: Repository<ScrapeJob>,
    ) { }

    async createJob(url: string, type: string) {
        const job = this.scrapeJobRepo.create({
            targetUrl: url,
            targetType: type,
            status: ScrapeStatus.PENDING,
        });
        return this.scrapeJobRepo.save(job);
    }

    async scrapeNavigation() {
        this.logger.log('Starting navigation scrape...');
        const crawler = new PlaywrightCrawler({
            headless: true,
            requestHandler: async ({ page, log }) => {
                log.info('Scraping navigation...');
                const navItems = await page.$$eval('header nav a', (els) => { // generic selector, needs adjustment for WOB
                    return els.map(el => ({
                        title: el.innerText.trim(),
                        url: el.href,
                    })).filter(n => n.title && n.url);
                });

                console.log('Found nav items:', navItems.length);
                // Here we would save to DB. 
                // For now, let's just log.
            },
        });

        await crawler.run(['https://www.worldofbooks.com/']);
    }
}
