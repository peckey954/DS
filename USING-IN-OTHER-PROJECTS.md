# เอา design system ไปใช้ในโปรเจกต์อื่น

คู่มือนี้สำหรับโปรเจกต์ที่อยู่ **คนละ repo** กับ design system
ปลายทางจะได้ component ครบทั้ง 55 ตัว และปรับสี/ฟอนต์เป็นแบรนด์ของตัวเองได้
โดยไม่ต้องก็อปโค้ด component ไปเลยสักไฟล์

> ถ้าจะแก้ตัว design system เอง ให้ดู [PUBLISHING.md](PUBLISHING.md)

---

## 1. สร้างโปรเจกต์ใหม่

```bash
pnpm create next-app@latest my-app --ts --tailwind --app --no-src-dir --import-alias "@/*"
cd my-app
```

ตัวติดตั้งจะให้ Tailwind v4 มาแล้ว ซึ่งเป็นเวอร์ชันที่ design system นี้ต้องใช้

---

## 2. ตั้งค่า registry + token

สร้าง `.npmrc` ที่ root ของโปรเจกต์ใหม่:

```
@peckey954:registry=https://npm.pkg.github.com
```

**ห้ามใส่ token ในไฟล์นี้** เพราะจะถูก commit ขึ้น git — ให้เก็บ token ไว้ที่ `~/.npmrc` แทน:

```bash
echo "//npm.pkg.github.com/:_authToken=ใส่_TOKEN_ตรงนี้" >> ~/.npmrc
chmod 600 ~/.npmrc
```

token ต้องมีสิทธิ์ **`read:packages`** (วิธีสร้างอยู่ใน [PUBLISHING.md](PUBLISHING.md))

---

## 3. ติดตั้งแพ็กเกจ

```bash
pnpm add @peckey954/ui @peckey954/tokens
pnpm add tw-animate-css
```

`tw-animate-css` **จำเป็นต้องมี** — component 12 ตัว (dialog, sheet, popover, tooltip …)
ใช้ utility อย่าง `animate-in` `fade-in-0` `zoom-in-95` จากแพ็กเกจนี้
ถ้าไม่ติดตั้ง component จะยังทำงานได้แต่จะไม่มีอนิเมชันตอนเปิด/ปิด

---

## 4. ตั้ง `transpilePackages`

เรา ship เป็น TypeScript source ไม่ได้ build ล่วงหน้า Next.js จึงต้องคอมไพล์ให้

`next.config.mjs` (หรือ `.ts`):

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@peckey954/ui"],
};

export default nextConfig;
```

ข้ามขั้นนี้จะเจอ error ประมาณ `Unexpected token 'export'` หรือ
`Cannot use import statement outside a module`

---

## 5. ตั้งค่า CSS

แทนที่เนื้อหาทั้งหมดใน `app/globals.css` ด้วย:

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
- path ใน `@source` นับจากตำแหน่งของไฟล์ CSS ตัวเอง ถ้าไฟล์อยู่ที่ `app/globals.css`
  ก็ถอยขึ้น 1 ชั้นเป็น `../node_modules/...`

---

## 6. ตั้ง `data-brand` บน `<html>`

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

---

## 7. ใช้งาน

```tsx
import { Button } from "@peckey954/ui/components/ui/button";
import { Card, CardHeader, CardTitle } from "@peckey954/ui/components/ui/card";
import { cn } from "@peckey954/ui/lib/utils";

export default function Page() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>สวัสดี</CardTitle>
      </CardHeader>
      <Button>กดเลย</Button>
    </Card>
  );
}
```

รายชื่อ component ทั้งหมดและกฎการใช้งานอยู่ใน [AGENTS.md](AGENTS.md)

---

## ปรับสี / ฟอนต์เป็นแบรนด์ของโปรเจกต์นี้

ไม่ต้องแก้โค้ด component เลย สร้างไฟล์ token ของตัวเองในโปรเจกต์ปลายทาง

### 1. สร้าง `app/brand.css`

ก็อปโครงจาก `@peckey954/tokens/siam.css` มาแล้วเปลี่ยนค่า:

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

  /* สี hover — สว่างให้เข้มขึ้น, มืดให้สว่างขึ้น */
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
ตรงนั้นจะไม่มีสี วิธีที่ปลอดภัยที่สุดคือก็อปไฟล์ `siam.css` ทั้งไฟล์มาแก้ค่า

### 2. เปลี่ยน `globals.css` ให้ใช้ไฟล์ของเรา

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@peckey954/ui/globals.css";
@import "./brand.css";                 /* แทนที่ token ของ siam */
@source "../node_modules/@peckey954/ui/src";
```

### 3. เปลี่ยน `data-brand` ใน layout เป็น `"acme"`

### 4. เปลี่ยนฟอนต์

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

ใน `brand.css` ก็ชี้ไปที่ variable เดียวกัน:

```css
--font-sans: var(--font-brand), ui-sans-serif, system-ui, sans-serif;
```

### รองรับ dark mode

ติดตั้ง `next-themes` แล้วครอบด้วย `ThemeProvider` ที่ตั้ง `attribute="class"`
ตัว token จะสลับให้เองผ่าน selector `.dark` ที่เขียนไว้ในไฟล์แบรนด์

```bash
pnpm add next-themes
```

---

## อัปเดตเมื่อ design system มีของใหม่

```bash
pnpm update @peckey954/ui @peckey954/tokens
```

ถ้าอยากข้ามไปเวอร์ชันใหญ่ (เช่น 0.x → 1.x) ต้องระบุเอง:

```bash
pnpm add @peckey954/ui@latest
```

**ก่อนอัปเดตควรอ่านหมายเหตุของเวอร์ชันนั้นก่อน** — ถ้าเป็นการขึ้น major
แปลว่ามีอะไรที่เปลี่ยนแล้วโค้ดเดิมอาจพัง

หลังอัปเดตให้รัน build เพื่อเช็คว่าไม่มีอะไรหลุด:

```bash
pnpm build
```

---

## แก้ปัญหาที่เจอบ่อย

| อาการ | สาเหตุ / วิธีแก้ |
|---|---|
| `401 Unauthorized` ตอน `pnpm add` | token ใน `~/.npmrc` หมดอายุ หรือไม่มีสิทธิ์ `read:packages` |
| `404 Not Found` ตอน `pnpm add` | ลืมสร้าง `.npmrc` ที่ root ที่ชี้ `@peckey954:registry` |
| `Unexpected token 'export'` | ลืมตั้ง `transpilePackages: ["@peckey954/ui"]` |
| component ขึ้นมาแต่ไม่มีสไตล์เลย | ลืมบรรทัด `@source` หรือชี้ path ผิด |
| ไม่มีอนิเมชันตอนเปิด dialog / sheet | ลืมติดตั้งหรือ `@import "tw-animate-css"` |
| สีไม่เปลี่ยนตามแบรนด์ | ลืมใส่ `data-brand` บน `<html>` หรือชื่อไม่ตรงกับ selector ในไฟล์ token |
| ฟอนต์ไทยขึ้นเป็นฟอนต์สำรอง | ลืมใส่ `subsets: ["thai", "latin"]` ตอนโหลดฟอนต์ |
