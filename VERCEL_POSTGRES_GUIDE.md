# 🚀 Complete Vercel Deployment Guide with Full Database

## 🎯 Goal
Deploy your Product Data Explorer to Vercel with **all 108 categories** and products using **Vercel Postgres** (free tier).

## 📊 What You Have Locally
- ✅ **108 Navigation categories**
- ✅ **108 Categories**
- ✅ **329 Products**
- ✅ **7 Product Details**

All exported to: `backend/database-export.json`

---

## 🗄️ Step 1: Set Up Vercel Postgres

### 1.1 Create Postgres Database

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on **Storage** tab
3. Click **Create Database**
4. Select **Postgres**
5. Choose **Free** tier (Hobby - 256 MB)
6. Name it: `product-explorer-db`
7. Click **Create**

### 1.2 Connect Database to Your Project

1. After creation, click **Connect Project**
2. Select your **backend** project
3. Click **Connect**
4. Vercel will automatically add these environment variables to your project:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - etc.

---

## 📦 Step 2: Deploy Backend to Vercel

### 2.1 Deploy Backend

```bash
cd backend
vercel --prod
```

**Note the URL**: `https://your-backend-name.vercel.app`

### 2.2 Verify Database Connection

The backend will automatically:
- ✅ Detect `POSTGRES_URL` environment variable
- ✅ Use PostgreSQL instead of SQLite
- ✅ Create all tables automatically (via `synchronize: true`)

Check deployment logs in Vercel Dashboard:
- Should see: "Using POSTGRES database"

---

## 🌱 Step 3: Seed the Database

You have **3 options** to populate your Vercel Postgres database:

### Option A: API Endpoint (Easiest - Basic Data)

Visit in your browser:
```
https://your-backend-name.vercel.app/navigation/seed
```

This will seed **30 categories** from static data.

**Pros**: Simple, one click
**Cons**: Only seeds 30 categories, not all 108

### Option B: Manual SQL Import (Recommended - Full Data)

1. **Connect to Vercel Postgres locally**:
   ```bash
   # Get connection string from Vercel Dashboard → Storage → product-explorer-db → .env.local
   # Copy POSTGRES_URL value
   ```

2. **Install PostgreSQL client** (if not installed):
   ```bash
   # Windows (using Chocolatey)
   choco install postgresql
   
   # Or download from: https://www.postgresql.org/download/
   ```

3. **Create SQL dump from your export**:
   ```bash
   cd backend
   node create-sql-from-export.js
   ```
   
   (I'll create this script next)

4. **Import to Vercel Postgres**:
   ```bash
   psql "YOUR_POSTGRES_URL_HERE" < database-import.sql
   ```

### Option C: Programmatic Import (Advanced)

1. **Set Postgres URL locally**:
   ```bash
   # In backend/.env
   POSTGRES_URL=your_vercel_postgres_url_here
   ```

2. **Run import script**:
   ```bash
   cd backend
   npm run build
   node dist/import-database.js
   ```

---

## 🎨 Step 4: Deploy Frontend

### 4.1 Set Environment Variable

In Vercel Dashboard → Frontend Project → Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL=https://your-backend-name.vercel.app
```

### 4.2 Deploy Frontend

```bash
cd frontend
vercel --prod
```

---

## ✅ Step 5: Verify Everything Works

### 5.1 Test Backend API

```bash
curl https://your-backend-name.vercel.app/navigation
```

**Expected**: JSON array with 108 categories (or 30 if using Option A)

### 5.2 Test Frontend

Open: `https://your-frontend-name.vercel.app`

**Expected**: 
- Homepage loads
- Grid of category cards (108 or 30)
- Categories are clickable
- No errors

---

## 📝 Recommended Approach (Full 108 Categories)

I recommend **Option B** (Manual SQL Import) for the following reasons:

1. ✅ Gets all 108 categories
2. ✅ Includes all 329 products
3. ✅ One-time setup
4. ✅ Most reliable

### Quick Steps for Option B:

1. **Export your data** (already done ✅):
   ```bash
   cd backend
   node export-database.js
   # Created: database-export.json
   ```

2. **Convert to SQL** (I'll create the script):
   ```bash
   node create-sql-from-export.js
   # Will create: database-import.sql
   ```

3. **Get Postgres connection string**:
   - Vercel Dashboard → Storage → product-explorer-db
   - Copy `POSTGRES_URL` from .env.local tab

4. **Import to Vercel Postgres**:
   ```bash
   psql "YOUR_POSTGRES_URL" < database-import.sql
   ```

---

## 🔧 Alternative: Simpler Approach (30 Categories)

If you want to deploy quickly without setting up Postgres:

1. **Skip Postgres setup** - Don't create a database
2. **Deploy backend** - Will use static data (30 categories)
3. **Deploy frontend** - Will show 30 categories
4. **Products will be scraped on-demand** when users click categories

This works but gives you only 30 categories instead of 108.

---

## 🆚 Comparison

| Approach | Categories | Products | Setup Time | Persistence |
|----------|-----------|----------|------------|-------------|
| **Static Data** | 30 | 0 (scraped on-demand) | 5 min | ❌ No |
| **Vercel Postgres** | 108 | 329 | 15 min | ✅ Yes |

---

## 🚨 Important Notes

### About Synchronize in Production

Your `app.module.ts` has `synchronize: true` which is:
- ✅ **Good for development** - Auto-creates tables
- ⚠️ **Risky for production** - Can cause data loss

**Recommendation**: After initial setup, change to `synchronize: false` and use migrations.

### About Free Tier Limits

Vercel Postgres Free Tier:
- ✅ 256 MB storage
- ✅ 60 hours compute/month
- ✅ Perfect for this project

Your data:
- ~108 categories = ~50 KB
- ~329 products = ~200 KB
- **Total: ~250 KB** ✅ Well within limits!

---

## 🎯 Next Steps

**Choose your path**:

### Path A: Full Database (Recommended)
1. Create Vercel Postgres database
2. Deploy backend
3. Import data using SQL
4. Deploy frontend
5. Enjoy all 108 categories!

### Path B: Quick Deploy
1. Deploy backend (no database)
2. Deploy frontend
3. Use 30 static categories
4. Products scraped on-demand

---

## 🆘 Need Help?

Let me know which path you want to take and I'll:
1. Create the SQL conversion script
2. Guide you through the import process
3. Help troubleshoot any issues

**Which approach do you prefer?**
- Option A: Full 108 categories with Postgres (15 min setup)
- Option B: Quick 30 categories with static data (5 min setup)
