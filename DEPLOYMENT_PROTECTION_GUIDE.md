# Deployment Protection Bypass Guide

## Issue
The Vercel deployment has Deployment Protection enabled (`"public": false` in `vercel.json`), which requires authentication for all routes including API health checks.

## Solution Options

### Option 1: Use Bypass Token (Recommended for CI/CD)
When testing endpoints programmatically, use the `VERCEL_AUTOMATION_BYPASS_SECRET` token:

```bash
# Via query parameter (sets cookie)
curl "https://muzaready-bahy.vercel.app/api/ok?x-vercel-set-bypass-cookie=true&x-vercel-protection-bypass=${VERCEL_AUTOMATION_BYPASS_SECRET}"

# Via header (for API calls)
curl -H "x-vercel-protection-bypass: ${VERCEL_AUTOMATION_BYPASS_SECRET}" \
  "https://muzaready-bahy.vercel.app/api/health"
```

### Option 2: Exempt Specific Routes (Dashboard Configuration)
To make health check routes public:
1. Go to Vercel Dashboard → Project Settings → Deployment Protection
2. Add path exclusions for:
   - `/api/ok`
   - `/api/health`
   - `/api/ping`

### Option 3: Disable Deployment Protection
Change `vercel.json`:
```json
{
  "public": true
}
```
⚠️ **Not recommended** - This makes the entire site public.

## Current Configuration

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string (port 6543 - pooler)
- `DIRECT_URL` - PostgreSQL direct connection (port 5432)
- `VERCEL_AUTOMATION_BYPASS_SECRET` - For automated testing

### Health Check Behavior
- `/api/ok` - Simple health check (always returns `{"ok": true}`)
- `/api/health` - Database health check with connection details
  - Uses `DIRECT_URL` (port 5432) preferentially for reliable checks
  - Falls back to `DATABASE_URL` (port 6543) if DIRECT_URL unavailable
  - Returns 200 with `db: "up"` on success
  - Returns 500 with error details on failure

## Testing
```bash
# Get bypass token from Vercel dashboard:
# Settings → Deployment Protection → Automation Bypass

# Export token
export VERCEL_AUTOMATION_BYPASS_SECRET="<your-token>"

# Test endpoints
curl -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" \
  "https://muzaready-bahy.vercel.app/api/ok"

curl -H "x-vercel-protection-bypass: $VERCEL_AUTOMATION_BYPASS_SECRET" \
  "https://muzaready-bahy.vercel.app/api/health"
```
