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
        // Fetch all categories from the database
        const categories = await this.navRepo.find({
            order: { id: 'ASC' }
        });

        // If database is empty, fall back to static data
        if (!categories || categories.length === 0) {
            console.warn('Database is empty, returning static navigation data');
            return STATIC_NAVIGATION_DATA;
        }

        return categories;
    }

    @Get('seed')
    async seed() {
        // Seed the database if needed
        await this.seedingService.seedBasicData();
        return { message: 'Navigation seeded successfully' };
    }
}
