import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const ALL_STATUSES = ['PURCHASED', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'REFUND_REQUESTED', 'REFUNDED'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  const fetchOrders = () => {
    api.get('/api/orders')
      .then(res => setOrders(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const approveRefund = async (id) => {
    await api.post(`/api/orders/approve-refund/${id}`, {});
    fetchOrders();
  };

  const updateStatus = async (id, status) => {
    await api.put(`/api/orders/${id}/status`, { status });
    fetchOrders();
  };

  if (!isAdmin) return <div className="text-center py-20 text-red-400">Access Denied</div>;
  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading...</div>;

  const statusColor = (s) => {
    switch(s) {
      case 'PURCHASED': return 'bg-blue-500/10 text-blue-400';
      case 'CONFIRMED': return 'bg-cyan-500/10 text-cyan-400';
      case 'SHIPPED': return 'bg-purple-500/10 text-purple-400';
      case 'DELIVERED': return 'bg-green-500/10 text-green-400';
      case 'REFUND_REQUESTED': return 'bg-yellow-500/10 text-yellow-400';
      case 'REFUNDED': return 'bg-red-500/10 text-red-400';
      default: return 'bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="animate-fade-in-up">
      <div className="mb-8">
        <h2 className="text-3xl font-serif text-white mb-2">All Orders</h2>
        <div className="w-12 h-0.5 bg-gold-400"></div>
      </div>

      <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-dark-900 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Qty</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4 text-gray-400">#{o.id}</td>
                  <td className="px-6 py-4 text-white">{o.customer?.firstName} {o.customer?.lastName}</td>
                  <td className="px-6 py-4 text-gray-300">{o.product?.name}</td>
                  <td className="px-6 py-4 text-gray-400">{o.quantity}</td>
                  <td className="px-6 py-4 text-gold-400 font-bold">₹{o.totalPrice}</td>
                  <td className="px-6 py-4">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg text-xs font-medium border-0 outline-none cursor-pointer ${statusColor(o.status)} bg-transparent`}
                    >
                      {ALL_STATUSES.map(s => (
                        <option key={s} value={s} className="bg-dark-900 text-white">{s.replace('_', ' ')}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {o.status === 'REFUND_REQUESTED' && (
                      <button onClick={() => approveRefund(o.id)} className="px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-xs hover:bg-green-500/20 transition">
                        Approve Refund
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-500">No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
