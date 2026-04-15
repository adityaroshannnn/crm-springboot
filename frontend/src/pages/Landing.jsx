import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

export default function Landing() {
  const [storeName, setStoreName] = useState('CRM System');

  useEffect(() => {
    api.get('/api/store-settings')
      .then(res => { if (res.data?.storeName) setStoreName(res.data.storeName); })
      .catch(() => {});
  }, []);

  const features = [
    { icon: '🛍️', title: 'Premium Store', desc: 'Browse and purchase curated products with a seamless shopping experience.' },
    { icon: '📊', title: 'Admin Dashboard', desc: 'Full control over products, orders, customers, and managers from one place.' },
    { icon: '💳', title: 'Secure Payments', desc: 'Integrated Razorpay payment gateway for safe and instant transactions.' },
    { icon: '⭐', title: 'Reviews & Ratings', desc: 'Share your experience and read what others think about products.' },
    { icon: '🤖', title: 'AI Concierge', desc: 'Get instant help with our intelligent chatbot assistant.' },
    { icon: '⚙️', title: 'Customizable', desc: 'Admins can customize the store name, product images, and more.' },
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-gray-100 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold-400/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-gold-400/5 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-gold-400/[0.03] rounded-full"></div>
        </div>

        <div className="relative text-center max-w-4xl mx-auto animate-fade-in-up">
          {/* Logo */}
          <div className="mb-8">
            <span className="text-6xl inline-block animate-pulse">✦</span>
          </div>

          {/* Store Name */}
          <h1 className="text-5xl sm:text-7xl font-serif font-bold text-white mb-4 tracking-tight">
            {storeName}
          </h1>

          {/* Decorative Line */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent mx-auto mb-6"></div>

          {/* Tagline */}
          <p className="text-xl sm:text-2xl text-gray-400 font-light mb-4 max-w-2xl mx-auto">
            Enterprise Customer Relationship Management
          </p>
          <p className="text-gray-500 text-base max-w-xl mx-auto mb-12 leading-relaxed">
            A comprehensive platform for managing products, customers, orders, and analytics — 
            built with Spring Boot and modern web technologies.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3.5 bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold rounded-xl text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-gold-500/20 hover:shadow-gold-500/40 min-w-[200px]"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 border border-gold-400/40 text-gold-400 font-semibold rounded-xl text-lg hover:bg-gold-400/10 transition-all min-w-[200px]"
            >
              Create Account
            </Link>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-700 rounded-full flex justify-center pt-2">
              <div className="w-1.5 h-3 bg-gold-400/60 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-serif text-white mb-3">What Makes Us Different</h2>
            <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4"></div>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to run a modern store, all in one elegant platform.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="bg-dark-800 rounded-xl p-7 border border-gray-800 hover:border-gold-400/30 transition-all duration-300 group hover:shadow-lg hover:shadow-gold-500/5"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-lg font-medium text-white mb-2 group-hover:text-gold-400 transition">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-serif text-white mb-3">Built With</h2>
          <div className="w-12 h-0.5 bg-gold-400 mx-auto mb-10"></div>

          <div className="flex flex-wrap justify-center gap-4">
            {['Spring Boot', 'React.js', 'MySQL', 'Spring Security', 'Razorpay', 'Vite', 'JPA / Hibernate', 'REST API'].map((tech, i) => (
              <span key={i} className="px-5 py-2 bg-dark-800 border border-gray-800 rounded-full text-sm text-gray-400 hover:text-gold-400 hover:border-gold-400/30 transition">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Project Info Section */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-3xl mx-auto">
          <div className="bg-dark-800 rounded-2xl p-8 sm:p-10 border border-gray-800 text-center">
            <h2 className="text-2xl font-serif text-white mb-4">About This Project</h2>
            <div className="w-12 h-0.5 bg-gold-400 mx-auto mb-6"></div>
            <p className="text-gray-400 leading-relaxed mb-4">
              This is a full-featured <span className="text-white">Customer Relationship Management (CRM) System</span> designed 
              for managing a modern online store. It features role-based authentication with separate Admin and Customer portals, 
              real-time product management with image uploads, integrated payment processing via Razorpay, 
              and a comprehensive admin dashboard with analytics.
            </p>
            <p className="text-gray-500 text-sm">
              Admin accounts have full access to CRUD operations on products, customers, managers, and orders. 
              Customer accounts can browse the shop, purchase products, track orders, and leave reviews.
            </p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 px-6 border-t border-gray-800/50">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-4xl mb-5 inline-block">✦</span>
          <h2 className="text-3xl font-serif text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-500 mb-8">Sign in to explore the full experience.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="px-8 py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-gold-500/20"
            >
              Sign In →
            </Link>
            <Link
              to="/shop"
              className="px-8 py-3 border border-gray-700 text-gray-400 rounded-xl hover:border-gold-400/30 hover:text-gold-400 transition"
            >
              Browse Shop as Guest
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-gray-800/50 text-center">
        <p className="text-gray-600 text-sm">© 2026 {storeName}. Built with Spring Boot & React.</p>
      </footer>
    </div>
  );
}
