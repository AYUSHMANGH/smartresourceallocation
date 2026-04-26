import React, { useState, useEffect } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { subscribeToCollection, updateDocument } from '../firebase/firestore';
import { orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

const STATUS_COLUMNS = [
  { id: 'todo', label: 'To-Do', color: 'bg-linen-dark text-charcoal' },
  { id: 'inprogress', label: 'In Progress', color: 'bg-sage-50 text-sage-dark' },
  { id: 'done', label: 'Completed', color: 'bg-green-50 text-success' }
];

const URGENCY_STYLES = {
  urgent: 'bg-red-50 text-critical',
  planning: 'bg-blue-50 text-blue-600',
  active: 'bg-sage-50 text-sage-dark'
};

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  useEffect(() => {
    const unsub = subscribeToCollection('tasks', setTasks, [orderBy('createdAt', 'desc')]);
    return unsub;
  }, []);

  const handleDragStart = (id) => {
    setDraggedTaskId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (status) => {
    if (!draggedTaskId) return;
    try {
      await updateDocument('tasks', draggedTaskId, { status });
      toast.success(`Task moved to ${status}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
    setDraggedTaskId(null);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 animate-in">
        {/* Header Section from Design Image 5 */}
        <div className="mb-8">
          <p className="section-label mb-1">IMPACT DASHBOARD</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="page-title mb-3">The Digital Architect of Resilience</h1>
              <p className="page-subtitle">Monitoring real-time response momentum and community reach across the northern sector.</p>
            </div>
            <div className="bg-surface p-6 rounded-2xl shadow-card flex items-center gap-4 min-w-[240px]">
              <div className="w-12 h-12 rounded-full bg-linen flex items-center justify-center text-xl">👥</div>
              <div>
                <p className="text-2xl font-extrabold text-charcoal">14,202</p>
                <p className="text-xs font-bold text-muted uppercase tracking-widest">Lives Reached</p>
              </div>
            </div>
          </div>
        </div>

        {/* Goal Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          <div className="lg:col-span-2 bg-sage rounded-2xl p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[220px]">
             <div className="relative z-10">
               <p className="text-sm font-bold opacity-80 mb-2">Food Security Goal</p>
               <h2 className="text-6xl font-extrabold mb-6">78%</h2>
               <div className="w-full h-3 bg-white bg-opacity-20 rounded-full mb-2">
                 <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: '78%' }} />
               </div>
               <p className="text-right text-xs opacity-70 font-bold">8,500 / 11,000 units</p>
             </div>
             {/* Decorative abstract shape */}
             <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl" />
          </div>

          <div className="bg-surface p-6 rounded-2xl shadow-card">
            <h3 className="text-xs font-bold text-muted uppercase tracking-widest mb-6">Resource Distribution</h3>
            <div className="flex flex-col gap-6">
              {[
                { label: 'Medical Kits', pct: 92 },
                { label: 'Clean Water', pct: 45 },
                { label: 'Shelter Tools', pct: 61 }
              ].map((res, i) => (
                <div key={i}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-charcoal">{res.label}</span>
                    <span className="text-sm font-bold text-charcoal">{res.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-linen rounded-full overflow-hidden">
                    <div className="h-full bg-sage-light rounded-full" style={{ width: `${res.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-8 text-xs font-bold text-sage hover:text-sage-dark flex items-center gap-1">
              View Full Report <span>→</span>
            </button>
          </div>
        </div>

        {/* Task Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STATUS_COLUMNS.map(col => (
            <div 
              key={col.id} 
              className="flex flex-col gap-4"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(col.id)}
            >
              <div className="flex items-center gap-3 px-2">
                <h3 className="text-sm font-bold text-charcoal">{col.label}</h3>
                <span className="px-2 py-0.5 rounded-full bg-linen text-[10px] font-bold text-muted">{tasks.filter(t => t.status === col.id).length}</span>
              </div>

              <div className="flex flex-col gap-4 min-h-[300px]">
                {tasks.filter(t => t.status === col.id).map(task => (
                  <div 
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task.id)}
                    className="card p-5 cursor-grab active:cursor-grabbing card-hover animate-in"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest ${URGENCY_STYLES[task.urgency] || 'bg-linen text-muted'}`}>
                        {task.urgency}
                      </span>
                      <button className="text-muted text-sm">•••</button>
                    </div>
                    <h4 className="text-sm font-bold text-charcoal mb-2">{task.title}</h4>
                    <p className="text-xs text-muted mb-4 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {(task.assignedVolunteers || []).map((v, i) => (
                          <div key={i} className="w-7 h-7 rounded-full bg-sage-light border-2 border-surface flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                            {v}
                          </div>
                        ))}
                      </div>
                      {task.comments > 0 && (
                        <div className="flex items-center gap-1 text-muted">
                          <span className="text-[10px]">💬</span>
                          <span className="text-[10px] font-bold">{task.comments}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
