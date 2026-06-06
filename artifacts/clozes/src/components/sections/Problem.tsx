import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Ruler, RefreshCcw, TrendingDown } from "lucide-react";

const problems = [
  {
    title: "Inconsistent Sizing",
    description: "A medium from one brand is a large in another. Size charts are static, vary wildly across brands, and give shoppers no real guidance.",
    icon: Ruler,
    stat: "60%",
    statLabel: "of shoppers buy multiple sizes to return one",
    source: "Barclaycard, 2023"
  },
  {
    title: "The Return Crisis",
    description: "Fit and sizing issues are the single biggest driver of online fashion returns, costing brands billions and generating enormous waste.",
    icon: RefreshCcw,
    stat: "70%",
    statLabel: "of fashion returns are due to poor fit",
    source: "Shopify & Klarna, 2023"
  },
  {
    title: "Lost Revenue",
    description: "Returns don't just cost money to process — they destroy customer trust and reduce the chance of a repeat purchase significantly.",
    icon: TrendingDown,
    stat: "21%",
    statLabel: "lost globally to fashion returns annually",
    source: "NRF & Happy Returns, 2023"
  },
  {
    title: "Hesitation Before Buying",
    description: "Uncertainty about fit is the number one reason shoppers abandon carts or avoid buying from brands they haven't tried before.",
    icon: AlertCircle,
    stat: "64%",
    statLabel: "abandon purchase due to sizing uncertainty",
    source: "True Fit Consumer Survey, 2022"
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
            Shopping for clothes online is broken. Shoppers rely on static size charts and models who don't share their body type.
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
              className="bg-card/50 backdrop-blur-sm border border-border p-8 rounded-2xl hover:bg-card/80 transition-all group"
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
              <p className="text-muted-foreground mb-3">{item.description}</p>
              <p className="text-xs text-muted-foreground/50 font-mono">Source: {item.source}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
