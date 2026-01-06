# Product Data Explorer

A full-stack product exploration platform that navigates World of Books (wob.com) via live scraping.

## Architecture

- **Frontend**: Next.js (App Router), TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, PostgreSQL, Bull (Redis) for queues
- **Scraping**: Crawlee + Playwright (Headless Browser)
- **Database**: PostgreSQL (Structured data), Redis (Queues & Caching)

## Prerequisites

- Node.js (v18+)
- Docker & Docker Compose

## Getting Started

### 1. Database & Redis

Start the infrastructure:

```bash
docker-compose up -d
```

### 2. Backend

```bash
cd backend
npm install
npm run start:dev
```

The API will be available at `http://localhost:3000`.
Swagger docs will be at `http://localhost:3000/api`.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3001` (or next available port).

## Environment Variables

See `.env.example` in both `frontend` and `backend` directories.
