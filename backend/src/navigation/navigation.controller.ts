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
        if (navs.length > 0) return navs;

        // Fallback for Serverless/Demo mode where DB might be empty/reset
        return [
            { id: 1, title: 'Best Sellers', slug: 'best-sellers', url: '#' },
            { id: 2, title: 'Fiction', slug: 'fiction-books', url: '#' },
            { id: 3, title: 'Non-Fiction', slug: 'non-fiction-books', url: '#' },
            { id: 4, title: 'Children\'s Books', slug: 'childrens-books', url: '#' },
            { id: 5, title: 'Crime & Thriller', slug: 'crime-fiction', url: '#' },
            { id: 6, title: 'Sci-Fi & Fantasy', slug: 'science-fiction-and-fantasy-books', url: '#' },
            { id: 7, title: 'Biographies', slug: 'biography-books', url: '#' },
            { id: 8, title: 'Cookery', slug: 'cookery-and-food-books', url: '#' },
            { id: 9, title: 'History', slug: 'history-books', url: '#' },
            { id: 10, title: 'Art & Photography', slug: 'art-and-photography-books', url: '#' },
        ];
    }
}
