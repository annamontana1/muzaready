import { NextResponse } from 'next/server';
import { logError, getUserFriendlyMessage, getStatusCodeForError } from './error-logger';

export interface ApiErrorResponse {
  error: string;
  details?: string;
  requestId?: string;
}

export interface HealthCheckResponse {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  checks: Record<string, boolean>;
}

/**
 * Safe wrapper to handle API errors with proper logging and response formatting
 */
export function handleApiError(
  endpoint: string,
  method: string,
  error: unknown,
  operation?: string,
  defaultStatusCode: number = 500
): NextResponse<ApiErrorResponse> {
  // Log the error securely
  logError(
    {
      endpoint,
      method,
      timestamp: new Date(),
    },
    error,
    operation
  );

  // Determine appropriate status code
  const statusCode = getStatusCodeForError(error, defaultStatusCode);

  // Get user-friendly message
  const userMessage = getUserFriendlyMessage(error, endpoint);

  // Create response
  const response: ApiErrorResponse = {
    error: userMessage,
  };

  // In development, include more details
  if (process.env.NODE_ENV === 'development' && error instanceof Error) {
    response.details = error.message;
  }

  return NextResponse.json(response, { status: statusCode });
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields(
  data: Record<string, unknown>,
  requiredFields: string[]
): { valid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter((field) => !data[field]);

  return {
    valid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Create a validation error response
 */
export function validationError(missingFields: string[]): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      error: 'Missing required fields',
      details: `Required fields missing: ${missingFields.join(', ')}`,
    },
    { status: 400 }
  );
}
