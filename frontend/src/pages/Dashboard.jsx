import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAuth();

  useEffect(() => {
    api.get('/api/dashboard')
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

  const maxRevenue = stats.monthlyRevenue ? Math.max(...stats.monthlyRevenue.map(m => m.revenue), 1) : 1;

  const statusColors = {
    PURCHASED: { bg: 'bg-blue-500/20', text: 'text-blue-400', bar: 'bg-blue-500' },
    CONFIRMED: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', bar: 'bg-cyan-500' },
    SHIPPED: { bg: 'bg-purple-500/20', text: 'text-purple-400', bar: 'bg-purple-500' },
    DELIVERED: { bg: 'bg-green-500/20', text: 'text-green-400', bar: 'bg-green-500' },
    REFUND_REQUESTED: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', bar: 'bg-yellow-500' },
    REFUNDED: { bg: 'bg-red-500/20', text: 'text-red-400', bar: 'bg-red-500' },
  };

  const totalStatusOrders = stats.statusDistribution ? Object.values(stats.statusDistribution).reduce((a, b) => a + b, 0) : 1;

  return (
    <div className="animate-fade-in-up">
      <div className="mb-10">
        <h2 className="text-3xl font-serif text-white mb-2">Admin Dashboard</h2>
        <div className="w-12 h-0.5 bg-gold-400"></div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {cards.map((card, i) => (
          <div key={i} className={`bg-gradient-to-br ${card.color} bg-dark-800 rounded-xl p-6 border border-gray-800 hover:border-gold-400/30 transition`}>
            <div className="text-3xl mb-3">{card.icon}</div>
            <p className="text-gray-400 text-sm mb-1">{card.label}</p>
            <p className="text-3xl font-bold text-white">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        {/* Monthly Revenue Chart */}
        <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-medium text-white mb-1">Revenue (Last 6 Months)</h3>
          <p className="text-gray-600 text-xs mb-6">Monthly revenue overview</p>
          <div className="flex items-end gap-3 h-48">
            {(stats.monthlyRevenue || []).map((m, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-gray-400">₹{Math.round(m.revenue).toLocaleString()}</span>
                <div className="w-full bg-dark-900 rounded-t-lg overflow-hidden" style={{ height: '100%' }}>
                  <div
                    className="w-full bg-gradient-to-t from-gold-500 to-gold-400/60 rounded-t-lg transition-all duration-700"
                    style={{ height: `${Math.max((m.revenue / maxRevenue) * 100, 4)}%`, marginTop: 'auto' }}
                  ></div>
                </div>
                <span className="text-[10px] text-gray-500">{m.month?.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-dark-800 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-medium text-white mb-1">Order Status</h3>
          <p className="text-gray-600 text-xs mb-5">Current distribution</p>
          <div className="space-y-3">
            {Object.entries(stats.statusDistribution || {}).map(([status, count]) => {
              const colors = statusColors[status] || statusColors.PURCHASED;
              const pct = Math.round((count / totalStatusOrders) * 100);
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-xs font-medium ${colors.text}`}>{status.replace('_', ' ')}</span>
                    <span className="text-xs text-gray-500">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-dark-900 rounded-full overflow-hidden">
                    <div className={`h-full ${colors.bar} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
            {Object.keys(stats.statusDistribution || {}).length === 0 && (
              <p className="text-gray-600 text-sm text-center py-4">No orders yet</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-800">
            <h3 className="text-lg font-medium text-white">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-dark-900 text-gray-500">
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {(stats.recentOrders || []).map((o, i) => {
                  const colors = statusColors[o.status] || statusColors.PURCHASED;
                  return (
                    <tr key={i} className="border-b border-gray-800/50 hover:bg-white/[0.02]">
                      <td className="px-6 py-3 text-gray-400">#{o.id}</td>
                      <td className="px-6 py-3 text-white">{o.customer}</td>
                      <td className="px-6 py-3 text-gray-400">{o.product}</td>
                      <td className="px-6 py-3 text-gold-400 font-bold">₹{o.total}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${colors.bg} ${colors.text}`}>{o.status}</span>
                      </td>
                    </tr>
                  );
                })}
                {(stats.recentOrders || []).length === 0 && (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-gray-600">No orders yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-dark-800 rounded-xl border border-gray-800 p-6">
          <h3 className="text-lg font-medium text-white mb-1">Top Products</h3>
          <p className="text-gray-600 text-xs mb-5">By order count</p>
          <div className="space-y-4">
            {(stats.topProducts || []).map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-dark-900 rounded-full flex items-center justify-center text-xs text-gold-400 font-bold border border-gray-700">{i + 1}</span>
                <div className="flex-1">
                  <p className="text-white text-sm font-medium truncate">{p.name}</p>
                </div>
                <span className="text-gray-400 text-xs">{p.orders} orders</span>
              </div>
            ))}
            {(stats.topProducts || []).length === 0 && (
              <p className="text-gray-600 text-sm text-center">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
