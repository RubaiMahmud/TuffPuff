'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Plus, Minus, Package } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProductCard from '@/components/ProductCard';
import { useCartStore } from '@/store/cartStore';
import api from '@/lib/api';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      api.get(`/products/${id}`),
      api.get(`/products/${id}/similar`),
    ]).then(([prodRes, simRes]) => {
      setProduct(prodRes.data.data);
      setSimilar(simRes.data.data || []);
    }).catch(() => { })
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] bg-black">
          <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-black border border-zinc-800 rounded-3xl mt-10 shadow-[0_0_30px_rgba(163,230,53,0.05)] min-h-[50vh]">
          <p className="text-white font-black text-xl">Product not found</p>
          <Link href="/products" className="text-lime-400 hover:text-lime-300 font-bold mt-4 inline-block transition-colors">← Back to products</Link>
        </div>
      </MainLayout>
    );
  }

  const categoryEmoji: Record<string, string> = {
    CIGARETTES: '🚬', LIGHTERS: '🔥', ROLLING_PAPERS: '📜',
    BEVERAGES: '🥤', SNACKS: '🍿', ESSENTIALS: '📦',
  };

  return (
    <MainLayout>
      <div className="bg-black min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/products" className="inline-flex items-center gap-1 text-zinc-400 hover:text-lime-400 font-bold text-sm mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to products
          </Link>

          <div className="bg-zinc-950 border border-zinc-800 shadow-[0_0_30px_rgba(163,230,53,0.05)] rounded-3xl grid grid-cols-1 md:grid-cols-2 gap-10 mb-16 p-6 md:p-10">
            {/* Image */}
            <div className="bg-black border border-zinc-800 shadow-inner rounded-3xl h-80 md:h-[450px] flex items-center justify-center overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
              ) : (
                <span className="text-[120px] md:text-[160px] transform hover:scale-110 transition-transform duration-500">{categoryEmoji[product.category] || '📦'}</span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 text-lime-400 bg-lime-500/10 border border-lime-400/20 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase mb-4 w-fit shadow-[0_0_10px_rgba(163,230,53,0.1)] hover:shadow-[0_0_15px_rgba(163,230,53,0.2)] transition-all cursor-default">
                <Package size={14} className="" /> {product.brand}
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">{product.name}</h1>

              <div className="flex items-center gap-3 mb-6">
                <span className="px-4 py-1.5 bg-zinc-900 border border-zinc-800 shadow-sm rounded-full text-white font-bold text-xs uppercase tracking-wider">
                  {product.category.replace('_', ' ')}
                </span>
                <span className="text-zinc-500 font-medium text-sm">{product.packSize}</span>
              </div>

              <p className="text-zinc-400 font-medium text-base md:text-lg leading-relaxed mb-8">{product.description}</p>

              <div className="text-4xl font-black text-lime-400 mb-8 border-b border-zinc-800 pb-8">৳{product.price.toFixed(2)}</div>

              {product.stock > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center bg-zinc-900 border border-zinc-800 shadow-sm rounded-xl overflow-hidden h-12">
                      <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 h-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors border-r border-zinc-800">
                        <Minus size={18} />
                      </button>
                      <span className="px-6 h-full flex items-center justify-center text-white font-bold text-lg min-w-[60px]">{quantity}</span>
                      <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="px-4 h-full text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors border-l border-zinc-800">
                        <Plus size={18} />
                      </button>
                    </div>
                    <span className="text-zinc-400 font-bold text-sm bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg shadow-sm">{product.stock} in stock</span>
                  </div>

                  <button onClick={handleAddToCart} className={`btn-primary w-full md:w-auto px-8 py-4 text-lg flex items-center justify-center gap-3 ${added ? 'from-green-500 to-green-600 shadow-green-500/30 border-green-600/50' : ''}`}>
                    <ShoppingCart size={22} className={added ? '' : ''} />
                    {added ? 'Added to Cart!' : 'Add to Cart'}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-zinc-900 border border-red-900/50 shadow-sm rounded-xl text-red-500 text-sm font-bold flex items-center justify-center">
                  Out of Stock
                </div>
              )}

              {/* Restricted Product Warning */}
              {product.category === 'CIGARETTES' && (
                <div className="mt-8 p-4 bg-zinc-900 border border-red-900/50 shadow-sm rounded-xl flex items-start gap-3 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
                  <span className="text-xl">⚠️</span>
                  <p className="text-red-400 text-xs font-bold leading-relaxed tracking-wide">WARNING: This product contains nicotine, which is a highly addictive substance. You must be 18 years or older to purchase.</p>
                </div>
              )}
            </div>
          </div>

          {/* Similar Products */}
          {similar.length > 0 && (
            <div className="mt-20 pt-10 border-t border-zinc-800">
              <h2 className="text-3xl font-black text-white mb-8 tracking-tight">Similar Products</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {similar.map((p: any) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
