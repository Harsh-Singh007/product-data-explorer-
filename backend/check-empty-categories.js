const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_d58NSkyVrQgH@ep-snowy-salad-ahe5h27u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function checkEmpty() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        const res = await client.query(`
            SELECT c.title, c.slug, COUNT(p.id) as count 
            FROM category c 
            LEFT JOIN product p ON c.id = p."categoryId" 
            GROUP BY c.id, c.title, c.slug
            HAVING COUNT(p.id) = 0
        `);

        console.log(`Found ${res.rows.length} empty categories.`);
        console.log('Sample empty categories:');
        res.rows.slice(0, 10).forEach(r => {
            console.log(` - ${r.title} (${r.slug})`);
        });

    } catch (e) {
        console.error('Error:', e.message);
    } finally {
        await client.end();
    }
}

checkEmpty();
