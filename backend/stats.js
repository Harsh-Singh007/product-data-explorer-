const { Client } = require('pg');
const connectionString = 'postgresql://neondb_owner:npg_d58NSkyVrQgH@ep-snowy-salad-ahe5h27u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
async function run() {
    await client.connect();
    const prods = await client.query('SELECT COUNT(*) FROM product');
    const cats = await client.query(`
        SELECT COUNT(*) FROM (
            SELECT c.id FROM category c 
            JOIN product p ON c.id = p."categoryId" 
            GROUP BY c.id
        ) t
    `);
    console.log(`TOTAL_PRODUCTS:${prods.rows[0].count}`);
    console.log(`FULL_CATEGORIES:${cats.rows[0].count}`);
    await client.end();
}
run();
