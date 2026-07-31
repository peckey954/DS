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
import { defineCopy, useCopy, useLocale, useT } from "@/lib/i18n";

type DayRange = { from: Date | undefined; to?: Date | undefined };

const COPY = defineCopy({
  th: {
    calendarHint: "ปฏิทินแบบฝังในหน้า",
    selected: "เลือก:",
    noDate: "ยังไม่ได้เลือกวันที่",
    appointment: "วันที่นัดหมาย",
    pickDate: "เลือกวันที่",
    pickerNote: "กดที่ปุ่มเพื่อเปิดปฏิทินในป๊อปโอเวอร์",
    rangeHint: "เลือกช่วงวัน 2 เดือน",
    noRange: "ยังไม่ได้เลือกช่วงวัน",
  },
  en: {
    calendarHint: "Calendar embedded in the page",
    selected: "Selected:",
    noDate: "No date selected yet",
    appointment: "Appointment date",
    pickDate: "Pick a date",
    pickerNote: "Click the button to open the calendar in a popover",
    rangeHint: "Pick a range across two months",
    noRange: "No range selected yet",
  },
});

export function SectionDate() {
  const t = useT();
  const c = useCopy(COPY);
  const locale = useLocale();
  const [single, setSingle] = React.useState<Date | undefined>(undefined);
  const [picked, setPicked] = React.useState<Date | undefined>(undefined);
  const [range, setRange] = React.useState<DayRange | undefined>(undefined);

  const fmt = (d: Date) => d.toLocaleDateString(locale, { dateStyle: "medium" });

  return (
    <Section
      id="date"
      title={t("section.date")}
      hint="calendar · date picker (calendar + popover) · date range"
    >
      <Demo name="calendar" hint={c.calendarHint}>
        <div className="w-full space-y-3">
          <Calendar
            mode="single"
            selected={single}
            onSelect={setSingle}
            captionLayout="dropdown"
            className="rounded-md border border-border"
          />
          <p className="text-sm text-muted-foreground">
            {single ? `${c.selected} ${fmt(single)}` : c.noDate}
          </p>
        </div>
      </Demo>

      <Demo name="date picker" hint="calendar + popover">
        <div className="w-full space-y-2">
          <Label htmlFor="date-picker">{c.appointment}</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-picker"
                variant="outline"
                className="w-full justify-start font-normal"
              >
                <CalendarIcon />
                {picked ? (
                  fmt(picked)
                ) : (
                  <span className="text-muted-foreground">{c.pickDate}</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={picked} onSelect={setPicked} />
            </PopoverContent>
          </Popover>
          <p className="text-sm text-muted-foreground">{c.pickerNote}</p>
        </div>
      </Demo>

      <Demo name="calendar (range)" hint={c.rangeHint} wide>
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
              ? `${fmt(range.from)}${range.to ? ` — ${fmt(range.to)}` : ""}`
              : c.noRange}
          </p>
        </div>
      </Demo>
    </Section>
  );
}
