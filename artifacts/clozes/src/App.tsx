import React, { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sun, Moon } from "lucide-react";

import { Hero } from "./components/sections/Hero";
import { FitDemo } from "./components/sections/FitDemo";
import { Problem } from "./components/sections/Problem";
import { HowItWorks } from "./components/sections/HowItWorks";
import { OutfitMatching } from "./components/sections/OutfitMatching";
import { B2B } from "./components/sections/B2B";
import { Future } from "./components/sections/Future";
import { Pricing } from "./components/sections/Pricing";
import { Waitlist } from "./components/sections/Waitlist";
import { Footer } from "./components/sections/Footer";

const queryClient = new QueryClient();

function Navbar({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="text-lg font-bold tracking-tight text-foreground">
          Clozes
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#demo" className="hover:text-foreground transition-colors">Demo</a>
          <a href="#problem" className="hover:text-foreground transition-colors">Why Clozes</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#business" className="hover:text-foreground transition-colors">For Brands</a>
          <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggle}
            data-testid="button-theme-toggle"
            aria-label="Toggle theme"
            className="p-2 rounded-full border border-border bg-secondary hover:bg-muted transition-colors text-foreground"
          >
            {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a
            href="#waitlist"
            className="hidden md:inline-flex px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Join Early Access
          </a>
        </div>
      </div>
    </header>
  );
}

function Home({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar dark={dark} onToggle={onToggle} />
      <Hero />
      <FitDemo />
      <Problem />
      <HowItWorks />
      <OutfitMatching />
      <B2B />
      <Future />
      <Pricing />
      <Waitlist />
      <Footer />
    </div>
  );
}

function App() {
  // Default to light mode
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("clozes-theme");
    if (saved) return saved === "dark";
    return false; // light mode by default
  });

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("clozes-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("clozes-theme", "light");
    }
  }, [dark]);

  const toggleTheme = () => setDark((d) => !d);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
            <Route path="/" component={() => <Home dark={dark} onToggle={toggleTheme} />} />
            <Route>
              <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
                <div className="text-center">
                  <h1 className="text-4xl font-bold">404</h1>
                  <p className="text-muted-foreground mt-2">Page not found</p>
                </div>
              </div>
            </Route>
          </Switch>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
