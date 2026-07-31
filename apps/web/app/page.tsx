"use client";

import { Badge } from "@repo/ui/components/ui/badge";
import { Button } from "@repo/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/ui/card";
import { Input } from "@repo/ui/components/ui/input";
import { Label } from "@repo/ui/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/ui/tabs";
import { Switch } from "@repo/ui/components/ui/switch";
import { Checkbox } from "@repo/ui/components/ui/checkbox";
import { Slider } from "@repo/ui/components/ui/slider";
import { Progress } from "@repo/ui/components/ui/progress";
import { Separator } from "@repo/ui/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@repo/ui/components/ui/accordion";
import { BrandSwitcher } from "@/components/brand-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { useBrand } from "@/components/providers";

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

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <header className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Design System · Multi-brand</p>
          <h1 className="text-3xl font-bold tracking-tight">
            สวัสดี นี่คือระบบดีไซน์กลาง
          </h1>
          <p className="mt-1 text-muted-foreground">
            แบรนด์ปัจจุบัน: <span className="font-semibold text-foreground">{brand}</span>{" "}
            — สลับแบรนด์และโหมดดู สี/ฟอนต์เปลี่ยนทั้งหน้าโดยไม่แตะโค้ด component
          </p>
        </div>
        <div className="flex items-center gap-3">
          <BrandSwitcher />
          <ThemeToggle />
        </div>
      </header>

      {/* Swatches */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">สีของแบรนด์ (tokens)</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
          {SWATCHES.map((s) => (
            <div key={s.name} className="space-y-2">
              <div className={`h-16 w-full rounded-lg border ${s.className}`} />
              <p className="text-center text-xs text-muted-foreground">{s.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">ปุ่ม</h2>
        <div className="flex flex-wrap gap-3">
          <Button>ปุ่มหลัก</Button>
          <Button variant="secondary">รอง</Button>
          <Button variant="outline">เส้นขอบ</Button>
          <Button variant="ghost">โปร่ง</Button>
          <Button variant="destructive">ลบ</Button>
          <Button variant="link">ลิงก์</Button>
        </div>
      </section>

      {/* Card + form */}
      <section className="mb-10 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>สมัครสมาชิก</CardTitle>
              <Badge>ใหม่</Badge>
            </div>
            <CardDescription>กรอกข้อมูลเพื่อทดสอบฟอนต์ไทยและ component</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">ชื่อ-นามสกุล</Label>
              <Input id="name" placeholder="เช่น สมชาย ใจดี" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">จังหวัด</Label>
              <Select>
                <SelectTrigger id="country">
                  <SelectValue placeholder="เลือกจังหวัด" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bkk">กรุงเทพมหานคร</SelectItem>
                  <SelectItem value="cnx">เชียงใหม่</SelectItem>
                  <SelectItem value="hkt">ภูเก็ต</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="tos" />
              <Label htmlFor="tos">ยอมรับเงื่อนไขการใช้งาน</Label>
            </div>
          </CardContent>
          <CardFooter className="gap-3">
            <Button className="flex-1">ยืนยัน</Button>
            <Button variant="outline" className="flex-1">
              ยกเลิก
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>คอนโทรลต่าง ๆ</CardTitle>
            <CardDescription>ทดสอบ component ที่ดึงมาจาก shadcn ครบชุด</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center justify-between">
              <Label htmlFor="noti">การแจ้งเตือน</Label>
              <Switch id="noti" defaultChecked />
            </div>
            <div className="space-y-2">
              <Label>ระดับเสียง</Label>
              <Slider defaultValue={[60]} max={100} step={1} />
            </div>
            <div className="space-y-2">
              <Label>ความคืบหน้า</Label>
              <Progress value={72} />
            </div>
            <Separator />
            <Tabs defaultValue="a">
              <TabsList>
                <TabsTrigger value="a">ทั่วไป</TabsTrigger>
                <TabsTrigger value="b">ขั้นสูง</TabsTrigger>
              </TabsList>
              <TabsContent value="a" className="pt-2 text-sm text-muted-foreground">
                แท็บทั่วไป — ข้อความไทยอ่านง่ายด้วยฟอนต์ของแบรนด์
              </TabsContent>
              <TabsContent value="b" className="pt-2 text-sm text-muted-foreground">
                แท็บขั้นสูง — ตั้งค่าเพิ่มเติมได้ที่นี่
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </section>

      {/* Accordion */}
      <section className="mb-10">
        <h2 className="mb-3 text-lg font-semibold">คำถามที่พบบ่อย</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="1">
            <AccordionTrigger>เปลี่ยนสีของแบรนด์ยังไง?</AccordionTrigger>
            <AccordionContent>
              แก้ค่าในไฟล์ token ที่ packages/tokens/src/&lt;brand&gt;.css — component ไม่ต้องแก้
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="2">
            <AccordionTrigger>เพิ่มแบรนด์ใหม่ต้องทำอะไร?</AccordionTrigger>
            <AccordionContent>
              ก็อปไฟล์ token 1 ไฟล์ เปลี่ยน selector เป็น [data-brand=&quot;ชื่อใหม่&quot;] แล้ว import
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <footer className="border-t pt-6 text-sm text-muted-foreground">
        component ทั้งหมดอยู่ที่{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">packages/ui/src/components/ui/</code>
        {" · "}สี/ฟอนต์อยู่ที่{" "}
        <code className="rounded bg-muted px-1.5 py-0.5">packages/tokens/src/</code>
      </footer>
    </main>
  );
}
