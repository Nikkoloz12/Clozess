import React, { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sun, Moon, Menu, X } from "lucide-react";
import { translations, type Lang } from "./i18n";
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


function Navbar({ dark, onToggle, lang, onLangToggle }: { dark: boolean; onToggle: () => void; lang: Lang; onLangToggle: () => void }) {
  const nav = translations[lang].nav;
  const navLinks = [
  { href: "#demo", label: nav.demo },
  { href: "#problem", label: nav.whyClozes },
  { href: "#how-it-works", label: nav.howItWorks },
  { href: "#business", label: nav.forBrands },
  { href: "#pricing", label: nav.pricing },
];
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close menu when clicking a link
  const handleLinkClick = () => setMenuOpen(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-colors duration-200 ${
          scrolled || menuOpen
            ? "bg-background/95 border-b border-border"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="text-lg font-bold tracking-tight text-foreground">
            Clozes
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="hover:text-foreground transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
          <button
onClick={onLangToggle}
  className="p-2 rounded-full border border-border bg-secondary hover:bg-muted transition-colors text-foreground text-xs font-bold w-9 h-9 flex items-center justify-center"
>
{lang === "en" ? "ქა" : "EN"}
</button>
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
              {nav.joinEarlyAccess}
            </a>
            {/* Burger button - mobile only */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="md:hidden p-2 rounded-lg border border-border bg-secondary text-foreground"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-16 px-6 md:hidden flex flex-col">
          <nav className="flex flex-col gap-1 mt-6">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="text-lg font-medium py-4 border-b border-border text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <a
            href="#waitlist"
            onClick={handleLinkClick}
            className="mt-8 w-full py-4 rounded-lg bg-primary text-primary-foreground text-center font-medium hover:bg-primary/90 transition-colors"
          >
            {nav.joinEarlyAccess}
          </a>
        </div>
      )}
    </>
  );
}

function Home({ dark, onToggle, lang, onLangToggle, t }: { 
  dark: boolean; 
  onToggle: () => void; 
  lang: Lang; 
  onLangToggle: () => void;
  t: typeof translations["en"];
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar dark={dark} onToggle={onToggle} lang={lang} onLangToggle={onLangToggle} />
      <Hero t={t.hero} />
<FitDemo t={t.demo} />
<Problem t={t.problem} />
<HowItWorks t={t.howItWorks} />
<OutfitMatching t={t.outfit} />
<B2B t={t.b2b} tDemo={t.demo} /><Future t={t.future} />
<Pricing t={t.pricing} />
<Waitlist t={t.waitlist} />
<Footer t={t.footer} />
    </div>
  );
}

function App() {
  const [lang, setLang] = useState<Lang>(() => {
  return (localStorage.getItem("clozes-lang") as Lang) || "en";
});
const t = translations[lang];
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("clozes-theme");
    if (saved) return saved === "dark";
    return false;
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
useEffect(() => {
  localStorage.setItem("clozes-lang", lang);
}, [lang]);
  const toggleTheme = () => setDark((d) => !d);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Switch>
<Route path="/" component={() => <Home dark={dark} onToggle={toggleTheme} lang={lang} onLangToggle={() => setLang(l => l === "en" ? "ka" : "en")} t={t} />} />
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