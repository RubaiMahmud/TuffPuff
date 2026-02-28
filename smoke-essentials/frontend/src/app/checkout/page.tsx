'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Notebook, Loader2, Plus } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import MapPicker from '@/components/MapPicker';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getSubtotal, getTotal, deliveryFee, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: 'Home', fullAddress: '', lat: 0, lng: 0 });
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = getSubtotal();
  const total = getTotal();
  const freeDelivery = subtotal >= 50;

  useEffect(() => {
    api.get('/addresses').then((res) => {
      const addrs = res.data.data || [];
      setAddresses(addrs);
      const defaultAddr = addrs.find((a: any) => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else if (addrs.length > 0) setSelectedAddressId(addrs[0].id);
    }).catch(() => { });
  }, []);

  const handleLocationSelect = (loc: { lat: number; lng: number; address: string }) => {
    setNewAddress({ ...newAddress, fullAddress: loc.address, lat: loc.lat, lng: loc.lng });
  };

  const handleSaveNewAddress = async () => {
    if (!newAddress.fullAddress) return;
    try {
      const res = await api.post('/addresses', { ...newAddress, isDefault: addresses.length === 0 });
      const saved = res.data.data;
      setAddresses([...addresses, saved]);
      setSelectedAddressId(saved.id);
      setShowNewAddress(false);
    } catch {
      setError('Failed to save address');
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) { setError('Please select a delivery address'); return; }
    if (items.length === 0) { setError('Your cart is empty'); return; }

    setError('');
    setLoading(true);
    try {
      const orderData = {
        addressId: selectedAddressId,
        deliveryNotes: deliveryNotes || undefined,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      };
      const res = await api.post('/orders', orderData);
      clearCart();
      router.push(`/order-confirmation/${res.data.data.id}`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <ProtectedRoute>
      <MainLayout>
        <div className="bg-black min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-black text-white mb-8 tracking-tight">Checkout</h1>

            {error && (
              <div className="mb-6 p-4 bg-zinc-900 border border-red-900/50 rounded-xl text-red-500 text-sm font-bold shadow-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {/* Delivery Address */}
                <div className="glass-card p-6 border-zinc-800 bg-zinc-950 shadow-[0_0_30px_rgba(163,230,53,0.05)]">
                  <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <MapPin size={22} className="text-lime-400" /> Delivery Address
                  </h2>

                  {addresses.length > 0 && (
                    <div className="space-y-3 mb-6">
                      {addresses.map((addr) => (
                        <label key={addr.id} className={`flex items-start gap-4 p-4 border rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id ? 'border-lime-400 bg-lime-500/10 shadow-[0_0_10px_rgba(163,230,53,0.1)]' : 'border-zinc-800 bg-zinc-900 hover:border-zinc-700'
                          }`}>
                          <input type="radio" name="address" value={addr.id} checked={selectedAddressId === addr.id}
                            onChange={(e) => setSelectedAddressId(e.target.value)} className="mt-1 w-4 h-4 text-lime-400 border-zinc-700 focus:ring-lime-400 bg-black" />
                          <div>
                            <p className="text-white text-sm font-bold tracking-wide">{addr.label}</p>
                            <p className="text-zinc-500 text-sm mt-0.5 font-medium">{addr.fullAddress}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}

                  <button onClick={() => setShowNewAddress(!showNewAddress)}
                    className="text-lime-400 text-sm font-bold flex items-center gap-1.5 hover:text-lime-300 transition-colors">
                    <Plus size={16} /> Add new address
                  </button>

                  {showNewAddress && (
                    <div className="mt-6 space-y-4 p-4 bg-zinc-900 border border-zinc-800 rounded-xl relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-lime-500/5 via-transparent to-transparent pointer-events-none"></div>
                      <input type="text" placeholder="Address label (Home, Work...)" value={newAddress.label}
                        onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                        className="input-field shadow-sm bg-black border-zinc-800 relative z-10" />
                      <div className="relative z-10"><MapPicker onLocationSelect={handleLocationSelect} /></div>
                      <button onClick={handleSaveNewAddress} className="btn-primary text-sm px-6 py-2.5 shadow-[0_0_10px_rgba(163,230,53,0.2)] relative z-10">
                        Save Address
                      </button>
                    </div>
                  )}
                </div>

                {/* Delivery Notes */}
                <div className="glass-card p-6 border-zinc-800 bg-zinc-950 shadow-[0_0_30px_rgba(163,230,53,0.05)]">
                  <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                    <Notebook size={22} className="text-lime-400" /> Delivery Notes
                  </h2>
                  <textarea
                    placeholder="Any special instructions for the driver? (optional)"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    rows={3}
                    className="input-field resize-none shadow-[0_0_5px_rgba(0,0,0,0.5)] bg-black border-zinc-800 focus:bg-zinc-950 transition-colors"
                  />
                </div>

                {/* Items */}
                <div className="glass-card p-6 border-zinc-800 bg-zinc-950 shadow-[0_0_30px_rgba(163,230,53,0.05)]">
                  <h2 className="text-xl font-black text-white mb-6">Order Items</h2>
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div key={item.productId} className="flex items-center justify-between py-3 border-b border-zinc-800/50 last:border-0 last:pb-0">
                        <div className="flex items-center gap-4">
                          <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 font-bold text-xs px-2.5 py-1 rounded-md">{item.quantity}x</span>
                          <span className="text-white font-bold text-sm tracking-wide">{item.product.name}</span>
                        </div>
                        <span className="text-lime-400 font-black text-sm">৳{(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="lg:col-span-1">
                <div className="glass-card sticky top-24 border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-[0_0_30px_rgba(163,230,53,0.05)]">
                  <h2 className="text-xl font-black text-white mb-6 tracking-wide">Price Breakdown</h2>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between font-medium text-zinc-400">
                      <span>Product total</span>
                      <span className="text-white font-bold">৳{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-zinc-400">
                      <span>Delivery fee</span>
                      <span className={freeDelivery ? 'text-lime-400 font-bold bg-lime-500/10 px-2 py-0.5 rounded text-sm border border-lime-400/20' : 'text-white font-bold'}>
                        {freeDelivery ? 'FREE' : `৳${deliveryFee.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-medium text-zinc-400">
                      <span>Discount</span>
                      <span className="text-zinc-600 font-bold">৳0.00</span>
                    </div>
                    <div className="border-t border-zinc-800 pt-5 mt-5 flex justify-between font-black text-xl">
                      <span className="text-white">Total</span>
                      <span className="text-lime-400">৳{total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button onClick={handlePlaceOrder} disabled={loading || !selectedAddressId}
                    className="btn-primary w-full flex items-center justify-center gap-2 mt-8 py-4 text-base font-bold shadow-[0_0_15px_rgba(163,230,53,0.3)] disabled:opacity-50 disabled:shadow-none">
                    {loading ? <Loader2 size={20} className="animate-spin" /> : null}
                    {loading ? 'Placing Order...' : 'Place Order'}
                  </button>

                  <div className="mt-6 p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-lime-400"></div>
                    <p className="text-zinc-400 font-bold text-xs">
                      💵 Payment is collected on delivery (Cash/Card)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </ProtectedRoute>
  );
}
