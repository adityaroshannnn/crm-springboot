import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Greetings. I am the Archive Concierge. How may I be of service to you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    try {
      const resp = await axios.post('/api/chat', { message: userMsg });
      setMessages(prev => [...prev, { from: 'bot', text: resp.data.response }]);
    } catch {
      setMessages(prev => [...prev, { from: 'bot', text: 'I apologize, I am unable to respond at this moment.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-r from-gold-500 to-gold-400 text-dark-900 rounded-full shadow-2xl shadow-gold-500/30 flex items-center justify-center text-xl hover:scale-110 transition-transform"
        title="Chat with Concierge"
      >
        {open ? '✕' : '💬'}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-dark-800 rounded-2xl border border-gold-400/20 shadow-2xl flex flex-col overflow-hidden animate-fade-in-up" style={{ maxHeight: '480px' }}>
          {/* Header */}
          <div className="bg-dark-900 px-5 py-3 border-b border-gold-400/20 flex items-center gap-3">
            <span className="text-xl">✦</span>
            <div>
              <h4 className="text-gold-400 font-serif text-sm font-semibold">Archive Concierge</h4>
              <p className="text-gray-500 text-[10px]">Ask about shipping, returns, payments...</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: '320px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.from === 'user'
                    ? 'bg-gold-500/20 text-gold-100 rounded-br-sm'
                    : 'bg-dark-900 text-gray-300 border border-gray-800 rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-dark-900 border border-gray-800 px-4 py-2.5 rounded-2xl rounded-bl-sm text-gray-500 text-sm animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            <div ref={messagesEnd} />
          </div>

          {/* Input */}
          <form onSubmit={sendMessage} className="p-3 border-t border-gray-800 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-dark-900 border border-gray-700/50 rounded-full px-4 py-2 text-sm text-white focus:border-gold-400 outline-none"
            />
            <button type="submit" disabled={loading} className="bg-gold-500 text-dark-900 w-9 h-9 rounded-full flex items-center justify-center font-bold hover:bg-gold-400 transition text-sm disabled:opacity-50">
              →
            </button>
          </form>
        </div>
      )}
    </>
  );
}
