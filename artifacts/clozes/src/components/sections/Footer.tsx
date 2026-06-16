import React from "react";

export function Footer({ t }: { t: typeof import("../../i18n").translations["en"]["footer"] }) {  return (
    <footer className="border-t border-border bg-background pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12 mb-16">

        <div className="max-w-sm">
          <div className="font-bold text-xl mb-4 tracking-tight">
            Clozes
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">
{t.tagline}
          </p>
          <a
            href="mailto:hello@clozes.app"
            className="text-sm text-primary hover:underline"
          >
            hello@clozes.app
          </a>
        </div>

        <div className="flex gap-16">
          <div>
<h4 className="font-semibold text-sm mb-4">{t.product}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#demo" className="hover:text-foreground transition-colors">{t.sizeFinder}</a></li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">{t.howItWorks}</a></li>
              <li><a href="#roadmap" className="hover:text-foreground transition-colors">{t.roadmap}</a></li>
              <li><a href="#pricing" className="hover:text-foreground transition-colors">{t.pricing}</a></li>
            </ul>
          </div>
          <div>
<h4 className="font-semibold text-sm mb-4">{t.company}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><a href="#business" className="hover:text-foreground transition-colors">{t.forBrands}</a></li>
              <li><a href="#waitlist" className="hover:text-foreground transition-colors">{t.earlyAccess}</a></li>
              <li><a href="mailto:hello@clozes.app" className="hover:text-foreground transition-colors">{t.contact}</a></li>
            </ul>
          </div>
        </div>

      </div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/50 text-xs text-muted-foreground">
<div>&copy; {new Date().getFullYear()} {t.copyright}</div>
  <div className="flex items-center gap-6">
    <a href="https://www.linkedin.com/in/clozes-ab9516414/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">LinkedIn</a>
    <a href="https://www.instagram.com/clozesai/" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">Instagram</a>
    <a href="mailto:hello@clozes.app" className="hover:text-foreground transition-colors">Privacy Policy</a>
  </div>
</div>
    </footer>
  );
}
