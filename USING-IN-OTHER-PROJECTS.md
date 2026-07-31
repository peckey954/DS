# เอา design system ไปใช้ในโปรเจกต์อื่น

design system นี้เป็น **public** ใช้ได้ฟรีภายใต้ MIT license
ไม่ต้องมี token ไม่ต้องขอสิทธิ์ ติดตั้งได้ทันที

เลือกได้ 2 แนวทาง:

| | **แนวทาง A — npm** | **แนวทาง B — shadcn registry** |
|---|---|---|
| ติดตั้ง | `pnpm add @peckey954/ui` | `pnpm dlx shadcn@latest add <url>` |
| โค้ดอยู่ไหน | ใน `node_modules` | ก็อปเข้าโปรเจกต์คุณ แก้ได้เลย |
| อัปเดต | `pnpm update @peckey954/ui` | ต้องรันคำสั่ง add ซ้ำเอง |
| แก้ component | ทำไม่ได้ (แต่ override ด้วย `className` ได้) | ทำได้ทุกอย่าง |
| เหมาะกับ | อยากได้ของใหม่อัตโนมัติ ไม่อยากดูแลโค้ดเอง | อยากเป็นเจ้าของโค้ด ปรับได้อิสระ |

**ไม่แน่ใจให้เลือกแนวทาง A** — เริ่มง่ายกว่าและได้ของใหม่ฟรี ถ้าวันหนึ่งต้องแก้
component จริง ๆ ค่อยย้ายมาแนวทาง B เฉพาะตัวนั้นก็ได้ ใช้ปนกันได้

---

# แนวทาง A — ติดตั้งผ่าน npm

## 1. สร้างโปรเจกต์ใหม่

```bash
pnpm create next-app@latest my-app --ts --tailwind --app --no-src-dir --import-alias "@/*"
cd my-app
```

ตัวติดตั้งจะให้ Tailwind v4 มาแล้ว ซึ่งเป็นเวอร์ชันที่ design system นี้ต้องใช้

## 2. ติดตั้งแพ็กเกจ

```bash
pnpm add @peckey954/ui @peckey954/tokens tw-animate-css
```

`tw-animate-css` **จำเป็นต้องมี** — component 12 ตัว (dialog, sheet, popover, tooltip …)
ใช้ utility อย่าง `animate-in` `fade-in-0` `zoom-in-95` จากแพ็กเกจนี้
ถ้าไม่ติดตั้ง component จะยังทำงานได้แต่จะไม่มีอนิเมชันตอนเปิด/ปิด

## 3. ตั้ง `transpilePackages`

เรา ship เป็น TypeScript source ไม่ได้ build ล่วงหน้า Next.js จึงต้องคอมไพล์ให้

`next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@peckey954/ui"],
};

export default nextConfig;
```

ข้ามขั้นนี้จะเจอ `Unexpected token 'export'` หรือ
`Cannot use import statement outside a module`

## 4. ตั้งค่า CSS

แทนที่เนื้อหาทั้งหมดใน `app/globals.css`:

```css
@import "tailwindcss";

/* utility อนิเมชันที่ shadcn ใช้ */
@import "tw-animate-css";

/* คำศัพท์กลาง — แมป token เข้ากับ Tailwind (ต้องมาก่อนไฟล์แบรนด์) */
@import "@peckey954/ui/globals.css";

/* ค่าจริงของแบรนด์ที่โปรเจกต์นี้ใช้ */
@import "@peckey954/tokens/siam.css";

/* ให้ Tailwind สแกนหา class ที่ใช้อยู่ในโค้ดของไลบรารี */
@source "../node_modules/@peckey954/ui/src";
```

จุดที่พลาดบ่อย:

- **ลำดับสำคัญ** — `@peckey954/ui/globals.css` ต้องมาก่อนไฟล์ token ของแบรนด์
- **`@source` ขาดไม่ได้** — Tailwind v4 สร้าง CSS จาก class ที่เจอในไฟล์จริงเท่านั้น
  ถ้าไม่ชี้ไปที่ source ของไลบรารี component จะออกมาไม่มีสไตล์เลย
- path ใน `@source` นับจากตำแหน่งของไฟล์ CSS เอง ถ้าไฟล์อยู่ที่ `app/globals.css`
  ก็ถอยขึ้น 1 ชั้นเป็น `../node_modules/...`

## 5. ตั้ง `data-brand` บน `<html>`

`app/layout.tsx`:

```tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" data-brand="siam">
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
```

`data-brand` คือสิ่งที่บอกว่าให้ใช้ค่าสีชุดไหน — ต้องตรงกับ selector ในไฟล์ token

## 6. ใช้งาน

```tsx
import { Button } from "@peckey954/ui/components/ui/button";
import { Card, CardHeader, CardTitle } from "@peckey954/ui/components/ui/card";
import { cn } from "@peckey954/ui/lib/utils";
```

## อัปเดต

```bash
pnpm update @peckey954/ui @peckey954/tokens
```

ข้ามไปเวอร์ชันใหญ่ (0.x → 1.x) ต้องระบุเอง: `pnpm add @peckey954/ui@latest`
**อ่านหมายเหตุของเวอร์ชันก่อน** ถ้าเป็น major แปลว่ามีอะไรที่เปลี่ยนแล้วโค้ดเดิมอาจพัง
หลังอัปเดตให้รัน `pnpm build` เช็คว่าไม่มีอะไรหลุด

---

# แนวทาง B — ก็อปโค้ดผ่าน shadcn CLI

ได้โค้ดจริงเข้ามาอยู่ในโปรเจกต์ แก้ได้ทุกบรรทัด เหมือนใช้ shadcn/ui ทางการ

## 1. เตรียมโปรเจกต์

```bash
pnpm create next-app@latest my-app --ts --tailwind --app --no-src-dir --import-alias "@/*"
cd my-app
pnpm dlx shadcn@latest init
pnpm add tw-animate-css
```

`shadcn init` จะสร้าง `components.json` และ `lib/utils.ts` (ตัว `cn`) ให้ ซึ่ง component
ของเราเรียกใช้

## 2. ติดตั้ง theme ก่อน

```bash
pnpm dlx shadcn@latest add https://ds-web-iota.vercel.app/r/theme.json
```

จะได้ 3 ไฟล์ลงมาที่ `styles/`:

| ไฟล์ | คืออะไร |
|---|---|
| `ds-theme.css` | คำศัพท์กลาง แมป token เข้า Tailwind — **ต้องมี** |
| `brand-siam.css` | ค่าสีแบรนด์ Siam |
| `brand-nara.css` | ค่าสีแบรนด์ Nara |

แล้วแก้ `app/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "../styles/ds-theme.css";
@import "../styles/brand-siam.css";
```

พร้อมตั้ง `data-brand="siam"` บน `<html>` เหมือนแนวทาง A

## 3. ติดตั้ง component ที่ต้องการ

```bash
pnpm dlx shadcn@latest add https://ds-web-iota.vercel.app/r/button.json
pnpm dlx shadcn@latest add https://ds-web-iota.vercel.app/r/multi-select.json
```

component ที่พึ่งพาตัวอื่นจะดึงตัวที่จำเป็นมาให้เอง เช่น `multi-select` จะลาก
`popover` `command` `checkbox` `badge` มาด้วยอัตโนมัติ

ดูรายชื่อทั้งหมดที่ `https://ds-web-iota.vercel.app/r/index.json`

## 4. ใช้งาน

```tsx
import { Button } from "@/components/ui/button";
```

สังเกตว่าเป็น `@/components/...` ไม่ใช่ `@peckey954/...` เพราะโค้ดอยู่ในโปรเจกต์คุณแล้ว

## อัปเดต

รันคำสั่ง add ซ้ำ แล้วตอบ overwrite:

```bash
pnpm dlx shadcn@latest add https://ds-web-iota.vercel.app/r/button.json --overwrite
```

**ระวัง** — ถ้าคุณแก้ไฟล์นั้นเองไว้ การ overwrite จะทับของคุณหาย
ควร commit ก่อนแล้วดู diff

---

# ปรับสี / ฟอนต์เป็นแบรนด์ของโปรเจกต์นี้

ไม่ต้องแก้โค้ด component เลย ทั้งสองแนวทางทำเหมือนกัน

## 1. สร้างไฟล์ token ของตัวเอง

ก็อป `@peckey954/tokens/siam.css` (หรือ `styles/brand-siam.css` ถ้าใช้แนวทาง B)
มาเป็น `app/brand.css` แล้วเปลี่ยนค่า:

```css
[data-brand="acme"] {
  --background: hsl(0 0% 100%);
  --foreground: hsl(240 10% 10%);

  --card: hsl(0 0% 100%);
  --card-foreground: hsl(240 10% 10%);

  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(240 10% 10%);

  --primary: hsl(280 70% 50%);          /* สีหลักของแบรนด์ */
  --primary-foreground: hsl(0 0% 100%);

  --secondary: hsl(280 20% 96%);
  --secondary-foreground: hsl(240 10% 10%);

  --muted: hsl(280 20% 96%);
  --muted-foreground: hsl(240 5% 45%);

  --accent: hsl(280 20% 96%);
  --accent-foreground: hsl(240 10% 10%);

  --destructive: hsl(0 72% 51%);
  --destructive-foreground: hsl(0 0% 100%);

  /* สี hover — โหมดสว่างให้เข้มขึ้น, โหมดมืดให้สว่างขึ้น */
  --primary-hover: hsl(280 70% 45%);
  --secondary-hover: hsl(280 20% 93%);
  --accent-hover: hsl(280 20% 93%);
  --destructive-hover: hsl(0 72% 46%);

  --border: hsl(280 15% 90%);
  --input: hsl(280 15% 90%);
  --ring: hsl(280 70% 50%);

  --chart-1: hsl(280 70% 50%);
  --chart-2: hsl(160 60% 45%);
  --chart-3: hsl(30 80% 55%);
  --chart-4: hsl(200 65% 55%);
  --chart-5: hsl(340 75% 55%);

  --sidebar: hsl(280 20% 98%);
  --sidebar-foreground: hsl(240 10% 10%);
  --sidebar-primary: hsl(280 70% 50%);
  --sidebar-primary-foreground: hsl(0 0% 100%);
  --sidebar-accent: hsl(280 20% 96%);
  --sidebar-accent-foreground: hsl(240 10% 10%);
  --sidebar-border: hsl(280 15% 90%);
  --sidebar-ring: hsl(280 70% 50%);

  --radius: 0.75rem;                    /* ความโค้งของมุม */

  --font-sans: var(--font-brand), ui-sans-serif, system-ui, sans-serif;
}

[data-brand="acme"].dark {
  /* ใส่ค่าชุดโหมดมืดให้ครบทุกตัวข้างบน */
  --background: hsl(240 10% 6%);
  --foreground: hsl(0 0% 98%);
  /* … */
}
```

**ต้องประกาศให้ครบทุกตัว** เพราะ component อ้างชื่อพวกนี้ตรง ๆ ถ้าขาดตัวไหน
ตรงนั้นจะไม่มีสี วิธีที่ปลอดภัยที่สุดคือก็อปไฟล์เดิมทั้งไฟล์มาแก้ค่า

## 2. ชี้ globals.css มาที่ไฟล์ของเรา แล้วเปลี่ยน `data-brand` เป็น `"acme"`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@peckey954/ui/globals.css";   /* หรือ ../styles/ds-theme.css ถ้าใช้แนวทาง B */
@import "./brand.css";
@source "../node_modules/@peckey954/ui/src";   /* บรรทัดนี้เฉพาะแนวทาง A */
```

## 3. เปลี่ยนฟอนต์

โหลดใน `app/layout.tsx` แล้วชี้ `--font-sans` ของแบรนด์มาที่ variable นั้น:

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

## รองรับ dark mode

```bash
pnpm add next-themes
```

ครอบด้วย `ThemeProvider` ที่ตั้ง `attribute="class"` — token จะสลับให้เองผ่าน
selector `.dark` ที่เขียนไว้ในไฟล์แบรนด์

---

# แก้ปัญหาที่เจอบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| `Unexpected token 'export'` | ลืมตั้ง `transpilePackages: ["@peckey954/ui"]` (แนวทาง A) |
| component ขึ้นมาแต่ไม่มีสไตล์เลย | ลืมบรรทัด `@source` หรือชี้ path ผิด (แนวทาง A) / ลืม import `ds-theme.css` (แนวทาง B) |
| ไม่มีอนิเมชันตอนเปิด dialog / sheet | ลืมติดตั้งหรือ `@import "tw-animate-css"` |
| สีไม่เปลี่ยนตามแบรนด์ | ลืมใส่ `data-brand` บน `<html>` หรือชื่อไม่ตรงกับ selector ในไฟล์ token |
| `bg-primary` ไม่มีสี | ลืม import ไฟล์คำศัพท์กลาง หรือ import หลังไฟล์แบรนด์ (ลำดับสลับ) |
| ฟอนต์ไทยขึ้นเป็นฟอนต์สำรอง | ลืมใส่ `subsets: ["thai", "latin"]` ตอนโหลดฟอนต์ |
| `cn is not defined` (แนวทาง B) | ยังไม่ได้รัน `shadcn init` ซึ่งเป็นตัวสร้าง `lib/utils.ts` |
| shadcn ดึง component ผิดตัว (แนวทาง B) | registry ถูก build ด้วย `REGISTRY_URL` ผิด — แจ้งเจ้าของ repo ให้ rebuild |

---

รายชื่อ component ทั้งหมดและกฎการเขียน UI อยู่ใน [AGENTS.md](AGENTS.md)
ดูตัวอย่างจริงทุกตัวได้ที่หน้า `/components` ของแอปตัวอย่างใน repo นี้
