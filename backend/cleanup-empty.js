const { Client } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_d58NSkyVrQgH@ep-snowy-salad-ahe5h27u-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function cleanup() {
    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false }
    });

    try {
        await client.connect();
        console.log('🔗 Connected to Neon Postgres for cleanup...');

        // 1. Identify empty categories
        const emptyCatsQuery = await client.query(`
            SELECT c.id, c.title, c.slug, c.id
            FROM category c 
            LEFT JOIN product p ON c.id = p."categoryId" 
            GROUP BY c.id, c.title, c.slug
            HAVING COUNT(p.id) = 0
        `);

        const emptyIds = emptyCatsQuery.rows.map(r => r.id);

        if (emptyIds.length === 0) {
            console.log('✅ No empty categories found.');
            return;
        }

        console.log(`🗑️  Found ${emptyIds.length} empty categories. Deleting...`);

        // 2. Delete navigation entries first (if they match the slug)
        // Note: Navigation might be linked to category via navigationId
        const emptySlugs = emptyCatsQuery.rows.map(r => r.slug);

        // Delete categories
        await client.query('DELETE FROM category WHERE id = ANY($1)', [emptyIds]);
        console.log(`  ✅ Deleted ${emptyIds.length} categories.`);

        // 3. Clean up navigation entries that don't have a matching category anymore
        const navCleanup = await client.query(`
            DELETE FROM navigation 
            WHERE id NOT IN (SELECT "navigationId" FROM category WHERE "navigationId" IS NOT NULL)
            AND slug = ANY($1)
        `, [emptySlugs]);

        console.log(`  ✅ Cleaned up ${navCleanup.rowCount} navigation entries.`);

        // 4. Final verification
        const remaining = await client.query('SELECT COUNT(*) FROM category');
        console.log(`\n🎉 Cleanup complete! Total categories remaining: ${remaining.rows[0].count}`);

    } catch (e) {
        console.error('❌ Error during cleanup:', e.message);
    } finally {
        await client.end();
    }
}

cleanup();
