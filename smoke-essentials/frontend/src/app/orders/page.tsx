'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  PENDING: { icon: Clock, color: 'text-lime-400', bg: 'bg-lime-500/20' },
  CONFIRMED: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  OUT_FOR_DELIVERY: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  DELIVERED: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
  CANCELLED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const params: Record<string, string> = {};
    if (filter) params.status = filter;
    api.get('/orders', { params }).then((res) => setOrders(res.data.data || [])).catch(() => { }).finally(() => setLoading(false));
  }, [filter]);

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-black min-h-screen">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-black text-white mb-8 tracking-tight">My Orders</h1>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-3 mb-10 bg-zinc-950 p-2 rounded-2xl border border-zinc-800 shadow-[0_0_15px_rgba(163,230,53,0.05)] inline-flex">
              {['', 'PENDING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'].map((s) => (
                <button key={s} onClick={() => setFilter(s)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm ${filter === s ? 'bg-lime-500/20 text-lime-400 border border-lime-400/50 shadow-[0_0_15px_rgba(163,230,53,0.2)]' : 'bg-black text-zinc-400 border border-zinc-900 hover:text-white hover:bg-zinc-800 hover:border-zinc-700'
                    }`}>
                  {s.replace(/_/g, ' ') || 'All Orders'}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20 bg-zinc-950 border border-zinc-800 shadow-[0_0_30px_rgba(163,230,53,0.05)] rounded-3xl">
                <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-zinc-950 border border-zinc-800 shadow-[0_0_30px_rgba(163,230,53,0.05)] rounded-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-lime-500/5 via-transparent to-transparent"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 bg-black border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(163,230,53,0.1)]">
                    <Package className="text-zinc-500" size={32} />
                  </div>
                  <p className="text-white font-bold text-xl mb-2">No orders yet</p>
                  <p className="text-zinc-400 font-medium text-sm mb-6">When you place an order, it will appear here.</p>
                  <Link href="/products" className="btn-primary text-sm px-8 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_20px_rgba(163,230,53,0.5)]">Start shopping <span className="ml-1">→</span></Link>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const sc = statusConfig[order.status] || statusConfig.PENDING;
                  const Icon = sc.icon;
                  return (
                    <Link key={order.id} href={`/order-confirmation/${order.id}`}
                      className="glass-card block bg-zinc-950 border-zinc-800 hover:border-lime-400/50 transition-all hover:shadow-[0_0_20px_rgba(163,230,53,0.1)] duration-300">
                      <div className="p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800/50">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 ${sc.bg} rounded-xl flex items-center justify-center border border-zinc-800 shadow-[0_0_10px_rgba(163,230,53,0.1)]`}>
                              <Icon size={20} className={`${sc.color}`} />
                            </div>
                            <div>
                              <p className="text-white font-black text-lg tracking-wide">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                              <p className="text-zinc-500 font-medium text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                            </div>
                          </div>
                          <div className={`px-4 py-1.5 ${sc.bg} ${sc.color} rounded-full text-xs font-black uppercase tracking-wider border border-${sc.color}/30 shadow-[0_0_5px_currentColor] self-start sm:self-auto`}>
                            {order.status.replace(/_/g, ' ')}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-base px-2">
                          <span className="text-zinc-400 font-bold">
                            📦 <span className="ml-1 text-white">{order.items?.length || 0} items</span>
                          </span>
                          <span className="text-lime-400 font-black text-xl">৳{order.finalAmount?.toFixed(2)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
