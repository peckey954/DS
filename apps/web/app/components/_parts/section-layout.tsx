"use client";

import * as React from "react";
import {
  ChevronsUpDownIcon,
  HomeIcon,
  InboxIcon,
  SettingsIcon,
} from "lucide-react";

import { AspectRatio } from "@repo/ui/components/ui/aspect-ratio";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/ui/collapsible";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@repo/ui/components/ui/resizable";
import { ScrollArea } from "@repo/ui/components/ui/scroll-area";
import { Separator } from "@repo/ui/components/ui/separator";
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
} from "@repo/ui/components/ui/sidebar";
import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";

import { Demo, Section } from "./showcase";

const SIDEBAR_ITEMS = [
  { label: "หน้าแรก", icon: HomeIcon, active: true },
  { label: "กล่องข้อความ", icon: InboxIcon, active: false },
  { label: "ตั้งค่า", icon: SettingsIcon, active: false },
];

export function SectionLayout() {
  const [open, setOpen] = React.useState(false);

  return (
    <Section
      id="layout"
      title="โครงสร้าง & เลย์เอาต์"
      hint="aspect-ratio · card · separator · scroll-area · resizable · collapsible · sidebar"
    >
      <Demo name="card" hint="โครงกล่องเนื้อหามาตรฐาน">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>ยอดขายเดือนนี้</CardTitle>
            <CardDescription>เทียบกับเดือนก่อนหน้า</CardDescription>
            <CardAction>
              <Badge variant="secondary">+12%</Badge>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">฿1,284,900</p>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              อัปเดตล่าสุดเมื่อ 5 นาทีที่แล้ว
            </p>
          </CardFooter>
        </Card>
      </Demo>

      <Demo name="aspect-ratio" hint="ล็อกสัดส่วน 16 / 9">
        <div className="w-full">
          <AspectRatio
            ratio={16 / 9}
            className="flex items-center justify-center rounded-lg bg-muted"
          >
            <span className="text-sm text-muted-foreground">16 : 9</span>
          </AspectRatio>
        </div>
      </Demo>

      <Demo name="separator" hint="เส้นคั่นแนวนอน / แนวตั้ง">
        <div className="w-full space-y-3">
          <p className="text-sm">ส่วนบน</p>
          <Separator />
          <p className="text-sm">ส่วนล่าง</p>
          <div className="flex h-6 items-center gap-3 text-sm">
            <span>ไทย</span>
            <Separator orientation="vertical" />
            <span>อังกฤษ</span>
            <Separator orientation="vertical" />
            <span>ญี่ปุ่น</span>
          </div>
        </div>
      </Demo>

      <Demo name="scroll-area" hint="พื้นที่เลื่อนพร้อมสกรอลบาร์">
        <ScrollArea className="h-40 w-full rounded-md border border-border p-3">
          <div className="space-y-2">
            {Array.from({ length: 14 }, (_, i) => (
              <p key={i} className="text-sm">
                รายการที่ {i + 1} — เลื่อนดูได้
              </p>
            ))}
          </div>
        </ScrollArea>
      </Demo>

      <Demo name="collapsible" hint="ซ่อน / แสดงเนื้อหา">
        <Collapsible open={open} onOpenChange={setOpen} className="w-full">
          <div className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2">
            <span className="text-sm font-medium">ตัวเลือกขั้นสูง</span>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon-sm">
                <ChevronsUpDownIcon />
                <span className="sr-only">สลับการแสดงผล</span>
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="mt-2 space-y-2">
            <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              เปิดใช้งานแคช
            </div>
            <div className="rounded-md border border-border px-3 py-2 text-sm text-muted-foreground">
              บันทึกบันทึกการใช้งาน
            </div>
          </CollapsibleContent>
        </Collapsible>
      </Demo>

      <Demo name="resizable" hint="ลากเส้นกลางเพื่อปรับขนาด">
        <ResizablePanelGroup
          orientation="horizontal"
          className="h-40 w-full rounded-md border border-border"
        >
          <ResizablePanel defaultSize="40">
            <div className="flex h-full items-center justify-center p-3 text-sm text-muted-foreground">
              ซ้าย
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="60">
            <div className="flex h-full items-center justify-center p-3 text-sm text-muted-foreground">
              ขวา
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Demo>

      <Demo
        name="sidebar"
        hint="แสดงแบบ collapsible=none ในกรอบตัวอย่าง"
        wide
        bodyClassName="p-4"
      >
        <SidebarProvider
          className="min-h-0 w-full overflow-hidden rounded-md border border-border"
          style={{ "--sidebar-width": "13rem" } as React.CSSProperties}
        >
          <Sidebar collapsible="none" className="h-56 border-r border-border">
            <SidebarHeader className="px-3 py-2 text-sm font-semibold">
              เมนูหลัก
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>ทั่วไป</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {SIDEBAR_ITEMS.map((item) => (
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
            พื้นที่เนื้อหา
          </main>
        </SidebarProvider>
      </Demo>
    </Section>
  );
}
