import "./index.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Analytics {
  totalAnalyses: number;
  avgFitScore: number;
  dailyCounts: { date: string; count: number }[];
  weeklyTotals: { week: string; count: number }[];
  garmentBreakdown: Record<string, number>;
  genderBreakdown: Record<string, number>;
  sizeBreakdown: Record<string, number>;
  avgScoreByGarment: { garment: string; avgScore: number }[];
}

interface BrandInfo {
  name: string;
  email: string;
}

// Simple bar chart component
function BarChart({ data, label, color = "#c8a951" }: { data: { label: string; value: number }[]; label: string; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">{label}</p>
      <div className="space-y-2.5">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-xs text-stone-500 w-24 shrink-0 truncate">{d.label}</span>
            <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }}
              />
            </div>
            <span className="text-xs font-mono text-stone-600 w-6 text-right">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Sparkline for daily trend
function Sparkline({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  const width = 300;
  const height = 60;
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - (d.count / max) * height;
    return `${x},${y}`;
  }).join(" ");

  const last7 = data.slice(-7);
  const last7Total = last7.reduce((s, d) => s + d.count, 0);
  const prev7 = data.slice(-14, -7);
  const prev7Total = prev7.reduce((s, d) => s + d.count, 0);
  const trend = prev7Total === 0 ? 100 : Math.round(((last7Total - prev7Total) / prev7Total) * 100);

  return (
    <div>
      <div className="flex items-end justify-between mb-2">
        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Daily Analyses — Last 30 Days</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${trend >= 0 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
          {trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}% vs prev week
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c8a951" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c8a951" stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon
          points={`0,${height} ${points} ${width},${height}`}
          fill="url(#sparkGrad)"
        />
        <polyline
          points={points}
          fill="none"
          stroke="#c8a951"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div className="flex justify-between text-xs text-stone-400 mt-1">
        <span>{data[0]?.date.slice(5)}</span>
        <span>{data[data.length - 1]?.date.slice(5)}</span>
      </div>
    </div>
  );
}

function Login({ onLogin }: { onLogin: (key: string, brand: BrandInfo, analytics: Analytics) => void }) {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;
    setLoading(true);
    setError("");
    try {
      const [statsRes, analyticsRes] = await Promise.all([
        fetch(`${API_URL}/api/brands/stats`, { headers: { "x-api-key": apiKey.trim() } }),
        fetch(`${API_URL}/api/brands/analytics`, { headers: { "x-api-key": apiKey.trim() } }),
      ]);
      if (statsRes.ok && analyticsRes.ok) {
        const stats = await statsRes.json();
        const analytics = await analyticsRes.json();
        localStorage.setItem("clozes_api_key", apiKey.trim());
        onLogin(apiKey.trim(), stats.brand, analytics);
      } else {
        setError("Invalid API key.");
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

function Dashboard({ apiKey, brand, analytics: initialAnalytics, onLogout }: {
  apiKey: string;
  brand: BrandInfo;
  analytics: Analytics;
  onLogout: () => void;
}) {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "sizes" | "garments" | "integration">("overview");

  const refresh = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`${API_URL}/api/brands/analytics`, { headers: { "x-api-key": apiKey } });
      if (res.ok) setAnalytics(await res.json());
    } catch {}
    setRefreshing(false);
  };

  const totalSizes = Object.values(analytics.sizeBreakdown).reduce((a, b) => a + b, 0);
  const topSize = Object.entries(analytics.sizeBreakdown).sort((a, b) => b[1] - a[1])[0];
  const thisWeek = analytics.weeklyTotals[analytics.weeklyTotals.length - 1]?.count ?? 0;
  const lastWeek = analytics.weeklyTotals[analytics.weeklyTotals.length - 2]?.count ?? 0;
  const weekGrowth = lastWeek === 0 ? 0 : Math.round(((thisWeek - lastWeek) / lastWeek) * 100);

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "sizes", label: "Size Distribution" },
    { id: "garments", label: "Garments" },
    { id: "integration", label: "Integration" },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-stone-900">Clozes</span>
            <span className="text-stone-300">|</span>
            <span className="text-sm text-stone-500">{brand.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={refresh} disabled={refreshing} className="text-sm text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-50">
              {refreshing ? "Refreshing..." : "↻ Refresh"}
            </button>
            <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-700 transition-colors">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 mb-1">Welcome back, {brand.name} 👋</h2>
          <p className="text-stone-500 text-sm">Here's how Clozes is performing on your store.</p>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Analyses", value: analytics.totalAnalyses.toLocaleString(), sub: "All time", color: "text-amber-600" },
            { label: "This Week", value: thisWeek.toString(), sub: weekGrowth >= 0 ? `↑ ${weekGrowth}% vs last week` : `↓ ${Math.abs(weekGrowth)}% vs last week`, color: weekGrowth >= 0 ? "text-emerald-600" : "text-red-500" },
            { label: "Avg Confidence", value: `${analytics.avgFitScore}%`, sub: "Fit accuracy", color: "text-blue-600" },
            { label: "Top Size", value: topSize?.[0] ?? "—", sub: topSize ? `${Math.round((topSize[1] / totalSizes) * 100)}% of orders` : "No data", color: "text-purple-600" },
          ].map(card => (
            <div key={card.label} className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2">{card.label}</p>
              <p className={`text-3xl font-bold mb-1 ${card.color}`}>{card.value}</p>
              <p className="text-xs text-stone-400">{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-stone-100 rounded-xl p-1 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Sparkline */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <Sparkline data={analytics.dailyCounts} />
            </div>

            {/* Weekly totals */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">Weekly Totals</p>
              <div className="grid grid-cols-4 gap-4">
                {analytics.weeklyTotals.map((w, i) => (
                  <div key={i} className="text-center">
                    <div className="text-2xl font-bold text-stone-900 mb-1">{w.count}</div>
                    <div className="text-xs text-stone-400">{w.week}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender split */}
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">Gender Split</p>
              <div className="flex gap-4">
                {Object.entries(analytics.genderBreakdown).map(([gender, count]) => {
                  const pct = Math.round((count / analytics.totalAnalyses) * 100);
                  return (
                    <div key={gender} className="flex-1 text-center p-4 bg-stone-50 rounded-xl">
                      <div className="text-3xl font-bold text-amber-600 mb-1">{pct}%</div>
                      <div className="text-sm text-stone-500 capitalize">{gender}</div>
                      <div className="text-xs text-stone-400">{count} analyses</div>
                    </div>
                  );
                })}
                {Object.keys(analytics.genderBreakdown).length === 0 && (
                  <p className="text-stone-400 text-sm">No data yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "sizes" && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            {totalSizes === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-400 text-sm">No size data yet.</p>
                <p className="text-stone-400 text-xs mt-1">Install the widget on your store to start collecting data.</p>
              </div>
            ) : (
              <>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-6">Size Distribution</p>
                <div className="space-y-3">
                  {Object.entries(analytics.sizeBreakdown)
                    .sort((a, b) => b[1] - a[1])
                    .map(([size, count]) => {
                      const pct = Math.round((count / totalSizes) * 100);
                      return (
                        <div key={size} className="flex items-center gap-4">
                          <span className="text-sm font-mono font-bold text-stone-700 w-12">{size}</span>
                          <div className="flex-1 bg-stone-100 rounded-full h-3 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-sm text-stone-500 w-20 text-right">{count} ({pct}%)</span>
                        </div>
                      );
                    })}
                </div>
                <div className="mt-6 pt-6 border-t border-stone-100">
                  <p className="text-xs text-stone-400">💡 Use this data to optimize your inventory — stock more of the sizes your customers actually need.</p>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "garments" && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <BarChart
                data={Object.entries(analytics.garmentBreakdown).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }))}
                label="Most Checked Garments"
              />
            </div>
            {analytics.avgScoreByGarment.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <BarChart
                  data={analytics.avgScoreByGarment.sort((a, b) => b.avgScore - a.avgScore).map(g => ({ label: g.garment, value: g.avgScore }))}
                  label="Avg Fit Confidence by Garment"
                  color="#10b981"
                />
                <p className="text-xs text-stone-400 mt-4">💡 Low confidence scores suggest your size chart for that garment may need adjustment.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "integration" && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900 mb-2">Your API Key</h3>
              <p className="text-stone-500 text-sm mb-4">Keep this private. It identifies your brand in all API calls.</p>
              <div className="bg-stone-900 rounded-xl p-4 font-mono text-sm text-amber-400">
                {apiKey}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900 mb-2">Integration Snippet</h3>
              <p className="text-stone-500 text-sm mb-4">Paste this into any product page HTML to add the "Find My Fit" button. Change <code className="bg-stone-100 px-1 rounded text-xs">data-garment-type</code> to match the product.</p>
              <div className="bg-stone-900 rounded-xl p-4 overflow-x-auto mb-3">
                <pre className="text-xs text-green-400 font-mono whitespace-pre">{`<script 
  src="https://widget.clozes.app/clozes-widget.iife.js"
  data-clozes-key="${apiKey}"
  data-garment-type="Short Sleeve T-Shirt">
</script>`}</pre>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(`<script \n  src="https://widget.clozes.app/clozes-widget.iife.js"\n  data-clozes-key="${apiKey}"\n  data-garment-type="Short Sleeve T-Shirt">\n</script>`)}
                className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                Copy to clipboard →
              </button>
            </div>

            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900 mb-4">Supported Garment Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {["Short Sleeve T-Shirt","Long Sleeve T-Shirt","Polo Shirt","Tank Top","Sweatshirt / Hoodie","Jacket","Sweater","Pants","Dress","Hat"].map(g => (
                  <div key={g} className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-600 font-mono">{g}</div>
                ))}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-stone-900 mb-2">Need help?</h3>
              <p className="text-stone-600 text-sm mb-3">Our team is available to help you set up the integration on your store.</p>
              <a href="mailto:hello@clozes.app" className="text-sm text-amber-700 font-medium hover:underline">hello@clozes.app →</a>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-stone-400 mt-12 pb-8">
          Powered by <strong>Clozes</strong> · <a href="https://clozes.app" className="hover:underline">clozes.app</a>
        </p>
      </main>
    </div>
  );
}

function App() {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [brand, setBrand] = useState<BrandInfo | null>(null);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("clozes_api_key");
    if (saved) {
      Promise.all([
        fetch(`${API_URL}/api/brands/stats`, { headers: { "x-api-key": saved } }),
        fetch(`${API_URL}/api/brands/analytics`, { headers: { "x-api-key": saved } }),
      ]).then(async ([statsRes, analyticsRes]) => {
        if (statsRes.ok && analyticsRes.ok) {
          const stats = await statsRes.json();
          const analyticsData = await analyticsRes.json();
          setApiKey(saved);
          setBrand(stats.brand);
          setAnalytics(analyticsData);
        }
      }).catch(() => {});
    }
  }, []);

  const handleLogin = (key: string, b: BrandInfo, a: Analytics) => { setApiKey(key); setBrand(b); setAnalytics(a); };
  const handleLogout = () => { localStorage.removeItem("clozes_api_key"); setApiKey(null); setBrand(null); setAnalytics(null); };

  if (apiKey && brand && analytics) return <Dashboard apiKey={apiKey} brand={brand} analytics={analytics} onLogout={handleLogout} />;
  return <Login onLogin={handleLogin} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
