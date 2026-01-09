const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');

db.all("SELECT * FROM navigation", (err, rows) => {
    if (err) {
        console.error(err);
    } else {
        console.log("Navigation rows:", rows.length);
        console.log(rows);
    }
    db.close();
});
