'use client';

import { useEffect, useState } from 'react';

interface AdminInfo {
  id: string;
  email: string;
  name: string;
  role: string;
}

let cachedAdmin: AdminInfo | null = null;

export function useAdminRole() {
  const [admin, setAdmin] = useState<AdminInfo | null>(cachedAdmin);
  const [loading, setLoading] = useState(!cachedAdmin);

  useEffect(() => {
    if (cachedAdmin) return;
    fetch('/api/admin/me')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.role) {
          cachedAdmin = data;
          setAdmin(data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return {
    admin,
    loading,
    isOwner: admin?.role === 'owner',
    role: admin?.role ?? null,
  };
}
