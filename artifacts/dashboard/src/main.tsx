import "./index.css";
import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { SizeCharts } from "./SizeCharts";
import { WidgetCustomizer } from "./WidgetCustomizer";



const API_URL = import.meta.env.VITE_API_URL || "";

const GARMENT_TYPES = [
  "Short Sleeve T-Shirt","Long Sleeve T-Shirt","Polo Shirt",
  "Tank Top","Sweatshirt / Hoodie","Jacket","Sweater","Pants","Dress","Hat"
];

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

interface BrandInfo { name: string; email: string; }
interface Product { id: number; name: string; garmentType: string; description: string; active: boolean; createdAt: string; }

function BarChart({ data, label, color = "#c8a951" }: { data: { label: string; value: number }[]; label: string; color?: string }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div>
      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">{label}</p>
      <div className="space-y-2.5">
        {data.map(d => (
          <div key={d.label} className="flex items-center gap-3">
            <span className="text-xs text-stone-500 w-28 shrink-0 truncate">{d.label}</span>
            <div className="flex-1 bg-stone-100 rounded-full h-2 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(d.value / max) * 100}%`, backgroundColor: color }} />
            </div>
            <span className="text-xs font-mono text-stone-600 w-6 text-right">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Sparkline({ data }: { data: { date: string; count: number }[] }) {
  const max = Math.max(...data.map(d => d.count), 1);
  const width = 300; const height = 60;
  const points = data.map((d, i) => `${(i / (data.length - 1)) * width},${height - (d.count / max) * height}`).join(" ");
  const last7 = data.slice(-7).reduce((s, d) => s + d.count, 0);
  const prev7 = data.slice(-14, -7).reduce((s, d) => s + d.count, 0);
  const trend = prev7 === 0 ? 100 : Math.round(((last7 - prev7) / prev7) * 100);
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
        <polygon points={`0,${height} ${points} ${width},${height}`} fill="url(#sparkGrad)" />
        <polyline points={points} fill="none" stroke="#c8a951" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
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
    setLoading(true); setError("");
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
      } else { setError("Invalid API key."); }
    } catch { setError("Network error. Please try again."); }
    finally { setLoading(false); }
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
              <input type="text" placeholder="clz_live_..." value={apiKey} onChange={e => setApiKey(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-amber-500 transition-colors font-mono" />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading || !apiKey.trim()} className="w-full py-3 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:opacity-50 text-sm">
              {loading ? "Signing in..." : "Access Dashboard →"}
            </button>
          </form>
          <p className="text-xs text-stone-400 mt-4 text-center">Don't have an API key? <a href="https://clozes.app/#business" className="text-amber-600 hover:underline">Request integration</a></p>
        </div>
      </div>
    </div>
  );
}

function ProductCatalog({ apiKey }: { apiKey: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", garmentType: GARMENT_TYPES[0], description: "" });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, { headers: { "x-api-key": apiKey } });
      if (res.ok) { const data = await res.json(); setProducts(data.products); }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify(form),
      });
      if (res.ok) { setShowAdd(false); setForm({ name: "", garmentType: GARMENT_TYPES[0], description: "" }); fetchProducts(); }
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Remove this product?")) return;
    try {
      await fetch(`${API_URL}/api/products/${id}`, { method: "DELETE", headers: { "x-api-key": apiKey } });
      fetchProducts();
    } catch {}
  };

  const getSnippet = (product: Product) =>
    `<script \n  src="https://widget.clozes.app/clozes-widget.iife.js"\n  data-clozes-key="${apiKey}"\n  data-garment-type="${product.garmentType}">\n</script>`;

  const copySnippet = (product: Product) => {
    navigator.clipboard.writeText(getSnippet(product));
    setCopied(product.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-stone-900">Product Catalog</h3>
          <p className="text-sm text-stone-500 mt-0.5">Add your products to get individual widget snippets for each one.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
          + Add Product
        </button>
      </div>

      {/* Add product form */}
      {showAdd && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h4 className="font-semibold text-stone-900 mb-4">Add New Product</h4>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Product Name *</label>
                <input type="text" required placeholder="e.g. Classic Oxford Shirt" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Garment Type *</label>
                <select value={form.garmentType} onChange={e => setForm(f => ({ ...f, garmentType: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-white">
                  {GARMENT_TYPES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Description (optional)</label>
              <input type="text" placeholder="e.g. Men's slim fit button-down shirt" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-white" />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="px-5 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
                {saving ? "Saving..." : "Save Product"}
              </button>
              <button type="button" onClick={() => setShowAdd(false)} className="px-5 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Product list */}
      {loading ? (
        <div className="text-center py-12 text-stone-400 text-sm">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
          <p className="text-stone-400 text-sm mb-1">No products yet.</p>
          <p className="text-stone-400 text-xs">Add your first product to get a widget snippet for it.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {products.map(product => (
            <div key={product.id} className="bg-white border border-stone-200 rounded-2xl p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-stone-900">{product.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">{product.garmentType}</span>
                    {product.description && <span className="text-xs text-stone-400">{product.description}</span>}
                  </div>
                </div>
                <button onClick={() => handleDelete(product.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Remove</button>
              </div>
              {/* Widget snippet */}
              <div className="bg-stone-900 rounded-xl p-3 overflow-x-auto">
                <pre className="text-xs text-green-400 font-mono whitespace-pre">{getSnippet(product)}</pre>
              </div>
              <button onClick={() => copySnippet(product)} className="mt-2 text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors">
                {copied === product.id ? "✓ Copied!" : "Copy snippet →"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard({ apiKey, brand, analytics: initialAnalytics, onLogout }: {
  apiKey: string; brand: BrandInfo; analytics: Analytics; onLogout: () => void;
}) {
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "sizes" | "garments" | "products" | "sizecharts" | "widget" | "integration">("overview");  const refresh = async () => {
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
    { id: "sizes", label: "Sizes" },
    { id: "garments", label: "Garments" },
    { id: "products", label: "Products" },
    { id: "sizecharts", label: "Size Charts" },
    { id: "widget", label: "Widget" },
    { id: "integration", label: "Integration" },
  ] as const;

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-bold text-stone-900">Clozes</span>
            <span className="text-stone-300">|</span>
            <span className="text-sm text-stone-500">{brand.name}</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={refresh} disabled={refreshing} className="text-sm text-stone-500 hover:text-stone-800 transition-colors disabled:opacity-50">{refreshing ? "Refreshing..." : "↻ Refresh"}</button>
            <button onClick={onLogout} className="text-sm text-red-500 hover:text-red-700 transition-colors">Sign out</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
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
        <div className="flex gap-1 mb-6 bg-stone-100 rounded-xl p-1 w-fit overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm"><Sparkline data={analytics.dailyCounts} /></div>
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
                {Object.keys(analytics.genderBreakdown).length === 0 && <p className="text-stone-400 text-sm">No data yet.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === "sizes" && (
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            {totalSizes === 0 ? (
              <div className="text-center py-12"><p className="text-stone-400 text-sm">No size data yet.</p></div>
            ) : (
              <>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-6">Size Distribution</p>
                <div className="space-y-3">
                  {Object.entries(analytics.sizeBreakdown).sort((a, b) => b[1] - a[1]).map(([size, count]) => {
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
                <p className="text-xs text-stone-400 mt-6">💡 Use this data to optimize your inventory.</p>
              </>
            )}
          </div>
        )}

        {activeTab === "garments" && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <BarChart data={Object.entries(analytics.garmentBreakdown).sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }))} label="Most Checked Garments" />
            </div>
            {analytics.avgScoreByGarment.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
                <BarChart data={analytics.avgScoreByGarment.sort((a, b) => b.avgScore - a.avgScore).map(g => ({ label: g.garment, value: g.avgScore }))} label="Avg Fit Confidence by Garment" color="#10b981" />
                <p className="text-xs text-stone-400 mt-4">💡 Low scores suggest your size chart may need adjustment.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "products" && <ProductCatalog apiKey={apiKey} />}

        {activeTab === "widget" && <WidgetCustomizer apiKey={apiKey} />}
        {activeTab === "integration" && (
        <div className="space-y-6">
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900 mb-2">Your API Key</h3>
              <p className="text-stone-500 text-sm mb-4">Keep this private.</p>
              <div className="bg-stone-900 rounded-xl p-4 font-mono text-sm text-amber-400">{apiKey}</div>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900 mb-2">Base Snippet</h3>
              <p className="text-stone-500 text-sm mb-4">For individual products, use the <strong>Products</strong> tab to get product-specific snippets.</p>
              <div className="bg-stone-900 rounded-xl p-4 overflow-x-auto mb-3">
                <pre className="text-xs text-green-400 font-mono whitespace-pre">{`<script \n  src="https://widget.clozes.app/clozes-widget.iife.js"\n  data-clozes-key="${apiKey}"\n  data-garment-type="Short Sleeve T-Shirt">\n</script>`}</pre>
              </div>
              <button onClick={() => navigator.clipboard.writeText(`<script \n  src="https://widget.clozes.app/clozes-widget.iife.js"\n  data-clozes-key="${apiKey}"\n  data-garment-type="Short Sleeve T-Shirt">\n</script>`)} className="text-xs text-amber-600 hover:text-amber-700 font-medium">Copy →</button>
            </div>
            <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-base font-semibold text-stone-900 mb-4">Supported Garment Types</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {GARMENT_TYPES.map(g => <div key={g} className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-600 font-mono">{g}</div>)}
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
              <h3 className="text-base font-semibold text-stone-900 mb-2">Need help?</h3>
              <p className="text-stone-600 text-sm mb-3">Our team is here to help you set up the integration.</p>
              <a href="mailto:hello@clozes.app" className="text-sm text-amber-700 font-medium hover:underline">hello@clozes.app →</a>
            </div>
          </div>
        )}

        <p className="text-center text-xs text-stone-400 mt-12 pb-8">Powered by <strong>Clozes</strong> · <a href="https://clozes.app" className="hover:underline">clozes.app</a></p>
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
      ]).then(async ([s, a]) => {
        if (s.ok && a.ok) { setApiKey(saved); setBrand((await s.json()).brand); setAnalytics(await a.json()); }
      }).catch(() => {});
    }
  }, []);

  if (apiKey && brand && analytics) return <Dashboard apiKey={apiKey} brand={brand} analytics={analytics} onLogout={() => { localStorage.removeItem("clozes_api_key"); setApiKey(null); setBrand(null); setAnalytics(null); }} />;
  return <Login onLogin={(k, b, a) => { setApiKey(k); setBrand(b); setAnalytics(a); }} />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
