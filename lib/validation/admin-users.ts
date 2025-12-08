import { z } from 'zod';

/**
 * Validation schemas for admin user management endpoints
 */

// Admin role enum
export const AdminRoleSchema = z.enum(['admin', 'manager', 'editor']);

// Admin status enum
export const AdminStatusSchema = z.enum(['active', 'inactive']);

// Create admin user schema
export const CreateAdminUserSchema = z.object({
  name: z.string().min(2, 'Jméno musí mít alespoň 2 znaky').max(100, 'Jméno je příliš dlouhé'),
  email: z.string().email('Neplatný email'),
  password: z.string().min(8, 'Heslo musí mít alespoň 8 znaků'),
  role: AdminRoleSchema,
});

// Update admin user schema
export const UpdateAdminUserSchema = z.object({
  name: z.string().min(2, 'Jméno musí mít alespoň 2 znaky').max(100, 'Jméno je příliš dlouhé').optional(),
  email: z.string().email('Neplatný email').optional(),
  password: z.string().min(8, 'Heslo musí mít alespoň 8 znaků').optional(),
  role: AdminRoleSchema.optional(),
  status: AdminStatusSchema.optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  'Alespoň jedno pole musí být poskytnuto'
);
