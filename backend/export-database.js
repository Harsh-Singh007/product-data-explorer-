const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const db = new sqlite3.Database('./database.sqlite');

const exportData = {
    navigation: [],
    categories: [],
    products: [],
    productDetails: []
};

// Export Navigation
db.all('SELECT * FROM navigation ORDER BY id', (err, rows) => {
    if (err) {
        console.error('Error reading navigation:', err);
    } else {
        exportData.navigation = rows;
        console.log(`✅ Exported ${rows.length} navigation items`);
    }

    // Export Categories
    db.all('SELECT * FROM category ORDER BY id', (err, rows) => {
        if (err) {
            console.error('Error reading categories:', err);
        } else {
            exportData.categories = rows;
            console.log(`✅ Exported ${rows.length} categories`);
        }

        // Export Products
        db.all('SELECT * FROM product ORDER BY id LIMIT 1000', (err, rows) => {
            if (err) {
                console.error('Error reading products:', err);
            } else {
                exportData.products = rows;
                console.log(`✅ Exported ${rows.length} products`);
            }

            // Export Product Details
            db.all('SELECT * FROM product_detail ORDER BY id LIMIT 1000', (err, rows) => {
                if (err) {
                    console.error('Error reading product details:', err);
                } else {
                    exportData.productDetails = rows;
                    console.log(`✅ Exported ${rows.length} product details`);
                }

                // Write to file
                fs.writeFileSync('database-export.json', JSON.stringify(exportData, null, 2));
                console.log('\n✅ Database exported to database-export.json');
                console.log(`\nSummary:`);
                console.log(`  - Navigation: ${exportData.navigation.length}`);
                console.log(`  - Categories: ${exportData.categories.length}`);
                console.log(`  - Products: ${exportData.products.length}`);
                console.log(`  - Product Details: ${exportData.productDetails.length}`);

                db.close();
            });
        });
    });
});
