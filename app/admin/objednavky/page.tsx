import prisma from '@/lib/prisma';
import Link from 'next/link';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Čeká na platbu';
      case 'paid':
        return 'Zaplaceno';
      case 'shipped':
        return 'Odesláno';
      case 'delivered':
        return 'Doručeno';
      default:
        return status;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Správa Objednávek</h1>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto mb-8">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Položky
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Cena
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Datum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                Akce
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-4 text-center text-gray-600">
                  Zatím nejsou žádné objednávky
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900 font-mono font-medium">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items.length}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {order.total.toLocaleString('cs-CZ')} Kč
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(order.createdAt).toLocaleDateString('cs-CZ')}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <Link
                      href={`/admin/objednavky/${order.id}`}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Detaily
                    </Link>
                    <Link
                      href={`/admin/objednavky/${order.id}/edit`}
                      className="text-green-600 hover:text-green-800 font-medium"
                    >
                      Upravit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
