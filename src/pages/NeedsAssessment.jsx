import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { addDocument, addActivityLog } from '../firebase/firestore';
import toast from 'react-hot-toast';
import NeedsMapPicker from '../components/maps/NeedsMapPicker';
import { useGemini } from '../hooks/useGemini';

const CATEGORIES = {
  Medical: ['Emergency Kits', 'Vaccination', 'Surgery', 'Pharmacy', 'Mental Health'],
  Food: ['Non-Perishable', 'Perishable', 'Infant Formula', 'Special Diet', 'Water Purification'],
  Shelter: ['Emergency Tents', 'Blankets', 'Construction', 'Heating', 'Sanitation'],
  Water: ['Clean Water', 'Purification Tablets', 'Storage Tanks', 'Wells', 'Pipes'],
  Education: ['School Supplies', 'Teachers', 'Digital Access', 'Safe Space', 'Counseling'],
  Logistics: ['Transportation', 'Fuel', 'Storage', 'Communication', 'Power'],
};

const URGENCY_LABELS = ['', 'LOW', 'MODERATE', 'HIGH', 'CRITICAL', 'EMERGENCY'];
const URGENCY_COLORS = ['', 'text-muted', 'text-blue-500', 'text-terra', 'text-critical', 'text-red-700'];

function calcPriorityScore({ severity, resourceDemand, accessibility }) {
  const sev = (severity || 0) * 1.8;
  const res = (resourceDemand || 3) * 0.5;
  const acc = (accessibility || 3) * 0.3;
  const score = Math.min(10, sev + res - acc + (Math.random() * 0.5));
  return Math.round(score * 10) / 10;
}

export default function NeedsAssessment() {
  const [form, setForm] = useState({
    category: '', subCategory: '', location: '', lat: null, lng: null,
    severity: 0, description: '', contactName: '', contactPhone: '',
    resourceDemand: 3, accessibility: 3,
  });
  const [priorityScore, setPriorityScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const { askGemini, response: aiResponse, loading: aiLoading } = useGemini();

  useEffect(() => {
    if (form.severity > 0) {
      const score = calcPriorityScore(form);
      setPriorityScore(score);
    }
  }, [form.severity, form.resourceDemand, form.accessibility, form.category]);

  const update = (field, val) => setForm(p => ({ ...p, [field]: val }));

  const handleSubmit = async () => {
    if (!form.category || !form.severity) {
      toast.error('Please fill category and severity');
      return;
    }
    setLoading(true);
    try {
      await addDocument('needs', {
        ...form, priorityScore, status: form.severity >= 4 ? 'critical' : form.severity >= 3 ? 'high' : 'medium'
      });
      await addActivityLog('alert', `New Need Submitted: ${form.category} — ${form.subCategory} at ${form.location}`, 'Field Worker');
      toast.success('Need submitted successfully!');
      setForm({ category: '', subCategory: '', location: '', lat: null, lng: null, severity: 0, description: '', contactName: '', contactPhone: '', resourceDemand: 3, accessibility: 3 });
      setPriorityScore(0);
    } catch {
      toast.error('Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeArea = (e) => {
    e.preventDefault();
    if (!form.location) {
      toast.error('Please set a location first');
      return;
    }
    const context = "You are a disaster preparedness analyst. Provide a brief (2-3 paragraphs) risk analysis and resource readiness overview for the specified area.";
    askGemini(`Analyze the geographic risks and disaster preparedness for: ${form.location}`, context);
  };

  const scoreColor = priorityScore >= 8 ? 'text-critical' : priorityScore >= 6 ? 'text-terra' : 'text-sage';
  const scoreLabel = priorityScore >= 8 ? 'High Impact' : priorityScore >= 6 ? 'Moderate Impact' : 'Standard Priority';

  return (
    <AppLayout>
      <div className="p-6 md:p-8 animate-in">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-charcoal">Needs Assessment Form</h1>
          <p className="text-muted text-sm mt-1">Report community requirements directly from the field for rapid response coordination.</p>
        </div>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 flex flex-col gap-4 sm:gap-5">
            {/* General Classification */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-sage-50 flex items-center justify-center">🗂️</div>
                <h2 className="text-base font-bold text-charcoal">General Classification</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal-light block mb-1.5">Category</label>
                  <div className="relative">
                    <select value={form.category} onChange={e => { update('category', e.target.value); update('subCategory', ''); }} className="select-field">
                      <option value="">Select a category</option>
                      {Object.keys(CATEGORIES).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▾</span>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-light block mb-1.5">Sub-category</label>
                  <div className="relative">
                    <select value={form.subCategory} onChange={e => update('subCategory', e.target.value)} className="select-field" disabled={!form.category}>
                      <option value="">Specify further</option>
                      {(CATEGORIES[form.category] || []).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▾</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Precise Location */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-sage-50 flex items-center justify-center">📍</div>
                <h2 className="text-base font-bold text-charcoal">Precise Location</h2>
              </div>
              <input
                placeholder="Enter landmark or street address"
                value={form.location}
                onChange={e => update('location', e.target.value)}
                className="input-field mb-4"
              />
              <NeedsMapPicker
                onLocationSelect={(lat, lng, address) => {
                  update('lat', lat); update('lng', lng);
                  if (address) update('location', address);
                }}
              />
              
              <div className="mt-4 pt-4 border-t border-linen-dark">
                <button 
                  onClick={handleAnalyzeArea} 
                  disabled={aiLoading || !form.location}
                  className="btn-secondary w-full flex items-center justify-center gap-2 py-2"
                >
                  {aiLoading ? <div className="w-4 h-4 border-2 border-sage border-t-transparent rounded-full animate-spin" /> : <span>🤖</span>}
                  {aiLoading ? 'Analyzing Region...' : 'Analyze Area with AI'}
                </button>
                
                {aiResponse && (
                  <div className="mt-4 p-4 bg-sage-50 rounded-xl text-sm text-charcoal border border-sage-200">
                    <h3 className="font-bold text-sage-dark mb-2">AI Regional Analysis</h3>
                    <div className="prose prose-sm prose-sage" dangerouslySetInnerHTML={{ __html: aiResponse.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                  </div>
                )}
              </div>
            </div>

            {/* Severity */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center">✳️</div>
                <h2 className="text-base font-bold text-charcoal">Severity Assessment</h2>
              </div>

              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-charcoal">Urgency Level (1-5)</label>
                {form.severity > 0 && (
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${form.severity >= 4 ? 'bg-red-100 text-critical' : form.severity >= 3 ? 'bg-orange-100 text-terra' : 'bg-sage-50 text-sage-dark'}`}>
                    LEVEL {form.severity}: {URGENCY_LABELS[form.severity]}
                  </span>
                )}
              </div>

              <div className="flex gap-3 mb-5">
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    onClick={() => update('severity', n)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all duration-200 ${form.severity === n ? 'bg-sage text-white shadow-md scale-105' : 'bg-linen text-charcoal hover:bg-linen-dark'}`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-xs font-semibold text-charcoal-light block mb-1.5">Detailed Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe the immediate situation, population affected, and any specific constraints for responders..."
                  value={form.description}
                  onChange={e => update('description', e.target.value)}
                  className="input-field resize-none"
                />
              </div>
            </div>

            {/* On-site Contact */}
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-sage-50 flex items-center justify-center">👤</div>
                <h2 className="text-base font-bold text-charcoal">On-site Contact</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-charcoal-light block mb-1.5">Contact Name</label>
                  <input placeholder="" value={form.contactName} onChange={e => update('contactName', e.target.value)} className="input-field" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal-light block mb-1.5">Phone / Radio ID</label>
                  <input placeholder="" value={form.contactPhone} onChange={e => update('contactPhone', e.target.value)} className="input-field" />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4 pb-8">
              <button className="btn-secondary">Save Draft</button>
              <button onClick={handleSubmit} disabled={loading} className="btn-primary px-8 flex items-center gap-2">
                {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Submit Report
              </button>
            </div>
          </div>

          {/* Priority Score Sidebar */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-24 h-fit">
            {/* Score Card */}
            <div className="bg-sage rounded-2xl p-6 text-white">
              <p className="text-xs font-bold uppercase tracking-widest text-white opacity-70 mb-2">Calculated Priority Score</p>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-6xl font-extrabold">{priorityScore || '—'}</span>
                <span className="text-lg opacity-70 mb-2">/ 10</span>
              </div>
              {priorityScore > 0 && (
                <p className="text-xs text-white opacity-80 leading-relaxed">
                  Based on your inputs, this need is classified as <strong>{scoreLabel}</strong>. Resource allocation will be prioritized within {priorityScore >= 8 ? '12' : priorityScore >= 6 ? '24' : '48'} hours.
                </p>
              )}
              {priorityScore === 0 && <p className="text-xs text-white opacity-60">Fill in severity level to calculate score</p>}
            </div>

            {/* Scoring Breakdown */}
            {priorityScore > 0 && (
              <div className="card p-5">
                <p className="section-label mb-4">Scoring Breakdown</p>
                {[
                  { label: 'Severity Impact', detail: `High risk to life safety identified`, delta: `+${(form.severity * 1.8).toFixed(1)}`, color: 'bg-critical' },
                  { label: 'Logistical Ease', detail: 'Accessible urban location', delta: `-${(form.accessibility * 0.3).toFixed(1)}`, color: 'bg-sage' },
                  { label: 'Resource Demand', detail: 'High specialized equipment needed', delta: `+${(form.resourceDemand * 0.5).toFixed(1)}`, color: 'bg-terra' },
                ].map((b, i) => (
                  <div key={i} className="flex items-start gap-3 mb-4 last:mb-0">
                    <div className={`w-1 h-10 rounded-full shrink-0 ${b.color}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-charcoal">{b.label}</p>
                        <span className="text-xs font-bold text-charcoal">{b.delta}</span>
                      </div>
                      <p className="text-xs text-muted">{b.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Field Tips */}
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-base">ℹ️</span>
                <p className="text-sm font-bold text-charcoal">Field Tips</p>
              </div>
              <p className="text-xs text-muted leading-relaxed italic">
                "Always include a photo of the access route if possible. This helps logistics teams understand vehicle clearance requirements."
              </p>
              <button onClick={() => fileRef.current?.click()} className="mt-4 w-full flex items-center justify-center gap-2 btn-secondary text-xs py-2">
                <span>🖼️</span> Add Photo Evidence
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
