import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Stats {
  brand: { name: string; email: string };
  totalAnalyses: number;
  avgFitScore: number;
  sizeBreakdown: Record<string, number>;
}

function Login({ onLogin }: { onLogin: (key: string, stats: Stats) => void }) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/brands/stats`, {
        headers: { "x-api-key": apiKey.trim() },
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("clozes_api_key", apiKey.trim());
        onLogin(apiKey.trim(), data);
      } else {
        setError(data.error || "Invalid API key.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-stone-900 mb-1">Clozes</h1>
          <p className="text-stone-500 text-sm">Brand Dashboard</p>
        </div>
        <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-stone-900 mb-1">Sign in</h2>
          <p className="text-stone-500 text-sm mb-6">Enter your API key to access your dashboard.</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">API Key</label>
              <input
                type="text"
                placeholder="clz_live_..."
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors font-mono"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || !apiKey.trim()}
              className="w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 text-sm"
            >
              {loading ? "Signing in..." : "Access Dashboard →"}
            </button>
          </form>
          <p className="text-xs text-stone-400 mt-4 text-center">
            Don't have an API key?{" "}
            <a href="https://clozes.app/#business" className="text-amber-600 hover:underline">Request integration</a>
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ apiKey, stats, onLogout }: { apiKey: string; stats: Stats; onLogout: () => void }) {
  const [currentStats, setCurrentStats] = useState(stats);
  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/api/brands/stats`, {
        headers: { "x-api-key": apiKey },
      });
      if (res.ok) setCurrentStats(await res.json());
    } catch {}
    setRefreshing(false);
  };

  const topSize = Object.entries(currentStats.sizeBreakdown).sort((a, b) => b[1] - a[1])[0];
  const totalSizes = Object.values(currentStats.sizeBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-stone-900">Clozes Dashboard</h1>
            <p className="text-xs text-stone-500">{currentStats.brand.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={refreshing}
              className="text-sm text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-50"
            >
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>
            <button
              onClick={onLogout}
              className="text-sm text-red-500 hover:text-red-700 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* Welcome */}
        <div>
          <h2 className="text-2xl font-bold text-stone-900 mb-1">Welcome back, {currentStats.brand.name} 👋</h2>
          <p className="text-stone-500 text-sm">Here's how Clozes is performing on your store.</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Total Fit Analyses",
              value: currentStats.totalAnalyses.toLocaleString(),
              sub: "Customers who used Find My Fit",
              color: "text-amber-600",
            },
            {
              label: "Avg Fit Confidence",
              value: `${currentStats.avgFitScore}%`,
              sub: "Average confidence score",
              color: "text-emerald-600",
            },
            {
              label: "Most Popular Size",
              value: topSize ? topSize[0] : "—",
              sub: topSize ? `${topSize[1]} analyses (${Math.round(topSize[1] / totalSizes * 100)}% of total)` : "No data yet",
              color: "text-blue-600",
            },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">{card.label}</p>
              <p className={`text-4xl font-bold mb-1 ${card.color}`}>{card.value}</p>
              <p className="text-xs text-stone-400">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Size breakdown */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-stone-900 mb-6">Size Distribution</h3>
          {totalSizes === 0 ? (
            <div className="text-center py-12">
              <p className="text-stone-400 text-sm">No fit analyses yet.</p>
              <p className="text-stone-400 text-xs mt-1">Install the widget on your store to start collecting data.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(currentStats.sizeBreakdown)
                .sort((a, b) => b[1] - a[1])
                .map(([size, count]) => {
                  const pct = Math.round(count / totalSizes * 100);
                  return (
                    <div key={size} className="flex items-center gap-4">
                      <span className="text-sm font-mono font-semibold text-stone-700 w-10">{size}</span>
                      <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-sm text-stone-500 w-16 text-right">{count} ({pct}%)</span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>

        {/* Integration snippet */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-semibold text-stone-900 mb-2">Your Integration Snippet</h3>
          <p className="text-stone-500 text-sm mb-4">Paste this into any product page to add the Find My Fit button.</p>
          <div className="bg-stone-900 rounded-xl p-4 overflow-x-auto">
            <pre className="text-xs text-green-400 font-mono whitespace-pre-wrap">{`<script 
  src="https://widget.clozes.app/clozes-widget.iife.js"
  data-clozes-key="${apiKey}"
  data-garment-type="Short Sleeve T-Shirt">
</script>`}</pre>
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(`<script \n  src="https://widget.clozes.app/clozes-widget.iife.js"\n  data-clozes-key="${apiKey}"\n  data-garment-type="Short Sleeve T-Shirt">\n</script>`)}
            className="mt-3 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
          >
            Copy to clipboard →
          </button>
        </div>

        <p className="text-center text-xs text-stone-400 pb-8">
          Powered by <strong>Clozes</strong> · <a href="https://clozes.app" className="hover:underline">clozes.app</a> · <a href="mailto:hello@clozes.app" className="hover:underline">hello@clozes.app</a>
        </p>
      </main>
    </div>
  );
}

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("clozes_api_key");
    if (saved) {
      fetch(`${API_URL}/api/brands/stats`, { headers: { "x-api-key": saved } })
        .then(r => r.ok ? r.json() : null)
        .then(data => { if (data) { setApiKey(saved); setStats(data); } })
        .catch(() => {});
    }
  }, []);

  const handleLogin = (key: string, data: Stats) => { setApiKey(key); setStats(data); };
  const handleLogout = () => { localStorage.removeItem("clozes_api_key"); setApiKey(null); setStats(null); };

  if (apiKey && stats) return <Dashboard apiKey={apiKey} stats={stats} onLogout={handleLogout} />;
  return <Login onLogin={handleLogin} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
