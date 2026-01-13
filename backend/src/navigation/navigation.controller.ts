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
        // Try to fetch from database first (works with both SQLite and Postgres)
        try {
            const categories = await this.navRepo.find({
                order: { id: 'ASC' }
            });

            // If database has data, return it (whether local SQLite or Vercel Postgres)
            if (categories && categories.length > 0) {
                console.log(`Returning ${categories.length} categories from database`);
                return categories;
            }

            // If database is empty, fall back to static data
            console.warn('Database is empty, returning static navigation data');
            return STATIC_NAVIGATION_DATA;
        } catch (error) {
            console.error('Error fetching from database, falling back to static data:', error);
            return STATIC_NAVIGATION_DATA;
        }
    }

    @Get('seed')
    async seed() {
        // Seed the database if needed
        await this.seedingService.seedBasicData();
        return { message: 'Navigation seeded successfully' };
    }
}
