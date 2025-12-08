# Error Handling Improvements for Production

## Overview

This document describes the error handling improvements made to diagnose and fix 500 errors in the `/api/admin/login` and `/api/exchange-rate` endpoints.

## Problem Analysis

The original implementation had minimal error logging and no database health checks, making it difficult to diagnose production issues. Common problems that cause 500 errors include:

1. **Database Connectivity Issues** - Connection timeouts or refused connections
2. **Missing Tables** - Database migrations not applied or schema not initialized
3. **Invalid Request Data** - Malformed JSON or missing required fields
4. **Authentication Failures** - Session validation issues

## Solution Architecture

### New Files Created

#### 1. `/lib/prisma-health.ts`
Database health check utilities that test connectivity and table availability without exposing sensitive data.

**Key Functions:**
- `checkDatabaseConnectivity()` - Simple connectivity check using `SELECT 1`
- `checkAdminUsersTable()` - Verify admin_users table exists
- `checkExchangeRateTable()` - Verify exchange_rates table exists
- `performHealthCheck()` - Comprehensive health status report

**Usage:**
```typescript
const dbConnected = await checkDatabaseConnectivity();
if (!dbConnected) {
  // Handle database down scenario
}

const tableExists = await checkAdminUsersTable();
if (!tableExists) {
  // Handle missing table scenario
}
```

#### 2. `/lib/error-logger.ts`
Structured error logging that captures details for debugging while redacting sensitive information.

**Key Features:**
- Automatic error type detection (database, auth, etc.)
- Sensitive data sanitization (emails, tokens, passwords)
- Contextual error hints for common issues
- Production-safe error messages for users

**Functions:**
- `isDatabaseError()` - Detect database-related errors
- `isAuthError()` - Detect authentication errors
- `sanitizeErrorMessage()` - Remove sensitive data from logs
- `logError()` - Structured logging with context
- `getUserFriendlyMessage()` - Generate safe error messages for clients
- `getStatusCodeForError()` - Determine appropriate HTTP status code

**Usage:**
```typescript
logError(
  {
    endpoint: '/api/admin/login',
    method: 'POST',
    timestamp: new Date(),
  },
  error,
  'admin_login'
);

const message = getUserFriendlyMessage(error, '/api/admin/login');
const statusCode = getStatusCodeForError(error, 500);
```

#### 3. `/lib/api-response.ts`
Wrapper utilities for consistent API error responses and validation.

**Functions:**
- `handleApiError()` - Central error handling for all API routes
- `validateRequiredFields()` - Request validation helper
- `validationError()` - Generate validation error responses

**Usage:**
```typescript
// In catch block
catch (error) {
  return handleApiError('/api/admin/login', 'POST', error, 'admin_login');
}

// Validate request
const validation = validateRequiredFields({ email, password }, ['email', 'password']);
if (!validation.valid) {
  return validationError(validation.missingFields);
}
```

#### 4. `/app/api/health-detailed/route.ts`
New endpoint to monitor database health for alerting and diagnostics.

**Endpoint:** `GET /api/health-detailed`

**Response (Healthy):**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-03T10:30:00Z",
  "checks": {
    "database": true,
    "adminUsersTable": true,
    "exchangeRateTable": true
  }
}
```

**Response (Unhealthy):**
```json
{
  "status": "unhealthy",
  "timestamp": "2024-12-03T10:30:00Z",
  "checks": {
    "database": false,
    "adminUsersTable": false,
    "exchangeRateTable": false
  },
  "errors": ["Database connectivity failed"]
}
```

### Updated Files

#### 1. `/app/api/admin/login/route.ts`
Enhanced with:
- Database connectivity check before queries
- admin_users table existence check
- Request body validation
- Structured error handling with `handleApiError()`
- Detailed logging without exposing credentials

**Key Changes:**
- Added `checkDatabaseConnectivity()` call before database query
- Added `checkAdminUsersTable()` call before admin lookup
- Added request body validation
- Added proper error type detection and status codes

**Error Handling:**
- 400 - Invalid/missing request body or fields
- 401 - Authentication failed (bad email/password)
- 403 - Account inactive
- 503 - Database unavailable or schema error
- 500 - Unexpected error (handled by `handleApiError()`)

#### 2. `/app/api/exchange-rate/route.ts`
Enhanced with:
- Database connectivity check before queries
- exchange_rates table existence check
- Structured error handling for GET and POST
- Better error type detection

**Key Changes:**
- Added health checks to both GET and POST handlers
- Request body validation for POST
- Structured error logging with operation context
- Appropriate status codes (503 for database issues, 500 for other errors)

## Error Response Format

All errors now follow a consistent format:

```json
{
  "error": "User-friendly error message",
  "details": "Technical details (development only)"
}
```

**Important:** The `details` field is only included in development mode to prevent information leakage in production.

## Logging Format

Structured logs are written to console with the following information:

```
[2024-12-03T10:30:00Z] POST /api/admin/login {
  operation: 'admin_login',
  error: 'PrismaClientInitializationError',
  message: 'Can not find a "[table name]" in the datamodel. [redacted email]',
  hint: 'Database connectivity or schema issue - check connection and migrations',
  isCritical: true
}
```

**Sensitive Data Redaction:**
- Email addresses → `[email]`
- UUIDs/CUIDs → `[uuid]` / `[cuid]`
- Tokens → `[token]` / `[bearer-token]`
- Passwords → `password: [redacted]`
- API Keys → `api_key: [redacted]`

## Deployment Checklist

Before deploying to production:

1. **Database Verification**
   - Ensure DATABASE_URL environment variable is set correctly
   - Run `npx prisma migrate deploy` to apply all migrations
   - Verify admin_users and exchange_rates tables exist

2. **Testing**
   - Call `GET /api/health-detailed` to verify health endpoint works
   - Test admin login with valid and invalid credentials
   - Test exchange rate GET and POST endpoints
   - Verify error responses don't expose sensitive data

3. **Monitoring**
   - Set up alerts for `GET /api/health-detailed` returning status: "unhealthy"
   - Monitor logs for database connectivity errors
   - Watch for repeated 503 responses on critical endpoints

4. **Rollback Plan**
   - Keep previous version accessible
   - Document DATABASE_URL and migration status before deployment
   - Test rollback procedure

## Common Issues and Solutions

### Issue: 503 "Database service temporarily unavailable"
- **Cause:** Connection refused or timeout
- **Solution:**
  - Check DATABASE_URL is correct
  - Verify database server is running
  - Check network connectivity
  - Review database logs for connection issues

### Issue: 503 "Database schema error"
- **Cause:** Tables don't exist or schema is incomplete
- **Solution:**
  - Run `npx prisma migrate deploy`
  - Verify migrations in `/prisma/migrations` folder
  - Check if database was recently reset without migrations

### Issue: 400 "Missing required fields"
- **Cause:** Request body is malformed or incomplete
- **Solution:**
  - For login: Ensure both `email` and `password` are provided
  - For exchange-rate: Ensure either `czkToEur` or `eurToCzk` is provided and > 0

### Issue: 401 "Nesprávný email nebo heslo"
- **Cause:** Invalid credentials or admin user doesn't exist
- **Solution:**
  - Verify email address is correct
  - Check password is correct
  - Verify admin user exists in database: `SELECT * FROM admin_users WHERE email = '...'`

## Performance Considerations

Health checks are lightweight and should not significantly impact performance:

- `checkDatabaseConnectivity()` - ~1-5ms (single SELECT statement)
- `checkAdminUsersTable()` - ~1-5ms (schema validation query)
- `checkExchangeRateTable()` - ~1-5ms (schema validation query)

For high-traffic scenarios, consider:
- Caching health check results for 10-30 seconds
- Running health checks asynchronously in background
- Using a separate health check service

## Future Improvements

1. **Enhanced Monitoring**
   - Add structured logging to ELK stack or CloudWatch
   - Create dashboards for error rates by type
   - Set up automatic alerts for specific error patterns

2. **Database Connection Pool**
   - Monitor connection pool exhaustion
   - Add metrics for connection count and wait times
   - Implement connection pool health checks

3. **Graceful Degradation**
   - Cache exchange rates in memory
   - Return stale data if database unavailable
   - Implement circuit breaker pattern for database calls

4. **Better Error Recovery**
   - Implement retry logic with exponential backoff
   - Add request queuing for temporary outages
   - Provide estimated recovery time to clients

## References

- Prisma Error Handling: https://www.prisma.io/docs/reference/api-reference/prisma-client-js#error-types
- Next.js API Routes: https://nextjs.org/docs/api-routes/introduction
- HTTP Status Codes: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
