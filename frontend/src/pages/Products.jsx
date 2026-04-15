import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', active: true });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { isAdmin } = useAuth();

  const fetchProducts = () => {
    api.get('/api/products')
      .then(res => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('price', parseFloat(form.price));
    formData.append('stock', parseInt(form.stock));
    formData.append('active', form.active);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    await api.post('/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    setShowForm(false);
    setForm({ name: '', description: '', price: '', stock: '', active: true });
    setImageFile(null);
    setImagePreview(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/api/products/${id}`);
    fetchProducts();
  };

  const handleChangeImage = async (productId, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    try {
      await api.post(`/api/products/${productId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      fetchProducts();
    } catch {
      alert('Failed to update image.');
    }
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
        <button onClick={() => { setShowForm(!showForm); if (showForm) { setImageFile(null); setImagePreview(null); } }} className="px-5 py-2 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-400 transition text-sm">
          {showForm ? 'Cancel' : '+ Add Product'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-dark-800 p-6 rounded-xl border border-gray-800 mb-8 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input placeholder="Product Name" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input placeholder="Price" type="number" step="0.01" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <input placeholder="Stock" type="number" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
            <textarea placeholder="Description" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows="1" />
          </div>

          {/* Image Upload Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="relative border-2 border-dashed border-gray-700 hover:border-gold-400/60 rounded-xl p-6 text-center transition-all duration-300 cursor-pointer group"
            onClick={() => document.getElementById('product-image-input').click()}
          >
            <input
              id="product-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            {imagePreview ? (
              <div className="flex flex-col items-center gap-3">
                <img src={imagePreview} alt="Preview" className="max-h-48 rounded-lg object-contain shadow-lg shadow-black/30" />
                <span className="text-xs text-gray-400">Click or drop to change image</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2 py-4">
                <div className="w-14 h-14 rounded-full bg-dark-900 border border-gray-700 flex items-center justify-center text-2xl group-hover:border-gold-400/50 transition">
                  📷
                </div>
                <p className="text-gray-400 text-sm">Drag & drop an image here, or <span className="text-gold-400 font-medium">click to browse</span></p>
                <p className="text-gray-600 text-xs">PNG, JPG, WebP up to 10MB</p>
              </div>
            )}
          </div>

          <button type="submit" className="w-full bg-gold-500 text-dark-900 font-semibold rounded-lg py-2.5 hover:bg-gold-400 transition">Save Product</button>
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
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-dark-900 border border-gray-700 flex items-center justify-center text-gray-600 text-xs">No img</div>
                      )}
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
                    <div className="flex items-center gap-2">
                      <label className="text-gold-400 hover:text-gold-300 text-xs transition cursor-pointer flex items-center gap-1" title="Change image">
                        📷 Image
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleChangeImage(p.id, e.target.files[0])} />
                      </label>
                      <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-300 text-xs transition">Delete</button>
                    </div>
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
