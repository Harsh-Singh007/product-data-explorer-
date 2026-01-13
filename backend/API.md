# 📡 Product Explorer API Documentation

The Product Explorer Backend is built with NestJS and provides a set of RESTful endpoints to navigate the scraped data.

## 🔗 Swagger UI
When running locally, you can access the interactive Swagger documentation at:
`http://localhost:3000/api`

---

## 🛠️ Endpoints

### 1. Navigation
- **GET** `/navigation`
  - Returns the top-level navigation categories.

### 2. Categories
- **GET** `/category/:slug`
  - Returns category details along with associated products.
  - *Note: Triggers "Lazy Scraping" if no products exist for the category.*

### 3. Products
- **GET** `/products/search?q={query}`
  - Searches for books by title (Case-insensitive).
- **GET** `/products/:id`
  - Returns full product details, including description and technical specs.
  - *Note: Triggers "Lazy Scraping" for descriptions if they are missing.*

---

## 🛠️ Data Model

### Product
- `title`: string
- `price`: number
- `currency`: string
- `imageUrl`: string
- `sourceUrl`: string (WOB URL)

### ProductDetail
- `description`: text
- `specs`: JSON (ISBN, Publisher, Page Count, etc.)
