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

### 1. ใช้ component จาก `@peckey954/ui/components/ui/*` เสมอ — ห้ามเขียนเอง ถ้ามีอยู่แล้ว

```tsx
// ✅ ถูก
import { Button } from "@peckey954/ui/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@peckey954/ui/components/ui/card";

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
import { MultiSelect, type MultiSelectOption } from "@peckey954/ui/components/ui/multi-select";

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

#### ปุ่มที่มีไอคอน / กำลังโหลด

วางไอคอนเป็นลูกของ `Button` ตรง ๆ จะซ้ายหรือขวาก็ได้ — `Button` จัดขนาด (`size-4`)
และระยะห่าง (`gap-2`) ให้เอง **ห้ามกำหนดขนาดไอคอนเองถ้าไม่จำเป็น**

```tsx
<Button><PlusIcon />เพิ่มรายการ</Button>        {/* ไอคอนซ้าย */}
<Button>ถัดไป<ArrowRightIcon /></Button>        {/* ไอคอนขวา */}
<Button size="icon" aria-label="ค้นหา"><SearchIcon /></Button>  {/* ไอคอนล้วน */}

{/* กำลังโหลด — ใส่ disabled ด้วยเสมอเพื่อกันกดซ้ำ */}
<Button disabled={loading}>
  {loading ? <><Spinner />กำลังบันทึก…</> : "บันทึก"}
</Button>
```

ปุ่มไอคอนล้วน **ต้องมี `aria-label`** เพราะไม่มีข้อความให้ screen reader อ่าน

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

#### ปุ่มที่อยู่ใน input-group

`InputGroup` มีขอบ 1px สี `border-input` อยู่แล้ว **ห้ามใช้ปุ่ม `variant="outline"` ข้างใน**
เพราะปุ่มจะมีขอบสีเดียวกันอีกเส้น ห่างจากขอบกลุ่มแค่ ~5px กลายเป็นเส้นคู่ขนานที่ดูเพี้ยน

```tsx
// ✅ ปุ่มไอคอน — ghost (ค่าเริ่มต้นของ InputGroupButton) ไม่มีขอบ
<InputGroupAddon align="inline-end">
  <InputGroupButton size="icon-xs" aria-label="คัดลอกลิงก์">
    <CopyIcon />
  </InputGroupButton>
</InputGroupAddon>

// ✅ ปุ่มข้อความ — secondary พื้นทึบ ไม่มีขอบ ใช้ขนาดเริ่มต้น (ไม่ต้องใส่ size)
<InputGroupButton variant="secondary">ใช้โค้ด</InputGroupButton>

// ❌ outline — ขอบซ้อนกับขอบของ InputGroup
<InputGroupButton variant="outline">ใช้โค้ด</InputGroupButton>

// ❌ size="sm" — สูง 32px และ rounded-md เท่ากับกรอบพอดี เห็นเป็นมุมโค้งซ้อนกัน
<InputGroupButton variant="secondary" size="sm">ใช้โค้ด</InputGroupButton>
```

`size` ของ `InputGroupButton` รับเฉพาะ `xs` `sm` `icon-xs` `icon-sm` (คนละชุดกับ `Button`)
และ **ปกติไม่ต้องส่ง `size` เลย** ค่าเริ่มต้น `xs` ถูกออกแบบมาให้พอดีกับกรอบอยู่แล้ว:

| size | ความสูง | มุมโค้ง | ผลลัพธ์ |
|---|---|---|---|
| `xs` (ค่าเริ่มต้น) | 24px | `--radius` − 5px = 5px | ซ้อนในกรอบพอดี ✅ |
| `sm` | 32px | `rounded-md` = 8px | เท่ากับกรอบ ดูเป็นกรอบซ้อนกรอบ ❌ |

ใช้ `icon-xs` สำหรับปุ่มไอคอนล้วน (24×24)

#### ข้อความในแอปตัวอย่าง ต้องมีทั้งไทยและอังกฤษ

แอปตัวอย่างสลับภาษาได้ (TH / EN) **ห้ามเขียนข้อความตรง ๆ ลงใน JSX**
ประกาศคำแปลไว้บนสุดของไฟล์เดียวกันด้วย `defineCopy` แล้วหยิบด้วย `useCopy`

```tsx
import { defineCopy, useCopy } from "@/lib/i18n";

const COPY = defineCopy({
  th: { save: "บันทึก", cancel: "ยกเลิก" },
  en: { save: "Save", cancel: "Cancel" },   // ขาดคีย์ไหน tsc ฟ้องทันที
});

export function Example() {
  const c = useCopy(COPY);
  return <Button>{c.save}</Button>;
}
```

- ข้อความส่วนกลาง (เมนู · หัวข้อหมวด) อยู่ใน `apps/web/lib/i18n.ts` ใช้ผ่าน `useT()`
- วันที่/ตัวเลข ให้ดึง locale ด้วย `useLocale()` แล้วส่งเข้า `toLocaleDateString` /
  `toLocaleString` — อย่า hardcode `"th-TH"`
- `aria-label` และ `placeholder` ก็ต้องแปลด้วย ไม่ใช่แค่ข้อความที่มองเห็น

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
| ตอน hover | `bg-primary-hover` `bg-secondary-hover` `bg-accent-hover` `bg-destructive-hover` |
| เส้น/ช่องกรอก | `border-border` `bg-input` `ring-ring` |
| กราฟ | `bg-chart-1` … `bg-chart-5` |
| sidebar | `bg-sidebar` `text-sidebar-foreground` `bg-sidebar-primary` `bg-sidebar-accent` `border-sidebar-border` `ring-sidebar-ring` (+ `-foreground` คู่ของแต่ละตัว) |
| มุมโค้ง | `rounded-sm` `rounded-md` `rounded-lg` `rounded-xl` (ผูกกับ `--radius`) |
| ฟอนต์ | `font-sans` |

ถ้าต้องการสีที่ไม่มีใน token → **เพิ่ม token ใหม่** (ดูข้อ 4) ไม่ใช่ hardcode

#### แบรนด์ = สีล้วน · ที่เหลือเป็นแกนสไตล์

**ไฟล์แบรนด์เก็บแค่สี** ไม่มี `--radius` ไม่มี `--font-sans` แล้ว เพราะสองอย่างนั้น
มีแกนของตัวเองอยู่แล้ว การเก็บไว้ในไฟล์แบรนด์ทำให้ "เลือกสี" ไปเปลี่ยนความโค้ง
กับฟอนต์ด้วยโดยไม่ตั้งใจ ค่าเริ่มต้นย้ายไปอยู่ใน `:root` ของ `styles.css` ที่เดียว

นอกจากแบรนด์และโหมดสว่างมืด ยังปรับได้อีก 4 แกน **โดยไม่ต้องแตะโค้ด component**

```html
<html data-brand="parich" data-tint="pure" data-font="sarabun"
      data-radius="pill" data-density="compact" class="dark">
```

| แกน | ค่า | ผลที่ได้ |
|---|---|---|
| `data-tint` | `pure` · `blend` | สีกลางผสมสีแบรนด์ ไม่ผสม · ผสม |
| `data-font` | `ibm` · `prompt` · `sarabun` | IBM Plex Sans Thai · Prompt · Sarabun |
| `data-radius` | `sharp` · `standard` · `friendly` · `pill` | ปุ่ม 0px · 8px · 14px · แคปซูล |
| `data-density` | `compact` · `standard` · `comfortable` | ปุ่มสูง 32px · 36px · 45px |

**ไม่ใส่ attribute = ใช้ค่าเริ่มต้นใน `:root`** ทุกแกนเป็นของเสริม ไม่บังคับ

`--font-*` ที่แกนฟอนต์อ้างถึงมาจาก `next/font` ในแอปที่ใช้งาน ไม่ได้มาจากแพ็กเกจนี้
โปรเจกต์ที่ไม่ได้ตั้งไว้จะตกไปใช้ `ui-sans-serif` ตามลำดับในสแตกเอง

`data-radius` กับ `data-density` ทำงานด้วยการเขียนทับตัวแปรเดียว — `--radius`
และ `--spacing` ของ Tailwind v4 ซึ่งทุก utility คำนวณต่อจากมัน
(`.p-4` → `calc(var(--spacing) * 4)`)

**`data-tint` แตะเฉพาะ "สีกลาง"** (พื้นหลัง การ์ด เส้นขอบ ตัวอักษร) เท่านั้น
ไม่แตะ `--primary` `--destructive` `--chart-*` เลย สีแบรนด์ยังเป็นสีแบรนด์เหมือนเดิม

- `pure` เขียนค่าเทาแท้ตรง ๆ จึงเหมือนกันทุกแบรนด์
- `blend` ใช้ `color-mix()` กับ `var(--primary)` ซึ่งคลี่เป็นสีของแบรนด์ที่ใช้อยู่
  **กฎชุดเดียวจึงครอบคลุมทุกแบรนด์ เพิ่มแบรนด์ใหม่ไม่ต้องมาแก้ `tint.css`**

ทั้งสองใช้สเกลฐานเดียวกัน ต่างแค่สัดส่วนที่ผสม
(วัดค่าต่าง R-G-B ของสีพื้น: `pure` 0 · `blend` 7-14)

**ถ้าไม่ใส่ `data-tint` เลยจะได้สีกลางของแบรนด์ตามที่ไฟล์แบรนด์เขียนไว้** ซึ่งแต่ละ
แบรนด์จูนด้วยมือ ไม่เท่ากัน — siam โหมดมืดผสม 19 แต่ parich โหมดมืดผสมแค่ 6
และโหมดสว่างทุกแบรนด์แทบไม่ผสมเลย **ถ้าต้องการระดับที่แน่นอน ให้ใส่ `data-tint` เสมอ**

ค่าอยู่ที่ `packages/tokens/src/tint.css` ต้อง `@import` **หลัง** ไฟล์แบรนด์
และ selector ต้องขึ้นต้นด้วย `html` เพื่อให้ specificity ชนะไฟล์แบรนด์
(`html[data-tint="pure"]` = 0,1,1 ชนะ `[data-brand="siam"]` = 0,1,0)

**`tint.css` ไม่เข้า Figma** เพราะ `color-mix()` แปลงเป็น hex ตายตัวไม่ได้
`scripts/build-figma-tokens.mjs` จึงข้ามไฟล์นี้ไว้ใน `NOT_BRAND_FILES`

**สิ่งที่ต้องระวังเวลาเขียน component ใหม่**

- **ห้ามใส่ขนาดเป็นค่าตายตัวปนกับค่าที่ scale** เช่น `h-[1.15rem]` คู่กับ `size-4`
  ตัวหนึ่งจะ scale อีกตัวไม่ scale พอเปลี่ยนความห่างแล้วจะล้นออกจากกัน
  (เคยเกิดกับ `switch` มาแล้ว — รางสูงตายตัวแต่ปุ่มกลมข้างในโตตาม)
- ใช้ระดับของ Tailwind (`h-5`, `size-4`, `px-3`) ให้หมด อย่าใช้ `[...]` กับขนาด
- ไอคอนใช้ `size-4` จะย่อขยายตามความห่างด้วย **เป็นพฤติกรรมที่ตั้งใจ**
  อย่าไปล็อกขนาดไอคอนไว้ ไม่งั้นปุ่มแบบแน่นจะมีไอคอนเทอะทะ

ลองของจริงได้ที่หน้า `/styles` ของแอปตัวอย่าง

#### สถานะ hover ของพื้นผิวที่มีสี

**ห้ามทำ hover ด้วยการลด opacity** (`hover:bg-primary/90`, `hover:bg-secondary/80`)
บนพื้นหลังสว่าง การลด opacity ทำให้สี **จางลง** ไม่ใช่เข้มขึ้น ผู้ใช้จะรู้สึกว่า
ปุ่มไม่ตอบสนอง — ยิ่งถ้าแบรนด์ไหนตั้ง `--secondary` ไว้สว่างมาก จะแทบมองไม่เห็นเลย

```tsx
// ✅ ใช้ token คู่ hover
<button className="bg-secondary hover:bg-secondary-hover">
<button className="bg-primary hover:bg-primary-hover">

// ❌ ลด opacity
<button className="bg-secondary hover:bg-secondary/80">
```

ค่าของ token คู่นี้กำหนดไว้ต่อแบรนด์แล้ว — โหมดสว่างจะ **เข้มขึ้น** (ลดค่า L)
โหมดมืดจะ **สว่างขึ้น** เพื่อให้เด่นขึ้นเหมือนกัน ตัวที่มีให้คือ
`--primary-hover` `--secondary-hover` `--accent-hover` `--destructive-hover`

#### Alert แบบมีสีพื้น

`Alert` มี 4 variant — `default` `warning` `brand` `destructive`

```tsx
<Alert variant="warning">
  <TriangleAlertIcon />
  <AlertTitle>แพ็กเกจของคุณจะหมดอายุใน 3 วัน</AlertTitle>
  <AlertDescription>ต่ออายุตอนนี้เพื่อไม่ให้บริการสะดุด</AlertDescription>
</Alert>
```

**ห้ามลอกวิธีของหน้า docs ของ shadcn** ที่เขียนแบบนี้ — มันผิดกฎข้อ 2

```tsx
// ❌ hardcode สี + ต้องเขียน dark: เอง + ไม่เปลี่ยนตามแบรนด์
<Alert className="border-amber-200 bg-amber-50 text-amber-900
                  dark:border-amber-900 dark:bg-amber-950 dark:text-amber-50" />
```

**ทุก variant ใช้ token พื้นทึบของตัวเอง ห้ามใช้สีจางทับพื้น** (`bg-primary/10`)
มีเหตุผลสองข้อ

1. สีจางทับพื้นขาวให้ผลเพี้ยน — เหลืองจะกลายเป็นเบจอมน้ำตาล ไม่ใช่เหลืองสด
2. **Figma ผูก opacity ไว้กับ variable ไม่ได้** ถ้าใช้สีจาง คนออกแบบต้องมาตั้ง
   opacity เองทุกครั้ง และต้องตั้งคนละค่าในโหมดสว่าง/มืด ซึ่ง Figma สลับให้ไม่ได้
   ทำให้ไฟล์ Figma กับโค้ดหลุดจากกันแน่นอน

ผลพลอยได้คือไม่มี variant ไหนต้องใช้ `dark:` เลย ตรงตามกฎข้อ 5 เต็มรูปแบบ

**ค่า `--brand` ต้องเท่ากับสถานะ "ถูกเลือก" ของกรอบ radio/checkbox** (`FieldLabel`
ใน `field.tsx` ซึ่งใช้ `bg-primary/5 dark:bg-primary/10`) เพื่อให้ผู้ใช้เห็นว่า
"สีนี้ = สีของแบรนด์" เป็นสีเดียวกันทั้งระบบ — **ถ้าแก้ที่ใดที่หนึ่งต้องแก้อีกที่ด้วย**

**ห้ามบังคับสีไอคอนเป็นสีสด** เช่น `[&>svg]:text-warning` — ไอคอนต้องรับสีจาก
ตัวอักษร (base มี `[&>svg]:text-current` ให้แล้ว) สีสดพวกนั้นออกแบบมาสำหรับ
วางบนพื้นทึบ พอเอามาวางบนพื้นจางจะได้คอนทราสต์แค่ 2.36–2.95 ต่ำกว่าเกณฑ์ 3:1
ของกราฟิก (วัดจริงมาแล้ว) — ตัวอย่างของ shadcn เองก็ใช้ไอคอนสีเดียวกับหัวข้อ

token ที่เกี่ยวข้อง มีให้ทุกแบรนด์ทั้งสองโหมด

| variant | พื้น | ตัวอักษร | เส้นขอบ |
|---|---|---|---|
| `default` | `--card` | `--card-foreground` | `--border` |
| `warning` | `--warning` | `--warning-foreground` | `--warning-border` |
| `brand` | `--brand` | `--foreground` | `--primary` |
| `destructive` | `--danger` | `--danger-foreground` | `--danger-border` |

`--warning*` ตรงกับ `amber-50` / `amber-900` / `amber-200` ของ Tailwind เป๊ะ
โหมดมืดสลับหัวท้ายเป็น `amber-950` / `amber-50` / `amber-900`

**ชื่อ `--danger` ไม่ตรงกับ variant `destructive` โดยตั้งใจ** เพราะ `--destructive`
ถูกจองไว้ให้ปุ่มพื้นทึบแล้ว ถ้าเอามาใช้ซ้ำจะสับสนว่าอันไหนพื้นทึบอันไหนพื้นอ่อน

`--destructive-foreground` เป็นสีขาวสำหรับพื้นทึบ (ปุ่มลบ) **ใช้กับ Alert ไม่ได้**

### 3. ต่อ className ด้วย `cn()` จาก `@peckey954/ui/lib/utils`

```tsx
import { cn } from "@peckey954/ui/lib/utils";

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
  `@import` ใน `apps/web/app/globals.css`, เพิ่ม 1 บรรทัดใน `BRANDS` ที่ `apps/web/components/providers.tsx`

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
- [ ] component ที่ใช้ import จาก `@peckey954/ui/components/ui/*` ไม่ใช่เขียนเอง
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
