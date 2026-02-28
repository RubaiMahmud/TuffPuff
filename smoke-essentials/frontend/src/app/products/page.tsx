'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import MainLayout from '@/components/MainLayout';
import ProductCard from '@/components/ProductCard';
import api from '@/lib/api';

const categories = [
  { key: '', label: 'All' },
  { key: 'CIGARETTES', label: 'Cigarettes' },
  { key: 'LIGHTERS', label: 'Lighters' },
  { key: 'ROLLING_PAPERS', label: 'Rolling Papers' },
  { key: 'CONDOMS', label: 'Condoms' },
  { key: 'BEVERAGES', label: 'Beverages' },
  { key: 'SNACKS', label: 'Snacks' },
  { key: 'ESSENTIALS', label: 'Essentials' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  const rawUrlCategory = searchParams.get('category');

  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(rawUrlCategory || '');
  const [lastUrlCategory, setLastUrlCategory] = useState(rawUrlCategory);
  const [brands, setBrands] = useState<string[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [meta, setMeta] = useState<any>({});
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  // Sync category state with URL changes
  // When URL param changes (e.g. navigating from navbar or home page category links),
  // update the internal category state to match
  if (rawUrlCategory !== lastUrlCategory) {
    setCategory(rawUrlCategory || '');
    setSelectedBrand('');
    setLastUrlCategory(rawUrlCategory);
    setPage(1);
  }

  useEffect(() => {
    api.get('/products/brands').then((res) => setBrands(res.data.data || [])).catch(() => { });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { page: String(page), limit: '100', sortBy, sortOrder };
    if (category) params.category = category;
    if (selectedBrand) params.brand = selectedBrand;
    if (search) params.search = search;

    api.get('/products', { params })
      .then((res) => {
        setProducts(res.data.data || []);
        setMeta(res.data.meta || {});
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [category, selectedBrand, search, sortBy, sortOrder, page]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black min-h-screen">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Products</h1>
            <p className="text-zinc-400 font-medium text-sm mt-1">{meta.total || 0} products available</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="input-field pl-10 py-2.5 text-sm font-medium shadow-[0_0_10px_rgba(163,230,53,0.05)] border-zinc-800"
              />
            </div>

            <button onClick={() => setShowFilters(!showFilters)} className="md:hidden p-2.5 bg-zinc-900 border border-zinc-800 shadow-sm rounded-xl text-zinc-400 hover:text-lime-400 hover:border-lime-400/50 transition-colors">
              <SlidersHorizontal size={18} />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`${showFilters ? 'block' : 'hidden'} md:block md:w-56 shrink-0 space-y-8 bg-zinc-950 md:bg-transparent p-4 md:p-0 rounded-2xl md:rounded-none border md:border-none border-zinc-800 shadow-xl md:shadow-none`}>
            {/* Category */}
            <div>
              <h3 className="text-white font-black text-sm mb-3 uppercase tracking-wider">Category</h3>
              <div className="space-y-1">
                {categories.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => {
                      setCategory(cat.key);
                      if (!cat.key) setSelectedBrand('');
                      setPage(1);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${category === cat.key ? 'bg-lime-500/10 text-lime-400 font-bold border border-lime-400/30 shadow-[0_0_10px_rgba(163,230,53,0.1)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Brand */}
            {brands.length > 0 && (
              <div>
                <h3 className="text-white font-black text-sm mb-3 uppercase tracking-wider">Brand</h3>
                <div className="space-y-1">
                  <button
                    onClick={() => { setSelectedBrand(''); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!selectedBrand ? 'bg-lime-500/10 text-lime-400 font-bold border border-lime-400/30 shadow-[0_0_10px_rgba(163,230,53,0.1)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                      }`}
                  >
                    All Brands
                  </button>
                  {brands.map((b) => (
                    <button
                      key={b}
                      onClick={() => { setSelectedBrand(b); setPage(1); }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedBrand === b ? 'bg-lime-500/10 text-lime-400 font-bold border border-lime-400/30 shadow-[0_0_10px_rgba(163,230,53,0.1)]' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                        }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sort */}
            <div>
              <h3 className="text-white font-black text-sm mb-3 uppercase tracking-wider">Sort By</h3>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [sb, so] = e.target.value.split('-');
                  setSortBy(sb);
                  setSortOrder(so);
                  setPage(1);
                }}
                className="w-full bg-zinc-900 border border-zinc-800 shadow-sm rounded-lg px-3 py-2 text-sm text-white font-medium focus:ring-2 focus:ring-lime-400 focus:border-lime-400 outline-none transition-all hover:bg-zinc-800"
              >
                <option value="createdAt-desc">Newest First</option>
                <option value="createdAt-asc">Oldest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A-Z</option>
                <option value="name-desc">Name: Z-A</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-zinc-950 border border-zinc-800 rounded-2xl shadow-[0_0_30px_rgba(163,230,53,0.05)]">
                <p className="text-white font-black text-lg">No products found</p>
                <p className="text-zinc-400 font-medium text-sm mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {products.map((product: any) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {meta.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-3 mt-10">
                    <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                      className="px-4 py-2 bg-zinc-900 border border-zinc-800 shadow-sm rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:border-lime-400 hover:shadow-[0_0_10px_rgba(163,230,53,0.2)] disabled:opacity-50 disabled:hover:border-zinc-800 disabled:hover:shadow-none transition-all">
                      Previous
                    </button>
                    <span className="text-white font-bold text-sm bg-zinc-900 px-4 py-2 rounded-xl border border-zinc-800 shadow-[0_0_10px_rgba(163,230,53,0.1)]">
                      Page {meta.page} of {meta.totalPages}
                    </span>
                    <button onClick={() => setPage(Math.min(meta.totalPages, page + 1))} disabled={page >= meta.totalPages}
                      className="px-4 py-2 bg-zinc-900 border border-zinc-800 shadow-sm rounded-xl text-sm font-bold text-zinc-400 hover:text-white hover:border-lime-400 hover:shadow-[0_0_10px_rgba(163,230,53,0.2)] disabled:opacity-50 disabled:hover:border-zinc-800 disabled:hover:shadow-none transition-all">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh] bg-black">
          <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
        </div>
      </MainLayout>
    }>
      <ProductsContent />
    </Suspense>
  );
}

