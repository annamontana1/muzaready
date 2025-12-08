/**
 * Structured error logging for production troubleshooting
 * Does NOT expose sensitive information (emails, passwords, etc.)
 */

export interface ErrorContext {
  endpoint: string;
  method: string;
  timestamp: Date;
  operation?: string;
  userId?: string;
}

export interface LogEntry {
  level: 'error' | 'warn' | 'info';
  timestamp: Date;
  endpoint: string;
  method: string;
  message: string;
  operation?: string;
  errorType?: string;
  isSensitiveError?: boolean;
  context?: Record<string, unknown>;
}

/**
 * Check if an error appears to be database-related
 */
export function isDatabaseError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  const dbErrorPatterns = [
    'connection',
    'timeout',
    'query',
    'database',
    'prisma',
    'econnrefused',
    'enotfound',
    'column',
    'relation',
    'unique constraint',
    'foreign key',
  ];

  return dbErrorPatterns.some((pattern) => message.includes(pattern));
}

/**
 * Check if an error is authentication-related
 */
export function isAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;

  const message = error.message.toLowerCase();
  return ['auth', 'permission', 'forbidden', 'unauthorized', 'session'].some((pattern) =>
    message.includes(pattern)
  );
}

/**
 * Sanitize error message to remove sensitive data
 * Removes emails, IDs, tokens, passwords, etc.
 */
export function sanitizeErrorMessage(message: string): string {
  let sanitized = message;

  // Remove email addresses
  sanitized = sanitized.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[email]');

  // Remove common ID patterns (UUID, CUID)
  sanitized = sanitized.replace(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/gi, '[uuid]');
  sanitized = sanitized.replace(/c[a-z0-9]{24}/gi, '[cuid]');

  // Remove token patterns
  sanitized = sanitized.replace(/token[:\s]*[a-zA-Z0-9._-]+/gi, '[token]');
  sanitized = sanitized.replace(/bearer\s+[a-zA-Z0-9._-]+/gi, '[bearer-token]');

  // Remove common sensitive strings
  sanitized = sanitized.replace(/password[:\s]*[^\s,}]+/gi, 'password: [redacted]');
  sanitized = sanitized.replace(/api[_-]?key[:\s]*[^\s,}]+/gi, 'api_key: [redacted]');
  sanitized = sanitized.replace(/secret[:\s]*[^\s,}]+/gi, 'secret: [redacted]');

  return sanitized;
}

/**
 * Log an error with context for production debugging
 * Safely logs errors without exposing sensitive information
 */
export function logError(context: ErrorContext, error: unknown, operation?: string): void {
  const timestamp = new Date().toISOString();
  const isDatabaseErr = isDatabaseError(error);
  const isAuthErr = isAuthError(error);

  let errorType = 'Unknown';
  let errorMessage = 'An error occurred';
  let sanitizedMessage = errorMessage;

  if (error instanceof Error) {
    errorType = error.constructor.name;
    errorMessage = error.message;
    sanitizedMessage = sanitizeErrorMessage(errorMessage);
  } else if (typeof error === 'object' && error !== null) {
    errorMessage = JSON.stringify(error);
    sanitizedMessage = sanitizeErrorMessage(errorMessage);
  }

  // Build structured log entry
  const logEntry: LogEntry = {
    level: 'error',
    timestamp: new Date(),
    endpoint: context.endpoint,
    method: context.method,
    message: sanitizedMessage,
    operation: operation || context.operation,
    errorType,
    isSensitiveError: isDatabaseErr || isAuthErr,
  };

  // Add context hints based on error type
  if (isDatabaseErr) {
    logEntry.context = {
      hint: 'Database connectivity or schema issue - check connection and migrations',
      isCritical: true,
    };
  } else if (isAuthErr) {
    logEntry.context = {
      hint: 'Authentication/authorization issue - check session and permissions',
      isCritical: false,
    };
  }

  // Log to console with structured format
  console.error(`[${timestamp}] ${context.method} ${context.endpoint}`, {
    operation: logEntry.operation,
    error: logEntry.errorType,
    message: sanitizedMessage,
    ...logEntry.context,
  });
}

/**
 * Create a user-friendly error message based on error type
 * Never exposes technical details in production
 */
export function getUserFriendlyMessage(error: unknown, endpoint: string): string {
  if (isDatabaseError(error)) {
    return 'We are experiencing a temporary database issue. Please try again in a few moments.';
  }

  if (isAuthError(error)) {
    if (endpoint.includes('/admin/')) {
      return 'Your session is invalid or has expired. Please log in again.';
    }
    return 'Authentication failed. Please check your credentials and try again.';
  }

  // Generic fallback
  return 'An unexpected error occurred. Please try again later.';
}

/**
 * Get appropriate HTTP status code based on error type
 */
export function getStatusCodeForError(error: unknown, defaultStatus: number = 500): number {
  if (isDatabaseError(error)) {
    return 503; // Service Unavailable
  }

  if (isAuthError(error)) {
    return 401; // Unauthorized
  }

  return defaultStatus;
}
