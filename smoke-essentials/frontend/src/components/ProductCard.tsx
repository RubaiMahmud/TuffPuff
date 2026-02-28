'use client';

import Link from 'next/link';
import { ShoppingCart, Plus } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    brand: string;
    price: number;
    image: string;
    packSize: string;
    stock: number;
    category: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const outOfStock = product.stock <= 0;

  return (
    <div className="group bg-zinc-900 border border-zinc-700 shadow-[0_5px_15px_rgba(0,0,0,0.5)] rounded-2xl overflow-hidden hover:border-lime-400/60 hover:shadow-[0_0_25px_rgba(163,230,53,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative z-10">
      {/* Image */}
      <Link href={`/products/${product.id}`} className="block relative h-48 bg-black/60 flex items-center justify-center overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent opacity-80 z-0"></div>
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-10" />
        ) : (
          <div className="text-6xl transform group-hover:scale-110 transition-transform duration-300 relative z-10">
            {product.category === 'CIGARETTES' ? '🚬' :
              product.category === 'LIGHTERS' ? '🔥' :
                product.category === 'ROLLING_PAPERS' ? '📜' :
                  product.category === 'BEVERAGES' ? '🥤' :
                    product.category === 'SNACKS' ? '🍿' : '📦'}
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="text-red-500 font-black text-sm uppercase tracking-widest bg-zinc-950 px-3 py-1 rounded-full shadow-md border border-red-900/50">Out of Stock</span>
          </div>
        )}

      </Link>

      {/* Info */}
      <div className="p-5 flex flex-col flex-grow bg-zinc-900">
        <Link href={`/products/${product.id}`}>
          <h3 className="text-white font-bold text-sm group-hover:text-lime-400 transition-colors line-clamp-2 min-h-[40px] tracking-wide">
            {product.name}
          </h3>
        </Link>
        <p className="text-zinc-400 text-xs mt-1 font-semibold">{product.packSize}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-zinc-800 mt-4">
          <span className="text-xl font-black text-lime-400 tracking-tight">৳{product.price.toFixed(2)}</span>
          <button
            onClick={() => !outOfStock && addItem(product)}
            disabled={outOfStock}
            className="flex items-center gap-1 px-4 py-2 bg-lime-500/10 hover:bg-lime-500/20 text-lime-400 hover:text-lime-300 rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:bg-zinc-950 disabled:text-zinc-600 disabled:cursor-not-allowed border border-lime-400/40 hover:border-lime-400 hover:shadow-[0_0_10px_rgba(163,230,53,0.2)]"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
}
