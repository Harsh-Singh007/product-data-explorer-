import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './entities/navigation.entity';
import { ScrapingService } from '../scraping/scraping.service';
import { SeedingService } from '../seeding/seeding.service';
import * as categoryDump from './cat-dump.json';

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

        // Fallback to bundled JSON data (100% reliable)
        let data: any = categoryDump;

        // Handle "Module" wrapping if present (common with import * as ...)
        if (data.default && Array.isArray(data.default)) {
            data = data.default;
        }
        // Handle if it got imported as an object with keys "0", "1", etc.
        else if (!Array.isArray(data)) {
            console.warn('Category Dump is not an array, attempting to convert values...');
            // Filter out 'default' or other non-integer keys if mixed, but usually Object.values works for Array-like objects
            const values = Object.values(data).filter(v => (v as any).slug && (v as any).title);
            if (values.length > 0) data = values;
        }

        if (!Array.isArray(data)) {
            console.error('CRITICAL: Bundled data is still not an array.', data);
            // Last resort fallback
            return [
                { id: 1, title: 'Best Sellers', slug: 'best-sellers', url: '#' },
                { id: 2, title: 'Fiction', slug: 'fiction-books', url: '#' },
            ];
        }

        console.log(`Serving bundled navigation data: ${data.length} items.`);
        return data;
    }
}
