"use client";

import { Button } from "@repo/ui/components/ui/button";
import { useBrand, type Brand } from "./providers";

const BRANDS: { id: Brand; label: string }[] = [
  { id: "siam", label: "Siam" },
  { id: "nara", label: "Nara" },
];

export function BrandSwitcher() {
  const { brand, setBrand } = useBrand();
  return (
    <div className="flex items-center gap-1 rounded-lg border p-1">
      {BRANDS.map((b) => (
        <Button
          key={b.id}
          size="sm"
          variant={brand === b.id ? "default" : "ghost"}
          onClick={() => setBrand(b.id)}
        >
          {b.label}
        </Button>
      ))}
    </div>
  );
}
