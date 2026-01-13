const { Client } = require('pg');
const connectionString = 'postgresql://neondb_owner:npg_d58NSkyVrQgH@ep-snowy-salad-ahe5h27u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

async function run() {
    await client.connect();
    const res = await client.query(`
        SELECT COUNT(*) 
        FROM product p 
        LEFT JOIN product_detail pd ON p.id = pd."productId" 
        WHERE pd.description IS NULL OR pd.description = ''
    `);
    console.log(`TOTAL_PRODUCTS_WITHOUT_DESCRIPTION:${res.rows[0].count}`);
    await client.end();
}
run();
