# Error Handling Flow Diagram

## Request Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INCOMING API REQUEST                               │
│                    (POST /api/admin/login or GET /exchange-rate)            │
└────────────────────────────────┬────────────────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │ Parse Request Body     │
                    │ (try-catch)            │
                    └────────┬───────────────┘
                             │
                    ┌────────▼────────┐
                    │ Valid JSON?     │
                    └────┬────────┬───┘
                  YES│         │NO
                     │         ▼
                     │   ┌──────────────────┐
                     │   │ 400 Bad Request  │
                     │   │ Invalid Body     │
                     │   └──────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │ Validate Required Fields   │
        │ (email, password, etc)     │
        └────────┬──────────────┬────┘
             YES│              │NO
                │              ▼
                │     ┌─────────────────────┐
                │     │ 400 Bad Request     │
                │     │ Missing Fields List │
                │     └─────────────────────┘
                │
                ▼
    ┌───────────────────────────────┐
    │ Check Database Connectivity   │
    │ (SELECT 1 timeout check)      │
    └────────┬──────────────────┬───┘
         OK│                    │TIMEOUT
          │                    ▼
          │        ┌──────────────────────┐
          │        │ 503 Service Down     │
          │        │ DB Unavailable       │
          │        │ [Log Error]          │
          │        └──────────────────────┘
          │
          ▼
    ┌────────────────────────────┐
    │ Check Table Existence      │
    │ (admin_users/exchange_rate)│
    └────────┬──────────────┬────┘
         OK│              │TABLE MISSING
          │              ▼
          │    ┌──────────────────────┐
          │    │ 503 Schema Error     │
          │    │ Table Not Found      │
          │    │ [Log Error]          │
          │    └──────────────────────┘
          │
          ▼
    ┌────────────────────────┐
    │ Business Logic         │
    │ (findUnique, etc)      │
    └────────┬───────────┬───┘
         OK│             │ERROR
          │              ▼
          │    ┌──────────────────────────┐
          │    │ Catch Block              │
          │    │ handleApiError()         │
          │    └──────┬───────────────────┘
          │           │
          │           ▼
          │    ┌──────────────────────────┐
          │    │ Detect Error Type        │
          │    │ - Database error?        │
          │    │ - Auth error?            │
          │    │ - Generic error?         │
          │    └──────┬───────────────────┘
          │           │
          │           ▼
          │    ┌──────────────────────────┐
          │    │ Determine Status Code    │
          │    │ - DB → 503               │
          │    │ - Auth → 401             │
          │    │ - Generic → 500          │
          │    └──────┬───────────────────┘
          │           │
          │           ▼
          │    ┌──────────────────────────┐
          │    │ Sanitize Error Message   │
          │    │ - Remove emails          │
          │    │ - Remove tokens          │
          │    │ - Remove passwords       │
          │    └──────┬───────────────────┘
          │           │
          │           ▼
          │    ┌──────────────────────────┐
          │    │ Log Error Securely       │
          │    │ [console.error]          │
          │    └──────┬───────────────────┘
          │           │
          │           ▼
          │    ┌──────────────────────────┐
          │    │ Generate User Message    │
          │    │ - No technical details   │
          │    │ - Production safe        │
          │    └──────┬───────────────────┘
          │           │
          └───────┬───┘
                  │
                  ▼
        ┌─────────────────────────┐
        │ Return JSON Response    │
        │ {                       │
        │   error: "message",     │
        │   details: "..." (dev)  │
        │ }                       │
        │ Status: [determined]    │
        └─────────────────────────┘
```

## Health Check Flow

```
┌──────────────────────────────────────┐
│ GET /api/health-detailed             │
└────────────┬───────────────────────┬─┘
             │                       │
             ▼                       ▼
    ┌──────────────────┐   ┌──────────────────┐
    │ Check DB         │   │ Initialize       │
    │ Connectivity     │   │ Results Object   │
    │ (SELECT 1)       │   └──────────────────┘
    └─────┬────────┬───┘
      OK│          │FAIL
        │          ▼
        │   ┌─────────────────┐
        │   │ database: false │
        │   │ Add Error Msg   │
        │   └────────┬────────┘
        │            │
        ▼            │
    ┌──────────────┐ │
    │ Check admin_ ├─┘
    │ users table  │
    └─────┬────┬───┘
      OK│    │FAIL
        │    ▼
        │ ┌─────────────────────┐
        │ │ adminUsersTable:F   │
        │ │ Add Error Msg       │
        │ └────────┬────────────┘
        │          │
        ▼          │
    ┌────────────┐ │
    │ Check      ├─┘
    │ exchange_  │
    │ rates tbl  │
    └─────┬────┬───┘
      OK│    │FAIL
        │    ▼
        │ ┌─────────────────────┐
        │ │ exchangeRateTable:F │
        │ │ Add Error Msg       │
        │ └────────┬────────────┘
        │          │
        └────┬─────┘
             │
             ▼
    ┌─────────────────────┐
    │ All checks OK?      │
    └────┬──────────┬─────┘
     YES│           │NO
        │           ▼
        │ ┌──────────────────┐
        │ │ 503 Unhealthy    │
        │ │ Return errors[]  │
        │ └──────────────────┘
        │
        ▼
    ┌──────────────────┐
    │ 200 Healthy      │
    │ Return all true  │
    └──────────────────┘
```

## Error Detection Logic

```
┌─────────────────────────────────────────────────────┐
│ Error Type Detection (detectError.ts)               │
└──────────────┬──────────────────────────────────────┘
               │
        ┌──────▼──────┐
        │ Get error   │
        │ message     │
        │ text        │
        └──────┬──────┘
               │
               ▼
        ┌─────────────────┐
        │ Check for       │
        │ database terms  │
        │ (connection,    │
        │  timeout,       │
        │  prisma, etc)   │
        └─────┬──────┬────┘
          YES│      │NO
             │      ▼
             │  ┌───────────────┐
             │  │ Check for     │
             │  │ auth terms    │
             │  │ (auth,        │
             │  │  permission,  │
             │  │  session)     │
             │  └─┬──────────┬──┘
             │   YES│       │NO
             │    │        ▼
             │    │    ┌────────────┐
             │    │    │ Generic    │
             │    │    │ Error      │
             │    │    │ (500)      │
             │    │    └────────────┘
             │    │
             │    ▼
             │  ┌────────────┐
             │  │ Auth Error │
             │  │ (401/403)  │
             │  └────────────┘
             │
             ▼
         ┌─────────────────┐
         │ Database Error  │
         │ (503)           │
         └─────────────────┘
```

## Error Redaction Process

```
┌──────────────────────────────────────┐
│ Original Error Message               │
│ "User test@example.com not found"    │
└────────────┬───────────────────────┬─┘
             │                       │
    ┌────────▼───────┐   ┌──────────▼──────┐
    │ Remove Emails  │   │ Remove Tokens   │
    │                │   │                  │
    │ test@example   │   │ Bearer ABC123    │
    │ → [email]      │   │ → [bearer-token]│
    └────────┬───────┘   └──────────┬──────┘
             │                      │
             └──────┬───────────────┘
                    │
                    ▼
         ┌──────────────────┐
         │ Remove IDs       │
         │                  │
         │ UUID/CUID        │
         │ → [uuid]/[cuid]  │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Remove Passwords │
         │                  │
         │ password: sec123 │
         │ → password:      │
         │   [redacted]     │
         └────────┬─────────┘
                  │
                  ▼
      ┌───────────────────────┐
      │ Final Safe Message:   │
      │ "User [email] not     │
      │  found"               │
      └───────────────────────┘
```

## HTTP Status Code Decision Tree

```
                    ┌──────────────────┐
                    │ Error Occurred   │
                    └────────┬─────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
     ┌────────────┐   ┌────────────┐   ┌────────────┐
     │ Request    │   │ Auth       │   │ Database   │
     │ Invalid?   │   │ Issue?     │   │ Issue?     │
     └─┬──────┬───┘   └─┬──────┬───┘   └─┬──────┬───┘
     YES│    │NO      YES│    │NO     YES│    │NO
        │    │          │    │         │    │
        ▼    │          ▼    │         ▼    │
      400    │        401    │        503    │
             │        or 403 │               │
             │               │               │
             └───────┬───────┴────────┬──────┘
                     │                │
                     ▼                ▼
              ┌────────────┐       500
              │ Generic    │
              │ Error      │
              └────────────┘
```

## Request Path Examples

### Example 1: Valid Admin Login Request

```
REQUEST: POST /api/admin/login
BODY: {"email": "admin@example.com", "password": "correct"}

1. Parse JSON                      ✓ Valid
2. Validate fields                 ✓ email & password present
3. Check DB connectivity           ✓ Connected
4. Check admin_users table         ✓ Exists
5. Find admin user                 ✓ Found
6. Verify active status            ✓ Active
7. Verify password hash            ✓ Correct

RESPONSE: 200 OK
{
  "success": true,
  "message": "Přihlášení bylo úspěšné",
  "admin": {"name": "...", "email": "...", "role": "..."}
}
With admin-session cookie
```

### Example 2: Database Down Scenario

```
REQUEST: POST /api/admin/login
BODY: {"email": "admin@example.com", "password": "test"}

1. Parse JSON                      ✓ Valid
2. Validate fields                 ✓ email & password present
3. Check DB connectivity           ✗ TIMEOUT (Database down)

ERROR HANDLING:
- logError() called
- Error logged: "Database connectivity failed"
- No sensitive data in logs

RESPONSE: 503 Service Unavailable
{
  "error": "Database service temporarily unavailable. Please try again in a moment."
}
```

### Example 3: Missing Table Scenario

```
REQUEST: GET /api/exchange-rate

1. Parse (no body)                 ✓ N/A
2. Validate (no validation)        ✓ N/A
3. Check DB connectivity           ✓ Connected
4. Check exchange_rates table      ✗ NOT FOUND

ERROR HANDLING:
- logError() called
- Error logged: "exchange_rates table check failed"
- No sensitive data in logs

RESPONSE: 503 Service Unavailable
{
  "error": "Database schema error. Contact system administrator."
}
```

### Example 4: Missing Required Field

```
REQUEST: POST /api/admin/login
BODY: {"email": "admin@example.com"}

1. Parse JSON                      ✓ Valid
2. Validate fields                 ✗ password missing

VALIDATION RESULT:
{
  "valid": false,
  "missingFields": ["password"]
}

RESPONSE: 400 Bad Request
{
  "error": "Missing required fields",
  "details": "Required fields missing: password"
}
```

### Example 5: Invalid Credentials

```
REQUEST: POST /api/admin/login
BODY: {"email": "admin@example.com", "password": "wrong"}

1. Parse JSON                      ✓ Valid
2. Validate fields                 ✓ email & password present
3. Check DB connectivity           ✓ Connected
4. Check admin_users table         ✓ Exists
5. Find admin user                 ✓ Found
6. Verify password hash            ✗ Wrong password

RESPONSE: 401 Unauthorized
{
  "error": "Nesprávný email nebo heslo"
}
```

## Monitoring Integration Points

```
┌─────────────────────────────────────────────────────┐
│ /api/health-detailed                                │
│ Poll every 30-60 seconds from monitoring system     │
│                                                     │
│ ├─ Database connectivity status                    │
│ ├─ admin_users table status                        │
│ ├─ exchange_rates table status                     │
│ └─ Error list (if unhealthy)                       │
└───────────────┬───────────────────────────────────┘
                │
                ▼
        ┌──────────────┐
        │ Grafana      │
        │ Dashboard    │
        └──────┬───────┘
               │
        ┌──────▼────────┐
        │ Alert Rules   │
        │               │
        │ IF status ==  │
        │ "unhealthy"   │
        │ FOR 5 min     │
        │               │
        │ THEN          │
        │ Send Slack    │
        │ notification  │
        └───────────────┘
```

This visual representation helps understand how errors flow through the system
and where they are caught, logged, and reported back to clients.
