import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Landing from './pages/Landing';
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
import StoreSettings from './pages/StoreSettings';
import HelpDesk from './pages/HelpDesk';
import Contact from './pages/Contact';
import Profile from './pages/Profile';

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 font-sans">
      {!isLanding && <Navbar />}
      {isLanding ? (
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <Routes>
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
            <Route path="/store-settings" element={<StoreSettings />} />
              <Route path="/help-desk" element={<HelpDesk />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      )}
      {!isLanding && <Chatbot />}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
