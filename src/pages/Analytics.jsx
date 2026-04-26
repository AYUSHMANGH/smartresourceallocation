import React from 'react';
import AppLayout from '../components/layout/AppLayout';

export default function Analytics() {
  return (
    <AppLayout>
      <div className="p-6 md:p-8 animate-in">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="page-title mb-2">Impact Analytics</h1>
            <p className="page-subtitle max-w-xl">Deep dive into resource distribution efficiency and community growth metrics across all operating regions.</p>
          </div>
          <button className="btn-primary">Generate Quarterly Report</button>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Lives Impacted', val: '42.8k', trend: '+14%', color: 'text-sage' },
            { label: 'Resources Delivered', val: '128.4t', trend: '+8.2%', color: 'text-terra' },
            { label: 'Task Efficiency', val: '94.2%', trend: '+2.1%', color: 'text-success' },
            { label: 'Active Missions', val: '158', trend: '-5%', color: 'text-charcoal' }
          ].map((kpi, i) => (
            <div key={i} className="card p-6 card-hover">
              <p className="section-label mb-2">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-extrabold text-charcoal">{kpi.val}</span>
                <span className={`text-xs font-bold ${kpi.trend.startsWith('+') ? 'text-success' : 'text-critical'}`}>
                  {kpi.trend}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Mock Charts */}
          <div className="card p-8">
            <h3 className="text-lg font-bold text-charcoal mb-6">Lives Impacted Over Time</h3>
            <div className="h-64 w-full bg-linen rounded-2xl flex items-end justify-between p-6 gap-2">
              {[40, 60, 45, 90, 70, 85, 100, 80, 95, 110, 90, 120].map((h, i) => (
                <div 
                  key={i} 
                  className="w-full bg-sage-light rounded-t-lg transition-all duration-1000" 
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="flex justify-between mt-4 text-[10px] font-bold text-muted uppercase tracking-widest px-2">
              <span>Jan</span><span>Apr</span><span>Jul</span><span>Oct</span><span>Dec</span>
            </div>
          </div>

          <div className="card p-8">
            <h3 className="text-lg font-bold text-charcoal mb-6">Regional Distribution</h3>
            <div className="space-y-6">
              {[
                { name: 'District 7 (Metro)', pct: 88, color: 'bg-sage' },
                { name: 'Riverdale (Suburban)', pct: 64, color: 'bg-terra' },
                { name: 'North Highlands (Rural)', pct: 42, color: 'bg-charcoal' },
                { name: 'Sector B (Industrial)', pct: 75, color: 'bg-sage-dark' }
              ].map((reg, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-charcoal">{reg.name}</span>
                    <span className="font-extrabold text-charcoal">{reg.pct}%</span>
                  </div>
                  <div className="h-2 bg-linen rounded-full overflow-hidden">
                    <div className={`h-full ${reg.color} transition-all duration-1000`} style={{ width: `${reg.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
