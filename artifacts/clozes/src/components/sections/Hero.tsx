import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Model background image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/75 to-background/20 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/40 z-10" />
        <img
          src="/images/model-blazer.png"
          alt="Fashion model"
          className="absolute right-0 top-0 h-full w-1/2 object-cover object-top"
        />
      </div>

      {/* Decorative ambient glow */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-screen py-32">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/70 border border-border text-sm mb-8 backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Clozes Engine v2.0 Live</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.05]"
          >
            Experience Clothes<br />
            <span className="text-primary">Before You</span><br />
            Wear Them.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed"
          >
            AI-powered fit intelligence that predicts comfort, sizing, and outfit
            compatibility before you buy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <a
              href="#demo"
              data-testid="button-try-demo"
              className="px-8 py-4 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all glow-effect flex items-center gap-2 group"
            >
              Try the Demo
              <Activity className="w-4 h-4 group-hover:animate-pulse" />
            </a>
            <a
              href="#waitlist"
              data-testid="button-early-access"
              className="px-8 py-4 rounded-lg bg-secondary text-foreground font-medium hover:bg-muted border border-border transition-all flex items-center gap-2 group"
            >
              Join Early Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Floating stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="mt-14 flex gap-8"
          >
            {[
              { value: "67%", label: "Fewer Returns" },
              { value: "89%", label: "Fit Accuracy" },
              { value: "3s", label: "Analysis Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right side: floating fit analysis UI (visible at larger screens above the model bg) */}
        <div className="hidden lg:flex flex-col items-end gap-4 pointer-events-none select-none">
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.5, ease: "easeOut" }}
            className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl p-5 w-56 glow-border"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-mono">Fit Score</div>
            <div className="text-4xl font-bold text-primary mb-1">89%</div>
            <div className="text-sm text-muted-foreground">Compatibility</div>
            <div className="mt-3 h-1.5 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "89%" }}
                transition={{ duration: 1.2, delay: 1, ease: "easeOut" }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.65, ease: "easeOut" }}
            className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl p-5 w-56"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-3 font-mono">Recommended</div>
            <div className="text-3xl font-bold mb-1">Medium</div>
            <div className="text-sm text-muted-foreground">94% confidence</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: "easeOut" }}
            className="bg-background/80 backdrop-blur-xl border border-border rounded-2xl p-5 w-56"
          >
            <div className="space-y-2">
              {[
                { label: "Comfort", val: 82 },
                { label: "Mobility", val: 91 },
              ].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-mono text-foreground">{m.val}%</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary/70"
                      initial={{ width: 0 }}
                      animate={{ width: `${m.val}%` }}
                      transition={{ duration: 1.2, delay: 1.1, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-40 z-10">
        <ChevronRight className="w-6 h-6 rotate-90 text-foreground" />
      </div>
    </section>
  );
}
