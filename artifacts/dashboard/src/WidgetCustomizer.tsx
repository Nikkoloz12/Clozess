import React, { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "";

interface Settings {
  buttonText: string;
  buttonColor: string;
  buttonTextColor: string;
  poweredBy: string;
}

export function WidgetCustomizer({ apiKey }: { apiKey: string }) {
  const [settings, setSettings] = useState<Settings>({
    buttonText: "Find My Fit",
    buttonColor: "#c8a951",
    buttonTextColor: "#ffffff",
    poweredBy: "true",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/widget-settings`, { headers: { "x-api-key": apiKey } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.settings) setSettings(data.settings); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setSaved(false);
    try {
      const res = await fetch(`${API_URL}/api/widget-settings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": apiKey },
        body: JSON.stringify(settings),
      });
      if (res.ok) setSaved(true);
    } catch {}
    setSaving(false);
  };

  if (loading) return <div className="text-center py-12 text-stone-400 text-sm">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-stone-900">Widget Customization</h3>
        <p className="text-sm text-stone-500 mt-0.5">Customize how the Find My Fit button looks on your store.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings panel */}
        <div className="space-y-5">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5">
            <h4 className="font-semibold text-stone-900">Button Settings</h4>

            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Button Text</label>
              <input
                type="text"
                value={settings.buttonText}
                onChange={e => setSettings(s => ({ ...s, buttonText: e.target.value }))}
                className="w-full border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500"
                placeholder="Find My Fit"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Button Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.buttonColor}
                  onChange={e => setSettings(s => ({ ...s, buttonColor: e.target.value }))}
                  className="w-12 h-10 rounded-lg border border-stone-200 cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={settings.buttonColor}
                  onChange={e => setSettings(s => ({ ...s, buttonColor: e.target.value }))}
                  className="flex-1 border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 font-mono"
                  placeholder="#c8a951"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Text Color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={settings.buttonTextColor}
                  onChange={e => setSettings(s => ({ ...s, buttonTextColor: e.target.value }))}
                  className="w-12 h-10 rounded-lg border border-stone-200 cursor-pointer p-1"
                />
                <input
                  type="text"
                  value={settings.buttonTextColor}
                  onChange={e => setSettings(s => ({ ...s, buttonTextColor: e.target.value }))}
                  className="flex-1 border border-stone-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-amber-500 font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-stone-100">
              <div>
                <p className="text-sm font-medium text-stone-700">Show "Powered by Clozes"</p>
                <p className="text-xs text-stone-400">Displayed below the widget</p>
              </div>
              <button
                onClick={() => setSettings(s => ({ ...s, poweredBy: s.poweredBy === "true" ? "false" : "true" }))}
                className={`relative w-11 h-6 rounded-full transition-colors ${settings.poweredBy === "true" ? "bg-amber-500" : "bg-stone-200"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.poweredBy === "true" ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          {saved && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 font-medium text-center">
              ✓ Settings saved!
            </div>
          )}
        </div>

        {/* Live preview */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h4 className="font-semibold text-stone-900 mb-4">Live Preview</h4>
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 mb-4">
            <div className="h-3 bg-stone-200 rounded-full w-3/4 mb-2" />
            <div className="h-2 bg-stone-100 rounded-full w-1/2 mb-4" />
            <div className="h-24 bg-stone-100 rounded-lg mb-4" />
            <div className="h-2 bg-stone-100 rounded-full w-2/3 mb-2" />
            <div className="h-2 bg-stone-100 rounded-full w-1/2 mb-4" />
            <button
              style={{ backgroundColor: settings.buttonColor, color: settings.buttonTextColor }}
              className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
            >
              🔍 {settings.buttonText}
            </button>
            {settings.poweredBy === "true" && (
              <p className="text-xs text-stone-400 mt-2">Powered by <strong>Clozes</strong></p>
            )}
          </div>

          <div className="bg-stone-900 rounded-xl p-4 overflow-x-auto">
            <p className="text-xs text-stone-400 mb-2 font-mono">Your customized snippet:</p>
            <pre className="text-xs text-green-400 font-mono whitespace-pre">{`<script 
  src="https://widget.clozes.app/clozes-widget.iife.js"
  data-clozes-key="${apiKey}"
  data-garment-type="Short Sleeve T-Shirt"
  data-button-text="${settings.buttonText}"
  data-button-color="${settings.buttonColor}"
  data-text-color="${settings.buttonTextColor}">
</script>`}</pre>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h4 className="text-sm font-semibold text-blue-900 mb-1">💡 Brand consistency matters</h4>
        <p className="text-xs text-blue-700 leading-relaxed">Matching the widget to your brand colors makes customers more likely to use it. Brands that customize the widget see 23% higher engagement than those using defaults.</p>
      </div>
    </div>
  );
}
