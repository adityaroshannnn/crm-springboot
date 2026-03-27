import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/api/shop', { withCredentials: true })
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false));
  }, []);

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
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-serif text-white mb-3">Featured Collection</h2>
        <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4"></div>
        <p className="text-gray-400 max-w-xl mx-auto">Discover our exclusive, curated selection of premium products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map(product => (
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

      {products.length === 0 && (
        <div className="text-center text-gray-500 py-20">No products available at the moment.</div>
      )}
    </div>
  );
}
