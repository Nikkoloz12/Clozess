import React, { useState, useEffect } from "react";
import { Shield, Users, Plus, Trash2, ToggleLeft, ToggleRight, Copy, Check, LogOut, RefreshCw } from "lucide-react";

const API = "https://workspaceapi-server-production-8cfb.up.railway.app";

interface Brand {
  id: number;
  name: string;
  email: string;
  website: string;
  apiKey: string;
  active: boolean;
  createdAt: string;
  totalAnalyses: number;
}

function Login({ onLogin }: { onLogin: (secret: string) => void }) {
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API}/api/admin/brands`, {
        headers: { "x-admin-secret": secret }
      });
      if (res.ok) {
        localStorage.setItem("admin_secret", secret);
        onLogin(secret);
      } else {
        setError("Invalid admin secret");
      }
    } catch {
      setError("Connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ width: "100%", maxWidth: "400px", background: "#111", border: "1px solid #222", borderRadius: "16px", padding: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <Shield size={24} color="#d4a853" />
          <div>
            <div style={{ fontWeight: 700, fontSize: "18px" }}>Clozes Admin</div>
            <div style={{ color: "#666", fontSize: "13px" }}>Secure access only</div>
          </div>
        </div>
        <input
          type="password"
          placeholder="Admin secret"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSubmit()}
          style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", padding: "12px 16px", color: "#fff", fontSize: "14px", outline: "none", marginBottom: "12px" }}
        />
        {error && <div style={{ color: "#ef4444", fontSize: "13px", marginBottom: "12px" }}>{error}</div>}
        <button
          onClick={handleSubmit}
          disabled={loading || !secret}
          style={{ width: "100%", background: "#d4a853", color: "#000", border: "none", borderRadius: "8px", padding: "12px", fontWeight: 600, fontSize: "14px", cursor: "pointer", opacity: loading || !secret ? 0.5 : 1 }}
        >
          {loading ? "Verifying..." : "Access Admin Panel"}
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [secret, setSecret] = useState(() => localStorage.getItem("admin_secret") || "");
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newBrand, setNewBrand] = useState({ name: "", email: "", website: "" });
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");

  const headers = { "Content-Type": "application/json", "x-admin-secret": secret };

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/brands`, { headers });
      if (!res.ok) { setSecret(""); localStorage.removeItem("admin_secret"); return; }
      setBrands(await res.json());
    } catch { setError("Failed to load brands"); }
    finally { setLoading(false); }
  };

  useEffect(() => { if (secret) fetchBrands(); }, [secret]);

  const handleAdd = async () => {
    if (!newBrand.name || !newBrand.email) return;
    try {
      const res = await fetch(`${API}/api/admin/brands`, { method: "POST", headers, body: JSON.stringify(newBrand) });
      if (res.ok) { setShowAdd(false); setNewBrand({ name: "", email: "", website: "" }); fetchBrands(); }
    } catch { setError("Failed to add brand"); }
  };

  const handleToggle = async (brand: Brand) => {
    try {
      await fetch(`${API}/api/admin/brands/${brand.id}`, { method: "PATCH", headers, body: JSON.stringify({ active: !brand.active }) });
      fetchBrands();
    } catch { setError("Failed to update brand"); }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this brand? This cannot be undone.")) return;
    try {
      await fetch(`${API}/api/admin/brands/${id}`, { method: "DELETE", headers });
      fetchBrands();
    } catch { setError("Failed to delete brand"); }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  if (!secret) return <Login onLogin={setSecret} />;

  return (
    <div style={{ minHeight: "100vh", padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px", paddingBottom: "24px", borderBottom: "1px solid #222" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Shield size={24} color="#d4a853" />
          <div>
            <div style={{ fontWeight: 700, fontSize: "20px" }}>Clozes Admin</div>
            <div style={{ color: "#666", fontSize: "13px" }}>{brands.length} brands registered</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={fetchBrands} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", padding: "8px 14px", color: "#fff", cursor: "pointer", fontSize: "13px" }}>
            <RefreshCw size={14} /> Refresh
          </button>
          <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#d4a853", border: "none", borderRadius: "8px", padding: "8px 14px", color: "#000", cursor: "pointer", fontSize: "13px", fontWeight: 600 }}>
            <Plus size={14} /> Add Brand
          </button>
          <button onClick={() => { setSecret(""); localStorage.removeItem("admin_secret"); }} style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", padding: "8px 14px", color: "#666", cursor: "pointer", fontSize: "13px" }}>
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>

      {error && <div style={{ background: "#1a0000", border: "1px solid #ef4444", borderRadius: "8px", padding: "12px 16px", color: "#ef4444", marginBottom: "16px", fontSize: "13px" }}>{error}</div>}

      {/* Add Brand Modal */}
      {showAdd && (
        <div style={{ background: "#111", border: "1px solid #333", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <div style={{ fontWeight: 600, marginBottom: "16px" }}>Add New Brand</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {[["Brand Name *", "name"], ["Work Email *", "email"], ["Website", "website"]].map(([label, key]) => (
              <div key={key}>
                <div style={{ fontSize: "11px", color: "#666", marginBottom: "6px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</div>
                <input
                  type={key === "email" ? "email" : "text"}
                  value={newBrand[key as keyof typeof newBrand]}
                  onChange={e => setNewBrand(p => ({ ...p, [key]: e.target.value }))}
                  style={{ width: "100%", background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", padding: "10px 14px", color: "#fff", fontSize: "13px", outline: "none" }}
                />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleAdd} disabled={!newBrand.name || !newBrand.email} style={{ background: "#d4a853", border: "none", borderRadius: "8px", padding: "10px 20px", color: "#000", fontWeight: 600, cursor: "pointer", fontSize: "13px", opacity: !newBrand.name || !newBrand.email ? 0.5 : 1 }}>Create Brand</button>
            <button onClick={() => setShowAdd(false)} style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "8px", padding: "10px 20px", color: "#fff", cursor: "pointer", fontSize: "13px" }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Brands Table */}
      {loading ? (
        <div style={{ textAlign: "center", color: "#666", padding: "60px" }}>Loading brands...</div>
      ) : brands.length === 0 ? (
        <div style={{ textAlign: "center", color: "#666", padding: "60px" }}>No brands registered yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {brands.map(brand => (
            <div key={brand.id} style={{ background: "#111", border: `1px solid ${brand.active ? "#2a2a2a" : "#1a1a1a"}`, borderRadius: "12px", padding: "20px 24px", opacity: brand.active ? 1 : 0.6 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontWeight: 600, fontSize: "15px" }}>{brand.name}</span>
                      <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "999px", background: brand.active ? "#0a2a0a" : "#1a1a1a", color: brand.active ? "#4ade80" : "#666", border: `1px solid ${brand.active ? "#166534" : "#333"}` }}>
                        {brand.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div style={{ color: "#666", fontSize: "13px", marginTop: "2px" }}>{brand.email} {brand.website && `· ${brand.website}`}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "20px", fontWeight: 700, color: "#d4a853" }}>{brand.totalAnalyses}</div>
                    <div style={{ fontSize: "11px", color: "#666" }}>analyses</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <button onClick={() => copyKey(brand.apiKey)} title="Copy API Key" style={{ display: "flex", alignItems: "center", gap: "6px", background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", padding: "6px 10px", color: "#666", cursor: "pointer", fontSize: "11px", fontFamily: "monospace" }}>
                      {copied === brand.apiKey ? <Check size={12} color="#4ade80" /> : <Copy size={12} />}
                      {brand.apiKey.slice(0, 20)}...
                    </button>
                    <button onClick={() => handleToggle(brand)} title={brand.active ? "Deactivate" : "Activate"} style={{ background: "#1a1a1a", border: "1px solid #333", borderRadius: "6px", padding: "6px 8px", color: brand.active ? "#4ade80" : "#666", cursor: "pointer" }}>
                      {brand.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </button>
                    <button onClick={() => handleDelete(brand.id)} title="Delete" style={{ background: "#1a0000", border: "1px solid #330000", borderRadius: "6px", padding: "6px 8px", color: "#ef4444", cursor: "pointer" }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
              <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: "1px solid #1a1a1a", fontSize: "11px", color: "#444" }}>
                Registered: {new Date(brand.createdAt).toLocaleDateString()} · ID: {brand.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
