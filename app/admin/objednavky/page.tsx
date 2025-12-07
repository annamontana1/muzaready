import prisma from '@/lib/prisma';
import OrdersListClient from './components/OrdersListClient';

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  // Fetch orders from database
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate statistics
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const paidCount = orders.filter((o) => o.status === 'paid').length;
  const shippedCount = orders.filter((o) => o.status === 'shipped').length;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Správa Objednávek</h1>

      {/* Orders Table with Bulk Actions */}
      <OrdersListClient orders={orders} />

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Celkový příjem</p>
          <p className="text-2xl font-bold text-gray-900">
            {totalRevenue.toLocaleString('cs-CZ')} Kč
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Čekající objednávky</p>
          <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Zaplacené objednávky</p>
          <p className="text-2xl font-bold text-blue-600">{paidCount}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600 text-sm">Poslané objednávky</p>
          <p className="text-2xl font-bold text-purple-600">{shippedCount}</p>
        </div>
      </div>
    </div>
  );
}
