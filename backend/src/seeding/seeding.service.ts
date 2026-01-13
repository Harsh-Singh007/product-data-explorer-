import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../navigation/entities/navigation.entity';
import { Category } from '../category/entities/category.entity';
import { STATIC_NAVIGATION_DATA } from '../navigation/navigation.data';

@Injectable()
export class SeedingService {
    private readonly logger = new Logger(SeedingService.name);

    constructor(
        @InjectRepository(Navigation) private navRepo: Repository<Navigation>,
        @InjectRepository(Category) private categoryRepo: Repository<Category>,
    ) { }

    async seedBasicData() {
        this.logger.log('Seeding all navigation data from static source...');

        // Use all 30 categories from navigation.data.ts
        const initialCategories = STATIC_NAVIGATION_DATA;

        for (const item of initialCategories) {
            // Create Navigation
            let nav = await this.navRepo.findOne({ where: { slug: item.slug } });
            if (!nav) {
                nav = this.navRepo.create({
                    title: item.title,
                    slug: item.slug,
                    url: item.url,
                    lastScrapedAt: new Date(),
                });
                await this.navRepo.save(nav);
            }

            // Create Category
            let cat = await this.categoryRepo.findOne({ where: { slug: item.slug } });
            if (!cat) {
                cat = this.categoryRepo.create({
                    title: item.title,
                    slug: item.slug,
                    url: item.url,
                    navigation: nav
                });
                await this.categoryRepo.save(cat);
            }
        }

        this.logger.log('Seeding complete.');
    }
}
