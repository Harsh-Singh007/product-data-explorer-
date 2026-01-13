-- Sample Seed Data for Product Explorer

-- Navigation Categories
INSERT INTO navigation (title, slug) VALUES 
('Fiction Books', 'fiction-books'),
('Crime & Mystery', 'crime-books'),
('Non-Fiction', 'non-fiction-books');

-- Categories
INSERT INTO category (title, slug, "navigationId") VALUES 
('Classic Fiction', 'classic-fiction', 1),
('Short Stories', 'short-stories', 1),
('True Crime', 'true-crime', 2);

-- Products
INSERT INTO product (title, price, currency, "imageUrl", "sourceUrl", "categoryId") VALUES 
('1984 - George Orwell', 9.99, 'GBP', 'https://image-server.worldofbooks.com/example1.jpg', 'https://www.worldofbooks.com/en-gb/products/1984', 1),
('The Great Gatsby', 12.50, 'GBP', 'https://image-server.worldofbooks.com/example2.jpg', 'https://www.worldofbooks.com/en-gb/products/great-gatsby', 1),
('In Cold Blood', 15.00, 'GBP', 'https://image-server.worldofbooks.com/example3.jpg', 'https://www.worldofbooks.com/en-gb/products/in-cold-blood', 3);

-- Product Details
INSERT INTO product_detail ("productId", description, specs) VALUES 
(1, 'A dystopian social science fiction novel and cautionary tale.', '{"author": "George Orwell", "pages": "328"}'),
(2, 'The story of the mysteriously wealthy Jay Gatsby.', '{"author": "F. Scott Fitzgerald", "pages": "180"}');
