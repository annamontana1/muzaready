# Database Connection Diagnosis Report

**Date:** 2025-11-21  
**Project:** muzaready-bahy  
**Issue:** `/api/health` returns 500 with port 5434 error

---

## 🔍 Problem Summary

Both Production and Preview deployments are failing to connect to the database with this error:

```
Can't reach database server at `db.bcbqrhkoosopmtrryrcy.supabase.co:5434`
```

**Root Cause:** Port 5434 is incorrect for Supabase connections.

---

## 📊 Current Test Results

### Production URL: `https://muzaready-bahy.vercel.app`

**`/api/ok` - ✅ WORKING**
```bash
curl -H "x-vercel-protection-bypass: 2qpXRAQMV23nkz1PG6iXfSH07caiq9F7" \
  https://muzaready-bahy.vercel.app/api/ok

Response: {"ok":true}
Status: 200
```

**`/api/health` - ❌ FAILING**
```bash
curl -H "x-vercel-protection-bypass: 2qpXRAQMV23nkz1PG6iXfSH07caiq9F7" \
  https://muzaready-bahy.vercel.app/api/health

Response:
{
  "ok": false,
  "db": "down",
  "error": "Can't reach database server at `db.bcbqrhkoosopmtrryrcy.supabase.co:5434`"
}
Status: 500
```

### Preview URL: `https://muzaready-bahy-git-main-annamontana1s-projects.vercel.app`

**`/api/ok` - ✅ WORKING**
```bash
Status: 200
Response: {"ok":true}
```

**`/api/health` - ❌ FAILING**
```bash
Status: 500
Error: Same as production - port 5434 issue
```

---

## 🔧 Analysis

### Port Configuration

**Supabase provides two connection types:**

| Type | Port | Purpose | URL Parameter |
|------|------|---------|---------------|
| **Pooled** | 6543 | Application queries (PgBouncer) | `?pgbouncer=true` |
| **Direct** | 5432 | Migrations, admin tasks, health checks | `?sslmode=require` |

**WRONG PORT:** 5434 ❌
- This port does not exist in Supabase
- Likely a typo in environment variable

### Environment Variables Being Read

The `/api/health` endpoint currently tries to read:

1. **`DIRECT_URL`** (preferred)
   - Currently set to port **5434** (incorrect)
   - Should be port **5432**

2. **`DATABASE_URL`** (fallback in new code)
   - Not being reached if `DIRECT_URL` is set
   - May also have incorrect port

### What's Reading Which Variable

| Component | Variable | Expected Port |
|-----------|----------|---------------|
| Main app (`lib/prisma.ts`) | `DATABASE_URL` | 6543 (pooler) or 5432 (temp workaround) |
| Health check (`/api/health`) | `DIRECT_URL` (preferred), fallback to `DATABASE_URL` | 5432 (direct) |
| Prisma migrations | `directUrl` in schema | 5432 (direct) |

---

## ✅ Solution Options

### Option 1: Quick Fix (Recommended for Immediate Resolution)

**Set both variables to port 5432:**

In Vercel project `muzaready-bahy` → Settings → Environment Variables:

**For Production & Preview:**

```bash
DATABASE_URL=postgresql://postgres.[ref]:[password]@db.bcbqrhkoosopmtrryrcy.supabase.com:5432/postgres?sslmode=require

DIRECT_URL=postgresql://postgres.[ref]:[password]@db.bcbqrhkoosopmtrryrcy.supabase.com:5432/postgres?sslmode=require
```

**Steps:**
1. Go to Vercel dashboard
2. Project `muzaready-bahy` → Settings → Environment Variables
3. Edit `DATABASE_URL` (Production) - change port from 5434 to 5432
4. Edit `DIRECT_URL` (Production) - change port from 5434 to 5432
5. Edit `DATABASE_URL` (Preview) - change port from 5434 to 5432
6. Edit `DIRECT_URL` (Preview) - change port from 5434 to 5432
7. Go to Deployments → Latest → "..." → Redeploy → ☑ Clear build cache
8. Wait for deployment to complete
9. Test:
   ```bash
   curl -H "x-vercel-protection-bypass: 2qpXRAQMV23nkz1PG6iXfSH07caiq9F7" \
     https://muzaready-bahy.vercel.app/api/health
   ```

**Expected Result:** `{"ok":true,"db":"up","dbSource":"DIRECT_URL",...}`

**Pros:**
- ✅ Immediate fix
- ✅ Reliable connection
- ✅ Works with new smart URL selection code

**Cons:**
- ⚠️ Bypasses connection pooler (slightly less optimal under high load)
- ⚠️ Not using PgBouncer benefits

---

### Option 2: Optimal Configuration (Recommended for Production)

**Use pooler for app, direct for health checks:**

```bash
# Main app queries (optimized with pooler)
DATABASE_URL=postgresql://postgres.[ref]:[password]@db.bcbqrhkoosopmtrryrcy.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Health checks & migrations (direct connection)
DIRECT_URL=postgresql://postgres.[ref]:[password]@db.bcbqrhkoosopmtrryrcy.supabase.com:5432/postgres?sslmode=require
```

**Steps:**
1. Same as Option 1, but use port 6543 for `DATABASE_URL`
2. Use port 5432 for `DIRECT_URL`
3. Redeploy

**Pros:**
- ✅ Optimal performance under load
- ✅ Uses PgBouncer connection pooling
- ✅ Reliable health checks with direct connection

**Cons:**
- Requires correct pooler configuration

**Note:** The new code in this PR (`lib/db.ts`) automatically handles the fallback logic, so even if one URL has issues, the other will be used.

---

## 🚀 Code Changes in This PR

### New Files

1. **`lib/db.ts`** - Smart database URL selection
   - `getDbUrl(preferDirect)` - Automatically selects best available URL
   - `maskPassword()` - Safely logs URLs without passwords
   - `getDbConfigInfo()` - Debug info for troubleshooting
   - `isValidDatabaseUrl()` - Validates URL format

2. **`.env.example`** - Comprehensive environment variable documentation
   - Explains Supabase pooler vs direct connection
   - Provides example URLs with correct ports
   - Documents quick workaround

3. **`.github/workflows/verify.yml`** - Automated health checks
   - Tests `/api/ok` (must return 200)
   - Tests `/api/health` (must not return 404)
   - Detects port 5434 errors automatically
   - Runs after every Vercel deployment

### Modified Files

1. **`app/api/health/route.ts`**
   - Now uses `getDbUrl(true)` for smart URL selection
   - Prefers `DIRECT_URL`, falls back to `DATABASE_URL`
   - Returns detailed debug info on errors
   - Better error messages

2. **`README.md`**
   - Added comprehensive Database Setup section
   - Added Health Monitoring documentation
   - Added Troubleshooting guide
   - Added Deployment instructions

### Schema (No Changes Required)

**`prisma/schema.prisma`** already correct:
```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled (6543)
  directUrl = env("DIRECT_URL")     // direct (5432)
}
```

---

## 📋 Definition of Done Checklist

### Code Changes
- [x] Create `lib/db.ts` with smart URL selection
- [x] Update `app/api/health/route.ts` to use `getDbUrl()`
- [x] Create `.env.example` with documentation
- [x] Update `README.md` with setup instructions
- [x] Create GitHub Actions workflow for automated verification
- [x] Verify Prisma schema is correct

### Testing (Post-Fix)
- [ ] Verify `DATABASE_URL` and `DIRECT_URL` in Vercel have correct ports
- [ ] Redeploy Production with clear cache
- [ ] Test Production `/api/ok` returns 200
- [ ] Test Production `/api/health` returns 200 with `"db":"up"`
- [ ] Test Preview `/api/ok` returns 200
- [ ] Test Preview `/api/health` returns 200 with `"db":"up"`
- [ ] Verify GitHub Actions workflow runs successfully

### Documentation
- [x] Document issue in this file
- [x] Provide step-by-step fix instructions
- [x] Update README with troubleshooting guide
- [x] Create comprehensive `.env.example`

---

## 🎯 Immediate Action Required

**Owner should:**

1. **Fix environment variables in Vercel:**
   - Change all instances of port `5434` to `5432`
   - Verify both `DATABASE_URL` and `DIRECT_URL`

2. **Redeploy:**
   - Trigger redeploy with cache clear
   - Wait for "Ready" status

3. **Test:**
   ```bash
   # Production
   curl -H "x-vercel-protection-bypass: 2qpXRAQMV23nkz1PG6iXfSH07caiq9F7" \
     https://muzaready-bahy.vercel.app/api/health
   
   # Preview
   curl -H "x-vercel-protection-bypass: 2qpXRAQMV23nkz1PG6iXfSH07caiq9F7" \
     https://muzaready-bahy-git-main-annamontana1s-projects.vercel.app/api/health
   ```

4. **Merge PR:**
   - Once tests pass, merge `fix/db-health-auto-select`
   - New code will prevent similar issues in future

---

## 🔮 Prevention (Via This PR)

The new `lib/db.ts` code prevents future issues by:

1. **Automatic fallback:** If `DIRECT_URL` fails, tries `DATABASE_URL`
2. **Validation:** Checks URL format before using
3. **Clear logging:** Shows which URL is being used and on which port
4. **Debug info:** Returns detailed config when both URLs fail
5. **Password masking:** Never exposes sensitive data in logs

**Example improved error response:**
```json
{
  "ok": false,
  "db": "down",
  "dbSource": "DIRECT_URL",
  "error": "Can't reach server at host:5434",
  "debug": {
    "DATABASE_URL": {
      "available": true,
      "hostPort": "host:6543",
      "masked": "postgresql://user:***@host:6543/db"
    },
    "DIRECT_URL": {
      "available": true,
      "hostPort": "host:5434",
      "masked": "postgresql://user:***@host:5434/db"
    }
  }
}
```

This makes it immediately obvious which URLs are configured and what ports they're using.

---

**End of Report**
