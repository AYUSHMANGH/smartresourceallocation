import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateDocument } from '../firebase/firestore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Onboarding() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.profileName || '');
  const [skills, setSkills] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter your name');
    
    setLoading(true);
    try {
      await updateDocument('users', user.uid, {
        name,
        skills: skills.split(',').map(s => s.trim()),
        status: 'pending' // Move to pending after onboarding
      });
      toast.success('Profile updated! Awaiting verification.');
      // Refreshing the page or state will cause RouteGuards to redirect to /pending
      window.location.href = '/pending';
    } catch (err) {
      toast.error('Failed to update profile');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linen flex items-center justify-center p-6">
      <div className="max-w-md w-full glass p-10 animate-in">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-sage/20 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">✍️</div>
          <h1 className="text-2xl font-extrabold text-charcoal">Complete Your Profile</h1>
          <p className="text-sm text-muted">Help us get to know you better, {user?.displayName?.split(' ')[0]}.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="section-label mb-2 block">Full Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field py-3"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="section-label mb-2 block">Skills (Comma separated)</label>
            <input 
              type="text" 
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="input-field py-3"
              placeholder="e.g. First Aid, Logistics, Translation"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
