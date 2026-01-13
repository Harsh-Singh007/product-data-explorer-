import { Controller, Get, Param, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Product } from './entities/product.entity';
import { ScrapingService } from '../scraping/scraping.service';

@Controller('products')
export class ProductController {
    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
        private scrapingService: ScrapingService,
    ) { }

    @Get('search')
    async search(@Query('q') q: string) {
        if (!q) return [];
        return this.productRepo.find({
            where: { title: ILike(`%${q}%`) },
            take: 20
        });
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const product = await this.productRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['detail']
        });

        if (product) {
            if (!product.detail) {
                try {
                    await this.scrapingService.scrapeProductDetail(product);
                    // Refetch
                    return this.productRepo.findOne({
                        where: { id: parseInt(id) },
                        relations: ['detail']
                    });
                } catch (e) {
                    console.error(e);
                }
            }
        }
        return product;
    }
}
