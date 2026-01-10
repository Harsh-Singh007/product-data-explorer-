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

    @Get('seed')
    async forceSeed() {
        await this.seedingService.seedBasicData();
        return { message: 'Seeding complete', count: 10 };
    }

    @Get()
    async findAll() {
        const navs = await this.navRepo.find();
        if (navs.length === 0) {
            // Trigger lazy seed (Scraping fallback)
            try {
                await this.seedingService.seedBasicData();
                return await this.navRepo.find();
            } catch (e) {
                console.error('Seeding failed:', e);
                // Fallback hardcoded
                return [
                    { title: 'Best Sellers', slug: 'best-sellers', id: 1 },
                    { title: 'Fiction Books', slug: 'fiction-books', id: 2 },
                ];
            }
        }
        return navs;
    }
}
