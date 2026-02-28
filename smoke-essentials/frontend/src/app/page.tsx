'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Truck, Clock, ShieldCheck, Zap, ArrowRight, ChevronRight, Search, Menu } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProductCard from '@/components/ProductCard';
import GeometricBackground from '@/components/GeometricBackground';
import api from '@/lib/api';

const dropdownCategories = [
  { key: 'CIGARETTES', label: '🚬 Cigarettes' },
  { key: 'LIGHTERS', label: '🔥 Lighters' },
  { key: 'ROLLING_PAPERS', label: '📜 Rolling Papers' },
  { key: 'CONDOMS', label: '🛡️ Condoms' },
  { key: 'SNACKS', label: '🍿 Snacks' },
];

export default function HomePage() {
  const router = useRouter();
  const [featured, setFeatured] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    api.get('/products?limit=8').then((res) => setFeatured(res.data.data || [])).catch(() => { });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value) {
      router.push(`/products?category=${e.target.value}`);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black text-white">
        {/* Background Glows - Neon Theme */}
        <GeometricBackground />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-lime-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-lime-400/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-lime-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl border border-zinc-800/50 p-8 rounded-3xl bg-zinc-900/50 backdrop-blur-sm">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500/10 border border-lime-400/30 rounded-full text-lime-400 text-sm font-bold mb-6 shadow-[0_0_15px_rgba(163,230,53,0.2)]">
              <Zap size={14} className="text-lime-400" /> Fast Delivery • 30 min average
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 text-white tracking-tight">
              <span>Your</span>{' '}
              <span className="text-lime-400">Essentials,</span>
              <br />
              <span>Delivered</span>{' '}
              <span className="text-gradient">Fast.</span>
            </h1>

            <p className="text-zinc-400 text-lg md:text-xl max-w-xl mb-8 leading-relaxed font-medium">
              Cigarettes, snacks, drinks, and everyday essentials delivered to your
              doorstep in minutes. Simply browse, order, and relax.
            </p>

            {/* Search and Category Dropdown */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <form onSubmit={handleSearch} className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={20} />
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all shadow-inner"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-lime-500 text-black p-2 rounded-lg hover:bg-lime-400 transition-colors shadow-[0_0_10px_rgba(163,230,53,0.3)]">
                  <ArrowRight size={20} />
                </button>
              </form>
              <div className="relative min-w-[200px]">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Menu className="text-lime-400" size={20} />
                </div>
                <select
                  onChange={handleCategoryChange}
                  defaultValue=""
                  className="w-full pl-12 pr-10 py-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-lime-400 focus:border-transparent transition-all hover:bg-zinc-900"
                >
                  <option value="" disabled>Shop by Category</option>
                  {dropdownCategories.map(cat => (
                    <option key={cat.key} value={cat.key}>{cat.label}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ChevronRight className="text-zinc-500 rotate-90" size={16} />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/products" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
                Shop All <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Promise Banner */}
      <section className="relative z-10 border-y border-zinc-800 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, label: 'Free delivery', desc: 'Orders over ৳50' },
              { icon: Clock, label: '30 min delivery', desc: 'Average time' },
              { icon: ShieldCheck, label: 'Age verified', desc: '18+ only' },
              { icon: Zap, label: '7 days a week', desc: 'Always available' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(163,230,53,0.05)]">
                  <Icon size={20} className="text-lime-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-bold tracking-wide">{label}</p>
                  <p className="text-zinc-500 text-xs font-medium">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories (Grid beneath) */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-black">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Browse Categories</h2>
          <Link href="/products" className="text-lime-400 font-bold hover:text-lime-300 flex items-center gap-1 transition-colors">
            View all <ChevronRight size={18} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {dropdownCategories.map((cat) => (
            <Link
              key={cat.key}
              href={`/products?category=${cat.key}`}
              className="group bg-zinc-900 border border-zinc-800 rounded-2xl p-6 text-center hover:border-lime-400 hover:shadow-[0_0_15px_rgba(163,230,53,0.15)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform">{cat.label.split(' ')[0]}</div>
              <p className="text-zinc-300 text-sm font-bold group-hover:text-lime-400 transition-colors tracking-wide">{cat.label.split(' ').slice(1).join(' ')}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative z-10 bg-zinc-950 py-20 border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Featured Products</h2>
            <Link href="/products" className="text-lime-400 font-bold hover:text-lime-300 flex items-center gap-1 transition-colors">
              View all <ChevronRight size={18} />
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-sm">
              <p className="text-zinc-500 font-medium tracking-wide">Products will appear here once the backend is running.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 bg-black max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative bg-zinc-900 border border-lime-400/20 shadow-[0_0_30px_rgba(163,230,53,0.05)] rounded-3xl p-10 md:p-16 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-lime-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-48 h-48 bg-lime-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to Order?</h2>
            <p className="text-zinc-400 text-lg md:text-xl font-medium mb-10">
              Sign up now and get your first delivery in under 30 minutes. Let us handle the run.
            </p>
            <Link href="/signup" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4">
              Get Started <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
