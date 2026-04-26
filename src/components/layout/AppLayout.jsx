import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { signOut } from '../../firebase/auth';
import { subscribeToCollection, updateDocument } from '../../firebase/firestore';
import toast from 'react-hot-toast';
import Chatbot from '../chatbot/Chatbot';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '⊞' },
  { to: '/needs', label: 'Needs', icon: '📋' },
  { to: '/volunteers', label: 'Volunteers', icon: '👥' },
  { to: '/tasks', label: 'Tasks', icon: '✓' },
  { to: '/analytics', label: 'Reports', icon: '📊' },
];

export default function AppLayout({ children }) {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToCollection('notifications', (data) => {
      const myNotifs = data
        .filter(n => n.recipientId === user.uid)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(myNotifs);
    });
    return unsub;
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const markAsRead = async (id) => {
    await updateDocument('notifications', id, { read: true });
  };

  const initials = user?.displayName
    ? user.displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() || 'U';

  return (
    <div className="flex min-h-screen bg-linen font-manrope">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface flex flex-col py-6 px-4 shadow-2xl transition-transform transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:w-52 md:border-r md:border-linen-dark md:shadow-none`}>
        {/* Logo */}
        <div className="mb-8 px-2">
          <span className="text-lg font-extrabold text-charcoal tracking-tight">ResilienceNet</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-sage animate-pulse-soft"></span>
            <span className="text-xs text-muted">Global Relief · Regional</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
              }
            >
              <span className="text-base">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}

          {isAdmin && (
            <NavLink
              to="/governance"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}
            >
              <span className="text-base">🛡️</span>
              <span>Governance</span>
            </NavLink>
          )}
        </nav>

        {/* Post Need CTA */}
        <button
          onClick={() => { navigate('/needs'); setMobileOpen(false); }}
          className="btn-terra w-full mb-4 flex items-center justify-center gap-2"
        >
          <span className="text-lg">+</span> Post Need
        </button>

        {/* Bottom links */}
        <div className="flex flex-col gap-1 border-t border-linen-dark pt-4">
          <NavLink to="/insights" onClick={() => setMobileOpen(false)} className={({ isActive }) => `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`}>
            <span>🤖</span><span>AI Insights</span>
          </NavLink>
          <button onClick={handleSignOut} className="sidebar-link text-left">
            <span>↗</span><span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="bg-surface/70 backdrop-blur-lg border-b border-linen-dark px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 md:gap-6">
            <button
              className="md:hidden text-2xl text-charcoal hover:text-sage transition-colors pb-1"
              onClick={() => setMobileOpen(true)}
            >
              ☰
            </button>
            <span className="text-base font-extrabold text-charcoal md:hidden">ResilienceNet</span>
            <nav className="hidden md:flex items-center gap-6">
              {[
                { label: 'Dashboard', path: '/dashboard' },
                { label: 'Insights', path: '/insights' },
                { label: 'Network', path: '/volunteers' }
              ].map(item => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `text-sm font-semibold pb-1 transition-colors ${isActive ? 'text-charcoal border-b-2 border-charcoal' : 'text-muted hover:text-charcoal'}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/needs')}
              className="btn-primary hidden sm:flex items-center gap-2"
            >
              Volunteer
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 rounded-full bg-linen flex items-center justify-center text-muted hover:bg-linen-dark transition-colors relative"
              >
                🔔
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-terra rounded-full border-2 border-surface"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute top-12 right-0 w-80 bg-surface rounded-2xl shadow-xl border border-linen-dark overflow-hidden z-50">
                  <div className="p-4 border-b border-linen-dark bg-linen">
                    <h3 className="font-bold text-charcoal">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-muted text-sm">No new notifications</div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => { if (!n.read) markAsRead(n.id) }}
                          className={`p-4 border-b border-linen cursor-pointer hover:bg-linen transition-colors ${!n.read ? 'bg-sage-50/50' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-sm text-charcoal">{n.senderName}</span>
                            {!n.read && <span className="w-2 h-2 bg-terra rounded-full"></span>}
                          </div>
                          <p className="text-xs text-muted">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button className="w-9 h-9 rounded-full bg-linen flex items-center justify-center text-muted hover:bg-linen-dark transition-colors">
              ?
            </button>
            <div className="flex items-center gap-3 ml-2">
              <span className="text-sm font-semibold text-charcoal hidden sm:block">
                {isAdmin ? 'Hi Admin' : `Hi, ${user?.displayName?.split(' ')[0] || 'User'}`}
              </span>
              <div className="w-9 h-9 rounded-full bg-sage flex items-center justify-center text-white text-sm font-bold overflow-hidden border border-linen-dark">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  isAdmin ? 'A' : initials
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Floating AI Chatbot */}
      <Chatbot />
    </div>
  );
}
