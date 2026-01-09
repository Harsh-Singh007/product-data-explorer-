const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.sqlite');
db.all("SELECT title, slug FROM category", (err, rows) => {
    if (err) console.error(err);
    rows.forEach(r => console.log(`${r.title} | ${r.slug}`));
    db.close();
});
