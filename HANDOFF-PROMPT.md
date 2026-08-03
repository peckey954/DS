# Prompt สำหรับส่งต่อ DS นี้ให้ Claude ตัวอื่น

ไฟล์นี้ไม่ใช่กฎ — เป็น **ข้อความสำเร็จรูปไว้ก๊อปวาง** ให้ Claude account อื่น
(หรือ Cursor / Copilot / Codex) ยึด design system นี้เวลาทำงาน

กฎตัวจริงอยู่ที่ [AGENTS.md](AGENTS.md) · เรื่อง Figma อยู่ที่ [FIGMA-PLAN.md](FIGMA-PLAN.md)
ถ้าแก้กฎ ให้แก้ที่นั่น แล้วค่อยกลับมาอัปเดตบล็อก "แบบออฟไลน์" ข้างล่างให้ตรงกัน

เลือกใช้แบบเดียวก็พอ:

| แบบ | ใช้เมื่อ | ข้อดี |
|---|---|---|
| **1. ชี้ไปที่ repo** | เครื่องนั้นต่อเน็ตได้ / มี WebFetch | สั้น และได้ของจริงเสมอ ไม่มีวันหลุด version |
| **2. แปะกฎไปทั้งก้อน** | แชทเปล่า ๆ ไม่มีเครื่องมือดึงไฟล์ | ไม่ต้องพึ่งเน็ต แต่ต้องมาอัปเดตเองเวลากฎเปลี่ยน |
| **3. เพิ่มส่วน Figma** | ให้มันวาดใน Figma ด้วย | ต่อท้ายแบบ 1 หรือ 2 |

---

## แบบที่ 1 — ชี้ไปที่ repo (แนะนำ)

repo เป็น public อยู่แล้ว อีกฝั่งอ่านได้เลยโดยไม่ต้องขอสิทธิ์

````text
ผมมี design system อยู่ที่ https://github.com/peckey954/DS
งาน UI ทุกชิ้นที่คุณทำให้ผม ต้องยึดตาม DS ตัวนี้เท่านั้น

ก่อนเขียนโค้ด UI ทุกครั้ง ให้อ่าน 2 ไฟล์นี้ให้จบก่อน:
1. https://raw.githubusercontent.com/peckey954/DS/main/AGENTS.md   ← กฎบังคับ อ่านให้ครบ
2. https://raw.githubusercontent.com/peckey954/DS/main/packages/ui/src/styles/globals.css   ← รายชื่อ token ที่ใช้ได้จริง

ถ้าต้องดูโค้ดจริงของ component ตัวไหน อ่านที่
https://raw.githubusercontent.com/peckey954/DS/main/packages/ui/src/components/ui/<ชื่อ>.tsx
(ดูรายชื่อทั้งหมดได้ที่ https://github.com/peckey954/DS/tree/main/packages/ui/src/components/ui)

สรุปสั้น ๆ ว่าต้องยึดอะไร:
- import component จาก @peckey954/ui/components/ui/* เสมอ มี 55 ตัว ห้ามเขียนเองถ้ามีอยู่แล้ว
- ใช้ token เท่านั้น (bg-primary, text-foreground, bg-muted, border-border,
  text-muted-foreground …) ห้าม #hex ห้าม bg-blue-500 ห้าม bg-[...]
- ต่อ className ด้วย cn() จาก @peckey954/ui/lib/utils
- dark/light จัดการด้วย token เขียนสีชุดเดียวพอ ไม่ต้องเขียน dark: คู่กับสี
- จะเปลี่ยนสี/ฟอนต์ ให้แก้ที่ packages/tokens/src/<brand>.css ห้ามแก้ในตัว component

ถ้าอ่านไฟล์ไม่ได้ ให้บอกผมก่อน อย่าเดากฎเอาเอง
ทุกครั้งที่จะฝ่ากฎข้อไหน ให้ถามผมก่อน อย่าตัดสินใจเอง
````

---

## แบบที่ 2 — แปะกฎไปทั้งก้อน (ไม่ต้องต่อเน็ต)

ก้อนนี้ย่อจาก AGENTS.md เอาเฉพาะที่ต้องรู้จริง ๆ ตอนเขียนงาน

````text
คุณกำลังทำงาน UI ภายใต้ design system ของผม ยึดกฎข้างล่างนี้ทุกข้อ
ถ้าจะฝ่ากฎข้อไหน ให้ถามก่อน อย่าตัดสินใจเอง

## Stack
Next.js 15 · React 19 · Tailwind CSS v4 · shadcn (new-york) · Radix UI · next-themes
โครง: packages/ui = component กลาง (ห้ามมีสีจริง) · packages/tokens = ค่าสีของแต่ละแบรนด์

## กฎ 6 ข้อ

1) ใช้ component จาก @peckey954/ui/components/ui/* เสมอ ห้ามเขียนเองถ้ามีอยู่แล้ว (มี 55 ตัว)
   accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button,
   button-group, calendar, card, carousel, chart, checkbox, collapsible, command,
   context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card,
   input, input-group, input-otp, item, kbd, label, menubar, multi-select,
   native-select, navigation-menu, pagination, popover, progress, radio-group,
   resizable, scroll-area, select, separator, sheet, sidebar, skeleton, slider,
   sonner, spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip
   ถ้าไม่มีจริง ๆ ให้ประกอบจากของที่มีก่อน (compose) อย่าเพิ่งสร้างใหม่

2) ใช้ token เท่านั้น ห้าม hardcode สี
   ใช้ได้: bg-background/text-foreground · bg-card/text-card-foreground ·
   bg-popover/text-popover-foreground · bg-primary/text-primary-foreground ·
   bg-secondary · bg-muted/text-muted-foreground · bg-accent ·
   bg-destructive/text-destructive-foreground · border-border · bg-input · ring-ring ·
   bg-chart-1..5 · bg-sidebar* · rounded-sm/md/lg/xl · font-sans
   hover ของพื้นผิวมีสีให้ใช้คู่ token: bg-primary-hover, bg-secondary-hover,
   bg-accent-hover, bg-destructive-hover — ห้าม hover ด้วยการลด opacity (bg-primary/90)
   เพราะบนพื้นสว่างมันจะจางลง ไม่ใช่เข้มขึ้น ผู้ใช้จะรู้สึกว่าปุ่มไม่ตอบสนอง
   ห้าม: #hex · bg-blue-500 · text-[#1a2b3c] · bg-[rgb(...)] · style={{color:"#333"}}
   ถ้าต้องการสีที่ไม่มีใน token ให้เพิ่ม token ใหม่ ไม่ใช่ hardcode

3) ต่อ className ด้วย cn() จาก @peckey954/ui/lib/utils เสมอ (clsx + tailwind-merge)
   ห้ามต่อ string เองหรือใช้ template literal

4) เปลี่ยนสี/ฟอนต์ ให้แก้ที่ packages/tokens/src/<brand>.css เท่านั้น
   ห้ามแก้สีในตัว component เด็ดขาด
   เพิ่ม token ใหม่ต้องเพิ่มครบ 3 ที่: ค่าจริงในไฟล์แบรนด์ทุกไฟล์ (ทั้ง light และ .dark) →
   แมปชื่อใน @theme inline ที่ packages/ui/src/styles/globals.css → ใช้ผ่าน class กลาง

5) dark/light จัดการด้วย token เขียนสีชุดเดียวพอ
   ✅ <div className="bg-card text-card-foreground border-border">
   ❌ <div className="bg-white dark:bg-slate-900 text-black dark:text-white">
   ใช้ dark: ได้เฉพาะกรณีที่ token แก้ให้ไม่ได้จริง ๆ (opacity/shadow) ไม่ใช่กับสี

6) เพิ่ม component ใหม่ด้วย `cd apps/web && pnpm dlx shadcn@latest add <name>`
   ห้าม copy โค้ด component จากที่อื่นมาวางเอง

## แกนสไตล์ — ปรับได้โดยไม่ต้องแตะ component
<html data-brand="parich" data-tint="pure" data-font="sarabun"
      data-radius="standard" data-density="standard" class="dark">
  data-brand   blue · green · parich
  data-tint    pure (เทาแท้) · blend (สีกลางผสมสีแบรนด์)
  data-font    ibm · prompt · sarabun
  data-radius  sharp 0px · standard 8px · friendly 14px · pill
  data-density compact 32px · standard 36px · comfortable 45px
ไม่ใส่ attribute = ใช้ค่าเริ่มต้นใน :root

## ไอคอน — ห้ามกำหนดสีเอง
ไอคอน Lucide วาดด้วย stroke="currentColor" รับสีจากตัวอักษรของปุ่มมาเองอยู่แล้ว
เขียน text-white / stroke-black ทับ = ตัดไอคอนออกจากระบบสี พอเปลี่ยน variant
หรือแบรนด์แล้วไอคอนจะไม่เปลี่ยนตาม
วางไอคอนเป็นลูกของ Button ตรง ๆ ได้เลย Button จัดขนาด size-4 และ gap-2 ให้เอง
ปุ่มไอคอนล้วนต้องมี aria-label

## ตาราง — ทุกช่องในแถวเดียวกันต้องสูงเท่ากัน
ใช้ <Table> จาก DS เสมอ แล้วกฎนี้เกิดขึ้นเองฟรี
ห้ามประกอบเองด้วย div เป็นคอลัมน์ เพราะแต่ละคอลัมน์จะสูงอิสระกัน เส้นคั่นจะหยัก
ค่าที่ DS ตั้งไว้แล้ว ไม่ต้องใส่เอง: TableHead = h-10 px-2 · TableCell = p-2
ช่องที่มี Input ต้องเหลือช่องไฟบนล่าง 8px — p-2 ให้มาแล้ว อย่าเขียน py-0 ทับ
(input สูง 36 + 8 + 8 = แถวสูง 52)
หัวตารางสองบรรทัดให้ใช้ <span className="block"> ขึ้นบรรทัดเอง
ห้ามใส่ truncate หรือ line-clamp กับหัวตาราง หัวข้อจะหายกลายเป็น …
ช่องตัวเลขจัดชิดขวาและใช้ tabular-nums

## Alert — 4 variant พื้นทึบทั้งหมด
default (พื้น card) · warning (พื้น warning) · brand (พื้น brand) · destructive (พื้น danger)
<Alert variant="warning"><TriangleAlertIcon /><AlertTitle>…</AlertTitle>
  <AlertDescription>…</AlertDescription></Alert>
ห้ามลอกวิธีของหน้า docs shadcn ที่เขียน className="border-amber-200 bg-amber-50 …" — ผิดกฎข้อ 2
ห้ามใช้สีจางทับพื้น (bg-primary/10) เพราะสีเพี้ยน และ Figma ผูก opacity กับ variable ไม่ได้
ห้ามบังคับสีไอคอนเป็นสีสด ไอคอนต้องรับสีจากตัวอักษร (คอนทราสต์จะเหลือ 2.36–2.95 ต่ำกว่าเกณฑ์ 3:1)

## Badge — 2 มิติ tone x appearance
<Badge tone="success" appearance="soft">จ่ายแล้ว</Badge>
tone: brand · success · warning · danger · neutral
appearance: solid (เข้ม) · soft (อ่อน) · outline (เส้นขอบ)
ไม่มี prop variant แล้ว

## ปุ่ม
variant มาตรฐานของ shadcn ครบ + เพิ่ม outline-primary (เส้นขอบสีหลัก hover พื้นเป็น brand)

## เช็คลิสต์ก่อนส่งงาน
- ไม่มี #hex / rgb( / hsl( / สี Tailwind (bg-blue-500, text-gray-700) ในโค้ด component
- ไม่มี arbitrary color bg-[...] หรือ text-[...]
- className แบบมีเงื่อนไข ใช้ cn() ทุกที่
- component import จาก @peckey954/ui/components/ui/* ไม่ใช่เขียนเอง
- สลับ blue ↔ green และ light ↔ dark แล้วหน้าตายังถูกต้อง
````

---

## แบบที่ 3 — ส่วนเพิ่มสำหรับงาน Figma

ต่อท้ายแบบ 1 หรือ 2 เมื่ออยากให้มันวาดใน Figma ให้ตรงกับโค้ด

````text
งาน Figma ให้ยึดเพิ่มอีกชุด

ไฟล์งาน Parich WMS: https://www.figma.com/design/WXmXTioYUjk0k4wgbRH66R/Parich-WMS
รายละเอียดเต็มอ่านที่ https://raw.githubusercontent.com/peckey954/DS/main/FIGMA-PLAN.md

- ตัวแปรสีนำเข้าจาก figma-tokens.json (Tokens Studio) 19 ชุด 3 collection
  mode 12 โหมด (blue/green/parich x light/dark x ปกติ/pure) · radius 4 · font 3
  https://raw.githubusercontent.com/peckey954/DS/main/figma-tokens.json
- ต้อง import ลง collection ที่ component ผูกอยู่จริงเท่านั้น
  ถ้าไปสร้าง collection ใหม่ ต่อให้ชื่อ variable ตรงเป๊ะ สีก็จะไม่เปลี่ยน
  เพราะ Figma อ้างอิงด้วย ID ไม่ใช่ชื่อ
- ทุกช่องสีต้องเป็น variable ตัวเดียว opacity 100% ห้ามตั้ง opacity เอง
  เพราะ Figma ผูก opacity กับ variable ไม่ได้ ไฟล์กับโค้ดจะหลุดจากกัน
- ตาราง: ทุกช่องในแถวเดียวกันต้องสูงเท่ากัน
  ความสูงแถว = ความสูงเนื้อหา + 8 บน + 8 ล่าง แล้วตั้งเป็น FIXED + CENTER
  ห้ามใช้ HUG วัดความสูง เพราะ Table Base / Cell มี padding เป็น 0
  แถวที่มี Input = 36 + 8 + 8 = 56 (ไม่ใช่ 40)
- ไอคอนที่ swap เข้าช่อง Icon Leading จะเอาสีของตัวเองติดมาและกลายเป็นสีดำ
  ต้องผูก strokes ของไอคอนกับตัวแปรสีของ label ปุ่มทุกครั้ง (ต่างจากในโค้ดที่ได้ฟรี)
- ข้อความต้องผูกกับ text style อย่าตั้ง font/size เอง
````

---

## ถ้าอีกฝั่งเป็น Claude Code ที่โคลน repo ได้

ง่ายที่สุดคือให้มันโคลนแล้วอ่านเอง ไม่ต้องแปะกฎ:

```bash
git clone https://github.com/peckey954/DS.git
```

ใน repo มี `CLAUDE.md` ที่ Claude Code อ่านอัตโนมัติอยู่แล้ว และมันชี้ไป `AGENTS.md` ให้เอง
— ไม่ต้องสั่งอะไรเพิ่ม

> **เช็คเวอร์ชันบน npm ก่อนส่งต่อ** — `@peckey954/ui` กับ `@peckey954/tokens` publish แล้ว
> แต่กฎในไฟล์นี้เขียนตามของล่าสุดในเครื่อง ถ้า registry ยังเป็นเวอร์ชันเก่า อีกฝั่งจะ
> `pnpm add` ได้ของที่ API ไม่ตรงกับกฎ (เช่น `Badge` ยังเป็น `variant` ไม่ใช่
> `tone` × `appearance` และแบรนด์ยังชื่อ `siam` / `nara` ไม่ใช่ `blue` / `green`)
>
> ```bash
> npm view @peckey954/ui version   # ต้องตรงกับ packages/ui/package.json
> ```
