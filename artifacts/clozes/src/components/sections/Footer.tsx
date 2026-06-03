import React from "react";
import { Twitter, Instagram, Linkedin, Command } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-16">
        
        <div className="max-w-sm">
          <div className="flex items-center gap-2 font-bold text-xl mb-4 tracking-tight">
            <Command className="w-6 h-6" />
            CLOZES
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We're building the intelligence layer for the future of fashion. Fit prediction, outfit matching, and universal styling profiles.
          </p>
        </div>

        <div className="flex gap-16">
          <div>
            <h4 className="font-medium text-sm mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#demo" className="hover:text-foreground transition-colors">Technology</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-4">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#business" className="hover:text-foreground transition-colors">For Business</a></li>
              <li><a href="mailto:hello@clozes.ai" className="hover:text-foreground transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/50 text-xs text-muted-foreground">
        <div>&copy; {new Date().getFullYear()} Clozes AI, Inc. All rights reserved.</div>
        
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors"><Twitter className="w-4 h-4" /></a>
          <a href="#" className="hover:text-foreground transition-colors"><Instagram className="w-4 h-4" /></a>
          <a href="#" className="hover:text-foreground transition-colors"><Linkedin className="w-4 h-4" /></a>
        </div>
      </div>
    </footer>
  );
}
