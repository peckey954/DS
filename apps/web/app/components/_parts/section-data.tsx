"use client";

import { CheckIcon, FileTextIcon, ImageIcon, MusicIcon } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@repo/ui/components/ui/avatar";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/components/ui/carousel";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@repo/ui/components/ui/chart";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@repo/ui/components/ui/item";
import { Kbd, KbdGroup } from "@repo/ui/components/ui/kbd";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@repo/ui/components/ui/table";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useLocale, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    tableHint: "ตารางข้อมูล",
    tableCaption: "ใบแจ้งหนี้ล่าสุด 3 รายการ",
    colId: "เลขที่",
    colCustomer: "ลูกค้า",
    colStatus: "สถานะ",
    colAmount: "จำนวนเงิน",
    total: "รวมทั้งหมด",
    paid: "จ่ายแล้ว",
    pending: "รอชำระ",
    overdue: "ค้างชำระ",
    cust1: "สมชาย ใจดี",
    cust2: "มานี รักเรียน",
    cust3: "ปิติ ยินดี",
    chartHint: "recharts + สีจาก token chart-1…5",
    chartWeb: "เว็บ",
    chartApp: "แอป",
    accordionHint: "พับ / กางทีละหัวข้อ",
    q1: "เปลี่ยนสีของแบรนด์ยังไง?",
    a1: "แก้ค่าในไฟล์ packages/tokens/src/<brand>.css — ไม่ต้องแตะ component",
    q2: "เพิ่มแบรนด์ใหม่ต้องทำอะไร?",
    a2: "ก็อปไฟล์ token 1 ไฟล์ เปลี่ยน selector เป็นชื่อแบรนด์ใหม่ แล้ว import",
    q3: "เพิ่ม component ใหม่ยังไง?",
    a3: "รัน pnpm dlx shadcn@latest add <name> ในโฟลเดอร์ apps/web",
    carouselHint: "เลื่อนดูทีละการ์ด",
    avatarHint: "รูปโปรไฟล์ / กลุ่ม / จุดสถานะ",
    badgeHint: "ป้ายสถานะ 6 variant",
    badgeDefault: "ค่าเริ่มต้น",
    badgeSecondary: "รอง",
    badgeDestructive: "อันตราย",
    badgeOutline: "เส้นขอบ",
    badgeGhost: "โปร่ง",
    badgeLink: "ลิงก์",
    kbdHint: "แสดงปุ่มลัดบนคีย์บอร์ด",
    kbdSearch: "เปิดการค้นหา",
    kbdSave: "บันทึก",
    kbdExit: "ออกจากโหมดเต็มจอ",
    itemHint: "แถวรายการพร้อมไอคอนและปุ่ม",
    download: "ดาวน์โหลด",
    file1: "สรุปงบประมาณ.pdf",
    file2: "ภาพหน้าปก.png",
    file3: "เสียงประกอบ.mp3",
    initials: "สม,มน,ปต",
  },
  en: {
    tableHint: "Data table",
    tableCaption: "The 3 most recent invoices",
    colId: "Number",
    colCustomer: "Customer",
    colStatus: "Status",
    colAmount: "Amount",
    total: "Total",
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    cust1: "Somchai Jaidee",
    cust2: "Manee Rakrian",
    cust3: "Piti Yindee",
    chartHint: "recharts with colours from chart-1…5 tokens",
    chartWeb: "Web",
    chartApp: "App",
    accordionHint: "Expand one section at a time",
    q1: "How do I change the brand colours?",
    a1: "Edit packages/tokens/src/<brand>.css — no component changes needed",
    q2: "What does adding a new brand involve?",
    a2: "Copy one token file, change the selector to the new brand, then import it",
    q3: "How do I add a new component?",
    a3: "Run pnpm dlx shadcn@latest add <name> inside apps/web",
    carouselHint: "Swipe through cards one at a time",
    avatarHint: "Avatar / group / status dot",
    badgeHint: "Status badge, 6 variants",
    badgeDefault: "Default",
    badgeSecondary: "Secondary",
    badgeDestructive: "Destructive",
    badgeOutline: "Outline",
    badgeGhost: "Ghost",
    badgeLink: "Link",
    kbdHint: "Show keyboard shortcuts",
    kbdSearch: "Open search",
    kbdSave: "Save",
    kbdExit: "Exit full screen",
    itemHint: "List row with an icon and an action",
    download: "Download",
    file1: "budget-summary.pdf",
    file2: "cover-image.png",
    file3: "background-audio.mp3",
    initials: "SJ,MR,PY",
  },
});

const MONTHS = {
  th: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย."],
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
};

const CHART_VALUES = [
  { web: 186, app: 80 },
  { web: 305, app: 200 },
  { web: 237, app: 120 },
  { web: 273, app: 190 },
  { web: 209, app: 130 },
  { web: 314, app: 240 },
];

const FILE_ICONS = [FileTextIcon, ImageIcon, MusicIcon];

export function SectionData() {
  const t = useT();
  const c = useCopy(COPY);
  const locale = useLocale();
  const months = locale === "th-TH" ? MONTHS.th : MONTHS.en;

  const chartData = CHART_VALUES.map((v, i) => ({ month: months[i], ...v }));
  const chartConfig = {
    web: { label: c.chartWeb, color: "var(--chart-1)" },
    app: { label: c.chartApp, color: "var(--chart-2)" },
  } satisfies ChartConfig;

  const invoices = [
    { id: "INV-001", customer: c.cust1, status: c.paid, amount: 12500 },
    { id: "INV-002", customer: c.cust2, status: c.pending, amount: 8300 },
    { id: "INV-003", customer: c.cust3, status: c.overdue, amount: 4100 },
  ];

  const files = [
    { icon: FILE_ICONS[0], name: c.file1, meta: "PDF · 2.4 MB" },
    { icon: FILE_ICONS[1], name: c.file2, meta: "PNG · 840 KB" },
    { icon: FILE_ICONS[2], name: c.file3, meta: "MP3 · 5.1 MB" },
  ];

  return (
    <Section
      id="data"
      title={t("section.data")}
      hint="table · chart · accordion · carousel · avatar · badge · item · kbd"
    >
      <Demo name="table" hint={c.tableHint} wide>
        <Table>
          <TableCaption>{c.tableCaption}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>{c.colId}</TableHead>
              <TableHead>{c.colCustomer}</TableHead>
              <TableHead>{c.colStatus}</TableHead>
              <TableHead className="text-right">{c.colAmount}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.id}</TableCell>
                <TableCell>{inv.customer}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.status === c.paid
                        ? "default"
                        : inv.status === c.pending
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ฿{inv.amount.toLocaleString(locale)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>{c.total}</TableCell>
              <TableCell className="text-right">
                ฿
                {invoices
                  .reduce((sum, i) => sum + i.amount, 0)
                  .toLocaleString(locale)}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Demo>

      <Demo name="chart" hint={c.chartHint} wide>
        <ChartContainer config={chartConfig} className="h-64 w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="web" fill="var(--color-web)" radius={4} />
            <Bar dataKey="app" fill="var(--color-app)" radius={4} />
          </BarChart>
        </ChartContainer>
      </Demo>

      <Demo name="accordion" hint={c.accordionHint}>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="1">
            <AccordionTrigger>{c.q1}</AccordionTrigger>
            <AccordionContent>
              {c.a1}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>{c.q2}</AccordionTrigger>
            <AccordionContent>
              {c.a2}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="3">
            <AccordionTrigger>{c.q3}</AccordionTrigger>
            <AccordionContent>
              {c.a3}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>

      <Demo name="carousel" hint={c.carouselHint}>
        <div className="mx-auto w-full max-w-xs px-10">
          <Carousel>
            <CarouselContent>
              {Array.from({ length: 5 }, (_, i) => (
                <CarouselItem key={i}>
                  <div className="flex aspect-square items-center justify-center rounded-lg border border-border bg-muted text-3xl font-semibold">
                    {i + 1}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </Demo>

      <Demo name="avatar" hint={c.avatarHint}>
        <div className="w-full space-y-4">
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>{c.initials.split(",")[0]}</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>{c.initials.split(",")[1]}</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>{c.initials.split(",")[2]}</AvatarFallback>
              <AvatarBadge>
                <CheckIcon />
              </AvatarBadge>
            </Avatar>
          </div>
          <AvatarGroup>
            {c.initials.split(",").map((initials) => (
              <Avatar key={initials}>
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+9</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </Demo>

      <Demo name="badge" hint={c.badgeHint}>
        <div className="flex w-full flex-wrap gap-2">
          <Badge>{c.badgeDefault}</Badge>
          <Badge variant="secondary">{c.badgeSecondary}</Badge>
          <Badge variant="destructive">{c.badgeDestructive}</Badge>
          <Badge variant="outline">{c.badgeOutline}</Badge>
          <Badge variant="ghost">{c.badgeGhost}</Badge>
          <Badge variant="link">{c.badgeLink}</Badge>
        </div>
      </Demo>

      <Demo name="kbd" hint={c.kbdHint}>
        <div className="w-full space-y-3 text-sm">
          <p className="flex items-center gap-2">
            {c.kbdSearch}
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </p>
          <p className="flex items-center gap-2">
            {c.kbdSave}
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>S</Kbd>
            </KbdGroup>
          </p>
          <p className="flex items-center gap-2">
            {c.kbdExit}
            <Kbd>Esc</Kbd>
          </p>
        </div>
      </Demo>

      <Demo name="item" hint={c.itemHint} wide>
        <ItemGroup className="w-full rounded-md border border-border">
          {files.map((file, i) => (
            <div key={file.name}>
              {i > 0 ? <ItemSeparator /> : null}
              <Item>
                <ItemMedia variant="icon">
                  <file.icon />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>{file.name}</ItemTitle>
                  <ItemDescription>{file.meta}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button variant="outline" size="sm">
                    {c.download}
                  </Button>
                </ItemActions>
              </Item>
            </div>
          ))}
        </ItemGroup>
      </Demo>
    </Section>
  );
}
