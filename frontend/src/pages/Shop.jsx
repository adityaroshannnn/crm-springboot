import React, { useEffect, useState, useMemo } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/shop')
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
      );
    }

    // Price range
    if (priceRange.min !== '') result = result.filter(p => p.price >= Number(priceRange.min));
    if (priceRange.max !== '') result = result.filter(p => p.price <= Number(priceRange.max));

    // Sort
    switch (sortBy) {
      case 'price-asc': result.sort((a, b) => a.price - b.price); break;
      case 'price-desc': result.sort((a, b) => b.price - a.price); break;
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }

    return result;
  }, [products, search, sortBy, priceRange]);

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {[1,2,3].map(i => (
        <div key={i} className="bg-dark-800 rounded-xl h-96 animate-shimmer border border-gray-800"></div>
      ))}
    </div>
  );
  if (error) return <div className="text-center py-20 text-red-400">{error}</div>;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-serif text-white mb-3">Featured Collection</h2>
        <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4"></div>
        <p className="text-gray-400 max-w-xl mx-auto">Discover our exclusive, curated selection of premium products.</p>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-dark-800 rounded-xl border border-gray-800 p-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-dark-900 border border-gray-700/50 rounded-lg pl-10 pr-4 py-2.5 text-white text-sm focus:border-gold-400 outline-none transition"
            />
          </div>

          {/* Price Min */}
          <input
            type="number"
            placeholder="Min ₹"
            value={priceRange.min}
            onChange={e => setPriceRange({...priceRange, min: e.target.value})}
            className="w-24 bg-dark-900 border border-gray-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold-400 outline-none"
          />

          {/* Price Max */}
          <input
            type="number"
            placeholder="Max ₹"
            value={priceRange.max}
            onChange={e => setPriceRange({...priceRange, max: e.target.value})}
            className="w-24 bg-dark-900 border border-gray-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:border-gold-400 outline-none"
          />

          {/* Sort */}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="bg-dark-900 border border-gray-700/50 rounded-lg px-3 py-2.5 text-gray-300 text-sm focus:border-gold-400 outline-none cursor-pointer"
          >
            <option value="default">Sort by</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name">Name: A → Z</option>
          </select>

          {/* Clear */}
          {(search || priceRange.min || priceRange.max || sortBy !== 'default') && (
            <button
              onClick={() => { setSearch(''); setPriceRange({ min: '', max: '' }); setSortBy('default'); }}
              className="px-3 py-2 text-xs text-gray-400 hover:text-gold-400 border border-gray-700 rounded-lg transition"
            >
              Clear
            </button>
          )}
        </div>
        {filtered.length !== products.length && (
          <p className="text-gray-500 text-xs mt-2">{filtered.length} of {products.length} products</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map(product => (
          <div 
            key={product.id} 
            onClick={() => navigate(`/shop/product/${product.id}`)}
            className="bg-dark-800 rounded-xl overflow-hidden shadow-lg border border-gray-800 hover:border-gold-400/40 transition-all duration-300 group cursor-pointer hover:shadow-gold-500/5 hover:shadow-xl"
          >
            <div className="h-56 bg-dark-900 w-full overflow-hidden flex items-center justify-center">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              ) : (
                <div className="text-gray-600 font-serif italic text-sm">No Image</div>
              )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-medium text-white group-hover:text-gold-400 transition">{product.name}</h3>
                <span className="text-gold-400 font-bold whitespace-nowrap ml-3">₹{product.price}</span>
              </div>
              <p className="text-gray-500 text-sm mb-5 line-clamp-2">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className={`text-xs px-2 py-1 rounded-full ${product.stock > 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </span>
                <span className="text-gold-400 text-sm font-medium group-hover:translate-x-1 transition-transform">View →</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-gray-500 py-20">
          {products.length === 0 ? 'No products available at the moment.' : 'No products match your search.'}
        </div>
      )}
    </div>
  );
}
