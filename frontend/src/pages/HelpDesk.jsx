import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function HelpDesk() {
  const { isLoggedIn } = useAuth();
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    {
      q: 'How do I place an order?',
      a: 'Browse our shop, select a product you like, choose the quantity, and click the Pay button. You will be redirected to our secure Razorpay payment gateway to complete the transaction.'
    },
    {
      q: 'How can I track my orders?',
      a: 'After logging in, click "My Orders" in the navigation bar. You\'ll see a list of all your past and current orders along with their status.'
    },
    {
      q: 'What payment methods are accepted?',
      a: 'We accept all major payment methods through Razorpay, including credit/debit cards, UPI, net banking, and popular wallets.'
    },
    {
      q: 'How do I leave a product review?',
      a: 'Navigate to any product\'s detail page from the shop. Scroll down to the Reviews section and you\'ll find a form to submit your rating and comments.'
    },
    {
      q: 'Can I cancel or modify an order?',
      a: 'Currently, order modifications are handled by our admin team. Please use the Contact page to reach out, and we\'ll assist you as soon as possible.'
    },
    {
      q: 'I forgot my password. What do I do?',
      a: 'Please contact the admin via the Contact page. They will help you reset your credentials.'
    },
    {
      q: 'How do I create an account?',
      a: 'Click "Register" on the navigation bar or landing page. Fill in your details and you\'re all set to start shopping!'
    },
  ];

  if (!isLoggedIn) return <div className="text-center py-20 text-gray-500">Please <a href="/login" className="text-gold-400">log in</a> to access the Help Desk.</div>;

  return (
    <div className="animate-fade-in-up max-w-3xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-serif text-white mb-2">Help Desk</h2>
        <div className="w-16 h-0.5 bg-gold-400 mx-auto mb-4"></div>
        <p className="text-gray-500">Find answers to common questions below.</p>
      </div>

      {/* Quick Help Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { icon: '🛒', label: 'Orders', desc: 'Track & manage orders' },
          { icon: '💳', label: 'Payments', desc: 'Payment methods & issues' },
          { icon: '📞', label: 'Contact', desc: 'Get in touch with us', link: '/contact' },
        ].map((card, i) => (
          <a
            key={i}
            href={card.link || '#faqs'}
            className="bg-dark-800 rounded-xl p-5 border border-gray-800 hover:border-gold-400/30 transition-all group text-center"
          >
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{card.icon}</div>
            <h3 className="text-white font-medium text-sm mb-1">{card.label}</h3>
            <p className="text-gray-600 text-xs">{card.desc}</p>
          </a>
        ))}
      </div>

      {/* FAQ Section */}
      <div id="faqs" className="bg-dark-800 rounded-2xl border border-gray-800 overflow-hidden">
        <div className="bg-dark-900 px-6 py-4 border-b border-gray-800">
          <h3 className="text-lg font-medium text-white">Frequently Asked Questions</h3>
        </div>
        <div className="divide-y divide-gray-800">
          {faqs.map((faq, i) => (
            <div key={i} className="group">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition"
              >
                <span className="text-gray-200 text-sm font-medium pr-4">{faq.q}</span>
                <span className={`text-gold-400 text-lg transition-transform duration-200 flex-shrink-0 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                <p className="px-6 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Still need help? */}
      <div className="mt-8 bg-dark-800 rounded-xl border border-gray-800 p-6 text-center">
        <p className="text-gray-400 mb-3 text-sm">Still need help?</p>
        <a
          href="/contact"
          className="inline-block px-6 py-2.5 bg-gold-500 text-dark-900 font-semibold rounded-lg hover:bg-gold-400 transition text-sm"
        >
          Contact Us →
        </a>
      </div>
    </div>
  );
}
