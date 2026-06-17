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
  { label: "Short Sleeve T-Shirt", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[94,101.6,109.2,116.8,124.5,132,142.2,152.4], "Body Length":[68.6,71.1,73.7,76.2,78.7,81.3,82.6,83.8], "Sleeve Length":[43.2,47,48.9,50.8,52.7,54.6,56.5,58.4] } },
  { label: "Long Sleeve T-Shirt", gender: "men", primaryMeasure: "Body Length", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { "Body Length":[96.5,104.1,111.8,119.4,129.5,139.7,149.9,160], "Sleeve Length (Center Back)":[66,68,69.9,71.8,73.7,75.6,77.5,79.4], "Body Length at Back":[71.1,73.7,76.2,78.7,81.3,83.8,86.4,88.9] } },
  { label: "Polo Shirt", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"], measurements: { Chest:[95.3,102.9,110.5,118.1,125.7,133.4,143.5,153.7,163.8,174], "Sleeve Length":[50.2,52.1,54,55.9,57.8,59.7,61.6,63.5,64.8,64.8], "Body Length at Back":[71.1,73.7,76.2,78.7,81.3,83.8,85.1,86.4,87.6,88.9] } },
  { label: "Tank Top", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[91.4,99.1,106.7,114.3,121.9,129.5,139.7,149.9], "Body Length at Back":[69.9,72.4,74.9,77.5,80,82.6,85.1,87.6] } },
  { label: "Sweatshirt / Hoodie", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[96.5,101.6,109.2,116.8,124.5,132,142.2,152.4], "Body Length at Back":[69.9,71.1,72.4,73.7,74.9,76.2,77.5,78.7], "Sleeve Length (Center Back)":[83.8,86.4,88.9,91.4,94,96.5,99.1,100.3] } },
  { label: "Jacket", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[96.5,104.1,111.8,119.4,127,134.6,144.8,155], "Body Length at Back":[69.9,72.4,74.9,77.5,80,82.6,83.8,85.1], "Sleeve Length (Center Back)":[88.3,90.2,92.1,94,96,97.8,99.7,101.6] } },
  { label: "Sweater", gender: "men", primaryMeasure: "Chest", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Chest:[99.1,106.7,114.3,121.9,129.5,137.2,147.3,157.5], "Sleeve from Shoulder":[84.5,86.4,88.3,90.2,92.1,94,96,97.8], "Body Length at Back":[66.7,68.6,70.5,72.4,74.3,76.2,78.1,80] } },
  { label: "Pants", gender: "men", primaryMeasure: "Waist (Relaxed)", unit: "cm", sizes: ["28W","30W","32W","34W","36W","38W","40W","42W","44W","46W","48W","50W"], measurements: { "Waist (Relaxed)":[67.3,72.4,77.5,82.6,87.6,92.7,97.8,102.9,108,113,118.1,123.2], "Waist (Extended)":[76.2,81.3,86.4,91.4,96.5,101.6,106.7,111.8,116.8,121.9,127,132.1], "Cuff Opening":[42.5,43.2,43.8,44.5,45.1,45.7,46.4,47,47.6,48.3,48.9,49.5] } },
  { label: "Hat", gender: "men", primaryMeasure: "Head Circumference", unit: "cm", sizes: ["S","M","L","XL","XXL","XXXL"], measurements: { "Head Circumference":[54,55.9,57.8,60.1,62,64.5] } },
];

const WOMEN_CHARTS: SizeChart[] = [
  { label: "Short Sleeve T-Shirt", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[81.3,88.9,96.5,104.1,114.3,124.5,134.6,144.8], "Body Length":[62.2,64.8,67.3,69.9,72.4,74.9,77.5,80], "Sleeve Length":[34.3,35.6,36.8,38.1,39.4,40.6,41.9,43.2] } },
  { label: "Long Sleeve T-Shirt", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[81.3,88.9,96.5,104.1,114.3,124.5,134.6,144.8], "Sleeve Length (Center Back)":[73.7,74.9,76.2,77.5,78.7,80,81.3,82.6], "Body Length at Back":[63.5,66,68.6,71.1,73.7,76.2,78.7,81.3] } },
  { label: "Polo Shirt", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"], measurements: { Bust:[83.8,91.4,99.1,106.7,116.8,127,137.2,147.3,157.5,167.6], "Sleeve Length":[36.8,38.1,39.4,40.6,41.9,43.2,44.5,45.7,47,48.3], "Body Length at Back":[63.5,66,68.6,71.1,73.7,76.2,78.7,81.3,82.6,83.8] } },
  { label: "Tank Top", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[78.7,86.4,94,101.6,111.8,121.9,132,142.2], "Body Length at Back":[61,63.5,66,68.6,71.1,73.7,76.2,78.7] } },
  { label: "Sweatshirt / Hoodie", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[86.4,94,101.6,109.2,119.4,129.5,139.7,149.9], "Body Length at Back":[63.5,66,68.6,71.1,73.7,76.2,78.7,81.3], "Sleeve Length (Center Back)":[78.7,81.3,83.8,86.4,88.9,91.4,94,96.5] } },
  { label: "Jacket", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[86.4,94,101.6,109.2,119.4,129.5,139.7,149.9], "Body Length at Back":[62.2,64.8,67.3,69.9,72.4,74.9,77.5,80], "Sleeve Length (Center Back)":[80,81.9,83.8,85.7,87.6,89.5,91.4,93.3] } },
  { label: "Sweater", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"], measurements: { Bust:[88.9,96.5,104.1,111.8,121.9,132,142.2,152.4], "Sleeve from Shoulder":[77.5,79.4,81.3,83.2,85.1,87,88.9,90.8], "Body Length at Back":[61,63.5,66,68.6,71.1,73.7,76.2,78.7] } },
  { label: "Pants", gender: "women", primaryMeasure: "Waist", unit: "cm", sizes: ["0","2","4","6","8","10","12","14","16","18W","20W","22W","24W"], measurements: { Waist:[61,63.5,66,68.6,71.1,74.9,78.7,83.8,88.9,94,99.1,104.1,109.2], Hip:[86.4,88.9,91.4,94,97.8,101.6,105.4,110.5,115.6,120.7,125.7,130.8,135.9] } },
  { label: "Dress", gender: "women", primaryMeasure: "Bust", unit: "cm", sizes: ["0","2","4","6","8","10","12","14","16","18"], measurements: { Bust:[81.3,83.8,86.4,88.9,91.4,95.3,99.1,104.1,109.2,114.3], Waist:[61,63.5,66,68.6,71.1,74.9,78.7,83.8,88.9,94] } },
  { label: "Hat", gender: "women", primaryMeasure: "Head Circumference", unit: "cm", sizes: ["S","M","L","XL"], measurements: { "Head Circumference":[54,55.9,57.8,60.1] } },
];

const GARMENT_LABELS: Record<string, string> = {
  "Short Sleeve T-Shirt": "მაისური მოკლე სახელოებით",
  "Long Sleeve T-Shirt": "მაისური გრძელი სახელოებით",
  "Polo Shirt": "პოლო პერანგი",
  "Tank Top": "მაისური მკლავების გარეშე",
  "Sweatshirt / Hoodie": "თბილი მაისური / ჰუდი",
  "Jacket": "ქურთუკი",
  "Sweater": "სვიტერი",
  "Pants": "შარვალი",
  "Hat": "ქუდი",
  "Dress": "კაბა",
};

const MEASUREMENT_LABELS: Record<string, string> = {
  "Chest": "მკერდი",
  "Bust": "მკერდი",
  "Body Length": "სხეულის სიგრძე",
  "Body Length at Back": "სხეულის სიგრძე უკნიდან",
  "Sleeve Length": "სახელოს სიგრძე",
  "Sleeve Length (Center Back)": "სახელოს სიგრძე (ცენტრში)",
  "Sleeve from Shoulder": "სახელოს სიგრძე მხრიდან",
  "Waist": "წელი",
  "Waist (Relaxed)": "წელი (მოდუნებული)",
  "Waist (Extended)": "წელი (გაჭიმული)",
  "Hip": "თეძო",
  "Cuff Opening": "სახელოს ბოლო",
  "Head Circumference": "თავის გარშემოწერილობა",
};

const DEFAULT_DEMO = {
  title: "Live Fit Intelligence",
  subtitle: "Enter your measurements to find your perfect size.",
  men: "Men",
  women: "Women",
  garmentType: "Garment Type",
  measurements: "Your Measurements (CM) — Primary:",
  findMySize: "Find My Size",
  enterMeasurement: "Enter at least your",
  toContinue: "to continue.",
  recommendedSize: "Recommended Size",
  chartValues: "Chart Values For Size",
  yours: "yours:",
  tryAnother: "Try Another Garment",
};

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
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${active ? "text-primary bg-primary/8 font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
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

export function FitDemo({ t }: { t?: typeof DEFAULT_DEMO }) {
  const demo = t ?? DEFAULT_DEMO;
  const isKa = demo.men === "კაცი";
const getGarmentLabel = (label: string) => isKa ? (GARMENT_LABELS[label] || label) : label;
const getMeasurementLabel = (label: string) => isKa ? (MEASUREMENT_LABELS[label] || label) : label;
  const garmentLabels: Record<string, string> = demo.garments ?? {};
const measurementLabels: Record<string, string> = demo.measurementNames ?? {};
  const [gender, setGender] = useState<"men" | "women">("men");
  const [selectedChart, setSelectedChart] = useState<SizeChart>(MEN_CHARTS[0]);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const charts = gender === "men" ? MEN_CHARTS : WOMEN_CHARTS;
  const handleGenderChange = (g: "men" | "women") => { setGender(g); setSelectedChart(g === "men" ? MEN_CHARTS[0] : WOMEN_CHARTS[0]); setInputs({}); setStep(1); };
const handleChartChange = (translatedLabel: string) => {
  const original = charts.find(c => getGarmentLabel(c.label) === translatedLabel);
  setSelectedChart(original ?? charts[0]);
  setInputs({});
  setStep(1);
};
  const handleAnalyze = () => { setIsAnalyzing(true); setTimeout(() => { setIsAnalyzing(false); setStep(2); }, 2000); };

  const result = findSize(selectedChart, inputs);
  const measurementKeys = Object.keys(selectedChart.measurements);
  const canAnalyze = !!inputs[selectedChart.primaryMeasure] && parseFloat(inputs[selectedChart.primaryMeasure]) > 0;

  return (
    <section className="py-24 px-6 relative" id="demo">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">{demo.title}</h2>
          <p className="text-muted-foreground">{demo.subtitle}</p>
        </div>

        <div className="rounded-2xl relative bg-card border border-border shadow-xl">
          <div className="absolute top-0 inset-x-0 h-[1px] rounded-t-2xl bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div className="p-6 md:p-8 space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2 text-muted-foreground">Gender</label>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  {(["men", "women"] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => handleGenderChange(g)}
                      className={`flex-1 py-3 text-sm font-medium capitalize transition-all duration-200 ${gender === g ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground hover:bg-muted"}`}
                    >
                      {g === "men" ? demo.men : demo.women}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest block mb-2 text-muted-foreground">{demo.garmentType}</label>
<CustomSelect value={getGarmentLabel(selectedChart.label)} onChange={handleChartChange} options={charts.map(c => getGarmentLabel(c.label))} />              </div>
            </div>
            <AnimatePresence mode="wait">
              {step === 1 && !isAnalyzing && (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-2.5 bg-muted border-b border-border">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {demo.measurements}{" "}
<span className="text-primary font-bold">{getMeasurementLabel(selectedChart.primaryMeasure)}</span>
                      </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                      {measurementKeys.map((key) => (
                        <div key={key} className="px-4 py-3 bg-card border-b border-r border-border last:border-b-0">
                          <label className="text-xs font-medium block mb-1.5 text-muted-foreground">
                            {getMeasurementLabel(key)}
{key === selectedChart.primaryMeasure && <span className="ml-1 text-primary font-bold">*</span>}
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
                    className={`w-full py-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 text-sm ${canAnalyze ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-muted text-muted-foreground cursor-not-allowed opacity-50"}`}
                  >
                    <Activity className="w-4 h-4" />
                    {demo.findMySize}
                  </button>

                  {!canAnalyze && (
                    <p className="text-xs text-center text-muted-foreground">
                      {demo.enterMeasurement} {selectedChart.primaryMeasure} {demo.toContinue}
                    </p>
                  )}
                </motion.div>
              )}

              {isAnalyzing && (
                <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-16 flex flex-col items-center justify-center space-y-6">
                  <Loader2 className="w-10 h-10 animate-spin text-primary" />
                  <div className="text-center">
                    <h3 className="text-lg font-medium mb-1 text-foreground">{demo.title}…</h3>
                    <p className="text-xs font-mono text-muted-foreground">{selectedChart.label} · {gender === "men" ? demo.men : demo.women}</p>
                  </div>
                  <div className="w-48 h-1 rounded-full overflow-hidden bg-muted">
                    <motion.div className="h-full bg-primary" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 2, ease: "easeInOut" }} />
                  </div>
                </motion.div>
              )}

              {step === 2 && !isAnalyzing && (
                <motion.div key="results" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
                  <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl p-6 bg-primary/10 border border-primary/25">
                    <div className="flex-1 text-center sm:text-left">
                      <p className="text-xs uppercase tracking-widest mb-1 text-muted-foreground">
                        {gender === "men" ? demo.men : demo.women} {selectedChart.label}
                      </p>
                      <h3 className="text-base font-medium text-foreground">{demo.recommendedSize}</h3>
                    </div>
                    <div className="text-7xl font-bold leading-none text-primary">{result.size}</div>
                  </div>

                  <div className="rounded-xl border border-border overflow-hidden">
                    <div className="px-4 py-2.5 bg-muted border-b border-border">
                      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {demo.chartValues} {result.size}
                      </p>
                    </div>
                    {Object.entries(result.allMeasurements).map(([name, data], i, arr) => (
                      <div key={name} className={`flex items-center justify-between px-4 py-3 text-sm bg-card ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                          <span className="text-muted-foreground">{getMeasurementLabel(name)}</span>                        <div className="flex items-center gap-3">
                          {data.userValue !== null && (
                            <span className="text-xs text-muted-foreground/60">{demo.yours} {data.userValue}cm</span>
                          )}
                          <span className="font-mono font-medium text-foreground">{data.chartValue}cm</span>
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
                    {demo.tryAnother}
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
