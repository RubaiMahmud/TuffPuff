'use client';

import { useEffect, useState } from 'react';
import { DollarSign, Package, ShoppingCart, Users, TrendingUp } from 'lucide-react';
import api from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then((res) => setStats(res.data.data)).catch(() => { }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: 'Total Revenue', value: `৳${(stats?.totalRevenue || 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-500/10' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-zinc-500 text-sm">{label}</span>
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon size={16} className={color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
          </div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {Object.entries(stats?.ordersByStatus || {}).map(([status, count]: any) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-zinc-400 text-sm">{status.replace(/_/g, ' ')}</span>
                <span className="text-white font-medium">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="card">
          <h2 className="text-lg font-bold text-white mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {(stats?.recentOrders || []).map((order: any) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-0">
                <div>
                  <p className="text-white text-sm font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-zinc-500 text-xs">{order.user?.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 text-sm font-medium">৳{order.finalAmount?.toFixed(2)}</p>
                  <p className="text-zinc-500 text-xs">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
