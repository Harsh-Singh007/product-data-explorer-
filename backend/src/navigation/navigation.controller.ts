import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './entities/navigation.entity';
import { ScrapingService } from '../scraping/scraping.service';

@Controller('navigation')
export class NavigationController {
    constructor(
        @InjectRepository(Navigation)
        private navRepo: Repository<Navigation>,
        private scrapingService: ScrapingService,
    ) { }

    @Get()
    async findAll() {
        const navs = await this.navRepo.find();
        if (navs.length === 0) {
            // Trigger lazy scrape
            this.scrapingService.scrapeNavigation().catch(console.error);
        }
        return navs;
    }
}
