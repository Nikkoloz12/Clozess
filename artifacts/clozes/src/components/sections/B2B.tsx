import React from "react";
import { motion } from "framer-motion";
import { Code2, Globe2, ShieldCheck, ArrowRight } from "lucide-react";

export function B2B() {
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
            We're building the infrastructure for the next generation of e-commerce. Integrate our engine via API or drop-in UI components and watch return rates plummet.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Code2,
              title: "Drop-in SDK",
              desc: "Add a 'Find My Fit' button to your product pages in less than 10 lines of code. Fully white-labeled."
            },
            {
              icon: Globe2,
              title: "Universal Profiles",
              desc: "When a user shops on any Clozes-powered store, their fit profile travels with them. Zero friction."
            },
            {
              icon: ShieldCheck,
              title: "Return Reduction",
              desc: "Our partners see an average 38% decrease in size-related returns within the first quarter."
            }
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

        <div className="text-center">
          <a href="mailto:partners@clozes.ai" className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-4 rounded-lg font-medium hover:bg-foreground/90 transition-colors">
            Request Integration API
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
