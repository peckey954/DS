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
    tintBlend: "ผสมแบรนด์",
    fontAria: "เลือกฟอนต์",
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
    tintBlend: "Brand tinted",
    fontAria: "Select font",
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
type Tint = "pure" | "blend";
type Font = "ibm" | "prompt" | "sarabun";

/* ชื่อฟอนต์ไม่ต้องแปลภาษา เป็นชื่อเฉพาะ */
const FONTS: { id: Font; label: string }[] = [
  { id: "ibm", label: "IBM Plex Thai" },
  { id: "prompt", label: "Prompt" },
  { id: "sarabun", label: "Sarabun" },
];

/**
 * สลับแกนสไตล์ของทั้งหน้า — เขียน data-radius / data-density ลงบน <html>
 * ไม่ต้องส่ง prop ให้ component ตัวไหนเลย เพราะทุกตัวอ่านจาก CSS variable
 */
export function StyleSwitcher() {
  const c = useCopy(COPY);
  const [radius, setRadius] = React.useState<Radius>("standard");
  const [density, setDensity] = React.useState<Density>("standard");
  const [tint, setTint] = React.useState<Tint>("blend");
  const [font, setFont] = React.useState<Font>("ibm");

  React.useEffect(() => {
    document.documentElement.dataset.radius = radius;
  }, [radius]);

  React.useEffect(() => {
    document.documentElement.dataset.density = density;
  }, [density]);

  React.useEffect(() => {
    document.documentElement.dataset.tint = tint;
  }, [tint]);

  React.useEffect(() => {
    document.documentElement.dataset.font = font;
  }, [font]);

  return (
    <>
      <Select value={tint} onValueChange={(v) => setTint(v as Tint)}>
        <SelectTrigger size="sm" className="w-28" aria-label={c.tintAria}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pure">{c.tintPure}</SelectItem>
          <SelectItem value="blend">{c.tintBlend}</SelectItem>
        </SelectContent>
      </Select>

      <Select value={font} onValueChange={(v) => setFont(v as Font)}>
        <SelectTrigger size="sm" className="w-36" aria-label={c.fontAria}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {FONTS.map((f) => (
            <SelectItem key={f.id} value={f.id}>
              {f.label}
            </SelectItem>
          ))}
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
