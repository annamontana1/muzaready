'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Redirect: /admin/konfigurator-sku -> /admin/sklad/novy
 *
 * The old configurator URL now redirects to the unified wizard.
 */
export default function ConfiguratorSKURedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/sklad/novy');
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto p-8 text-center">
      <p className="text-gray-500">Presmerovani na novy konfigurator...</p>
    </div>
  );
}
