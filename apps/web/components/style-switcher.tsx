"use client";

import * as React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@peckey954/ui/components/ui/select";

import { defineCopy, useCopy } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    radiusAria: "เลือกความโค้ง",
    densityAria: "เลือกความห่าง",
    sharp: "ไม่โค้ง",
    standard: "โค้งปกติ",
    friendly: "โค้งมาก",
    pill: "แคปซูล",
    compact: "แน่น",
    normal: "ห่างปกติ",
    comfortable: "โปร่ง",
  },
  en: {
    radiusAria: "Select corner radius",
    densityAria: "Select density",
    sharp: "Sharp",
    standard: "Standard",
    friendly: "Friendly",
    pill: "Pill",
    compact: "Compact",
    normal: "Standard",
    comfortable: "Comfortable",
  },
});

type Radius = "sharp" | "standard" | "friendly" | "pill";
type Density = "compact" | "standard" | "comfortable";

/**
 * สลับแกนสไตล์ของทั้งหน้า — เขียน data-radius / data-density ลงบน <html>
 * ไม่ต้องส่ง prop ให้ component ตัวไหนเลย เพราะทุกตัวอ่านจาก CSS variable
 */
export function StyleSwitcher() {
  const c = useCopy(COPY);
  const [radius, setRadius] = React.useState<Radius>("standard");
  const [density, setDensity] = React.useState<Density>("standard");

  React.useEffect(() => {
    document.documentElement.dataset.radius = radius;
  }, [radius]);

  React.useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  return (
    <>
      <Select
        value={radius}
        onValueChange={(v) => setRadius(v as Radius)}
      >
        <SelectTrigger size="sm" className="w-28" aria-label={c.radiusAria}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sharp">{c.sharp}</SelectItem>
          <SelectItem value="standard">{c.standard}</SelectItem>
          <SelectItem value="friendly">{c.friendly}</SelectItem>
          <SelectItem value="pill">{c.pill}</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={density}
        onValueChange={(v) => setDensity(v as Density)}
      >
        <SelectTrigger size="sm" className="w-28" aria-label={c.densityAria}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="compact">{c.compact}</SelectItem>
          <SelectItem value="standard">{c.normal}</SelectItem>
          <SelectItem value="comfortable">{c.comfortable}</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
}
