import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../firebase/auth';
import toast from 'react-hot-toast';
import Chatbot from '../chatbot/Chatbot';

const adminNavItems = [
  { to: '/governance', label: 'Users', icon: '👤' },
  { to: '/governance/permissions', label: 'Permissions', icon: '🛡️' },
  { to: '/governance/settings', label: 'Settings', icon: '⚙️' },
  { to: '/governance/logs', label: 'Logs', icon: '📋' },
  { to: '/governance/connect', label: 'Indian View', icon: '🔗' },
];

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-linen font-manrope">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface flex flex-col py-6 px-4 shadow-2xl transition-transform transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-48 md:border-r md:border-linen-dark md:shadow-none`}>
        {/* Logo */}
        <div className="mb-8 px-2">
          <span className="text-lg font-extrabold text-charcoal tracking-tight">ResilienceNet</span>
          <p className="text-xs text-muted mt-0.5">Admin Console</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {adminNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/governance'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col gap-1 border-t border-linen-dark pt-4">
          <NavLink to="/dashboard" className="sidebar-link">
            <span>⊞</span><span>App View</span>
          </NavLink>
          <button className="sidebar-link text-left">
            <span>?</span><span>Support</span>
          </button>
          <button onClick={handleSignOut} className="sidebar-link text-left">
            <span>↗</span><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Topbar */}
        <header className="bg-surface border-b border-linen-dark px-4 md:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-2xl text-charcoal hover:text-sage transition-colors pb-1"
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search system..."
                className="bg-linen rounded-xl px-4 py-2 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-sage w-56"
              />
            </div>
            <nav className="hidden lg:flex items-center gap-5">
              {['User Management', 'Role Permissions', 'System Settings'].map(item => (
                <button key={item} className="text-sm font-semibold text-charcoal hover:text-sage transition-colors">
                  {item}
                </button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-8 h-8 rounded-full bg-linen flex items-center justify-center text-muted hover:bg-linen-dark transition-colors text-sm">
              🔔
            </button>
            <button className="w-8 h-8 rounded-full bg-linen flex items-center justify-center text-muted hover:bg-linen-dark transition-colors text-sm">
              ⚙️
            </button>
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs font-bold text-charcoal">Hi Admin</p>
                <p className="text-[10px] text-muted tracking-wider uppercase">SUPER ADMIN</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-terra flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Floating AI Chatbot */}
      <Chatbot />
    </div>
  );
}
