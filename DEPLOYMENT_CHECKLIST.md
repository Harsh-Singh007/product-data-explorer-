# 🚀 Vercel Deployment Checklist

## Pre-Deployment Verification ✅

- [x] Backend builds successfully (`npm run build`)
- [x] Backend runs locally on port 3000
- [x] Frontend runs locally on port 3001
- [x] API returns 108 categories locally
- [x] All TypeScript errors resolved
- [x] Main.ts fixed for local development
- [x] Navigation controller has Vercel fallback logic

## Backend Deployment Steps

### 1. Navigate to Backend Directory
```bash
cd backend
```

### 2. Deploy to Vercel
```bash
vercel --prod
```

### 3. Note Your Backend URL
After deployment, Vercel will show:
```
✅ Production: https://your-backend-name.vercel.app
```

**Copy this URL!** You'll need it for the frontend.

### 4. Verify Backend Works
Open in browser or use curl:
```bash
curl https://your-backend-name.vercel.app/navigation
```

Expected: JSON array with 30 category objects

## Frontend Deployment Steps

### 1. Set Environment Variable in Vercel

**Option A: Via Vercel Dashboard**
1. Go to https://vercel.com/dashboard
2. Select your frontend project
3. Go to Settings → Environment Variables
4. Add new variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-name.vercel.app` (from step above)
   - **Environment**: Production, Preview, Development (select all)
5. Click "Save"

**Option B: Via CLI** (if you prefer)
```bash
vercel env add NEXT_PUBLIC_API_URL production
# When prompted, enter: https://your-backend-name.vercel.app
```

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Deploy to Vercel
```bash
vercel --prod
```

### 4. Verify Frontend Works
Open the URL Vercel provides in your browser.

Expected: Homepage with 30+ category cards

## Post-Deployment Verification

### Backend Checks
- [ ] `/navigation` endpoint returns 30 categories
- [ ] No 500 errors in Vercel logs
- [ ] CORS headers present in response
- [ ] Response time < 2 seconds

### Frontend Checks
- [ ] Homepage loads without errors
- [ ] 30 category cards visible
- [ ] Categories are clickable
- [ ] No "Library is Empty" message
- [ ] No "Connection Error" message
- [ ] Smooth animations work

### Integration Checks
- [ ] Frontend successfully calls backend API
- [ ] Network tab shows successful API calls
- [ ] No CORS errors in browser console
- [ ] Category pages load (may be empty initially)

## Quick Test Commands

### Test Backend Locally
```bash
cd backend
npm run start:dev
# In another terminal:
curl http://localhost:3000/navigation | jq length
# Should output: 108 (or similar number > 30)
```

### Test Frontend Locally
```bash
cd frontend
npm run dev
# Open http://localhost:3001 in browser
```

### Test Backend on Vercel
```bash
curl https://your-backend-name.vercel.app/navigation | jq length
# Should output: 30
```

## Common Issues & Solutions

### Issue: "NEXT_PUBLIC_API_URL is undefined"
**Solution**: 
1. Verify environment variable is set in Vercel dashboard
2. Redeploy frontend after setting the variable
3. Check variable name is exactly `NEXT_PUBLIC_API_URL`

### Issue: "Backend returns empty array"
**Solution**:
1. Check Vercel function logs
2. Verify `VERCEL` environment variable is set (automatic)
3. Check `navigation.data.ts` has data

### Issue: "CORS error"
**Solution**:
1. Backend has CORS enabled in `main.ts` (already done)
2. Verify backend URL in frontend env var doesn't have trailing slash
3. Check Vercel headers configuration in `vercel.json`

### Issue: "Categories show but clicking gives 404"
**Solution**:
1. This is expected if products aren't scraped yet
2. Category pages will trigger scraping on first visit
3. Check backend logs for scraping errors

## Environment Variables Reference

### Backend (Optional)
```
NODE_ENV=production          # Automatically set by Vercel
VERCEL=1                     # Automatically set by Vercel
PORT=3000                    # For local development only
```

### Frontend (Required)
```
NEXT_PUBLIC_API_URL=https://your-backend-name.vercel.app
```

## Deployment Commands Summary

```bash
# Backend
cd backend
vercel --prod

# Frontend (after setting NEXT_PUBLIC_API_URL)
cd frontend
vercel --prod
```

## Success Indicators

When everything is working:

1. **Backend Logs** (Vercel Dashboard):
   ```
   Running on Vercel/Production - returning static navigation data
   ```

2. **Frontend Homepage**:
   - Grid of 30 category cards
   - Each card has icon, title, and link
   - Smooth hover animations
   - No error messages

3. **Browser DevTools Network Tab**:
   - GET request to `/navigation` returns 200 OK
   - Response contains array of 30 objects
   - No CORS errors

## Next Steps After Deployment

1. **Test Category Pages**: Click on a few categories to trigger scraping
2. **Monitor Logs**: Check Vercel function logs for any errors
3. **Set Up Custom Domain** (optional): Configure in Vercel dashboard
4. **Enable Analytics** (optional): Vercel Analytics for usage tracking

---

## 🎉 Ready to Deploy!

Your application is now properly configured for Vercel deployment. Follow the steps above and you'll have a working Product Data Explorer with all categories displaying correctly!

**Estimated Deployment Time**: 5-10 minutes total
