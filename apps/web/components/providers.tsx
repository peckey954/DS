"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@peckey954/ui/components/ui/sonner";

/* ---------------------------------- แบรนด์ --------------------------------- */

export type Brand = "siam" | "nara" | "parich";

/** เพิ่มแบรนด์ใหม่ = เพิ่ม 1 บรรทัดตรงนี้ (หลังสร้างไฟล์ token แล้ว) */
export const BRANDS: { id: Brand; label: string }[] = [
  { id: "siam", label: "Siam" },
  { id: "nara", label: "Nara" },
  { id: "parich", label: "Parich" },
];

type BrandContextValue = {
  brand: Brand;
  setBrand: (b: Brand) => void;
};

const BrandContext = React.createContext<BrandContextValue | null>(null);

export function useBrand() {
  const ctx = React.useContext(BrandContext);
  if (!ctx) throw new Error("useBrand ต้องอยู่ภายใน <Providers>");
  return ctx;
}

function BrandProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = React.useState<Brand>("siam");

  React.useEffect(() => {
    // สลับแบรนด์ = แค่เปลี่ยน data-brand บน <html>
    document.documentElement.dataset.brand = brand;
  }, [brand]);

  return (
    <BrandContext.Provider value={{ brand, setBrand }}>
      {children}
    </BrandContext.Provider>
  );
}

/* ---------------------------------- ภาษา ---------------------------------- */

export type Lang = "th" | "en";

export const LANGS: { id: Lang; short: string; label: string }[] = [
  { id: "th", short: "TH", label: "ภาษาไทย" },
  { id: "en", short: "EN", label: "English" },
];

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = React.createContext<LangContextValue | null>(null);

export function useLang() {
  const ctx = React.useContext(LangContext);
  if (!ctx) throw new Error("useLang ต้องอยู่ภายใน <Providers>");
  return ctx;
}

function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>("th");

  React.useEffect(() => {
    // มีผลกับการตัดคำ/การอ่านออกเสียงของ screen reader ด้วย ไม่ใช่แค่ข้อความ
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

/* -------------------------------------------------------------------------- */

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <BrandProvider>
        <LangProvider>
          {children}
          <Toaster />
        </LangProvider>
      </BrandProvider>
    </ThemeProvider>
  );
}
