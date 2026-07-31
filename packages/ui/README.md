# @peckey954/ui

Multi-brand design system built on [shadcn/ui](https://ui.shadcn.com) and Tailwind CSS v4,
with first-class Thai font support. 55 components. Swap colours and fonts per brand
without touching component code.

ระบบดีไซน์กลาง สร้างบน shadcn/ui + Tailwind v4 รองรับฟอนต์ไทยเต็มรูปแบบ
มี component 55 ตัว เปลี่ยนสี/ฟอนต์ต่อแบรนด์ได้โดยไม่ต้องแก้โค้ด component

## ติดตั้ง

```bash
pnpm add @peckey954/ui @peckey954/tokens tw-animate-css
```

`tw-animate-css` จำเป็นต้องมี — component 12 ตัวใช้ utility อนิเมชันจากแพ็กเกจนี้

## ตั้งค่า

`next.config.mjs` — แพ็กเกจนี้ ship เป็น TypeScript source:

```js
export default { transpilePackages: ["@peckey954/ui"] };
```

`app/globals.css`:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@peckey954/ui/globals.css";
@import "@peckey954/tokens/siam.css";
@source "../node_modules/@peckey954/ui/src";
```

`app/layout.tsx` — ตั้ง `data-brand` ให้ตรงกับไฟล์ token:

```tsx
<html lang="th" data-brand="siam">
```

## ใช้งาน

```tsx
import { Button } from "@peckey954/ui/components/ui/button";
import { cn } from "@peckey954/ui/lib/utils";
```

## เอกสารเต็ม

https://github.com/peckey954/ds — มีทั้งวิธีสร้างแบรนด์ของตัวเอง
วิธีใช้ผ่าน shadcn CLI (ก็อปโค้ดเข้าโปรเจกต์) และตารางแก้ปัญหาที่เจอบ่อย

## License

MIT
