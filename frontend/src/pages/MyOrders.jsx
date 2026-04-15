import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const STATUS_FLOW = ['PURCHASED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];

function OrderProgress({ status }) {
  const currentIdx = STATUS_FLOW.indexOf(status);
  const isRefund = status === 'REFUND_REQUESTED' || status === 'REFUNDED';

  if (isRefund) {
    return (
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'REFUNDED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'}`}>
        {status.replace('_', ' ')}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 mt-3">
      {STATUS_FLOW.map((s, i) => {
        const done = i <= currentIdx;
        return (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition ${done ? 'bg-gold-400 text-dark-900' : 'bg-dark-900 border border-gray-700 text-gray-600'}`}>
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] mt-1 ${done ? 'text-gold-400' : 'text-gray-600'}`}>{s.charAt(0) + s.slice(1).toLowerCase()}</span>
            </div>
            {i < STATUS_FLOW.length - 1 && (
              <div className={`flex-1 h-0.5 mx-0.5 rounded ${i < currentIdx ? 'bg-gold-400' : 'bg-gray-800'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();

  const fetchOrders = () => {
    api.get('/api/my-orders')
      .then(res => setOrders(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const requestRefund = async (id) => {
    await api.post(`/api/my-orders/refund/${id}`, {});
    fetchOrders();
  };

  const downloadInvoice = async (orderId) => {
    const token = localStorage.getItem('jwt_token');
    const resp = await fetch(`/api/invoice/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await resp.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  if (!isLoggedIn) return <div className="text-center py-20 text-gray-400">Please <a href="/login" className="text-gold-400">log in</a> to view your orders.</div>;
  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading your orders...</div>;

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
            <div key={o.id} className="bg-dark-800 rounded-xl border border-gray-800 p-6 hover:border-gold-400/20 transition">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {o.product?.imageUrl && <img src={o.product.imageUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />}
                    <div>
                      <h3 className="text-white font-medium">{o.product?.name}</h3>
                      <p className="text-gray-500 text-sm mt-0.5">Qty: {o.quantity} · Order #{o.id} · {o.createdAt ? new Date(o.createdAt).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                </div>
                <div className="text-gold-400 font-bold text-lg">₹{o.totalPrice}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => downloadInvoice(o.id)} className="px-3 py-1.5 bg-dark-900 border border-gray-700 text-gray-400 rounded-lg text-xs hover:text-gold-400 hover:border-gold-400/30 transition">
                    📄 Receipt
                  </button>
                  {o.status === 'PURCHASED' && (
                    <button onClick={() => requestRefund(o.id)} className="px-3 py-1.5 border border-red-500/30 text-red-400 rounded-lg text-xs hover:bg-red-500/10 transition">
                      Refund
                    </button>
                  )}
                </div>
              </div>
              <OrderProgress status={o.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
