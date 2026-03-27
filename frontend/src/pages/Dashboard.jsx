import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    axios.get('/api/dashboard', { withCredentials: true })
      .then(res => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!isAdmin) return <div className="text-center py-20 text-red-400">Access Denied. Admin only.</div>;
  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading dashboard...</div>;
  if (!stats) return <div className="text-center py-20 text-red-400">Failed to load dashboard</div>;

  const cards = [
    { label: 'Total Customers', value: stats.totalCustomers, icon: '👥', color: 'from-blue-500/20 to-blue-600/5' },
    { label: 'Total Products', value: stats.totalProducts, icon: '📦', color: 'from-emerald-500/20 to-emerald-600/5' },
    { label: 'Total Orders', value: stats.totalOrders, icon: '🛒', color: 'from-purple-500/20 to-purple-600/5' },
    { label: 'Total Revenue', value: `₹${stats.totalRevenue?.toLocaleString() || 0}`, icon: '💰', color: 'from-gold-400/20 to-gold-500/5' },
  ];

  return (
    <div className="animate-fade-in-up">
      <div className="mb-10">
        <h2 className="text-3xl font-serif text-white mb-2">Admin Dashboard</h2>
        <div className="w-12 h-0.5 bg-gold-400"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} bg-dark-800 rounded-xl p-6 border border-gray-800 hover:border-gold-400/30 transition`}>
            <div className="text-3xl mb-3">{card.icon}</div>
            <p className="text-gray-400 text-sm mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
