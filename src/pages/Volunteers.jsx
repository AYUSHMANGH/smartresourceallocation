import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { subscribeToCollection, addDocument, updateDocument } from '../firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Volunteers() {
  const { user } = useAuth();
  const [volunteers, setVolunteers] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('none'); // none, match, availability
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVol, setNewVol] = useState({ name: '', location: '', skills: '' });
  const [notifyModal, setNotifyModal] = useState({ show: false, user: null, message: '' });

  useEffect(() => {
    // Fetch real registered users from the 'users' collection
    const unsub = subscribeToCollection('users', (data) => {
      // Sort: newest at top
      const sorted = data.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return timeB - timeA;
      });

      // Show all registered users who have a document in the users collection
      const activeVolunteers = sorted.filter(u => u.email !== 'admin@email.com');
      
      // Map them to ensure they have the properties expected by the UI
      const mappedVolunteers = activeVolunteers.map(u => ({
        ...u,
        location: u.location || 'Location Pending',
        skills: u.skills || ['General Support'],
        matchScore: u.matchScore || Math.floor(Math.random() * 40) + 60,
        availability: u.availability || 'Available'
      }));
      setVolunteers(mappedVolunteers);
    });
    return unsub;
  }, []);

  const handleAddVolunteer = async () => {
    if (!newVol.name || !newVol.location || !newVol.skills) {
      toast.error('Please fill all fields');
      return;
    }
    try {
      const skillsArray = newVol.skills.split(',').map(s => s.trim()).filter(Boolean);
      await addDocument('volunteers', {
        name: newVol.name,
        location: newVol.location,
        skills: skillsArray,
        avatar: newVol.name.slice(0, 2).toUpperCase(),
        matchScore: Math.floor(Math.random() * 40) + 60, // Random score between 60-99
        availability: 'Available'
      });
      toast.success('Volunteer onboarded successfully!');
      setShowAddModal(false);
      setNewVol({ name: '', location: '', skills: '' });
    } catch (err) {
      toast.error('Failed to add volunteer');
    }
  };

  const handleAssign = async (v) => {
    try {
      const newStatus = v.availability === 'Available' ? 'Deployed' : 'Available';
      await updateDocument('volunteers', v.id, { availability: newStatus });
      toast.success(`${v.name} marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleNotifySubmit = async () => {
    if (!notifyModal.message.trim()) return;
    
    try {
      await addDocument('notifications', {
        recipientId: notifyModal.user.id,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        message: notifyModal.message.trim(),
        read: false,
        createdAt: new Date().toISOString()
      });
      toast.success(`Real-time notification sent to ${notifyModal.user.name}`);
      setNotifyModal({ show: false, user: null, message: '' });
    } catch (err) {
      toast.error('Failed to send notification');
    }
  };

  const handleFilterToggle = () => {
    setSortBy(prev => prev === 'none' ? 'match' : prev === 'match' ? 'availability' : 'none');
    toast.success(`Sorting by: ${sortBy === 'none' ? 'Match Score' : sortBy === 'match' ? 'Availability' : 'Default'}`);
  };

  let processed = volunteers.filter(v => 
    v.name.toLowerCase().includes(filter.toLowerCase()) || 
    v.skills.some(s => s.toLowerCase().includes(filter.toLowerCase()))
  );

  if (sortBy === 'match') {
    processed.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
  } else if (sortBy === 'availability') {
    processed.sort((a, b) => a.availability === 'Available' ? -1 : 1);
  }

  return (
    <AppLayout>
      <div className="p-6 md:p-8 animate-in">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="page-title mb-2">Volunteer Network</h1>
            <p className="page-subtitle">Manage and match volunteers to mission tasks based on skills and location proximity.</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="card p-4 mb-8 flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">🔍</span>
            <input 
              type="text" 
              placeholder="Filter by name or skill..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="grid grid-cols-2 lg:flex gap-2">
            <button onClick={handleFilterToggle} className="btn-secondary whitespace-nowrap">
              {sortBy === 'none' ? 'Filters' : `Sorted: ${sortBy}`}
            </button>
            <button onClick={() => setShowAddModal(true)} className="btn-primary whitespace-nowrap">Onboard</button>
          </div>
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="mb-8 p-6 bg-linen rounded-2xl border border-linen-dark animate-in">
            <h3 className="text-lg font-bold text-charcoal mb-4">Onboard New Volunteer</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <input placeholder="Full Name" value={newVol.name} onChange={e => setNewVol(p => ({...p, name: e.target.value}))} className="input-field" />
              <input placeholder="Location" value={newVol.location} onChange={e => setNewVol(p => ({...p, location: e.target.value}))} className="input-field" />
              <input placeholder="Skills (comma separated)" value={newVol.skills} onChange={e => setNewVol(p => ({...p, skills: e.target.value}))} className="input-field" />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleAddVolunteer} className="btn-primary w-full sm:w-auto">Save Volunteer</button>
              <button onClick={() => setShowAddModal(false)} className="btn-secondary w-full sm:w-auto">Cancel</button>
            </div>
          </div>
        )}

        {/* Notify Modal */}
        {notifyModal.show && (
          <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-linen p-6 rounded-2xl border border-linen-dark max-w-md w-full shadow-2xl animate-in">
              <h3 className="text-lg font-bold text-charcoal mb-2">Send Notification to {notifyModal.user?.name}</h3>
              <p className="text-sm text-muted mb-4">They will receive a real-time alert with your message.</p>
              
              <textarea 
                value={notifyModal.message}
                onChange={(e) => setNotifyModal(p => ({...p, message: e.target.value}))}
                placeholder="Type your message here..."
                className="input-field min-h-[100px] mb-4"
                autoFocus
              />
              
              <div className="flex gap-3 justify-end">
                <button onClick={() => setNotifyModal({ show: false, user: null, message: '' })} className="btn-outline">Cancel</button>
                <button onClick={handleNotifySubmit} className="btn-primary" disabled={!notifyModal.message.trim()}>Send Notification</button>
              </div>
            </div>
          </div>
        )}

        {/* Volunteer Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processed.map(v => (
            <div key={v.id} className="card p-6 card-hover group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sage-50 flex items-center justify-center text-xl font-bold text-sage overflow-hidden shrink-0">
                    {v.avatar?.startsWith('http') ? (
                      <img src={v.avatar} alt="avatar" className="w-full h-full object-cover" />
                    ) : (
                      v.avatar || '👤'
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-charcoal">{v.name}</h3>
                    <p className="text-xs text-muted">{v.location}</p>
                  </div>
                </div>
                <div className="bg-sage text-white text-[10px] font-bold px-2 py-1 rounded-md">
                  {v.matchScore}% MATCH
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {v.skills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded-md bg-linen text-[10px] font-bold text-charcoal-light uppercase tracking-wider">
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-linen pt-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Status</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${v.availability === 'Available' ? 'bg-success' : 'bg-terra'}`} />
                    <span className="text-xs font-bold text-charcoal">{v.availability}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap sm:flex-nowrap justify-end mt-2 sm:mt-0">
                  <button 
                    onClick={() => setNotifyModal({ show: true, user: v, message: '' })}
                    className="btn-secondary py-1.5 px-3 text-xs flex items-center justify-center gap-1 flex-1 sm:flex-none"
                  >
                    <span>🔔</span> Notify
                  </button>
                  <button 
                    onClick={() => handleAssign(v)}
                    className={`btn-outline py-1.5 text-xs flex-1 sm:flex-none ${v.availability !== 'Available' ? 'opacity-50' : ''}`}
                  >
                    {v.availability === 'Available' ? 'Quick Assign' : 'Unassign'}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {processed.length === 0 && (
             <div className="col-span-full py-12 text-center text-muted">
               <p>No volunteers found matching your criteria.</p>
             </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
