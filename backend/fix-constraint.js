const { Client } = require('pg');
const connectionString = 'postgresql://neondb_owner:npg_d58NSkyVrQgH@ep-snowy-salad-ahe5h27u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';
const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
async function fix() {
    await client.connect();
    try {
        await client.query('ALTER TABLE product_detail ADD CONSTRAINT product_detail_product_id_unq UNIQUE ("productId")');
        console.log('Added unique constraint');
    } catch (e) {
        console.log(e.message);
    }
    await client.end();
}
fix();
