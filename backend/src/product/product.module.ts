import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductDetail } from './entities/product-detail.entity';
import { ProductController } from './product.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Product, ProductDetail])],
    controllers: [ProductController],
    providers: [],
    exports: []
})
export class ProductModule { }
