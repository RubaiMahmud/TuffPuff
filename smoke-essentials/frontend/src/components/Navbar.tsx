'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { ShoppingCart, Menu, X, User, LogOut, Package, Shield, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import TuffPuffLogo from '@/components/TuffPuffLogo';

export default function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();
  const itemCount = useCartStore((s) => s.getItemCount());
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'ADMIN';

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-zinc-800 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 relative group">
            <div className="absolute -inset-2 bg-lime-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            <TuffPuffLogo size={32} className="text-lime-400 relative z-10" />
            <span className="text-lg font-bold text-white tracking-wide relative z-10 transition-colors group-hover:text-lime-300">
              TuffPuff
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors ${pathname === '/' ? 'text-lime-400' : 'text-zinc-400 hover:text-white'}`}
            >
              Home
            </Link>

            {/* Category Dropdown */}
            <div className="relative group">
              <button className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center gap-1 py-4">
                Categories <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
              </button>

              <div className="absolute top-full left-0 mt-[-8px] pt-4 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 overflow-hidden pointer-events-auto origin-top transform scale-95 group-hover:scale-100 transition-transform">
                  <Link href="/products?category=CIGARETTES" className="block px-4 py-3 text-sm font-medium text-zinc-400 hover:text-lime-400 hover:bg-zinc-900 transition-colors">🚬 Cigarettes</Link>
                  <Link href="/products?category=LIGHTERS" className="block px-4 py-3 text-sm font-medium text-zinc-400 hover:text-lime-400 hover:bg-zinc-900 transition-colors">🔥 Lighters</Link>
                  <Link href="/products?category=ROLLING_PAPERS" className="block px-4 py-3 text-sm font-medium text-zinc-400 hover:text-lime-400 hover:bg-zinc-900 transition-colors">📜 Rolling Papers</Link>
                  <Link href="/products?category=CONDOMS" className="block px-4 py-3 text-sm font-medium text-zinc-400 hover:text-lime-400 hover:bg-zinc-900 transition-colors">🛡️ Condoms</Link>
                  <Link href="/products?category=SNACKS" className="block px-4 py-3 text-sm font-medium text-zinc-400 hover:text-lime-400 hover:bg-zinc-900 transition-colors">🍿 Snacks</Link>
                </div>
              </div>
            </div>

            <Link
              href="/products"
              className={`text-sm font-medium transition-colors ${pathname === '/products' ? 'text-lime-400' : 'text-zinc-400 hover:text-white'}`}
            >
              All Products
            </Link>


            {isAdmin && (
              <Link href="/admin" className="text-sm font-medium text-zinc-400 hover:text-lime-400 flex items-center gap-1 transition-colors">
                <Shield size={14} /> Admin
              </Link>
            )}

            <Link href="/cart" className="relative text-zinc-400 hover:text-lime-400 transition-colors group ml-2">
              <ShoppingCart size={20} />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-lime-500 text-black shadow-[0_0_10px_rgba(163,230,53,0.5)] text-xs font-black rounded-full w-5 h-5 flex items-center justify-center scale-100 group-hover:scale-110 transition-transform">
                  {itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-4 ml-2 pl-4 border-l border-zinc-800">
                <div className="relative group">
                  <button className="text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors flex items-center gap-2 py-4">
                    <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 group-hover:border-lime-400/50 group-hover:shadow-[0_0_10px_rgba(163,230,53,0.3)] transition-all">
                      <User size={16} />
                    </div>
                    <span className="max-w-[100px] truncate">{user?.name || 'Profile'}</span>
                    <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  <div className="absolute top-full right-0 mt-[-8px] pt-4 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                    <div className="bg-zinc-950 border border-zinc-800 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-2 overflow-hidden pointer-events-auto origin-top-right transform scale-95 group-hover:scale-100 transition-transform">
                      <div className="px-4 py-3 border-b border-zinc-800/50 mb-1 bg-zinc-900/40">
                        <p className="text-sm text-lime-400 font-bold truncate">{user?.name}</p>
                        <p className="text-xs text-zinc-500 truncate">{user?.email}</p>
                      </div>
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-lime-400 hover:bg-zinc-900 transition-colors">
                        <User size={14} /> Profile
                      </Link>
                      <Link href="/orders" className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-lime-400 hover:bg-zinc-900 transition-colors">
                        <Package size={14} /> Orders
                      </Link>
                      <button
                        onClick={() => logout()}
                        className="w-full text-left flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-zinc-400 hover:text-red-500 hover:bg-zinc-900 transition-colors mt-1 border-t border-zinc-800/50 pt-3"
                      >
                        <LogOut size={14} /> Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-zinc-800">
                <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-lime-400 flex items-center gap-1 transition-colors">
                  <User size={14} /> Login
                </Link>
                <Link href="/signup" className="text-sm px-4 py-2 bg-black border-2 border-zinc-800 text-white font-bold rounded-lg hover:border-lime-400 hover:text-lime-400 hover:shadow-[0_0_15px_rgba(163,230,53,0.2)] transition-all">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-zinc-400 hover:text-lime-400 transition-colors">
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-zinc-950 border-t border-zinc-800 px-4 pb-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-y-auto max-h-[80vh]">
          <Link href="/" onClick={() => setMobileOpen(false)}
            className={`block py-3 font-medium border-b border-zinc-900 transition-colors ${pathname === '/' ? 'text-lime-400' : 'text-zinc-400 hover:text-white'}`}>
            Home
          </Link>

          <div className="py-2 border-b border-zinc-900">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2 mt-2">Categories</p>
            <div className="pl-4 space-y-1">
              <Link href="/products?category=CIGARETTES" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors">🚬 Cigarettes</Link>
              <Link href="/products?category=LIGHTERS" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors">🔥 Lighters</Link>
              <Link href="/products?category=ROLLING_PAPERS" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors">📜 Rolling Papers</Link>
              <Link href="/products?category=CONDOMS" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors">🛡️ Condoms</Link>
              <Link href="/products?category=SNACKS" onClick={() => setMobileOpen(false)} className="block py-2 text-sm font-medium text-zinc-400 hover:text-lime-400 transition-colors">🍿 Snacks</Link>
            </div>
          </div>

          <Link href="/products" onClick={() => setMobileOpen(false)}
            className={`block py-3 font-medium border-b border-zinc-900 transition-colors ${pathname === '/products' ? 'text-lime-400' : 'text-zinc-400 hover:text-white'}`}>
            All Products
          </Link>

          <Link href="/cart" onClick={() => setMobileOpen(false)} className={`block py-3 font-medium border-b border-zinc-900 transition-colors ${pathname === '/cart' ? 'text-lime-400' : 'text-zinc-400 hover:text-white'}`}>
            Cart ({itemCount})
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/profile" onClick={() => setMobileOpen(false)} className={`block py-3 font-medium border-b border-zinc-900 transition-colors ${pathname === '/profile' ? 'text-lime-400' : 'text-zinc-400 hover:text-white'}`}>
                My Profile
              </Link>
              <Link href="/orders" onClick={() => setMobileOpen(false)} className={`block py-3 font-medium border-b border-zinc-900 transition-colors ${pathname === '/orders' ? 'text-lime-400' : 'text-zinc-400 hover:text-white'}`}>
                My Orders
              </Link>
              {isAdmin && (
                <Link href="/admin" onClick={() => setMobileOpen(false)} className="block py-3 font-medium text-lime-400 hover:text-lime-300 border-b border-zinc-900 transition-colors">
                  Admin Panel
                </Link>
              )}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block py-3 w-full text-left font-medium text-red-500 hover:text-red-400 transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block py-3 text-zinc-400 font-medium hover:text-white border-b border-zinc-900 transition-colors">
                Login
              </Link>
              <Link href="/signup" onClick={() => setMobileOpen(false)} className="block py-3 font-medium text-lime-400 hover:text-lime-300 transition-colors">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
