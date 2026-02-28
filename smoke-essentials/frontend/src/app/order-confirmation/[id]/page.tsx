'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, MapPin, Package } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    api.get(`/orders/${id}`).then((res) => setOrder(res.data.data)).catch(() => { }).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <ProtectedRoute><MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] bg-black">
          <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout></ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute><MainLayout>
        <div className="max-w-lg mx-auto px-4 py-20 text-center bg-black min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_15px_rgba(163,230,53,0.1)]">
            <Package className="text-zinc-500" size={32} />
          </div>
          <p className="text-white font-bold text-xl mb-2">Order not found</p>
          <p className="text-zinc-400 font-medium text-sm">We couldn't locate this order in our system.</p>
        </div>
      </MainLayout></ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-black min-h-screen">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-lime-500/10 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="text-center mb-10 relative z-10">
              <div className="w-24 h-24 bg-lime-500/10 border border-lime-400/30 rounded-full flex items-center justify-center mx-auto mb-6 relative shadow-[0_0_30px_rgba(163,230,53,0.1)]">
                <div className="absolute inset-0 rounded-full animate-ping bg-lime-400 opacity-20"></div>
                <CheckCircle className="text-lime-400 relative z-10" size={48} />
              </div>
              <h1 className="text-3xl font-black text-white mb-3 tracking-tight">Order Confirmed!</h1>
              <p className="text-zinc-400 font-medium tracking-wide">Thank you for your order. It&apos;s being prepared right now.</p>
            </div>

            <div className="glass-card mb-8 border-zinc-800 bg-zinc-950 overflow-hidden shadow-[0_0_40px_rgba(163,230,53,0.05)] relative z-10">
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-zinc-800/50">
                  <div>
                    <p className="text-zinc-500 font-bold text-xs tracking-widest uppercase mb-1">Order ID</p>
                    <p className="text-white font-black font-mono text-base tracking-widest">{order.id.slice(0, 8).toUpperCase()}</p>
                  </div>
                  <div className="px-4 py-1.5 bg-lime-500/10 border border-lime-400/30 text-lime-400 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_10px_rgba(163,230,53,0.1)]">
                    {order.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-start gap-4 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-lime-400/30 transition-colors group">
                    <div className="w-10 h-10 bg-black shadow-inner border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 group-hover:border-lime-400/50 transition-colors">
                      <Clock size={18} className="text-lime-400" />
                    </div>
                    <div>
                      <p className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-0.5">Estimated Delivery</p>
                      <p className="text-white font-bold">{order.estimatedDelivery || '30-45 minutes'}</p>
                    </div>
                  </div>

                  {order.address && (
                    <div className="flex items-start gap-4 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 hover:border-lime-400/30 transition-colors group">
                      <div className="w-10 h-10 bg-black shadow-inner border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 group-hover:border-lime-400/50 transition-colors">
                        <MapPin size={18} className="text-lime-400" />
                      </div>
                      <div>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-wider mb-0.5">Delivery To: {order.address.label}</p>
                        <p className="text-white font-bold text-sm leading-snug">{order.address.fullAddress}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-8">
                  <h3 className="text-white font-black text-lg mb-4">Items Overview</h3>
                  <div className="space-y-4">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <span className="bg-black border border-zinc-800 text-zinc-400 font-bold text-xs px-2.5 py-1 rounded-md">{item.quantity}x</span>
                          <span className="text-white font-bold text-sm tracking-wide">{item.product?.name || 'Product placeholder'}</span>
                        </div>
                        <span className="text-lime-400 font-black text-sm">৳{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between font-medium text-zinc-400">
                      <span>Subtotal</span><span className="text-white font-bold">৳{order.totalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                    <div className="flex justify-between font-medium text-zinc-400">
                      <span>Delivery fee</span>
                      <span className={order.deliveryFee === 0 ? 'text-lime-400 font-bold bg-lime-500/10 px-2 py-0.5 rounded text-xs border border-lime-400/20' : 'text-white font-bold'}>
                        {order.deliveryFee === 0 ? 'FREE' : `৳${order.deliveryFee?.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-black text-white text-xl pt-5 mt-5 border-t border-zinc-800">
                      <span className="">Total</span><span className="text-lime-400">৳{order.finalAmount?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 relative z-10">
              <Link href="/orders" className="btn-primary flex-1 text-center justify-center py-4 font-bold shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_25px_rgba(163,230,53,0.5)]">View My Orders</Link>
              <Link href="/products" className="bg-black border-2 border-zinc-800 hover:border-lime-400/50 text-white hover:text-lime-400 font-bold rounded-xl flex-1 text-center py-4 transition-colors hover:shadow-[0_0_15px_rgba(163,230,53,0.1)]">Continue Shopping</Link>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
