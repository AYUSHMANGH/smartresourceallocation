import React from 'react';
import { useNavigate } from 'react-router-dom';
import Chatbot from '../components/chatbot/Chatbot';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="bg-white font-manrope min-h-screen overflow-x-hidden selection:bg-sage selection:text-white relative">
      {/* Background Decorative Glass Blobs */}
      <div className="absolute top-[10%] -left-20 w-96 h-96 bg-sage/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[40%] -right-20 w-[500px] h-[500px] bg-terra/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass border-b border-linen-dark/50 px-6 py-4 md:px-12">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-charcoal tracking-tight">ResilienceNet</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Community Needs', 'Volunteer Matching', 'Impact Stories'].map(item => (
            <a key={item} href="#" className="text-sm font-semibold text-muted hover:text-charcoal transition-colors">
              {item}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="w-8 h-8 rounded-full bg-linen flex items-center justify-center text-muted">👤</button>
          <button onClick={() => navigate('/login')} className="bg-charcoal text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-charcoal-light transition-all active:scale-95 shadow-lg shadow-charcoal/10">
            Get Involved
          </button>
        </div>
      </div>
    </nav>

      {/* Hero Section */}
      <section className="px-6 md:px-12 max-w-7xl mx-auto pt-12 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="animate-in">
          <h1 className="text-5xl md:text-7xl font-extrabold text-charcoal leading-[1.1] tracking-tight mb-6">
            Turn Scattered <br />
            Data into <span className="text-terra">Social <br /> Impact</span>
          </h1>
          <p className="text-lg text-muted max-w-md leading-relaxed mb-10">
            Bridging the gap between community needs and resources through warm technology and human connection.
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <button 
              onClick={() => navigate('/login')} 
              className="bg-sage-dark text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-sage/20 hover:bg-sage transition-all active:scale-95"
            >
              Start Allocating
            </button>
            <button className="flex items-center gap-3 text-charcoal font-bold group">
              <span className="w-12 h-12 rounded-full border border-linen-dark flex items-center justify-center group-hover:bg-linen transition-colors">▶</span>
              Watch the Story
            </button>
          </div>
        </div>
        <div className="relative animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="rounded-3xl overflow-hidden shadow-2xl relative z-10">
            <img 
              src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200" 
              alt="Team collaborating" 
              className="w-full h-auto"
            />
          </div>
          {/* Floating stat card from design */}
          <div className="absolute -bottom-8 -left-8 glass p-6 rounded-2xl shadow-xl z-20 max-w-[200px] animate-pulse-soft">
            <p className="text-xs font-bold text-terra uppercase tracking-widest mb-1">Live Matches</p>
            <p className="text-2xl font-extrabold text-charcoal">1,248</p>
            <p className="text-[10px] text-muted mt-1">In the last 72 hours</p>
          </div>
        </div>
      </section>

      {/* Choice Section (Admin vs Volunteer) */}
      <section className="bg-linen py-24">
        <div className="px-6 md:px-12 max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-extrabold text-charcoal mb-4 tracking-tight">Ready to join the network?</h2>
          <p className="text-muted text-lg max-w-2xl mx-auto">Choose your entry point to start making a difference in your community today.</p>
        </div>
        <div className="px-6 md:px-12 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Volunteer Option */}
          <div className="glass p-10 border border-linen-dark hover:border-sage transition-all hover:shadow-2xl group cursor-pointer" onClick={() => navigate('/login')}>
            <div className="w-16 h-16 rounded-2xl bg-sage/20 text-sage text-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">👥</div>
            <h3 className="text-2xl font-bold text-charcoal mb-3">Join as Volunteer</h3>
            <p className="text-muted text-sm leading-relaxed mb-8">Sign up using your Google account to browse needs, match with missions, and track your individual impact.</p>
            <span className="text-sage font-extrabold flex items-center gap-2 group-hover:translate-x-2 transition-transform">Volunteer Sign Up <span>→</span></span>
          </div>

          {/* Admin Option */}
          <div className="glass-dark p-10 hover:shadow-2xl group cursor-pointer" onClick={() => navigate('/login')}>
            <div className="w-16 h-16 rounded-2xl bg-white/10 text-white text-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">🛡️</div>
            <h3 className="text-2xl font-bold text-white mb-3">Join as Admin</h3>
            <p className="text-white/60 text-sm leading-relaxed mb-8">Access the Global Governance dashboard to manage the NGO ecosystem, coordinate regions, and oversee operations.</p>
            <span className="text-terra font-extrabold flex items-center gap-2 group-hover:translate-x-2 transition-transform">Admin Dashboard <span>→</span></span>
          </div>
        </div>
      </section>

      {/* Features Section (Image 3 middle part) */}
      <section className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-6 bg-surface border border-linen-dark">
              <span className="text-2xl mb-4 block">📄</span>
              <h4 className="font-bold text-charcoal text-sm">Paper Forms</h4>
              <p className="text-xs text-muted mt-2">Intelligent scanning turns handwritten data into digital insights.</p>
            </div>
            <div className="card p-6 bg-surface border border-linen-dark md:translate-y-8">
              <span className="text-2xl mb-4 block">📱</span>
              <h4 className="font-bold text-charcoal text-sm">Digital Portal</h4>
              <p className="text-xs text-muted mt-2">Simple, accessible entry for mobile-first communities.</p>
            </div>
            <div className="card p-6 bg-surface border border-linen-dark md:-translate-y-8">
              <span className="text-2xl mb-4 block">💬</span>
              <h4 className="font-bold text-charcoal text-sm">Oral Surveys</h4>
              <p className="text-xs text-muted mt-2">Voice-to-data capture for inclusive community outreach.</p>
            </div>
            <div className="card p-6 bg-sage-dark text-white border-none">
              <p className="text-xs italic opacity-80 leading-relaxed">
                "It felt like our voices were finally heard, not just processed."
              </p>
              <p className="text-[10px] font-bold mt-4 tracking-widest opacity-60">— Local Community Leader</p>
            </div>
          </div>
          <div>
            <p className="section-label text-terra mb-2">DIGITAL INTAKE</p>
            <h2 className="text-5xl font-extrabold text-charcoal leading-tight mb-6">From Surveys to <br /> Insights</h2>
            <p className="text-muted leading-relaxed mb-8">
              We believe every request for help is a story, not a row in a spreadsheet. Our system graciously inputs handwritten notes, phone conversations, and digital forms — normalizing messy human data into actionable opportunities for connection.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm font-bold text-charcoal"><span className="text-sage">✦</span> OCR handwriting recognition with human verification</li>
              <li className="flex items-center gap-3 text-sm font-bold text-charcoal"><span className="text-sage">✦</span> Sentiment-aware categorization of priority needs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Matching Section */}
      <section className="bg-linen py-32 overflow-hidden">
        <div className="px-6 md:px-12 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-charcoal tracking-tight mb-4">Intelligent Resource Allocation</h2>
            <p className="text-muted text-lg">Matching the heart of the community with the hands ready to help.</p>
          </div>

          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3 card p-10 bg-white border border-linen-dark flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-charcoal mb-4">Precision Matchmaking</h3>
                <p className="text-sm text-muted leading-relaxed max-w-md">Our algorithms don't just find the nearest resource; they find the most sustainable one, considering skillsets, proximity, and urgency.</p>
              </div>
              <div className="mt-12">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Active Matchmaking Pulse</span>
                  <span className="text-[10px] font-bold text-sage">OPTIMIZED</span>
                </div>
                <div className="h-10 w-full flex gap-1 items-end">
                   <div className="bg-sage-light h-[40%] flex-1 rounded-sm" />
                   <div className="bg-sage-dark h-[80%] flex-1 rounded-sm" />
                   <div className="bg-sage h-[60%] flex-1 rounded-sm" />
                   <div className="bg-terra h-[90%] flex-1 rounded-sm" />
                   <div className="bg-linen-dark h-[30%] flex-1 rounded-sm" />
                </div>
              </div>
            </div>
            <div className="md:col-span-2 card p-10 bg-terra text-white flex flex-col items-center justify-center text-center">
               <span className="text-5xl mb-6">🤝</span>
               <h3 className="text-4xl font-extrabold mb-2">98% Efficient</h3>
               <p className="text-white/70 text-sm leading-relaxed">Reduction in administrative waste when matching volunteers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ready CTA */}
      <section className="py-40">
        <div className="px-6 md:px-12 max-w-4xl mx-auto text-center bg-sage-dark rounded-[40px] p-20 text-white shadow-3xl shadow-sage/20 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-5xl font-extrabold mb-6 tracking-tight leading-tight">Ready to Build a <br /> Resilient Future?</h2>
            <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join 500+ community organizations using ResilienceNet to humanize their resource allocation.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={() => navigate('/login')} className="bg-white text-sage-dark px-10 py-4 rounded-xl text-lg font-bold hover:bg-linen transition-all">
                Request a Demo
              </button>
              <button className="bg-transparent border border-white/30 text-white px-10 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-all">
                Contact Support
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-terra/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-linen py-20 px-6 md:px-12 border-t border-linen-dark">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <span className="text-xl font-extrabold text-charcoal tracking-tight">ResilienceNet</span>
            <p className="text-sm text-muted mt-4 max-w-xs leading-relaxed">
              Helping communities bridge the gap with empathy and intelligent technology.
            </p>
          </div>
          <div>
            <h5 className="font-bold text-charcoal text-sm mb-4 uppercase tracking-widest">Resources</h5>
            <ul className="space-y-3 text-sm text-muted">
              <li><a href="#" className="hover:text-sage transition-colors">Community Help</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Volunteer Handbook</a></li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold text-charcoal text-sm mb-4 uppercase tracking-widest">Support</h5>
            <ul className="space-y-3 text-sm text-muted">
              <li><a href="#" className="hover:text-sage transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-sage transition-colors">Help Center</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-linen-dark flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">© 2024 ResilienceNet Community. Built for human connection.</span>
          <div className="flex gap-6">
            {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
              <a key={social} href="#" className="text-[10px] font-bold text-muted hover:text-sage uppercase tracking-widest">{social}</a>
            ))}
          </div>
        </div>
      </footer>

      <Chatbot />
    </div>
  );
}
