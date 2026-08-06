"use client";

import {
  CheckIcon,
  FileTextIcon,
  ImageIcon,
  MusicIcon,
  TagIcon,
  XIcon,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@peckey954/ui/components/ui/accordion";
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@peckey954/ui/components/ui/avatar";
import { Badge, BadgeButton } from "@peckey954/ui/components/ui/badge";
import { Button } from "@peckey954/ui/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@peckey954/ui/components/ui/carousel";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@peckey954/ui/components/ui/item";
import { Kbd, KbdGroup } from "@peckey954/ui/components/ui/kbd";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@peckey954/ui/components/ui/table";

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
    accordionHint: "พับ / กางทีละหัวข้อ",
    q1: "เปลี่ยนสีของแบรนด์ยังไง?",
    a1: "แก้ค่าในไฟล์ packages/tokens/src/<brand>.css — ไม่ต้องแตะ component",
    q2: "เพิ่มแบรนด์ใหม่ต้องทำอะไร?",
    a2: "ก็อปไฟล์ token 1 ไฟล์ เปลี่ยน selector เป็นชื่อแบรนด์ใหม่ แล้ว import",
    q3: "เพิ่ม component ใหม่ยังไง?",
    a3: "รัน pnpm dlx shadcn@latest add <name> ในโฟลเดอร์ apps/web",
    carouselHint: "เลื่อนดูทีละการ์ด",
    avatarHint: "รูปโปรไฟล์ / กลุ่ม / จุดสถานะ",
    badgeHint: "12 สี x 3 แบบ",
    badgeChipHint: "ปุ่มปิด · ไอคอนหน้า-หลัง",
    toneInfo: "ข้อมูล",
    toneTeal: "เขียวน้ำทะเล",
    toneSky: "ฟ้า",
    toneIndigo: "คราม",
    tonePurple: "ม่วง",
    tonePink: "ชมพู",
    toneOrange: "ส้ม",
    chipRemove: "เอาออก",
    chipLot: "Lot A-9M",
    chipOwner: "ฝ่ายจัดซื้อ",
    chipDecorativeNote:
      "เจ็ดสีท้ายเป็นสีติดป้ายหมวดหมู่ ไม่ได้แปลว่าสถานะ — อย่าเอาไปใช้แทน สำเร็จ/เตือน/อันตราย",
    badgeSolid: "เข้ม",
    badgeSoft: "อ่อน",
    badgeOutline: "เส้นขอบ",
    toneBrand: "แบรนด์",
    toneSuccess: "สำเร็จ",
    toneWarning: "เตือน",
    toneDanger: "อันตราย",
    toneNeutral: "กลาง",
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
    accordionHint: "Expand one section at a time",
    q1: "How do I change the brand colours?",
    a1: "Edit packages/tokens/src/<brand>.css — no component changes needed",
    q2: "What does adding a new brand involve?",
    a2: "Copy one token file, change the selector to the new brand, then import it",
    q3: "How do I add a new component?",
    a3: "Run pnpm dlx shadcn@latest add <name> inside apps/web",
    carouselHint: "Swipe through cards one at a time",
    avatarHint: "Avatar / group / status dot",
    badgeHint: "12 tones x 3 appearances",
    badgeChipHint: "Close button · leading and trailing icons",
    toneInfo: "Info",
    toneTeal: "Teal",
    toneSky: "Sky",
    toneIndigo: "Indigo",
    tonePurple: "Purple",
    tonePink: "Pink",
    toneOrange: "Orange",
    chipRemove: "Remove",
    chipLot: "Lot A-9M",
    chipOwner: "Procurement",
    chipDecorativeNote:
      "The last seven are decorative category colours, not statuses — never use them in place of success/warning/danger.",
    badgeSolid: "Solid",
    badgeSoft: "Soft",
    badgeOutline: "Outline",
    toneBrand: "Brand",
    toneSuccess: "Success",
    toneWarning: "Warning",
    toneDanger: "Danger",
    toneNeutral: "Neutral",
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

const FILE_ICONS = [FileTextIcon, ImageIcon, MusicIcon];

export function SectionData() {
  const t = useT();
  const c = useCopy(COPY);
  const locale = useLocale();
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
      hint="table · accordion · carousel · avatar · badge · item · kbd"
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
                    tone={
                      inv.status === c.paid
                        ? "success"
                        : inv.status === c.pending
                          ? "neutral"
                          : "danger"
                    }
                    appearance={inv.status === c.pending ? "soft" : "solid"}
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

      <Demo name="badge" hint={c.badgeHint} wide>
        <div className="w-full space-y-2">
          {(
            [
              ["solid", c.badgeSolid],
              ["soft", c.badgeSoft],
              ["outline", c.badgeOutline],
            ] as const
          ).map(([appearance, label]) => (
            <div key={appearance} className="flex flex-wrap items-center gap-2">
              <span className="w-14 shrink-0 text-xs text-muted-foreground">
                {label}
              </span>
              {(
                [
                  ["brand", c.toneBrand],
                  ["success", c.toneSuccess],
                  ["warning", c.toneWarning],
                  ["danger", c.toneDanger],
                  ["neutral", c.toneNeutral],
                  ["info", c.toneInfo],
                  ["teal", c.toneTeal],
                  ["sky", c.toneSky],
                  ["indigo", c.toneIndigo],
                  ["purple", c.tonePurple],
                  ["pink", c.tonePink],
                  ["orange", c.toneOrange],
                ] as const
              ).map(([tone, toneLabel]) => (
                <Badge key={tone} tone={tone} appearance={appearance}>
                  {toneLabel}
                </Badge>
              ))}
            </div>
          ))}
        </div>
      </Demo>

      <Demo name="badge — chip" hint={c.badgeChipHint} wide>
        <div className="w-full space-y-3">
          {/* ปุ่มปิด — chip ที่ลบออกได้ */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ["brand", "solid"],
                ["success", "soft"],
                ["info", "soft"],
                ["purple", "outline"],
                ["neutral", "soft"],
              ] as const
            ).map(([tone, appearance]) => (
              <Badge key={tone} tone={tone} appearance={appearance}>
                {c.chipLot}
                <BadgeButton aria-label={c.chipRemove}>
                  <XIcon />
                </BadgeButton>
              </Badge>
            ))}
          </div>

          {/* ไอคอนหน้า + ข้อความ + ไอคอนหลัง + ปุ่มปิด
              Badge จัดขนาดไอคอน (size-3) และระยะห่าง (gap-1) ให้เอง
              ไม่ต้องกำหนดขนาดไอคอนเอง */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ["teal", "soft"],
                ["orange", "solid"],
                ["pink", "soft"],
                ["indigo", "outline"],
              ] as const
            ).map(([tone, appearance]) => (
              <Badge key={tone} tone={tone} appearance={appearance}>
                <TagIcon />
                {c.chipOwner}
                <CheckIcon />
                <BadgeButton aria-label={c.chipRemove}>
                  <XIcon />
                </BadgeButton>
              </Badge>
            ))}
          </div>

          <p className="text-sm text-muted-foreground">
            {c.chipDecorativeNote}
          </p>
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
