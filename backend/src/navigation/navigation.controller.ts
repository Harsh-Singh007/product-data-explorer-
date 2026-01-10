import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './entities/navigation.entity';
import { ScrapingService } from '../scraping/scraping.service';
import { SeedingService } from '../seeding/seeding.service';

@Controller('navigation')
export class NavigationController {
    constructor(
        @InjectRepository(Navigation)
        private navRepo: Repository<Navigation>,
        private scrapingService: ScrapingService,
        private seedingService: SeedingService,
    ) { }

    @Get()
    async findAll() {
        const navs = await this.navRepo.find();
        if (navs.length === 0) {
            // Trigger lazy seed (Scraping fallback)
            this.seedingService.seedBasicData().catch(console.error);
            // Return defaults immediately so user doesn't wait for refresh
            return [
                { title: 'Best Sellers', slug: 'best-sellers', id: 1 },
                { title: 'Fiction Books', slug: 'fiction-books', id: 2 },
                { title: 'Loading others...', slug: '#', id: 3 },
            ];
        }
        return navs;
    }
}
