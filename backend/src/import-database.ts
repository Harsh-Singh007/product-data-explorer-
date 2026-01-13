import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Navigation } from './navigation/entities/navigation.entity';
import { Category } from './category/entities/category.entity';
import { Product } from './product/entities/product.entity';
import { ProductDetail } from './product/entities/product-detail.entity';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(AppModule);

    const navRepo = app.get('NavigationRepository') as Repository<Navigation>;
    const catRepo = app.get('CategoryRepository') as Repository<Category>;
    const prodRepo = app.get('ProductRepository') as Repository<Product>;
    const detailRepo = app.get('ProductDetailRepository') as Repository<ProductDetail>;

    // Read exported data
    const dataPath = path.join(__dirname, '..', 'database-export.json');

    if (!fs.existsSync(dataPath)) {
        console.error('❌ database-export.json not found!');
        console.log('Run: node export-database.js first');
        process.exit(1);
    }

    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    console.log('🚀 Starting database import...\n');

    // Import Navigation
    console.log(`📚 Importing ${data.navigation.length} navigation items...`);
    for (const item of data.navigation) {
        const exists = await navRepo.findOne({ where: { slug: item.slug } });
        if (!exists) {
            await navRepo.save(item);
        }
    }
    console.log('✅ Navigation imported\n');

    // Import Categories
    console.log(`📂 Importing ${data.categories.length} categories...`);
    for (const item of data.categories) {
        const exists = await catRepo.findOne({ where: { slug: item.slug } });
        if (!exists) {
            await catRepo.save(item);
        }
    }
    console.log('✅ Categories imported\n');

    // Import Products
    console.log(`📦 Importing ${data.products.length} products...`);
    let productCount = 0;
    for (const item of data.products) {
        const exists = await prodRepo.findOne({ where: { id: item.id } });
        if (!exists) {
            await prodRepo.save(item);
            productCount++;
        }
    }
    console.log(`✅ ${productCount} new products imported\n`);

    // Import Product Details
    console.log(`📝 Importing ${data.productDetails.length} product details...`);
    let detailCount = 0;
    for (const item of data.productDetails) {
        const exists = await detailRepo.findOne({ where: { id: item.id } });
        if (!exists) {
            await detailRepo.save(item);
            detailCount++;
        }
    }
    console.log(`✅ ${detailCount} new product details imported\n`);

    console.log('🎉 Database import complete!');

    await app.close();
    process.exit(0);
}

bootstrap().catch(err => {
    console.error('❌ Import failed:', err);
    process.exit(1);
});
