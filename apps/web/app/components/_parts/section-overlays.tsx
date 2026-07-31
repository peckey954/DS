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
} from "@peckey954/ui/components/ui/alert-dialog";
import { Avatar, AvatarFallback } from "@peckey954/ui/components/ui/avatar";
import { Button } from "@peckey954/ui/components/ui/button";
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
} from "@peckey954/ui/components/ui/context-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@peckey954/ui/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@peckey954/ui/components/ui/drawer";
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
} from "@peckey954/ui/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@peckey954/ui/components/ui/hover-card";
import { Input } from "@peckey954/ui/components/ui/input";
import { Label } from "@peckey954/ui/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@peckey954/ui/components/ui/popover";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@peckey954/ui/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@peckey954/ui/components/ui/tooltip";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    dialogHint: "กล่องโต้ตอบกลางจอ",
    editProfile: "แก้ไขโปรไฟล์",
    editProfileDesc: "เปลี่ยนข้อมูลของคุณแล้วกดบันทึกเมื่อเสร็จ",
    displayName: "ชื่อที่แสดง",
    sampleName: "สมชาย ใจดี",
    cancel: "ยกเลิก",
    save: "บันทึก",
    alertHint: "ยืนยันก่อนทำสิ่งที่ย้อนกลับไม่ได้",
    deleteAccount: "ลบบัญชี",
    confirmDelete: "ยืนยันการลบบัญชี?",
    confirmDeleteDesc: "การลบบัญชีจะลบข้อมูลทั้งหมดอย่างถาวรและไม่สามารถย้อนกลับได้",
    confirm: "ยืนยันลบ",
    sheetHint: "แผงเลื่อนจากขอบจอ",
    quickSettings: "ตั้งค่าอย่างเร็ว",
    sheetDescPrefix: "แผงนี้เลื่อนออกมาจากด้าน",
    projectName: "ชื่อโปรเจกต์",
    drawerHint: "ลิ้นชักเลื่อนขึ้นจากด้านล่าง",
    openDrawer: "เปิดลิ้นชัก",
    confirmOrder: "ยืนยันคำสั่งซื้อ",
    confirmOrderDesc: "ตรวจสอบรายการอีกครั้งก่อนกดยืนยัน",
    submit: "ยืนยัน",
    close: "ปิด",
    popoverHint: "แผงลอยผูกกับปุ่ม",
    setSize: "ตั้งค่าขนาด",
    boxSize: "ขนาดกล่อง",
    boxSizeDesc: "กำหนดความกว้างและความสูงที่ต้องการ",
    width: "กว้าง",
    height: "สูง",
    hoverHint: "แสดงรายละเอียดเมื่อชี้เมาส์",
    hoverBody: "ระบบดีไซน์กลางหลายแบรนด์ สร้างบน shadcn + Tailwind v4",
    tooltipHint: "คำอธิบายสั้นเมื่อชี้เมาส์",
    tooltipSidePrefix: "คำอธิบายด้าน",
    info: "ข้อมูล",
    tooltipMore: "ข้อมูลเพิ่มเติมเกี่ยวกับฟีเจอร์นี้",
    dropdownHint: "เมนูจากปุ่ม",
    myAccount: "บัญชีของฉัน",
    profile: "โปรไฟล์",
    copyLink: "คัดลอกลิงก์",
    showStatusBar: "แสดงแถบสถานะ",
    signOut: "ออกจากระบบ",
    contextHint: "คลิกขวาบนพื้นที่ด้านล่าง",
    rightClickHere: "คลิกขวาที่นี่",
    copy: "คัดลอก",
    cut: "ตัด",
    more: "เพิ่มเติม",
    rename: "เปลี่ยนชื่อ",
    moveTo: "ย้ายไปโฟลเดอร์…",
    showHidden: "แสดงไฟล์ที่ซ่อน",
  },
  en: {
    dialogHint: "Centred modal dialog",
    editProfile: "Edit profile",
    editProfileDesc: "Change your details, then save when you are done",
    displayName: "Display name",
    sampleName: "Somchai Jaidee",
    cancel: "Cancel",
    save: "Save",
    alertHint: "Confirm before an irreversible action",
    deleteAccount: "Delete account",
    confirmDelete: "Delete this account?",
    confirmDeleteDesc: "Deleting the account removes all data permanently and cannot be undone.",
    confirm: "Yes, delete",
    sheetHint: "Panel that slides in from an edge",
    quickSettings: "Quick settings",
    sheetDescPrefix: "This panel slides in from the",
    projectName: "Project name",
    drawerHint: "Drawer that slides up from the bottom",
    openDrawer: "Open drawer",
    confirmOrder: "Confirm order",
    confirmOrderDesc: "Check the items once more before confirming",
    submit: "Confirm",
    close: "Close",
    popoverHint: "Floating panel anchored to a button",
    setSize: "Set size",
    boxSize: "Box size",
    boxSizeDesc: "Set the width and height you want",
    width: "Width",
    height: "Height",
    hoverHint: "Show details on hover",
    hoverBody: "A shared multi-brand design system built on shadcn + Tailwind v4",
    tooltipHint: "Short hint on hover",
    tooltipSidePrefix: "Tooltip on the",
    info: "Information",
    tooltipMore: "More information about this feature",
    dropdownHint: "Menu opened from a button",
    myAccount: "My account",
    profile: "Profile",
    copyLink: "Copy link",
    showStatusBar: "Show status bar",
    signOut: "Sign out",
    contextHint: "Right-click the area below",
    rightClickHere: "Right-click here",
    copy: "Copy",
    cut: "Cut",
    more: "More",
    rename: "Rename",
    moveTo: "Move to folder…",
    showHidden: "Show hidden files",
  },
});

export function SectionOverlays() {
  const t = useT();
  const c = useCopy(COPY);
  return (
    <Section
      id="overlays"
      title={t("section.overlays")}
      hint="dialog · alert-dialog · sheet · drawer · popover · hover-card · tooltip · dropdown-menu · context-menu"
    >
      <Demo name="dialog" hint={c.dialogHint}>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">{c.editProfile}</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{c.editProfile}</DialogTitle>
              <DialogDescription>
                {c.editProfileDesc}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="dlg-name">{c.displayName}</Label>
              <Input id="dlg-name" defaultValue={c.sampleName} />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">{c.cancel}</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>{c.save}</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Demo>

      <Demo name="alert-dialog" hint={c.alertHint}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash2Icon />
              {c.deleteAccount}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{c.confirmDelete}</AlertDialogTitle>
              <AlertDialogDescription>
                {c.confirmDeleteDesc}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{c.cancel}</AlertDialogCancel>
              <AlertDialogAction>{c.confirm}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Demo>

      <Demo name="sheet" hint={c.sheetHint}>
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
                  <SheetTitle>{c.quickSettings}</SheetTitle>
                  <SheetDescription>
                    {c.sheetDescPrefix} {side}
                  </SheetDescription>
                </SheetHeader>
                <div className="space-y-2 px-4">
                  <Label htmlFor={`sheet-${side}`}>{c.projectName}</Label>
                  <Input id={`sheet-${side}`} defaultValue="Design System" />
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button>{c.save}</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </Demo>

      <Demo name="drawer" hint={c.drawerHint}>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline">{c.openDrawer}</Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
              <DrawerHeader>
                <DrawerTitle>{c.confirmOrder}</DrawerTitle>
                <DrawerDescription>
                  {c.confirmOrderDesc}
                </DrawerDescription>
              </DrawerHeader>
              <DrawerFooter>
                <Button>{c.submit}</Button>
                <DrawerClose asChild>
                  <Button variant="outline">{c.close}</Button>
                </DrawerClose>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </Demo>

      <Demo name="popover" hint={c.popoverHint}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">{c.setSize}</Button>
          </PopoverTrigger>
          <PopoverContent className="w-72">
            <PopoverHeader>
              <PopoverTitle>{c.boxSize}</PopoverTitle>
              <PopoverDescription>
                {c.boxSizeDesc}
              </PopoverDescription>
            </PopoverHeader>
            <div className="mt-3 grid grid-cols-3 items-center gap-3">
              <Label htmlFor="pop-w">{c.width}</Label>
              <Input id="pop-w" defaultValue="320" className="col-span-2" />
              <Label htmlFor="pop-h">{c.height}</Label>
              <Input id="pop-h" defaultValue="200" className="col-span-2" />
            </div>
          </PopoverContent>
        </Popover>
      </Demo>

      <Demo name="hover-card" hint={c.hoverHint}>
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
                  {c.hoverBody}
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Demo>

      <Demo name="tooltip" hint={c.tooltipHint}>
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
                  <p>{c.tooltipSidePrefix} {side}</p>
                </TooltipContent>
              </Tooltip>
            ))}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon-sm" aria-label={c.info}>
                  <InfoIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{c.tooltipMore}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </Demo>

      <Demo name="dropdown-menu" hint={c.dropdownHint}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{c.myAccount}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>{c.myAccount}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon />
                {c.profile}
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CopyIcon />
                {c.copyLink}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>
              {c.showStatusBar}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOutIcon />
              {c.signOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Demo>

      <Demo name="context-menu" hint={c.contextHint} wide>
        <ContextMenu>
          <ContextMenuTrigger className="flex h-28 w-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
            {c.rightClickHere}
          </ContextMenuTrigger>
          <ContextMenuContent className="w-56">
            <ContextMenuItem>
              <CopyIcon />
              {c.copy}
              <ContextMenuShortcut>⌘C</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem>
              <ScissorsIcon />
              {c.cut}
              <ContextMenuShortcut>⌘X</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuSub>
              <ContextMenuSubTrigger>{c.more}</ContextMenuSubTrigger>
              <ContextMenuSubContent>
                <ContextMenuItem>{c.rename}</ContextMenuItem>
                <ContextMenuItem>{c.moveTo}</ContextMenuItem>
              </ContextMenuSubContent>
            </ContextMenuSub>
            <ContextMenuSeparator />
            <ContextMenuCheckboxItem checked>
              {c.showHidden}
            </ContextMenuCheckboxItem>
          </ContextMenuContent>
        </ContextMenu>
      </Demo>
    </Section>
  );
}
