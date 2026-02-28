'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingCart, Users, ArrowLeft } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import TuffPuffLogo from '@/components/TuffPuffLogo';

const sidebarLinks = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/users', label: 'Users', icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen bg-zinc-950">
        {/* Sidebar */}
        <aside className="w-64 bg-zinc-900/50 border-r border-zinc-800 p-6 hidden md:flex flex-col">
          <div className="flex items-center gap-2 mb-8">
            <TuffPuffLogo size={32} className="text-lime-400" />
            <div>
              <p className="text-white font-bold text-sm">Admin Panel</p>
              <p className="text-zinc-500 text-xs">TuffPuff</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {sidebarLinks.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href;
              return (
                <Link key={href} href={href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? 'bg-amber-500/10 text-amber-400' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}>
                  <Icon size={18} />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Back to store button */}
          <Link href="/" className="flex items-center gap-2 px-3 py-3 mt-4 text-zinc-400 font-medium hover:text-white hover:bg-zinc-800 rounded-xl transition-all border border-transparent hover:border-zinc-700">
            <ArrowLeft size={16} /> Back to Store
          </Link>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-zinc-900 border-b border-zinc-800 px-4 py-3 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-2 text-zinc-400 hover:text-white bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors">
                <ArrowLeft size={18} />
              </Link>
              <span className="text-white font-bold text-sm">Admin Panel</span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {sidebarLinks.map(({ href, icon: Icon }) => (
                <Link key={href} href={href}
                  className={`p-2 rounded-lg shrink-0 transition-colors ${pathname === href ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors'}`}>
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-8 pt-16 md:pt-8 overflow-auto">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  );
}
