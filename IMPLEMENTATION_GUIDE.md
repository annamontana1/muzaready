# Implementation Guide - Using New Error Handling Utilities

## For API Endpoint Developers

### Basic Template for New API Endpoints

Use this template when creating new API endpoints to ensure consistent error handling:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { handleApiError, validateRequiredFields, validationError } from '@/lib/api-response';
import { checkDatabaseConnectivity, checkAdminUsersTable } from '@/lib/prisma-health';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const endpoint = '/api/your-endpoint';
  const method = 'POST';

  try {
    // 1. Parse and validate request body
    let body: Record<string, unknown>;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }

    // 2. Validate required fields
    const { field1, field2 } = body;
    const validation = validateRequiredFields({ field1, field2 }, ['field1', 'field2']);
    if (!validation.valid) {
      return validationError(validation.missingFields);
    }

    // 3. Check database connectivity (if using database)
    const dbConnected = await checkDatabaseConnectivity();
    if (!dbConnected) {
      console.error('[Your Endpoint] Database connectivity check failed');
      return NextResponse.json(
        { error: 'Database service temporarily unavailable. Please try again in a moment.' },
        { status: 503 }
      );
    }

    // 4. Check required tables exist (if using database)
    const tablesExist = await checkYourTable(); // Create as needed
    if (!tablesExist) {
      console.error('[Your Endpoint] Required table check failed');
      return NextResponse.json(
        { error: 'Database schema error. Contact system administrator.' },
        { status: 503 }
      );
    }

    // 5. Perform business logic
    const result = await prisma.yourModel.findMany({
      where: { field1: field1 as string },
    });

    // 6. Return success response
    return NextResponse.json(result);
  } catch (error) {
    // 7. Handle all unexpected errors consistently
    return handleApiError(endpoint, method, error, 'operation_name');
  }
}
```

## Common Patterns

### Pattern 1: Validating Required Fields

```typescript
import { validateRequiredFields, validationError } from '@/lib/api-response';

const { email, password, name } = request.body;
const validation = validateRequiredFields(
  { email, password, name },
  ['email', 'password'] // Only email and password are required
);

if (!validation.valid) {
  return validationError(validation.missingFields);
  // Returns: 400 "Missing required fields: email, password"
}
```

### Pattern 2: Checking Database Health Before Queries

```typescript
import { checkDatabaseConnectivity, checkAdminUsersTable } from '@/lib/prisma-health';

const dbConnected = await checkDatabaseConnectivity();
if (!dbConnected) {
  console.error('[Endpoint Name] Database connectivity failed');
  return NextResponse.json(
    { error: 'Database service temporarily unavailable. Please try again in a moment.' },
    { status: 503 }
  );
}

const tableExists = await checkAdminUsersTable();
if (!tableExists) {
  console.error('[Endpoint Name] admin_users table missing');
  return NextResponse.json(
    { error: 'Database schema error. Contact system administrator.' },
    { status: 503 }
  );
}
```

### Pattern 3: Logging Errors Securely

```typescript
import { logError } from '@/lib/error-logger';

try {
  // ... do something
} catch (error) {
  logError(
    {
      endpoint: '/api/your-endpoint',
      method: 'POST',
      timestamp: new Date(),
    },
    error,
    'operation_name'
  );

  // Error is logged securely with sensitive data redacted
  // No need to expose error details to users
}
```

### Pattern 4: Centralized Error Handling

```typescript
import { handleApiError } from '@/lib/api-response';

try {
  // ... API logic
} catch (error) {
  // All errors go through this handler which:
  // - Logs securely
  // - Determines appropriate status code (503 for database, 401 for auth, etc)
  // - Returns user-friendly error message
  return handleApiError('/api/endpoint', 'POST', error, 'operation_name');
}
```

### Pattern 5: Custom Table Health Check

To create a health check for a new table:

```typescript
import prisma from '@/lib/prisma';

export async function checkYourTable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1 FROM "your_table_name" LIMIT 1`;
    return true;
  } catch (error) {
    console.error('[Database Health] your_table_name check failed:', {
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}
```

## Error Messages - What Users See

### Request Validation Errors
```json
{
  "error": "Missing required fields",
  "details": "Required fields missing: email, password"
}
```
Status: 400

### Invalid Request Body
```json
{
  "error": "Invalid request body"
}
```
Status: 400

### Authentication Errors
```json
{
  "error": "Your session is invalid or has expired. Please log in again."
}
```
Status: 401

### Authorization Errors
```json
{
  "error": "You do not have permission to perform this action."
}
```
Status: 403

### Database Unavailable
```json
{
  "error": "We are experiencing a temporary database issue. Please try again in a few moments."
}
```
Status: 503

### Generic Server Error (Development)
```json
{
  "error": "An unexpected error occurred. Please try again later.",
  "details": "TypeError: Cannot read property 'field' of undefined"
}
```
Status: 500 (details only in development)

### Generic Server Error (Production)
```json
{
  "error": "An unexpected error occurred. Please try again later."
}
```
Status: 500 (no technical details exposed)

## Monitoring and Debugging

### Health Check Endpoint
```bash
# Check overall system health
curl https://api.example.com/api/health-detailed

# Response
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

### Reading Error Logs
Errors are logged in a structured format that's easy to parse:

```
[2024-12-03T10:30:00Z] POST /api/admin/login {
  operation: 'admin_login',
  error: 'PrismaClientKnownRequestError',
  message: 'Table "[table name]" does not exist in the current database.',
  hint: 'Database connectivity or schema issue - check connection and migrations',
  isCritical: true
}
```

### Common Error Patterns

**Database Connection Refused:**
```
error: 'PrismaClientInitializationError'
message: 'Can\'t reach database server'
hint: 'Database connectivity or schema issue - check connection and migrations'
```
→ Solution: Check DATABASE_URL, verify database is running

**Missing Table:**
```
error: 'PrismaClientKnownRequestError'
message: 'Table "[table name]" does not exist'
hint: 'Database connectivity or schema issue - check connection and migrations'
```
→ Solution: Run `npx prisma migrate deploy`

**Connection Timeout:**
```
error: 'PrismaClientInitializationError'
message: 'Connection timeout'
hint: 'Database connectivity or schema issue - check connection and migrations'
```
→ Solution: Check database is responding, increase timeout if needed

## Performance Considerations

### When to Use Health Checks

Use database health checks:
- Before critical operations (auth, payments)
- For endpoints that handle frequently missing tables
- When database issues are known to be common

Don't use health checks:
- For every read operation (caches results locally)
- In tight loops or high-frequency operations
- If database availability is very stable

### Optimization Strategies

If health checks impact performance:

```typescript
// Cache health check results
const healthCheckCache = new Map<string, { result: boolean; timestamp: Date }>();
const CACHE_DURATION_MS = 30000; // 30 seconds

async function checkDatabaseConnectivityCached(): Promise<boolean> {
  const cached = healthCheckCache.get('db-connectivity');

  if (cached && Date.now() - cached.timestamp.getTime() < CACHE_DURATION_MS) {
    return cached.result;
  }

  const result = await checkDatabaseConnectivity();
  healthCheckCache.set('db-connectivity', {
    result,
    timestamp: new Date(),
  });

  return result;
}
```

## Testing

### Unit Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { sanitizeErrorMessage } from '@/lib/error-logger';

describe('Error Logger', () => {
  it('should redact email addresses', () => {
    const message = 'Error for user test@example.com';
    const sanitized = sanitizeErrorMessage(message);
    expect(sanitized).toBe('Error for user [email]');
  });

  it('should redact tokens', () => {
    const message = 'Invalid token: abc123def456';
    const sanitized = sanitizeErrorMessage(message);
    expect(sanitized).toBe('Invalid token: [token]');
  });
});
```

### Integration Test Example
```typescript
import { describe, it, expect } from 'vitest';
import { POST } from '@/app/api/admin/login/route';

describe('Admin Login', () => {
  it('should return 400 for missing email', async () => {
    const request = new Request('http://localhost:3000/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password: 'test' }),
    });

    const response = await POST(request as any);
    expect(response.status).toBe(400);
  });

  it('should return 503 when database is unavailable', async () => {
    // Mock checkDatabaseConnectivity to return false
    // Then verify endpoint returns 503
  });
});
```

## Migration Path for Existing Endpoints

To update existing endpoints to use the new error handling:

1. **Add imports**
   ```typescript
   import { handleApiError, validateRequiredFields } from '@/lib/api-response';
   import { checkDatabaseConnectivity, checkAdminUsersTable } from '@/lib/prisma-health';
   ```

2. **Add context variables**
   ```typescript
   const endpoint = '/api/your-endpoint';
   const method = 'POST';
   ```

3. **Add validation**
   ```typescript
   const validation = validateRequiredFields(body, ['field1', 'field2']);
   if (!validation.valid) return validationError(validation.missingFields);
   ```

4. **Add health checks**
   ```typescript
   const dbConnected = await checkDatabaseConnectivity();
   if (!dbConnected) return /* error response */;
   ```

5. **Replace catch block**
   ```typescript
   // Old
   catch (error) {
     console.error('Error:', error);
     return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
   }

   // New
   catch (error) {
     return handleApiError(endpoint, method, error, 'operation_name');
   }
   ```

## Questions & Troubleshooting

**Q: Should I check database connectivity for every endpoint?**
A: No, only for endpoints that frequently fail due to database issues. Lightweight endpoints can skip it.

**Q: How do I add health checks for my custom table?**
A: Create a function in `/lib/prisma-health.ts` following the existing pattern, or add it to your endpoint directly.

**Q: Will health checks slow down my API?**
A: Minimally. Each check is a simple SQL query (~1-5ms). Use caching if needed.

**Q: How do I monitor error logs?**
A: Use the structured format to parse logs with tools like grep, awk, or log aggregation services.

**Q: Can I customize error messages per endpoint?**
A: Yes, replace the generic `handleApiError` call with custom error handling in your endpoint.
