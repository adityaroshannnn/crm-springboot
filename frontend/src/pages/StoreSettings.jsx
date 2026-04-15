import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function StoreSettings() {
  const [storeName, setStoreName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const { isAdmin } = useAuth();

  useEffect(() => {
    api.get('/api/store-settings')
      .then(res => {
        setStoreName(res.data.storeName);
        setOriginalName(res.data.storeName);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!storeName.trim()) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await api.put('/api/store-settings', { storeName: storeName.trim() });
      setOriginalName(res.data.storeName);
      setMessage('✅ Store name updated successfully!');
      // Dispatch custom event so Navbar can update in real-time
      window.dispatchEvent(new CustomEvent('store-name-updated', { detail: res.data.storeName }));
    } catch (err) {
      setMessage('❌ Failed to update store name.');
    }
    setSaving(false);
  };

  if (!isAdmin) return <div className="text-center py-20 text-red-400">Access Denied. Admin only.</div>;
  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading...</div>;

  const hasChanges = storeName !== originalName;

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto">
      <div className="mb-10">
        <h2 className="text-3xl font-serif text-white mb-2">Store Settings</h2>
        <div className="w-12 h-0.5 bg-gold-400"></div>
      </div>

      <div className="bg-dark-800 rounded-2xl border border-gray-800 overflow-hidden">
        {/* Header */}
        <div className="bg-dark-900 px-8 py-5 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">General Settings</h3>
          <p className="text-gray-500 text-sm mt-1">Manage your store's branding and identity</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-8">
          <div className="mb-6">
            <label className="block text-sm text-gray-400 mb-2 font-medium">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-3 text-white text-lg focus:border-gold-400 outline-none transition"
              placeholder="Enter your store name"
              required
            />
            <p className="text-gray-600 text-xs mt-2">This name will appear in the navigation bar and across your store.</p>
          </div>

          {message && (
            <div className={`text-sm mb-4 px-4 py-2.5 rounded-lg ${message.includes('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              {message}
            </div>
          )}

          <div className="flex items-center gap-4">
            <button
              type="submit"
              disabled={saving || !hasChanges}
              className="px-6 py-2.5 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-400 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {hasChanges && (
              <button
                type="button"
                onClick={() => setStoreName(originalName)}
                className="px-6 py-2.5 border border-gray-700 text-gray-400 rounded-lg hover:border-gray-600 hover:text-gray-300 transition text-sm"
              >
                Discard
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className="mt-6 bg-dark-800 rounded-xl border border-gray-800 p-6">
        <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider font-medium">Preview</p>
        <div className="bg-dark-900 rounded-lg px-5 py-3 border border-gray-800 flex items-center gap-3">
          <span className="text-xl">✦</span>
          <span className="text-lg font-serif font-semibold text-gold-400">{storeName || 'Store Name'}</span>
        </div>
      </div>
    </div>
  );
}
