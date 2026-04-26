import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../firebase/auth';
import toast from 'react-hot-toast';

const adminNavItems = [
  { to: '/governance', label: 'Users', icon: '👤' },
  { to: '/governance/permissions', label: 'Permissions', icon: '🛡️' },
  { to: '/governance/settings', label: 'Settings', icon: '⚙️' },
  { to: '/governance/logs', label: 'Logs', icon: '📋' },
  { to: '/governance/connect', label: 'Connect', icon: '🔗' },
];

export default function AdminLayout({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-linen font-manrope">
      {/* Admin Sidebar */}
      <aside className="w-48 shrink-0 bg-surface flex flex-col py-6 px-4 border-r border-linen-dark">
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
        <header className="bg-surface border-b border-linen-dark px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search system..."
                className="bg-linen rounded-xl px-4 py-2 text-sm text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-sage w-56"
              />
            </div>
            <nav className="flex items-center gap-5">
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
                <p className="text-xs font-bold text-charcoal">{user?.displayName || 'Alex Rivera'}</p>
                <p className="text-xs text-muted">SUPER ADMIN</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-terra flex items-center justify-center text-white text-sm font-bold">
                AR
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
