import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Input Measurements",
    description: "Enter your body measurements or select your garment type. Our system builds a precise fit profile tailored to your dimensions.",
  },
  {
    num: "02",
    title: "Neural Analysis",
    description: "The Clozes Engine maps the garment's technical specs against your unique body geometry, analyzing fit across dozens of data points.",
  },
  {
    num: "03",
    title: "Confident Purchase",
    description: "Receive your recommended size with a detailed breakdown of comfort, mobility, and fit — before you spend a penny.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-secondary/30 relative overflow-hidden" id="how-it-works">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-mono text-primary uppercase tracking-widest mb-4"
            >
              How It Works
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
            >
              Intelligence <br /><span className="text-muted-foreground">In Motion.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-muted-foreground mb-12 max-w-md"
            >
              Three simple steps from measurement to confident purchase. No guesswork, no returns.
            </motion.p>

            <div className="space-y-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex gap-6 group cursor-default"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-11 h-11 rounded-full flex items-center justify-center font-mono text-sm border shrink-0 transition-all ${
                      idx === 0
                        ? "bg-primary/15 border-primary text-primary shadow-[0_0_15px_hsl(var(--primary)/0.2)]"
                        : "border-border text-muted-foreground group-hover:border-primary/40 group-hover:text-primary/60"
                    }`}>
                      {step.num}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-[1px] flex-1 bg-border my-2 min-h-[2rem] group-hover:bg-primary/20 transition-colors" />
                    )}
                  </div>
                  <div className="pb-6">
                    <h3 className={`text-lg font-semibold mb-1.5 transition-colors ${
                      idx === 0 ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"
                    }`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: clean photo, no scan animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] lg:h-[600px] rounded-2xl border border-border overflow-hidden shadow-lg"
          >
            <img
              src="/images/model-trousers.png"
              alt="Well-fitted clothing"
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />

            {/* Clean stats overlay at bottom — no scan animation */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-background/85 backdrop-blur border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Fit Analysis Complete</span>
                  <span className="text-xs font-mono text-primary">✓ Ready</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Size", value: "M" },
                    { label: "Fit Score", value: "89%" },
                    { label: "Confidence", value: "94%" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <div className="text-lg font-bold text-foreground">{item.value}</div>
                      <div className="text-xs text-muted-foreground">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
