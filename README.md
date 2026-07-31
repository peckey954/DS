# Design System (shadcn-based, multi-brand)

ระบบดีไซน์กลาง 1 ชุด ใช้ได้หลายแอป — ปรับ **สี / ฟอนต์ (รวมฟอนต์ไทย) / dark-light** ต่อแบรนด์ได้ง่าย โดยไม่ต้องแก้โค้ด component มี component ของ shadcn ครบ **54 ตัว**

## แนวคิด: แยก "โครงสร้าง" ออกจาก "แบรนด์"

```
packages/ui      → component + คำศัพท์กลาง (ใช้ทุกแอป ทุกแบรนด์)
packages/tokens  → ค่าจริงของแต่ละแบรนด์ (สี, ฟอนต์, radius) — 1 แบรนด์ = 1 ไฟล์
apps/web         → แอปตัวอย่าง สลับแบรนด์ + สว่าง/มืดได้จริง
```

Component อ้างชื่อกลางเสมอ (`bg-primary`, `text-foreground`, `font-sans`) ไม่ hardcode สี
→ เปลี่ยนแบรนด์ = เปลี่ยนแค่ไฟล์ token

## เริ่มใช้งาน

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

## Component ที่มีให้ (55)

54 ตัวจาก shadcn + `multi-select` ที่ประกอบขึ้นเองในโปรเจกต์นี้
(ดรอปดาวน์เลือกหลายรายการ พร้อมค้นหา · เลือกทั้งหมด · chip — ดูตัวอย่างที่
`/components#multi-select`)


accordion, alert, alert-dialog, aspect-ratio, avatar, badge, breadcrumb, button,
button-group, calendar, card, carousel, chart, checkbox, collapsible, command,
context-menu, dialog, drawer, dropdown-menu, empty, field, form, hover-card,
input, input-group, input-otp, item, kbd, label, menubar, native-select,
navigation-menu, pagination, popover, progress, radio-group, resizable,
scroll-area, select, separator, sheet, sidebar, skeleton, slider, sonner,
spinner, switch, table, tabs, textarea, toggle, toggle-group, tooltip, multi-select

หน้าแกลเลอรีตัวอย่างการใช้งานครบทุกตัว: http://localhost:3000/components

การใช้งาน (subpath import แบบ shadcn):

```tsx
import { Button } from "@peckey954/ui/components/ui/button";
import { Card, CardHeader, CardTitle } from "@peckey954/ui/components/ui/card";
```

> หมายเหตุ: component ทดลอง 2–3 ตัวที่ยังพึ่งแพ็กเกจ Base UI ที่ยังไม่ปล่อยตัวจริง
> (เช่น combobox แบบใหม่, ชุด AI-chat) ถูกเว้นไว้ก่อน — เพิ่มทีหลังได้เมื่อ stable

## จะปรับอะไร ทำที่ไหน

### เปลี่ยนสี
แก้ค่าใน `packages/tokens/src/<brand>.css`
- บล็อก `[data-brand="siam"]` = light
- บล็อก `[data-brand="siam"].dark` = dark

### เปลี่ยน/เพิ่มฟอนต์ (รวมฟอนต์ไทย)
1. โหลดฟอนต์ใน `apps/web/app/layout.tsx` ด้วย `next/font/google`
   (ต้องมี `subsets: ["thai", "latin"]`) แล้วตั้ง `variable`
2. ชี้ `--font-sans` ของแบรนด์ไปที่ variable นั้น
   ตัวอย่าง: Siam ใช้ `IBM Plex Sans Thai`, Nara ใช้ `Prompt`

### เพิ่มแบรนด์ใหม่
1. copy `packages/tokens/src/siam.css` เป็น `brandx.css` แก้ค่า + เปลี่ยน selector เป็น `[data-brand="brandx"]`
2. `@import` ไฟล์นั้นใน `apps/web/app/globals.css`
3. เพิ่ม 1 บรรทัดใน `BRANDS` ที่ `apps/web/components/providers.tsx` (ดรอปดาวน์เลือกแบรนด์อ่านจากรายการนี้)

### เพิ่ม component เพิ่มเติมภายหลัง
โปรเจกต์ตั้งค่า `components.json` ให้แล้ว — เพิ่มด้วย shadcn CLI ได้เลย
(component จะถูกวางเข้า `packages/ui` อัตโนมัติ):

```bash
cd apps/web
pnpm dlx shadcn@latest add <component>
```

## เอาไปใช้กับโปรเจกต์อื่น (คนละ repo)

repo นี้เป็น **ตัวกลาง** ตัวเดียว ไม่ต้องก็อปโค้ดไปซ้อนกันหลายที่
เป็น public ใช้ได้ฟรีภายใต้ MIT license ไม่ต้องมี token

**แนวทาง A — ติดตั้งเป็น dependency** (อัปเดตอัตโนมัติ)

```bash
pnpm add @peckey954/ui @peckey954/tokens tw-animate-css
```

**แนวทาง B — ก็อปโค้ดเข้าโปรเจกต์** (แก้ได้อิสระ เหมือน shadcn/ui)

```bash
pnpm dlx shadcn@latest add https://ds-web-iota.vercel.app/r/button.json
```

- [USING-IN-OTHER-PROJECTS.md](USING-IN-OTHER-PROJECTS.md) — วิธีติดตั้งทั้งสองแนวทาง
  ปรับสี/ฟอนต์เป็นแบรนด์ของตัวเอง และตารางแก้ปัญหาที่เจอบ่อย
- [PUBLISHING.md](PUBLISHING.md) — สำหรับคนดูแล repo นี้: วิธี publish ขึ้น npm
  สร้าง registry และขึ้นเวอร์ชันใหม่

## เก็บไฟล์นี้ไว้ที่ไหน → GitHub

repo นี้คือ "source of truth" ของทั้งดีไซน์และโค้ด สร้าง repo แล้ว push:

```bash
git init
git add .
git commit -m "init design system"
git branch -M main
git remote add origin https://github.com/<org>/<repo>.git
git push -u origin main
```

แนะนำให้เป็น repo แยกต่างหาก (เช่น `design-system`) แล้วให้แอปจริง ๆ ดึงไปใช้ 2 แบบ:
- **แบบ monorepo**: เอาแอปไปไว้ใน `apps/` ของ repo นี้ (ใช้ `@peckey954/ui` ตรง ๆ)
- **แบบ registry**: ทำ `packages/ui` เป็น shadcn registry (มี `registry.json`) deploy ขึ้น Vercel
  แล้วแอปอื่นดึงข้ามด้วย `pnpm dlx shadcn@latest add https://design.yourcompany.com/r/button`

## ดูใน Figma ต่อยังไง

1. เปิดไฟล์ Figma community "shadcn/ui components with variables"
   (Menu → Duplicate to your drafts) — เป็นชุด component ที่ตรงกับโค้ด shadcn
2. ใน Figma สร้าง **Variables** (สี/ฟอนต์/radius) ให้ **ชื่อตรงกับ token ในโค้ด**
   เช่น `primary`, `background`, `foreground`, `radius`, `font-sans`
3. ติดตั้งปลั๊กอิน **Tokens Studio for Figma** เพื่อ sync ค่าระหว่าง Figma ↔ โค้ด
   - Export จาก Figma → ได้ JSON → แปลงเป็น CSS variable ใส่ `packages/tokens`
   - หรือกลับกัน: เอา token ในโค้ดเป็นตัวตั้ง แล้ว push เข้า Figma
4. ทำ 1 collection ต่อ 1 แบรนด์ใน Figma (Siam / Nara) และแต่ละ collection มีโหมด Light/Dark
   → ดีไซเนอร์สลับแบรนด์/โหมดใน Figma ได้เหมือนในแอป

หัวใจคือ **"ชื่อ token ต้องตรงกันทั้งสองฝั่ง"** — พอชื่อตรง การ sync สี/ฟอนต์จึงทำได้อัตโนมัติ

## โครงสร้างไฟล์

```
.
├── apps/web/                  # Next.js demo
│   ├── app/{globals.css,layout.tsx,page.tsx}
│   ├── components/            # providers, brand-switcher, language-switcher, theme-toggle
│   ├── lib/i18n.ts            # พจนานุกรม TH/EN ของแอปตัวอย่าง
│   └── components.json        # ตั้งค่า shadcn CLI (แอป)
├── packages/ui/               # component library กลาง
│   ├── components.json        # ตั้งค่า shadcn CLI (ไลบรารี)
│   └── src/
│       ├── components/ui/     # 54 components
│       ├── hooks/             # use-mobile
│       ├── lib/utils.ts       # cn()
│       ├── styles/globals.css # แมป token -> Tailwind (@theme)
│       └── index.ts
└── packages/tokens/           # ค่าจริงของแต่ละแบรนด์
    └── src/{siam,nara}.css
```

## Stack
Next.js 15 · React 19 · Tailwind CSS v4 · shadcn (new-york) · Radix UI · next-themes · Turborepo · pnpm
