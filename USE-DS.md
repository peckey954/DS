# เอา design system นี้ไปใช้

design system นี้เป็น **public** ใช้ได้ฟรีภายใต้ MIT license ไม่ต้องมี token ไม่ต้องขอสิทธิ์

ไฟล์นี้ครอบคลุม 3 เรื่อง เลือกอ่านเฉพาะที่ต้องใช้:

| อยากทำอะไร | ไปที่ |
|---|---|
| ติดตั้ง DS ในโปรเจกต์ที่มีอยู่แล้ว | [ส่วน 1](#1-ติดตั้ง) |
| ปรับสี/ฟอนต์เป็นแบรนด์ของโปรเจกต์นั้น | [ส่วน 2](#2-ปรับเป็นแบรนด์ของตัวเอง) |
| ให้ AI สร้างโปรเจกต์ใหม่ให้ครบในรอบเดียว | [ส่วน 3](#3-prompt-สร้างโปรเจกต์ใหม่) |
| ส่ง DS ต่อให้ Claude account อื่น / Cursor / Copilot | [ส่วน 4](#4-prompt-ส่งกฎต่อให้-agent-ตัวอื่น) |

**กฎการเขียน UI ไม่ได้อยู่ในไฟล์นี้** — อยู่ที่ [AGENTS.md](AGENTS.md) ซึ่งเป็นตัวจริงตัวเดียว
เรื่อง Figma อยู่ที่ [FIGMA.md](FIGMA.md)

---

# 1. ติดตั้ง

เลือกได้ 2 แนวทาง

| | **A — npm** | **B — shadcn registry** |
|---|---|---|
| ติดตั้ง | `pnpm add @peckey954/ui` | `pnpm dlx shadcn@latest add <url>` |
| โค้ดอยู่ไหน | ใน `node_modules` | ก็อปเข้าโปรเจกต์คุณ แก้ได้เลย |
| อัปเดต | `pnpm update @peckey954/ui` | ต้องรันคำสั่ง add ซ้ำเอง |
| แก้ component | ทำไม่ได้ (override ด้วย `className` ได้) | ทำได้ทุกอย่าง |

**ไม่แน่ใจให้เลือก A** — เริ่มง่ายกว่าและได้ของใหม่ฟรี ถ้าวันหนึ่งต้องแก้ component
จริง ๆ ค่อยย้ายมา B เฉพาะตัวนั้น ใช้ปนกันได้

## แนวทาง A — npm

```bash
pnpm create next-app@latest my-app --ts --tailwind --app --no-src-dir --import-alias "@/*"
cd my-app
pnpm add @peckey954/ui @peckey954/tokens tw-animate-css
```

`tw-animate-css` **จำเป็นต้องมี** — component 12 ตัว (dialog, sheet, popover, tooltip …)
ใช้ utility อย่าง `animate-in` `fade-in-0` `zoom-in-95` จากแพ็กเกจนี้
ถ้าไม่ติดตั้ง component จะยังทำงานได้แต่จะไม่มีอนิเมชันตอนเปิด/ปิด **โดยไม่มี error ให้เห็น**

### `next.config.mjs`

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@peckey954/ui"],
};

export default nextConfig;
```

เรา ship เป็น TypeScript source ไม่ได้ build ล่วงหน้า Next.js จึงต้องคอมไพล์ให้
ข้ามขั้นนี้จะเจอ `Unexpected token 'export'`

### `app/globals.css` — ลำดับสำคัญมาก

```css
@import "tailwindcss";
@import "tw-animate-css";

/* คำศัพท์กลาง — แมป token เข้ากับ Tailwind (ต้องมาก่อนไฟล์แบรนด์เสมอ) */
@import "@peckey954/ui/globals.css";

/* ค่าสีของแบรนด์ — ใส่เท่าที่ใช้ จะกี่แบรนด์ก็ได้ */
@import "@peckey954/tokens/blue.css";

/* ไม่บังคับ — โทนสีพื้น pure / blend */
@import "@peckey954/tokens/tint.css";

/* ⚠️ ขาดไม่ได้ — ค่าเริ่มต้นของ --radius --font-sans + แกน radius/density/font */
@import "@peckey954/tokens/styles.css";

/* ⚠️ ขาดไม่ได้ — ให้ Tailwind สแกนหา class ที่ไลบรารีใช้ */
@source "../node_modules/@peckey954/ui/src";
```

จุดที่พลาดบ่อย

- **`styles.css` ขาดไม่ได้** — `--radius` กับ `--font-sans` ย้ายออกจากไฟล์แบรนด์มาอยู่ที่นี่แล้ว
  ไฟล์แบรนด์เก็บ **แค่สี** ถ้าไม่ import ตัวนี้ ทุกอย่างจะมุมเหลี่ยมหมดเพราะไม่มี `--radius` เลย
- **ลำดับสำคัญ** — `ui/globals.css` ต้องมาก่อนไฟล์แบรนด์ · `styles.css` ไปท้ายสุด
- **`@source` ขาดไม่ได้** — Tailwind v4 สร้าง CSS จาก class ที่เจอในไฟล์จริงเท่านั้น
  ถ้าไม่ชี้ไปที่ source ของไลบรารี component จะออกมาไม่มีสไตล์เลย
- path ใน `@source` นับจากตำแหน่งของไฟล์ CSS เอง ไฟล์อยู่ที่ `app/globals.css`
  ก็ถอยขึ้น 1 ชั้นเป็น `../node_modules/...`

### `app/layout.tsx`

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" data-brand="blue">
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

`data-brand` คือสิ่งที่บอกว่าให้ใช้ค่าสีชุดไหน ต้องตรงกับ selector ในไฟล์ token

### ใช้งาน

```tsx
import { Button } from "@peckey954/ui/components/ui/button";
import { Card, CardHeader, CardTitle } from "@peckey954/ui/components/ui/card";
import { cn } from "@peckey954/ui/lib/utils";
```

### อัปเดต

```bash
pnpm update @peckey954/ui @peckey954/tokens
```

ข้ามไปเวอร์ชันใหญ่ (0.x → 1.x) ต้องระบุเอง: `pnpm add @peckey954/ui@latest`
**อ่านหมายเหตุของเวอร์ชันก่อน** แล้วรัน `pnpm build` เช็คว่าไม่มีอะไรหลุด

## แนวทาง B — shadcn registry

ได้โค้ดจริงเข้ามาในโปรเจกต์ แก้ได้ทุกบรรทัด เหมือนใช้ shadcn/ui ทางการ

```bash
pnpm create next-app@latest my-app --ts --tailwind --app --no-src-dir --import-alias "@/*"
cd my-app
pnpm dlx shadcn@latest init      # สร้าง components.json + lib/utils.ts (ตัว cn)
pnpm add tw-animate-css
```

ติดตั้ง theme ก่อนเสมอ

```bash
pnpm dlx shadcn@latest add https://ds-web-iota.vercel.app/r/theme.json
```

ได้ 3 ไฟล์ลงมาที่ `styles/` — `ds-theme.css` (คำศัพท์กลาง **ต้องมี**) ·
`brand-blue.css` · `brand-green.css` แล้วแก้ `app/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "../styles/ds-theme.css";
@import "../styles/brand-blue.css";
```

พร้อมตั้ง `data-brand="blue"` บน `<html>` เหมือนแนวทาง A

```bash
pnpm dlx shadcn@latest add https://ds-web-iota.vercel.app/r/button.json
pnpm dlx shadcn@latest add https://ds-web-iota.vercel.app/r/multi-select.json
```

component ที่พึ่งพาตัวอื่นจะดึงตัวที่จำเป็นมาให้เอง เช่น `multi-select` ลาก
`popover` `command` `checkbox` `badge` มาด้วยอัตโนมัติ
ดูรายชื่อทั้งหมดที่ `https://ds-web-iota.vercel.app/r/index.json`

import เป็น `@/components/ui/button` ไม่ใช่ `@peckey954/...` เพราะโค้ดอยู่ในโปรเจกต์คุณแล้ว

อัปเดตด้วยการรัน add ซ้ำ + `--overwrite` — **ระวัง** ถ้าคุณแก้ไฟล์นั้นไว้เองจะถูกทับหาย
ควร commit ก่อนแล้วดู diff

---

# 2. ปรับเป็นแบรนด์ของตัวเอง

ไม่ต้องแก้โค้ด component เลย ทั้งสองแนวทางทำเหมือนกัน

## 2.1 ไฟล์แบรนด์ = สีล้วน

ก็อป `node_modules/@peckey954/tokens/src/blue.css` มาทั้งไฟล์เป็น `app/brand.css`
แล้วเปลี่ยน selector กับค่าสี

```css
[data-brand="acme"] {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 10%);

  --primary: hsl(280 70% 50%);          /* สีหลักของแบรนด์ */
  --primary-foreground: hsl(0 0% 100%);

  /* สี hover — โหมดสว่างให้เข้มขึ้น โหมดมืดให้สว่างขึ้น */
  --primary-hover: hsl(280 70% 45%);

  /* … ตัวที่เหลือก็อปจากไฟล์ต้นฉบับมาแก้ค่า ต้องครบทุกตัว … */
}

[data-brand="acme"].dark {
  /* ชุดโหมดมืด ต้องครบทุกตัวเหมือนกัน */
}
```

**ห้ามใส่ `--radius` หรือ `--font-sans` ในบล็อกนี้** สองตัวนี้เป็นแกนสไตล์แยก
มีค่าเริ่มต้นอยู่ใน `styles.css` แล้ว ถ้าเอากลับมาใส่ในไฟล์แบรนด์ "เลือกสี"
จะไปเปลี่ยนความโค้งกับฟอนต์ด้วยโดยไม่ตั้งใจ

**ต้องประกาศสีให้ครบทุกตัว** เพราะ component อ้างชื่อพวกนี้ตรง ๆ ขาดตัวไหนตรงนั้นจะไม่มีสี
วิธีที่ปลอดภัยที่สุดคือก็อปไฟล์เดิมทั้งไฟล์มาแก้ค่า อย่าพิมพ์ขึ้นใหม่

แล้วชี้ `globals.css` มาที่ไฟล์นี้ (วางไว้ตรงตำแหน่งเดิมของไฟล์แบรนด์) และเปลี่ยน
`data-brand` บน `<html>` เป็น `"acme"`

## 2.2 ฟอนต์

โหลดใน `app/layout.tsx`

```tsx
import { Kanit } from "next/font/google";

const brandFont = Kanit({
  subsets: ["thai", "latin"],           // ต้องมี "thai" ถ้าใช้ภาษาไทย
  weight: ["400", "500", "600", "700"],
  variable: "--font-brand",
  display: "swap",
});

// แล้วใส่ className={brandFont.variable} ที่ <html>
```

แล้ว **override `--font-sans` หลังจาก import `styles.css`**

```css
@import "@peckey954/tokens/styles.css";

:root {
  --font-sans: var(--font-brand), ui-sans-serif, system-ui, sans-serif;
}
```

ค่าเริ่มต้นใน `styles.css` ชี้ไปที่ `var(--font-ibm-thai)` ซึ่ง **ไม่มีอยู่ในโปรเจกต์คุณ**
ถ้าไม่ override มันจะตกไปใช้ `ui-sans-serif` เงียบ ๆ โดยไม่มี error

## 2.3 แกนสไตล์อื่นที่ปรับได้ฟรี

```html
<html data-brand="acme" data-tint="pure" data-font="sarabun"
      data-radius="standard" data-density="standard" class="dark">
```

| แกน | ค่า | ต้องมีอะไร |
|---|---|---|
| `data-tint` | `pure` · `blend` | import `tint.css` |
| `data-font` | `ibm` · `prompt` · `sarabun` | โหลดฟอนต์นั้นด้วย `next/font` และตั้ง variable ตามชื่อ |
| `data-radius` | `sharp` · `standard` · `friendly` · `pill` | มากับ `styles.css` |
| `data-density` | `compact` · `standard` · `comfortable` | มากับ `styles.css` |

ไม่ใส่ attribute = ใช้ค่าเริ่มต้นใน `:root` ทุกแกนเป็นของเสริม ไม่บังคับ

## 2.4 dark mode

```bash
pnpm add next-themes
```

ครอบด้วย `ThemeProvider` ที่ตั้ง `attribute="class"` — token จะสลับให้เองผ่าน
selector `.dark` ที่เขียนไว้ในไฟล์แบรนด์

---

# 3. Prompt สร้างโปรเจกต์ใหม่

ก็อปไปวางใน Claude Code ที่เปิดในโฟลเดอร์ว่าง แล้วแก้ 3 บรรทัดในส่วน "แบรนด์ของโปรเจกต์นี้"

````text
สร้างโปรเจกต์ Next.js ใหม่ในโฟลเดอร์นี้ ที่ดึง design system จาก npm มาใช้
แล้วปรับสี/ฟอนต์เป็นแบรนด์ของโปรเจกต์นี้เอง

อ่านคู่มือนี้ก่อนเริ่ม แล้วทำตามทุกขั้น:
https://raw.githubusercontent.com/peckey954/DS/main/USE-DS.md
กฎการเขียน UI อยู่ที่:
https://raw.githubusercontent.com/peckey954/DS/main/AGENTS.md

แบรนด์ของโปรเจกต์นี้:
- ชื่อแบรนด์ (ใช้เป็นค่า data-brand): acme
- สีหลัก: ม่วง
- ฟอนต์ไทย: Kanit

สิ่งที่ต้องทำ:

1. pnpm create next-app@latest . --ts --tailwind --app --no-src-dir --import-alias "@/*"

2. pnpm add @peckey954/ui @peckey954/tokens tw-animate-css
   (เป็น public package ไม่ต้องมี token ไม่ต้องสร้าง .npmrc)

3. next.config.mjs ต้องมี transpilePackages: ["@peckey954/ui"]
   ข้ามขั้นนี้จะ build ไม่ผ่าน เพราะ DS ship เป็น TypeScript source

4. app/globals.css เขียนตามลำดับนี้เป๊ะ ๆ (ลำดับสำคัญ):
   @import "tailwindcss";
   @import "tw-animate-css";
   @import "@peckey954/ui/globals.css";
   @import "./brand.css";
   @import "@peckey954/tokens/styles.css";
   @source "../node_modules/@peckey954/ui/src";

   - styles.css ขาดไม่ได้ ในนั้นมีค่าเริ่มต้นของ --radius กับ --font-sans
     และแกน data-radius / data-density / data-font
   - @source ขาดไม่ได้ ไม่งั้น component จะไม่มีสไตล์เลย

5. สร้าง app/brand.css โดยก็อปโครงทั้งไฟล์จาก
   node_modules/@peckey954/tokens/src/blue.css มาแก้ค่าสี
   - เปลี่ยน selector เป็น [data-brand="acme"] และ [data-brand="acme"].dark
   - ต้องประกาศ CSS variable ให้ครบทุกตัวเหมือนไฟล์ต้นฉบับ ห้ามขาดตัวไหน
   - ไฟล์แบรนด์เก็บแค่สี ห้ามใส่ --radius หรือ --font-sans ลงไป
   - สี hover: โหมดสว่างให้เข้มขึ้น โหมดมืดให้สว่างขึ้น

6. app/layout.tsx:
   - โหลดฟอนต์ด้วย next/font/google โดยต้องมี subsets: ["thai", "latin"]
     ตั้ง variable แล้วใส่ className ของ variable ที่ <html>
   - override --font-sans ใน :root ของ globals.css ให้ชี้มาที่ variable นั้น
     (ต้องเขียนหลังบรรทัด @import styles.css ไม่งั้นจะโดนทับ)
   - ตั้ง data-brand="acme" และ lang="th" ที่ <html>
   - body ใช้ class: min-h-screen bg-background text-foreground font-sans antialiased

7. ติดตั้ง next-themes แล้วครอบ ThemeProvider แบบ attribute="class" เพื่อให้สลับ dark mode ได้

8. ทำหน้าแรกเป็นหน้าตัวอย่างที่ใช้ component จาก DS จริง อย่างน้อย:
   button ทุก variant, card, input, select, checkbox, radio-group,
   dialog, table และปุ่มสลับ light/dark
   import แบบ: import { Button } from "@peckey954/ui/components/ui/button";

9. ตรวจก่อนบอกว่าเสร็จ:
   - pnpm build ต้องผ่าน
   - pnpm dev แล้วเปิดหน้าเว็บจริง ยืนยันว่าสีเป็นสีแบรนด์เรา ไม่ใช่สีน้ำเงินของ Blue
   - สลับ dark mode แล้วสียังถูกต้อง
   - ฟอนต์ไทยขึ้นเป็นฟอนต์ที่เลือก ไม่ใช่ฟอนต์สำรอง
   - ปุ่มมีมุมโค้ง (ถ้าเหลี่ยมหมด = ลืม import styles.css)

10. git init + commit แรก (ผู้ใช้จะกด Publish to GitHub ใน VSCode เอง)

ห้าม hardcode สีลงใน component หรือหน้าเว็บ ใช้ token เท่านั้น
(bg-primary, text-foreground, bg-muted, border-border ...)
สีทั้งหมดต้องแก้ได้จากไฟล์ brand.css ที่เดียว
````

**ตั้งเป็น slash command ได้** — สร้าง `~/.claude/commands/new-ds-project.md`
(อยู่ในเครื่องคุณ ไม่ได้อยู่ใน repo) ให้เนื้อหาสั่ง Claude Code ไปอ่านไฟล์นี้จาก GitHub
แล้วทำตาม ข้อดีคือ **ไม่มีวันเก่า** พอแก้ไฟล์นี้แล้ว push คำสั่งก็ดึงของใหม่มาใช้เอง

---

# 4. Prompt ส่งกฎต่อให้ agent ตัวอื่น

เลือกใช้แบบเดียวก็พอ

| แบบ | ใช้เมื่อ |
|---|---|
| **4.1 ชี้ไปที่ repo** | Claude Code / เครื่องมือที่อ่านไฟล์ตรงได้ |
| **4.2 แปะกฎไปทั้งก้อน** | แชทเปล่า ๆ ที่ไม่มีเครื่องมือดึงไฟล์ |

> ในแชทเว็บเปล่า ๆ ให้ใช้ **4.2** ดีกว่า เพราะการดึงไฟล์ผ่านเว็บมักย่อ/ตัดเนื้อหา
> และเสียเวลาไป-กลับหลายรอบ

## 4.1 ชี้ไปที่ repo

````text
ผมมี design system อยู่ที่ https://github.com/peckey954/DS
งาน UI ทุกชิ้นที่คุณทำให้ผม ต้องยึดตาม DS ตัวนี้เท่านั้น

ก่อนเขียนโค้ด UI ทุกครั้ง ให้อ่าน 2 ไฟล์นี้ให้จบก่อน:
1. https://raw.githubusercontent.com/peckey954/DS/main/AGENTS.md   ← กฎบังคับ อ่านให้ครบ
2. https://raw.githubusercontent.com/peckey954/DS/main/packages/ui/src/styles/globals.css   ← รายชื่อ token ที่ใช้ได้จริง

ถ้าต้องดูโค้ดจริงของ component ตัวไหน อ่านที่
https://raw.githubusercontent.com/peckey954/DS/main/packages/ui/src/components/ui/<ชื่อ>.tsx
(ดูรายชื่อทั้งหมดที่ https://github.com/peckey954/DS/tree/main/packages/ui/src/components/ui)

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

## 4.2 แปะกฎไปทั้งก้อน

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
   ไฟล์แบรนด์เก็บแค่สี ไม่มี --radius ไม่มี --font-sans (สองตัวนั้นอยู่ใน styles.css)
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

## ก่อนส่งต่อ ให้เช็คเวอร์ชันบน npm

กฎในไฟล์นี้เขียนตามของล่าสุดในเครื่อง ถ้า registry ยังเป็นเวอร์ชันเก่า อีกฝั่งจะ
`pnpm add` ได้ของที่ API ไม่ตรงกับกฎ (เช่น `Badge` ยังเป็น `variant` ไม่ใช่
`tone` × `appearance` และแบรนด์ยังชื่อ `siam` / `nara` ไม่ใช่ `blue` / `green`)

```bash
npm view @peckey954/ui version   # ต้องตรงกับ packages/ui/package.json
```

---

# แก้ปัญหาที่เจอบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| `Unexpected token 'export'` | ลืมตั้ง `transpilePackages: ["@peckey954/ui"]` (แนวทาง A) |
| component ขึ้นมาแต่ไม่มีสไตล์เลย | ลืมบรรทัด `@source` หรือชี้ path ผิด (A) / ลืม import `ds-theme.css` (B) |
| **ทุกอย่างมุมเหลี่ยม ไม่มีความโค้งเลย** | **ลืม `@import "@peckey954/tokens/styles.css"` — `--radius` อยู่ในนั้น ไม่ได้อยู่ในไฟล์แบรนด์แล้ว** |
| ฟอนต์ไม่เปลี่ยนตามที่โหลดไว้ | ลืม override `--font-sans` ใน `:root` หลัง import `styles.css` |
| ไม่มีอนิเมชันตอนเปิด dialog / sheet | ลืมติดตั้งหรือ `@import "tw-animate-css"` |
| สีไม่เปลี่ยนตามแบรนด์ | ลืมใส่ `data-brand` บน `<html>` หรือชื่อไม่ตรงกับ selector ในไฟล์ token |
| `bg-primary` ไม่มีสี | ลืม import ไฟล์คำศัพท์กลาง หรือ import หลังไฟล์แบรนด์ (ลำดับสลับ) |
| ฟอนต์ไทยขึ้นเป็นฟอนต์สำรอง | ลืมใส่ `subsets: ["thai", "latin"]` ตอนโหลดฟอนต์ |
| `cn is not defined` (แนวทาง B) | ยังไม่ได้รัน `shadcn init` ซึ่งเป็นตัวสร้าง `lib/utils.ts` |
| shadcn ดึง component ผิดตัว (B) | registry ถูก build ด้วย `REGISTRY_URL` ผิด — แจ้งเจ้าของ repo ให้ rebuild |

---

# เมื่อไหร่ต้องกลับมาแก้ไฟล์นี้

prompt ในส่วน 3 เขียนแบบ **ชี้ไปหาของจริง** ไม่ได้ก็อปค่ามาแปะ เช่นขั้นที่ 5
สั่งให้ไปอ่าน `blue.css` จาก `node_modules` แทนที่จะเขียนรายชื่อ CSS variable ไว้ในนี้
DS เปลี่ยนอะไรส่วนใหญ่จึง **ไม่ต้องแก้ไฟล์นี้เลย**

| เปลี่ยนอะไรใน DS | ต้องแก้ไฟล์นี้ไหม |
|---|---|
| เพิ่ม / แก้ / ลบ component | ❌ ไม่ต้อง |
| เพิ่ม token ใหม่ (เช่น `--primary-hover`) | ❌ ไม่ต้อง — ก็อปมาจากไฟล์จริงอยู่แล้ว |
| เปลี่ยนสีของ blue / green / parich | ❌ ไม่ต้อง |
| แก้บั๊ก ปรับ spacing | ❌ ไม่ต้อง |
| **เพิ่ม peer dependency ใหม่** | ✅ ต้อง — เพิ่มในส่วน 1 และขั้นที่ 2 ของ prompt |
| **เปลี่ยนโครงสร้าง / ลำดับการ import CSS** | ✅ ต้อง — แก้ทั้งส่วน 1 และขั้นที่ 4 |
| **ย้ายตัวแปรข้ามไฟล์** (เช่นที่ย้าย `--radius` ไป `styles.css`) | ✅ ต้อง — คนที่ทำตามของเก่าจะพังเงียบ ๆ |
| **เปลี่ยน API ของ component** (เช่น Badge `variant` → `tone`) | ✅ ต้อง — แก้ก้อน 4.2 |
| **เปลี่ยนชื่อแพ็กเกจ** | ✅ ต้อง — แก้ทั้งไฟล์ |
| **เลิก ship source มา build เป็น JS แทน** | ✅ ต้อง — ตัด `transpilePackages` ออก |

> เช็คง่าย ๆ: ถ้าแก้ `peerDependencies` ใน `packages/ui/package.json` หรือย้าย
> CSS variable ข้ามไฟล์เมื่อไหร่ ให้มาดูไฟล์นี้ด้วยทุกครั้ง
