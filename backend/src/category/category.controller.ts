import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { ScrapingService } from '../scraping/scraping.service';

@Controller('categories')
export class CategoryController {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
        private scrapingService: ScrapingService,
    ) { }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        const category = await this.categoryRepo.findOne({
            where: { slug },
            relations: ['products']
        });

        if (category) {
            // Lazy scrape if no products or old
            const shouldScrape = !category.products || category.products.length === 0;
            // check time diff (e.g. 1 hour)

            if (shouldScrape) {
                // Run async or await? If we want to show products immediately, we should await a bit or return partial?
                // Requirement: "On relevant calls, trigger a real-time scrape"
                // Let's await it so the user sees data.
                try {
                    await this.scrapingService.scrapeCategory(category);
                    // Re-fetch
                    return {
                        category,
                        products: await this.categoryRepo.findOne({
                            where: { id: category.id },
                            relations: ['products']
                        }).then(c => c?.products || [])
                    };
                } catch (e) {
                    console.error(e);
                }
            }
            return {
                category,
                products: category.products || []
            };
        }

        // If category not found locally but might exist remotely? 
        // We could try to scrape generic if valid slug, but better to return 404 for now.
        return { category: null, products: [] };
    }
}
