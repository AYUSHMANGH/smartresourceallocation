import React, { useEffect, useState, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { subscribeToCollection } from '../firebase/firestore';
import { orderBy, limit } from 'firebase/firestore';
import WorldMap from '../components/maps/WorldMap';

const URGENCY_CONFIG = {
  critical: { label: 'CRITICAL', className: 'badge-critical' },
  high: { label: 'HIGH', className: 'badge-high' },
  medium: { label: 'MEDIUM', className: 'badge-medium' },
};

const ACTIVITY_ICONS = {
  delivery: { icon: '📦', color: 'bg-sage-50 text-sage' },
  volunteer: { icon: '👥', color: 'bg-blue-50 text-blue-600' },
  alert: { icon: '⚠️', color: 'bg-red-50 text-critical' },
  report: { icon: '📊', color: 'bg-linen text-muted' },
};

function useCountUp(target, duration = 1200) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
}

function StatCard({ label, value, sub, badge, badgeColor, icon, dark }) {
  const displayVal = typeof value === 'number' ? value.toLocaleString() : value;
  return (
    <div className={`rounded-2xl p-6 flex flex-col gap-3 card-hover cursor-default ${dark ? 'bg-sage text-white' : 'bg-surface shadow-card'}`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${dark ? 'bg-white bg-opacity-20' : 'bg-linen'}`}>
          {icon}
        </div>
        {badge && (
          <span className={`text-xs font-bold ${dark ? 'text-white opacity-80' : badgeColor || 'text-terra'}`}>
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className={`text-xs font-bold uppercase tracking-widest ${dark ? 'text-white opacity-70' : 'text-muted'}`}>{label}</p>
        <p className={`text-3xl font-extrabold mt-1 ${dark ? 'text-white' : 'text-charcoal'}`}>{displayVal}</p>
        {sub && <p className={`text-xs mt-0.5 ${dark ? 'text-white opacity-70' : 'text-muted'}`}>{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [needs, setNeeds] = useState([]);
  const [activities, setActivities] = useState([]);
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const totalNeeds = useCountUp(1284);
  const volunteers = useCountUp(856);
  const impactScore = 94.2;
  const urgentAlerts = useCountUp(12);

  useEffect(() => {
    const unsub1 = subscribeToCollection('needs', setNeeds, [limit(5)]);
    const unsub2 = subscribeToCollection('activity_log', setActivities, [orderBy('createdAt', 'desc'), limit(5)]);
    return () => { unsub1(); unsub2(); };
  }, []);

  const displayNeeds = needs.length > 0 ? needs : [
    { id: 1, category: 'Medical', subCategory: 'Emergency Kits', location: 'District 7, Metro Area', status: 'critical', description: '25 units requested' },
    { id: 2, category: 'Food', subCategory: 'Non-Perishable', location: 'Riverdale Community', status: 'high', description: '500 families' },
    { id: 3, category: 'Shelter', subCategory: 'Emergency Tents', location: 'North Highlands', status: 'medium', description: '40 kits' },
  ];

  const displayActivities = activities.length > 0 ? activities : [
    { id: 1, type: 'delivery', message: 'Medical Shipment Delivered to District 4 Hub by Alex Rivera', createdAt: { seconds: Date.now() / 1000 - 720 } },
    { id: 2, type: 'volunteer', message: '12 New Volunteers Joined assigned to "Meal Prep" project', createdAt: { seconds: Date.now() / 1000 - 7200 } },
    { id: 3, type: 'alert', message: 'New Critical Alert: Water supply shortage in Sector B', createdAt: { seconds: Date.now() / 1000 - 14400 } },
    { id: 4, type: 'report', message: 'Monthly Report Generated — ready for regional review', createdAt: { seconds: Date.now() / 1000 - 86400 } },
  ];

  const timeAgo = (seconds) => {
    const diff = Date.now() / 1000 - seconds;
    if (diff < 3600) return `${Math.floor(diff / 60)} mins ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hrs ago`;
    return 'Yesterday';
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 animate-in">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="section-label mb-1">Central Operations Command: Southeast Region</p>
            <h1 className="page-title">Architect of Resilience</h1>
          </div>
          <div className="flex items-center gap-2 bg-surface border border-linen-dark rounded-xl px-4 py-2 text-sm text-charcoal font-semibold shadow-card">
            📅 {today}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Active Needs" value={totalNeeds} badge="+12% from last week" badgeColor="text-terra" icon="📋" />
          <StatCard label="Assigned Volunteers" value={volunteers} sub="67% capacity reached" icon="👥" />
          <StatCard label="Impact Score" value={impactScore} icon="⚡" dark />
          <div className="rounded-2xl p-6 flex flex-col gap-3 card-hover cursor-default bg-terra text-white shadow-card">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-white bg-opacity-20 flex items-center justify-center text-lg">🚨</div>
              <span className="text-xs font-bold text-white opacity-80">URGENT ALERTS</span>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-white">{urgentAlerts}</p>
              <span className="text-xs bg-white bg-opacity-20 text-white px-2 py-0.5 rounded-full font-bold mt-1 inline-block">REQUIRES IMMEDIATE ACTION</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left: Priority Needs + Map */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Priority Needs */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-charcoal">Priority Needs</h2>
                <button className="text-sm text-sage font-semibold hover:text-sage-dark transition-colors flex items-center gap-1">
                  View All <span>›</span>
                </button>
              </div>
              <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
                <div className="min-w-[450px] lg:min-w-0">
                  <div className="mb-3 grid grid-cols-4 gap-4">
                    <span className="section-label">Need Type</span>
                    <span className="section-label">Location</span>
                    <span className="section-label">Urgency</span>
                    <span className="section-label">Action</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {displayNeeds.map((need, i) => {
                      const cfg = URGENCY_CONFIG[need.status] || URGENCY_CONFIG.medium;
                      const icons = { Medical: '🩺', Food: '🍽️', Shelter: '🏕️', Water: '💧' };
                      return (
                        <div key={need.id || i} className="grid grid-cols-4 gap-4 items-center py-3 border-b border-linen-dark last:border-0">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-linen flex items-center justify-center text-sm">
                              {icons[need.category] || '📦'}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-charcoal">{need.category} — {need.subCategory}</p>
                              <p className="text-xs text-muted">{need.description}</p>
                            </div>
                          </div>
                          <p className="text-sm text-charcoal">{need.location}</p>
                          <span className={cfg.className}>{cfg.label}</span>
                          <button className="w-8 h-8 rounded-full bg-linen flex items-center justify-center hover:bg-linen-dark transition-colors text-charcoal">
                            →
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-charcoal">Geographic Distribution</h2>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-critical inline-block" /> Critical</span>
                  <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-sage inline-block" /> Stable</span>
                </div>
              </div>
              <WorldMap />
              {/* Regional insight tooltip */}
              <div className="mt-4 glass rounded-xl p-4">
                <p className="section-label mb-1">Regional Insight</p>
                <p className="text-sm text-charcoal">High concentration of food requests detected in the Eastern Corridor. Deployment recommended.</p>
              </div>
            </div>
          </div>

          {/* Right: Activity + Community */}
          <div className="flex flex-col gap-6">
            {/* Recent Activity */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-charcoal mb-4">Recent Activity</h2>
              <div className="flex flex-col gap-4">
                {displayActivities.map((act, i) => {
                  const cfg = ACTIVITY_ICONS[act.type] || ACTIVITY_ICONS.report;
                  return (
                    <div key={act.id || i} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ${cfg.color}`}>
                        {cfg.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold leading-snug ${act.type === 'alert' ? 'text-critical' : 'text-charcoal'}`}>
                          {act.message}
                        </p>
                        <p className="text-xs text-muted mt-0.5">
                          {act.createdAt?.seconds ? timeAgo(act.createdAt.seconds) : 'Just now'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="w-full mt-4 btn-secondary text-xs py-2">LOAD FULL HISTORY</button>
            </div>

            {/* Community Growth */}
            <div className="rounded-2xl overflow-hidden relative" style={{ minHeight: '180px', background: 'linear-gradient(135deg, #2C2C2C 0%, #4A5E3D 100%)' }}>
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <h3 className="text-white font-bold text-lg">Community Growth</h3>
                <p className="text-white text-opacity-80 text-xs leading-relaxed mt-1">
                  You've helped over 12,000 residents this month. See the story.
                </p>
                <button className="btn-terra mt-3 text-xs py-2 px-4 w-fit">READ STORY</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
