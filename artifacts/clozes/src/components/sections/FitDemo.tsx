import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Loader2, RefreshCcw, ChevronDown } from "lucide-react";

interface SizeChart {
  label: string;
  gender: "men" | "women";
  primaryMeasure: string;
  unit: string;
  sizes: string[];
  measurements: Record<string, number[]>;
}

const MEN_CHARTS: SizeChart[] = [
  { label: "Short Sleeve T-Shirt", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[37,40,43,46,49,52,56,60], "Body Length":[27,28,29,30,31,32,32.5,33], "Sleeve Length":[17,18.5,19.25,20,20.75,21.5,22.25,23] } },
  { label: "Long Sleeve T-Shirt", gender: "men", primaryMeasure: "Body Length", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { "Body Length":[38,41,44,47,51,55,59,63], "Sleeve Length (Center Back)":[26,26.75,27.5,28.25,29,29.75,30.5,31.25], "Body Length at Back":[28,29,30,31,32,33,34,35] } },
  { label: "Polo Shirt", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"], measurements: { Chest:[37.5,40.5,43.5,46.5,49.5,52.5,56.5,60.5,64.5,68.5], "Sleeve Length":[19.75,20.5,21.25,22,22.75,23.5,24.25,25,25.5,25.5], "Body Length at Back":[28,29,30,31,32,33,33.5,34,34.5,35] } },
  { label: "Tank Top", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[36,39,42,45,48,51,55,59], "Body Length at Back":[27.5,28.5,29.5,30.5,31.5,32.5,33.5,34.5] } },
  { label: "Sweatshirt / Hoodie", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[38,40,43,46,49,52,56,60], "Body Length at Back":[27.5,28,28.5,29,29.5,30,30.5,31], "Sleeve Length (Center Back)":[33,34,35,36,37,38,39,39.5] } },
  { label: "Jacket", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[38,41,44,47,50,53,57,61], "Body Length at Back":[27.5,28.5,29.5,30.5,31.5,32.5,33,33.5], "Sleeve Length (Center Back)":[34.75,35.5,36.25,37,37.75,38.5,39.25,40] } },
  { label: "Sweater", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[39,42,45,48,51,54,58,62], "Sleeve from Shoulder":[33.25,34,34.75,35.5,36.25,37,37.75,38.5], "Body Length at Back":[26.25,27,27.75,28.5,29.25,30,30.75,31.5] } },
  { label: "Pants", gender: "men", primaryMeasure: "Waist (Relaxed)", unit: "cm", sizes: ["28W","30W","32W","34W","36W","38W","40W","42W","44W","46W","48W","50W"], measurements: { "Waist (Relaxed)":[26.5,28.5,30.5,32.5,34.5,36.5,38.5,40.5,42.5,44.5,46.5,48.5], "Waist (Extended)":[30,32,34,36,38,40,42,44,46,48,50,52], "Cuff Opening":[16.75,17,17.25,17.5,17.75,18,18.25,18.5,18.75,19,19.25,19.5] } },
  { label: "Hat", gender: "men", primaryMeasure: "Head Circumference", unit: "cm", sizes: ["S","M","L","XL","XXL","XXXL"], measurements: { "Head Circumference":[21.25,22.0,22.75,23.7,24.4,25.25] } },
];

const WOMEN_CHARTS: SizeChart[] = [
  { label: "Short Sleeve T-Shirt", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[32,35,38,41,45,49,53,57], "Body Length":[24.5,25.5,26.5,27.5,28.5,29.5,30.5,31.5], "Sleeve Length":[13.5,14,14.5,15,15.5,16,16.5,17] } },
  { label: "Long Sleeve T-Shirt", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[32,35,38,41,45,49,53,57], "Sleeve Length (Center Back)":[29,29.5,30,30.5,31,31.5,32,32.5], "Body Length at Back":[25,26,27,28,29,30,31,32] } },
  { label: "Polo Shirt", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"], measurements: { Bust:[33,36,39,42,46,50,54,58,62,66], "Sleeve Length":[14.5,15,15.5,16,16.5,17,17.5,18,18.5,19], "Body Length at Back":[25,26,27,28,29,30,31,32,32.5,33] } },
  { label: "Tank Top", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[31,34,37,40,44,48,52,56], "Body Length at Back":[24,25,26,27,28,29,30,31] } },
  { label: "Sweatshirt / Hoodie", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[34,37,40,43,47,51,55,59], "Body Length at Back":[25,26,27,28,29,30,31,32], "Sleeve Length (Center Back)":[31,32,33,34,35,36,37,38] } },
  { label: "Jacket", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[34,37,40,43,47,51,55,59], "Body Length at Back":[24.5,25.5,26.5,27.5,28.5,29.5,30.5,31.5], "Sleeve Length (Center Back)":[31.5,32.25,33,33.75,34.5,35.25,36,36.75] } },
  { label: "Sweater", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[35,38,41,44,48,52,56,60], "Sleeve from Shoulder":[30.5,31.25,32,32.75,33.5,34.25,35,35.75], "Body Length at Back":[24,25,26,27,28,29,30,31] } },
  { label: "Pants", gender: "women", primaryMeasure: "Waist", unit: "cm", sizes: ["0","2","4","6","8","10","12","14","16","18W","20W","22W","24W"], measurements: { Waist:[24,25,26,27,28,29.5,31,33,35,37,39,41,43], Hip:[34,35,36,37,38.5,40,41.5,43.5,45.5,47.5,49.5,51.5,53.5] } },
  { label: "Dress", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["0","2","4","6","8","10","12","14","16","18"], measurements: { Bust:[32,33,34,35,36,37.5,39,41,43,45], Waist:[24,25,26,27,28,29.5,31,33,35,37] } },
  { label: "Hat", gender: "women", primaryMeasure: "Head Circumference", unit: "cm", sizes: ["S","M","L","XL"], measurements: { "Head Circumference":[21.25,22.0,22.75,23.7] } },
];

function CustomSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 bg-background border border-border text-foreground hover:border-primary/60"
      >
        <span>{value}</span>
        <ChevronDown className="w-4 h-4 text-primary/50 transition-transform duration-200" style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-50 w-full mt-1.5 rounded-lg py-1 bg-background border border-border shadow-xl overflow-y-auto"
            style={{ maxHeight: "260px" }}
          >
            {options.map(opt => {
              const active = opt === value;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => { onChange(opt); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                    active
                      ? "text-primary bg-primary/8 font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 transition-colors ${active ? "bg-primary" : "bg-border"}`} />
                  {opt}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function findSize(chart: SizeChart, inputs: Record<string, string>) {
  const primaryValues = chart.measurements[chart.primaryMeasure];
  const userVal = parseFloat(inputs[chart.primaryMeasure] ?? "0");
  let bestIndex = 0, bestDiff = Infinity;
  primaryValues.forEach((v, i) => { const d = Math.abs(v - userVal); if (d < bestDiff) { bestDiff = d; bestIndex = i; } });
  const allMeasurements: Record<string, { chartValue: number; userValue: number | null }> = {};
  Object.entries(chart.measurements).forEach(([name, vals]) => {
    allMeasurements[name] = { chartValue: vals[bestIndex], userValue: inputs[name] ? parseFloat(inputs[name]) : null };
  });
  return { size: chart.sizes[bestIndex], allMeasurements };
}

export function FitDemo() {
  const [gender, setGender] = useState<"men" | "women">("men");
  const [selectedChart, setSelectedChart] = useState<SizeChart>(MEN_CHARTS[0]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const charts = gender === "men" ? MEN_CHARTS : WOMEN_CHARTS;
  const handleGenderChange = (g: "men" | "women") => { setGender(g); setSelectedChart(g === "men" ? MEN_CHARTS[0] : WOMEN_CHARTS[0]); setInputs({}); setStep(1); };
  const handleChartChange = (label: string) => { setSelectedChart(charts.find(c => c.label === label) ?? charts[0]); setInputs({}); setStep(1); };
  const handleAnalyze = () => { setIsAnalyzing(true); setTimeout(() => { setIsAnalyzing(false); setStep(2); }, 2000); };

  const result = findSize(selectedChart, inputs);
  const measurementKeys = Object.keys(selectedChart.measurements);
  const canAnalyze = !!inputs[selectedChart.primaryMeasure] && parseFloat(inputs[selectedChart.primaryMeasure]) > 0;

  return (
    <section className="py-24 px-6 relative" id="demo">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">Live Fit Intelligence</h2>
          <p className="text-muted-foreground">Enter your measurements to find your perfect size.</p>
        </div>

        <div className="rounded-2xl relative bg-card border border-border shadow-xl">
          {/* top accent line */}
          <div className="absolute top-0 inset-x-0 h-[1px] rounded-t-2xl bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="p-6 md:p-8 space-y-6">

            {/* Gender + Garment row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2 text-muted-foreground">Gender</label>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {(["men", "women"] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => handleGenderChange(g)}
                      className={`flex-1 py-3 text-sm font-medium capitalize transition-all duration-200 ${
                        gender === g
                          ? "bg-primary text-primary-foreground"
                          : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {g === "men" ? "Men" : "Women"}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2 text-muted-foreground">Garment Type</label>
                <CustomSelect value={selectedChart.label} onChange={handleChartChange} options={charts.map(c => c.label)} />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {step === 1 && !isAnalyzing && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">

                  {/* Measurement inputs */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-2.5 bg-muted border-b border-border">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Your Measurements ({selectedChart.unit}) — Primary:{" "}
                        <span className="text-primary font-bold">{selectedChart.primaryMeasure}</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      {measurementKeys.map((key, i) => (
                        <div
                          key={key}
                          className="px-4 py-3 bg-card border-b border-r border-border last:border-b-0"
                        >
                          <label className="text-xs font-medium block mb-1.5 text-muted-foreground">
                            {key}
                            {key === selectedChart.primaryMeasure && (
                              <span className="ml-1 text-primary font-bold">*</span>
                            )}
                          </label>
                          <input
                            type="number"
                            step="0.25"
                            placeholder={`e.g. ${selectedChart.measurements[key][2]}`}
                            value={inputs[key] ?? ""}
                            onChange={e => setInputs(prev => ({ ...prev, [key]: e.target.value }))}
                            className="w-full text-sm outline-none pb-1 bg-transparent text-foreground border-b-2 border-border focus:border-primary transition-colors placeholder:text-muted-foreground/50"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    data-testid="button-analyze-fit"
                    onClick={handleAnalyze}
                    disabled={!canAnalyze}
                    className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${
                      canAnalyze
                        ? "bg-primary text-primary-foreground hover:opacity-90"
                        : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"
                    }`}
                  >
                    <Activity className="w-4 h-4" />
                    Find My Size
                  </button>

                  {!canAnalyze && (
                    <p className="text-xs text-center text-muted-foreground">
                      Enter at least your {selectedChart.primaryMeasure} to continue.
                    </p>
                  )}
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 flex flex-col items-center justify-center space-y-6">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-1 text-foreground">Matching to Size Chart…</h3>
                    <p className="text-xs font-mono text-muted-foreground">{selectedChart.label} · {gender === "men" ? "Men" : "Women"}</p>
                  </div>
                  <div className="w-48 h-1 rounded-full overflow-hidden bg-muted">
                    <motion.div className="h-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "easeInOut" }} />
                  </div>
                </motion.div>
              )}

              {step === 2 && !isAnalyzing && (
                <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">

                  {/* Size result banner */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl p-6 bg-primary/10 border border-primary/25">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-xs uppercase tracking-widest mb-1 text-muted-foreground">
                        {gender === "men" ? "Men's" : "Women's"} {selectedChart.label}
                      </p>
                      <h3 className="text-base font-medium text-foreground">Recommended Size</h3>
                    </div>
                    <div className="text-7xl font-bold leading-none text-primary">{result.size}</div>
                  </div>

                  {/* Measurement breakdown */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-2.5 bg-muted border-b border-border">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Chart Values for Size {result.size}
                      </p>
                    </div>
                    {Object.entries(result.allMeasurements).map(([name, data], i, arr) => (
                      <div
                        key={name}
                        className={`flex items-center justify-between px-4 py-3 text-sm bg-card ${i < arr.length - 1 ? "border-b border-border" : ""}`}
                      >
                        <span className="text-muted-foreground">{name}</span>
                        <div className="flex items-center gap-3">
                          {data.userValue !== null && (
                            <span className="text-xs text-muted-foreground/60">yours: {data.userValue}"</span>
                          )}
                          <span className="font-mono font-medium text-foreground">{data.chartValue}"</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    data-testid="button-reset-analysis"
                    onClick={() => { setStep(1); setInputs({}); }}
                    className="w-full text-xs flex items-center justify-center gap-2 py-2 uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                  >
                    <RefreshCcw className="w-3 h-3" />
                    Try Another Garment
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
