const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const connectionString = 'postgresql://neondb_owner:npg_d58NSkyVrQgH@ep-snowy-salad-ahe5h27u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function importToNeon() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔗 Connecting to Neon Postgres...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // First create tables with EXACT column names from entities
    console.log('📦 Creating tables...');

    await client.query(`
      DROP TABLE IF EXISTS product_detail CASCADE;
      DROP TABLE IF EXISTS product CASCADE;
      DROP TABLE IF EXISTS category CASCADE;
      DROP TABLE IF EXISTS navigation CASCADE;
    `);

    await client.query(`
      CREATE TABLE navigation (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        url VARCHAR(1000),
        "lastScrapedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('  ✅ navigation table created');

    await client.query(`
      CREATE TABLE category (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE NOT NULL,
        url VARCHAR(1000),
        "navigationId" INTEGER REFERENCES navigation(id),
        "parentId" INTEGER,
        "productCount" INTEGER DEFAULT 0,
        "lastScrapedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('  ✅ category table created');

    await client.query(`
      CREATE TABLE product (
        id SERIAL PRIMARY KEY,
        "sourceId" VARCHAR(255) UNIQUE,
        title VARCHAR(1000) NOT NULL,
        price DECIMAL(10,2),
        currency VARCHAR(50),
        "imageUrl" VARCHAR(1000),
        "sourceUrl" VARCHAR(1000),
        "lastScrapedAt" TIMESTAMP,
        "categoryId" INTEGER REFERENCES category(id),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('  ✅ product table created');

    await client.query(`
      CREATE TABLE product_detail (
        id SERIAL PRIMARY KEY,
        "description" TEXT,
        specs TEXT,
        "ratingsAvg" DECIMAL(3,2),
        "reviewsCount" INTEGER DEFAULT 0,
        "productId" INTEGER REFERENCES product(id),
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('  ✅ product_detail table created\n');

    // Load export data
    console.log('📂 Loading export data...');
    const exportPath = path.join(__dirname, 'database-export.json');
    const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    console.log(`  Found: ${data.navigation.length} navigation, ${data.categories.length} categories, ${data.products.length} products\n`);

    // Import navigation
    console.log('📥 Importing navigation...');
    for (const nav of data.navigation) {
      await client.query(
        `INSERT INTO navigation (id, title, slug, url, "lastScrapedAt", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (id) DO NOTHING`,
        [nav.id, nav.title, nav.slug, nav.url, nav.lastScrapedAt, nav.createdAt, nav.updatedAt]
      );
    }
    console.log(`  ✅ Imported ${data.navigation.length} navigation items\n`);

    // Import categories
    console.log('📥 Importing categories...');
    for (const cat of data.categories) {
      await client.query(
        `INSERT INTO category (id, title, slug, url, "navigationId", "parentId", "productCount", "lastScrapedAt", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) ON CONFLICT (id) DO NOTHING`,
        [cat.id, cat.title, cat.slug, cat.url, cat.navigationId, cat.parentId, cat.productCount || 0, cat.lastScrapedAt, cat.createdAt, cat.updatedAt]
      );
    }
    console.log(`  ✅ Imported ${data.categories.length} categories\n`);

    // Import products
    console.log('📥 Importing products...');
    for (const prod of data.products) {
      await client.query(
        `INSERT INTO product (id, "sourceId", title, price, currency, "imageUrl", "sourceUrl", "lastScrapedAt", "categoryId", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) ON CONFLICT (id) DO NOTHING`,
        [prod.id, prod.sourceId, prod.title, prod.price, prod.currency, prod.imageUrl, prod.sourceUrl, prod.lastScrapedAt, prod.categoryId, prod.createdAt, prod.updatedAt]
      );
    }
    console.log(`  ✅ Imported ${data.products.length} products\n`);

    // Import product details
    if (data.productDetails && data.productDetails.length > 0) {
      console.log('📥 Importing product details...');
      for (const d of data.productDetails) {
        await client.query(
          `INSERT INTO product_detail (id, description, specs, "ratingsAvg", "reviewsCount", "productId") 
           VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING`,
          [d.id, d.description, typeof d.specs === 'object' ? JSON.stringify(d.specs) : d.specs, d.ratingsAvg, d.reviewsCount, d.productId]
        );
      }
      console.log(`  ✅ Imported ${data.productDetails.length} product details\n`);
    }

    // Update sequences
    console.log('🔄 Updating sequences...');
    await client.query(`SELECT setval('navigation_id_seq', (SELECT COALESCE(MAX(id), 1) FROM navigation))`);
    await client.query(`SELECT setval('category_id_seq', (SELECT COALESCE(MAX(id), 1) FROM category))`);
    await client.query(`SELECT setval('product_id_seq', (SELECT COALESCE(MAX(id), 1) FROM product))`);
    await client.query(`SELECT setval('product_detail_id_seq', (SELECT COALESCE(MAX(id), 1) FROM product_detail))`);
    console.log('  ✅ Sequences updated\n');

    // Verify
    const navCount = await client.query('SELECT COUNT(*) FROM navigation');
    const catCount = await client.query('SELECT COUNT(*) FROM category');
    const prodCount = await client.query('SELECT COUNT(*) FROM product');

    console.log('📊 Verification:');
    console.log(`  Navigation: ${navCount.rows[0].count}`);
    console.log(`  Categories: ${catCount.rows[0].count}`);
    console.log(`  Products: ${prodCount.rows[0].count}`);

    console.log('\n🎉 Database re-imported successfully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  } finally {
    await client.end();
    console.log('\n🔌 Connection closed.');
  }
}

importToNeon();
