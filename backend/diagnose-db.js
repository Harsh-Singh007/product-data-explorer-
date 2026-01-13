const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) { console.error(err); return; }
        console.log('Tables:', tables.map(t => t.name));

        db.all("SELECT * FROM navigation", [], (err, rows) => {
            if (err) console.log('Error reading navigation:', err.message);
            else console.log('Navigation Count:', rows.length);
        });

        db.all("SELECT * FROM product", [], (err, rows) => {
            if (err) console.log('Error reading product:', err.message);
            else console.log('Product Count:', rows.length);
        });
    });
});
