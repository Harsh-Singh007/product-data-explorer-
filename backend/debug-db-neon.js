const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_d58NSkyVrQgH@ep-snowy-salad-ahe5h27u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require',
    ssl: { rejectUnauthorized: false }
});
async function check() {
    await client.connect();
    const res = await client.query('SELECT * FROM category WHERE slug = $1', ['fiction-books']);
    console.log('Category found:', !!res.rows[0]);
    if (res.rows[0]) {
        console.log('ID:', res.rows[0].id);
        const prods = await client.query('SELECT COUNT(*) FROM product WHERE "categoryId" = $1', [res.rows[0].id]);
        console.log('Product count:', prods.rows[0].count);
    }
    await client.end();
}
check().catch(e => console.error(e.message));
