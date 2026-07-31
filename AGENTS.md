# AGENTS.md — กฎการเขียน UI ในโปรเจกต์นี้

เอกสารนี้คือกฎบังคับสำหรับ AI agent ทุกตัว (Claude Code, Cursor, Copilot, Codex ฯลฯ)
ที่เข้ามาแก้โค้ดใน repo นี้ **อ่านให้จบก่อนเขียนโค้ด UI ทุกครั้ง**

เป้าหมาย: ทุกหน้าจอที่ AI สร้าง ต้องหน้าตาตรงกับ design system เดียวกัน
และสลับแบรนด์ / dark-light ได้โดยไม่ต้องแก้ component

---

## โครงสร้าง (แยก "โครงสร้าง" ออกจาก "แบรนด์")

```
packages/ui      → component + คำศัพท์กลาง (ใช้ทุกแอป ทุกแบรนด์) — ห้ามใส่สีจริง
packages/tokens  → ค่าจริงของแต่ละแบรนด์ (สี, ฟอนต์, radius) — 1 แบรนด์ = 1 ไฟล์
apps/web         → แอปตัวอย่าง สลับแบรนด์ + สว่าง/มืดได้จริง
```

Stack: Next.js 15 · React 19 · Tailwind CSS v4 · shadcn (new-york) · Radix UI · next-themes · Turborepo · pnpm

---

## กฎ 6 ข้อ (ห้ามฝ่าฝืน)

### 1. ใช้ component จาก `@repo/ui/components/ui/*` เสมอ — ห้ามเขียนเอง ถ้ามีอยู่แล้ว

```tsx
// ✅ ถูก
import { Button } from "@repo/ui/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@repo/ui/components/ui/card";

// ❌ ผิด — เขียนปุ่มเองทั้งที่มี Button อยู่แล้ว
<button className="rounded-md px-4 py-2 ...">บันทึก</button>
```

ก่อนสร้าง component ใหม่ **ต้องเช็คก่อน** ว่ามีของเดิมอยู่ไหม:

```bash
ls packages/ui/src/components/ui
```

ปัจจุบันมี **55 ตัว** — 54 ตัวจาก shadcn:
accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button,
button-group, calendar, card, carousel, chart, checkbox, collapsible, command,
context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card,
input, input-group, input-otp, item, kbd, label, menubar, native-select,
navigation-menu, pagination, popover, progress, radio-group, resizable,
scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner,
spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip

และอีก 1 ตัวที่ประกอบขึ้นเองในโปรเจกต์นี้ (ไม่มีใน registry ของ shadcn):
**multi-select** — ดรอปดาวน์เลือกหลายรายการ พร้อมช่องค้นหา · แถวเลือกทั้งหมด · chip
ของรายการที่เลือก ประกอบจาก popover + command + checkbox + badge

```tsx
import { MultiSelect, type MultiSelectOption } from "@repo/ui/components/ui/multi-select";

const options: MultiSelectOption[] = [
  {
    value: "lot-1",                       // ต้องไม่ซ้ำ
    label: "PD260116/01-04",              // ข้อความบนแถวและบน chip
    badge: "A-9M",                        // ป้ายเล็กหน้าข้อความ (ไม่บังคับ)
    description: "รับ 5/14/2026 · 500 ชิ้น", // บรรทัดคำอธิบาย (ไม่บังคับ)
    meta: <span className="font-semibold">80 ตัน</span>, // ชิดขวา (ไม่บังคับ)
    keywords: ["A-9M"],                   // คำค้นเพิ่มเติม (ไม่บังคับ)
    disabled: false,
  },
];

<MultiSelect
  options={options}
  value={value}                 // ไม่ส่ง = uncontrolled (ใช้ defaultValue)
  onValueChange={setValue}
  placeholder="เลือก Lot"
  searchPlaceholder="ค้นหา"
  selectAllLabel="เลือกทั้งหมด"
  maxChips={2}                  // เกินกำหนดยุบเป็น +n
  hideSelectAll                 // ซ่อนแถวเลือกทั้งหมด
  hideCount                     // ซ่อนตัวเลขจำนวนมุมขวา
/>
```

> "เลือกทั้งหมด" ทำงานกับ **ผลค้นหาปัจจุบัน** ไม่ใช่ทุกรายการ และข้าม option ที่ `disabled`

ถ้าไม่มีจริง ๆ ให้ประกอบจากของที่มีก่อน (compose) แล้วค่อยพิจารณาสร้างใหม่
component ที่ประกอบขึ้นเองก็ต้องวางไว้ที่ `packages/ui/src/components/ui/` และทำตามกฎทุกข้อเหมือนกัน

#### checkbox / radio แบบมีกรอบครอบ (box)

ไม่มี component แยก — ประกอบด้วย `Field` + `FieldLabel` ที่มีอยู่แล้ว
**ค่าเริ่มต้นคือวางปุ่มไว้ซ้ายเสมอ** แล้วตามด้วย `FieldContent`

```tsx
<FieldLabel htmlFor="plan-std">
  <Field orientation="horizontal">
    <Checkbox id="plan-std" />            {/* ปุ่มอยู่ซ้าย = ค่าเริ่มต้น */}
    <FieldContent>
      <FieldTitle>แผนมาตรฐาน</FieldTitle>
      <FieldDescription>ผู้ใช้ 5 คน · พื้นที่ 20 GB</FieldDescription>
    </FieldContent>
  </Field>
</FieldLabel>
```

- ใช้กับ `RadioGroupItem` ได้เหมือนกัน (ครอบด้วย `RadioGroup` อีกชั้น)
- `FieldLabel` จัดการกรอบ · การไฮไลต์เมื่อติ๊ก · สถานะปิดใช้งาน ให้เองทั้งหมด
  ไม่ต้องใส่ border/สี/opacity เพิ่ม
- จะย้ายปุ่มไปขวาก็ได้โดยสลับลำดับ แต่ต้องมีเหตุผลเฉพาะหน้านั้น ไม่ใช่ค่าเริ่มต้น

### 2. ใช้ token เท่านั้น — ห้าม hardcode สี

ใช้ชื่อกลางเสมอ ห้ามใส่ค่าสีจริงลงใน component:

```tsx
// ✅ ถูก
<div className="bg-card text-card-foreground border-border">
<p className="text-muted-foreground">คำอธิบาย</p>
<Button className="bg-primary text-primary-foreground">ยืนยัน</Button>

// ❌ ผิดทุกแบบ
className="bg-blue-500"          // สี Tailwind ตรง ๆ
className="text-[#1a2b3c]"       // hex
className="bg-[rgb(20,30,40)]"   // arbitrary value ที่เป็นสี
style={{ color: "#333" }}        // inline style สี
```

**token ที่ใช้ได้** (ประกาศใน `packages/ui/src/styles/globals.css`):

| กลุ่ม | class ที่ใช้ |
|---|---|
| พื้น/ตัวอักษร | `bg-background` `text-foreground` |
| การ์ด | `bg-card` `text-card-foreground` |
| popover | `bg-popover` `text-popover-foreground` |
| หลัก | `bg-primary` `text-primary-foreground` |
| รอง | `bg-secondary` `text-secondary-foreground` |
| จาง | `bg-muted` `text-muted-foreground` |
| เน้น | `bg-accent` `text-accent-foreground` |
| อันตราย | `bg-destructive` `text-destructive-foreground` |
| เส้น/ช่องกรอก | `border-border` `bg-input` `ring-ring` |
| กราฟ | `bg-chart-1` … `bg-chart-5` |
| sidebar | `bg-sidebar` `text-sidebar-foreground` `bg-sidebar-primary` `bg-sidebar-accent` `border-sidebar-border` `ring-sidebar-ring` (+ `-foreground` คู่ของแต่ละตัว) |
| มุมโค้ง | `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` (ผูกกับ `--radius`) |
| ฟอนต์ | `font-sans` |

ถ้าต้องการสีที่ไม่มีใน token → **เพิ่ม token ใหม่** (ดูข้อ 4) ไม่ใช่ hardcode

### 3. ต่อ className ด้วย `cn()` จาก `@repo/ui/lib/utils`

```tsx
import { cn } from "@repo/ui/lib/utils";

// ✅ ถูก
<div className={cn("rounded-lg border p-4", isActive && "bg-accent", className)} />

// ❌ ผิด — string ต่อกันเอง / template literal
<div className={`rounded-lg border p-4 ${className}`} />
```

`cn()` = `clsx` + `tailwind-merge` ทำให้ class ที่ชนกันถูก override ถูกลำดับ
component ที่รับ prop `className` ต้องส่งผ่าน `cn()` เสมอ

### 4. เปลี่ยนสี / ฟอนต์ → แก้ที่ `packages/tokens/src/<brand>.css` เท่านั้น

**ห้ามแก้สีในตัว component เด็ดขาด**

```
packages/tokens/src/siam.css   → [data-brand="siam"]  = light
                                 [data-brand="siam"].dark = dark
packages/tokens/src/nara.css   → [data-brand="nara"]  / .dark
```

- เปลี่ยนฟอนต์: โหลดใน `apps/web/app/layout.tsx` ด้วย `next/font/google`
  (ต้องมี `subsets: ["thai", "latin"]`) ตั้ง `variable` แล้วชี้ `--font-sans` ของแบรนด์ไปที่ variable นั้น
  ปัจจุบัน Siam ใช้ `IBM Plex Sans Thai`, Nara ใช้ `Prompt`
- เพิ่ม token ใหม่: ต้องเพิ่ม **ครบทั้ง 3 ที่**
  1. ค่าจริงในไฟล์แบรนด์ทุกไฟล์ (ทั้งบล็อก light และ `.dark`)
  2. แมปชื่อใน `@theme inline` ที่ `packages/ui/src/styles/globals.css`
  3. ใช้งานผ่านชื่อ class กลางใน component
- เพิ่มแบรนด์ใหม่: copy `siam.css` → `brandx.css`, เปลี่ยน selector เป็น `[data-brand="brandx"]`,
  `@import` ใน `apps/web/app/globals.css`, เพิ่มปุ่มใน `apps/web/components/brand-switcher.tsx`

### 5. dark / light จัดการด้วย token — เขียนสีชุดเดียวพอ

token ตัวเดียวกันมีค่าคนละค่าใน light กับ dark อยู่แล้ว
เขียน `bg-card text-card-foreground` ครั้งเดียว ได้ถูกทั้งสองโหมด

```tsx
// ✅ ถูก
<div className="bg-card text-card-foreground border-border">

// ❌ ผิด — เขียนสองชุด
<div className="bg-white dark:bg-slate-900 text-black dark:text-white">
```

ใช้ `dark:` ได้เฉพาะกรณีที่ token แก้ให้ไม่ได้จริง ๆ (เช่น ปรับ opacity/shadow) — ไม่ใช่กับสี

### 6. เพิ่ม component ใหม่ด้วย shadcn CLI

```bash
cd apps/web
pnpm dlx shadcn@latest add <name>
```

`components.json` ตั้งค่าไว้แล้วให้ component ถูกวางลง `packages/ui` อัตโนมัติ
**ห้าม copy โค้ด component จากที่อื่นมาวางเอง** — จะหลุด convention และ token

ถ้าเป็น component ที่ไม่มีใน registry (เช่น multi-select) ให้เขียนเองใน
`packages/ui/src/components/ui/<name>.tsx` โดยประกอบจาก primitive ที่มีอยู่แล้ว
ไม่ลง dependency ใหม่ถ้าเลี่ยงได้ และทำตามกฎข้อ 1–5 ทุกข้อ

---

## เช็คลิสต์ก่อนส่งงาน

- [ ] ไม่มี `#hex`, `rgb(`, `hsl(` หรือสี Tailwind (`bg-blue-500`, `text-gray-700`) ในโค้ด component
- [ ] ไม่มี arbitrary color `bg-[...]` / `text-[...]`
- [ ] ทุก className ที่ต่อกันแบบมีเงื่อนไข ใช้ `cn()`
- [ ] component ที่ใช้ import จาก `@repo/ui/components/ui/*` ไม่ใช่เขียนเอง
- [ ] สลับ Siam ↔ Nara และ light ↔ dark แล้วหน้าตายังถูกต้อง

ตรวจเร็ว ๆ ด้วย:

```bash
grep -rnE "#[0-9a-fA-F]{3,8}\b|bg-(red|blue|green|gray|slate|zinc|neutral|stone|amber|yellow|lime|emerald|teal|cyan|sky|indigo|violet|purple|fuchsia|pink|rose)-[0-9]{2,3}" \
  apps/web packages/ui/src/components --include="*.tsx"
```

ผลลัพธ์ควรว่าง — ยกเว้นบรรทัดเดียวใน `packages/ui/src/components/ui/chart.tsx`
ที่ใช้ `[stroke='#ccc']` / `[stroke='#fff']` เป็น **attribute selector** จับค่า default ของ recharts
เพื่อ override ให้กลับมาเป็น token (`stroke-border`, `stroke-transparent`) — อันนี้ถูกต้องแล้ว ไม่ต้องแก้

---

## คำสั่งที่ใช้บ่อย

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build
pnpm lint
```

## ไฟล์อ้างอิง

- [README.md](README.md) — ภาพรวมโปรเจกต์ + วิธี sync กับ Figma
- [packages/ui/src/styles/globals.css](packages/ui/src/styles/globals.css) — รายชื่อ token กลางทั้งหมด
- [packages/tokens/src/siam.css](packages/tokens/src/siam.css) — ตัวอย่างค่าจริงของแบรนด์
- [apps/web/app/layout.tsx](apps/web/app/layout.tsx) — การโหลดฟอนต์ + `data-brand`
