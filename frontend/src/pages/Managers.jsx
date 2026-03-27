import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Managers() {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', department: '' });
  const { isAdmin } = useAuth();

  const fetchManagers = () => {
    axios.get('/api/managers', { withCredentials: true })
      .then(res => setManagers(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchManagers(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await axios.post('/api/managers', form, { withCredentials: true });
    setShowForm(false);
    setForm({ firstName: '', lastName: '', email: '', department: '' });
    fetchManagers();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this manager?')) return;
    await axios.delete(`/api/managers/${id}`, { withCredentials: true });
    fetchManagers();
  };

  if (!isAdmin) return <div className="text-center py-20 text-red-400">Access Denied</div>;
  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading...</div>;

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-white mb-2">Managers</h2>
          <div className="w-12 h-0.5 bg-gold-400"></div>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-5 py-2 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-400 transition text-sm">
          {showForm ? 'Cancel' : '+ Add Manager'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSave} className="bg-dark-800 p-6 rounded-xl border border-gray-800 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <input placeholder="First Name" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} required />
          <input placeholder="Last Name" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} required />
          <input placeholder="Email" type="email" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
          <input placeholder="Department" className="bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none" value={form.department} onChange={e => setForm({...form, department: e.target.value})} required />
          <button type="submit" className="bg-gold-500 text-dark-900 font-semibold rounded-lg py-2.5 hover:bg-gold-400 transition col-span-full md:col-span-1">Save</button>
        </form>
      )}

      <div className="bg-dark-800 rounded-xl border border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-dark-900 text-gray-400 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map(m => (
                <tr key={m.id} className="border-b border-gray-800/50 hover:bg-white/[0.02] transition">
                  <td className="px-6 py-4 text-white font-medium">{m.firstName} {m.lastName}</td>
                  <td className="px-6 py-4 text-gray-400">{m.email}</td>
                  <td className="px-6 py-4 text-gray-400">{m.department}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-300 text-xs transition">Delete</button>
                  </td>
                </tr>
              ))}
              {managers.length === 0 && (
                <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-500">No managers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
