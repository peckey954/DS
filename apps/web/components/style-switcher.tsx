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
    tintAria: "เลือกโทนสีพื้น",
    tintPure: "แยกสี",
    tintSoft: "ผสมบาง",
    tintDeep: "ผสมเข้ม",
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
    tintAria: "Select neutral tone",
    tintPure: "Pure neutral",
    tintSoft: "Soft tint",
    tintDeep: "Deep tint",
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
type Tint = "pure" | "soft" | "deep";

/**
 * สลับแกนสไตล์ของทั้งหน้า — เขียน data-radius / data-density ลงบน <html>
 * ไม่ต้องส่ง prop ให้ component ตัวไหนเลย เพราะทุกตัวอ่านจาก CSS variable
 */
export function StyleSwitcher() {
  const c = useCopy(COPY);
  const [radius, setRadius] = React.useState<Radius>("standard");
  const [density, setDensity] = React.useState<Density>("standard");
  // เริ่มที่ deep เพราะใกล้เคียงหน้าตาเดิมของแต่ละแบรนด์มากที่สุด
  const [tint, setTint] = React.useState<Tint>("deep");

  React.useEffect(() => {
    document.documentElement.dataset.radius = radius;
  }, [radius]);

  React.useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  React.useEffect(() => {
    document.documentElement.dataset.tint = tint;
  }, [tint]);

  return (
    <>
      <Select value={tint} onValueChange={(v) => setTint(v as Tint)}>
        <SelectTrigger size="sm" className="w-28" aria-label={c.tintAria}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pure">{c.tintPure}</SelectItem>
          <SelectItem value="soft">{c.tintSoft}</SelectItem>
          <SelectItem value="deep">{c.tintDeep}</SelectItem>
        </SelectContent>
      </Select>

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
