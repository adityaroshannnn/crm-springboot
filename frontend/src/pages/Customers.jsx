import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', status: 'ACTIVE', managerId: '', username: '', password: '' });
  const { isAdmin } = useAuth();
 
  const fetchData = () => {
    Promise.all([
      api.get('/api/customers'),
      api.get('/api/managers')
    ]).then(([custRes, mgrRes]) => {
      setCustomers(custRes.data);
      setManagers(mgrRes.data);
    }).finally(() => setLoading(false));
  };
 
  useEffect(() => { fetchData(); }, []);
 
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/api/customers?managerId=${form.managerId}`, form);
      setShowForm(false);
      setForm({ firstName: '', lastName: '', email: '', phone: '', status: 'ACTIVE', managerId: '', username: '', password: '' });
      fetchData();
    } catch (err) { alert('Failed to save customer'); }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this customer?')) return;
    await api.delete(`/api/customers/${id}`);
    fetchData();
  };

  if (!isAdmin) return <div className="text-center py-20 text-red-400">Access Denied</div>;
  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading...</div>;

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Customers</h2>
          <div className="w-12 h-0.5 bg-gold-400"></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-400 transition text-sm">
          {showForm ? 'Cancel' : '+ Add Customer'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-dark-800 p-6 rounded-xl border border-gray-800 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="First Name" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
          <input placeholder="Last Name" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
          <input placeholder="Email" type="email" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input placeholder="Phone" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
          <select className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.managerId} onChange={e => setForm({...form, managerId: e.target.value})} required>
            <option value="">Select Manager</option>
            {managers.map(m => <option key={m.id} value={m.id}>{m.firstName} {m.lastName}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <input placeholder="Login Username" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
            <input placeholder="Login Password" type="password" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          <button type="submit" className="bg-gold-500 text-dark-900 font-semibold rounded-lg py-2.5 hover:bg-gold-400 transition md:col-span-2">Save Customer & Create Account</button>
        </form>
      )}

      <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-dark-900 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Manager</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map(c => (
                <tr key={c.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4 text-white font-medium">{c.firstName} {c.lastName}</td>
                  <td className="px-6 py-4 text-gray-400">{c.email}</td>
                  <td className="px-6 py-4 text-gray-400">{c.phone || '-'}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${c.status === 'ACTIVE' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{c.manager ? `${c.manager.firstName} ${c.manager.lastName}` : '-'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(c.id)} className="text-red-400 hover:text-red-300 text-xs transition">Delete</button>
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr><td colSpan="6" className="px-6 py-12 text-center text-gray-500">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
