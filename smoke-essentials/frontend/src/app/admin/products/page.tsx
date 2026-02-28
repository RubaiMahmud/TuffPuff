'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2 } from 'lucide-react';
import api from '@/lib/api';

const categoryOptions = ['CIGARETTES', 'LIGHTERS', 'ROLLING_PAPERS', 'BEVERAGES', 'SNACKS', 'ESSENTIALS'];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '', brand: '', category: 'CIGARETTES', description: '',
    price: 0, stock: 0, image: '', packSize: '1 pack',
  });
  const [saving, setSaving] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/admin/products?limit=100').then((res) => setProducts(res.data.data || [])).catch(() => { }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const resetForm = () => {
    setFormData({ name: '', brand: '', category: 'CIGARETTES', description: '', price: 0, stock: 0, image: '', packSize: '1 pack' });
    setEditing(null);
    setShowForm(false);
  };

  const openEdit = (product: any) => {
    setFormData({ name: product.name, brand: product.brand, category: product.category, description: product.description, price: product.price, stock: product.stock, image: product.image, packSize: product.packSize });
    setEditing(product);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        await api.patch(`/admin/products/${editing.id}`, formData);
      } else {
        await api.post('/admin/products', formData);
      }
      resetForm();
      fetchProducts();
    } catch { }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Deactivate this product?')) return;
    await api.delete(`/admin/products/${id}`);
    fetchProducts();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="btn-primary text-sm flex items-center gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={resetForm} className="text-zinc-400 hover:text-white"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" placeholder="Product name" value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="input-field" required />
              <input type="text" placeholder="Brand" value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })} className="input-field" required />
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field">
                {categoryOptions.map((c) => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
              </select>
              <textarea placeholder="Description" value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="input-field" rows={3} required />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Price ($)</label>
                  <input type="number" step="0.01" value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="input-field" required />
                </div>
                <div>
                  <label className="text-xs text-zinc-500 mb-1 block">Stock</label>
                  <input type="number" value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })} className="input-field" required />
                </div>
              </div>
              <input type="text" placeholder="Pack size (e.g., 20 cigarettes)" value={formData.packSize}
                onChange={(e) => setFormData({ ...formData, packSize: e.target.value })} className="input-field" />
              <input type="text" placeholder="Image URL (optional)" value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="input-field" />

              <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
                {saving ? <Loader2 size={16} className="animate-spin" /> : null}
                {editing ? 'Update Product' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800 text-left">
                <th className="text-zinc-500 text-xs font-medium py-3 px-3">Product</th>
                <th className="text-zinc-500 text-xs font-medium py-3 px-3">Category</th>
                <th className="text-zinc-500 text-xs font-medium py-3 px-3">Price</th>
                <th className="text-zinc-500 text-xs font-medium py-3 px-3">Stock</th>
                <th className="text-zinc-500 text-xs font-medium py-3 px-3">Status</th>
                <th className="text-zinc-500 text-xs font-medium py-3 px-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50">
                  <td className="py-3 px-3">
                    <p className="text-white text-sm font-medium">{p.name}</p>
                    <p className="text-zinc-500 text-xs">{p.brand}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-zinc-400 text-xs">{p.category?.replace('_', ' ')}</span>
                  </td>
                  <td className="py-3 px-3 text-amber-400 text-sm font-medium">৳{p.price?.toFixed(2)}</td>
                  <td className="py-3 px-3">
                    <span className={`text-sm font-medium ${p.stock <= 10 ? 'text-red-400' : 'text-green-400'}`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${p.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-red-400">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
