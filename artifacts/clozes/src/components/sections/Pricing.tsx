import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Basic fit intelligence for casual shoppers.",
    features: [
      "3 Fit Analyses per month",
      "Standard Size Recommendations",
      "1 Basic Fit Profile"
    ],
    button: "Get Started",
    highlight: false
  },
  {
    name: "Individual",
    price: "$12",
    period: "per month",
    description: "Unlimited analysis for fashion enthusiasts.",
    features: [
      "Unlimited Fit Analyses",
      "Full Outfit Matching AI",
      "Multi-brand Profiling",
      "Priority Email Support"
    ],
    button: "Subscribe Now",
    highlight: true
  },
  {
    name: "Family",
    price: "$25",
    period: "per month",
    description: "Manage sizing for the whole household.",
    features: [
      "Up to 4 User Profiles",
      "Everything in Individual",
      "Kids Growth Tracking (Beta)",
      "Shared Wardrobe Sync"
    ],
    button: "Subscribe Now",
    highlight: false
  }
];

export function Pricing() {
  return (
    <section className="py-24 px-6 bg-background relative" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Simple, transparent pricing</h2>
          <p className="text-lg text-muted-foreground">Invest in your wardrobe confidence.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 bg-card flex flex-col ${
                plan.highlight 
                  ? 'border-primary shadow-[0_0_30px_rgba(var(--primary),0.15)] md:-translate-y-4' 
                  : 'border-border'
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase">
                  Most Popular
                </div>
              )}
              
              <div className="mb-8">
                <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
                <p className="text-sm text-muted-foreground h-10">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button className={`w-full py-3 rounded-lg font-medium transition-colors ${
                plan.highlight
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90 glow-effect'
                  : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border'
              }`}>
                {plan.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
