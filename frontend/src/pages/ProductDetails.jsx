import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewMsg, setReviewMsg] = useState('');

  const [quantity, setQuantity] = useState(1);
  const [purchaseMsg, setPurchaseMsg] = useState('');
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    axios.get(`/api/shop/product/${id}`, { withCredentials: true })
      .then(res => setData(res.data))
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    setReviewMsg('');
    try {
      const resp = await axios.post(`/api/shop/product/${id}/review`, { rating, comment }, { withCredentials: true });
      if (resp.data.success) {
        setData({ ...data, reviews: [...data.reviews, resp.data.review] });
        setComment('');
        setReviewMsg('Review submitted!');
      }
    } catch (err) {
      setReviewMsg(err.response?.data?.error || 'Failed to submit review. Please log in first.');
    }
  };

  // Razorpay Payment Integration
  const handlePurchase = async () => {
    setPurchaseMsg('');
    setPurchasing(true);
    const totalAmount = data.product.price * quantity;

    try {
      // Step 1: Create Razorpay order via backend
      const orderResp = await axios.post('/api/payment/create_order', {
        amount: totalAmount
      }, { withCredentials: true });

      const { orderId, amount, currency } = orderResp.data;

      // Step 2: Open Razorpay checkout popup
      const options = {
        key: 'rzp_test_SV8cmNnuK8iYHK', // Your Razorpay test key
        amount: amount,
        currency: currency,
        name: 'CRM Shop',
        description: `Purchase: ${data.product.name} x${quantity}`,
        order_id: orderId,
        handler: async function (response) {
          // Step 3: On successful payment, complete the purchase
          try {
            const purchaseResp = await axios.post('/api/shop/purchase', {
              productId: id,
              quantity,
              razorpay_payment_id: response.razorpay_payment_id
            }, { withCredentials: true });

            if (purchaseResp.data.success) {
              setPurchaseMsg('✅ Payment successful! Order #' + purchaseResp.data.order.id);
              const updated = await axios.get(`/api/shop/product/${id}`, { withCredentials: true });
              setData(updated.data);
            }
          } catch (err) {
            setPurchaseMsg(err.response?.data?.error || 'Purchase failed after payment.');
          }
          setPurchasing(false);
        },
        modal: {
          ondismiss: function () {
            setPurchaseMsg('Payment cancelled.');
            setPurchasing(false);
          }
        },
        prefill: {},
        theme: { color: '#d4af37' }
      };

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      setPurchaseMsg(err.response?.data?.error || 'Failed to create payment order.');
      setPurchasing(false);
    }
  };

  if (loading) return <div className="text-center py-20 text-gold-400 animate-pulse">Loading...</div>;
  if (error || !data) return <div className="text-center py-20 text-red-400">{error}</div>;

  const { product, reviews } = data;

  return (
    <div className="max-w-5xl mx-auto animate-fade-in-up">
      <button onClick={() => navigate('/shop')} className="text-gold-400 hover:text-gold-300 mb-8 flex items-center gap-2 text-sm transition">
        ← Back to Shop
      </button>

      {/* Product Info */}
      <div className="bg-dark-800 rounded-2xl border border-gray-800 overflow-hidden flex flex-col md:flex-row mb-10">
        <div className="md:w-1/2 bg-dark-900 min-h-[380px] flex items-center justify-center border-r border-gray-800">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="text-gray-600 font-serif italic">No Image Available</div>
          )}
        </div>
        <div className="md:w-1/2 p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-serif text-white mb-3">{product.name}</h1>
            <p className="text-3xl text-gold-400 font-bold mb-5">₹{product.price}</p>
            <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>
            <div className="inline-block bg-dark-900/50 rounded-lg px-4 py-2 border border-gray-800 mb-6">
              <span className={`font-medium ${product.stock > 0 ? 'text-green-400' : 'text-red-400'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
              </span>
            </div>
          </div>
          
          {isLoggedIn && product.stock > 0 && (
            <div>
              {purchaseMsg && <div className={`text-sm mb-3 ${purchaseMsg.includes('✅') || purchaseMsg.includes('success') ? 'text-green-400' : 'text-red-400'}`}>{purchaseMsg}</div>}
              <div className="flex gap-3 items-end">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Qty</label>
                  <input type="number" min="1" max={product.stock} value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                    className="bg-dark-900 border border-gray-700 rounded-lg px-3 py-2.5 text-white w-20 focus:border-gold-400 outline-none" />
                </div>
                <button onClick={handlePurchase} disabled={purchasing}
                  className="flex-1 bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 font-bold py-2.5 rounded-lg transition hover:scale-[1.01] active:scale-95 shadow-lg shadow-gold-500/20 disabled:opacity-50">
                  {purchasing ? 'Processing...' : `Pay ₹${product.price * quantity}`}
                </button>
              </div>
            </div>
          )}
          {!isLoggedIn && (
            <p className="text-gray-500 text-sm"><a href="/login" className="text-gold-400">Log in</a> to purchase this product.</p>
          )}
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-dark-800 rounded-2xl p-8 border border-gray-800">
        <h3 className="text-2xl font-serif text-gold-400 mb-6">Reviews ({reviews.length})</h3>
        
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic mb-8">No reviews yet.</p>
        ) : (
          <div className="space-y-4 mb-8">
            {reviews.map((r, i) => (
              <div key={i} className="border-b border-gray-800 pb-4 last:border-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white text-sm font-medium">{r.customer?.email || 'User'}</span>
                  <span className="text-gold-500 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                </div>
                <p className="text-gray-400 text-sm">{r.comment}</p>
              </div>
            ))}
          </div>
        )}

        {isLoggedIn && (
          <div className="bg-dark-900 p-5 rounded-xl border border-gray-700/50">
            <h4 className="text-sm text-white mb-3 font-medium">Write a Review</h4>
            {reviewMsg && <div className={`text-sm mb-3 ${reviewMsg.includes('submitted') ? 'text-green-400' : 'text-red-400'}`}>{reviewMsg}</div>}
            <form onSubmit={submitReview} className="space-y-3">
              <select value={rating} onChange={e => setRating(e.target.value)} className="bg-dark-800 border border-gray-700 rounded-lg px-3 py-2 text-white w-full outline-none focus:border-gold-400 text-sm">
                <option value="5">★★★★★ Excellent</option>
                <option value="4">★★★★☆ Very Good</option>
                <option value="3">★★★☆☆ Good</option>
                <option value="2">★★☆☆☆ Fair</option>
                <option value="1">★☆☆☆☆ Poor</option>
              </select>
              <textarea required value={comment} onChange={e => setComment(e.target.value)} rows="2"
                className="w-full bg-dark-800 border border-gray-700 rounded-lg p-3 text-white outline-none focus:border-gold-400 text-sm" placeholder="Your review..." />
              <button type="submit" className="bg-white text-dark-900 px-5 py-2 rounded-lg font-medium text-sm hover:bg-gray-200 transition">
                Submit
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
