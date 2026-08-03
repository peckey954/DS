"use client";

import * as React from "react";
import {
  ArrowLeftIcon,
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
  SheetClose,
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
  {
    id: "n6",
    tone: "warning",
    icon: TriangleAlertIcon,
    title: "ใกล้ถึงกำหนดส่งมอบ",
    description: "PO260115/07 กำหนดรับ 18 ม.ค. เหลืออีก 2 วัน ยังไม่มีการนัดหมายรถ",
    time: "2 วันที่แล้ว",
    action: "นัดหมายรถ",
    unread: false,
  },
  {
    id: "n7",
    tone: "success",
    icon: CircleCheckIcon,
    title: "ปิดงานผลิตเรียบร้อย",
    description: "ไลน์ผสม 2 ปิดล็อต PD260510/11 จำนวน 1,200 กส ครบตามแผน",
    time: "2 วันที่แล้ว",
    action: "ดูสรุปล็อต",
    unread: false,
  },
  {
    id: "n8",
    tone: "danger",
    icon: CircleXIcon,
    title: "วัตถุดิบไม่ผ่าน QC",
    description: "20-8-8 ล็อต RM260114/03 ความชื้นเกินเกณฑ์ 2.1% รอตัดสินใจคืนของ",
    time: "3 วันที่แล้ว",
    action: "เปิดใบตรวจ",
    unread: false,
  },
  {
    id: "n9",
    tone: "success",
    icon: PackageIcon,
    title: "โอนย้ายสต็อกสำเร็จ",
    description: "ย้าย 15-15-15 จำนวน 300 กส จากโซน B02 ไป A07 เรียบร้อย",
    time: "สัปดาห์ที่แล้ว",
    action: "ดูใบโอน",
    unread: false,
  },
  {
    id: "n10",
    tone: "brand",
    icon: ClipboardCheckIcon,
    title: "ครบกำหนดตรวจนับสต็อก",
    description: "รอบตรวจนับประจำเดือนของคลัง A ครบกำหนดแล้ว ยังไม่เริ่มนับ",
    time: "สัปดาห์ที่แล้ว",
    action: "เริ่มตรวจนับ",
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
  leading,
  listClassName,
}: {
  items: Notification[];
  onRead: (id: string) => void;
  onReadAll: () => void;
  /** ปุ่มย้อนกลับ ใส่เฉพาะตอนเปิดเต็มจอบนมือถือ */
  leading?: React.ReactNode;
  /** ความสูงของพื้นที่รายการ ต้องเป็นค่าที่แน่นอนถึงจะเลื่อนได้ ดูหมายเหตุด้านล่าง */
  listClassName?: string;
}) {
  const unreadCount = items.filter((n) => n.unread).length;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3 px-4 py-4">
        <div className="flex min-w-0 items-center gap-2">
          {leading}
          <h2 className="text-base font-semibold tracking-tight">การแจ้งเตือน</h2>
          {unreadCount > 0 ? (
            <span className="shrink-0 text-xs text-muted-foreground">
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

      {/* ScrollArea ของ shadcn ใช้ size-full กับ viewport ข้างใน ความสูงเป็นเปอร์เซ็นต์
          จึงต้องมีความสูงที่แน่นอนจากพ่อแม่ถึงจะคำนวณได้ max-height ไม่นับ
          เพราะกล่องยังสูงตามเนื้อหาอยู่แล้วแค่ถูกตัดทิ้ง ไม่ได้เลื่อน
          มือถือได้ความสูงจาก h-svh ส่วนเดสก์ท็อปต้องกำหนดเองผ่าน listClassName */
      }
      {/* ต้อง "แทนที่" คลาส ไม่ใช่ต่อท้าย เพราะ flex-1 ตั้ง flex-basis: 0
          ซึ่งลบล้างความสูงที่กำหนดไว้บนแกนหลักทิ้งหมด */}
      <ScrollArea className={listClassName ?? "min-h-0 flex-1"}>
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

  const body = (opts?: { leading?: React.ReactNode; listClassName?: string }) => (
    <NotificationBody
      items={items}
      onRead={markRead}
      onReadAll={readAll}
      leading={opts?.leading}
      listClassName={opts?.listClassName}
    />
  );

  /* รายการเยอะ = ตรึงความสูงไว้เพื่อให้เลื่อนได้
     รายการน้อย = ปล่อยให้สูงตามเนื้อหา จะได้ไม่มีที่ว่างค้างท้ายแผง */
  const desktopList = items.length > 4 ? "h-[26rem]" : "max-h-[26rem]";

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
          <div className="flex flex-col">{body({ listClassName: desktopList })}</div>
        </PopoverContent>
      </Popover>

      {/* จอเล็ก — เต็มจอเหมือนเปิดอีกหน้าหนึ่ง
          ปิดปุ่ม X มุมขวาบนของ Sheet แล้วใช้ปุ่มย้อนกลับด้านซ้ายแทน
          เพราะเต็มจอแล้วผู้ใช้คาดหวังลูกศรย้อนกลับ ไม่ใช่กากบาทปิดกล่อง */}
      <Sheet>
        <SheetTrigger asChild>{trigger("md:hidden")}</SheetTrigger>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="inset-0 h-svh w-full gap-0 border-0 p-0"
        >
          <SheetTitle className="sr-only">การแจ้งเตือน</SheetTitle>
          {body({
            leading: (
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="ย้อนกลับ"
                  className="-ml-1"
                >
                  <ArrowLeftIcon />
                </Button>
              </SheetClose>
            ),
          })}
        </SheetContent>
      </Sheet>
    </>
  );
}
