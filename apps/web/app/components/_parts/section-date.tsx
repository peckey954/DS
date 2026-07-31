"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Button } from "@repo/ui/components/ui/button";
import { Calendar } from "@repo/ui/components/ui/calendar";
import { Label } from "@repo/ui/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";

import { Demo, Section } from "./showcase";
import { useT } from "@/lib/i18n";

type DayRange = { from: Date | undefined; to?: Date | undefined };

const thaiDate = (d: Date) =>
  d.toLocaleDateString("th-TH", { dateStyle: "medium" });

export function SectionDate() {
  const t = useT();
  const [single, setSingle] = React.useState<Date | undefined>(undefined);
  const [picked, setPicked] = React.useState<Date | undefined>(undefined);
  const [range, setRange] = React.useState<DayRange | undefined>(undefined);

  return (
    <Section
      id="date"
      title={t("section.date")}
      hint="calendar · date picker (calendar + popover) · date range"
    >
      <Demo name="calendar" hint="ปฏิทินแบบฝังในหน้า">
        <div className="w-full space-y-3">
          <Calendar
            mode="single"
            selected={single}
            onSelect={setSingle}
            captionLayout="dropdown"
            className="rounded-md border border-border"
          />
          <p className="text-sm text-muted-foreground">
            {single ? `เลือก: ${thaiDate(single)}` : "ยังไม่ได้เลือกวันที่"}
          </p>
        </div>
      </Demo>

      <Demo name="date picker" hint="calendar + popover">
        <div className="w-full space-y-2">
          <Label htmlFor="date-picker">วันที่นัดหมาย</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="outline"
                className="w-full justify-start font-normal"
              >
                <CalendarIcon />
                {picked ? (
                  thaiDate(picked)
                ) : (
                  <span className="text-muted-foreground">เลือกวันที่</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={picked} onSelect={setPicked} />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-muted-foreground">
            กดที่ปุ่มเพื่อเปิดปฏิทินในป๊อปโอเวอร์
          </p>
        </div>
      </Demo>

      <Demo name="calendar (range)" hint="เลือกช่วงวัน 2 เดือน" wide>
        <div className="w-full space-y-3">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            className="rounded-md border border-border"
          />
          <p className="text-sm text-muted-foreground">
            {range?.from
              ? `${thaiDate(range.from)}${
                  range.to ? ` — ${thaiDate(range.to)}` : ""
                }`
              : "ยังไม่ได้เลือกช่วงวัน"}
          </p>
        </div>
      </Demo>
    </Section>
  );
}
