"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@repo/ui/components/ui/sonner";

export type Brand = "siam" | "nara";

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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      disableTransitionOnChange
    >
      <BrandProvider>
        {children}
        <Toaster />
      </BrandProvider>
    </ThemeProvider>
  );
}
