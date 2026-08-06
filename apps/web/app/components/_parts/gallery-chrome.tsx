"use client";

import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@peckey954/ui/components/ui/button";
import { Separator } from "@peckey954/ui/components/ui/separator";

import { BrandSwitcher } from "@/components/brand-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { StyleSwitcher } from "@/components/style-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useT, type TranslationKey } from "@/lib/i18n";

const NAV: { href: string; key: TranslationKey }[] = [
  { href: "#layout", key: "nav.layout" },
  { href: "#forms", key: "nav.forms" },
  { href: "#date", key: "nav.date" },
  { href: "#navigation", key: "nav.navigation" },
  { href: "#overlays", key: "nav.overlays" },
  { href: "#feedback", key: "nav.feedback" },
  { href: "#data", key: "nav.data" },
  { href: "#charts", key: "nav.charts" },
  { href: "#multi-select", key: "nav.multiSelect" },
];

export function GalleryHeader() {
  const t = useT();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm">
              <Link href="/">
                <ArrowLeftIcon />
                {t("page.home")}
              </Link>
            </Button>
            <Separator orientation="vertical" className="h-5" />
            <div>
              <h1 className="text-sm font-semibold">{t("page.title")}</h1>
              <p className="text-xs text-muted-foreground">
                {t("page.subtitle")}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <LanguageSwitcher />
            <BrandSwitcher />
            <StyleSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <nav className="mt-3 flex flex-wrap items-center gap-1">
          {NAV.map((item) => (
            <Button key={item.href} asChild variant="ghost" size="sm">
              <a href={item.href}>{t(item.key)}</a>
            </Button>
          ))}
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button asChild variant="outline" size="sm">
            <Link href="/styles">{t("nav.styles")}</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}

export function GalleryIntro() {
  const t = useT();

  return (
    <p className="text-sm text-muted-foreground">
      {t("page.intro.before")}{" "}
      <code className="rounded bg-muted px-1.5 py-0.5">
        @peckey954/ui/components/ui/*
      </code>{" "}
      {t("page.intro.after")}
    </p>
  );
}

export function GalleryFooter() {
  const t = useT();

  return (
    <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
      {t("page.footer.before")}{" "}
      <code className="rounded bg-muted px-1.5 py-0.5">AGENTS.md</code> ·{" "}
      {t("page.footer.after")}{" "}
      <code className="rounded bg-muted px-1.5 py-0.5">
        pnpm dlx shadcn@latest add &lt;name&gt;
      </code>
    </footer>
  );
}
