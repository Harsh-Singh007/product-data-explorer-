const { CheerioCrawler } = require('crawlee');

async function test() {
    const crawler = new CheerioCrawler({
        async requestHandler({ $, request }) {
            console.log('Title:', $('title').text());
            $('.header__menu-item').each((i, el) => {
                console.log('Menu Item:', $(el).text().trim());
            });
        },
    });

    await crawler.run(['https://www.worldofbooks.com']);
}

test();
