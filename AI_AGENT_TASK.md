# 🤖 TASK FOR AI AGENT - Fix Vercel Deployment

**Priority:** HIGH - Production deployment is failing
**Estimated Time:** 10 minutes
**Difficulty:** Medium (requires Supabase credentials)

---

## 📋 CONTEXT

**Project:** muzaready (e-commerce platform for hair extensions)
**Status:** Frontend & Backend 100% complete, all 241 tests passing
**Problem:** Vercel deployment fails because environment variables are missing
**Database:** Supabase PostgreSQL (paid plan)

---

## 🎯 YOUR TASK

1. **Get your Supabase database credentials** (from Supabase dashboard)
2. Add 3 environment variables to Vercel project settings
3. Run database migrations
4. Trigger a redeploy

**After completion:** The website will be live at your Vercel production URL.

---

## ⚠️ IMPORTANT: Use YOUR Supabase Credentials

**DO NOT use example credentials from documentation!**

You need to use **YOUR OWN Supabase database** credentials.

---

## 🔍 STEP 0: Get Your Supabase Credentials

### Option A: Supabase Dashboard (Recommended)

1. Go to https://supabase.com/dashboard
2. Login to your account
3. Find your **muzaready** project (or the project for this application)
4. Go to **Project Settings** (gear icon in sidebar)
5. Click **Database** in the left menu
6. Copy these values:

**Connection String (URI):**
- Look for "Connection string" section
- Choose **"Session mode"** (port 5432)
- Format: `postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres`
- This will be your **DATABASE_URL**

**Direct URL (for migrations):**
- Same as above (Session mode uses port 5432 - direct connection)
- This will be your **DIRECT_URL**
- Can be the same as DATABASE_URL for Supabase

**Connection Pooler (optional, better performance):**
- Choose **"Transaction mode"** (port 6543)
- Format: `postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:6543/postgres`
- Use this as DATABASE_URL for better performance under load

### Option B: From Local Environment Files

Check your local `.env.local` or `.env.production` files for:
```bash
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
```

---

## ✅ STEP-BY-STEP INSTRUCTIONS

### STEP 1: Prepare Your Credentials

You need these 3 values:

**1. DATABASE_URL**
- Format: `postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:6543/postgres`
- Port 6543 = Transaction pooler (recommended for app)
- OR Port 5432 = Direct connection (simpler, works fine)

**2. DIRECT_URL**
- Format: `postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres`
- Port 5432 = Direct connection (required for migrations)
- Must use port 5432, NOT 6543

**3. SESSION_SECRET**
- Any secure random string (32+ characters recommended)
- Generate new if you don't have one:
  ```bash
  openssl rand -base64 32
  ```

---

### STEP 2: Access Vercel Dashboard

1. Open browser and go to: **https://vercel.com**
2. Login to your Vercel account
3. Find the project named **"muzaready"**
4. Click on the project to open it

---

### STEP 3: Navigate to Environment Variables Settings

1. In the project page, click the **"Settings"** tab (top navigation bar)
2. In the left sidebar, click **"Environment Variables"**
3. You should now see the Environment Variables page

---

### STEP 4: Add Environment Variable #1 - DATABASE_URL

Click **"Add New"** button and enter:

**Name/Key:**
```
DATABASE_URL
```

**Value:**
```
postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:6543/postgres
```

Replace:
- `[YOUR-REF]` with your Supabase project reference
- `[YOUR-PASSWORD]` with your database password

**Environments:** (check ALL 3)
- ☑ Production
- ☑ Preview
- ☑ Development

Click **"Save"**

⚠️ **TIP:** Use port **6543** (pooler) for better performance, or **5432** (direct) if simpler

---

### STEP 5: Add Environment Variable #2 - DIRECT_URL

Click **"Add New"** button again and enter:

**Name/Key:**
```
DIRECT_URL
```

**Value:**
```
postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres
```

⚠️ **IMPORTANT:** MUST use port **5432** (direct connection) for migrations!

**Environments:** (check ALL 3)
- ☑ Production
- ☑ Preview
- ☑ Development

Click **"Save"**

---

### STEP 6: Add Environment Variable #3 - SESSION_SECRET

Click **"Add New"** button one more time:

**Name/Key:**
```
SESSION_SECRET
```

**Value:**
```
[YOUR-SECURE-RANDOM-STRING]
```

Generate with:
```bash
openssl rand -base64 32
```

**Environments:** (check ALL 3)
- ☑ Production
- ☑ Preview
- ☑ Development

Click **"Save"**

---

### STEP 7: Run Database Migrations

**CRITICAL:** Before deploying, you MUST run Prisma migrations to create database tables.

**Option A: Run Locally (Recommended)**

On your local machine:

```bash
# 1. Set environment variables
export DATABASE_URL="postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres"
export DIRECT_URL="postgresql://postgres.[ref]:[password]@db.[ref].supabase.co:5432/postgres"

# 2. Run migrations
npx prisma migrate deploy

# Or create initial migration if needed:
npx prisma migrate dev --name init
```

**Option B: Run via Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Link project
vercel link

# Pull environment variables
vercel env pull .env

# Run migrations
npx prisma migrate deploy
```

**What migrations do:**
- Create all database tables (products, orders, users, etc.)
- Set up indexes and constraints
- Prepare database for application

---

### STEP 8: Verify Variables Are Saved

In Vercel Environment Variables page, confirm you see:

1. ✅ **DATABASE_URL** = `postgresql://postgres...` (port 6543 or 5432)
   - Production ✓, Preview ✓, Development ✓

2. ✅ **DIRECT_URL** = `postgresql://postgres...` (port 5432)
   - Production ✓, Preview ✓, Development ✓

3. ✅ **SESSION_SECRET** = Your secure random string
   - Production ✓, Preview ✓, Development ✓

---

### STEP 9: Trigger Redeploy

**Option A: Automatic**
- Wait 30-60 seconds
- Vercel may auto-deploy after env var changes

**Option B: Manual (Recommended)**
1. Click **"Deployments"** tab
2. Find most recent deployment
3. Click **"..."** menu → **"Redeploy"**
4. Optional: Check **"Use existing Build Cache"**
5. Click **"Redeploy"**

---

### STEP 10: Monitor Deployment

1. Stay on **"Deployments"** tab
2. Watch status (Building... → Ready)
3. Wait 2-4 minutes
4. Look for **"Ready"** with green ✅

---

### STEP 11: Verify Success

Once deployment shows **"Ready"**:

1. Click on the deployment
2. Click **"Visit"** button
3. Website should load

**Test API:**
```
https://YOUR-DOMAIN.vercel.app/api/ok
```

**Expected:**
```json
{"ok":true}
```

🎉 **Success!**

---

## 🎉 SUCCESS CRITERIA

Task complete when:

- ✅ All 3 environment variables saved in Vercel
- ✅ Database migrations ran successfully
- ✅ Deployment completed with "Ready" status
- ✅ Production URL loads
- ✅ `/api/ok` returns `{"ok":true}`

---

## 🔧 TROUBLESHOOTING

### Issue 1: Can't Find Supabase Credentials

**Solution:**
1. Go to https://supabase.com/dashboard
2. Click your project
3. Settings → Database
4. Copy "Connection string" (Session or Transaction mode)

### Issue 2: Migrations Fail

**Error:** "Can't reach database server"

**Solution:**
1. Verify DATABASE_URL and DIRECT_URL are correct
2. Check Supabase project is active (not paused)
3. Verify database password is correct
4. Try using port 5432 for both URLs

### Issue 3: Wrong Port

**Symptoms:** Connection errors, timeout

**Ports explained:**
- **5432** = Direct connection (for migrations, health checks)
- **6543** = Connection pooler (for app queries, better performance)

**Fix:**
- DATABASE_URL: Can use 6543 or 5432
- DIRECT_URL: MUST use 5432

### Issue 4: Deployment Succeeds But Database Errors

**Solution:**
1. Check you ran migrations: `npx prisma migrate deploy`
2. Verify tables exist in Supabase dashboard: Tables → check tables list
3. Test connection:
   ```bash
   npx prisma db pull
   ```

---

## 📊 VERIFICATION CHECKLIST

Before reporting completion:

- [ ] I got my Supabase credentials from dashboard
- [ ] I added `DATABASE_URL` in Vercel (port 6543 or 5432)
- [ ] I added `DIRECT_URL` in Vercel (port 5432)
- [ ] I added `SESSION_SECRET` in Vercel
- [ ] All 3 variables have Production + Preview + Development checked
- [ ] I ran `npx prisma migrate deploy` successfully
- [ ] I triggered a Vercel redeploy
- [ ] Deployment shows "Ready" (green)
- [ ] Production URL loads
- [ ] `/api/ok` returns `{"ok":true}`

---

## 🚨 CRITICAL NOTES

**DO:**
- ✅ Use YOUR Supabase credentials
- ✅ Use port 6543 (pooler) or 5432 (direct) for DATABASE_URL
- ✅ Use port 5432 for DIRECT_URL (required for migrations)
- ✅ Run migrations before deploying
- ✅ Check all 3 environment checkboxes

**DON'T:**
- ❌ Don't use example credentials
- ❌ Don't use port 6543 for DIRECT_URL (migrations will fail)
- ❌ Don't skip migrations (app will fail to start)
- ❌ Don't add quotes around values

---

## 📝 EXPECTED OUTCOME

After completion:

1. **Vercel Dashboard:**
   - 3 environment variables configured
   - Latest deployment = "Ready" (green)

2. **Production:**
   - URL: `https://[domain].vercel.app`
   - Website loads successfully
   - API: `/api/ok` returns `{"ok":true}`

3. **Database:**
   - All tables created in Supabase
   - Migrations completed
   - Connection working

---

## 📦 TEMPLATE

```plaintext
# Get from Supabase Dashboard → Settings → Database

DATABASE_URL=postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:6543/postgres

DIRECT_URL=postgresql://postgres.[YOUR-REF]:[YOUR-PASSWORD]@db.[YOUR-REF].supabase.co:5432/postgres

SESSION_SECRET=[Generate with: openssl rand -base64 32]
```

---

## 🔗 RESOURCES

**Supabase Dashboard:** https://supabase.com/dashboard
**GitHub Repository:** https://github.com/annamontana1/muzaready
**Prisma Docs:** https://pris.ly/d/prisma-migrate

**Project Documentation:**
- `START_HERE.md` - Project status
- `PROJECT_STATUS.md` - Completion report
- `BACKEND_STATUS.md` - API documentation

---

**Created:** December 6, 2025
**For:** AI Agent to deploy muzaready with Supabase PostgreSQL
**Database:** Supabase PostgreSQL (NOT Turso/SQLite)
**Estimated Time:** 10 minutes
**Priority:** HIGH

---

**Good luck! 🚀**

**Remember:** Use Supabase PostgreSQL credentials, run migrations first!
