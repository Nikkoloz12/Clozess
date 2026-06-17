import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Globe2, ShieldCheck, ArrowRight, Loader2, CheckCircle2, X, Activity, ChevronRight } from "lucide-react";
import { FitDemo } from "./FitDemo";

export function B2B({ t, tDemo }: { t: typeof import("../../i18n").translations["en"]["b2b"]; tDemo: typeof import("../../i18n").translations["en"]["demo"] }) {  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [demoOpen, setDemoOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.company) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || ""}/api/integration-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json();
        setError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 px-6 bg-secondary/20 border-y border-border" id="business">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6 uppercase tracking-widest">
{t.badge}          
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
{t.title}
          </h2>
          <p className="text-lg text-muted-foreground">
{t.subtitle}
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: Code2, title: t.feature1.title, desc: t.feature1.desc },
            { icon: Globe2, title: t.feature2.title, desc: t.feature2.desc },
            { icon: ShieldCheck, title: t.feature3.title, desc: t.feature3.desc }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border p-8 rounded-2xl"
            >
              <feature.icon className="w-8 h-8 text-primary mb-6" />
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Live demo — full width, premium feel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20 rounded-3xl overflow-hidden border border-border relative"
          style={{ background: "linear-gradient(135deg, hsl(var(--card)) 0%, hsl(var(--secondary)/0.5) 100%)" }}
        >
          {/* Top accent */}
          <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left: copy */}
            <div className="p-10 md:p-14 flex flex-col justify-center">
              <span className="text-xs font-mono text-primary uppercase tracking-widest mb-4">Live Demo</span>
              <h3 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
{t.demoTitle}
              </h3>
              <p className="text-muted-foreground mb-8 leading-relaxed">
{t.demoSubtitle}
              </p>
              <div className="space-y-3 mb-8">
                {t.demoPoints.map(point => (
                  <div key={point} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                    {point}
                  </div>
                ))}
              </div>
              <button
                onClick={() => setDemoOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors text-sm w-fit"
              >
                <Activity className="w-4 h-4" />
{t.launchDemo}
              </button>
            </div>

            {/* Right: visual preview */}
            <div className="relative p-8 md:p-10 flex items-center justify-center bg-secondary/30 border-l border-border">
              {/* Fake browser chrome */}
              <div className="w-full max-w-sm">
                <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
                  {/* Browser bar */}
                  <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-secondary/50">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <div className="flex-1 mx-3 bg-background rounded-md px-3 py-1 text-xs text-muted-foreground font-mono">
                      yourbrand.com/products
                    </div>
                  </div>
                  {/* Page content */}
                  <div className="p-5">
                    <div className="h-2.5 bg-muted rounded-full w-3/4 mb-2" />
                    <div className="h-2 bg-muted/60 rounded-full w-1/2 mb-5" />
                    <div className="h-32 bg-muted/30 rounded-xl mb-4 flex items-center justify-center border border-border">
                      <span className="text-xs text-muted-foreground">Product Image</span>
                    </div>
                    <div className="h-2 bg-muted/60 rounded-full w-2/3 mb-2" />
                    <div className="h-2 bg-muted/40 rounded-full w-1/2 mb-4" />
                    {/* The widget button */}
                    <button
                      onClick={() => setDemoOpen(true)}
                      className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
                    >
                      <Activity className="w-3.5 h-3.5" />
{t.findMyFit}
                    </button>
                  </div>
                </div>
                <p className="text-center text-xs text-muted-foreground mt-3">Powered by <strong>Clozes</strong></p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Integration request form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-card border border-border rounded-2xl p-8"
        >
          {submitted ? (
            <div className="text-center py-8">
              <div className="mx-auto w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{t.success}</h3>
              <p className="text-muted-foreground">{t.successMsg}</p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">{t.formTitle}</h3>
              <p className="text-muted-foreground text-sm mb-6">{t.formSubtitle}</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">{t.name} *</label>
                    <input type="text" required placeholder="John Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">{t.email} *</label>
                    <input type="email" required placeholder="john@yourbrand.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">{t.company} *</label>
                  <input type="text" required placeholder="Your Brand" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">{t.message}</label>
                  <textarea rows={3} placeholder={t.messagePlaceholder} value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>{t.submit}</span>
<ArrowRight className="w-4 h-4" /></>}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>

      {/* Full FitDemo modal */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            onClick={() => setDemoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-background"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setDemoOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-secondary border border-border text-foreground hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
          <FitDemo t={tDemo} />            
          </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
