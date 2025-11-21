# GitHub Actions Setup Guide

**Project:** muzaready-bahy  
**Purpose:** Automated deployment verification for `/api/ok` and `/api/health` endpoints

---

## 🚀 Quick Setup

### Required: Add Vercel Bypass Secret

The GitHub Actions workflow needs access to the Vercel protection bypass secret to test protected deployments.

**Steps:**

1. **Get the secret from Vercel:**
   - Go to: https://vercel.com/annamontana1s-projects/muzaready-bahy/settings/environment-variables
   - Find: `VERCEL_AUTOMATION_BYPASS_SECRET`
   - Copy the value: `2qpXRAQMV23nkz1PG6iXfSH07caiq9F7`

2. **Add to GitHub repository secrets:**
   - Go to: https://github.com/annamontana1/muzaready/settings/secrets/actions
   - Click: "New repository secret"
   - Name: `VERCEL_AUTOMATION_BYPASS_SECRET`
   - Value: `2qpXRAQMV23nkz1PG6iXfSH07caiq9F7`
   - Click: "Add secret"

3. **Verify it works:**
   - Trigger a new deployment (push to main or redeploy)
   - Check GitHub Actions: https://github.com/annamontana1/muzaready/actions
   - Workflow should show: ✅ All tests passing

---

## 📋 Workflow Details

### File: `.github/workflows/verify.yml`

**Trigger:** After every successful Vercel deployment

**What it does:**
1. Waits 10 seconds for deployment to stabilize
2. Tests `/api/ok` endpoint (must return 200)
3. Tests `/api/health` endpoint (must return 200 or 500, not 404)
4. Detects port 5434 errors automatically
5. Provides actionable error messages

### Test Scenarios

| Scenario | HTTP Code | Workflow Result | Action |
|----------|-----------|-----------------|--------|
| `/api/ok` returns 200 | 200 | ✅ Pass | None |
| `/api/ok` returns 401 | 401 | ❌ Fail | Add GitHub secret |
| `/api/ok` returns other | 4xx/5xx | ❌ Fail | Check deployment |
| `/api/health` returns 200 with `"db":"up"` | 200 | ✅ Pass | None |
| `/api/health` returns 500 (DB issue) | 500 | ⚠️ Warn | Fix DATABASE_URL/DIRECT_URL |
| `/api/health` returns 500 (port 5434) | 500 | ❌ Fail | Fix port in env vars |
| `/api/health` returns 404 | 404 | ❌ Fail | Deployment broken |
| `/api/health` returns 401 | 401 | ⚠️ Skip | Add GitHub secret (optional) |

---

## 🔧 Handling Different Configurations

### Option 1: Vercel Protection Enabled (Recommended)

**Configuration:**
- Vercel deployment has protection enabled
- GitHub secret `VERCEL_AUTOMATION_BYPASS_SECRET` is set

**Behavior:**
- All requests include `x-vercel-protection-bypass` header
- Full validation runs on every deployment
- ✅ Recommended for production

---

### Option 2: Vercel Protection Enabled, Secret Not Set

**Configuration:**
- Vercel deployment has protection enabled
- GitHub secret `VERCEL_AUTOMATION_BYPASS_SECRET` is NOT set

**Behavior:**
- Requests fail with 401
- `/api/ok`: ❌ Fails with instructions to add secret
- `/api/health`: ⚠️ Skips validation (doesn't fail build)

**When to use:**
- Temporary state while setting up
- Allows deployments to continue without blocking

---

### Option 3: Vercel Protection Disabled

**Configuration:**
- Vercel deployment protection is disabled
- GitHub secret not needed

**Behavior:**
- All requests work without bypass header
- Full validation runs
- ✅ Works out of the box

**Note:** Less secure, not recommended for production

---

## 🛠️ Troubleshooting

### Problem: Workflow fails with 401

**Error Message:**
```
❌ /api/ok returned 401 Unauthorized
This deployment has Vercel Protection enabled.
```

**Solution:**
Add `VERCEL_AUTOMATION_BYPASS_SECRET` to GitHub secrets (see Quick Setup above)

---

### Problem: Workflow detects port 5434

**Error Message:**
```
❌ ERROR: Wrong port 5434 detected!
Fix: Update DATABASE_URL or DIRECT_URL to use correct ports:
  - Pooler: 6543
  - Direct: 5432
```

**Solution:**
1. Go to Vercel → `muzaready-bahy` → Settings → Environment Variables
2. Update `DATABASE_URL` and `DIRECT_URL` to use correct ports
3. Redeploy with clear cache

---

### Problem: /api/health returns 500 (other DB errors)

**Error Message:**
```
⚠️  /api/health returned 500 - database connection issue
Note: This might be a temporary connection issue
```

**Solution:**
1. Check Vercel logs for detailed error
2. Verify database is not paused (Supabase free tier)
3. Check connection limits
4. Verify SSL mode is set correctly

---

### Problem: Workflow doesn't run at all

**Possible Causes:**
1. Workflow file not in `main` branch
2. GitHub Actions not enabled for repository
3. Deployment didn't trigger `deployment_status` event

**Solution:**
1. Merge PR to `main` branch
2. Enable Actions: Repository → Settings → Actions → Allow all actions
3. Trigger manual deployment from Vercel

---

## 📊 Monitoring

### View Workflow Runs

**GitHub Actions Dashboard:**
https://github.com/annamontana1/muzaready/actions

**Filter by workflow:**
- Click on "Verify Deployment" in left sidebar
- See all runs with status and logs

### Notifications

**On Failure:**
- GitHub sends email to PR author
- Deployment shows warning in Vercel dashboard
- PR shows failed check

**On Success:**
- Green checkmark in PR
- Deployment proceeds normally

---

## 🔐 Security Notes

### Bypass Secret

**What it does:**
- Allows automated testing of protected deployments
- Bypasses Vercel Authentication/Protection
- Valid for all environments (Production, Preview)

**Security:**
- ✅ Stored as encrypted GitHub secret
- ✅ Only accessible to GitHub Actions
- ✅ Not visible in logs or PR comments
- ✅ Can be rotated in Vercel if compromised

**Best Practice:**
- Keep the secret confidential
- Rotate periodically (every 3-6 months)
- Don't share in public issues or PRs
- Remove from Vercel if no longer using automation

---

## 📖 Related Documentation

- **Workflow File:** `.github/workflows/verify.yml`
- **Database Setup:** `README.md` → Database Setup section
- **Test Report:** `TEST_REPORT.md`
- **Diagnosis:** `DB_DIAGNOSIS.md`

---

## 🎯 Success Criteria

**Setup is complete when:**
- [ ] `VERCEL_AUTOMATION_BYPASS_SECRET` added to GitHub secrets
- [ ] Latest deployment triggered
- [ ] GitHub Actions workflow runs automatically
- [ ] All checks show green ✅
- [ ] No 401 errors in logs

**Deployment is healthy when:**
- [ ] `/api/ok` returns 200 with `{"ok":true}`
- [ ] `/api/health` returns 200 with `"db":"up"`
- [ ] No port 5434 errors
- [ ] Workflow completes in <30 seconds

---

## 🆘 Support

**If you need help:**
1. Check workflow logs in GitHub Actions
2. Review error messages (they include fix instructions)
3. See troubleshooting section above
4. Check related documentation files

**Common issues are documented in:**
- `README.md` → Troubleshooting section
- `DB_DIAGNOSIS.md` → Root cause analysis
- This file → Troubleshooting section

---

**Last Updated:** 2025-11-21  
**Status:** Ready to use after adding GitHub secret
