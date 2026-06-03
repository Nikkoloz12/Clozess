import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Ruler, Scissors, RefreshCcw, Box } from "lucide-react";

const problems = [
  {
    title: "Inconsistent Sizing",
    description: "A medium from one brand is a large in another. Size charts are static and unreliable.",
    icon: Ruler,
    stat: "43%",
    statLabel: "of shoppers buy multiple sizes"
  },
  {
    title: "The Return Crisis",
    description: "Millions of perfectly good garments are shipped back and forth, driving up costs and emissions.",
    icon: RefreshCcw,
    stat: "67%",
    statLabel: "of online returns are size-related"
  },
  {
    title: "Fitting Room Frustration",
    description: "Even in-store, finding the right fit requires trying on countless variations.",
    icon: Scissors,
    stat: "2.5x",
    statLabel: "more time spent returning than shopping"
  },
  {
    title: "Uncertainty Before Buying",
    description: "Will it be too tight around the shoulders? Too loose at the waist? Photos don't tell the whole story.",
    icon: AlertCircle,
    stat: "89%",
    statLabel: "hesitate to buy from new brands online"
  }
];

export function Problem() {
  return (
    <section className="py-24 px-6 relative" id="problem">
      <div className="absolute inset-0 bg-background/50 z-0" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            The E-Commerce <span className="text-muted-foreground">Guessing Game</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Shopping for clothes online is broken. We rely on static size charts and models who don't share our body type.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {problems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-card/50 backdrop-blur-sm border border-card-border p-8 rounded-2xl glow-border hover:bg-card/80 transition-all group"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="p-3 bg-secondary/50 rounded-xl">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-right">
                  <span className="block text-3xl font-bold text-foreground group-hover:text-primary transition-colors">{item.stat}</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{item.statLabel}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
