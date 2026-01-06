import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoryController {
    constructor(
        @InjectRepository(Category)
        private categoryRepo: Repository<Category>,
    ) { }

    @Get(':slug')
    async findOne(@Param('slug') slug: string) {
        const category = await this.categoryRepo.findOne({ where: { slug } });
        // In a real implementation: fetch products related to this category
        return {
            category,
            products: []
        };
    }
}
