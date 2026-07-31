"use client";

import * as React from "react";
import {
  CalculatorIcon,
  CreditCardIcon,
  SettingsIcon,
  SmileIcon,
  UserIcon,
} from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@repo/ui/components/ui/breadcrumb";
import { Button } from "@repo/ui/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@repo/ui/components/ui/command";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@repo/ui/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@repo/ui/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@repo/ui/components/ui/pagination";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";

import { Demo, Section } from "./showcase";
import { useT } from "@/lib/i18n";

export function SectionNavigation() {
  const t = useT();
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [page, setPage] = React.useState(2);

  return (
    <Section
      id="navigation"
      title={t("section.navigation")}
      hint="breadcrumb · tabs · navigation-menu · menubar · pagination · command"
    >
      <Demo name="breadcrumb" hint="เส้นทางของหน้าปัจจุบัน" wide>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">หน้าแรก</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">ดีไซน์ซิสเต็ม</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>แกลเลอรี component</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Demo>

      <Demo name="tabs" hint="สลับเนื้อหาในที่เดียว">
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">บัญชี</TabsTrigger>
            <TabsTrigger value="password">รหัสผ่าน</TabsTrigger>
            <TabsTrigger value="team">ทีม</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="pt-3 text-sm text-muted-foreground">
            จัดการชื่อที่แสดงและอีเมลของคุณ
          </TabsContent>
          <TabsContent value="password" className="pt-3 text-sm text-muted-foreground">
            เปลี่ยนรหัสผ่านและเปิดยืนยันสองชั้น
          </TabsContent>
          <TabsContent value="team" className="pt-3 text-sm text-muted-foreground">
            เชิญเพื่อนร่วมทีมและกำหนดสิทธิ์
          </TabsContent>
        </Tabs>
      </Demo>

      <Demo name="pagination" hint="แบ่งหน้ารายการ">
        <div className="w-full space-y-2">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>
              {[1, 2, 3].map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    href="#"
                    isActive={page === n}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(n);
                    }}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(3, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <p className="text-center text-sm text-muted-foreground">
            หน้าปัจจุบัน: {page}
          </p>
        </div>
      </Demo>

      <Demo name="menubar" hint="แถบเมนูแบบแอปเดสก์ท็อป">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>ไฟล์</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                สร้างใหม่ <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                เปิด… <MenubarShortcut>⌘O</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>ส่งออกเป็น</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>PDF</MenubarItem>
                  <MenubarItem>PNG</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>มุมมอง</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>แสดงแถบเครื่องมือ</MenubarCheckboxItem>
              <MenubarCheckboxItem>แสดงเส้นตาราง</MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarRadioGroup value="comfortable">
                <MenubarRadioItem value="compact">แน่น</MenubarRadioItem>
                <MenubarRadioItem value="comfortable">สบายตา</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Demo>

      <Demo name="navigation-menu" hint="เมนูหลักพร้อมแผงย่อย" wide>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>สินค้า</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[22rem] gap-2 p-3 md:w-[26rem] md:grid-cols-2">
                  {[
                    { title: "ดีไซน์ซิสเต็ม", desc: "token + component กลาง" },
                    { title: "แดชบอร์ด", desc: "ดูตัวเลขสำคัญแบบเรียลไทม์" },
                    { title: "รายงาน", desc: "สรุปผลรายเดือน" },
                    { title: "ผู้ใช้งาน", desc: "จัดการสิทธิ์และทีม" },
                  ].map((item) => (
                    <li key={item.title}>
                      <NavigationMenuLink
                        href="#"
                        className="block rounded-md p-3 leading-snug"
                      >
                        <span className="text-sm font-medium">{item.title}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.desc}
                        </span>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                ราคา
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                ติดต่อเรา
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Demo>

      <Demo name="command" hint="ค้นหาคำสั่งแบบ command palette" wide>
        <div className="w-full space-y-3">
          <Command className="rounded-lg border border-border">
            <CommandInput placeholder="พิมพ์เพื่อค้นหาคำสั่ง…" />
            <CommandList>
              <CommandEmpty>ไม่พบคำสั่งที่ค้นหา</CommandEmpty>
              <CommandGroup heading="ทั่วไป">
                <CommandItem>
                  <SmileIcon />
                  <span>เปิดอีโมจิ</span>
                </CommandItem>
                <CommandItem>
                  <CalculatorIcon />
                  <span>เครื่องคิดเลข</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="บัญชี">
                <CommandItem>
                  <UserIcon />
                  <span>โปรไฟล์</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CreditCardIcon />
                  <span>การชำระเงิน</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <SettingsIcon />
                  <span>ตั้งค่า</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>

          <Button variant="outline" size="sm" onClick={() => setCmdOpen(true)}>
            เปิดแบบ CommandDialog
          </Button>
          <CommandDialog
            open={cmdOpen}
            onOpenChange={setCmdOpen}
            title="ค้นหาคำสั่ง"
            description="พิมพ์ชื่อคำสั่งที่ต้องการเรียกใช้"
          >
            <CommandInput placeholder="พิมพ์เพื่อค้นหาคำสั่ง…" />
            <CommandList>
              <CommandEmpty>ไม่พบคำสั่งที่ค้นหา</CommandEmpty>
              <CommandGroup heading="ลัด">
                <CommandItem onSelect={() => setCmdOpen(false)}>
                  <UserIcon />
                  <span>ไปที่โปรไฟล์</span>
                </CommandItem>
                <CommandItem onSelect={() => setCmdOpen(false)}>
                  <SettingsIcon />
                  <span>ไปที่ตั้งค่า</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      </Demo>
    </Section>
  );
}
