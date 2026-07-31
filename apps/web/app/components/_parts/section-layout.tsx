"use client";

import * as React from "react";
import {
  ChevronsUpDownIcon,
  HomeIcon,
  InboxIcon,
  SettingsIcon,
} from "lucide-react";

import { AspectRatio } from "@peckey954/ui/components/ui/aspect-ratio";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@peckey954/ui/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@peckey954/ui/components/ui/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@peckey954/ui/components/ui/resizable";
import { ScrollArea } from "@peckey954/ui/components/ui/scroll-area";
import { Separator } from "@peckey954/ui/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@peckey954/ui/components/ui/sidebar";
import { Badge } from "@peckey954/ui/components/ui/badge";
import { Button } from "@peckey954/ui/components/ui/button";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useT } from "@/lib/i18n";

const SIDEBAR_ICONS = [HomeIcon, InboxIcon, SettingsIcon];

const COPY = defineCopy({
  th: {
    cardHint: "โครงกล่องเนื้อหามาตรฐาน",
    cardTitle: "ยอดขายเดือนนี้",
    cardDesc: "เทียบกับเดือนก่อนหน้า",
    cardFooter: "อัปเดตล่าสุดเมื่อ 5 นาทีที่แล้ว",
    ratioHint: "ล็อกสัดส่วน 16 / 9",
    separatorHint: "เส้นคั่นแนวนอน / แนวตั้ง",
    top: "ส่วนบน",
    bottom: "ส่วนล่าง",
    langTh: "ไทย",
    langEn: "อังกฤษ",
    langJa: "ญี่ปุ่น",
    scrollHint: "พื้นที่เลื่อนพร้อมสกรอลบาร์",
    scrollItem: "รายการที่",
    scrollItemSuffix: "— เลื่อนดูได้",
    collapsibleHint: "ซ่อน / แสดงเนื้อหา",
    advanced: "ตัวเลือกขั้นสูง",
    toggleView: "สลับการแสดงผล",
    enableCache: "เปิดใช้งานแคช",
    keepLogs: "บันทึกประวัติการใช้งาน",
    resizableHint: "ลากเส้นกลางเพื่อปรับขนาด",
    left: "ซ้าย",
    right: "ขวา",
    sidebarHint: "แสดงแบบ collapsible=none ในกรอบตัวอย่าง",
    mainMenu: "เมนูหลัก",
    general: "ทั่วไป",
    navHome: "หน้าแรก",
    navInbox: "กล่องข้อความ",
    navSettings: "ตั้งค่า",
    contentArea: "พื้นที่เนื้อหา",
  },
  en: {
    cardHint: "Standard content container",
    cardTitle: "Sales this month",
    cardDesc: "Compared with last month",
    cardFooter: "Last updated 5 minutes ago",
    ratioHint: "Locked to a 16 / 9 ratio",
    separatorHint: "Horizontal / vertical divider",
    top: "Upper section",
    bottom: "Lower section",
    langTh: "Thai",
    langEn: "English",
    langJa: "Japanese",
    scrollHint: "Scrollable area with a scrollbar",
    scrollItem: "Item",
    scrollItemSuffix: "— scroll to see more",
    collapsibleHint: "Show / hide content",
    advanced: "Advanced options",
    toggleView: "Toggle visibility",
    enableCache: "Enable caching",
    keepLogs: "Keep usage logs",
    resizableHint: "Drag the middle handle to resize",
    left: "Left",
    right: "Right",
    sidebarHint: "Rendered with collapsible=none inside a demo frame",
    mainMenu: "Main menu",
    general: "General",
    navHome: "Home",
    navInbox: "Inbox",
    navSettings: "Settings",
    contentArea: "Content area",
  },
});

export function SectionLayout() {
  const t = useT();
  const c = useCopy(COPY);
  const [open, setOpen] = React.useState(false);

  const sidebarItems = [
    { label: c.navHome, icon: SIDEBAR_ICONS[0], active: true },
    { label: c.navInbox, icon: SIDEBAR_ICONS[1], active: false },
    { label: c.navSettings, icon: SIDEBAR_ICONS[2], active: false },
  ];

  return (
    <Section
      id="layout"
      title={t("section.layout")}
      hint="aspect-ratio · card · separator · scroll-area · resizable · collapsible · sidebar"
    >
      <Demo name="card" hint={c.cardHint}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{c.cardTitle}</CardTitle>
            <CardDescription>{c.cardDesc}</CardDescription>
            <CardAction>
              <Badge variant="secondary">+12%</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">฿1,284,900</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {c.cardFooter}
            </p>
          </CardFooter>
        </Card>
      </Demo>

      <Demo name="aspect-ratio" hint={c.ratioHint}>
        <div className="w-full">
          <AspectRatio
            ratio={16 / 9}
            className="flex items-center justify-center rounded-lg bg-muted"
          >
            <span className="text-sm text-muted-foreground">16 : 9</span>
          </AspectRatio>
        </div>
      </Demo>

      <Demo name="separator" hint={c.separatorHint}>
        <div className="w-full space-y-3">
          <p className="text-sm">{c.top}</p>
          <Separator />
          <p className="text-sm">{c.bottom}</p>
          <div className="flex h-6 items-center gap-3 text-sm">
            <span>{c.langTh}</span>
            <Separator orientation="vertical" />
            <span>{c.langEn}</span>
            <Separator orientation="vertical" />
            <span>{c.langJa}</span>
          </div>
        </div>
      </Demo>

      <Demo name="scroll-area" hint={c.scrollHint}>
        <ScrollArea className="h-40 w-full rounded-md border border-border p-3">
          <div className="space-y-2">
            {Array.from({ length: 14 }, (_, i) => (
              <p key={i} className="text-sm">
                {c.scrollItem} {i + 1} {c.scrollItemSuffix}
              </p>
            ))}
          </div>
        </ScrollArea>
      </Demo>

      <Demo name="collapsible" hint={c.collapsibleHint}>
        <Collapsible open={open} onOpenChange={setOpen} className="w-full">
          <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
            <span className="text-sm font-medium">{c.advanced}</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <ChevronsUpDownIcon />
                <span className="sr-only">{c.toggleView}</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              {c.enableCache}
            </div>
            <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              {c.keepLogs}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Demo>

      <Demo name="resizable" hint={c.resizableHint}>
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-40 w-full rounded-md border border-border"
        >
          <ResizablePanel defaultSize="40">
            <div className="flex h-full items-center justify-center p-3 text-sm text-muted-foreground">
              {c.left}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="60">
            <div className="flex h-full items-center justify-center p-3 text-sm text-muted-foreground">
              {c.right}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Demo>

      <Demo
        name="sidebar"
        hint={c.sidebarHint}
        wide
        bodyClassName="p-4"
      >
        <SidebarProvider
          className="min-h-0 w-full overflow-hidden rounded-md border border-border"
          style={{ "--sidebar-width": "13rem" } as React.CSSProperties}
        >
          <Sidebar collapsible="none" className="h-56 border-r border-border">
            <SidebarHeader className="px-3 py-2 text-sm font-semibold">
              {c.mainMenu}
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>{c.general}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sidebarItems.map((item) => (
                      <SidebarMenuItem key={item.label}>
                        <SidebarMenuButton isActive={item.active}>
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-56 flex-1 items-center justify-center bg-background p-4 text-sm text-muted-foreground">
            {c.contentArea}
          </main>
        </SidebarProvider>
      </Demo>
    </Section>
  );
}
