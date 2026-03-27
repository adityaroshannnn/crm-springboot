import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(username, password);
      if (data.success) {
        const roles = data.roles || [];
        if (roles.includes('ROLE_ADMIN')) {
          navigate('/dashboard');
        } else {
          navigate('/shop');
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[75vh] animate-fade-in-up">
      <div className="bg-dark-800 p-10 rounded-2xl shadow-2xl border border-gold-400/20 w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl mb-3 block">✦</span>
          <h2 className="text-3xl font-serif text-gold-400">Welcome Back</h2>
          <p className="text-gray-500 text-sm mt-2">Sign in to your account</p>
        </div>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mb-5 text-sm text-center">{error}</div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Username</label>
            <input 
              type="text" 
              className="w-full bg-dark-900 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition placeholder-gray-600"
              placeholder="Enter username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">Password</label>
            <input 
              type="password" 
              className="w-full bg-dark-900 border border-gray-700/50 rounded-xl px-4 py-3 text-gray-100 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400/50 transition placeholder-gray-600"
              placeholder="Enter password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-2 bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold rounded-xl transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-lg shadow-gold-500/20"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold-400 hover:text-gold-300 transition font-medium">Create Account</Link>
        </div>
      </div>
    </div>
  );
}
