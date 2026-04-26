import React, { useState, useRef, useEffect } from 'react';
import { useGemini } from '../../hooks/useGemini';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hello! I am your ResilienceNet assistant. How can I help you today?' }
  ]);
  const { askGemini, response, loading } = useGemini();
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, response]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');

    const context = "You are the ResilienceNet AI assistant. ResilienceNet is an NGO management platform for smart resource allocation. You help volunteers sign up, explain how the needs assessment scoring works, and guide admins to the governance panel. Keep answers brief, warm, and helpful.";
    await askGemini(userMessage, context);
  };

  useEffect(() => {
    if (response !== null && !loading) {
      setMessages(prev => [...prev, { role: 'ai', text: response }]);
    }
  }, [response, loading]);

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-manrope">
      {/* Floating Bubble */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 rounded-full bg-sage shadow-2xl flex items-center justify-center text-3xl hover:scale-110 transition-transform active:scale-95 group relative"
      >
        <span className="relative z-10 text-2xl">{isOpen ? '✕' : '🤖'}</span>
        {!isOpen && <span className="absolute inset-0 rounded-full bg-sage animate-ping opacity-20" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 w-[380px] h-[520px] glass-dark rounded-3xl overflow-hidden shadow-3xl animate-in flex flex-col border border-white/10">
          {/* Header */}
          <div className="bg-sage p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center text-white">🤖</div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-widest">ResilienceNet AI</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
                <span className="text-[10px] text-white/80 font-bold">Online & Ready</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-charcoal/40 backdrop-blur-xl">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-sage text-white rounded-br-none' 
                    : 'bg-white/10 text-white rounded-bl-none border border-white/5'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 text-white px-4 py-2.5 rounded-2xl rounded-bl-none border border-white/5">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-charcoal/60 border-t border-white/5 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-sage transition-colors"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-sage text-white w-10 h-10 rounded-xl flex items-center justify-center hover:bg-sage-dark transition-colors disabled:opacity-50"
            >
              ➔
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
