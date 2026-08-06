"use client";

import * as React from "react";

import { Label } from "@peckey954/ui/components/ui/label";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@peckey954/ui/components/ui/multi-select";
import { NumberInput } from "@peckey954/ui/components/ui/number-input";
import { cn } from "@peckey954/ui/lib/utils";

import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    decrement: "ลดลง",
    increment: "เพิ่มขึ้น",
    trips: "เที่ยว",
    numberHint: "ปุ่ม − / + · ทศนิยม 2 ตำแหน่ง",
    unitHint: "หน่วยในช่อง ไม่มีปุ่ม",
    bothHint: "มีทั้งปุ่มและหน่วย + จำกัดช่วง",
    qtyLabel: "รับเข้า (ชิ้น)",
    weightLabel: "น้ำหนักรวม",
    truckLabel: "จำนวนเที่ยวรถ",
    rangeNote: "จำกัดไว้ 0–10 เที่ยว ปุ่มจะหรี่เองเมื่อชนขอบ",
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
    decrement: "Decrease",
    increment: "Increase",
    trips: "trips",
    numberHint: "− / + buttons · 2 decimal places",
    unitHint: "Unit inside the field, no buttons",
    bothHint: "Buttons and unit together, with a range",
    qtyLabel: "Received (pieces)",
    weightLabel: "Total weight",
    truckLabel: "Truck trips",
    rangeNote: "Capped at 0–10 trips — buttons dim at the limits",
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

/** กล่อง demo หน้าตาเดียวกับที่ใช้อยู่เดิมในไฟล์นี้ */
function DemoCard({
  name,
  hint,
  wide,
  children,
}: {
  name: string;
  hint: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground",
        wide && "md:col-span-2"
      )}
    >
      <div className="flex items-baseline justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
        <code className="text-xs font-medium">{name}</code>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
      <div className="space-y-2 p-4">{children}</div>
    </div>
  );
}

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
    <section id="custom" className="scroll-mt-24">
      <div className="mb-4 border-b border-border pb-3">
        <h2 className="text-xl font-semibold tracking-tight">
          {t("section.custom")}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("section.custom.desc")}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DemoCard name="number-input" hint={c.numberHint}>
          <Label htmlFor="qty">{c.qtyLabel}</Label>
          <NumberInput
            id="qty"
            defaultValue={0}
            precision={2}
            step={0.5}
            decrementLabel={c.decrement}
            incrementLabel={c.increment}
          />
        </DemoCard>

        <DemoCard name="number-input" hint={c.unitHint}>
          <Label htmlFor="weight">{c.weightLabel}</Label>
          <NumberInput
            id="weight"
            steppers={false}
            unit={c.tons}
            precision={2}
            placeholder="0.00"
          />
        </DemoCard>

        <DemoCard name="number-input" hint={c.bothHint} wide>
          <Label htmlFor="trips">{c.truckLabel}</Label>
          <NumberInput
            id="trips"
            defaultValue={2}
            min={0}
            max={10}
            unit={c.trips}
            decrementLabel={c.decrement}
            incrementLabel={c.increment}
          />
          <p className="text-sm text-muted-foreground">{c.rangeNote}</p>
        </DemoCard>

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
