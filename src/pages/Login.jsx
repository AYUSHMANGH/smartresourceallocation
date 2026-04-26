import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInAdmin } from '../firebase/auth';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success('Welcome, Volunteer!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminLoading(true);
    try {
      await signInAdmin(adminEmail, adminPassword);
      toast.success('Welcome back, Admin!');
      navigate('/governance');
    } catch (err) {
      toast.error('Invalid admin credentials');
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linen flex items-center justify-center p-4 font-manrope">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-sage opacity-10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-terra opacity-10 blur-3xl" />
      </div>

      <div className="w-full max-w-4xl relative animate-in">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-2xl font-extrabold text-charcoal tracking-tight">ResilienceNet</span>
          <p className="text-muted text-sm mt-1">Smart Resource Allocation System</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Volunteer Login Card */}
          <div className="card p-8 flex flex-col gap-6 card-hover border border-linen-dark">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-sage-50 flex items-center justify-center text-2xl mb-4">👥</div>
              <h2 className="text-xl font-bold text-charcoal">Volunteer Access</h2>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Join the network. Sign in with your Google account to access the volunteer dashboard, submit needs, and track impact.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="text-sage">✓</span> Access community needs board
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="text-sage">✓</span> Submit field reports
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="text-sage">✓</span> Track task missions
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <span className="text-sage">✓</span> View AI-powered insights
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-linen-dark rounded-xl py-3 px-4 text-sm font-semibold text-charcoal hover:bg-linen transition-all duration-200 hover:shadow-card active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-sage border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              Sign in with Google
            </button>
          </div>

          {/* Admin Login Card */}
          <div className="card p-8 flex flex-col gap-6 border border-charcoal border-opacity-10" style={{ background: 'rgba(107,127,94,0.06)' }}>
            <div>
              <div className="w-12 h-12 rounded-2xl bg-charcoal flex items-center justify-center text-2xl mb-4">🔐</div>
              <h2 className="text-xl font-bold text-charcoal">Admin Access</h2>
              <p className="text-sm text-muted mt-1 leading-relaxed">
                Restricted to authorized administrators. Manage users, roles, system configuration, and governance.
              </p>
            </div>

            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-charcoal-light mb-1.5 block">Email Address</label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={e => setAdminEmail(e.target.value)}
                  placeholder="admin@email.com"
                  className="input-field"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal-light mb-1.5 block">Password</label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={adminLoading}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                {adminLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : '🛡️'}
                Sign in as Admin
              </button>
            </form>

            <p className="text-xs text-muted text-center">
              All admin actions are logged and audited
            </p>

            <button 
              type="button"
              onClick={async () => {
                const { seedInitialData } = await import('../firebase/firestore');
                await seedInitialData();
                toast.success('Database seeded with UI data!');
              }}
              className="text-[10px] text-muted hover:text-sage transition-colors underline uppercase tracking-widest mt-4"
            >
              Seed UI Demo Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted mt-8">
          ResilienceNet © 2024 · Building stronger communities through technology
        </p>
      </div>
    </div>
  );
}
