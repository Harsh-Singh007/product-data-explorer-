const axios = require('axios');

async function test() {
    const url = 'https://www.worldofbooks.com/en-gb/collections/childrens-books';
    try {
        const res = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }
        });
        console.log('HTML contains ".product-card":', res.data.includes('product-card'));
        console.log('HTML contains ".grid__item":', res.data.includes('grid__item'));
        console.log('HTML contains "ProductListing":', res.data.includes('ProductListing'));
    } catch (e) { console.error(e.message); }
}

test();
