import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

const GARMENT_CONFIGS: Record<string, {
  men?: { sizes: string[]; measurements: string[] };
  women?: { sizes: string[]; measurements: string[] };
}> = {
  "Short Sleeve T-Shirt": {
    men: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Chest","Body Length","Sleeve Length"]
    },
    women: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Bust","Body Length","Sleeve Length"]
    }
  },
  "Long Sleeve T-Shirt": {
    men: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Chest","Sleeve Length (Center Back)","Body Length at Back"]
    },
    women: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Bust","Sleeve Length (Center Back)","Body Length at Back"]
    }
  },
  "Polo Shirt": {
    men: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"],
      measurements: ["Chest","Sleeve Length","Body Length at Back"]
    },
    women: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"],
      measurements: ["Bust","Sleeve Length","Body Length at Back"]
    }
  },
  "Tank Top": {
    men: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Chest","Body Length at Back"]
    },
    women: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Bust","Body Length at Back"]
    }
  },
  "Sweatshirt / Hoodie": {
    men: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Chest","Body Length at Back","Sleeve Length (Center Back)"]
    },
    women: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Bust","Body Length at Back","Sleeve Length (Center Back)"]
    }
  },
  "Jacket": {
    men: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Chest","Body Length at Back","Sleeve Length (Center Back)"]
    },
    women: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Bust","Body Length at Back","Sleeve Length (Center Back)"]
    }
  },
  "Sweater": {
    men: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Chest","Sleeve from Shoulder","Body Length at Back"]
    },
    women: {
      sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"],
      measurements: ["Bust","Sleeve from Shoulder","Body Length at Back"]
    }
  },
  "Pants": {
    men: {
      sizes: ["28W","30W","32W","34W","36W","38W","40W","42W","44W","46W","48W","50W"],
      measurements: ["Waist (Relaxed)","Waist (Extended)","Cuff Opening"]
    },
    women: {
      sizes: ["0","2","4","6","8","10","12","14","16","18W","20W","22W","24W"],
      measurements: ["Waist","Hip"]
    }
  },
  "Dress": {
    women: {
      sizes: ["0","2","4","6","8","10","12","14","16","18"],
      measurements: ["Bust","Waist"]
    }
  },
  "Hat": {
    men: {
      sizes: ["S","M","L","XL","XXL","XXXL"],
      measurements: ["Head Circumference"]
    },
    women: {
      sizes: ["S","M","L","XL"],
      measurements: ["Head Circumference"]
    }
  }
};

const GARMENT_TYPES = Object.keys(GARMENT_CONFIGS);

interface ChartData {
  id: number;
  garmentType: string;
  gender: string;
  sizes: {
    sizes: string[];
    measurements: Record<string, number[]>;
  };
}

type MeasurementRows = Record<string, string[]>; // measurementName -> values per size

export function SizeCharts({ apiKey }: { apiKey: string }) {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [garmentType, setGarmentType] = useState(GARMENT_TYPES[0]);
  const [gender, setGender] = useState<"men" | "women">("men");
  const [rows, setRows] = useState<MeasurementRows>({});

  const fetchCharts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/size-charts`, { headers: { "x-api-key": apiKey } });
      if (res.ok) { const data = await res.json(); setCharts(data.charts); }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { fetchCharts(); }, []);

  const getConfig = (g: string, gen: "men" | "women") => {
    const config = GARMENT_CONFIGS[g];
    return config?.[gen] ?? config?.women ?? config?.men ?? { sizes: ["XS","S","M","L","XL"], measurements: ["Chest"] };
  };

  const initRows = (g: string, gen: "men" | "women") => {
    const config = getConfig(g, gen);
    const newRows: MeasurementRows = {};
    config.measurements.forEach(m => {
      newRows[m] = config.sizes.map(() => "");
    });
    setRows(newRows);
  };

  const handleGarmentChange = (g: string) => {
    setGarmentType(g);
    const config = GARMENT_CONFIGS[g];
    const availableGenders = Object.keys(config) as ("men" | "women")[];
    const newGender = availableGenders.includes(gender) ? gender : availableGenders[0];
    setGender(newGender);
    initRows(g, newGender);
  };

  const handleGenderChange = (gen: "men" | "women") => {
    setGender(gen);
    initRows(garmentType, gen);
  };

  const openAdd = () => {
    initRows(garmentType, gender);
    setShowAdd(true);
    setSaved(false);
  };

  const updateCell = (measurement: string, sizeIndex: number, value: string) => {
    setRows(r => ({ ...r, [measurement]: r[measurement].map((v, i) => i === sizeIndex ? value : v) }));
  };

  const handleSave = async () => {
    const config = getConfig(garmentType, gender);
    const measurements: Record<string, number[]> = {};
    let hasData = false;

    config.measurements.forEach(m => {
      const values = (rows[m] || []).map(v => parseFloat(v) || 0);
      if (values.some(v => v > 0)) { measurements[m] = values; hasData = true; }
    });

    if (!hasData) return;

    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/size-charts`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify({
          garmentType,
          gender,
          sizes: { sizes: config.sizes, measurements },
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

  const config = getConfig(garmentType, gender);
  const availableGenders = Object.keys(GARMENT_CONFIGS[garmentType] || {}) as ("men" | "women")[];

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Garment Type</label>
              <select value={garmentType} onChange={e => handleGarmentChange(e.target.value)} className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 bg-white">
                {GARMENT_TYPES.map(g => <option key={g}>{g}</option>)}
              </select>
            </div>
            {availableGenders.length > 1 && (
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Gender</label>
                <div className="flex gap-2">
                  {availableGenders.map(gen => (
                    <button key={gen} onClick={() => handleGenderChange(gen)} className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-colors capitalize ${gender === gen ? "bg-amber-600 text-white border-amber-600" : "bg-white text-stone-600 border-stone-200"}`}>{gen}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <p className="text-xs text-stone-500 mb-3">All measurements in <strong>centimeters (cm)</strong>. Leave blank to use industry defaults for that size.</p>

          {/* Measurement table */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-x-auto mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider whitespace-nowrap">Measurement</th>
                  {config.sizes.map(size => (
                    <th key={size} className="px-3 py-2.5 text-xs font-semibold text-stone-500 uppercase tracking-wider text-center whitespace-nowrap">{size}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {config.measurements.map((measurement, mi) => (
                  <tr key={measurement} className={mi % 2 === 0 ? "bg-white" : "bg-stone-50/50"}>
                    <td className="px-4 py-2.5 text-xs font-medium text-stone-700 whitespace-nowrap">{measurement}</td>
                    {config.sizes.map((_, si) => (
                      <td key={si} className="px-2 py-2">
                        <input
                          type="number"
                          step="0.1"
                          placeholder="—"
                          value={rows[measurement]?.[si] ?? ""}
                          onChange={e => updateCell(measurement, si, e.target.value)}
                          className="w-16 border border-stone-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-amber-500 font-mono text-center"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="px-5 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save Size Chart"}
            </button>
            <button onClick={() => setShowAdd(false)} className="px-5 py-2 bg-white border border-stone-200 text-stone-600 rounded-lg text-sm font-medium hover:bg-stone-50">Cancel</button>
          </div>
        </div>
      )}

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium">
          ✓ Size chart saved! The widget will now use your custom measurements.
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-stone-400 text-sm">Loading...</div>
      ) : charts.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center">
          <p className="text-stone-400 text-sm mb-1">No custom size charts yet.</p>
          <p className="text-stone-400 text-xs">The widget uses industry standard measurements by default. Add your brand's measurements for more accurate recommendations.</p>
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
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      <th className="text-left px-3 py-2 font-semibold text-stone-500">Measurement</th>
                      {chart.sizes.sizes.map(size => (
                        <th key={size} className="px-3 py-2 font-semibold text-stone-500 text-center">{size}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(chart.sizes.measurements || {}).map(([measurement, values], mi) => (
                      <tr key={measurement} className={mi % 2 === 0 ? "bg-white" : "bg-stone-50/50"}>
                        <td className="px-3 py-2 font-medium text-stone-700 whitespace-nowrap">{measurement}</td>
                        {(values as number[]).map((v, i) => (
                          <td key={i} className="px-3 py-2 text-center font-mono text-stone-600">{v > 0 ? `${v}` : "—"}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-blue-900 mb-1">💡 Why custom size charts matter</h4>
        <p className="text-xs text-blue-700 leading-relaxed">Every brand cuts clothing differently. A Medium at your brand might fit like a Large elsewhere. By uploading your exact measurements, Clozes gives your customers perfectly accurate size recommendations — reducing returns and increasing confidence.</p>
      </div>
    </div>
  );
}
