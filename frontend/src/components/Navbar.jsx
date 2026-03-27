import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark-800/80 backdrop-blur-md border-b border-gold-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <span className="text-2xl">✦</span>
          <span className="text-xl font-serif font-semibold text-gold-400 group-hover:text-gold-300 transition">
            CRM System
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/shop">Shop</NavLink>

          {isLoggedIn && (
            <NavLink to="/my-orders">My Orders</NavLink>
          )}

          {isAdmin && (
            <>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/customers">Customers</NavLink>
              <NavLink to="/managers">Managers</NavLink>
              <NavLink to="/products">Products</NavLink>
              <NavLink to="/orders">Orders</NavLink>
            </>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-3 ml-3">
              <span className="text-xs text-gray-400 hidden sm:inline">
                {user.username}
              </span>
              <button 
                onClick={handleLogout}
                className="px-4 py-1.5 text-sm border border-gold-400/40 text-gold-400 rounded-full hover:bg-gold-400/10 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-3">
              <Link 
                to="/login" 
                className="px-4 py-1.5 text-sm bg-gold-500 text-dark-900 font-semibold rounded-full hover:bg-gold-400 transition hover:shadow-lg shadow-gold-500/20"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="px-4 py-1.5 text-sm border border-gold-400/40 text-gold-400 rounded-full hover:bg-gold-400/10 transition hidden sm:inline-block"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function NavLink({ to, children }) {
  return (
    <Link 
      to={to} 
      className="px-3 py-1.5 text-sm text-gray-300 hover:text-gold-300 transition rounded-lg hover:bg-white/5"
    >
      {children}
    </Link>
  );
}
