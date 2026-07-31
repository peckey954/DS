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

const CHART_DATA = [
  { month: "ม.ค.", web: 186, app: 80 },
  { month: "ก.พ.", web: 305, app: 200 },
  { month: "มี.ค.", web: 237, app: 120 },
  { month: "เม.ย.", web: 273, app: 190 },
  { month: "พ.ค.", web: 209, app: 130 },
  { month: "มิ.ย.", web: 314, app: 240 },
];

const CHART_CONFIG = {
  web: { label: "เว็บ", color: "var(--chart-1)" },
  app: { label: "แอป", color: "var(--chart-2)" },
} satisfies ChartConfig;

const INVOICES = [
  { id: "INV-001", customer: "สมชาย ใจดี", status: "จ่ายแล้ว", amount: 12500 },
  { id: "INV-002", customer: "มานี รักเรียน", status: "รอชำระ", amount: 8300 },
  { id: "INV-003", customer: "ปิติ ยินดี", status: "ค้างชำระ", amount: 4100 },
];

const FILES = [
  { icon: FileTextIcon, name: "สรุปงบประมาณ.pdf", meta: "PDF · 2.4 MB" },
  { icon: ImageIcon, name: "ภาพหน้าปก.png", meta: "PNG · 840 KB" },
  { icon: MusicIcon, name: "เสียงประกอบ.mp3", meta: "MP3 · 5.1 MB" },
];

export function SectionData() {
  return (
    <Section
      id="data"
      title="แสดงข้อมูล"
      hint="table · chart · accordion · carousel · avatar · badge · item · kbd"
    >
      <Demo name="table" hint="ตารางข้อมูล" wide>
        <Table>
          <TableCaption>ใบแจ้งหนี้ล่าสุด 3 รายการ</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>เลขที่</TableHead>
              <TableHead>ลูกค้า</TableHead>
              <TableHead>สถานะ</TableHead>
              <TableHead className="text-right">จำนวนเงิน</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {INVOICES.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.id}</TableCell>
                <TableCell>{inv.customer}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      inv.status === "จ่ายแล้ว"
                        ? "default"
                        : inv.status === "รอชำระ"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {inv.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  ฿{inv.amount.toLocaleString("th-TH")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>รวมทั้งหมด</TableCell>
              <TableCell className="text-right">
                ฿
                {INVOICES.reduce((sum, i) => sum + i.amount, 0).toLocaleString(
                  "th-TH"
                )}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Demo>

      <Demo name="chart" hint="recharts + สีจาก token chart-1…5" wide>
        <ChartContainer config={CHART_CONFIG} className="h-64 w-full">
          <BarChart data={CHART_DATA}>
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

      <Demo name="accordion" hint="พับ / กางทีละหัวข้อ">
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="1">
            <AccordionTrigger>เปลี่ยนสีของแบรนด์ยังไง?</AccordionTrigger>
            <AccordionContent>
              แก้ค่าในไฟล์ packages/tokens/src/&lt;brand&gt;.css — ไม่ต้องแตะ component
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>เพิ่มแบรนด์ใหม่ต้องทำอะไร?</AccordionTrigger>
            <AccordionContent>
              ก็อปไฟล์ token 1 ไฟล์ เปลี่ยน selector เป็น [data-brand=&quot;ชื่อใหม่&quot;] แล้ว import
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="3">
            <AccordionTrigger>เพิ่ม component ใหม่ยังไง?</AccordionTrigger>
            <AccordionContent>
              รัน pnpm dlx shadcn@latest add &lt;name&gt; ในโฟลเดอร์ apps/web
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>

      <Demo name="carousel" hint="เลื่อนดูทีละการ์ด">
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

      <Demo name="avatar" hint="รูปโปรไฟล์ / กลุ่ม / จุดสถานะ">
        <div className="w-full space-y-4">
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback>สม</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>มน</AvatarFallback>
            </Avatar>
            <Avatar size="lg">
              <AvatarFallback>ปต</AvatarFallback>
              <AvatarBadge>
                <CheckIcon />
              </AvatarBadge>
            </Avatar>
          </div>
          <AvatarGroup>
            {["สม", "มน", "ปต"].map((t) => (
              <Avatar key={t}>
                <AvatarFallback>{t}</AvatarFallback>
              </Avatar>
            ))}
            <AvatarGroupCount>+9</AvatarGroupCount>
          </AvatarGroup>
        </div>
      </Demo>

      <Demo name="badge" hint="ป้ายสถานะ 6 variant">
        <div className="flex w-full flex-wrap gap-2">
          <Badge>ค่าเริ่มต้น</Badge>
          <Badge variant="secondary">รอง</Badge>
          <Badge variant="destructive">อันตราย</Badge>
          <Badge variant="outline">เส้นขอบ</Badge>
          <Badge variant="ghost">โปร่ง</Badge>
          <Badge variant="link">ลิงก์</Badge>
        </div>
      </Demo>

      <Demo name="kbd" hint="แสดงปุ่มลัดบนคีย์บอร์ด">
        <div className="w-full space-y-3 text-sm">
          <p className="flex items-center gap-2">
            เปิดการค้นหา
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
            </KbdGroup>
          </p>
          <p className="flex items-center gap-2">
            บันทึก
            <KbdGroup>
              <Kbd>⌘</Kbd>
              <Kbd>S</Kbd>
            </KbdGroup>
          </p>
          <p className="flex items-center gap-2">
            ออกจากโหมดเต็มจอ
            <Kbd>Esc</Kbd>
          </p>
        </div>
      </Demo>

      <Demo name="item" hint="แถวรายการพร้อมไอคอนและปุ่ม" wide>
        <ItemGroup className="w-full rounded-md border border-border">
          {FILES.map((file, i) => (
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
                    ดาวน์โหลด
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
