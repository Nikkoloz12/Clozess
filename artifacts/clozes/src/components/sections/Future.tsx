import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const statusConfig = {
  live: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  building: { icon: Clock, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  planned: { icon: Circle, color: "text-muted-foreground", bg: "bg-secondary border-border" },
};

export function Future({ t }: { t: typeof import("../../i18n").translations["en"]["future"] }) {
  const roadmap = [
    { status: "live", label: t.liveNow, title: t.item1.title, description: t.item1.desc },
    { status: "live", label: t.liveNow, title: t.item2.title, description: t.item2.desc },
    { status: "building", label: t.inDevelopment, title: t.item3.title, description: t.item3.desc },
    { status: "building", label: t.inDevelopment, title: t.item4.title, description: t.item4.desc },
    { status: "planned", label: t.comingSoon, title: t.item5.title, description: t.item5.desc },
    { status: "planned", label: t.comingSoon, title: t.item6.title, description: t.item6.desc },
  ];
  return (
    <section className="py-24 px-6 bg-secondary/20 relative" id="roadmap">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-mono text-primary uppercase tracking-widest mb-4"
          >
{t.badge}
          </motion.p>
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
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
{t.subtitle}
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roadmap.map((item, i) => {
            const config = statusConfig[item.status as keyof typeof statusConfig];
            const Icon = config.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`bg-card border rounded-xl p-6 ${
                  item.status === "planned" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${config.bg} ${config.color}`}>
                    {item.label}
                  </span>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          {t.cta}{" "}
          <a href="mailto:hello@clozes.app" className="text-primary hover:underline">
            {t.ctaLink}
          </a>
        </motion.p>
      </div>
    </section>
  );
}
