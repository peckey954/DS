"use client";

import * as React from "react";
import {
  BellIcon,
  CheckIcon,
  DownloadIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
} from "lucide-react";

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
import { Checkbox } from "@peckey954/ui/components/ui/checkbox";
import { Input } from "@peckey954/ui/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@peckey954/ui/components/ui/input-group";
import { Label } from "@peckey954/ui/components/ui/label";
import { Switch } from "@peckey954/ui/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@peckey954/ui/components/ui/table";
import { cn } from "@peckey954/ui/lib/utils";

import { BrandSwitcher } from "@/components/brand-switcher";
import { ThemeToggle } from "@/components/theme-toggle";

const RADIUS = [
  { id: "sharp", label: "ไม่โค้ง", hint: "Sharp · ปุ่ม 0px" },
  { id: "standard", label: "โค้งปกติ", hint: "Standard · ปุ่ม 8px" },
  { id: "friendly", label: "โค้งมาก", hint: "Friendly · ปุ่ม 14px" },
  { id: "pill", label: "แคปซูล", hint: "Pill · ปุ่มกลมเต็ม" },
] as const;

const DENSITY = [
  { id: "compact", label: "แน่น", hint: "Compact · ปุ่มสูง 32px" },
  { id: "standard", label: "ปกติ", hint: "Standard · ปุ่มสูง 36px" },
  { id: "comfortable", label: "โปร่ง", hint: "Comfortable · ปุ่มสูง 45px" },
] as const;

const TINT = [
  { id: "pure", label: "แยกสี", hint: "Pure · เทาแท้ ไม่ผสม" },
  { id: "blend", label: "ผสมแบรนด์", hint: "Blend · ผสมสีแบรนด์" },
] as const;

const FONT = [
  { id: "ibm", label: "IBM Plex Thai", hint: "ฟอนต์เดิมของ Blue" },
  { id: "prompt", label: "Prompt", hint: "ฟอนต์เดิมของ Green" },
  { id: "sarabun", label: "Sarabun", hint: "ฟอนต์เดิมของ Parich" },
] as const;

type Radius = (typeof RADIUS)[number]["id"];
type Density = (typeof DENSITY)[number]["id"];
type Tint = (typeof TINT)[number]["id"];
type Font = (typeof FONT)[number]["id"];

/** ปุ่มเลือกของแถบควบคุม — ตั้งใจไม่ใช้ token ขนาด จะได้ไม่ย่อขยายตามที่กำลังทดสอบ */
function Choice({
  active,
  onClick,
  label,
  hint,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 rounded-md border px-3 py-2 text-left transition-colors",
        active
          ? "border-primary bg-primary/10"
          : "border-border hover:bg-accent-hover"
      )}
      style={{ borderRadius: 8 }}
    >
      <span className="block text-sm font-medium">{label}</span>
      <span className="block text-xs text-muted-foreground">{hint}</span>
    </button>
  );
}

export default function StylesPreview() {
  const [radius, setRadius] = React.useState<Radius>("standard");
  const [density, setDensity] = React.useState<Density>("standard");
  const [tint, setTint] = React.useState<Tint>("blend");
  const [font, setFont] = React.useState<Font>("ibm");
  const [measured, setMeasured] = React.useState<Record<string, string>>({});
  const sampleRef = React.useRef<HTMLButtonElement>(null);
  const iconRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    document.documentElement.dataset.radius = radius;
    document.documentElement.dataset.density = density;
    document.documentElement.dataset.tint = tint;
    document.documentElement.dataset.font = font;
  }, [radius, density, tint, font]);

  // วัดค่าจริงหลังเรนเดอร์ เพื่อให้เห็นตัวเลขไม่ใช่แค่ความรู้สึก
  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      const btn = sampleRef.current;
      const svg = iconRef.current?.querySelector("svg");
      if (!btn) return;
      const cs = getComputedStyle(btn);
      setMeasured({
        "ปุ่ม สูง": cs.height,
        "ปุ่ม padding": cs.paddingLeft,
        "ปุ่ม มุมโค้ง": cs.borderRadius,
        "ไอคอน": svg ? getComputedStyle(svg).width : "-",
        // แสดงสีพื้นจริง จะได้เห็นว่าโทน "แยกสี" ให้ R=G=B เท่ากันจริง
        "สีพื้น": getComputedStyle(document.body).backgroundColor,
      });
    });
    return () => cancelAnimationFrame(id);
  }, [radius, density, tint, font]);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
        <div
          className="mx-auto max-w-5xl px-6 py-4"
          style={{ padding: "16px 24px" }}
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-base font-semibold">
                ทดลองสไตล์ — โทนสีพื้น × ฟอนต์ × ความโค้ง × ความห่าง
              </h1>
              <p className="text-sm text-muted-foreground">
                กดสลับแล้วดูว่า component เปลี่ยนยังไง สลับแบรนด์กับโหมดมืดได้ด้วย
              </p>
            </div>
            <div className="flex items-center gap-2">
              <BrandSwitcher />
              <ThemeToggle />
            </div>
          </div>

          <div className="mb-3 grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                โทนสีพื้น
              </p>
              <div className="flex gap-2">
                {TINT.map((t) => (
                  <Choice
                    key={t.id}
                    active={tint === t.id}
                    onClick={() => setTint(t.id)}
                    label={t.label}
                    hint={t.hint}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                ฟอนต์
              </p>
              <div className="flex gap-2">
                {FONT.map((f) => (
                  <Choice
                    key={f.id}
                    active={font === f.id}
                    onClick={() => setFont(f.id)}
                    label={f.label}
                    hint={f.hint}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                ความโค้ง
              </p>
              <div className="flex gap-2">
                {RADIUS.map((r) => (
                  <Choice
                    key={r.id}
                    active={radius === r.id}
                    onClick={() => setRadius(r.id)}
                    label={r.label}
                    hint={r.hint}
                  />
                ))}
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                ความห่าง
              </p>
              <div className="flex gap-2">
                {DENSITY.map((d) => (
                  <Choice
                    key={d.id}
                    active={density === d.id}
                    onClick={() => setDensity(d.id)}
                    label={d.label}
                    hint={d.hint}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            className="mt-3 flex flex-wrap gap-4 border-t border-border pt-3 text-xs text-muted-foreground"
            style={{ marginTop: 12, paddingTop: 12 }}
          >
            {Object.entries(measured).map(([k, v]) => (
              <span key={k}>
                {k}: <span className="font-semibold text-foreground">{v}</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-8 px-6 py-8">
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">ปุ่ม — ดูขนาดไอคอนเทียบกับข้อความ</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button ref={sampleRef}>
              <PlusIcon />
              เพิ่มรายการ
            </Button>
            <Button variant="secondary">
              <DownloadIcon />
              ดาวน์โหลด
            </Button>
            <Button variant="outline">ไม่มีไอคอน</Button>
            <Button variant="destructive">
              <Trash2Icon />
              ลบ
            </Button>
            <Button ref={iconRef} size="icon" aria-label="ตั้งค่า">
              <SettingsIcon />
            </Button>
            <Button size="sm">
              <CheckIcon />
              ขนาดเล็ก
            </Button>
            <Button size="lg">
              <BellIcon />
              ขนาดใหญ่
            </Button>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">ช่องกรอก</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="s-name">ชื่อโครงการ</Label>
              <Input id="s-name" placeholder="เช่น ระบบจัดการคลัง" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="s-search">ค้นหา</Label>
              <InputGroup>
                <InputGroupAddon>
                  <SearchIcon />
                </InputGroupAddon>
                <InputGroupInput id="s-search" placeholder="พิมพ์เพื่อค้นหา…" />
              </InputGroup>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Checkbox id="s-cb" defaultChecked />
              <Label htmlFor="s-cb" className="font-normal">
                รับการแจ้งเตือน
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="s-sw" defaultChecked />
              <Label htmlFor="s-sw" className="font-normal">
                เปิดใช้งาน
              </Label>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold">การ์ด</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>ยอดขายเดือนนี้</CardTitle>
                <CardDescription>เทียบกับเดือนก่อนหน้า</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold">฿1,284,900</p>
                <Badge tone="neutral" appearance="soft" className="mt-2">
                  +12%
                </Badge>
              </CardContent>
              <CardFooter>
                <Button size="sm">
                  <CheckIcon />
                  ดูรายละเอียด
                </Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>คำสั่งซื้อล่าสุด</CardTitle>
                <CardDescription>3 รายการที่ยังไม่ได้จัดส่ง</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>เลขที่</TableHead>
                      <TableHead>ลูกค้า</TableHead>
                      <TableHead className="text-right">ยอด</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ["INV-001", "สมชาย ใจดี", "฿12,500"],
                      ["INV-002", "มานี รักเรียน", "฿8,300"],
                      ["INV-003", "ปิติ ยินดี", "฿4,100"],
                    ].map(([id, name, amt]) => (
                      <TableRow key={id}>
                        <TableCell className="font-medium">{id}</TableCell>
                        <TableCell>{name}</TableCell>
                        <TableCell className="text-right">{amt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
