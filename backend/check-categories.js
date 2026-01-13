const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all("SELECT count(*) as count FROM category", (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Total categories:", rows[0].count);
    }

    // Also show first 10 categories
    db.all("SELECT id, title, slug FROM category LIMIT 10", (err, cats) => {
        if (err) {
            console.error(err);
        } else {
            console.log("\nFirst 10 categories:");
            console.table(cats);
        }
        db.close();
    });
});
