# Mùza Hair E-Commerce Platform - Setup Guide

## Overview

This is a modern e-commerce platform built with Next.js, Prisma, and PostgreSQL, designed specifically for the Mùza Hair business. The platform handles product management, shopping carts, orders, and payment processing via GoPay.

## Architecture & Key Features

- **Frontend**: Next.js 14 with React
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Deployment**: Vercel
- **Payments**: GoPay (Czech payment gateway)
- **Email**: Resend

## Database Configuration

### Supabase PostgreSQL Setup

The application uses dual connection URLs to PostgreSQL:

1. **DATABASE_URL** (pooled at port 6543)
   - Used for **production (Vercel serverless)**
   - Connection pooling via pgBouncer
   - Required for serverless compatibility
   - Format: `postgresql://user:password@host:6543/dbname?schema=public&sslmode=require`

2. **DIRECT_URL** (direct at port 5432)
   - Used for **development and migrations**
   - Direct database connection
   - Preferred for Prisma Studio
   - Format: `postgresql://user:password@host:5432/dbname?schema=public&sslmode=require`

### Why Two Connection URLs?

Vercel's serverless functions create rapid connection/disconnect cycles. A direct PostgreSQL connection (port 5432) can't handle this load. The pgBouncer pooler (port 6543) reuses connections efficiently, making it essential for production.

### How the Application Routes Connections

The `lib/db.ts` file contains `getDbUrl()` function that:
- In **production** (Vercel): Always uses DATABASE_URL (pooler at 6543)
- In **development**: Prefers DIRECT_URL (direct at 5432), falls back to DATABASE_URL

This is detected by checking:
```typescript
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
```

**Critical**: Vercel doesn't set NODE_ENV=production at runtime. The function checks both NODE_ENV and VERCEL_ENV for proper detection.

## Environment Variables Setup

### Step 1: Create .env.local

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Step 2: Database Credentials (Supabase)

Add your PostgreSQL credentials from Supabase:

```env
DATABASE_URL=postgresql://postgres:password@db.XXX.supabase.co:6543/postgres?schema=public&sslmode=require
DIRECT_URL=postgresql://postgres:password@db.XXX.supabase.co:5432/postgres?schema=public&sslmode=require
```

You can find these credentials in:
- Supabase Dashboard → Project Settings → Database → Connection String
- Toggle "Use connection pooler" for DATABASE_URL (shows port 6543)
- Toggle "Direct connection" for DIRECT_URL (shows port 5432)

### Step 3: GoPay Payment Gateway

Set up a merchant account on [GoPay](https://www.gopay.cz):

```env
GOPAY_CLIENT_ID=your_gopay_client_id
GOPAY_CLIENT_SECRET=your_gopay_client_secret
GOPAY_GATEWAY_ID=your_gopay_gateway_id
GOPAY_ENV=test  # Change to 'production' when ready
```

### Step 4: Email Service (Resend)

Set up account on [Resend](https://resend.com):

```env
RESEND_API_KEY=your_resend_api_key
ADMIN_EMAIL=admin@muzahair.cz  # Email for admin notifications
```

### Step 5: Application URLs

For development:
```env
SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production (Vercel):
```env
SITE_URL=https://www.muzahair.cz
NEXT_PUBLIC_APP_URL=https://www.muzahair.cz
```

### Step 6: Vercel Environment Variables

When deploying to Vercel, set these environment variables in Vercel dashboard:
- Go to Project Settings → Environment Variables
- Add all variables from your `.env.local` **except** DIRECT_URL (production doesn't need it)
- For production: Only set DATABASE_URL, GOPAY_*, RESEND_*, and SITE_URL

**Note**: VERCEL_ENV is automatically set by Vercel.

## Database Schema

The database includes these key models:

- **AdminUser**: Admin accounts for platform management
- **User**: Customer accounts with wholesale support
- **Session**: Authentication sessions for users
- **Product**: Product catalog with variants
- **Variant**: Product variations (different sizes, colors)
- **Sku**: Stock Keeping Units with inventory tracking
- **Order**: Customer orders with payment tracking
- **OrderItem**: Items within an order
- **CartItem**: Shopping cart items (session-based)
- **Favorite**: Customer favorites/wishlist
- **StockMovement**: Inventory transaction history
- **PriceMatrix**: Dynamic pricing based on category, tier, length
- **ExchangeRate**: CZK to EUR conversion rates

See `prisma/schema.prisma` for full schema definition.

## Initial Setup & Deployment

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your credentials
```

3. Run database migrations:
```bash
npx prisma migrate deploy
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Start development server:
```bash
npm run dev
```

6. Access Prisma Studio (database UI):
```bash
npx prisma studio
```

### Vercel Deployment

1. Connect your GitHub repository to Vercel

2. In Vercel Project Settings:
   - Environment Variables: Add all variables (without DIRECT_URL)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

3. Important: Do NOT set DIRECT_URL in Vercel - production only uses DATABASE_URL

4. Deploy:
```bash
git push origin main
```

Vercel will automatically deploy on push.

### After Deployment

1. Run migrations on production database:
```bash
npx prisma migrate deploy
```

2. Test the health check endpoint:
```bash
curl https://your-vercel-url.vercel.app/api/health
```

Expected response:
```json
{
  "ok": true,
  "db": "up",
  "dbSource": "DATABASE_URL (pooler/6543)",
  "dbHostPort": "host:6543",
  "dbUrl": "postgresql://***@host:6543/...",
  "status": 200
}
```

## Known Issues & Solutions

### Issue: Database Connection Fails on Vercel

**Symptom**: `/api/health` returns error about connection to port 5432

**Cause**: Serverless functions can't maintain direct connections; need pooled connections

**Solution**: 
- Ensure DATABASE_URL is set (port 6543 pooler)
- Ensure DIRECT_URL is NOT set in Vercel environment
- Update `lib/db.ts` to check VERCEL_ENV (not just NODE_ENV)
- Redeploy without build cache

### Issue: "Cannot read property 'password' of undefined"

**Symptom**: Build fails during migration

**Cause**: Missing DATABASE_URL or DIRECT_URL environment variable

**Solution**:
- Verify both URLs are set in `.env.local`
- For Vercel: DATABASE_URL must be set in environment variables
- Run: `npx prisma generate` locally before pushing

### Issue: Prisma Studio Shows "DIRECT_URL Not Set"

**Symptom**: Can't connect in development

**Cause**: DIRECT_URL missing from `.env.local`

**Solution**:
- Add DIRECT_URL from Supabase (port 5432 direct connection)
- Run: `npx prisma studio`

## API Endpoints

### Health Check
- **GET** `/api/health` - Database connectivity check

### Payment
- **POST** `/api/gopay/create-payment` - Initialize payment
- **POST** `/api/gopay/webhook` - GoPay payment confirmation webhook

### Authentication
- **POST** `/api/auth/register` - User registration
- **POST** `/api/auth/login` - User login
- **POST** `/api/auth/logout` - User logout

### Admin
- Admin endpoints for product management, order processing, etc.

See route files in `app/api/` directory for complete API documentation.

## Deployment Checklist

- [ ] Database URLs configured (DATABASE_URL in Vercel, both local)
- [ ] GoPay credentials set
- [ ] Resend API key set
- [ ] Application URLs configured
- [ ] Migrations run: `npx prisma migrate deploy`
- [ ] Health check passes: `curl /api/health`
- [ ] Payment flow tested (GoPay test mode)
- [ ] Email notifications working
- [ ] Build succeeds without warnings

## Support

For issues or questions:
1. Check `/api/health` endpoint for database status
2. Review Prisma schema in `prisma/schema.prisma`
3. Check Vercel logs in deployment dashboard
4. Review `.env.example` for all required variables

## Security Notes

- Never commit `.env.local` to Git
- Store API keys securely (Vercel environment variables)
- Use connection pooling in production
- Keep GoPay credentials secret
- Mask passwords in logs (see `app/api/health/route.ts`)
- Enable HTTPS (automatic on Vercel)
- Validate all API requests
