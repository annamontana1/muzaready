'use client';

import { useState } from 'react';
import { useAdminRole } from '@/lib/hooks/useAdminRole';
import { useToast } from '@/components/ui/ToastProvider';

interface OrderItem {
  id: string;
  orderId: string;
  grams: number;
  lineTotal: number;
  pricePerGram: number;
  nameSnapshot: string | null;
  saleMode: string;
  ending: string;
  skuId: string;
  sku?: {
    id: string;
    sku: string;
    name: string | null;
    shadeName: string | null;
    lengthCm: number | null;
  };
}

interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
}

interface ItemsSectionProps {
  order: Order;
  onRefresh?: () => void;
}

// ── Editable row ──────────────────────────────────────────────────────────────

interface EditState {
  nameSnapshot: string;
  grams: string;
  pricePerGram: string;
}

interface EditableRowProps {
  item: OrderItem;
  orderId: string;
  onSaved: (newTotal: number) => void;
  onDeleted: (newTotal: number) => void;
}

function EditableRow({ item, orderId, onSaved, onDeleted }: EditableRowProps) {
  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const productName = item.nameSnapshot || item.sku?.name || 'Neznámý produkt';
  const skuLabel = item.sku ? `${item.sku.sku}` : '';

  const [edit, setEdit] = useState<EditState>({
    nameSnapshot: productName,
    grams: String(item.grams),
    pricePerGram: String(item.pricePerGram),
  });

  const previewTotal = Math.round(parseFloat(edit.grams || '0') * parseFloat(edit.pricePerGram || '0'));

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nameSnapshot: edit.nameSnapshot,
          grams: parseFloat(edit.grams),
          pricePerGram: parseFloat(edit.pricePerGram),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chyba');
      showToast('Položka uložena ✓', 'success');
      setEditing(false);
      onSaved(data.newOrderTotal);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/items/${item.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Chyba');
      showToast('Položka odstraněna', 'success');
      onDeleted(data.newOrderTotal);
    } catch (e: any) {
      showToast(e.message, 'error');
    } finally {
      setSaving(false);
      setConfirmDelete(false);
    }
  }

  if (!editing) {
    return (
      <tr className="border-b border-gray-100 hover:bg-gray-50 group">
        <td className="px-4 py-3 text-sm text-gray-900">
          <div>{productName}</div>
          {skuLabel && <div className="text-xs text-stone-400">{skuLabel}</div>}
          {item.ending && item.ending !== 'NONE' && (
            <div className="text-xs text-stone-500">Zakončení: {item.ending}</div>
          )}
        </td>
        <td className="px-4 py-3 text-sm text-gray-600">{item.grams} g</td>
        <td className="px-4 py-3 text-sm text-gray-900">{item.pricePerGram.toLocaleString('cs-CZ')} Kč/g</td>
        <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">
          {item.lineTotal.toLocaleString('cs-CZ')} Kč
        </td>
        <td className="px-4 py-2 text-right">
          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              className="px-2 py-1 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded text-xs font-medium transition"
              title="Upravit položku"
            >
              ✏️ Upravit
            </button>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded text-xs font-medium transition"
                title="Smazat položku"
              >
                🗑
              </button>
            ) : (
              <>
                <button
                  onClick={handleDelete}
                  disabled={saving}
                  className="px-2 py-1 bg-red-600 text-white rounded text-xs font-medium transition disabled:opacity-50"
                >
                  {saving ? '⏳' : 'Ano, smazat'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-xs font-medium transition"
                >
                  Zrušit
                </button>
              </>
            )}
          </div>
        </td>
      </tr>
    );
  }

  // Edit mode
  return (
    <tr className="border-b border-blue-200 bg-blue-50">
      <td className="px-3 py-2" colSpan={5}>
        <div className="space-y-2">
          {/* Product name */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-500 w-24 shrink-0">Název</label>
            <input
              type="text"
              value={edit.nameSnapshot}
              onChange={e => setEdit(v => ({ ...v, nameSnapshot: e.target.value }))}
              className="flex-1 px-2 py-1 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
              disabled={saving}
            />
          </div>

          {/* Grams + price per gram */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-stone-500 w-24 shrink-0">Gramáž (g)</label>
              <input
                type="number"
                value={edit.grams}
                min="1"
                step="1"
                onChange={e => setEdit(v => ({ ...v, grams: e.target.value }))}
                className="w-24 px-2 py-1 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-right"
                disabled={saving}
              />
              <span className="text-xs text-stone-500">g</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-stone-500 w-24 shrink-0">Cena / gram</label>
              <input
                type="number"
                value={edit.pricePerGram}
                min="0"
                step="1"
                onChange={e => setEdit(v => ({ ...v, pricePerGram: e.target.value }))}
                className="w-24 px-2 py-1 border border-stone-300 rounded text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white text-right"
                disabled={saving}
              />
              <span className="text-xs text-stone-500">Kč/g</span>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs text-stone-500">Celkem za položku:</span>
              <span className={`text-sm font-bold ${previewTotal !== item.lineTotal ? 'text-blue-700' : 'text-stone-700'}`}>
                {previewTotal.toLocaleString('cs-CZ')} Kč
              </span>
              {previewTotal !== item.lineTotal && (
                <span className="text-xs text-stone-400 line-through">{item.lineTotal.toLocaleString('cs-CZ')} Kč</span>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1.5 bg-[#722F37] text-white rounded text-sm font-medium hover:bg-[#5a252c] transition disabled:opacity-50"
            >
              {saving ? '⏳ Ukládám...' : '✅ Uložit změny'}
            </button>
            <button
              onClick={() => { setEditing(false); setEdit({ nameSnapshot: productName, grams: String(item.grams), pricePerGram: String(item.pricePerGram) }); }}
              disabled={saving}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded text-sm font-medium hover:bg-gray-300 transition"
            >
              Zrušit
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ItemsSection({ order, onRefresh }: ItemsSectionProps) {
  const { isOwner, loading: roleLoading } = useAdminRole();
  const [localTotal, setLocalTotal] = useState<number | null>(null);
  const [localItems, setLocalItems] = useState<OrderItem[]>(order.items);

  const effectiveTotal = localTotal ?? order.total;

  function handleSaved(newTotal: number) {
    setLocalTotal(newTotal);
    onRefresh?.();
  }

  function handleDeleted(itemId: string, newTotal: number) {
    setLocalItems(prev => prev.filter(i => i.id !== itemId));
    setLocalTotal(newTotal);
    onRefresh?.();
  }

  const itemsTotal = localItems.reduce((s, i) => s + i.lineTotal, 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">Položky v objednávce</h2>
        {isOwner && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
            🔑 Editace povolena (majitel)
          </span>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Produkt</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Gramáž</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Cena/g</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Celkem</th>
              {isOwner && <th className="px-4 py-3 w-28" />}
            </tr>
          </thead>
          <tbody>
            {localItems.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-stone-400 italic text-sm">
                  Žádné položky
                </td>
              </tr>
            )}
            {localItems.map(item =>
              isOwner ? (
                <EditableRow
                  key={item.id}
                  item={item}
                  orderId={order.id}
                  onSaved={(newTotal) => handleSaved(newTotal)}
                  onDeleted={(newTotal) => handleDeleted(item.id, newTotal)}
                />
              ) : (
                <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    <div>{item.nameSnapshot || item.sku?.name || 'Neznámý produkt'}</div>
                    {item.sku && <div className="text-xs text-stone-400">{item.sku.sku}</div>}
                    {item.ending && item.ending !== 'NONE' && (
                      <div className="text-xs text-stone-500">Zakončení: {item.ending}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.grams} g</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{item.pricePerGram.toLocaleString('cs-CZ')} Kč/g</td>
                  <td className="px-4 py-3 text-sm text-gray-900 font-medium text-right">
                    {item.lineTotal.toLocaleString('cs-CZ')} Kč
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mt-4 pt-4 border-t border-stone-200 space-y-1 max-w-xs ml-auto text-sm">
        <div className="flex justify-between text-stone-600">
          <span>Položky</span>
          <span>{itemsTotal.toLocaleString('cs-CZ')} Kč</span>
        </div>
        {order.shippingCost > 0 && (
          <div className="flex justify-between text-stone-600">
            <span>Doprava</span>
            <span>{order.shippingCost.toLocaleString('cs-CZ')} Kč</span>
          </div>
        )}
        {order.discountAmount > 0 && (
          <div className="flex justify-between text-green-700">
            <span>Sleva</span>
            <span>−{order.discountAmount.toLocaleString('cs-CZ')} Kč</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-base pt-1 border-t border-stone-200 text-stone-900">
          <span>Celkem</span>
          <span className={localTotal !== null ? 'text-blue-700' : ''}>{effectiveTotal.toLocaleString('cs-CZ')} Kč</span>
        </div>
        {localTotal !== null && localTotal !== order.total && (
          <p className="text-xs text-blue-600 text-right">↑ Aktualizováno (uloženo)</p>
        )}
      </div>
    </div>
  );
}
