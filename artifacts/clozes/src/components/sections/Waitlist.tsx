import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Waitlist() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Check if already signed up in local storage
    if (localStorage.getItem("clozes_waitlist")) {
      setSubmitted(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) return;
    
    // Simulate API call and persist
    localStorage.setItem("clozes_waitlist", JSON.stringify({ name, email }));
    setSubmitted(true);
  };

  return (
    <section className="py-32 px-6 border-t border-border/50 bg-secondary/10 relative overflow-hidden" id="waitlist">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary),0.05),transparent_70%)]" />
      
      <div className="max-w-2xl mx-auto relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center"
        >
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12"
            >
              <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">You're on the list.</h3>
              <p className="text-muted-foreground">We'll notify you when your access is ready.</p>
            </motion.div>
          ) : (
            <>
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Join the Future of Fashion.</h2>
              <p className="text-muted-foreground mb-8">Early access is limited. Secure your spot on the waitlist.</p>
              
              <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto text-left">
                <div>
                  <label className="sr-only">Name</label>
                  <input 
                    type="text" 
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <div>
                  <label className="sr-only">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-background border border-border rounded-lg px-4 py-3 outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-foreground text-background font-medium py-3 rounded-lg hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 group"
                >
                  Join Waitlist
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
