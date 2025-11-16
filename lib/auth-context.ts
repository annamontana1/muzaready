'use client';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  wholesaleRequested: boolean;
  isWholesale: boolean;
  wholesaleRequestedAt?: string;
  wholesaleApprovedAt?: string;
  companyName?: string;
  businessType?: string;
  website?: string;
  instagram?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  streetAddress?: string;
  taxId?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface WholesaleRegisterData extends RegisterData {
  companyName: string;
  businessType: string;
  website?: string;
  instagram?: string;
  country?: string;
  city?: string;
  zipCode?: string;
  streetAddress?: string;
  taxId?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  registerWholesale: (data: WholesaleRegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}
