import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Input Dimensions",
    description: "Share basic measurements: height, weight, and general body shape. Our AI establishes a baseline profile.",
  },
  {
    num: "02",
    title: "Neural Analysis",
    description: "The Clozes Engine maps the garment's technical specs against your unique body geometry in 3D space.",
  },
  {
    num: "03",
    title: "Predictive Fit",
    description: "Receive detailed comfort scores, tightness heatmaps, and a definitive size recommendation before you buy.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-secondary/40 relative overflow-hidden" id="how-it-works">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Intelligence <br /><span className="text-muted-foreground">In Motion.</span>
            </motion.h2>

            <div className="space-y-8 mt-12">
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
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-mono text-sm border shrink-0 ${
                      idx === 0
                        ? "bg-primary/15 border-primary text-primary shadow-[0_0_15px_hsl(var(--primary)/0.25)]"
                        : "border-border text-muted-foreground group-hover:border-primary/50 transition-colors"
                    }`}>
                      {step.num}
                    </div>
                    {idx < steps.length - 1 && (
                      <div className="w-[1px] h-full bg-border my-2 group-hover:bg-primary/30 transition-colors" />
                    )}
                  </div>
                  <div className="pb-8">
                    <h3 className={`text-xl font-semibold mb-2 ${idx === 0 ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/80"}`}>
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: model photo with scanning overlay */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[600px] rounded-2xl border border-border overflow-hidden"
          >
            <img
              src="/images/model-trousers.png"
              alt="AI body fit analysis on model"
              className="w-full h-full object-cover object-top"
            />
            {/* Overlay tint */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />

            {/* Animated scan line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-primary/70 shadow-[0_0_16px_hsl(var(--primary)/0.7)]"
              animate={{ top: ["5%", "95%", "5%"] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />

            {/* Corner data badges */}
            <div className="absolute top-5 left-5 px-3 py-1.5 bg-background/80 backdrop-blur border border-border rounded-lg text-xs font-mono text-primary flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              ANALYSIS_ACTIVE
            </div>

            <div className="absolute bottom-5 right-5 px-3 py-2 bg-background/80 backdrop-blur border border-border rounded-lg text-xs font-mono text-muted-foreground space-y-0.5">
              <div>VOL: 24,051cm³</div>
              <div>GEO: F-TYPE</div>
              <div className="text-primary">MATCH: 89%</div>
            </div>

            {/* Shoulder measurement indicator */}
            <div className="absolute top-1/3 left-0 right-0 flex justify-center pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1 bg-background/70 backdrop-blur border border-primary/30 rounded-full text-xs font-mono text-primary">
                <span className="w-1 h-1 rounded-full bg-primary" />
                Shoulder: 42cm — Optimal
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
