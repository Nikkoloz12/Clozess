import React, { useState } from "react";
import ReactDOM from "react-dom/client";

const API_URL = "https://workspaceapi-server-production-8cfb.up.railway.app";

const GARMENT_TYPES = [
  "Short Sleeve T-Shirt",
  "Long Sleeve T-Shirt",
  "Polo Shirt",
  "Tank Top",
  "Sweatshirt / Hoodie",
  "Jacket",
  "Sweater",
  "Pants",
  "Dress",
  "Hat",
];

const PRIMARY_MEASURES: Record<string, string> = {
  "Short Sleeve T-Shirt": "Chest",
  "Long Sleeve T-Shirt": "Chest",
  "Polo Shirt": "Chest",
  "Tank Top": "Chest",
  "Sweatshirt / Hoodie": "Chest",
  "Jacket": "Chest",
  "Sweater": "Chest",
  "Pants": "Waist",
  "Dress": "Bust",
  "Hat": "Head Circumference",
};

function Widget({ apiKey, garmentType: defaultGarment }: { apiKey: string; garmentType?: string }) {
  const [open, setOpen] = useState(false);
  const [gender, setGender] = useState<"men" | "women">("men");
  const [garmentType, setGarmentType] = useState(defaultGarment || "Short Sleeve T-Shirt");
  const [measurement, setMeasurement] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ recommendedSize: string; fitScore: number } | null>(null);
  const [error, setError] = useState("");

  const primaryMeasure = PRIMARY_MEASURES[garmentType] || "Chest";
  const measureKey = primaryMeasure.toLowerCase().replace(/ /g, "");

  const handleAnalyze = async () => {
    if (!measurement) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/api/fit/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
        body: JSON.stringify({
          garmentType,
          gender,
          measurements: { [measureKey]: parseFloat(measurement) },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setMeasurement("");
    setError("");
  };

  const styles: Record<string, React.CSSProperties> = {
    button: {
      backgroundColor: "#c8a951",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: 600,
      cursor: "pointer",
      fontFamily: "system-ui, sans-serif",
    },
    overlay: {
      position: "fixed",
      inset: 0,
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 999999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, sans-serif",
    },
    modal: {
      backgroundColor: "#fff",
      borderRadius: "16px",
      padding: "28px",
      width: "100%",
      maxWidth: "380px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      position: "relative",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "20px",
    },
    title: { fontSize: "18px", fontWeight: 700, color: "#1a1a1a", margin: 0 },
    close: { background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#666" },
    label: { display: "block", fontSize: "11px", fontWeight: 600, color: "#666", textTransform: "uppercase" as const, letterSpacing: "0.08em", marginBottom: "6px" },
    input: { width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" as const, outline: "none" },
    select: { width: "100%", padding: "10px 12px", border: "1px solid #e0e0e0", borderRadius: "8px", fontSize: "14px", boxSizing: "border-box" as const, outline: "none", backgroundColor: "#fff" },
    genderRow: { display: "flex", gap: "8px", marginBottom: "16px" },
    genderBtn: (active: boolean): React.CSSProperties => ({
      flex: 1,
      padding: "8px",
      border: `1px solid ${active ? "#c8a951" : "#e0e0e0"}`,
      borderRadius: "8px",
      background: active ? "#fdf8ec" : "#fff",
      color: active ? "#c8a951" : "#666",
      fontWeight: active ? 600 : 400,
      cursor: "pointer",
      fontSize: "13px",
    }),
    analyzeBtn: {
      width: "100%",
      padding: "12px",
      backgroundColor: "#c8a951",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      fontSize: "15px",
      fontWeight: 600,
      cursor: "pointer",
      marginTop: "16px",
    },
    result: {
      textAlign: "center" as const,
      padding: "20px 0",
    },
    size: { fontSize: "64px", fontWeight: 700, color: "#c8a951", lineHeight: 1 },
    score: { fontSize: "14px", color: "#666", marginTop: "8px" },
    powered: { textAlign: "center" as const, marginTop: "16px", fontSize: "11px", color: "#aaa" },
  };

  return (
    <>
      <button style={styles.button} onClick={() => setOpen(true)}>
        🔍 Find My Fit
      </button>

      {open && (
        <div style={styles.overlay} onClick={() => setOpen(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.header}>
              <p style={styles.title}>Find My Size</p>
              <button style={styles.close} onClick={() => { setOpen(false); reset(); }}>×</button>
            </div>

            {!result ? (
              <>
                <div style={styles.genderRow}>
                  <button style={styles.genderBtn(gender === "men")} onClick={() => setGender("men")}>Men</button>
                  <button style={styles.genderBtn(gender === "women")} onClick={() => setGender("women")}>Women</button>
                </div>

                <div style={{ marginBottom: "14px" }}>
                  <label style={styles.label}>Garment Type</label>
                  <select style={styles.select} value={garmentType} onChange={e => setGarmentType(e.target.value)}>
                    {GARMENT_TYPES.filter(g => gender === "women" || g !== "Dress").map(g => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: "4px" }}>
                  <label style={styles.label}>{primaryMeasure} (cm)</label>
                  <input
                    style={styles.input}
                    type="number"
                    placeholder={`e.g. ${primaryMeasure === "Chest" ? "100" : primaryMeasure === "Waist" ? "80" : "57"}`}
                    value={measurement}
                    onChange={e => setMeasurement(e.target.value)}
                  />
                </div>

                {error && <p style={{ color: "red", fontSize: "13px", marginTop: "8px" }}>{error}</p>}

                <button
                  style={{ ...styles.analyzeBtn, opacity: loading || !measurement ? 0.6 : 1 }}
                  onClick={handleAnalyze}
                  disabled={loading || !measurement}
                >
                  {loading ? "Analyzing..." : "Find My Size →"}
                </button>
              </>
            ) : (
              <div style={styles.result}>
                <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>Your recommended size</p>
                <div style={styles.size}>{result.recommendedSize}</div>
                <p style={styles.score}>Fit confidence: {result.fitScore}%</p>
                <button
                  style={{ ...styles.analyzeBtn, backgroundColor: "#f5f5f5", color: "#333", marginTop: "20px" }}
                  onClick={reset}
                >
                  Try Again
                </button>
              </div>
            )}

            <p style={styles.powered}>Powered by <strong>Clozes</strong> · clozes.app</p>
          </div>
        </div>
      )}
    </>
  );
}

// Auto-initialize from script tag attributes
const scripts = document.querySelectorAll("script[data-clozes-key]");
scripts.forEach(script => {
  const apiKey = script.getAttribute("data-clozes-key") || "";
  const garmentType = script.getAttribute("data-garment-type") || undefined;
  const targetId = script.getAttribute("data-target") || "clozes-widget";

  let container = document.getElementById(targetId);
  if (!container) {
    container = document.createElement("div");
    container.id = targetId;
    script.parentNode?.insertBefore(container, script.nextSibling);
  }

  ReactDOM.createRoot(container).render(
    <Widget apiKey={apiKey} garmentType={garmentType} />
  );
});
