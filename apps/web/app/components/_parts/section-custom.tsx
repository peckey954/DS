"use client";

import * as React from "react";

import { Label } from "@repo/ui/components/ui/label";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@repo/ui/components/ui/multi-select";
import { cn } from "@repo/ui/lib/utils";

import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    tons: "ตัน",
    received: "รับ",
    days: "วัน",
    pieces: "ชิ้น",
    fullHint: "แบบเต็ม: badge + คำอธิบาย + ค่าชิดขวา",
    lotLabel: "Lot",
    lotPlaceholder: "เลือก Lot",
    search: "ค้นหา",
    selectAll: "เลือกทั้งหมด",
    selectedCount: "เลือกแล้ว",
    items: "รายการ",
    plainHint: "แบบเรียบ + maxChips",
    provinceLabel: "จังหวัดที่ให้บริการ",
    provincePlaceholder: "เลือกจังหวัด",
    maxChipsNote: "เกิน 2 รายการจะยุบเป็น +n · สุราษฎร์ธานีถูกปิดไว้ (disabled)",
    variantHint: "ไม่มีเลือกทั้งหมด / ปิดใช้งาน",
    noSelectAll: "ไม่มีแถวเลือกทั้งหมด",
    disabled: "ปิดใช้งาน",
    bkk: "กรุงเทพมหานคร",
    cnx: "เชียงใหม่",
    hkt: "ภูเก็ต",
    kkc: "ขอนแก่น",
    cbi: "ชลบุรี",
    sni: "สุราษฎร์ธานี",
  },
  en: {
    tons: "t",
    received: "Due",
    days: "days",
    pieces: "pcs",
    fullHint: "Full: badge + description + right-aligned value",
    lotLabel: "Lot",
    lotPlaceholder: "Select lots",
    search: "Search",
    selectAll: "Select all",
    selectedCount: "Selected",
    items: "items",
    plainHint: "Plain + maxChips",
    provinceLabel: "Provinces served",
    provincePlaceholder: "Select provinces",
    maxChipsNote: "More than 2 collapse into +n · Surat Thani is disabled",
    variantHint: "No select-all / disabled",
    noSelectAll: "Without the select-all row",
    disabled: "Disabled",
    bkk: "Bangkok",
    cnx: "Chiang Mai",
    hkt: "Phuket",
    kkc: "Khon Kaen",
    cbi: "Chonburi",
    sni: "Surat Thani",
  },
});

/** จำนวนคงเหลือชิดขวาของแถว — ต่ำกว่าเกณฑ์ให้ใช้สี destructive */
function Remaining({ tons, unit }: { tons: number; unit: string }) {
  const low = tons < 10;
  return (
    <span className={cn("text-sm", low && "text-destructive")}>
      <span className="font-semibold">{tons}</span> {unit}
    </span>
  );
}

const LOT_DATA = [
  { value: "lot-1", code: "PD260116/01-04", tons: 80, days: 44 },
  { value: "lot-2", code: "PD260116/01-05", tons: 2, days: 44 },
  { value: "lot-3", code: "PD260116/01-06", tons: 2, days: 44 },
  { value: "lot-4", code: "PD260116/02-01", tons: 36, days: 60 },
  { value: "lot-5", code: "PD260116/02-02", tons: 7, days: 60 },
];

export function SectionCustom() {
  const t = useT();
  const c = useCopy(COPY);
  const [lots, setLots] = React.useState<string[]>(["lot-1", "lot-2"]);
  const [provinces, setProvinces] = React.useState<string[]>([]);

  const lotOptions: MultiSelectOption[] = LOT_DATA.map(
    ({ value, code, tons, days }) => ({
      value,
      label: code,
      badge: "A-9M",
      description: `${c.received} 5/14/2026 (${days} ${c.days}) · 500 ${c.pieces} (50 Kg)`,
      meta: <Remaining tons={tons} unit={c.tons} />,
      keywords: ["A-9M", "lot"],
    })
  );

  const provinceOptions: MultiSelectOption[] = [
    { value: "bkk", label: c.bkk },
    { value: "cnx", label: c.cnx },
    { value: "hkt", label: c.hkt },
    { value: "kkc", label: c.kkc },
    { value: "cbi", label: c.cbi },
    { value: "sni", label: c.sni, disabled: true },
  ];

  return (
    <section id="multi-select" className="scroll-mt-24">
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("section.multiSelect")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("section.multiSelect.desc")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground md:col-span-2">
          <div className="flex items-baseline justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
            <code className="text-xs font-medium">multi-select</code>
            <span className="text-xs text-muted-foreground">
              {c.fullHint}
            </span>
          </div>
          <div className="space-y-2 p-4">
            <Label htmlFor="lot-select">{c.lotLabel}</Label>
            <MultiSelect
              id="lot-select"
              options={lotOptions}
              value={lots}
              onValueChange={setLots}
              placeholder={c.lotPlaceholder}
              searchPlaceholder={c.search}
              selectAllLabel={c.selectAll}
            />
            <p className="text-sm text-muted-foreground">
              {c.selectedCount} {lots.length} {c.items}
              {lots.length > 0 ? `: ${lots.join(", ")}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
          <div className="flex items-baseline justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
            <code className="text-xs font-medium">multi-select</code>
            <span className="text-xs text-muted-foreground">
              {c.plainHint}
            </span>
          </div>
          <div className="space-y-2 p-4">
            <Label htmlFor="province-select">{c.provinceLabel}</Label>
            <MultiSelect
              id="province-select"
              options={provinceOptions}
              value={provinces}
              onValueChange={setProvinces}
              placeholder={c.provincePlaceholder}
              maxChips={2}
            />
            <p className="text-sm text-muted-foreground">
              {c.maxChipsNote}
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
          <div className="flex items-baseline justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
            <code className="text-xs font-medium">multi-select</code>
            <span className="text-xs text-muted-foreground">
              {c.variantHint}
            </span>
          </div>
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="no-all-select">{c.noSelectAll}</Label>
              <MultiSelect
                id="no-all-select"
                options={provinceOptions}
                defaultValue={["cnx"]}
                hideSelectAll
                hideCount
                placeholder={c.provincePlaceholder}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled-select">{c.disabled}</Label>
              <MultiSelect
                id="disabled-select"
                options={provinceOptions}
                defaultValue={["bkk"]}
                disabled
                placeholder={c.provincePlaceholder}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
