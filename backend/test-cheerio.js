const axios = require('axios');
const cheerio = require('cheerio');

async function testFetch() {
    try {
        const url = 'https://www.worldofbooks.com/en-gb/collections/fiction-books';
        const res = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        const $ = cheerio.load(res.data);
        const links = $('a[href*="/en-gb/products/"]');
        console.log('COUNT:' + links.length);
        if (links.length > 0) {
            console.log('LINK0:' + $(links[0]).attr('href'));
        }
    } catch (e) {
        console.log('ERROR:' + e.message);
    }
}
testFetch();
