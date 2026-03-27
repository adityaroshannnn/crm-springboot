import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Login from './pages/Login';
import Register from './pages/Register';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Managers from './pages/Managers';
import Products from './pages/Products';
import Orders from './pages/Orders';
import MyOrders from './pages/MyOrders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-dark-900 text-gray-100 font-sans">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <Routes>
              <Route path="/" element={<Navigate to="/shop" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/product/:id" element={<ProductDetails />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/managers" element={<Managers />} />
              <Route path="/products" element={<Products />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/my-orders" element={<MyOrders />} />
            </Routes>
          </main>
          <Chatbot />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
