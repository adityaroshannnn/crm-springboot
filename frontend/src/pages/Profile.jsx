import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { isLoggedIn, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '' });
  const [message, setMessage] = useState('');
 
  useEffect(() => {
    if (!isLoggedIn) return;
    api.get('/api/profile')
      .then(res => {
        setProfile(res.data);
        setForm({ 
          firstName: res.data.firstName || '', 
          lastName: res.data.lastName || '',
          email: res.data.email || ''
        });
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn]);
 
  const handleSave = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.put('/api/profile', form);
      setProfile({ ...profile, firstName: form.firstName, lastName: form.lastName, email: form.email });
      setEditing(false);
      setMessage('✅ Profile updated! (If you changed your email, your login username has also changed)');
    } catch {
      setMessage('❌ Failed to update.');
    }
  };

  if (!isLoggedIn) return <div className="text-center py-20 text-gray-500">Please <a href="/login" className="text-gold-400">log in</a> to view your profile.</div>;
  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading...</div>;
  if (!profile) return <div className="text-center py-20 text-red-400">Failed to load profile</div>;

  return (
    <div className="animate-fade-in-up max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-serif text-white mb-2">My Profile</h2>
        <div className="w-12 h-0.5 bg-gold-400 mx-auto"></div>
      </div>

      {/* Profile Card */}
      <div className="bg-dark-800 rounded-2xl border border-gray-800 overflow-hidden mb-6">
        <div className="bg-gradient-to-r from-gold-500/10 to-transparent p-8 border-b border-gray-800">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-dark-900 rounded-full flex items-center justify-center text-2xl border-2 border-gold-400/30">
              {(profile.firstName?.[0] || profile.username?.[0] || '?').toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl text-white font-medium">
                {profile.firstName || profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`.trim()
                  : profile.username}
              </h3>
              <p className="text-gray-400 text-sm">{profile.email}</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 divide-x divide-gray-800">
          <div className="p-5 text-center">
            <p className="text-2xl font-bold text-white">{profile.totalOrders}</p>
            <p className="text-gray-500 text-xs mt-1">Orders</p>
          </div>
          <div className="p-5 text-center">
            <p className="text-2xl font-bold text-gold-400">₹{Math.round(profile.totalSpent).toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">Total Spent</p>
          </div>
          <div className="p-5 text-center">
            <p className="text-sm font-medium text-white">{profile.memberSince ? new Date(profile.memberSince).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}</p>
            <p className="text-gray-500 text-xs mt-1">Member Since</p>
          </div>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="bg-dark-800 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="bg-dark-900 px-6 py-4 border-b border-gray-800 flex justify-between items-center">
          <h3 className="text-sm font-medium text-white">Personal Information</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="text-gold-400 text-xs hover:text-gold-300 transition">Edit</button>
          )}
        </div>

        {message && (
          <div className={`mx-6 mt-4 text-sm px-4 py-2 rounded-lg ${message.includes('✅') ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{message}</div>
        )}

        {editing ? (
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">First Name</label>
                <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="w-full bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none text-sm" />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Last Name</label>
                <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="w-full bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none text-sm" required />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-5 py-2 bg-gold-500 text-dark-900 font-semibold rounded-lg text-sm hover:bg-gold-400 transition">Save</button>
              <button type="button" onClick={() => { setEditing(false); setForm({ firstName: profile.firstName, lastName: profile.lastName }); }} className="px-5 py-2 border border-gray-700 text-gray-400 rounded-lg text-sm hover:text-gray-300 transition">Cancel</button>
            </div>
          </form>
        ) : (
          <div className="p-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">First Name</p>
              <p className="text-white text-sm">{profile.firstName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Last Name</p>
              <p className="text-white text-sm">{profile.lastName || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Username</p>
              <p className="text-white text-sm">{profile.username}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-white text-sm">{profile.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
