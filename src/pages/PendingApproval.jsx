import React from 'react';
import { useAuth } from '../context/AuthContext';
import { signOut } from '../firebase/auth';
import { useNavigate } from 'react-router-dom';

export default function PendingApproval() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-linen flex items-center justify-center p-6">
      <div className="max-w-md w-full glass p-10 text-center animate-in">
        <div className="w-20 h-20 bg-sage/20 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 animate-pulse">
          ⏳
        </div>
        <h1 className="text-3xl font-extrabold text-charcoal mb-4">Application Pending</h1>
        <p className="text-muted leading-relaxed mb-8">
          Welcome to ResilienceNet, <span className="text-charcoal font-bold">{user?.profileName || 'Volunteer'}</span>! 
          Your application is currently under review by our Global Governance team.
        </p>
        <div className="bg-white/50 rounded-2xl p-6 border border-white/50 text-left mb-8">
          <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-3">What's Next?</h3>
          <ul className="space-y-3">
            <li className="flex items-center gap-3 text-xs font-bold text-charcoal">
              <span className="w-5 h-5 rounded-full bg-sage text-white flex items-center justify-center text-[10px]">1</span>
              Admin reviews your profile
            </li>
            <li className="flex items-center gap-3 text-xs font-bold text-muted opacity-50">
              <span className="w-5 h-5 rounded-full bg-linen-dark text-muted flex items-center justify-center text-[10px]">2</span>
              Email notification sent upon approval
            </li>
            <li className="flex items-center gap-3 text-xs font-bold text-muted opacity-50">
              <span className="w-5 h-5 rounded-full bg-linen-dark text-muted flex items-center justify-center text-[10px]">3</span>
              Full access to missions granted
            </li>
          </ul>
        </div>
        <button 
          onClick={handleLogout}
          className="btn-outline w-full py-4 text-sm font-bold uppercase tracking-widest"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
