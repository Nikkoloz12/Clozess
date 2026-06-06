import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const roadmap = [
  {
    status: "live",
    label: "Live Now",
    title: "Size Finder",
    description: "Enter your measurements and get your exact size for any garment type — shirts, jackets, pants, and more.",
  },
  {
    status: "live",
    label: "Live Now",
    title: "Outfit Matching",
    description: "Pick any item and instantly see what goes with it from your store's catalog.",
  },
  {
    status: "building",
    label: "In Development",
    title: "Photo Body Scan",
    description: "Upload a photo and let our AI extract your measurements automatically — no tape measure needed.",
  },
  {
    status: "building",
    label: "In Development",
    title: "Brand API & SDK",
    description: "Drop our fit widget into any Shopify, WooCommerce, or custom store in under 10 minutes.",
  },
  {
    status: "planned",
    label: "Coming Soon",
    title: "Universal Fit Profile",
    description: "One profile that works across every Clozes-powered store. Shoppers never enter measurements twice.",
  },
  {
    status: "planned",
    label: "Coming Soon",
    title: "Return Rate Dashboard",
    description: "Real-time analytics showing how Clozes is reducing returns and increasing revenue for your brand.",
  },
];

const statusConfig = {
  live: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10 border-emerald-500/20" },
  building: { icon: Clock, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
  planned: { icon: Circle, color: "text-muted-foreground", bg: "bg-secondary border-border" },
};

export function Future() {
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
            Product Roadmap
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            What we're building.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-xl mx-auto"
          >
            We're moving fast. Here's exactly where we are and what's coming next.
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
          Want to shape what we build next?{" "}
          <a href="mailto:hello@clozes.app" className="text-primary hover:underline">
            Tell us what your brand needs.
          </a>
        </motion.p>
      </div>
    </section>
  );
}
