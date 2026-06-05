import React from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$299",
    period: "per month",
    description: "Perfect for small boutiques and independent brands just getting started with fit intelligence.",
    analyses: "Up to 10,000 fit analyses/mo",
    features: [
      "Drop-in 'Find My Fit' widget",
      "Standard size recommendations",
      "Basic analytics dashboard",
      "Email support",
      "1 storefront integration",
    ],
    button: "Start Free Trial",
    highlight: false,
    trial: "14-day free trial"
  },
  {
    name: "Growth",
    price: "$799",
    period: "per month",
    description: "For scaling brands that want to seriously reduce returns and improve customer satisfaction.",
    analyses: "Up to 50,000 fit analyses/mo",
    features: [
      "Everything in Starter",
      "Full outfit compatibility AI",
      "Universal fit profiles across brands",
      "Advanced return rate analytics",
      "Priority support",
      "Up to 5 storefront integrations",
    ],
    button: "Start Free Trial",
    highlight: true,
    trial: "14-day free trial"
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "pricing",
    description: "For large retailers and multi-brand platforms that need unlimited scale and dedicated support.",
    analyses: "Unlimited fit analyses",
    features: [
      "Everything in Growth",
      "Dedicated account manager",
      "Custom AI model training",
      "White-label SDK",
      "SLA guarantee",
      "Unlimited integrations",
      "On-premise deployment option",
    ],
    button: "Contact Sales",
    highlight: false,
    trial: "Custom onboarding"
  }
];

export function Pricing() {
  return (
    <section className="py-24 px-6 bg-background relative" id="pricing">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-mono mb-6 uppercase tracking-widest"
          >
            For Clothing Brands
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4"
          >
            Simple, transparent pricing
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Add fit intelligence to your store. Reduce returns. Increase customer confidence. All plans include a 14-day free trial.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative rounded-2xl border p-8 bg-card flex flex-col ${
                plan.highlight
                  ? "border-primary shadow-[0_0_30px_rgba(var(--primary),0.15)] md:-translate-y-4"
                  : "border-border"
              }`}
            >
              {plan.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase">
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-medium mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground text-sm">/{plan.period}</span>
                  )}
                  {plan.price === "Custom" && (
                    <span className="text-muted-foreground text-sm">{plan.period}</span>
                  )}
                </div>
                <div className="text-xs text-primary font-mono mb-3">{plan.analyses}</div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>

              <div className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3 text-sm">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <button
                  className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 group ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                  }`}
                  onClick={() => {
                    if (plan.name === "Enterprise") {
                      window.location.href = "mailto:sales@clozes.app";
                    } else {
                      document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                >
                  {plan.button}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="text-xs text-center text-muted-foreground">{plan.trial}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm text-muted-foreground mt-12"
        >
          All prices in USD. Billed monthly or annually (save 20% with annual billing). Need a custom volume plan?{" "}
          <a href="mailto:sales@clozes.app" className="text-primary hover:underline">Contact us.</a>
        </motion.p>
      </div>
    </section>
  );
}
