"use client";

import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@peckey954/ui/lib/utils";
import { Badge } from "@peckey954/ui/components/ui/badge";
import { Button } from "@peckey954/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@peckey954/ui/components/ui/card";
import { Input } from "@peckey954/ui/components/ui/input";
import { Label } from "@peckey954/ui/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@peckey954/ui/components/ui/tabs";
import { Switch } from "@peckey954/ui/components/ui/switch";
import { Checkbox } from "@peckey954/ui/components/ui/checkbox";
import { Slider } from "@peckey954/ui/components/ui/slider";
import { Progress } from "@peckey954/ui/components/ui/progress";
import { Separator } from "@peckey954/ui/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@peckey954/ui/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@peckey954/ui/components/ui/accordion";
import { BrandSwitcher } from "@/components/brand-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useBrand } from "@/components/providers";
import { LanguageSwitcher } from "@/components/language-switcher";
import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    signUp: "สมัครสมาชิก",
    new: "ใหม่",
    signUpDesc: "กรอกข้อมูลเพื่อทดสอบฟอนต์ไทยและ component",
    fullName: "ชื่อ-นามสกุล",
    namePlaceholder: "เช่น สมชาย ใจดี",
    province: "จังหวัด",
    pickProvince: "เลือกจังหวัด",
    bkk: "กรุงเทพมหานคร",
    cnx: "เชียงใหม่",
    hkt: "ภูเก็ต",
    acceptTos: "ยอมรับเงื่อนไขการใช้งาน",
    confirm: "ยืนยัน",
    cancel: "ยกเลิก",
    controls: "คอนโทรลต่าง ๆ",
    controlsDesc: "ทดสอบ component ที่ดึงมาจาก shadcn ครบชุด",
    notifications: "การแจ้งเตือน",
    volume: "ระดับเสียง",
    progress: "ความคืบหน้า",
    tabGeneral: "ทั่วไป",
    tabAdvanced: "ขั้นสูง",
    tabGeneralBody: "แท็บทั่วไป — ข้อความไทยอ่านง่ายด้วยฟอนต์ของแบรนด์",
    tabAdvancedBody: "แท็บขั้นสูง — ตั้งค่าเพิ่มเติมได้ที่นี่",
    q1: "เปลี่ยนสีของแบรนด์ยังไง?",
    a1: "แก้ค่าในไฟล์ token ที่ packages/tokens/src/<brand>.css — component ไม่ต้องแก้",
    q2: "เพิ่มแบรนด์ใหม่ต้องทำอะไร?",
    a2: "ก็อปไฟล์ token 1 ไฟล์ เปลี่ยน selector เป็นชื่อแบรนด์ใหม่ แล้ว import",
    footerBefore: "component ทั้งหมดอยู่ที่",
    footerMiddle: "สี/ฟอนต์อยู่ที่",
    btnPrimary: "ปุ่มหลัก",
    btnSecondary: "รอง",
    btnOutline: "เส้นขอบ",
    btnGhost: "โปร่ง",
    btnDestructive: "ลบ",
    btnLink: "ลิงก์",
  },
  en: {
    signUp: "Sign up",
    new: "New",
    signUpDesc: "Fill this in to test the Thai font and the components",
    fullName: "Full name",
    namePlaceholder: "e.g. Somchai Jaidee",
    province: "Province",
    pickProvince: "Select a province",
    bkk: "Bangkok",
    cnx: "Chiang Mai",
    hkt: "Phuket",
    acceptTos: "I accept the terms of use",
    confirm: "Confirm",
    cancel: "Cancel",
    controls: "Various controls",
    controlsDesc: "Try the full set of components pulled in from shadcn",
    notifications: "Notifications",
    volume: "Volume",
    progress: "Progress",
    tabGeneral: "General",
    tabAdvanced: "Advanced",
    tabGeneralBody: "General tab — Thai text stays readable in each brand's font",
    tabAdvancedBody: "Advanced tab — extra settings live here",
    q1: "How do I change the brand colours?",
    a1: "Edit the token file at packages/tokens/src/<brand>.css — components stay untouched",
    q2: "What does adding a new brand involve?",
    a2: "Copy one token file, change the selector to the new brand, then import it",
    footerBefore: "All components live in",
    footerMiddle: "colours/fonts live in",
    btnPrimary: "Primary",
    btnSecondary: "Secondary",
    btnOutline: "Outline",
    btnGhost: "Ghost",
    btnDestructive: "Delete",
    btnLink: "Link",
  },
});

const SWATCHES = [
  { name: "primary", className: "bg-primary" },
  { name: "secondary", className: "bg-secondary" },
  { name: "accent", className: "bg-accent" },
  { name: "muted", className: "bg-muted" },
  { name: "destructive", className: "bg-destructive" },
  { name: "chart-2", className: "bg-chart-2" },
];

export default function Home() {
  const { brand } = useBrand();
  const t = useT();
  const c = useCopy(COPY);

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{t("home.eyebrow")}</p>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("home.title")}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {t("home.brandNow")} <span className="font-semibold text-foreground">{brand}</span>{" "}
            {t("home.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <BrandSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <section className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-card p-5 text-card-foreground">
        <div>
          <h2 className="text-lg font-semibold">{t("home.galleryTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("home.galleryDesc")}
          </p>
        </div>
        <Button asChild>
          <Link href="/components">
            {t("home.openGallery")}
            <ArrowRightIcon />
          </Link>
        </Button>
      </section>

      {/* Swatches */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">{t("home.swatches")}</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SWATCHES.map((s) => (
            <div key={s.name} className="space-y-2">
              <div className={cn("h-16 w-full rounded-lg border", s.className)} />
              <p className="text-center text-xs text-muted-foreground">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">{t("home.buttons")}</h2>
        <div className="flex flex-wrap gap-3">
          <Button>{c.btnPrimary}</Button>
          <Button variant="secondary">{c.btnSecondary}</Button>
          <Button variant="outline">{c.btnOutline}</Button>
          <Button variant="ghost">{c.btnGhost}</Button>
          <Button variant="destructive">{c.btnDestructive}</Button>
          <Button variant="link">{c.btnLink}</Button>
        </div>
      </section>

      {/* Card + form */}
      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{c.signUp}</CardTitle>
              <Badge>{c.new}</Badge>
            </div>
            <CardDescription>{c.signUpDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{c.fullName}</Label>
              <Input id="name" placeholder={c.namePlaceholder} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">{c.province}</Label>
              <Select>
                <SelectTrigger id="country">
                  <SelectValue placeholder={c.pickProvince} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bkk">{c.bkk}</SelectItem>
                  <SelectItem value="cnx">{c.cnx}</SelectItem>
                  <SelectItem value="hkt">{c.hkt}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="tos" />
              <Label htmlFor="tos">{c.acceptTos}</Label>
            </div>
          </CardContent>
          <CardFooter className="gap-3">
            <Button className="flex-1">{c.confirm}</Button>
            <Button variant="outline" className="flex-1">
              {c.cancel}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{c.controls}</CardTitle>
            <CardDescription>{c.controlsDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="noti">{c.notifications}</Label>
              <Switch id="noti" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>{c.volume}</Label>
              <Slider defaultValue={[60]} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label>{c.progress}</Label>
              <Progress value={72} />
            </div>
            <Separator />
            <Tabs defaultValue="a">
              <TabsList>
                <TabsTrigger value="a">{c.tabGeneral}</TabsTrigger>
                <TabsTrigger value="b">{c.tabAdvanced}</TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="pt-2 text-sm text-muted-foreground">
                {c.tabGeneralBody}
              </TabsContent>
              <TabsContent value="b" className="pt-2 text-sm text-muted-foreground">
                {c.tabAdvancedBody}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Accordion */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">{t("home.faq")}</h2>
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
        </Accordion>
      </section>

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        {c.footerBefore}{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">packages/ui/src/components/ui/</code>
        {" · "}
        {c.footerMiddle}{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">packages/tokens/src/</code>
      </footer>
    </main>
  );
}
