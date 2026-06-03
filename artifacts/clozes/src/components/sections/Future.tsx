import React from "react";
import { motion } from "framer-motion";

export function Future() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center py-24 px-6 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] z-10" />
        <img 
          src="/images/vision-fashion.png" 
          alt="Digital Fashion Vision" 
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background z-20" />
      </div>

      <div className="relative z-30 max-w-4xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-7xl font-bold tracking-tight mb-8 leading-tight"
        >
          Your Digital <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">Fashion Identity.</span>
        </motion.h2>
        
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 1 }}
          className="text-xl md:text-2xl text-muted-foreground font-light leading-relaxed max-w-3xl mx-auto"
        >
          We envision a world where clothes are made for people, not averages. Where your digital identity guarantees a perfect physical reality. Welcome to predictive fashion.
        </motion.p>
      </div>
    </section>
  );
}
