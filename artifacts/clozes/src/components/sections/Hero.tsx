import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Activity, ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center pt-20 pb-16">

        {/* Left: copy */}
        <div className="order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/70 border border-border text-sm mb-5 backdrop-blur-sm"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-muted-foreground">Now Onboarding Brand Partners</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.08]"
          >
            Experience Clothes<br />
            <span className="text-primary">Before You</span><br />
            Wear Them.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.22, ease: "easeOut" }}
            className="text-base md:text-lg text-muted-foreground max-w-lg mb-7 leading-relaxed"
          >
            AI-powered fit intelligence that predicts comfort, sizing, and outfit
            compatibility before your customers buy — reducing returns and increasing trust.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.32, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-start gap-3 mb-8"
          >
            <a
              href="#demo"
              data-testid="button-try-demo"
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all flex items-center gap-2 group text-sm glow-effect"
            >
              Try the Demo
              <Activity className="w-4 h-4 group-hover:animate-pulse" />
            </a>
            <a
              href="#waitlist"
              data-testid="button-early-access"
              className="px-6 py-3 rounded-lg bg-secondary text-foreground font-medium hover:bg-muted border border-border transition-all flex items-center gap-2 group text-sm"
            >
              Join Early Access
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
            className="flex gap-8 pt-2 border-t border-border"
          >
            {[
              { value: "67%", label: "Fewer Returns" },
              { value: "89%", label: "Fit Accuracy" },
              { value: "3s", label: "Analysis Time" },
            ].map((stat) => (
              <div key={stat.label} className="pt-4">
                <div className="text-2xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right: woman photo with AI scan overlay — visible on ALL screen sizes */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
          className="order-1 lg:order-2 relative h-72 sm:h-96 lg:h-[560px] rounded-2xl overflow-hidden border border-border shadow-xl"
        >
          {/* Woman photo */}
          <img
            src="/images/model-blazer.png"
            alt="AI body fit analysis"
            className="w-full h-full object-cover object-top"
          />

          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/15 to-background/25" />

          {/* AI grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Animated scan line */}
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-primary/70" style={{ willChange: "top" }}
            animate={{ top: ["5%", "95%", "5%"] }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />

          {/* Top left badge */}
          <div className="absolute top-3 left-3 px-2.5 py-1.5 bg-background/80 backdrop-blur border border-border rounded-lg text-xs font-mono text-primary flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            ANALYSIS_ACTIVE
          </div>

          {/* Shoulder measurement */}
          <div className="absolute top-1/3 left-0 right-0 flex justify-center pointer-events-none">
            <div className="flex items-center gap-2 px-2.5 py-1 bg-background/70 backdrop-blur border border-primary/30 rounded-full text-xs font-mono text-primary">
              <span className="w-1 h-1 rounded-full bg-primary" />
              Shoulder: 42cm — Optimal
            </div>
          </div>

          {/* Bottom right data */}
          <div className="absolute bottom-3 right-3 px-2.5 py-2 bg-background/80 backdrop-blur border border-border rounded-lg text-xs font-mono text-muted-foreground space-y-0.5">
            <div>VOL: 24,051cm³</div>
            <div>GEO: F-TYPE</div>
            <div className="text-primary">MATCH: 89%</div>
          </div>

          {/* Fit score card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="absolute bottom-3 left-3 bg-background/85 backdrop-blur border border-border rounded-xl p-3 w-32"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Fit Score</div>
            <div className="text-2xl font-bold text-primary mb-1">89%</div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: "89%" }}
                transition={{ duration: 1.2, delay: 1.2, ease: "easeOut" }}
              />
            </div>
            <div className="mt-2 space-y-1.5">
              {[{ label: "Comfort", val: 82 }, { label: "Mobility", val: 91 }].map((m) => (
                <div key={m.label}>
                  <div className="flex justify-between text-xs mb-0.5">
                    <span className="text-muted-foreground">{m.label}</span>
                    <span className="font-mono text-foreground">{m.val}%</span>
                  </div>
                  <div className="h-1 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary/60"
                      initial={{ width: 0 }}
                      animate={{ width: `${m.val}%` }}
                      transition={{ duration: 1.2, delay: 1.3, ease: "easeOut" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recommended size */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="absolute top-3 right-3 bg-background/85 backdrop-blur border border-border rounded-xl p-3 w-28 text-center"
          >
            <div className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-mono">Size</div>
            <div className="text-3xl font-bold mb-0.5">M</div>
            <div className="text-xs text-muted-foreground">94% conf.</div>
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce opacity-30 z-10">
        <ChevronRight className="w-5 h-5 rotate-90 text-foreground" />
      </div>
    </section>
  );
}
