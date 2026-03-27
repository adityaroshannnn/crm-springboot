import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', imageUrl: '', active: true });
  const { isAdmin } = useAuth();

  const fetchProducts = () => {
    axios.get('/api/products', { withCredentials: true })
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await axios.post('/api/products', { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) }, { withCredentials: true });
    setShowForm(false);
    setForm({ name: '', description: '', price: '', stock: '', imageUrl: '', active: true });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await axios.delete(`/api/products/${id}`, { withCredentials: true });
    fetchProducts();
  };

  if (!isAdmin) return <div className="text-center py-20 text-red-400">Access Denied</div>;
  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading...</div>;

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Products</h2>
          <div className="w-12 h-0.5 bg-gold-400"></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-400 transition text-sm">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-dark-800 p-6 rounded-xl border border-gray-800 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="Product Name" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          <input placeholder="Price" type="number" step="0.01" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
          <input placeholder="Stock" type="number" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
          <input placeholder="Image URL" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.imageUrl} onChange={e => setForm({...form, imageUrl: e.target.value})} />
          <textarea placeholder="Description" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none col-span-full" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="2" />
          <button type="submit" className="bg-gold-500 text-dark-900 font-semibold rounded-lg py-2.5 hover:bg-gold-400 transition">Save Product</button>
        </form>
      )}

      <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-dark-900 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.imageUrl && <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />}
                      <span className="text-white font-medium">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gold-400 font-bold">₹{p.price}</td>
                  <td className="px-6 py-4 text-gray-400">{p.stock}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {p.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 text-xs transition">Delete</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan="5" className="px-6 py-12 text-center text-gray-500">No products found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
