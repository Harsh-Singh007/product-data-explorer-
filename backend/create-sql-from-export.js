const fs = require('fs');

// Read the exported JSON data
const data = JSON.parse(fs.readFileSync('./database-export.json', 'utf-8'));

let sql = `-- Product Data Explorer - Database Import
-- Generated from SQLite export
-- Total: ${data.navigation.length} navigation, ${data.categories.length} categories, ${data.products.length} products

-- Disable triggers and constraints for faster import
SET session_replication_role = 'replica';

`;

// Helper function to escape SQL strings
function escapeSql(value) {
    if (value === null || value === undefined) {
        return 'NULL';
    }
    if (typeof value === 'number') {
        return value;
    }
    if (typeof value === 'boolean') {
        return value ? 'true' : 'false';
    }
    if (value instanceof Date || (typeof value === 'string' && value.match(/^\d{4}-\d{2}-\d{2}/))) {
        return `'${value}'`;
    }
    // Escape single quotes
    return `'${String(value).replace(/'/g, "''")}'`;
}

// Import Navigation
if (data.navigation && data.navigation.length > 0) {
    sql += `\n-- Import Navigation (${data.navigation.length} items)\n`;
    sql += `INSERT INTO navigation (id, title, slug, url, "lastScrapedAt", "createdAt", "updatedAt") VALUES\n`;

    const navValues = data.navigation.map(item => {
        return `(${item.id}, ${escapeSql(item.title)}, ${escapeSql(item.slug)}, ${escapeSql(item.url)}, ${escapeSql(item.lastScrapedAt)}, ${escapeSql(item.createdAt)}, ${escapeSql(item.updatedAt)})`;
    });

    sql += navValues.join(',\n');
    sql += '\nON CONFLICT (id) DO NOTHING;\n';
}

// Import Categories
if (data.categories && data.categories.length > 0) {
    sql += `\n-- Import Categories (${data.categories.length} items)\n`;
    sql += `INSERT INTO category (id, title, slug, url, "navigationId", "parentId", "productCount", "lastScrapedAt", "createdAt", "updatedAt") VALUES\n`;

    const catValues = data.categories.map(item => {
        return `(${item.id}, ${escapeSql(item.title)}, ${escapeSql(item.slug)}, ${escapeSql(item.url)}, ${item.navigationId || 'NULL'}, ${item.parentId || 'NULL'}, ${item.productCount || 0}, ${escapeSql(item.lastScrapedAt)}, ${escapeSql(item.createdAt)}, ${escapeSql(item.updatedAt)})`;
    });

    sql += catValues.join(',\n');
    sql += '\nON CONFLICT (slug) DO NOTHING;\n';
}

// Import Products (in batches to avoid too large SQL)
if (data.products && data.products.length > 0) {
    sql += `\n-- Import Products (${data.products.length} items)\n`;

    const batchSize = 100;
    for (let i = 0; i < data.products.length; i += batchSize) {
        const batch = data.products.slice(i, i + batchSize);

        sql += `INSERT INTO product (id, title, slug, price, currency, "imageUrl", url, "categoryId", "createdAt", "updatedAt") VALUES\n`;

        const prodValues = batch.map(item => {
            return `(${item.id}, ${escapeSql(item.title)}, ${escapeSql(item.slug)}, ${item.price || 'NULL'}, ${escapeSql(item.currency)}, ${escapeSql(item.imageUrl)}, ${escapeSql(item.url)}, ${item.categoryId || 'NULL'}, ${escapeSql(item.createdAt)}, ${escapeSql(item.updatedAt)})`;
        });

        sql += prodValues.join(',\n');
        sql += '\nON CONFLICT (id) DO NOTHING;\n\n';
    }
}

// Import Product Details
if (data.productDetails && data.productDetails.length > 0) {
    sql += `\n-- Import Product Details (${data.productDetails.length} items)\n`;
    sql += `INSERT INTO product_detail (id, description, isbn, author, publisher, "publicationDate", pages, language, "productId", "createdAt", "updatedAt") VALUES\n`;

    const detailValues = data.productDetails.map(item => {
        return `(${item.id}, ${escapeSql(item.description)}, ${escapeSql(item.isbn)}, ${escapeSql(item.author)}, ${escapeSql(item.publisher)}, ${escapeSql(item.publicationDate)}, ${item.pages || 'NULL'}, ${escapeSql(item.language)}, ${item.productId || 'NULL'}, ${escapeSql(item.createdAt)}, ${escapeSql(item.updatedAt)})`;
    });

    sql += detailValues.join(',\n');
    sql += '\nON CONFLICT (id) DO NOTHING;\n';
}

// Update sequences
sql += `\n-- Update sequences to avoid ID conflicts
SELECT setval('navigation_id_seq', (SELECT MAX(id) FROM navigation));
SELECT setval('category_id_seq', (SELECT MAX(id) FROM category));
SELECT setval('product_id_seq', (SELECT MAX(id) FROM product));
SELECT setval('product_detail_id_seq', (SELECT MAX(id) FROM product_detail));

-- Re-enable triggers and constraints
SET session_replication_role = 'origin';

-- Verify import
SELECT 'Navigation' as table_name, COUNT(*) as count FROM navigation
UNION ALL
SELECT 'Category', COUNT(*) FROM category
UNION ALL
SELECT 'Product', COUNT(*) FROM product
UNION ALL
SELECT 'Product Detail', COUNT(*) FROM product_detail;
`;

// Write SQL file
fs.writeFileSync('database-import.sql', sql);

console.log('✅ SQL import file created: database-import.sql');
console.log('\nTo import to Vercel Postgres:');
console.log('1. Get your POSTGRES_URL from Vercel Dashboard → Storage → product-explorer-db');
console.log('2. Run: psql "YOUR_POSTGRES_URL" < database-import.sql');
console.log('\nOr use the Vercel Postgres web interface to run the SQL directly.');
