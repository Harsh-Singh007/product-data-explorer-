import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';

@Controller('products')
export class ProductController {
    constructor(
        @InjectRepository(Product)
        private productRepo: Repository<Product>,
    ) { }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productRepo.findOne({
            where: { id: parseInt(id) },
            relations: ['detail']
        });
    }
}
