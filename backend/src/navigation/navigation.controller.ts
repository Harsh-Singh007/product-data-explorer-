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
        const fs = require('fs');
        const path = require('path');

        try {
            const navs = await this.navRepo.find();
            if (navs.length > 0) return navs;
        } catch (e) {
            console.error('DB Find Failed:', e);
        }

        // DB is empty or failed (Vercel). Use the JSON dump.
        const potentialPaths = [
            path.join(process.cwd(), 'cat-dump.json'),
            path.join(__dirname, 'cat-dump.json'),
            path.join(__dirname, '..', 'cat-dump.json'),
            path.join(process.cwd(), 'backend', 'cat-dump.json'),
        ];

        for (const p of potentialPaths) {
            if (fs.existsSync(p)) {
                console.log(`Serving navigation from dump: ${p}`);
                try {
                    const data = JSON.parse(fs.readFileSync(p, 'utf8'));
                    return data;
                } catch (err) {
                    console.error('Error parsing dump:', err);
                }
            }
        }

        console.warn('No dump found, returning empty.');
        return [];
    }
}
