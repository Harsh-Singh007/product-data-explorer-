import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { ScrapingModule } from '../scraping/scraping.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Category]),
        ScrapingModule
    ],
    controllers: [CategoryController],
    providers: [],
    exports: []
})
export class CategoryModule { }
