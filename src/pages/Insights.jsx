import React, { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useGemini } from '../hooks/useGemini';

const SUGGESTIONS = [
  "Predict demand spikes for medical kits",
  "Suggest resource allocation strategies for Sector B",
  "Recommend standby volunteers for District 7",
  "Analyze regional response efficiency"
];

export default function Insights() {
  const [query, setQuery] = useState('');
  const { askGemini, response, loading } = useGemini();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const context = "You are the Intelligence Layer of ResilienceNet, an NGO resource management system. You provide data-driven insights to help coordinators allocate resources, match volunteers, and predict crisis needs. Keep your answers professional, concise, and impact-focused. Use Markdown for formatting.";
    askGemini(query, context);
  };

  const handleSuggestion = (s) => {
    setQuery(s);
    const context = "You are the Intelligence Layer of ResilienceNet, an NGO resource management system. You provide data-driven insights to help coordinators allocate resources, match volunteers, and predict crisis needs. Keep your answers professional, concise, and impact-focused. Use Markdown for formatting.";
    askGemini(s, context);
  };

  return (
    <AppLayout>
      <div className="p-6 md:p-8 animate-in h-full flex flex-col">
        <div className="mb-10">
          <h1 className="page-title mb-2">Intelligent Insights</h1>
          <p className="page-subtitle max-w-xl">Leverage AI to optimize mission deployment, predict regional demand, and maximize community impact.</p>
        </div>

        <div className="flex-1 flex flex-col gap-8 max-w-4xl mx-auto w-full">
          {/* Search Box */}
          <div className="card p-2 shadow-lg focus-within:ring-2 focus-within:ring-sage transition-all">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask about resource allocation, volunteer matching, or demand prediction..."
                className="flex-1 bg-transparent border-none px-6 py-4 focus:outline-none text-charcoal font-medium"
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center gap-2 px-8"
              >
                {loading ? 'Analyzing...' : 'Generate Insights'}
              </button>
            </form>
          </div>

          {!response && !loading && (
            <div className="grid md:grid-cols-2 gap-4 animate-in">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestion(s)}
                  className="card p-6 text-left hover:bg-sage-50 transition-colors group"
                >
                  <span className="text-xs font-bold text-muted uppercase tracking-widest block mb-2">Recommendation {i + 1}</span>
                  <p className="text-sm font-bold text-charcoal group-hover:text-sage transition-colors">{s}</p>
                </button>
              ))}
            </div>
          )}

          {(response || loading) && (
            <div className="card p-8 min-h-[400px] animate-in overflow-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-sage flex items-center justify-center text-white">🤖</div>
                <h3 className="font-extrabold text-charcoal">Resilience Intelligence Report</h3>
              </div>

              <div className={`prose prose-sm max-w-none text-charcoal leading-relaxed ${loading ? 'streaming-cursor' : ''}`}>
                {response ? (
                  <div dangerouslySetInnerHTML={{ __html: response.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                ) : (
                  <p className="text-muted italic">Processing global data streams and regional metrics...</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
