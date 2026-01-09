import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeJob } from './entities/scrape-job.entity';
import { Navigation } from '../navigation/entities/navigation.entity';
import { Category } from '../category/entities/category.entity';
import { Product } from '../product/entities/product.entity';
import { ProductDetail } from '../product/entities/product-detail.entity';
import { ScrapingService } from './scraping.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ScrapeJob,
            Navigation,
            Category,
            Product,
            ProductDetail
        ])
    ],
    controllers: [],
    providers: [ScrapingService],
    exports: [ScrapingService],
})
export class ScrapingModule { }
