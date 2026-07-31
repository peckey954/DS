"use client";

import * as React from "react";

import { Label } from "@repo/ui/components/ui/label";
import {
  MultiSelect,
  type MultiSelectOption,
} from "@repo/ui/components/ui/multi-select";
import { cn } from "@repo/ui/lib/utils";

import { useT } from "@/lib/i18n";

/** จำนวนคงเหลือชิดขวาของแถว — ต่ำกว่าเกณฑ์ให้ใช้สี destructive */
function Remaining({ tons }: { tons: number }) {
  const low = tons < 10;
  return (
    <span className={cn("text-sm", low && "text-destructive")}>
      <span className="font-semibold">{tons}</span> ตัน
    </span>
  );
}

const LOT_OPTIONS: MultiSelectOption[] = [
  { value: "lot-1", code: "PD260116/01-04", tons: 80, days: 44 },
  { value: "lot-2", code: "PD260116/01-05", tons: 2, days: 44 },
  { value: "lot-3", code: "PD260116/01-06", tons: 2, days: 44 },
  { value: "lot-4", code: "PD260116/02-01", tons: 36, days: 60 },
  { value: "lot-5", code: "PD260116/02-02", tons: 7, days: 60 },
].map(({ value, code, tons, days }) => ({
  value,
  label: code,
  badge: "A-9M",
  description: `รับ 5/14/2026 (${days} วัน) · 500 ชิ้น (50 Kg)`,
  meta: <Remaining tons={tons} />,
  keywords: ["A-9M", "lot"],
}));

const PROVINCE_OPTIONS: MultiSelectOption[] = [
  { value: "bkk", label: "กรุงเทพมหานคร" },
  { value: "cnx", label: "เชียงใหม่" },
  { value: "hkt", label: "ภูเก็ต" },
  { value: "kkc", label: "ขอนแก่น" },
  { value: "cbi", label: "ชลบุรี" },
  { value: "sni", label: "สุราษฎร์ธานี", disabled: true },
];

export function SectionCustom() {
  const t = useT();
  const [lots, setLots] = React.useState<string[]>(["lot-1", "lot-2"]);
  const [provinces, setProvinces] = React.useState<string[]>([]);

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
              แบบเต็ม: badge + คำอธิบาย + ค่าชิดขวา
            </span>
          </div>
          <div className="space-y-2 p-4">
            <Label htmlFor="lot-select">Lot</Label>
            <MultiSelect
              id="lot-select"
              options={LOT_OPTIONS}
              value={lots}
              onValueChange={setLots}
              placeholder="เลือก Lot"
              searchPlaceholder="ค้นหา"
              selectAllLabel="เลือกทั้งหมด"
            />
            <p className="text-sm text-muted-foreground">
              เลือกแล้ว {lots.length} รายการ
              {lots.length > 0 ? `: ${lots.join(", ")}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
          <div className="flex items-baseline justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
            <code className="text-xs font-medium">multi-select</code>
            <span className="text-xs text-muted-foreground">
              แบบเรียบ + maxChips
            </span>
          </div>
          <div className="space-y-2 p-4">
            <Label htmlFor="province-select">จังหวัดที่ให้บริการ</Label>
            <MultiSelect
              id="province-select"
              options={PROVINCE_OPTIONS}
              value={provinces}
              onValueChange={setProvinces}
              placeholder="เลือกจังหวัด"
              maxChips={2}
            />
            <p className="text-sm text-muted-foreground">
              เกิน 2 รายการจะยุบเป็น +n · สุราษฎร์ธานีถูกปิดไว้ (disabled)
            </p>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground">
          <div className="flex items-baseline justify-between gap-3 border-b border-border bg-muted/50 px-4 py-2.5">
            <code className="text-xs font-medium">multi-select</code>
            <span className="text-xs text-muted-foreground">
              ไม่มีเลือกทั้งหมด / ปิดใช้งาน
            </span>
          </div>
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="no-all-select">ไม่มีแถวเลือกทั้งหมด</Label>
              <MultiSelect
                id="no-all-select"
                options={PROVINCE_OPTIONS}
                defaultValue={["cnx"]}
                hideSelectAll
                hideCount
                placeholder="เลือกจังหวัด"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled-select">ปิดใช้งาน</Label>
              <MultiSelect
                id="disabled-select"
                options={PROVINCE_OPTIONS}
                defaultValue={["bkk"]}
                disabled
                placeholder="เลือกจังหวัด"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
