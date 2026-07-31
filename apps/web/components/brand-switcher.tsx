"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@peckey954/ui/components/ui/select";

import { BRANDS, useBrand, type Brand } from "./providers";
import { useT } from "@/lib/i18n";

export function BrandSwitcher() {
  const { brand, setBrand } = useBrand();
  const t = useT();

  return (
    <Select value={brand} onValueChange={(value) => setBrand(value as Brand)}>
      <SelectTrigger size="sm" className="w-32" aria-label={t("brand.aria")}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {BRANDS.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            {b.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
