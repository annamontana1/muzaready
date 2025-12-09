# Quick Fix Guide - Admin Testing Blocked

## Problem
❌ **Login fails with "Nesprávný email nebo heslo"**

## Root Cause
**No admin account exists in production database**

---

## Solution (Choose One)

### Option 1: SQL Query (Fastest - 2 minutes)

1. Go to Vercel Dashboard
2. Open your project
3. Go to Storage → Postgres → SQL Editor
4. **First, check if admin exists:**
   ```sql
   SELECT * FROM "AdminUser";
   ```

5. **If empty, you need to create an admin:**
   ```sql
   -- You'll need to generate password hash first
   -- Use this Node.js script:
   ```

6. **Generate password hash:**
   ```bash
   # In your project directory
   node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('muza2024Admin!', 10).then(hash => console.log(hash));"
   ```

7. **Then run SQL with the hash:**
   ```sql
   INSERT INTO "AdminUser" (id, name, email, password, role, status, "createdAt", "updatedAt")
   VALUES (
     gen_random_uuid()::text,
     'Muza Admin',
     'muzahaircz@gmail.com',
     '$2a$10$YOUR_HASH_HERE',  -- Replace with hash from step 6
     'admin',
     'active',
     NOW(),
     NOW()
   );
   ```

---

### Option 2: Temporary Setup API (Safer - 5 minutes)

1. **Create this file:** `app/api/admin/setup/route.ts`
   ```typescript
   import { hashPassword } from '@/lib/admin-auth';
   import prisma from '@/lib/prisma';

   export async function POST(request: Request) {
     const { secret } = await request.json();

     // Security check
     if (secret !== 'TEMP_SETUP_SECRET_12345') {
       return Response.json({ error: 'Unauthorized' }, { status: 401 });
     }

     // Check if admin exists
     const existing = await prisma.adminUser.findUnique({
       where: { email: 'muzahaircz@gmail.com' }
     });

     if (existing) {
       return Response.json({ error: 'Admin already exists' }, { status: 400 });
     }

     // Create admin
     const hashedPassword = await hashPassword('muza2024Admin!');

     const admin = await prisma.adminUser.create({
       data: {
         name: 'Muza Admin',
         email: 'muzahaircz@gmail.com',
         password: hashedPassword,
         role: 'admin',
         status: 'active',
       },
     });

     return Response.json({
       success: true,
       admin: { id: admin.id, email: admin.email }
     });
   }
   ```

2. **Deploy to Vercel:**
   ```bash
   git add app/api/admin/setup/route.ts
   git commit -m "Add temporary admin setup endpoint"
   git push
   ```

3. **Call the API:**
   ```bash
   curl -X POST https://muzaready-iota.vercel.app/api/admin/setup \
     -H "Content-Type: application/json" \
     -d '{"secret":"TEMP_SETUP_SECRET_12345"}'
   ```

4. **IMMEDIATELY DELETE THE FILE:**
   ```bash
   git rm app/api/admin/setup/route.ts
   git commit -m "Remove temporary setup endpoint"
   git push
   ```

---

### Option 3: Local Script with Production DB (Most Reliable - 3 minutes)

1. **Get DATABASE_URL from Vercel:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Copy the `DATABASE_URL` value

2. **Add to local `.env.local`:**
   ```bash
   DATABASE_URL="postgresql://..."
   ```

3. **Edit the production admin script:**
   - File: `scripts/create-production-admin.ts`
   - Line 16-17: Update email/password if needed

4. **Run the script:**
   ```bash
   npx tsx scripts/create-production-admin.ts
   ```

5. **Remove DATABASE_URL from `.env.local`** (security)

---

## After Admin is Created

### Test Login Manually
```
URL: https://muzaready-iota.vercel.app/admin/login
Email: muzahaircz@gmail.com
Password: muza2024Admin!
```

### Run Automated Tests
```bash
node test-admin-features.js
```

This will test all features automatically and generate screenshots.

---

## Test Results Location

- Console output: Pass/Fail for each test
- Screenshots: `test-screenshots/` directory
- Full report: `FINAL_ADMIN_TEST_REPORT.md`

---

## Quick Verification

After creating admin, verify it works:

```bash
node test-login-debug.js
```

Should show:
- ✅ Status 200 (not 401)
- ✅ Redirect to /admin
- ✅ "LOGIN SUCCESSFUL!"

---

## Need Help?

**Admin not found:** Use Option 1 or 2
**Password wrong:** Reset using SQL UPDATE query
**Account inactive:** UPDATE status to 'active'
**Still failing:** Check `FINAL_ADMIN_TEST_REPORT.md` for details

---

## Important Files

- `FINAL_ADMIN_TEST_REPORT.md` - Full test report
- `RUN_TESTS.md` - How to run tests
- `test-admin-features.js` - Main test suite
- `test-screenshots/` - Visual evidence
