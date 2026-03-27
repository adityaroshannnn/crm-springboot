import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const fetchOrders = () => {
    axios.get('/api/my-orders', { withCredentials: true })
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const requestRefund = async (id) => {
    await axios.post(`/api/my-orders/refund/${id}`, {}, { withCredentials: true });
    fetchOrders();
  };

  if (!isLoggedIn) return <div className="text-center py-20 text-gray-400">Please <a href="/login" className="text-gold-400">log in</a> to view your orders.</div>;
  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading your orders...</div>;

  const statusColor = (s) => {
    switch(s) {
      case 'PURCHASED': return 'bg-blue-500/10 text-blue-400';
      case 'REFUND_REQUESTED': return 'bg-yellow-500/10 text-yellow-400';
      case 'REFUNDED': return 'bg-green-500/10 text-green-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-white mb-2">My Orders</h2>
        <div className="w-12 h-0.5 bg-gold-400"></div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-dark-800 rounded-xl border border-gray-800 p-16 text-center">
          <p className="text-3xl mb-4">🛍️</p>
          <p className="text-gray-400">You haven't placed any orders yet.</p>
          <a href="/shop" className="text-gold-400 text-sm mt-2 inline-block hover:text-gold-300 transition">Browse Shop →</a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(o => (
            <div key={o.id} className="bg-dark-800 rounded-xl border border-gray-800 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-gold-400/20 transition">
              <div className="flex-1">
                <h3 className="text-white font-medium">{o.product?.name}</h3>
                <p className="text-gray-500 text-sm mt-1">Qty: {o.quantity} · Order #{o.id}</p>
              </div>
              <div className="text-gold-400 font-bold text-lg">₹{o.totalPrice}</div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(o.status)}`}>{o.status}</span>
              {o.status === 'PURCHASED' && (
                <button onClick={() => requestRefund(o.id)} className="px-4 py-1.5 border border-red-500/30 text-red-400 rounded-lg text-xs hover:bg-red-500/10 transition">
                  Request Refund
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
