import { PrismaClient } from '@prisma/client';
import prisma from './prisma';

/**
 * Health check utilities for database connectivity and table existence
 */

export interface HealthCheckResult {
  healthy: boolean;
  timestamp: Date;
  database: boolean;
  adminUsersTable: boolean;
  exchangeRateTable: boolean;
  errors: string[];
}

/**
 * Perform a basic database connectivity check
 * This executes a simple raw SQL query without exposing sensitive information
 */
export async function checkDatabaseConnectivity(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('[Database Health] Connectivity check failed:', {
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Check if admin_users table exists by attempting to count records
 */
export async function checkAdminUsersTable(): Promise<boolean> {
  try {
    // This will fail if the table doesn't exist
    await prisma.$queryRaw`SELECT 1 FROM "admin_users" LIMIT 1`;
    return true;
  } catch (error) {
    console.error('[Database Health] admin_users table check failed:', {
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Check if exchange_rates table exists by attempting to count records
 */
export async function checkExchangeRateTable(): Promise<boolean> {
  try {
    // This will fail if the table doesn't exist
    await prisma.$queryRaw`SELECT 1 FROM "exchange_rates" LIMIT 1`;
    return true;
  } catch (error) {
    console.error('[Database Health] exchange_rates table check failed:', {
      errorType: error instanceof Error ? error.constructor.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
    });
    return false;
  }
}

/**
 * Comprehensive health check for critical endpoints
 */
export async function performHealthCheck(): Promise<HealthCheckResult> {
  const errors: string[] = [];
  const timestamp = new Date();

  // Check database connectivity
  const database = await checkDatabaseConnectivity();
  if (!database) {
    errors.push('Database connectivity failed');
  }

  // Check admin_users table only if database is connected
  let adminUsersTable = false;
  if (database) {
    adminUsersTable = await checkAdminUsersTable();
    if (!adminUsersTable) {
      errors.push('admin_users table unavailable');
    }
  }

  // Check exchange_rates table only if database is connected
  let exchangeRateTable = false;
  if (database) {
    exchangeRateTable = await checkExchangeRateTable();
    if (!exchangeRateTable) {
      errors.push('exchange_rates table unavailable');
    }
  }

  return {
    healthy: database && adminUsersTable && exchangeRateTable,
    timestamp,
    database,
    adminUsersTable,
    exchangeRateTable,
    errors,
  };
}

/**
 * Safe wrapper for database queries with error context
 * Helps identify whether issues are database connectivity vs application logic
 */
export class DatabaseError extends Error {
  constructor(
    public readonly operation: string,
    public readonly originalError: unknown,
    message: string
  ) {
    super(message);
    this.name = 'DatabaseError';
  }

  toJSON() {
    return {
      type: this.name,
      operation: this.operation,
      message: this.message,
      errorType: this.originalError instanceof Error ? this.originalError.constructor.name : 'Unknown',
    };
  }
}
