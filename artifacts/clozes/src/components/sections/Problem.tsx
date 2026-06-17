import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Ruler, RefreshCcw, TrendingDown } from "lucide-react";

export function Problem({ t }: { t: typeof import("../../i18n").translations["en"]["problem"] }) {
  const problems = [
    { title: t.card1.title, description: t.card1.desc, icon: Ruler, stat: t.card1.stat, statLabel: t.card1.statLabel, source: "Barclaycard, 2023" },
    { title: t.card2.title, description: t.card2.desc, icon: RefreshCcw, stat: t.card2.stat, statLabel: t.card2.statLabel, source: "Shopify & Klarna, 2023" },
    { title: t.card3.title, description: t.card3.desc, icon: TrendingDown, stat: t.card3.stat, statLabel: t.card3.statLabel, source: "NRF & Happy Returns, 2023" },
    { title: t.card4.title, description: t.card4.desc, icon: AlertCircle, stat: t.card4.stat, statLabel: t.card4.statLabel, source: "True Fit Consumer Survey, 2022" },
  ];
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
            {t.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
{t.subtitle}
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
