# 🤖 VERCEL FIX - INSTRUCTIONS FOR AI AGENT

**Task:** Fix Vercel deployment by adding missing environment variables

**Current Problem:** All Vercel deployments fail with database connection errors because environment variables are missing.

**Solution:** Add environment variables to Vercel project settings

---

## ⚠️ IMPORTANT: DATABASE TYPE

**This project uses SUPABASE PostgreSQL, NOT Turso!**

- Database: Supabase PostgreSQL
- Host: `db.bcbqrhkoosopmtrryrcy.supabase.co`
- Port: 5432 (default PostgreSQL)

---

## STEP 1: Access Vercel Dashboard

1. Go to: https://vercel.com
2. Login to account
3. Find project named: **"muzaready"** (or **"muzaready-bahy"** or **"muzaready-ebhs"**)
4. Click on the project

---

## STEP 2: Navigate to Environment Variables

1. In the project, click **"Settings"** tab (top navigation)
2. In left sidebar, click **"Environment Variables"**
3. You should see a page with "Add New" button

---

## STEP 3: Add Environment Variable #1 - DATABASE_URL

Click **"Add New"** button and enter:

**Key (Name):**
```
DATABASE_URL
```

**Value:**
```
postgresql://postgres:amobenecanto8A@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?schema=public
```

**Environments:** (check ALL 3 checkboxes)
- ☑ Production
- ☑ Preview
- ☑ Development

Click **"Save"** button

---

## STEP 4: Add Environment Variable #2 - SESSION_SECRET

Click **"Add New"** button again and enter:

**Key (Name):**
```
SESSION_SECRET
```

**Value:**
```
muzaready-super-secret-session-key-production-2025-v1
```

**Environments:** (check ALL 3 checkboxes)
- ☑ Production
- ☑ Preview
- ☑ Development

Click **"Save"** button

---

## STEP 5: (Optional) Add DIRECT_URL for Better Performance

Click **"Add New"** button again and enter:

**Key (Name):**
```
DIRECT_URL
```

**Value:**
```
postgresql://postgres:amobenecanto8A@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require
```

**Environments:** (check ALL 3 checkboxes)
- ☑ Production
- ☑ Preview
- ☑ Development

Click **"Save"** button

**Why DIRECT_URL?**
- Provides direct connection to PostgreSQL (bypasses connection pooler)
- Used for health checks and migrations
- More reliable for diagnostic endpoints

---

## STEP 6: (Optional) Add RESEND_API_KEY

If you have Resend API key for emails:

**Key (Name):**
```
RESEND_API_KEY
```

**Value:**
```
[Your Resend API key]
```

**Environments:** (check ALL 3 checkboxes)
- ☑ Production
- ☑ Preview
- ☑ Development

Click **"Save"** button

---

## STEP 7: Verify Environment Variables

After adding variables, you should see this list:

**REQUIRED:**
1. `DATABASE_URL` - postgresql://postgres:***@db.bcbqrhkoosopmtrryrcy...
2. `SESSION_SECRET` - muzaready-super-secret-session-key-production-2025-v1

**OPTIONAL:**
3. `DIRECT_URL` - postgresql://postgres:***@db.bcbqrhkoosopmtrryrcy...
4. `RESEND_API_KEY` - (if you have one)

All should have: Production ✓, Preview ✓, Development ✓

---

## STEP 8: Trigger Redeploy

**Option A: Automatic (Recommended)**
- Vercel will automatically detect the new environment variables
- Wait 30-60 seconds
- New deployment should start automatically

**Option B: Manual**
1. Go to **"Deployments"** tab
2. Find the latest deployment (may be failed)
3. Click **"..."** menu (three dots)
4. Click **"Redeploy"**
5. Check **"Use existing Build Cache"** (optional, makes it faster)
6. Click **"Redeploy"** button

---

## STEP 9: Wait for Deployment

1. Stay on **"Deployments"** tab
2. Watch the deployment status
3. Should take 2-3 minutes
4. Status should change to: **"Ready"** (green ✅)

---

## STEP 10: Verify Deployment Success

**If deployment shows "Ready" (green):**
1. ✅ Click on the deployment
2. ✅ Click **"Visit"** button
3. ✅ Website should load (may show homepage or login)
4. ✅ Try: https://your-domain.vercel.app/api/ok
   - Should return: `{"ok":true}`

**Success!** Deployment is fixed! 🎉

---

## TROUBLESHOOTING

### If deployment still fails:

1. **Check Build Logs:**
   - Click on failed deployment
   - Click **"View Build Logs"**
   - Look for error messages (red text)
   - Take screenshot and share

2. **Verify Environment Variables:**
   - Settings → Environment Variables
   - Confirm DATABASE_URL and SESSION_SECRET are there
   - Confirm all have Production + Preview + Development checked

3. **Check for typos:**
   - `DATABASE_URL` (no spaces, exact spelling)
   - `SESSION_SECRET` (no spaces, exact spelling)
   - Database password: `amobenecanto8A` (case-sensitive!)

4. **Try clearing build cache:**
   - Deployments → ... → Redeploy
   - UNCHECK "Use existing Build Cache"
   - Redeploy

5. **Database Connection Issues:**
   - Error: "Can't reach database server"
   - Solution: Verify Supabase project is active
   - Check: https://supabase.com/dashboard
   - Ensure project `bcbqrhkoosopmtrryrcy` is not paused

---

## EXPECTED RESULT

After completing these steps:

- ✅ Environment variables are set in Vercel
- ✅ New deployment succeeds (green "Ready" status)
- ✅ Website is accessible at production URL
- ✅ API endpoints work (e.g., /api/ok returns {"ok":true})
- ✅ Database connection works
- ✅ Admin panel is accessible (may need login)

---

## VERIFICATION COMMANDS

**For AI Agent to verify:**

1. Check if deployment succeeded:
   - Go to Vercel Deployments tab
   - Latest deployment should be "Ready" (green)

2. Check if website is live:
   - Visit production URL
   - Should load without errors

3. Check API health:
   - Visit: https://[your-domain].vercel.app/api/ok
   - Should return: {"ok":true}

4. Check database health:
   - Visit: https://[your-domain].vercel.app/api/health
   - Should return: {"ok":true,"db":"up"}

---

## IMPORTANT NOTES

- ⚠️ **Do NOT** change the values - copy them EXACTLY as shown
- ⚠️ **Do NOT** skip any checkboxes - all 3 environments must be checked
- ⚠️ **Do NOT** add extra spaces or line breaks in values
- ⚠️ **Do NOT** put quotes around values (Vercel adds them automatically)
- ⚠️ **Database password is case-sensitive**: `amobenecanto8A`
- ✅ **Do** wait for auto-redeploy (30-60 seconds) before manual redeploy
- ✅ **Do** check that all variables are saved before redeploying

---

## SUMMARY FOR AI AGENT

**What you need to do:**
1. Access Vercel dashboard
2. Navigate to: Settings → Environment Variables
3. Add 2 required environment variables (exact values above):
   - DATABASE_URL (Supabase PostgreSQL)
   - SESSION_SECRET
4. Add 2 optional environment variables:
   - DIRECT_URL (for better performance)
   - RESEND_API_KEY (if available)
5. Check all 3 environment checkboxes for each
6. Save each variable
7. Wait for auto-redeploy (or trigger manual redeploy)
8. Verify deployment succeeds

**Total time:** 5 minutes

**Difficulty:** Easy (copy-paste values)

---

## EXACT VALUES SUMMARY

Copy these EXACTLY:

```env
# REQUIRED
DATABASE_URL=postgresql://postgres:amobenecanto8A@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?schema=public

SESSION_SECRET=muzaready-super-secret-session-key-production-2025-v1

# OPTIONAL (but recommended)
DIRECT_URL=postgresql://postgres:amobenecanto8A@db.bcbqrhkoosopmtrryrcy.supabase.co:5432/postgres?sslmode=require

# OPTIONAL (if you have Resend account)
RESEND_API_KEY=[Your Resend API key if available]
```

Each variable needs: Production ✓, Preview ✓, Development ✓

---

## DATABASE INFO

**Database Type:** Supabase PostgreSQL
**Host:** db.bcbqrhkoosopmtrryrcy.supabase.co
**Port:** 5432 (standard PostgreSQL port)
**Database:** postgres
**Schema:** public
**Username:** postgres
**Password:** amobenecanto8A

**Supabase Dashboard:**
https://supabase.com/dashboard/project/bcbqrhkoosopmtrryrcy

---

**Created:** December 6, 2025
**For:** AI Agent to fix Vercel deployment
**Repository:** https://github.com/annamontana1/muzaready
**Branch:** main
**Database:** Supabase PostgreSQL (NOT Turso!)
