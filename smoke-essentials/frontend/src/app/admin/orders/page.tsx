'use client';

import { useEffect, useState } from 'react';
import { Clock, Truck, CheckCircle, XCircle, Package, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const statuses = ['', 'PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
const statusOptions = ['PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];

const statusIcon: Record<string, any> = {
  PENDING: Clock, CONFIRMED: Package, OUT_FOR_DELIVERY: Truck, DELIVERED: CheckCircle, CANCELLED: XCircle,
};
const statusColor: Record<string, string> = {
  PENDING: 'text-yellow-400', CONFIRMED: 'text-blue-400', OUT_FOR_DELIVERY: 'text-purple-400', DELIVERED: 'text-green-400', CANCELLED: 'text-red-400',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [updating, setUpdating] = useState('');

  const fetchOrders = () => {
    setLoading(true);
    const params: Record<string, string> = { limit: '50' };
    if (filter) params.status = filter;
    api.get('/admin/orders', { params }).then((res) => setOrders(res.data.data || [])).catch(() => { }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch { }
    setUpdating('');
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>

      {/* Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statuses.map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
              }`}>
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">No orders found</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const Icon = statusIcon[order.status] || Clock;
            return (
              <div key={order.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={statusColor[order.status]} />
                    <div>
                      <p className="text-white font-medium text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="text-zinc-500 text-xs">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-300"
                    >
                      {statusOptions.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
                    </select>
                    {updating === order.id && <Loader2 size={14} className="animate-spin text-amber-400" />}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Customer</p>
                    <p className="text-white">{order.user?.name}</p>
                    <p className="text-zinc-400 text-xs">{order.user?.email}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs mb-1">Items</p>
                    {order.items?.slice(0, 3).map((item: any) => (
                      <p key={item.id} className="text-zinc-300 text-xs">{item.quantity}x {item.product?.name}</p>
                    ))}
                    {order.items?.length > 3 && <p className="text-zinc-500 text-xs">+{order.items.length - 3} more</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-zinc-500 text-xs mb-1">Total</p>
                    <p className="text-amber-400 font-bold text-lg">৳{order.finalAmount?.toFixed(2)}</p>
                  </div>
                </div>

                {order.address && (
                  <div className="mt-3 pt-3 border-t border-zinc-800">
                    <p className="text-zinc-500 text-xs">📍 {order.address.fullAddress}</p>
                    {order.deliveryNotes && <p className="text-zinc-500 text-xs mt-1">📝 {order.deliveryNotes}</p>}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
