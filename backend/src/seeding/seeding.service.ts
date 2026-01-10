import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from '../navigation/entities/navigation.entity';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class SeedingService {
    private readonly logger = new Logger(SeedingService.name);

    constructor(
        @InjectRepository(Navigation) private navRepo: Repository<Navigation>,
        @InjectRepository(Category) private categoryRepo: Repository<Category>,
    ) { }

    async seedBasicData() {
        this.logger.log('Seeding basic navigation data...');

        const initialCategories = [
            { title: 'Best Sellers', slug: 'best-sellers', url: 'https://www.worldofbooks.com/en-gb/category/best-sellers' },
            { title: 'Fiction Books', slug: 'fiction-books', url: 'https://www.worldofbooks.com/en-gb/category/fiction-books' },
            { title: 'Non-Fiction', slug: 'non-fiction-books', url: 'https://www.worldofbooks.com/en-gb/category/non-fiction-books' },
            { title: 'Children\'s Books', slug: 'childrens-books', url: 'https://www.worldofbooks.com/en-gb/category/childrens-books' },
            { title: 'Crime & Thriller', slug: 'crime-fiction', url: 'https://www.worldofbooks.com/en-gb/category/crime-fiction' },
            { title: 'Sci-Fi & Fantasy', slug: 'science-fiction-and-fantasy-books', url: 'https://www.worldofbooks.com/en-gb/category/science-fiction-and-fantasy-books' },
            { title: 'Biographies', slug: 'biography-books', url: 'https://www.worldofbooks.com/en-gb/category/biography-books' },
            { title: 'Cookery & Food', slug: 'cookery-and-food-books', url: 'https://www.worldofbooks.com/en-gb/category/cookery-and-food-books' },
            { title: 'History', slug: 'history-books', url: 'https://www.worldofbooks.com/en-gb/category/history-books' },
            { title: 'Study & Learning', slug: 'society-and-social-sciences-books', url: 'https://www.worldofbooks.com/en-gb/category/society-and-social-sciences-books' }
        ];

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
