'use client';

import { useEffect, useState } from 'react';
import { Users, Package } from 'lucide-react';
import api from '@/lib/api';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    api.get('/admin/users?limit=100').then((res) => setUsers(res.data.data || [])).catch(() => { }).finally(() => setLoading(false));
  }, []);

  const viewOrders = (userId: string) => {
    if (selectedUser === userId) { setSelectedUser(null); return; }
    setSelectedUser(userId);
    setLoadingOrders(true);
    api.get(`/admin/users/${userId}/orders`).then((res) => setUserOrders(res.data.data || [])).catch(() => { }).finally(() => setLoadingOrders(false));
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Users</h1>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-full flex items-center justify-center">
                    <Users size={18} className="text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{user.name}</p>
                    <p className="text-zinc-400 text-xs">{user.email} · {user.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-800 text-zinc-400'}`}>
                    {user.role}
                  </span>
                  <span className="text-zinc-500 text-xs">{user._count?.orders || 0} orders</span>
                  <button onClick={() => viewOrders(user.id)}
                    className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${selectedUser === user.id ? 'bg-amber-500/10 text-amber-400' : 'bg-zinc-800 text-zinc-400 hover:text-white'
                      }`}>
                    <Package size={14} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-500">
                <span>{user.ageVerified ? '✅ Age Verified' : '❌ Not Verified'}</span>
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>

              {/* Orders Dropdown */}
              {selectedUser === user.id && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  <p className="text-white text-sm font-medium mb-2">Order History</p>
                  {loadingOrders ? (
                    <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  ) : userOrders.length === 0 ? (
                    <p className="text-zinc-500 text-xs">No orders</p>
                  ) : (
                    <div className="space-y-2">
                      {userOrders.map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-2 bg-zinc-800/50 rounded-lg">
                          <div>
                            <p className="text-zinc-300 text-xs">#{order.id.slice(0, 8).toUpperCase()}</p>
                            <p className="text-zinc-500 text-xs">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-amber-400 text-xs font-medium">৳{order.finalAmount?.toFixed(2)}</p>
                            <p className="text-zinc-500 text-xs">{order.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
