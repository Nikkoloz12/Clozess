import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

const GARMENT_TYPES = [
  "Short Sleeve T-Shirt","Long Sleeve T-Shirt","Polo Shirt",
  "Tank Top","Sweatshirt / Hoodie","Jacket","Sweater","Pants","Dress","Hat"
];

const DEFAULT_SIZES: Record<string, { men: string[]; women: string[] }> = {
  "Short Sleeve T-Shirt": { men: ["XS","S","M","L","XL","2XL","3XL","4XL"], women: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
  "Long Sleeve T-Shirt": { men: ["XS","S","M","L","XL","2XL","3XL","4XL"], women: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
  "Polo Shirt": { men: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"], women: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"] },
  "Tank Top": { men: ["XS","S","M","L","XL","2XL","3XL","4XL"], women: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
  "Sweatshirt / Hoodie": { men: ["XS","S","M","L","XL","2XL","3XL","4XL"], women: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
  "Jacket": { men: ["XS","S","M","L","XL","2XL","3XL","4XL"], women: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
  "Sweater": { men: ["XS","S","M","L","XL","2XL","3XL","4XL"], women: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
  "Pants": { men: ["28W","30W","32W","34W","36W","38W","40W","42W"], women: ["0","2","4","6","8","10","12","14","16"] },
  "Dress": { men: [], women: ["0","2","4","6","8","10","12","14","16","18"] },
  "Hat": { men: ["S","M","L","XL","XXL","XXXL"], women: ["S","M","L","XL"] },
};

const PRIMARY_MEASURE: Record<string, string> = {
  "Short Sleeve T-Shirt": "Chest (cm)",
  "Long Sleeve T-Shirt": "Chest (cm)",
  "Polo Shirt": "Chest (cm)",
  "Tank Top": "Chest (cm)",
  "Sweatshirt / Hoodie": "Chest (cm)",
  "Jacket": "Chest (cm)",
  "Sweater": "Chest (cm)",
  "Pants": "Waist (cm)",
  "Dress": "Bust (cm)",
  "Hat": "Head Circumference (cm)",
};

interface ChartData {
  id: number;
  garmentType: string;
  gender: string;
  sizes: { values: number[]; sizes: string[] };
}

export function SizeCharts({ apiKey }: { apiKey: string }) {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [garmentType, setGarmentType] = useState(GARMENT_TYPES[0]);
  const [gender, setGender] = useState<"men" | "women">("men");
  const [rows, setRows] = useState<{ size: string; value: string }[]>([]);

  const fetchCharts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/size-charts`, { headers: { "x-api-key": apiKey } });
      if (res.ok) { const data = await res.json(); setCharts(data.charts); }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCharts(); }, []);

  const initRows = (g: string, gen: "men" | "women") => {
    const sizes = DEFAULT_SIZES[g]?.[gen] ?? ["XS","S","M","L","XL"];
    setRows(sizes.map(s => ({ size: s, value: "" })));
  };

  const handleGarmentChange = (g: string) => { setGarmentType(g); initRows(g, gender); };
  const handleGenderChange = (gen: "men" | "women") => { setGender(gen); initRows(garmentType, gen); };
  const openAdd = () => { initRows(garmentType, gender); setShowAdd(true); setSaved(false); };

  const handleSave = async () => {
    const filled = rows.filter(r => r.value.trim() !== "" && !isNaN(parseFloat(r.value)));
    if (filled.length === 0) return;
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/size-charts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({
          garmentType, gender,
          sizes: { sizes: filled.map(r => r.size), values: filled.map(r => parseFloat(r.value)) },
        }),
      });
      if (res.ok) { setSaved(true); setShowAdd(false); fetchCharts(); }
    } catch {}
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this size chart?")) return;
    try {
      await fetch(`${API_URL}/api/size-charts/${id}`, { method: "DELETE", headers: { "x-api-key": apiKey } });
      fetchCharts();
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-stone-900">Custom Size Charts</h3>
          <p className="text-sm text-stone-500 mt-0.5">Upload your brand's exact measurements. The widget will use these instead of industry defaults.</p>
        </div>
        <button onClick={openAdd} className="px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
          + Add Size Chart
        </button>
      </div>

      {showAdd && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
          <h4 className="font-semibold text-stone-900 mb-4">Add Custom Size Chart</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Garment Type</label>
              <select value={garmentType} onChange={e => handleGarmentChange(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-white">
                {GARMENT_TYPES.filter(g => g !== "Dress" || gender === "women").map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Gender</label>
              <div className="flex gap-2">
                <button onClick={() => handleGenderChange("men")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${gender === "men" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-stone-600 border-stone-200"}`}>Men</button>
                <button onClick={() => handleGenderChange("women")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors ${gender === "women" ? "bg-amber-600 text-white border-amber-600" : "bg-white text-stone-600 border-stone-200"}`}>Women</button>
              </div>
            </div>
          </div>
          <p className="text-xs text-stone-500 mb-3">Enter your brand's <strong>{PRIMARY_MEASURE[garmentType]}</strong> for each size. Leave blank to skip.</p>
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden mb-4">
            <div className="grid grid-cols-2 bg-stone-50 border-b border-stone-200 px-4 py-2">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Size</span>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{PRIMARY_MEASURE[garmentType]}</span>
            </div>
            {rows.map((row, i) => (
              <div key={i} className={`grid grid-cols-2 px-4 py-2.5 items-center ${i % 2 === 0 ? "bg-white" : "bg-stone-50/50"}`}>
                <span className="text-sm font-mono font-semibold text-stone-700">{row.size}</span>
                <input type="number" step="0.1" placeholder="e.g. 96.5" value={row.value}
                  onChange={e => setRows(r => r.map((x, j) => j === i ? { ...x, value: e.target.value } : x))}
                  className="w-full border border-stone-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-amber-500 font-mono" />
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Size Chart"}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50">Cancel</button>
          </div>
        </div>
      )}

      {saved && <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium">✓ Size chart saved! The widget will now use your custom measurements.</div>}

      {loading ? (
        <div className="text-center py-12 text-stone-400 text-sm">Loading...</div>
      ) : charts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
          <p className="text-stone-400 text-sm mb-1">No custom size charts yet.</p>
          <p className="text-stone-400 text-xs">The widget uses industry standard measurements by default.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {charts.map(chart => (
            <div key={chart.id} className="bg-white border border-stone-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-stone-900">{chart.garmentType}</span>
                  <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full capitalize">{chart.gender}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Custom</span>
                </div>
                <button onClick={() => handleDelete(chart.id)} className="text-xs text-red-400 hover:text-red-600 transition-colors">Delete</button>
              </div>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {chart.sizes.sizes.map((size, i) => (
                  <div key={i} className="text-center bg-stone-50 border border-stone-200 rounded-lg p-2">
                    <div className="text-xs font-mono font-bold text-stone-700">{size}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{chart.sizes.values[i]} cm</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-blue-900 mb-1">Why custom size charts matter</h4>
        <p className="text-xs text-blue-700 leading-relaxed">Every brand cuts clothing differently. A Medium at your brand might fit like a Large elsewhere. By uploading your exact measurements, Clozes gives your customers perfectly accurate size recommendations — reducing returns and increasing confidence.</p>
      </div>
    </div>
  );
}
