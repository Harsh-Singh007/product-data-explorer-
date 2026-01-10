import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './entities/navigation.entity';
import { ScrapingService } from '../scraping/scraping.service';
import { SeedingService } from '../seeding/seeding.service';
import { STATIC_NAVIGATION_DATA } from './navigation.data';

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
        try {
            const navs = await this.navRepo.find();
            if (navs.length > 0) return navs;
        } catch (e) {
            console.error('DB Find Failed:', e);
        }

        console.log('Serving static fallback navigation data.');
        return STATIC_NAVIGATION_DATA;
    }
}
