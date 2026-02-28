'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Package, Clock, Truck, CheckCircle, XCircle, RotateCcw, Loader2 } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';

const statusConfig: Record<string, { icon: any; color: string; bg: string }> = {
  PENDING: { icon: Clock, color: 'text-lime-400', bg: 'bg-lime-500/20' },
  CONFIRMED: { icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  OUT_FOR_DELIVERY: { icon: Truck, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  DELIVERED: { icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500/20' },
  CANCELLED: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/20' },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { addItem, clearCart } = useCartStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/orders')
      .then((res) => setOrders(res.data.data || []))
      .catch((err) => console.error('Failed to load orders', err))
      .finally(() => setLoading(false));
  }, []);

  const handleReorder = async (orderItems: any[]) => {
    try {
      clearCart();

      // Need to fetch full product details to add them to cart correctly
      // The order items from /orders might only have basic info.
      // Let's assume order.items has product object inside it based on how the backend returns it.
      for (const item of orderItems) {
        if (item.product) {
          // Add the item `item.quantity` times to the cart
          for (let i = 0; i < item.quantity; i++) {
            addItem(item.product);
          }
        }
      }

      router.push('/checkout');
    } catch (err) {
      console.error('Failed to reorder', err);
    }
  };

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-black min-h-screen pb-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

            {/* Header */}
            <h1 className="text-3xl font-black text-white mb-8 tracking-tight">My Profile</h1>

            {/* User Info Card */}
            <div className="glass-card bg-zinc-950 border-zinc-800 shadow-[0_0_30px_rgba(163,230,53,0.05)] p-6 md:p-8 mb-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-lime-500/5 rounded-full blur-3xl rounded-none pointer-events-none -translate-y-1/2 translate-x-1/2"></div>

              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
                <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-lime-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(163,230,53,0.2)]">
                  <User size={40} className="text-zinc-500" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{user?.name}</h2>
                  <p className="text-zinc-400 font-medium mt-1 mb-2">{user?.email}</p>
                  <p className="inline-flex items-center px-3 py-1 bg-lime-500/10 text-lime-400 text-xs font-bold rounded-full border border-lime-400/20 shadow-[0_0_5px_rgba(163,230,53,0.1)]">
                    {user?.role === 'ADMIN' ? 'Admin User' : 'Standard User'}
                  </p>
                </div>
              </div>
            </div>

            {/* Order History */}
            <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
              <Package size={20} className="text-lime-400" /> Recent Orders
            </h2>

            {loading ? (
              <div className="flex justify-center py-20 bg-zinc-950 border border-zinc-800 shadow-[0_0_30px_rgba(163,230,53,0.05)] rounded-2xl">
                <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-zinc-950 border border-zinc-800 shadow-[0_0_30px_rgba(163,230,53,0.05)] rounded-2xl">
                <Package className="text-zinc-600 mx-auto mb-4" size={40} />
                <p className="text-white font-bold text-lg">No orders yet</p>
                <p className="text-zinc-500 text-sm mt-1 mb-6">Your order history will appear here once you make a purchase.</p>
                <Link href="/products" className="btn-primary text-sm px-8 py-2.5 shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map((order) => {
                  const sc = statusConfig[order.status] || statusConfig.PENDING;
                  const Icon = sc.icon;
                  return (
                    <div key={order.id} className="glass-card bg-zinc-950 border-zinc-800 p-6 md:p-8 hover:border-lime-400/30 transition-all duration-300">

                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-zinc-800/50">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 ${sc.bg} rounded-xl flex items-center justify-center border border-zinc-800 shadow-[0_0_10px_rgba(163,230,53,0.1)]`}>
                            <Icon size={20} className={`${sc.color}`} />
                          </div>
                          <div>
                            <Link href={`/order-confirmation/${order.id}`} className="hover:text-lime-400 transition-colors">
                              <p className="text-white font-black text-lg tracking-wide">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                            </Link>
                            <p className="text-zinc-500 font-medium text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-start md:self-auto">
                          <div className={`px-4 py-1.5 ${sc.bg} ${sc.color} rounded-full text-xs font-black uppercase tracking-wider border border-${sc.color}/30 shadow-[0_0_5px_currentColor]`}>
                            {order.status.replace(/_/g, ' ')}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-zinc-400 font-bold text-sm bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg">
                            {order.items?.length || 0} items
                          </span>
                          <span className="text-lime-400 font-black text-lg bg-lime-500/10 px-3 py-1.5 rounded-lg border border-lime-400/20">
                            ৳{order.finalAmount?.toFixed(2)}
                          </span>
                        </div>

                        <button
                          onClick={() => handleReorder(order.items || [])}
                          className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 hover:bg-lime-500/20 text-white hover:text-lime-400 border border-zinc-700 hover:border-lime-400 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow-[0_0_15px_rgba(163,230,53,0.2)] ml-auto"
                        >
                          <RotateCcw size={16} /> Reorder
                        </button>
                      </div>

                    </div>
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
