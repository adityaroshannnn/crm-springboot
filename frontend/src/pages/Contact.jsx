import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Contact() {
  const { isLoggedIn, user } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app this would send to a backend endpoint
    setSubmitted(true);
  };

  if (!isLoggedIn) return <div className="text-center py-20 text-gray-500">Please <a href="/login" className="text-gold-400">log in</a> to contact us.</div>;

  return (
    <div className="animate-fade-in-up max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-serif text-white mb-2">Contact Us</h2>
        <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4"></div>
        <p className="text-gray-500">We'd love to hear from you. Reach out and we'll get back to you shortly.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Contact Info Cards */}
        <div className="lg:col-span-2 space-y-4">
          {[
            { icon: '📧', label: 'Email', value: 'support@crmstore.com', desc: 'Drop us a line anytime' },
            { icon: '📱', label: 'Phone', value: '+91 86370 00000', desc: 'Mon–Sat, 10am–6pm IST' },
            { icon: '📍', label: 'Location', value: 'India', desc: 'Operating nationwide' },
          ].map((info, i) => (
            <div key={i} className="bg-dark-800 rounded-xl p-5 border border-gray-800 hover:border-gold-400/20 transition group">
              <div className="flex items-start gap-4">
                <span className="text-2xl group-hover:scale-110 transition-transform">{info.icon}</span>
                <div>
                  <p className="text-gray-400 text-xs mb-1">{info.label}</p>
                  <p className="text-white font-medium text-sm">{info.value}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{info.desc}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Social / Quick Links */}
          <div className="bg-dark-800 rounded-xl p-5 border border-gray-800">
            <p className="text-gray-400 text-xs mb-3 uppercase tracking-wider font-medium">Quick Links</p>
            <div className="flex flex-wrap gap-2">
              <a href="/help-desk" className="px-3 py-1.5 bg-dark-900 border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-gold-400 hover:border-gold-400/30 transition">Help Desk</a>
              <a href="/shop" className="px-3 py-1.5 bg-dark-900 border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-gold-400 hover:border-gold-400/30 transition">Shop</a>
              <a href="/my-orders" className="px-3 py-1.5 bg-dark-900 border border-gray-800 rounded-lg text-xs text-gray-400 hover:text-gold-400 hover:border-gold-400/30 transition">My Orders</a>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-3">
          {submitted ? (
            <div className="bg-dark-800 rounded-2xl border border-gray-800 p-10 text-center">
              <div className="text-5xl mb-4">✉️</div>
              <h3 className="text-2xl font-serif text-white mb-3">Message Sent!</h3>
              <p className="text-gray-400 mb-6">Thank you for reaching out, <span className="text-gold-400">{user?.username || 'User'}</span>. We'll get back to you as soon as possible.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="px-6 py-2.5 border border-gray-700 text-gray-400 rounded-lg hover:border-gold-400/30 hover:text-gold-400 transition text-sm"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-dark-800 rounded-2xl border border-gray-800 overflow-hidden">
              <div className="bg-dark-900 px-6 py-4 border-b border-gray-800">
                <h3 className="text-lg font-medium text-white">Send a Message</h3>
                <p className="text-gray-600 text-xs mt-1">Fill in the details below and we'll respond via email</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Your Name</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={e => setForm({...form, name: e.target.value})}
                      className="w-full bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition text-sm"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5 font-medium">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({...form, email: e.target.value})}
                      className="w-full bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition text-sm"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Subject</label>
                  <input
                    type="text"
                    required
                    value={form.subject}
                    onChange={e => setForm({...form, subject: e.target.value})}
                    className="w-full bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition text-sm"
                    placeholder="Order issue, feedback, general inquiry..."
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5 font-medium">Message</label>
                  <textarea
                    required
                    rows="5"
                    value={form.message}
                    onChange={e => setForm({...form, message: e.target.value})}
                    className="w-full bg-dark-900 border border-gray-700/50 rounded-lg px-4 py-2.5 text-white focus:border-gold-400 outline-none transition text-sm resize-none"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold rounded-lg transition-all transform hover:scale-[1.01] active:scale-95 shadow-lg shadow-gold-500/20"
                >
                  Send Message
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
