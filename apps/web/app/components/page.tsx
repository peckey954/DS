import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Separator } from "@repo/ui/components/ui/separator";

import { BrandSwitcher } from "@/components/brand-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

import { SectionCustom } from "./_parts/section-custom";
import { SectionData } from "./_parts/section-data";
import { SectionDate } from "./_parts/section-date";
import { SectionFeedback } from "./_parts/section-feedback";
import { SectionForms } from "./_parts/section-forms";
import { SectionLayout } from "./_parts/section-layout";
import { SectionNavigation } from "./_parts/section-navigation";
import { SectionOverlays } from "./_parts/section-overlays";

export const metadata: Metadata = {
  title: "แกลเลอรี component — Design System",
  description: "ตัวอย่างการใช้งาน component ทั้ง 54 ตัวใน @repo/ui",
};

const NAV = [
  { href: "#layout", label: "โครงสร้าง" },
  { href: "#forms", label: "ฟอร์ม" },
  { href: "#date", label: "วันที่" },
  { href: "#navigation", label: "การนำทาง" },
  { href: "#overlays", label: "Overlay" },
  { href: "#feedback", label: "สถานะ" },
  { href: "#data", label: "แสดงข้อมูล" },
  { href: "#multi-select", label: "multi-select" },
];

export default function ComponentsPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <ArrowLeftIcon />
                  หน้าแรก
                </Link>
              </Button>
              <Separator orientation="vertical" className="h-5" />
              <div>
                <h1 className="text-sm font-semibold">แกลเลอรี component</h1>
                <p className="text-xs text-muted-foreground">
                  ครบทั้ง 54 ตัวจาก @repo/ui
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <BrandSwitcher />
              <ThemeToggle />
            </div>
          </div>
          <nav className="mt-3 flex flex-wrap gap-1">
            {NAV.map((item) => (
              <Button key={item.href} asChild variant="ghost" size="sm">
                <a href={item.href}>{item.label}</a>
              </Button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-14 px-6 py-10">
        <p className="text-sm text-muted-foreground">
          ทุกตัวอย่างในหน้านี้ใช้ component จาก{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">
            @repo/ui/components/ui/*
          </code>{" "}
          และสีจาก token เท่านั้น — ลองสลับแบรนด์และโหมดสว่าง/มืดที่มุมขวาบน
          แล้วสังเกตว่าทั้งหน้าเปลี่ยนตามโดยไม่มีการแก้โค้ด component
        </p>

        <SectionLayout />
        <SectionForms />
        <SectionDate />
        <SectionNavigation />
        <SectionOverlays />
        <SectionFeedback />
        <SectionData />
        <SectionCustom />

        <footer className="border-t border-border pt-6 text-sm text-muted-foreground">
          กฎการใช้งานทั้งหมดอยู่ใน{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">AGENTS.md</code> ·
          เพิ่ม component ใหม่ด้วย{" "}
          <code className="rounded bg-muted px-1.5 py-0.5">
            pnpm dlx shadcn@latest add &lt;name&gt;
          </code>
        </footer>
      </main>
    </div>
  );
}
