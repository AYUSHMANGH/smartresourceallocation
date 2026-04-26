import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { subscribeToCollection, addDocument, updateDocument } from '../firebase/firestore';
import { orderBy, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';
import { useAuth } from '../context/AuthContext';

const ROLE_ICONS = { field_worker: '🌿', coordinator: '🔗', administrator: '🛡️', auditor: '👁️' };
const ROLE_LABELS = { field_worker: 'FIELD WORKER', coordinator: 'COORDINATOR', administrator: 'ADMINISTRATOR', auditor: 'AUDITOR' };

export default function Governance() {
  const [users, setUsers] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'field_worker' });
  const [manageModal, setManageModal] = useState({ show: false, user: null, message: '' });
  const [escalationLevel, setEscalationLevel] = useState(4);
  const [activeTab, setActiveTab] = useState('users'); // users, applicants, logs
  const { user: currentUser } = useAuth();

  const location = useLocation();
  const path = location.pathname;

  const showUsers = path === '/governance' || path === '/governance/';
  const showPermissions = path === '/governance/permissions';
  const showSettings = path === '/governance/settings';
  const showLogs = path === '/governance/logs';
  const showConnect = path === '/governance/connect';

  useEffect(() => {
    const u1 = subscribeToCollection('users', (data) => {
      const sorted = data.sort((a, b) => {
        const timeA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(a.createdAt || 0);
        const timeB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(b.createdAt || 0);
        return timeB - timeA;
      });
      setUsers(sorted.filter(u => u.status !== 'pending'));
      setApplicants(sorted.filter(u => u.status === 'pending'));
    });
    const u2 = subscribeToCollection('audit_logs', setAuditLogs, [orderBy('createdAt', 'desc'), limit(6)]);
    return () => { u1(); u2(); };
  }, []);

  const displayUsers = users.length > 0 ? users : [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@resiliencenet.org', role: 'field_worker', status: 'active', avatar: 'SJ' },
    { id: 2, name: 'Mark Chen', email: 'm.chen@resiliencenet.org', role: 'coordinator', status: 'active', avatar: 'MC' },
    { id: 3, name: 'Elena Kovic', email: 'kovic.e@resiliencenet.org', role: 'administrator', status: 'inactive', avatar: 'EK' },
  ];

  const displayLogs = auditLogs.length > 0 ? auditLogs : [
    { id: 1, action: 'Permission Change', performedBy: 'Alex Rivera', details: 'Alex Rivera updated Field Worker scopes', severity: 'info', time: '14 mins ago' },
    { id: 2, action: 'New Account Provisioned', performedBy: 'Elena Kovic', details: 'Elena Kovic created a new Regional lead', severity: 'success', time: '2 hrs ago' },
    { id: 3, action: 'Global Config Update', performedBy: 'System', details: 'System wide API key rotation completed', severity: 'info', time: 'Yesterday' },
    { id: 4, action: 'Failed Login Attempt', performedBy: 'Unknown', details: 'Unauthorized access blocked from IP 192.168.1.1', severity: 'critical', time: 'Yesterday' },
  ];

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) { toast.error('Fill all fields'); return; }
    try {
      await addDocument('users', { ...newUser, status: 'active', avatar: newUser.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2), createdAt: new Date().toISOString() });
      toast.success('User added successfully');
      setShowAddUser(false);
      setNewUser({ name: '', email: '', role: 'field_worker' });
    } catch {
      toast.error('Failed to add user');
    }
  };

  const handleApprove = async (app) => {
    try {
      await updateDocument('users', app.id, { status: 'approved' });
      await addDocument('audit_logs', {
        action: 'Volunteer Verified',
        performedBy: 'Admin',
        details: `Approved application for ${app.name} (${app.email})`,
        severity: 'success',
        createdAt: { seconds: Date.now() / 1000 }
      });

      // Simulate Email Notification
      toast.success(`Welcome email sent to ${app.email}!`);
    } catch {
      toast.error('Approval failed');
    }
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      await updateDocument('users', manageModal.user.id, updatedData);
      toast.success('User updated successfully');
      setManageModal(p => ({ ...p, user: { ...p.user, ...updatedData } }));
    } catch {
      toast.error('Failed to update user');
    }
  };

  const handleSendAdminNotification = async () => {
    if (!manageModal.message.trim()) return;
    try {
      await addDocument('notifications', {
        recipientId: manageModal.user.id,
        senderId: currentUser?.uid || 'admin',
        senderName: 'System Administrator',
        message: manageModal.message.trim(),
        read: false,
        createdAt: new Date().toISOString()
      });
      toast.success(`Notification sent to ${manageModal.user.name}`);
      setManageModal(p => ({ ...p, message: '' }));
    } catch {
      toast.error('Failed to send notification');
    }
  };

  const timeAgo = (seconds) => {
    if (!seconds) return 'Just now';
    const diff = Date.now() / 1000 - seconds;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return 'Yesterday';
  };

  const handleExportAnalytics = () => {
    try {
      const exportData = users.map(u => ({
        ID: u.id,
        Name: u.name,
        Email: u.email,
        Role: u.role,
        Status: u.status,
        CreatedAt: u.createdAt || new Date().toISOString()
      }));
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Users Data");
      XLSX.writeFile(wb, "ResilienceNet_Analytics.xlsx");
      toast.success("Analytics exported successfully!");
    } catch (err) {
      toast.error("Failed to export analytics");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 animate-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="page-title">Global Governance</h1>
            <p className="page-subtitle mt-1 max-w-md">
              Coordinate NGO impact, manage field access, and monitor organizational resilience from a centralized command center.
            </p>
          </div>
          <button onClick={handleExportAnalytics} className="btn-primary flex items-center gap-2">
            ⬇ Export Analytics
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'TOTAL USERS', value: '12,482', badge: '+12%', badgeColor: 'text-terra', icon: '👤' },
            { label: 'ACTIVE ROLES', value: '18', badge: 'Fixed', badgeColor: 'text-muted', icon: '🛡️' },
            { label: 'PENDING APPROVALS', value: '43', badge: 'High Priority', badgeColor: 'text-critical', icon: '📋' },
            { label: 'SYSTEM HEALTH', value: '99.9%', badge: 'Stable', badgeColor: 'text-success', icon: '⚡', dark: true },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-5 shadow-card card-hover ${s.dark ? 'bg-sage' : 'bg-surface'}`}>
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.dark ? 'bg-white bg-opacity-20' : 'bg-linen'}`}>
                  {s.icon}
                </div>
                <span className={`text-xs font-bold ${s.dark ? 'text-white opacity-80' : s.badgeColor}`}>{s.badge}</span>
              </div>
              <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${s.dark ? 'text-white opacity-70' : 'text-muted'}`}>{s.label}</p>
              <p className={`text-3xl font-extrabold ${s.dark ? 'text-white' : 'text-charcoal'}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content Areas */}
        <div className="flex flex-col gap-6">
          {/* User Management */}
          {showUsers && (
            <div className="card p-6 min-h-[500px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2 sm:pb-0">
                  {['users', 'applicants'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-sm font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'text-sage border-b-2 border-sage' : 'text-muted hover:text-charcoal'}`}
                    >
                      {tab} {tab === 'applicants' && applicants.length > 0 && <span className="ml-1 bg-terra text-white px-1.5 py-0.5 rounded text-[10px]">{applicants.length}</span>}
                    </button>
                  ))}
                </div>
                <button onClick={() => setShowAddUser(true)} className="btn-primary text-xs py-2 px-4">+ ADD USER</button>
              </div>

              {/* Add User Form */}
              {showAddUser && (
                <div className="mb-5 p-4 bg-linen rounded-xl flex flex-col gap-3 animate-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <input placeholder="Full Name" value={newUser.name} onChange={e => setNewUser(p => ({ ...p, name: e.target.value }))} className="input-field text-xs py-2" />
                    <input placeholder="Email" value={newUser.email} onChange={e => setNewUser(p => ({ ...p, email: e.target.value }))} className="input-field text-xs py-2" />
                    <select value={newUser.role} onChange={e => setNewUser(p => ({ ...p, role: e.target.value }))} className="select-field text-xs py-2">
                      <option value="field_worker">Field Worker</option>
                      <option value="coordinator">Coordinator</option>
                      <option value="administrator">Administrator</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleAddUser} className="btn-primary text-xs py-1.5">Add User</button>
                    <button onClick={() => setShowAddUser(false)} className="btn-secondary text-xs py-1.5">Cancel</button>
                  </div>
                </div>
              )}

              {/* Manage User Modal */}
              {manageModal.show && manageModal.user && (
                <div className="fixed inset-0 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                  <div className="bg-linen p-6 rounded-2xl border border-linen-dark max-w-md w-full shadow-2xl animate-in">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-lg font-bold text-charcoal">Manage User</h3>
                        <p className="text-[10px] text-muted font-mono">ID: {manageModal.user.id}</p>
                        <p className="text-xs text-muted">{manageModal.user.email}</p>
                      </div>
                      <button onClick={() => setManageModal({ show: false, user: null, message: '' })} className="text-muted hover:text-charcoal font-bold">✕</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Role</label>
                        <select
                          value={manageModal.user.role}
                          onChange={(e) => handleUpdateUser({ role: e.target.value })}
                          className="select-field text-sm py-2"
                        >
                          <option value="field_worker">Field Worker</option>
                          <option value="coordinator">Coordinator</option>
                          <option value="administrator">Administrator</option>
                          <option value="auditor">Auditor</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted uppercase tracking-wider mb-1 block">Status</label>
                        <select
                          value={manageModal.user.status}
                          onChange={(e) => handleUpdateUser({ status: e.target.value })}
                          className="select-field text-sm py-2"
                        >
                          <option value="active">Active</option>
                          <option value="approved">Approved</option>
                          <option value="inactive">Inactive</option>
                          <option value="suspended">Suspended</option>
                        </select>
                      </div>
                    </div>

                    <div className="border-t border-linen-dark pt-5">
                      <label className="text-xs font-bold text-charcoal mb-2 block flex items-center gap-2"><span>🔔</span> Send Direct Notification</label>
                      <textarea
                        value={manageModal.message}
                        onChange={(e) => setManageModal(p => ({ ...p, message: e.target.value }))}
                        placeholder="Type an official message to this user..."
                        className="input-field min-h-[80px] mb-3 text-sm"
                      />
                      <button
                        onClick={handleSendAdminNotification}
                        disabled={!manageModal.message.trim()}
                        className="btn-primary w-full text-xs py-2"
                      >
                        Send Notification
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'users' ? (
                <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                  <div className="min-w-[480px] lg:min-w-0">
                    <div className="grid grid-cols-4 gap-4 mb-3 px-2">
                      {['FULL NAME', 'ROLE', 'STATUS', 'ACTIONS'].map(h => (
                        <span key={h} className="section-label">{h}</span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2">
                      {displayUsers.map((u, i) => (
                        <div key={u.id || i} className="grid grid-cols-4 gap-4 items-center p-3 rounded-xl hover:bg-linen transition-colors border border-transparent hover:border-linen-dark/20">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-sage-50 flex items-center justify-center text-[10px] font-bold text-sage-dark uppercase overflow-hidden shrink-0">
                              {u.avatar?.startsWith('http') ? <img src={u.avatar} alt="avatar" className="w-full h-full object-cover" /> : (u.avatar || u.name?.slice(0, 2).toUpperCase())}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-charcoal flex items-center gap-2">
                                {u.name}
                                {!u.createdAt && <span className="text-[8px] bg-linen px-1 rounded">MOCK</span>}
                              </p>
                              <p className="text-[10px] text-muted">{u.email}</p>
                            </div>
                          </div>
                          <span className="badge-role">{ROLE_LABELS[u.role] || u.role?.toUpperCase()}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={`w-2 h-2 rounded-full ${u.status === 'active' || u.status === 'approved' ? 'bg-success' : 'bg-muted'}`} />
                            <span className={`text-[10px] font-bold uppercase ${u.status === 'active' || u.status === 'approved' ? 'text-success' : 'text-muted'}`}>
                              {u.status === 'approved' ? 'ACTIVE' : u.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setManageModal({ show: true, user: u, message: '' })}
                              className="text-[10px] font-bold text-sage hover:text-sage-dark bg-sage-50 px-3 py-1.5 rounded-lg transition-colors border border-sage-200"
                            >
                              MANAGE
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {applicants.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-muted">
                      <span className="text-4xl mb-4">✨</span>
                      <p className="text-sm font-bold uppercase tracking-widest">No pending applications</p>
                    </div>
                  ) : (
                    applicants.map(app => (
                      <div key={app.id} className="p-5 rounded-2xl bg-linen/30 border border-linen-dark/20 flex items-center justify-between animate-in">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm overflow-hidden shrink-0">
                            {app.avatar?.startsWith('http') ? <img src={app.avatar} alt="avatar" className="w-full h-full object-cover" /> : (app.avatar || '👤')}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-charcoal">{app.name}</h3>
                            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{app.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3">
                          <button className="text-[10px] font-bold text-muted hover:text-charcoal uppercase tracking-widest">Decline</button>
                          <button
                            onClick={() => handleApprove(app)}
                            className="bg-sage text-white px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-sage-dark transition-all active:scale-95 whitespace-nowrap"
                          >
                            Verify & Select
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Role Permissions */}
          {showPermissions && (
            <div className="card p-6 max-w-3xl animate-in">
              <h2 className="text-lg font-bold text-charcoal mb-4">Role Permissions</h2>
              {[
                { label: 'Global Administrator', icon: '🛡️', desc: 'Full system access' },
                { label: 'Regional Coordinator', icon: '🔗', desc: 'Regional operations' },
                { label: 'Auditor / View Only', icon: '👁️', desc: 'Read-only access' },
              ].map((r, i) => (
                <button key={i} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-linen transition-colors mb-2 last:mb-0 text-left">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-linen flex items-center justify-center">{r.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-charcoal">{r.label}</p>
                      <p className="text-xs text-muted">{r.desc}</p>
                    </div>
                  </div>
                  <span className="text-muted text-lg">›</span>
                </button>
              ))}
            </div>
          )}

          {/* System Settings */}
          {showSettings && (
            <div className="card p-6 max-w-3xl animate-in">
              <h2 className="text-lg font-bold text-charcoal mb-5">System Settings</h2>

              <div className="mb-5">
                <p className="section-label mb-2">Notification Frequency</p>
                <div className="flex items-center justify-between bg-linen rounded-xl px-4 py-3">
                  <span className="text-sm font-semibold text-charcoal">Real-time alerts</span>
                  <div className="w-11 h-6 bg-sage rounded-full relative cursor-pointer">
                    <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow" />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="section-label">Emergency Escalation Threshold</p>
                  <span className="text-sm font-bold text-charcoal">Level {escalationLevel}</span>
                </div>
                <input
                  type="range" min="1" max="5" value={escalationLevel}
                  onChange={e => setEscalationLevel(Number(e.target.value))}
                  className="w-full accent-sage cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {showLogs && (
            <div className="card p-6 max-w-4xl animate-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-charcoal">Audit Logs</h2>
                <button className="text-xs text-sage font-semibold hover:text-sage-dark">View All</button>
              </div>
              <div className="flex flex-col gap-4">
                {displayLogs.map((log, i) => {
                  const icon = log.severity === 'critical' ? '🔴' : log.severity === 'success' ? '🟢' : '⚫';
                  return (
                    <div key={log.id || i} className="flex items-start gap-3">
                      <div className="w-6 h-6 shrink-0 flex items-center justify-center mt-0.5 text-sm">{icon}</div>
                      <div>
                        <p className="text-sm font-semibold text-charcoal">{log.action}</p>
                        <p className="text-xs text-muted leading-snug">{log.details || log.performedBy}</p>
                        <span className="text-xs text-muted bg-linen px-2 py-0.5 rounded-full mt-1 inline-block">
                          {log.time || (log.createdAt?.seconds ? timeAgo(log.createdAt.seconds) : 'Just now')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Regional Activity / Connect */}
          {showConnect && (
            <div className="card p-6 max-w-2xl animate-in">
              <h2 className="text-base font-bold text-charcoal mb-4">Indian View</h2>
              {[
                { region: 'Northern India', pct: 64, color: 'bg-sage' },
                { region: 'Southern India', pct: 32, color: 'bg-terra' },
                { region: 'Eastern India', pct: 51, color: 'bg-sage-light' },
                { region: 'Western India', pct: 78, color: 'bg-sage' },
              ].map((r, i) => (
                <div key={i} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-charcoal">{r.region}</span>
                    <span className="text-sm font-bold text-charcoal">{r.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-linen-dark rounded-full overflow-hidden">
                    <div className={`h-full ${r.color} rounded-full transition-all duration-1000`} style={{ width: `${r.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
