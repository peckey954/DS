"use client";

import {
  CopyIcon,
  InfoIcon,
  LogOutIcon,
  ScissorsIcon,
  Trash2Icon,
  UserIcon,
} from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@repo/ui/components/ui/avatar";
import { Button } from "@repo/ui/components/ui/button";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@repo/ui/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@repo/ui/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@repo/ui/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/ui/components/ui/hover-card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@repo/ui/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@repo/ui/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/ui/components/ui/tooltip";

import { Demo, Section } from "./showcase";
import { useT } from "@/lib/i18n";

export function SectionOverlays() {
  const t = useT();
  return (
    <Section
      id="overlays"
      title={t("section.overlays")}
      hint="dialog · alert-dialog · sheet · drawer · popover · hover-card · tooltip · dropdown-menu · context-menu"
    >
      <Demo name="dialog" hint="กล่องโต้ตอบกลางจอ">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">แก้ไขโปรไฟล์</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>แก้ไขโปรไฟล์</DialogTitle>
              <DialogDescription>
                เปลี่ยนข้อมูลของคุณแล้วกดบันทึกเมื่อเสร็จ
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="dlg-name">ชื่อที่แสดง</Label>
              <Input id="dlg-name" defaultValue="สมชาย ใจดี" />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">ยกเลิก</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>บันทึก</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Demo>

      <Demo name="alert-dialog" hint="ยืนยันก่อนทำสิ่งที่ย้อนกลับไม่ได้">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2Icon />
              ลบบัญชี
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ยืนยันการลบบัญชี?</AlertDialogTitle>
              <AlertDialogDescription>
                การลบบัญชีจะลบข้อมูลทั้งหมดอย่างถาวรและไม่สามารถย้อนกลับได้
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction>ยืนยันลบ</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Demo>

      <Demo name="sheet" hint="แผงเลื่อนจากขอบจอ">
        <div className="flex flex-wrap gap-2">
          {(["right", "left", "top", "bottom"] as const).map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  {side}
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle>ตั้งค่าอย่างเร็ว</SheetTitle>
                  <SheetDescription>
                    แผงนี้เลื่อนออกมาจากด้าน {side}
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-2 px-4">
                  <Label htmlFor={`sheet-${side}`}>ชื่อโปรเจกต์</Label>
                  <Input id={`sheet-${side}`} defaultValue="Design System" />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>บันทึก</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </Demo>

      <Demo name="drawer" hint="ลิ้นชักเลื่อนขึ้นจากด้านล่าง">
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">เปิดลิ้นชัก</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>ยืนยันคำสั่งซื้อ</DrawerTitle>
                <DrawerDescription>
                  ตรวจสอบรายการอีกครั้งก่อนกดยืนยัน
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>ยืนยัน</Button>
                <DrawerClose asChild>
                  <Button variant="outline">ปิด</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </Demo>

      <Demo name="popover" hint="แผงลอยผูกกับปุ่ม">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">ตั้งค่าขนาด</Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <PopoverHeader>
              <PopoverTitle>ขนาดกล่อง</PopoverTitle>
              <PopoverDescription>
                กำหนดความกว้างและความสูงที่ต้องการ
              </PopoverDescription>
            </PopoverHeader>
            <div className="mt-3 grid grid-cols-3 items-center gap-3">
              <Label htmlFor="pop-w">กว้าง</Label>
              <Input id="pop-w" defaultValue="320" className="col-span-2" />
              <Label htmlFor="pop-h">สูง</Label>
              <Input id="pop-h" defaultValue="200" className="col-span-2" />
            </div>
          </PopoverContent>
        </Popover>
      </Demo>

      <Demo name="hover-card" hint="แสดงรายละเอียดเมื่อชี้เมาส์">
        <HoverCard>
          <HoverCardTrigger asChild>
            <Button variant="link">@design-system</Button>
          </HoverCardTrigger>
          <HoverCardContent className="w-72">
            <div className="flex gap-3">
              <Avatar>
                <AvatarFallback>DS</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-semibold">Design System</p>
                <p className="text-sm text-muted-foreground">
                  ระบบดีไซน์กลางหลายแบรนด์ สร้างบน shadcn + Tailwind v4
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Demo>

      <Demo name="tooltip" hint="คำอธิบายสั้นเมื่อชี้เมาส์">
        <TooltipProvider>
          <div className="flex flex-wrap gap-2">
            {(["top", "right", "bottom", "left"] as const).map((side) => (
              <Tooltip key={side}>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm">
                    {side}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side={side}>
                  <p>คำอธิบายด้าน {side}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label="ข้อมูล">
                  <InfoIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>ข้อมูลเพิ่มเติมเกี่ยวกับฟีเจอร์นี้</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </Demo>

      <Demo name="dropdown-menu" hint="เมนูจากปุ่ม">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">บัญชีของฉัน</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>บัญชีของฉัน</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                โปรไฟล์
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CopyIcon />
                คัดลอกลิงก์
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              แสดงแถบสถานะ
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOutIcon />
              ออกจากระบบ
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Demo>

      <Demo name="context-menu" hint="คลิกขวาบนพื้นที่ด้านล่าง" wide>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-28 w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
            คลิกขวาที่นี่
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuItem>
              <CopyIcon />
              คัดลอก
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <ScissorsIcon />
              ตัด
              <ContextMenuShortcut>⌘X</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>เพิ่มเติม</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>เปลี่ยนชื่อ</ContextMenuItem>
                <ContextMenuItem>ย้ายไปโฟลเดอร์…</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>
              แสดงไฟล์ที่ซ่อน
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      </Demo>
    </Section>
  );
}
