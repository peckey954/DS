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
} from "@peckey954/ui/components/ui/breadcrumb";
import { Button } from "@peckey954/ui/components/ui/button";
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
} from "@peckey954/ui/components/ui/command";
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
} from "@peckey954/ui/components/ui/menubar";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@peckey954/ui/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@peckey954/ui/components/ui/pagination";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@peckey954/ui/components/ui/tabs";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    breadcrumbHint: "เส้นทางของหน้าปัจจุบัน",
    home: "หน้าแรก",
    designSystem: "ดีไซน์ซิสเต็ม",
    gallery: "แกลเลอรี component",
    tabsHint: "สลับเนื้อหาในที่เดียว",
    account: "บัญชี",
    password: "รหัสผ่าน",
    team: "ทีม",
    accountBody: "จัดการชื่อที่แสดงและอีเมลของคุณ",
    passwordBody: "เปลี่ยนรหัสผ่านและเปิดยืนยันสองชั้น",
    teamBody: "เชิญเพื่อนร่วมทีมและกำหนดสิทธิ์",
    paginationHint: "แบ่งหน้ารายการ",
    currentPage: "หน้าปัจจุบัน:",
    menubarHint: "แถบเมนูแบบแอปเดสก์ท็อป",
    file: "ไฟล์",
    newFile: "สร้างใหม่",
    openFile: "เปิด…",
    exportAs: "ส่งออกเป็น",
    view: "มุมมอง",
    showToolbar: "แสดงแถบเครื่องมือ",
    showGrid: "แสดงเส้นตาราง",
    compact: "แน่น",
    comfortable: "สบายตา",
    navMenuHint: "เมนูหลักพร้อมแผงย่อย",
    products: "สินค้า",
    itemDs: "ดีไซน์ซิสเต็ม",
    itemDsDesc: "token + component กลาง",
    itemDash: "แดชบอร์ด",
    itemDashDesc: "ดูตัวเลขสำคัญแบบเรียลไทม์",
    itemReport: "รายงาน",
    itemReportDesc: "สรุปผลรายเดือน",
    itemUsers: "ผู้ใช้งาน",
    itemUsersDesc: "จัดการสิทธิ์และทีม",
    pricing: "ราคา",
    contact: "ติดต่อเรา",
    commandHint: "ค้นหาคำสั่งแบบ command palette",
    searchCommand: "พิมพ์เพื่อค้นหาคำสั่ง…",
    noCommand: "ไม่พบคำสั่งที่ค้นหา",
    groupGeneral: "ทั่วไป",
    emoji: "เปิดอีโมจิ",
    calculator: "เครื่องคิดเลข",
    groupAccount: "บัญชี",
    profile: "โปรไฟล์",
    billing: "การชำระเงิน",
    settings: "ตั้งค่า",
    openDialog: "เปิดแบบ CommandDialog",
    dialogTitle: "ค้นหาคำสั่ง",
    dialogDesc: "พิมพ์ชื่อคำสั่งที่ต้องการเรียกใช้",
    groupShortcut: "ลัด",
    goProfile: "ไปที่โปรไฟล์",
    goSettings: "ไปที่ตั้งค่า",
  },
  en: {
    breadcrumbHint: "Path to the current page",
    home: "Home",
    designSystem: "Design system",
    gallery: "Component gallery",
    tabsHint: "Swap content in place",
    account: "Account",
    password: "Password",
    team: "Team",
    accountBody: "Manage your display name and email address",
    passwordBody: "Change your password and turn on two-factor auth",
    teamBody: "Invite teammates and set their permissions",
    paginationHint: "Split a list into pages",
    currentPage: "Current page:",
    menubarHint: "Desktop-app style menu bar",
    file: "File",
    newFile: "New",
    openFile: "Open…",
    exportAs: "Export as",
    view: "View",
    showToolbar: "Show toolbar",
    showGrid: "Show grid",
    compact: "Compact",
    comfortable: "Comfortable",
    navMenuHint: "Primary menu with a sub panel",
    products: "Products",
    itemDs: "Design system",
    itemDsDesc: "Shared tokens + components",
    itemDash: "Dashboard",
    itemDashDesc: "Watch key numbers in real time",
    itemReport: "Reports",
    itemReportDesc: "Monthly summaries",
    itemUsers: "Users",
    itemUsersDesc: "Manage permissions and teams",
    pricing: "Pricing",
    contact: "Contact us",
    commandHint: "Command palette search",
    searchCommand: "Type to search commands…",
    noCommand: "No matching command",
    groupGeneral: "General",
    emoji: "Open emoji picker",
    calculator: "Calculator",
    groupAccount: "Account",
    profile: "Profile",
    billing: "Billing",
    settings: "Settings",
    openDialog: "Open as CommandDialog",
    dialogTitle: "Search commands",
    dialogDesc: "Type the name of the command you want to run",
    groupShortcut: "Shortcuts",
    goProfile: "Go to profile",
    goSettings: "Go to settings",
  },
});

export function SectionNavigation() {
  const t = useT();
  const c = useCopy(COPY);
  const [cmdOpen, setCmdOpen] = React.useState(false);
  const [page, setPage] = React.useState(2);

  return (
    <Section
      id="navigation"
      title={t("section.navigation")}
      hint="breadcrumb · tabs · navigation-menu · menubar · pagination · command"
    >
      <Demo name="breadcrumb" hint={c.breadcrumbHint} wide>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{c.home}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbEllipsis />
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{c.designSystem}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{c.gallery}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </Demo>

      <Demo name="tabs" hint={c.tabsHint}>
        <Tabs defaultValue="account" className="w-full">
          <TabsList>
            <TabsTrigger value="account">{c.account}</TabsTrigger>
            <TabsTrigger value="password">{c.password}</TabsTrigger>
            <TabsTrigger value="team">{c.team}</TabsTrigger>
          </TabsList>
          <TabsContent value="account" className="pt-3 text-sm text-muted-foreground">
            {c.accountBody}
          </TabsContent>
          <TabsContent value="password" className="pt-3 text-sm text-muted-foreground">
            {c.passwordBody}
          </TabsContent>
          <TabsContent value="team" className="pt-3 text-sm text-muted-foreground">
            {c.teamBody}
          </TabsContent>
        </Tabs>
      </Demo>

      <Demo name="pagination" hint={c.paginationHint}>
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
            {c.currentPage} {page}
          </p>
        </div>
      </Demo>

      <Demo name="menubar" hint={c.menubarHint}>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>{c.file}</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                {c.newFile} <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                {c.openFile} <MenubarShortcut>⌘O</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>{c.exportAs}</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>PDF</MenubarItem>
                  <MenubarItem>PNG</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>{c.view}</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>{c.showToolbar}</MenubarCheckboxItem>
              <MenubarCheckboxItem>{c.showGrid}</MenubarCheckboxItem>
              <MenubarSeparator />
              <MenubarRadioGroup value="comfortable">
                <MenubarRadioItem value="compact">{c.compact}</MenubarRadioItem>
                <MenubarRadioItem value="comfortable">{c.comfortable}</MenubarRadioItem>
              </MenubarRadioGroup>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Demo>

      <Demo name="navigation-menu" hint={c.navMenuHint} wide>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>{c.products}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[22rem] gap-2 p-3 md:w-[26rem] md:grid-cols-2">
                  {[
                    { title: c.itemDs, desc: c.itemDsDesc },
                    { title: c.itemDash, desc: c.itemDashDesc },
                    { title: c.itemReport, desc: c.itemReportDesc },
                    { title: c.itemUsers, desc: c.itemUsersDesc },
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
                {c.pricing}
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#"
                className={navigationMenuTriggerStyle()}
              >
                {c.contact}
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Demo>

      <Demo name="command" hint={c.commandHint} wide>
        <div className="w-full space-y-3">
          <Command className="rounded-lg border border-border">
            <CommandInput placeholder={c.searchCommand} />
            <CommandList>
              <CommandEmpty>{c.noCommand}</CommandEmpty>
              <CommandGroup heading={c.groupGeneral}>
                <CommandItem>
                  <SmileIcon />
                  <span>{c.emoji}</span>
                </CommandItem>
                <CommandItem>
                  <CalculatorIcon />
                  <span>{c.calculator}</span>
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading={c.groupAccount}>
                <CommandItem>
                  <UserIcon />
                  <span>{c.profile}</span>
                  <CommandShortcut>⌘P</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <CreditCardIcon />
                  <span>{c.billing}</span>
                  <CommandShortcut>⌘B</CommandShortcut>
                </CommandItem>
                <CommandItem>
                  <SettingsIcon />
                  <span>{c.settings}</span>
                  <CommandShortcut>⌘S</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>

          <Button variant="outline" size="sm" onClick={() => setCmdOpen(true)}>
            {c.openDialog}
          </Button>
          <CommandDialog
            open={cmdOpen}
            onOpenChange={setCmdOpen}
            title={c.dialogTitle}
            description={c.dialogDesc}
          >
            <CommandInput placeholder={c.searchCommand} />
            <CommandList>
              <CommandEmpty>{c.noCommand}</CommandEmpty>
              <CommandGroup heading={c.groupShortcut}>
                <CommandItem onSelect={() => setCmdOpen(false)}>
                  <UserIcon />
                  <span>{c.goProfile}</span>
                </CommandItem>
                <CommandItem onSelect={() => setCmdOpen(false)}>
                  <SettingsIcon />
                  <span>{c.goSettings}</span>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </CommandDialog>
        </div>
      </Demo>
    </Section>
  );
}
