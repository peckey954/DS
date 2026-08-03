"use client";

import * as React from "react";
import {
  BellIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClipboardCheckIcon,
  PackageIcon,
  TriangleAlertIcon,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@peckey954/ui/components/ui/button";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@peckey954/ui/components/ui/item";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@peckey954/ui/components/ui/popover";
import { ScrollArea } from "@peckey954/ui/components/ui/scroll-area";
import { Separator } from "@peckey954/ui/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@peckey954/ui/components/ui/sheet";
import { cn } from "@peckey954/ui/lib/utils";

/* ============================================================
   แผงการแจ้งเตือน

   ใช้ component จาก DS ล้วน ไม่ได้วาดกล่องเอง
     Popover  → จอใหญ่   ห้อยจากปุ่มระฆัง
     Sheet    → จอเล็ก   เลื่อนขึ้นจากด้านล่าง
   เนื้อหาข้างในเป็นตัวเดียวกันทั้งสองแบบ แก้ที่เดียวเปลี่ยนทั้งคู่
   ============================================================ */

type Tone = "success" | "warning" | "danger" | "brand";

type Notification = {
  id: string;
  tone: Tone;
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  action: string;
  unread: boolean;
};

/* สีของไอคอนนำหน้าแต่ละประเภท ใช้ชุด token เดียวกับ Alert และ Badge
   จึงสื่อความหมายตรงกันทั้งระบบ — เขียวสำเร็จ เหลืองเตือน แดงมีปัญหา ส้มคือแบรนด์ */
const TONE_STYLE: Record<Tone, string> = {
  success: "bg-success text-success-foreground border-success-border",
  warning: "bg-warning text-warning-foreground border-warning-border",
  danger: "bg-danger text-danger-foreground border-danger-border",
  brand: "bg-brand text-primary border-primary/30",
};

const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    tone: "success",
    icon: CircleCheckIcon,
    title: "ใบสั่งซื้อได้รับการอนุมัติ",
    description:
      "PO260116/03 · 15-15-15 + 1Mg ได้รับการอนุมัติแล้ว พร้อมดำเนินการสั่งซื้อ",
    time: "5 นาทีที่แล้ว",
    action: "เปิด PO",
    unread: true,
  },
  {
    id: "n2",
    tone: "warning",
    icon: TriangleAlertIcon,
    title: "สต็อกต่ำ — ควรสั่งซื้อเพิ่ม",
    description:
      "พบ 3 รายการต่ำกว่าจุดสั่งซื้อ: 20-8-8 (เหลือ 20 กส), 21-7-18 (38 กส), 15-10-30 (60 กส)",
    time: "1 ชม. ที่แล้ว",
    action: "ดูสต็อก",
    unread: true,
  },
  {
    id: "n3",
    tone: "danger",
    icon: CircleXIcon,
    title: "เอกสารถูกส่งกลับแก้ไข",
    description:
      "PR260116/02 ไม่ได้รับการอนุมัติ — เหตุผล: ราคาเกินงบประมาณ กรุณาตรวจสอบและส่งใหม่",
    time: "3 ชม. ที่แล้ว",
    action: "เปิดแก้ไข",
    unread: false,
  },
  {
    id: "n4",
    tone: "success",
    icon: PackageIcon,
    title: "รับวัตถุดิบเข้าคลังแล้ว",
    description:
      "PO260116/01 รับเข้า 600 กส เข้าโซน A13 เรียบร้อย เบิกใช้งานได้ทันที",
    time: "เมื่อวานนี้",
    action: "ดูใบรับเข้า",
    unread: false,
  },
  {
    id: "n5",
    tone: "brand",
    icon: ClipboardCheckIcon,
    title: "แจ้งเตือน QC — ผลต่างเกินเกณฑ์",
    description:
      "ล็อต PD260512/04 ผลิตได้ 600 แต่รับเข้าจริง 580 (ผลต่าง 3.3%) รอตรวจสอบสาเหตุ",
    time: "เมื่อวานนี้",
    action: "ตรวจสอบ",
    unread: false,
  },
];

/** แถวการแจ้งเตือนหนึ่งรายการ */
function NotificationRow({
  item,
  onRead,
}: {
  item: Notification;
  onRead: (id: string) => void;
}) {
  const Icon = item.icon;
  return (
    <Item
      className={cn(
        "items-start gap-3 rounded-none px-4 py-3 transition-colors",
        // ยังไม่อ่าน = พื้นเทาอ่อน อ่านแล้ว = พื้นใส
        // ใช้ bg-muted ไม่ใช่ bg-brand เพราะสีแบรนด์ถูกใช้สื่อ "ถูกเลือก" ไปแล้ว
        item.unread ? "bg-muted/50" : "bg-transparent"
      )}
    >
      <ItemMedia variant="icon" className={cn("mt-0.5", TONE_STYLE[item.tone])}>
        <Icon />
      </ItemMedia>

      <ItemContent className="gap-1">
        <div className="flex items-start justify-between gap-3">
          <ItemTitle
            className={cn(
              "leading-snug",
              item.unread ? "font-semibold" : "font-medium"
            )}
          >
            {item.title}
          </ItemTitle>
          <span className="shrink-0 text-xs whitespace-nowrap text-muted-foreground">
            {item.time}
          </span>
        </div>

        <ItemDescription className="line-clamp-none">
          {item.description}
        </ItemDescription>

        <div className="mt-2 flex items-center justify-between gap-3">
          {/* กดปุ่มหลัก = ถือว่าอ่านแล้ว */}
          <Button size="sm" onClick={() => onRead(item.id)}>
            {item.action}
          </Button>

          {/* ป้ายบอกสถานะ ยังไม่อ่านจะเป็นสีและกดเพื่อทำเป็นอ่านแล้วได้
              อ่านแล้วเป็นตัวหนังสือเทาเฉย ๆ กดไม่ได้ เพราะไม่มีอะไรให้ทำต่อ */}
          {item.unread ? (
            <button
              type="button"
              onClick={() => onRead(item.id)}
              className="text-xs font-medium text-primary underline-offset-4 hover:underline"
            >
              ยังไม่อ่าน
            </button>
          ) : (
            <span className="text-xs text-muted-foreground">อ่านแล้ว</span>
          )}
        </div>
      </ItemContent>
    </Item>
  );
}

/** เนื้อหาของแผง ใช้ร่วมกันทั้งจอใหญ่และจอเล็ก */
function NotificationBody({
  items,
  onRead,
  onReadAll,
  headerClassName,
}: {
  items: Notification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  /** เผื่อที่ให้ปุ่มปิดของ Sheet ที่ลอยอยู่มุมขวาบน */
  headerClassName?: string;
}) {
  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <div className="flex h-full flex-col">
      <div
        className={cn(
          "flex items-center justify-between gap-3 px-4 py-4",
          headerClassName
        )}
      >
        <div className="flex items-baseline gap-2">
          <h2 className="text-base font-semibold tracking-tight">การแจ้งเตือน</h2>
          {unreadCount > 0 ? (
            <span className="text-xs text-muted-foreground">
              ยังไม่อ่าน {unreadCount} รายการ
            </span>
          ) : null}
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={onReadAll}
          disabled={unreadCount === 0}
          className="h-auto p-0"
        >
          อ่านทั้งหมด
        </Button>
      </div>

      <Separator />

      <ScrollArea className="min-h-0 flex-1">
        <ItemGroup>
          {items.map((item, i) => (
            <React.Fragment key={item.id}>
              {i > 0 ? <Separator /> : null}
              <NotificationRow item={item} onRead={onRead} />
            </React.Fragment>
          ))}
        </ItemGroup>
      </ScrollArea>
    </div>
  );
}

/**
 * ปุ่มระฆัง + แผงการแจ้งเตือน
 *
 * เรนเดอร์ทั้งสองแบบไว้แล้วซ่อนด้วย CSS แทนการเช็คขนาดจอด้วย JavaScript
 * เพราะการเช็คด้วย JS จะทำให้ฝั่งเซิร์ฟเวอร์กับฝั่งเบราว์เซอร์เรนเดอร์ไม่ตรงกัน
 */
export function NotificationBell() {
  const [items, setItems] = React.useState(NOTIFICATIONS);

  const unreadCount = items.filter((n) => n.unread).length;
  const markRead = (id: string) =>
    setItems((list) =>
      list.map((n) => (n.id === id ? { ...n, unread: false } : n))
    );
  const readAll = () =>
    setItems((list) => list.map((n) => ({ ...n, unread: false })));

  const body = (headerClassName?: string) => (
    <NotificationBody
      items={items}
      onRead={markRead}
      onReadAll={readAll}
      headerClassName={headerClassName}
    />
  );

  const trigger = (extraClass: string) => (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label={
        unreadCount > 0
          ? `การแจ้งเตือน ${unreadCount} รายการที่ยังไม่อ่าน`
          : "การแจ้งเตือน"
      }
      className={cn("relative", extraClass)}
    >
      <BellIcon />
      {unreadCount > 0 ? (
        <span className="absolute top-1 right-1 size-2 rounded-full bg-primary ring-2 ring-card" />
      ) : null}
    </Button>
  );

  return (
    <>
      {/* จอใหญ่ — ห้อยจากปุ่ม */}
      <Popover>
        <PopoverTrigger asChild>{trigger("hidden md:inline-flex")}</PopoverTrigger>
        <PopoverContent
          align="end"
          className="w-[26rem] overflow-hidden p-0"
        >
          <div className="max-h-[32rem]">{body()}</div>
        </PopoverContent>
      </Popover>

      {/* จอเล็ก — เลื่อนขึ้นจากด้านล่าง กดง่ายด้วยนิ้วโป้ง */}
      <Sheet>
        <SheetTrigger asChild>{trigger("md:hidden")}</SheetTrigger>
        <SheetContent side="bottom" className="h-[85svh] p-0">
          <SheetTitle className="sr-only">การแจ้งเตือน</SheetTitle>
          {body("pr-12")}
        </SheetContent>
      </Sheet>
    </>
  );
}
