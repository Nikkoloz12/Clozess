import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Globe2, ShieldCheck, ArrowRight, Loader2, CheckCircle2, X, Activity } from "lucide-react";
import { FitDemo } from "./FitDemo";

export function B2B() {
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
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
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6 uppercase tracking-widest">
            Clozes Platform
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Power Your Store With Fit Intelligence
          </h2>
          <p className="text-lg text-muted-foreground">
            Integrate our engine via API or drop-in UI components and watch return rates drop. Your customers get perfect fit every time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            { icon: Code2, title: "Drop-in SDK", desc: "Add a 'Find My Fit' button to your product pages in less than 10 lines of code. Fully white-labeled and customizable to match your brand." },
            { icon: Globe2, title: "Universal Profiles", desc: "When a shopper visits any Clozes-powered store, their fit profile travels with them. Zero friction, instant personalization." },
            { icon: ShieldCheck, title: "Proven ROI", desc: "Our partners see an average 38% decrease in size-related returns within the first quarter of integration." }
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

        {/* Live widget demo */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12 bg-card border border-border rounded-2xl p-8 text-center"
        >
          <p className="text-xs font-mono text-primary uppercase tracking-widest mb-3">Live Demo</p>
          <h3 className="text-xl font-bold mb-2">Try the widget yourself</h3>
          <p className="text-muted-foreground text-sm mb-6">This is exactly what your customers will see on your product pages.</p>
          <div className="border border-border rounded-xl p-6 bg-secondary/20 text-left mb-4">
            <h4 className="font-semibold mb-1">Blue Oxford Shirt — $89</h4>
            <p className="text-sm text-muted-foreground mb-4">Size: XS S M L XL 2XL</p>
            <button
              onClick={() => setDemoOpen(true)}
              className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              Find My Fit
            </button>
          </div>
          <p className="text-xs text-muted-foreground">Powered by <strong>Clozes</strong> · clozes.app</p>
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
              <h3 className="text-xl font-bold mb-2">Request Received!</h3>
              <p className="text-muted-foreground">We'll be in touch within 1 business day to discuss your integration.</p>
            </div>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">Request API Integration</h3>
              <p className="text-muted-foreground text-sm mb-6">Tell us about your store and we'll reach out to get you set up.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">Your Name *</label>
                    <input type="text" required placeholder="John Smith" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">Work Email *</label>
                    <input type="email" required placeholder="john@yourbrand.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">Company / Brand Name *</label>
                  <input type="text" required placeholder="Your Brand" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest block mb-1.5">Tell us about your store</label>
                  <textarea rows={3} placeholder="Monthly orders, platform (Shopify, WooCommerce, custom), main challenges with returns..." value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} className="w-full bg-background border border-border rounded-lg px-4 py-3 text-sm outline-none focus:border-primary transition-colors resize-none" />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Submit Integration Request</span><ArrowRight className="w-4 h-4" /></>}
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
              <FitDemo />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
