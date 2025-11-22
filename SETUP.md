# Mùza Hair E-Commerce Platform - Setup Guide

## Overview

This is a modern e-commerce platform built with Next.js, Prisma, and Turso serverless SQLite database, designed specifically for the Mùza Hair business. The platform handles product management, shopping carts, orders, and payment processing via GoPay.

## Architecture & Key Features

- **Frontend**: Next.js 14 with React
- **Backend**: Next.js API Routes
- **Database**: Turso (serverless SQLite with LibSQL)
- **ORM**: Prisma
- **Deployment**: Vercel
- **Payments**: GoPay (Czech payment gateway)
- **Email**: Resend

## Database Configuration

### Hybrid SQLite Setup (Local + Turso)

The application uses a **hybrid database approach**:
- **Development**: Local SQLite (file:./dev.db) for local testing and Prisma migrations
- **Production**: Turso serverless SQLite for Vercel deployment

This approach works around Prisma's limitation with the SQLite provider, which only supports local `file://` URLs and not remote `libsql://` protocols.

**Why this hybrid approach?**

1. **Prisma Compatibility**: Prisma's SQLite provider only supports local `file://` URLs, not Turso's `libsql://` protocol
2. **Development Experience**: Local SQLite allows running migrations without external dependencies
3. **Production Ready**: Turso provides serverless SQLite optimized for Vercel edge functions

**Database Configuration:**

Development:
```
DATABASE_URL=file:./dev.db
```

Production (Vercel):
```
TURSO_CONNECTION_URL=libsql://[database-name].turso.io?authToken=[your-token]
```

### How the Database Works

- **For Prisma**: Uses `DATABASE_URL` (local SQLite) for migrations and schema synchronization
- **For Runtime**: The application code accesses `TURSO_CONNECTION_URL` for production Turso connection
  - Local development uses the local dev.db file
  - Production (Vercel) connects to remote Turso database
- **Environment-based routing**: The `lib/db.ts` file returns the appropriate database URL based on environment

## Environment Variables Setup

### Step 1: Create .env.local

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### Step 2: Database Credentials (Hybrid Setup)

Set up both local SQLite for development and Turso for production:

**Development (Local SQLite):**
```env
DATABASE_URL=file:./dev.db
```

**Production (Turso):**
1. Create database at https://turso.tech
2. Get your database URL from the Turso dashboard
3. Generate an authentication token
4. Set in .env.local for testing, in Vercel for production:
```env
TURSO_CONNECTION_URL=libsql://muzaready-username.aws-eu-west-1.turso.io?authToken=YOUR_TOKEN_HERE
```

**Note**: The local dev.db will be created automatically when running Prisma migrations. For Vercel, only set TURSO_CONNECTION_URL (not DATABASE_URL)

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
- Add TURSO_CONNECTION_URL with your full Turso connection string
- Add GOPAY_*, RESEND_*, and SITE_URL variables
- No special setup needed - Turso handles everything transparently

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

### Issue: Database Connection Fails

**Symptom**: `/api/health` returns connection error

**Cause**: TURSO_CONNECTION_URL not set or invalid

**Solution**:
- Verify TURSO_CONNECTION_URL is set in `.env.local`
- Check the connection URL format: `libsql://[db-name].turso.io?authToken=[token]`
- Ensure the auth token is valid and hasn't expired
- For Vercel: Set TURSO_CONNECTION_URL in environment variables

### Issue: "TURSO_CONNECTION_URL environment variable is not set"

**Symptom**: Build or runtime error about missing environment variable

**Cause**: TURSO_CONNECTION_URL not configured

**Solution**:
- Get your Turso connection URL from https://turso.tech dashboard
- Add it to `.env.local`
- For Vercel: Add it to Project Settings → Environment Variables
- Run: `npx prisma generate` locally before pushing

### Issue: Turso CLI Commands Don't Work

**Symptom**: `turso` command not found

**Cause**: Turso CLI not installed (optional - web dashboard works fine)

**Solution**:
- Use Turso web dashboard at https://turso.tech instead
- Or install Turso CLI if needed: `curl https://get.turso.tech | bash`

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

- [ ] Turso database created at https://turso.tech
- [ ] TURSO_CONNECTION_URL set locally in `.env.local`
- [ ] TURSO_CONNECTION_URL set in Vercel environment variables
- [ ] GoPay credentials set
- [ ] Resend API key set
- [ ] Application URLs configured
- [ ] Prisma migrations created: `npx prisma migrate dev`
- [ ] Health check passes: `curl /api/health`
- [ ] Payment flow tested (GoPay test mode)
- [ ] Email notifications working
- [ ] Build succeeds without warnings: `npm run build`

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
