"use client";

import * as React from "react";
import { InfoIcon, MenuIcon, PlusIcon, Trash2Icon } from "lucide-react";

import { Avatar, AvatarFallback } from "@peckey954/ui/components/ui/avatar";
import { Badge } from "@peckey954/ui/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@peckey954/ui/components/ui/breadcrumb";
import { Button } from "@peckey954/ui/components/ui/button";
import { Card, CardContent } from "@peckey954/ui/components/ui/card";
import { Input } from "@peckey954/ui/components/ui/input";
import { Label } from "@peckey954/ui/components/ui/label";
import { Separator } from "@peckey954/ui/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@peckey954/ui/components/ui/table";
import { Textarea } from "@peckey954/ui/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@peckey954/ui/components/ui/tooltip";
import { cn } from "@peckey954/ui/lib/utils";

import { NotificationBell } from "../_parts/notifications";

/* ============================================================
   หน้าตัวอย่าง: ใบตรวจสอบรับวัตถุดิบ (Parich WMS)

   ทั้งหน้าใช้ component จาก @peckey954/ui และ token เท่านั้น
   ไม่มีสี ขนาด หรือมุมโค้งที่ hardcode เลยสักจุด
   จึงเปลี่ยนแบรนด์ / โหมดมืด / ความโค้ง / ความห่าง ได้ทันทีจากแอตทริบิวต์บน <html>
   ============================================================ */

/** หัวข้อของแต่ละบล็อกตรวจสอบ พร้อมไอคอนคำอธิบายและปุ่มเพิ่มแถว */
function SectionHeader({
  title,
  hint,
  summary,
  onAdd,
}: {
  title: string;
  hint: string;
  summary?: React.ReactNode;
  onAdd: () => void;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-1.5">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`คำอธิบาย ${title}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <InfoIcon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>{hint}</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center gap-3">
        {summary}
        <Button variant="outline-primary" size="sm" onClick={onAdd}>
          <PlusIcon />
          เพิ่มครั้ง
        </Button>
      </div>
    </div>
  );
}

/** ตัวเลขสรุปท้ายหัวข้อ เช่น "น้ำหนักรวม: 12.50" */
function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <span className="text-sm text-muted-foreground">
      {label}: <span className="font-medium text-foreground">{value}</span>
    </span>
  );
}

/** ช่องกรอกตัวเลขในตาราง — จัดชิดขวาเพื่อให้หลักตรงกัน */
function NumberCell({
  value,
  onChange,
  ariaLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  return (
    <Input
      inputMode="decimal"
      aria-label={ariaLabel}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="text-right tabular-nums"
    />
  );
}

/** ปุ่มลบแถว — ปิดใช้งานเมื่อเหลือแถวเดียว จะได้ไม่ลบจนตารางว่าง */
function RowDelete({
  disabled,
  onClick,
}: {
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      aria-label="ลบแถวนี้"
      disabled={disabled}
      onClick={onClick}
      className="text-muted-foreground hover:text-destructive"
    >
      <Trash2Icon />
    </Button>
  );
}

const SIZE_COLUMNS = ["4 mm", "3.15 mm", "2 mm", "0.5 mm"];
const HARDNESS_COLUMNS = [1, 2, 3, 4, 5];

type SizeRow = { weights: string[]; note: string };
type HardnessRow = { values: string[]; note: string };
type MoistureRow = { moisture: string; weight: string; note: string };

/* ตั้งค่าเริ่มต้นเป็น "0.00" ตามดีไซน์ ไม่ใช่ช่องว่าง
   เพราะผู้ใช้กรอกทับได้เลยและเห็นรูปแบบทศนิยมที่ระบบคาดหวังทันที */
const ZERO = "0.00";
const emptySize = (): SizeRow => ({
  weights: SIZE_COLUMNS.map(() => ZERO),
  note: "",
});
const emptyHardness = (): HardnessRow => ({
  values: HARDNESS_COLUMNS.map(() => ZERO),
  note: "",
});
const emptyMoisture = (): MoistureRow => ({
  moisture: ZERO,
  weight: ZERO,
  note: "",
});

const num = (v: string) => {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const fmt = (n: number, digits = 2) =>
  n > 0 ? n.toFixed(digits) : "-";

export default function ReceivingInspectionPage() {
  const [sizeRows, setSizeRows] = React.useState<SizeRow[]>([emptySize()]);
  const [hardRows, setHardRows] = React.useState<HardnessRow[]>([
    emptyHardness(),
  ]);
  const [moistRows, setMoistRows] = React.useState<MoistureRow[]>([
    emptyMoisture(),
  ]);
  const [note, setNote] = React.useState("");

  /* น้ำหนักรวมของทุกแถวทุกช่อง ใช้เป็นตัวหารหา % ของแต่ละขนาด */
  const sizeTotal = sizeRows.reduce(
    (sum, r) => sum + r.weights.reduce((s, w) => s + num(w), 0),
    0
  );

  const hardnessAvg = (() => {
    const all = hardRows.flatMap((r) => r.values.map(num)).filter((n) => n > 0);
    return all.length ? all.reduce((a, b) => a + b, 0) / all.length : 0;
  })();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* ---------- แถบบนสุด ---------- */}
        <header className="sticky top-0 z-40 border-b border-border bg-card">
          <div className="flex h-14 items-center gap-3 px-4">
            <Button variant="ghost" size="icon-sm" aria-label="เปิดเมนู">
              <MenuIcon />
            </Button>
            <div
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground"
            >
              P
            </div>
            <span className="font-semibold">Parich WMS</span>

            <div className="ml-auto flex items-center gap-2">
              <NotificationBell />
              <Avatar className="size-8">
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1360px] px-6 py-6 pb-24">
          {/* ---------- เส้นทางและหัวเรื่อง ---------- */}
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">ระบบ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">ตรวจรับวัตถุดิบ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>ใบตรวจสอบ</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="mt-2 mb-5 text-2xl font-semibold tracking-tight">
            ใบตรวจสอบรับวัตถุดิบ PO260116/01-01
          </h1>

          {/* ---------- การ์ดข้อมูลใบสั่งซื้อ ---------- */}
          <Card className="mb-6">
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="font-semibold">21-0-0 ฟูเจียนผง</span>
                <Badge tone="neutral" appearance="soft">
                  วัตถุดิบ
                </Badge>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-4"
                />
                <Badge tone="neutral" appearance="outline">
                  Bulk
                </Badge>
                <span className="ml-auto text-sm font-medium">
                  บริษัท เอชซี อินเตอร์เนชั่นแนล เทรดดิ้ง จำกัด
                </span>
              </div>

              {/* แถบสรุปน้ำหนัก — ใช้ --brand ซึ่งเป็นพื้นอ่อนสีแบรนด์ตัวเดียวกับ
                  Alert แบบ brand และกรอบ radio ตอนถูกเลือก */}
              <div className="grid gap-4 rounded-lg border border-primary/30 bg-brand p-4 sm:grid-cols-3">
                <Stat label="ตรวจสอบ (ตัน)" value="800.00" />
                <Stat label="ไม่ผ่าน QC (ตัน)" value="-" />
                <Stat label="เข้าคลัง (ตัน)" value="-" />
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">ผู้รับสินค้า: </span>
                <span className="font-medium">อลิสา พรสุขสิริ</span>
              </div>
            </CardContent>
          </Card>

          {/* ---------- ตรวจสอบขนาดเม็ดปุ๋ย ---------- */}
          <section className="mb-6">
            <SectionHeader
              title="ตรวจสอบขนาดเม็ดปุ๋ย"
              hint="ชั่งน้ำหนักเม็ดปุ๋ยที่ค้างบนตะแกรงแต่ละขนาด ระบบคำนวณสัดส่วนให้อัตโนมัติ"
              summary={
                <>
                  <SummaryStat label="น้ำหนักรวม" value={fmt(sizeTotal)} />
                  <SummaryStat
                    label="% รวม"
                    value={sizeTotal > 0 ? "100.00" : "-"}
                  />
                </>
              }
              onAdd={() => setSizeRows((r) => [...r, emptySize()])}
            />

            <Card className="overflow-hidden py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ครั้ง</TableHead>
                    {SIZE_COLUMNS.map((c) => (
                      <React.Fragment key={c}>
                        <TableHead className="text-right">
                          น้ำหนัก (g)
                          <span className="block font-normal text-muted-foreground">
                            เม็ดปุ๋ย {c}
                          </span>
                        </TableHead>
                        <TableHead className="w-16 text-right">%</TableHead>
                      </React.Fragment>
                    ))}
                    <TableHead>
                      หมายเหตุ{" "}
                      <span className="font-normal text-muted-foreground">
                        (ไม่บังคับ)
                      </span>
                    </TableHead>
                    <TableHead className="w-24 text-center">สถานะ</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sizeRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      {row.weights.map((w, j) => (
                        <React.Fragment key={j}>
                          <TableCell>
                            <NumberCell
                              ariaLabel={`ครั้งที่ ${i + 1} น้ำหนักเม็ดปุ๋ย ${SIZE_COLUMNS[j]}`}
                              value={w}
                              onChange={(v) =>
                                setSizeRows((rows) =>
                                  rows.map((r, ri) =>
                                    ri === i
                                      ? {
                                          ...r,
                                          weights: r.weights.map((x, xi) =>
                                            xi === j ? v : x
                                          ),
                                        }
                                      : r
                                  )
                                )
                              }
                            />
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground tabular-nums">
                            {sizeTotal > 0
                              ? ((num(w) / sizeTotal) * 100).toFixed(1)
                              : "-"}
                          </TableCell>
                        </React.Fragment>
                      ))}
                      <TableCell>
                        <Input
                          aria-label={`หมายเหตุครั้งที่ ${i + 1}`}
                          placeholder="-"
                          value={row.note}
                          onChange={(e) =>
                            setSizeRows((rows) =>
                              rows.map((r, ri) =>
                                ri === i ? { ...r, note: e.target.value } : r
                              )
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <RowStatus filled={row.weights.some((w) => num(w) > 0)} />
                      </TableCell>
                      <TableCell>
                        <RowDelete
                          disabled={sizeRows.length === 1}
                          onClick={() =>
                            setSizeRows((rows) => rows.filter((_, ri) => ri !== i))
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* ---------- ตรวจสอบความแข็งเม็ดปุ๋ย ---------- */}
          <section className="mb-6">
            <SectionHeader
              title="ตรวจสอบความแข็งเม็ดปุ๋ย"
              hint="วัดความแข็ง 5 ครั้งต่อรอบ ระบบหาค่าเฉลี่ยให้อัตโนมัติ"
              summary={
                <SummaryStat label="เฉลี่ยความแข็ง" value={fmt(hardnessAvg)} />
              }
              onAdd={() => setHardRows((r) => [...r, emptyHardness()])}
            />

            <Card className="overflow-hidden py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ครั้ง</TableHead>
                    {HARDNESS_COLUMNS.map((n) => (
                      <TableHead key={n} className="text-right">
                        ค่าความแข็ง
                        <span className="block font-normal text-muted-foreground">
                          ครั้งที่ {n}
                        </span>
                      </TableHead>
                    ))}
                    <TableHead>
                      หมายเหตุ{" "}
                      <span className="font-normal text-muted-foreground">
                        (ไม่บังคับ)
                      </span>
                    </TableHead>
                    <TableHead className="w-24 text-center">สถานะ</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hardRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      {row.values.map((v, j) => (
                        <TableCell key={j}>
                          <NumberCell
                            ariaLabel={`ครั้งที่ ${i + 1} ค่าความแข็งครั้งที่ ${j + 1}`}
                            value={v}
                            onChange={(nv) =>
                              setHardRows((rows) =>
                                rows.map((r, ri) =>
                                  ri === i
                                    ? {
                                        ...r,
                                        values: r.values.map((x, xi) =>
                                          xi === j ? nv : x
                                        ),
                                      }
                                    : r
                                )
                              )
                            }
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <Input
                          aria-label={`หมายเหตุครั้งที่ ${i + 1}`}
                          placeholder="-"
                          value={row.note}
                          onChange={(e) =>
                            setHardRows((rows) =>
                              rows.map((r, ri) =>
                                ri === i ? { ...r, note: e.target.value } : r
                              )
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <RowStatus filled={row.values.some((v) => num(v) > 0)} />
                      </TableCell>
                      <TableCell>
                        <RowDelete
                          disabled={hardRows.length === 1}
                          onClick={() =>
                            setHardRows((rows) => rows.filter((_, ri) => ri !== i))
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* ---------- ตรวจสอบความชื้นเม็ดปุ๋ย ---------- */}
          <section className="mb-6">
            <SectionHeader
              title="ตรวจสอบความชื้นเม็ดปุ๋ย"
              hint="บันทึกค่าความชื้นและน้ำหนักตัวอย่างที่ใช้วัด"
              onAdd={() => setMoistRows((r) => [...r, emptyMoisture()])}
            />

            <Card className="overflow-hidden py-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">ครั้ง</TableHead>
                    <TableHead className="text-right">
                      ค่าความชื้น
                      <span className="block font-normal text-muted-foreground">
                        (%)
                      </span>
                    </TableHead>
                    <TableHead className="text-right">
                      น้ำหนัก
                      <span className="block font-normal text-muted-foreground">
                        (Kg)
                      </span>
                    </TableHead>
                    <TableHead>
                      หมายเหตุ{" "}
                      <span className="font-normal text-muted-foreground">
                        (ไม่บังคับ)
                      </span>
                    </TableHead>
                    <TableHead className="w-24 text-center">สถานะ</TableHead>
                    <TableHead className="w-12" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {moistRows.map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="text-muted-foreground">
                        {i + 1}
                      </TableCell>
                      <TableCell>
                        <NumberCell
                          ariaLabel={`ครั้งที่ ${i + 1} ค่าความชื้น`}
                          value={row.moisture}
                          onChange={(v) =>
                            setMoistRows((rows) =>
                              rows.map((r, ri) =>
                                ri === i ? { ...r, moisture: v } : r
                              )
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <NumberCell
                          ariaLabel={`ครั้งที่ ${i + 1} น้ำหนัก`}
                          value={row.weight}
                          onChange={(v) =>
                            setMoistRows((rows) =>
                              rows.map((r, ri) =>
                                ri === i ? { ...r, weight: v } : r
                              )
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          aria-label={`หมายเหตุครั้งที่ ${i + 1}`}
                          placeholder="-"
                          value={row.note}
                          onChange={(e) =>
                            setMoistRows((rows) =>
                              rows.map((r, ri) =>
                                ri === i ? { ...r, note: e.target.value } : r
                              )
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="text-center">
                        <RowStatus filled={num(row.moisture) > 0} />
                      </TableCell>
                      <TableCell>
                        <RowDelete
                          disabled={moistRows.length === 1}
                          onClick={() =>
                            setMoistRows((rows) =>
                              rows.filter((_, ri) => ri !== i)
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </section>

          {/* ---------- หมายเหตุท้ายใบ ---------- */}
          <div className="space-y-2">
            <Label htmlFor="note">
              หมายเหตุ{" "}
              <span className="font-normal text-muted-foreground">
                (ไม่บังคับ)
              </span>
            </Label>
            <Textarea
              id="note"
              placeholder="ระบุหมายเหตุ"
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </main>

        {/* ---------- แถบปุ่มล่างสุด ---------- */}
        <footer className="fixed inset-x-0 bottom-0 border-t border-border bg-card">
          <div className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-6 py-3">
            <Button variant="outline-primary">ย้อนกลับ</Button>
            <Button>บันทึก</Button>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}

/** ตัวเลขสรุปในแถบด้านบนของการ์ด */
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-sm text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-0.5 text-lg font-semibold tabular-nums",
          value === "-" && "text-muted-foreground"
        )}
      >
        {value}
      </div>
    </div>
  );
}

/** สถานะของแถว — ยังไม่กรอกจะเป็นขีด กรอกแล้วขึ้นป้ายสีเขียว */
function RowStatus({ filled }: { filled: boolean }) {
  if (!filled) return <span className="text-muted-foreground">-</span>;
  return (
    <Badge tone="success" appearance="soft">
      ผ่าน
    </Badge>
  );
}
