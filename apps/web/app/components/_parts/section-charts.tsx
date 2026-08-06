"use client";

import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ReferenceLine,
  Sector,
  XAxis,
  YAxis,
  type PieSectorDataItem,
} from "recharts";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@peckey954/ui/components/ui/chart";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@peckey954/ui/components/ui/toggle-group";
import { cn } from "@peckey954/ui/lib/utils";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useLocale, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    lineHint: "เส้นหลายชุด · hover ขึ้นเส้นตั้ง + tooltip",
    areaHint: "พื้นที่ซ้อน · ไล่เฉดจาก token",
    barHint: "กดสลับชุดข้อมูลที่หัวกราฟ",
    barBasicHint: "แท่งตั้ง ชุดเดียว",
    barHorizontalHint: "แท่งนอน · ชื่อยาวอ่านง่ายกว่า",
    barMultipleHint: "เทียบ 2 ชุด วางคู่กัน",
    barStackedHint: "ซ้อนกัน — ดูยอดรวมต่อเดือน",
    barLabelHint: "ติดตัวเลขบนหัวแท่ง",
    barCustomLabelHint: "ชื่อในแท่ง + ค่าท้ายแท่ง",
    barMixedHint: "แท่งละสี ใช้เทียบหมวดที่ไม่มีลำดับ",
    barActiveHint: "เน้นแท่งที่สูงสุดไว้ตั้งแต่แรก",
    barNegativeHint: "ค่าบวก/ลบ แยกสี มีเส้นศูนย์",
    netChange: "เปลี่ยนแปลง",
    pieHint: "วงกลม + ป้ายค่าติดชิ้น",
    donutHint: "โดนัท · hover แล้วชิ้นขยาย",
    radialHint: "แท่งโค้ง · hover ทีละชิ้น",
    radarHint: "เรดาร์เทียบ 2 ชุด",
    playgroundHint: "กดปุ่มแล้ว tooltip เปลี่ยนให้เห็นทันที",

    online: "ออนไลน์",
    store: "หน้าร้าน",
    dealer: "ตัวแทน",
    export: "ส่งออก",
    other: "อื่น ๆ",
    thisYear: "ปีนี้",
    lastYear: "ปีที่แล้ว",

    total: "รวม",
    unit: "รายการ",
    baht: "บาท",

    indicatorDot: "จุด",
    indicatorLine: "แท่ง",
    indicatorDashed: "ประ",
    hideLabel: "ซ่อนหัวข้อ",
    hideIndicator: "ซ่อนสัญลักษณ์",
    playgroundNote:
      "ทั้งหมดนี้คือ prop ของ ChartTooltipContent — indicator · hideLabel · hideIndicator · tooltip ถูกปักไว้ที่ เม.ย. ด้วย defaultIndex ให้เห็นผลทันทีที่กด เลื่อนเมาส์ทับกราฟก็ยังใช้ได้ตามปกติ",

    axQuality: "คุณภาพ",
    axPrice: "ราคา",
    axService: "บริการ",
    axDelivery: "จัดส่ง",
    axDesign: "ดีไซน์",
    axValue: "ความคุ้มค่า",
  },
  en: {
    lineHint: "Multi-series line · crosshair + tooltip on hover",
    areaHint: "Stacked area · gradient from tokens",
    barHint: "Click the header to switch series",
    barBasicHint: "Vertical bars, single series",
    barHorizontalHint: "Horizontal · easier with long names",
    barMultipleHint: "Two series side by side",
    barStackedHint: "Stacked — read the monthly total",
    barLabelHint: "Values on top of each bar",
    barCustomLabelHint: "Name inside the bar, value at the end",
    barMixedHint: "One colour per bar, for unordered categories",
    barActiveHint: "Highlights the tallest bar up front",
    barNegativeHint: "Positive/negative split by colour, with a zero line",
    netChange: "Change",
    pieHint: "Pie with per-slice value labels",
    donutHint: "Donut · slice grows on hover",
    radialHint: "Radial bars · hover one at a time",
    radarHint: "Radar comparing two series",
    playgroundHint: "Press a button and the tooltip updates right away",

    online: "Online",
    store: "Store",
    dealer: "Dealer",
    export: "Export",
    other: "Other",
    thisYear: "This year",
    lastYear: "Last year",

    total: "Total",
    unit: "orders",
    baht: "THB",

    indicatorDot: "Dot",
    indicatorLine: "Line",
    indicatorDashed: "Dashed",
    hideLabel: "Hide label",
    hideIndicator: "Hide indicator",
    playgroundNote:
      "These are all ChartTooltipContent props — indicator · hideLabel · hideIndicator. The tooltip is pinned to Apr via defaultIndex so changes show immediately; hovering the chart still works as usual.",

    axQuality: "Quality",
    axPrice: "Price",
    axService: "Service",
    axDelivery: "Delivery",
    axDesign: "Design",
    axValue: "Value",
  },
});

const MONTHS = {
  th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
};

/** ยอดขายรายเดือน แยกช่องทาง — ใช้ร่วมกันทั้ง line / area / bar */
const MONTHLY = [
  { online: 186, store: 140 },
  { online: 305, store: 198 },
  { online: 237, store: 220 },
  { online: 273, store: 190 },
  { online: 309, store: 246 },
  { online: 384, store: 262 },
];

/** สัดส่วนยอดขายตามช่องทาง — ใช้ร่วมกันทั้ง pie / donut / radial */
const CHANNELS = [
  { channel: "store", value: 3200 },
  { channel: "online", value: 2400 },
  { channel: "dealer", value: 1500 },
  { channel: "export", value: 900 },
  { channel: "other", value: 400 },
];

/** ส่วนต่างจากเดือนก่อนหน้า — มีทั้งบวกและลบ ใช้กับ bar แบบค่าลบ */
const NET_CHANGE = [58, -24, 82, -36, 39, 75];

const RADAR_VALUES = [
  { now: 86, before: 70 },
  { now: 72, before: 78 },
  { now: 90, before: 66 },
  { now: 64, before: 60 },
  { now: 78, before: 55 },
  { now: 82, before: 74 },
];

export function SectionCharts() {
  const t = useT();
  const c = useCopy(COPY);
  const locale = useLocale();
  const months = locale === "th-TH" ? MONTHS.th : MONTHS.en;

  const monthly = MONTHLY.map((v, i) => ({ month: months[i], ...v }));

  /** สีมาจาก token chart-1…5 เท่านั้น — สลับแบรนด์แล้วกราฟเปลี่ยนตาม */
  const seriesConfig = {
    online: { label: c.online, color: "var(--chart-1)" },
    store: { label: c.store, color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const channelConfig = {
    value: { label: c.total },
    store: { label: c.store, color: "var(--chart-1)" },
    online: { label: c.online, color: "var(--chart-2)" },
    dealer: { label: c.dealer, color: "var(--chart-3)" },
    export: { label: c.export, color: "var(--chart-4)" },
    other: { label: c.other, color: "var(--chart-5)" },
  } satisfies ChartConfig;

  const radarConfig = {
    now: { label: c.thisYear, color: "var(--chart-1)" },
    before: { label: c.lastYear, color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const channels = CHANNELS.map((row) => ({
    ...row,
    fill: `var(--color-${row.channel})`,
  }));
  const channelTotal = channels.reduce((sum, row) => sum + row.value, 0);

  const radarAxes = [
    c.axQuality,
    c.axPrice,
    c.axService,
    c.axDelivery,
    c.axDesign,
    c.axValue,
  ];
  const radarData = RADAR_VALUES.map((v, i) => ({ axis: radarAxes[i], ...v }));

  /** ขึ้น/ลง เป็นคู่สีตรงข้าม ไม่ใช่สีสถานะ — สีสถานะสงวนไว้ให้ badge/alert */
  const netConfig = {
    delta: { label: c.netChange },
  } satisfies ChartConfig;
  const netChange = NET_CHANGE.map((delta, i) => ({
    month: months[i],
    delta,
    fill: delta >= 0 ? "var(--chart-2)" : "var(--chart-5)",
  }));

  return (
    <Section
      id="charts"
      title={t("section.charts")}
      hint="line · area · bar ×9 · pie · donut · radial · radar — recharts + ChartContainer"
    >
      <LineDemo hint={c.lineHint} data={monthly} config={seriesConfig} />
      <AreaDemo hint={c.areaHint} data={monthly} config={seriesConfig} />

      {/* ตระกูล bar — ตั้ง / นอน / เทียบ / ซ้อน / ป้ายค่า / ผสมสี / เน้นแท่ง / ค่าลบ / กดสลับ */}
      <BarBasicDemo hint={c.barBasicHint} data={monthly} config={seriesConfig} />
      <BarHorizontalDemo
        hint={c.barHorizontalHint}
        data={channels}
        config={channelConfig}
      />
      <BarMultipleDemo
        hint={c.barMultipleHint}
        data={monthly}
        config={seriesConfig}
      />
      <BarStackedDemo
        hint={c.barStackedHint}
        data={monthly}
        config={seriesConfig}
      />
      <BarLabelDemo hint={c.barLabelHint} data={monthly} config={seriesConfig} />
      <BarCustomLabelDemo
        hint={c.barCustomLabelHint}
        data={channels}
        config={channelConfig}
      />
      <BarMixedDemo
        hint={c.barMixedHint}
        data={channels}
        config={channelConfig}
      />
      <BarActiveDemo hint={c.barActiveHint} data={monthly} config={seriesConfig} />
      <BarNegativeDemo
        hint={c.barNegativeHint}
        data={netChange}
        config={netConfig}
      />
      <BarDemo
        hint={c.barHint}
        data={monthly}
        config={seriesConfig}
        locale={locale}
      />

      <PieDemo hint={c.pieHint} data={channels} config={channelConfig} />
      <DonutDemo
        hint={c.donutHint}
        data={channels}
        config={channelConfig}
        total={channelTotal}
        totalLabel={c.total}
        locale={locale}
      />
      <RadialDemo hint={c.radialHint} data={channels} config={channelConfig} />
      <RadarDemo hint={c.radarHint} data={radarData} config={radarConfig} />
      <TooltipPlayground hint={c.playgroundHint} data={monthly} config={seriesConfig} c={c} />
    </Section>
  );
}

/* ------------------------------- line ------------------------------- */

function LineDemo({
  hint,
  data,
  config,
}: {
  hint: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
}) {
  return (
    <Demo name="chart — line" hint={hint} wide bodyClassName="block">
      <ChartContainer config={config} className="h-64 w-full">
        <LineChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="online"
            type="monotone"
            stroke="var(--color-online)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            dataKey="store"
            type="monotone"
            stroke="var(--color-store)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>
    </Demo>
  );
}

/* ------------------------------- area ------------------------------- */

function AreaDemo({
  hint,
  data,
  config,
}: {
  hint: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
}) {
  return (
    <Demo name="chart — area" hint={hint} wide bodyClassName="block">
      <ChartContainer config={config} className="h-64 w-full">
        <AreaChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
          <defs>
            {["online", "store"].map((key) => (
              <linearGradient
                key={key}
                id={`fill-${key}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.7}
                />
                <stop
                  offset="95%"
                  stopColor={`var(--color-${key})`}
                  stopOpacity={0.05}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
          <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
          <ChartLegend content={<ChartLegendContent />} />
          {/* stroke 2px คือช่องว่างระหว่างชั้น ทำให้แยกชั้นออกจากกันได้ */}
          <Area
            dataKey="store"
            type="monotone"
            stackId="a"
            stroke="var(--color-store)"
            strokeWidth={2}
            fill="url(#fill-store)"
          />
          <Area
            dataKey="online"
            type="monotone"
            stackId="a"
            stroke="var(--color-online)"
            strokeWidth={2}
            fill="url(#fill-online)"
          />
        </AreaChart>
      </ChartContainer>
    </Demo>
  );
}

/* ------------------------------ ตระกูล bar ------------------------------ */

type BarDemoProps = {
  hint: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
};

/** แกน + กริดชุดเดียวกันทุกกราฟแท่งแนวตั้ง */
function VerticalBarAxes() {
  return (
    <>
      <CartesianGrid vertical={false} />
      <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
      <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
    </>
  );
}

/** แท่งตั้ง ชุดเดียว */
function BarBasicDemo({ hint, data, config }: BarDemoProps) {
  return (
    <Demo name="chart — bar" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
          <VerticalBarAxes />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="online" fill="var(--color-online)" radius={4} />
        </BarChart>
      </ChartContainer>
    </Demo>
  );
}

/** แท่งนอน — layout="vertical" ของ recharts คือแท่งนอน */
function BarHorizontalDemo({
  hint,
  data,
  config,
}: {
  hint: string;
  data: { channel: string }[];
  config: ChartConfig;
}) {
  return (
    <Demo name="chart — bar (แนวนอน)" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 4, right: 16, top: 4, bottom: 4 }}
        >
          <CartesianGrid horizontal={false} />
          <XAxis type="number" dataKey="value" hide />
          <YAxis
            type="category"
            dataKey="channel"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={64}
            tickFormatter={(key: string) => String(config[key]?.label ?? key)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="channel" hideLabel />}
          />
          <Bar dataKey="value" radius={4} />
        </BarChart>
      </ChartContainer>
    </Demo>
  );
}

/** เทียบ 2 ชุด วางคู่กัน */
function BarMultipleDemo({ hint, data, config }: BarDemoProps) {
  return (
    <Demo name="chart — bar (เปรียบเทียบ)" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
          <VerticalBarAxes />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar dataKey="online" fill="var(--color-online)" radius={4} />
          <Bar dataKey="store" fill="var(--color-store)" radius={4} />
        </BarChart>
      </ChartContainer>
    </Demo>
  );
}

/** ซ้อนกัน — เว้น 2px ระหว่างชั้นด้วย stroke สีพื้นการ์ด */
function BarStackedDemo({ hint, data, config }: BarDemoProps) {
  return (
    <Demo name="chart — bar (ซ้อน)" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
          <VerticalBarAxes />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
          <Bar
            dataKey="store"
            stackId="a"
            fill="var(--color-store)"
            stroke="var(--card)"
            strokeWidth={2}
          />
          <Bar
            dataKey="online"
            stackId="a"
            fill="var(--color-online)"
            stroke="var(--card)"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ChartContainer>
    </Demo>
  );
}

/** ติดตัวเลขบนหัวแท่ง */
function BarLabelDemo({ hint, data, config }: BarDemoProps) {
  return (
    <Demo name="chart — bar (ป้ายค่า)" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart data={data} margin={{ left: 4, right: 12, top: 24 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="online" fill="var(--color-online)" radius={4}>
            {/* ป้ายใช้สีตัวอักษร ไม่ใช้สีของแท่ง */}
            <LabelList
              position="top"
              offset={8}
              className="fill-muted-foreground"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </Demo>
  );
}

/** ชื่อในแท่ง + ค่าท้ายแท่ง */
function BarCustomLabelDemo({
  hint,
  data,
  config,
}: {
  hint: string;
  data: { channel: string }[];
  config: ChartConfig;
}) {
  return (
    <Demo name="chart — bar (ป้ายในแท่ง)" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 0, right: 40, top: 4, bottom: 4 }}
        >
          <XAxis type="number" dataKey="value" hide />
          <YAxis type="category" dataKey="channel" hide />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="channel" hideLabel />}
          />
          <Bar dataKey="value" radius={4}>
            <LabelList
              dataKey="channel"
              position="insideLeft"
              offset={10}
              className="fill-background font-medium"
              fontSize={11}
              formatter={(key) => String(config[String(key)]?.label ?? key)}
            />
            <LabelList
              dataKey="value"
              position="right"
              offset={8}
              className="fill-muted-foreground"
              fontSize={11}
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </Demo>
  );
}

/** แท่งละสี — สีมาจาก field fill ในข้อมูล */
function BarMixedDemo({
  hint,
  data,
  config,
}: {
  hint: string;
  data: { channel: string }[];
  config: ChartConfig;
}) {
  return (
    <Demo name="chart — bar (ผสมสี)" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 4, right: 16, top: 4, bottom: 4 }}
        >
          <XAxis type="number" dataKey="value" hide />
          <YAxis
            type="category"
            dataKey="channel"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            width={64}
            tickFormatter={(key: string) => String(config[key]?.label ?? key)}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="channel" hideLabel />}
          />
          <Bar dataKey="value" radius={4} />
        </BarChart>
      </ChartContainer>
    </Demo>
  );
}

/** เน้นแท่งที่สูงสุด — แท่งอื่นหรี่ลงด้วย opacity ไม่เปลี่ยนสี */
function BarActiveDemo({ hint, data, config }: BarDemoProps) {
  const peak = data.reduce(
    (best, row, i) => (Number(row.online) > Number(data[best].online) ? i : best),
    0
  );

  return (
    <Demo name="chart — bar (เน้นแท่ง)" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
          <VerticalBarAxes />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Bar dataKey="online" radius={4}>
            {data.map((row, i) => (
              <Cell
                key={String(row.month)}
                fill="var(--color-online)"
                fillOpacity={i === peak ? 1 : 0.4}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </Demo>
  );
}

/** ค่าบวก/ลบ — เส้นศูนย์คั่น สีมาจาก field fill ในข้อมูล */
function BarNegativeDemo({ hint, data, config }: BarDemoProps) {
  return (
    <Demo name="chart — bar (ค่าลบ)" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="h-56 w-full">
        <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
          <ReferenceLine y={0} stroke="var(--border)" />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideIndicator />}
          />
          <Bar dataKey="delta" radius={4} />
        </BarChart>
      </ChartContainer>
    </Demo>
  );
}

/* ------------------------- bar (กดสลับชุดข้อมูล) ------------------------- */

const BAR_KEYS = ["online", "store"] as const;

function BarDemo({
  hint,
  data,
  config,
  locale,
}: {
  hint: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
  locale: string;
}) {
  const [active, setActive] = React.useState<(typeof BAR_KEYS)[number]>(
    "online"
  );

  const totals = React.useMemo(
    () =>
      Object.fromEntries(
        BAR_KEYS.map((key) => [
          key,
          data.reduce((sum, row) => sum + Number(row[key] ?? 0), 0),
        ])
      ) as Record<(typeof BAR_KEYS)[number], number>,
    [data]
  );

  return (
    <Demo name="chart — bar" hint={hint} wide bodyClassName="block p-0">
      <div className="flex border-b border-border">
        {BAR_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            aria-pressed={active === key}
            className={cn(
              "flex flex-1 flex-col gap-1 border-r border-border px-4 py-3 text-left transition-colors last:border-r-0",
              "hover:bg-muted/60 focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
              active === key && "bg-muted"
            )}
          >
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="size-2 shrink-0 rounded-[2px]"
                style={{ background: `var(--color-${key})` }}
              />
              {config[key]?.label}
            </span>
            <span className="text-lg font-semibold tabular-nums">
              {totals[key].toLocaleString(locale)}
            </span>
          </button>
        ))}
      </div>
      <div className="p-4">
        <ChartContainer config={config} className="h-56 w-full">
          <BarChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel={false} />}
            />
            <Bar dataKey={active} fill={`var(--color-${active})`} radius={4} />
          </BarChart>
        </ChartContainer>
      </div>
    </Demo>
  );
}

/* -------------------------------- pie -------------------------------- */

/**
 * recharts 3 เรียง payload ของ legend ตามตัวอักษรและไม่ยอมให้ส่ง payload เอง
 * (prop ถูก Omit ออกจาก type) — กราฟกลุ่มวงกลมเลยวาด legend เองเพื่อให้ลำดับ
 * ตรงกับลำดับชิ้นในกราฟ ส่วน line / area / radar ยังใช้ ChartLegendContent ตามปกติ
 */
function ChannelLegend({
  data,
  config,
}: {
  data: { channel: string }[];
  config: ChartConfig;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs">
      {data.map((row) => (
        <span key={row.channel} className="flex items-center gap-1.5">
          {/* legend อยู่นอก ChartContainer จึงอ้าง --color-* ไม่ได้ (ตัวแปรถูก
              scope ไว้ที่ [data-chart]) — หยิบสีจาก config ตรง ๆ แทน */}
          <span
            className="size-2 shrink-0 rounded-[2px]"
            style={{ background: config[row.channel]?.color }}
          />
          {config[row.channel]?.label}
        </span>
      ))}
    </div>
  );
}

function PieDemo({
  hint,
  data,
  config,
}: {
  hint: string;
  data: { channel: string }[];
  config: ChartConfig;
}) {
  return (
    <Demo name="chart — pie" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="mx-auto h-72 w-full">
        <PieChart margin={{ top: 16, bottom: 0, left: 16, right: 16 }}>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="channel" hideLabel />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="channel"
            /* ป้ายตัวเลขใช้สีตัวอักษร ไม่ใช้สีของชิ้น — สีชิ้นทำหน้าที่บอกว่าเป็นใครอยู่แล้ว */
            label={{ fill: "var(--muted-foreground)" }}
            labelLine={false}
            outerRadius={70}
          />
        </PieChart>
      </ChartContainer>
      <ChannelLegend data={data} config={config} />
    </Demo>
  );
}

/* ---------------------- donut (hover แล้วชิ้นขยาย) ---------------------- */

function DonutDemo({
  hint,
  data,
  config,
  total,
  totalLabel,
  locale,
}: {
  hint: string;
  data: { channel: string }[];
  config: ChartConfig;
  total: number;
  totalLabel: string;
  locale: string;
}) {
  return (
    <Demo name="chart — pie (donut)" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="mx-auto h-72 w-full">
        <PieChart>
          <ChartTooltip
            content={<ChartTooltipContent nameKey="channel" hideLabel />}
          />
          <Pie
            data={data}
            dataKey="value"
            nameKey="channel"
            innerRadius={58}
            outerRadius={86}
            strokeWidth={2}
            stroke="var(--card)"
            /* hover ชิ้นไหน ชิ้นนั้นยื่นออกมา 8px */
            activeShape={({ outerRadius = 0, ...rest }: PieSectorDataItem) => (
              <Sector {...rest} outerRadius={outerRadius + 8} />
            )}
          >
            <Label
              content={({ viewBox }) => {
                if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                  return null;
                }
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-xl font-semibold tabular-nums"
                    >
                      {total.toLocaleString(locale)}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 20}
                      className="fill-muted-foreground text-xs"
                    >
                      {totalLabel}
                    </tspan>
                  </text>
                );
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
      <ChannelLegend data={data} config={config} />
    </Demo>
  );
}

/* ------------------------------- radial ------------------------------- */

function RadialDemo({
  hint,
  data,
  config,
}: {
  hint: string;
  data: { channel: string }[];
  config: ChartConfig;
}) {
  return (
    <Demo name="chart — radial" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="mx-auto h-72 w-full">
        <RadialBarChart
          data={data}
          innerRadius={24}
          outerRadius={96}
          startAngle={90}
          endAngle={-270}
        >
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent nameKey="channel" hideLabel />}
          />
          <RadialBar dataKey="value" background cornerRadius={4} />
        </RadialBarChart>
      </ChartContainer>
      <ChannelLegend data={data} config={config} />
    </Demo>
  );
}

/* -------------------------------- radar -------------------------------- */

function RadarDemo({
  hint,
  data,
  config,
}: {
  hint: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
}) {
  return (
    <Demo name="chart — radar" hint={hint} bodyClassName="block">
      <ChartContainer config={config} className="mx-auto h-64 w-full">
        <RadarChart data={data} outerRadius={80}>
          <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
          <PolarGrid />
          <PolarAngleAxis dataKey="axis" />
          <Radar
            dataKey="before"
            stroke="var(--color-before)"
            fill="var(--color-before)"
            fillOpacity={0.15}
            strokeWidth={2}
          />
          <Radar
            dataKey="now"
            stroke="var(--color-now)"
            fill="var(--color-now)"
            fillOpacity={0.3}
            strokeWidth={2}
            dot={{ r: 4 }}
          />
          <ChartLegend content={<ChartLegendContent />} />
        </RadarChart>
      </ChartContainer>
    </Demo>
  );
}

/* -------------------- ลองรูปแบบ tooltip ตอน hover -------------------- */

type Indicator = "dot" | "line" | "dashed";

function TooltipPlayground({
  hint,
  data,
  config,
  c,
}: {
  hint: string;
  data: Record<string, unknown>[];
  config: ChartConfig;
  c: {
    indicatorDot: string;
    indicatorLine: string;
    indicatorDashed: string;
    hideLabel: string;
    hideIndicator: string;
    playgroundNote: string;
  };
}) {
  const [indicator, setIndicator] = React.useState<Indicator>("dot");
  const [flags, setFlags] = React.useState<string[]>([]);

  return (
    <Demo name="ChartTooltipContent" hint={hint} wide bodyClassName="block">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={indicator}
          onValueChange={(v) => v && setIndicator(v as Indicator)}
        >
          <ToggleGroupItem value="dot">{c.indicatorDot}</ToggleGroupItem>
          <ToggleGroupItem value="line">{c.indicatorLine}</ToggleGroupItem>
          <ToggleGroupItem value="dashed">{c.indicatorDashed}</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="multiple"
          variant="outline"
          size="sm"
          value={flags}
          onValueChange={setFlags}
        >
          <ToggleGroupItem value="hideLabel">{c.hideLabel}</ToggleGroupItem>
          <ToggleGroupItem value="hideIndicator">
            {c.hideIndicator}
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      <ChartContainer config={config} className="h-56 w-full">
        <LineChart data={data} margin={{ left: 4, right: 12, top: 8 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <YAxis tickLine={false} axisLine={false} tickMargin={8} width={36} />
          {/* defaultIndex ปัก tooltip ค้างไว้ 1 จุด — ไม่งั้นกดปุ่มแล้วไม่เห็นอะไร
              เลย เพราะ tooltip โผล่เฉพาะตอน hover เลื่อนเมาส์ทับกราฟยังใช้ได้ปกติ */}
          <ChartTooltip
            defaultIndex={3}
            content={
              <ChartTooltipContent
                indicator={indicator}
                hideLabel={flags.includes("hideLabel")}
                hideIndicator={flags.includes("hideIndicator")}
              />
            }
          />
          <ChartLegend content={<ChartLegendContent />} />
          <Line
            dataKey="online"
            type="monotone"
            stroke="var(--color-online)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
          <Line
            dataKey="store"
            type="monotone"
            stroke="var(--color-store)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ChartContainer>

      <p className="mt-3 text-xs text-muted-foreground">{c.playgroundNote}</p>
    </Demo>
  );
}
