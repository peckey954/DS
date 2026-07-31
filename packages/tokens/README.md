# @peckey954/tokens

Brand design tokens for [`@peckey954/ui`](https://www.npmjs.com/package/@peckey954/ui) —
one CSS file per brand, light and dark included.

ค่าสี / ฟอนต์ / radius ของแต่ละแบรนด์ — 1 แบรนด์ = 1 ไฟล์ CSS มีทั้งโหมดสว่างและมืด

## ติดตั้ง

```bash
pnpm add @peckey954/tokens
```

## ใช้งาน

import **หลัง** `@peckey954/ui/globals.css` เสมอ:

```css
@import "@peckey954/ui/globals.css";
@import "@peckey954/tokens/siam.css";
```

แล้วตั้ง `data-brand` บน `<html>` ให้ตรงกับชื่อแบรนด์:

```tsx
<html data-brand="siam">
```

## แบรนด์ที่มีให้

| ไฟล์ | สีหลัก | ฟอนต์ |
|---|---|---|
| `siam.css` | น้ำเงิน | IBM Plex Sans Thai |
| `nara.css` | เขียวมรกต | Prompt |

โหมดมืดใช้ selector `[data-brand="..."].dark` — ใช้คู่กับ `next-themes` ที่ตั้ง
`attribute="class"` ได้ทันที

## สร้างแบรนด์ของตัวเอง

ก็อปไฟล์ใดไฟล์หนึ่งมาแก้ค่า แล้วเปลี่ยน selector เป็นชื่อแบรนด์ใหม่
ต้องประกาศ CSS variable ให้ครบทุกตัว เพราะ component อ้างชื่อพวกนี้ตรง ๆ

วิธีทำแบบละเอียดอยู่ที่ https://github.com/peckey954/ds

## License

MIT
