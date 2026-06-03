import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layers, ChevronRight } from "lucide-react";

const baseItems = [
  {
    label: "Tan Camel Blazer",
    image: "/images/garment-jacket.png",
    size: "M · Camel",
    matches: [
      { type: "Bottom", name: "Slim Fit Chinos", match: "92%", image: "/images/garment-jeans.png" },
      { type: "Top", name: "Oxford Cotton Shirt", match: "96%", image: "/images/garment-shirt.png" },
      { type: "Footwear", name: "Minimalist Sneakers", match: "88%", image: "/images/garment-shoes.png" },
    ],
  },
  {
    label: "Oxford Cotton Shirt",
    image: "/images/garment-shirt.png",
    size: "M · White",
    matches: [
      { type: "Bottom", name: "Slim Fit Chinos", match: "95%", image: "/images/garment-jeans.png" },
      { type: "Layer", name: "Tan Camel Blazer", match: "93%", image: "/images/garment-jacket.png" },
      { type: "Footwear", name: "Minimalist Sneakers", match: "90%", image: "/images/garment-shoes.png" },
    ],
  },
  {
    label: "Slim Fit Jeans",
    image: "/images/garment-jeans.png",
    size: "32 · Indigo",
    matches: [
      { type: "Top", name: "Oxford Cotton Shirt", match: "94%", image: "/images/garment-shirt.png" },
      { type: "Layer", name: "Tan Camel Blazer", match: "89%", image: "/images/garment-jacket.png" },
      { type: "Footwear", name: "Minimalist Sneakers", match: "97%", image: "/images/garment-shoes.png" },
    ],
  },
];

export function OutfitMatching() {
  const [active, setActive] = useState(0);
  const current = baseItems[active];

  return (
    <section className="py-24 px-6 border-t border-border/50 bg-background relative overflow-hidden">
      <div className="absolute -left-1/4 top-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left: visual grid */}
          <div className="order-2 lg:order-1">
            {/* Base item selector */}
            <div className="flex gap-3 mb-6 flex-wrap">
              {baseItems.map((item, i) => (
                <button
                  key={item.label}
                  data-testid={`button-outfit-${i}`}
                  onClick={() => setActive(i)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                    active === i
                      ? "bg-primary text-primary-foreground border-primary glow-effect"
                      : "bg-secondary text-foreground border-border hover:border-primary/50"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Base item card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="relative rounded-xl overflow-hidden h-[220px] border border-border"
                >
                  <img src={current.image} alt={current.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5">Base Item</div>
                    <div className="text-sm font-medium">{current.label}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{current.size}</div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* AI suggestions card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-secondary/20 border border-primary/20 rounded-xl p-4 glow-border"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Layers className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-primary font-mono uppercase tracking-widest">AI Suggestions</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.label}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-3"
                  >
                    {current.matches.map((item) => (
                      <div key={item.name} className="flex justify-between items-center gap-2">
                        <div className="min-w-0">
                          <div className="text-[10px] text-muted-foreground">{item.type}</div>
                          <div className="text-xs font-medium truncate">{item.name}</div>
                        </div>
                        <div className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">{item.match}</div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Match image cards */}
              {current.matches.slice(0, 2).map((match, i) => (
                <motion.div
                  key={current.label + match.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="relative rounded-xl overflow-hidden h-[160px] border border-border"
                >
                  <img src={match.image} alt={match.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/75 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-muted-foreground">{match.type}</div>
                      <div className="text-xs font-medium leading-tight">{match.name}</div>
                    </div>
                    <div className="text-[10px] font-mono text-primary bg-background/70 px-2 py-0.5 rounded">{match.match}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right: copy */}
          <div className="order-1 lg:order-2">
            <motion.h2
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-bold tracking-tight mb-6"
            >
              Context-Aware <br /><span className="text-muted-foreground">Wardrobe Assembly.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8 leading-relaxed"
            >
              Fit is only half the equation. Our engine understands style taxonomy, color theory,
              and seasonal appropriateness to build complete, cohesive outfits around any single item.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4 text-muted-foreground"
            >
              {[
                "Proportions matched across layers",
                "Color palette compatibility scoring",
                "Personal style preference weighting",
              ].map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <ChevronRight className="w-4 h-4 text-primary shrink-0" />
                  {point}
                </li>
              ))}
            </motion.ul>
          </div>
        </div>
      </div>
    </section>
  );
}
