'use client';

import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import { useCartStore } from '@/store/cartStore';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, getTotal, deliveryFee } = useCartStore();
  const subtotal = getSubtotal();
  const total = getTotal();
  const freeDelivery = subtotal >= 50;

  if (items.length === 0) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-black min-h-[60vh] flex flex-col items-center justify-center">
          <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(163,230,53,0.1)] border border-zinc-800 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-lime-500/5 rounded-full blur-xl pointer-events-none"></div>
            <ShoppingBag className="text-zinc-500 relative z-10" size={40} />
          </div>
          <h1 className="text-2xl font-black text-white mb-2">Your cart is empty</h1>
          <p className="text-zinc-500 font-medium mb-8">Looks like you haven't added any products yet.</p>
          <Link href="/products" className="btn-primary inline-flex items-center gap-2 px-8 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(163,230,53,0.3)] hover:shadow-[0_0_20px_rgba(163,230,53,0.5)]">
            Browse Products <ArrowRight size={18} />
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight">Shopping Cart</h1>
            <button onClick={clearCart} className="text-zinc-400 hover:text-red-500 hover:border-red-500 font-bold text-sm transition-colors px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl shadow-sm">
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="glass-card flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 md:p-6 border-zinc-800 bg-zinc-950 hover:border-lime-400/30 hover:shadow-[0_0_20px_rgba(163,230,53,0.1)] transition-all">
                  <div className="flex w-full sm:w-auto items-center gap-4 flex-1">
                    <div className="w-20 h-20 bg-black border border-zinc-800 rounded-2xl flex items-center justify-center shrink-0 text-3xl shadow-inner overflow-hidden">
                      {item.product.image ? (
                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      ) : (
                        item.product.category === 'CIGARETTES' ? '🚬' :
                          item.product.category === 'LIGHTERS' ? '🔥' :
                            item.product.category === 'ROLLING_PAPERS' ? '📜' :
                              item.product.category === 'BEVERAGES' ? '🥤' :
                                item.product.category === 'SNACKS' ? '🍿' : '📦'
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.productId}`} className="text-white font-bold text-base hover:text-lime-400 line-clamp-2 transition-colors tracking-wide">
                        {item.product.name}
                      </Link>
                      <p className="text-zinc-500 font-medium text-xs mt-1">{item.product.packSize}</p>
                      <p className="text-lime-400 font-black mt-2">৳{item.product.price.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t border-zinc-800/50 sm:border-0 gap-6">
                    <div className="flex items-center bg-zinc-900 border border-zinc-800 shadow-sm rounded-xl overflow-hidden h-10">
                      <button onClick={() => updateQuantity(item.productId, item.quantity - 1)} className="px-3 h-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors border-r border-zinc-800">
                        <Minus size={14} />
                      </button>
                      <span className="px-4 h-full flex items-center justify-center text-white font-bold text-sm min-w-[40px]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.productId, item.quantity + 1)} className="px-3 h-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors border-l border-zinc-800">
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <p className="text-white font-black text-lg">৳{(item.product.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeItem(item.productId)} className="text-zinc-500 hover:text-white hover:bg-red-900/50 mt-2 p-1.5 bg-zinc-900 rounded-lg transition-colors border border-zinc-800 hover:border-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass-card sticky top-24 border-zinc-800 bg-zinc-950 p-6 md:p-8 shadow-[0_0_30px_rgba(163,230,53,0.05)]">
                <h2 className="text-xl font-black text-white mb-6 tracking-wide">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between font-medium text-zinc-400">
                    <span>Subtotal ({items.length} items)</span>
                    <span className="text-white font-bold">৳{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-zinc-400">
                    <span>Delivery fee</span>
                    <span className={freeDelivery ? 'text-lime-400 font-bold bg-lime-500/10 px-2 py-0.5 rounded text-sm border border-lime-400/20' : 'text-white font-bold'}>
                      {freeDelivery ? 'FREE' : `৳${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  {!freeDelivery && (
                    <div className="bg-lime-500/5 border border-lime-400/20 p-3 rounded-xl mt-2 relative overflow-hidden">
                      <div className="absolute inset-0 bg-lime-500/5 blur-xl pointer-events-none"></div>
                      <p className="text-lime-400 font-bold text-xs flex items-center gap-1.5 relative z-10">
                        <span>🚀</span> Add ৳{(50 - subtotal).toFixed(2)} more for free delivery!
                      </p>
                    </div>
                  )}

                  <div className="border-t border-zinc-800 pt-5 mt-5 flex justify-between font-black text-xl">
                    <span className="text-white">Total</span>
                    <span className="text-lime-400">৳{total.toFixed(2)}</span>
                  </div>
                </div>

                <Link href="/checkout" className="btn-primary w-full flex items-center justify-center gap-2 mt-8 py-4 text-base font-bold shadow-[0_0_15px_rgba(163,230,53,0.3)]">
                  Proceed to Checkout <ArrowRight size={20} />
                </Link>

                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-zinc-600 uppercase tracking-widest">
                  <span className="w-4 h-px bg-zinc-800"></span>
                  Secure Checkout
                  <span className="w-4 h-px bg-zinc-800"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
