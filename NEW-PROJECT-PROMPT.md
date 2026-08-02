# Prompt สำหรับขึ้นโปรเจกต์ใหม่ที่ใช้ design system นี้

ไฟล์นี้คือ **ต้นฉบับ** ของคำสั่งที่ใช้บอก AI ให้สร้างโปรเจกต์ใหม่ที่ดึง DS ไปใช้
แล้วปรับสี/ฟอนต์เป็นแบรนด์ของโปรเจกต์นั้นเอง

**วิธีใช้ที่เร็วที่สุด** — ถ้าตั้ง slash command ไว้แล้ว เปิด Claude Code ในโฟลเดอร์ว่าง
แล้วพิมพ์บรรทัดเดียว:

```
/new-ds-project acme ม่วง Kanit
```

**วิธีใช้แบบก็อปวาง** — ก็อปบล็อกด้านล่างไปวางใน Claude Code แล้วแก้ 3 บรรทัดในส่วน
"แบรนด์ของโปรเจกต์นี้"

---

## ตัวคำสั่ง

````
สร้างโปรเจกต์ Next.js ใหม่ในโฟลเดอร์นี้ ที่ดึง design system จาก npm มาใช้
แล้วปรับสี/ฟอนต์เป็นแบรนด์ของโปรเจกต์นี้เอง

อ่านคู่มือนี้ก่อนเริ่ม แล้วทำตามทุกขั้น:
https://raw.githubusercontent.com/peckey954/DS/main/USING-IN-OTHER-PROJECTS.md
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
   @source "../node_modules/@peckey954/ui/src";

   บรรทัด @source ขาดไม่ได้ ไม่งั้น component จะไม่มีสไตล์เลย

5. สร้าง app/brand.css โดยก็อปโครงทั้งไฟล์จาก
   node_modules/@peckey954/tokens/src/blue.css มาแก้ค่าสี
   - เปลี่ยน selector เป็น [data-brand="acme"] และ [data-brand="acme"].dark
   - ต้องประกาศ CSS variable ให้ครบทุกตัวเหมือนไฟล์ต้นฉบับ ห้ามขาดตัวไหน
   - สี hover: โหมดสว่างให้เข้มขึ้น โหมดมืดให้สว่างขึ้น
   - ชี้ --font-sans ไปที่ variable ของฟอนต์ที่โหลดใน layout

6. app/layout.tsx:
   - โหลดฟอนต์ด้วย next/font/google โดยต้องมี subsets: ["thai", "latin"]
     ตั้ง variable แล้วใส่ className ของ variable ที่ <html>
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

10. git init + commit แรก (ผู้ใช้จะกด Publish to GitHub ใน VSCode เอง)

ห้าม hardcode สีลงใน component หรือหน้าเว็บ ใช้ token เท่านั้น
(bg-primary, text-foreground, bg-muted, border-border ...)
สีทั้งหมดต้องแก้ได้จากไฟล์ brand.css ที่เดียว
````

---

## เมื่อไหร่ต้องกลับมาแก้ไฟล์นี้

คำสั่งข้างบนเขียนแบบ **ชี้ไปหาของจริง** ไม่ได้ก็อปค่ามาแปะ เช่นขั้นที่ 5 สั่งให้ไปอ่าน
`blue.css` จาก `node_modules` แทนที่จะเขียนรายชื่อ CSS variable ไว้ในนี้
เพราะฉะนั้น DS เปลี่ยนอะไรส่วนใหญ่ **ไม่ต้องแก้ไฟล์นี้เลย**

| เปลี่ยนอะไรใน DS | ต้องแก้ไฟล์นี้ไหม |
|---|---|
| เพิ่ม / แก้ / ลบ component | ❌ ไม่ต้อง |
| เพิ่ม token ใหม่ (เช่น `--primary-hover`) | ❌ ไม่ต้อง — ก็อปมาจากไฟล์จริงอยู่แล้ว |
| เปลี่ยนสีของ blue / green | ❌ ไม่ต้อง |
| แก้บั๊ก ปรับ spacing | ❌ ไม่ต้อง |
| **เพิ่ม peer dependency ใหม่** | ✅ ต้อง — เพิ่มในขั้นที่ 2 |
| **เปลี่ยนโครงสร้าง / ลำดับการ import CSS** | ✅ ต้อง — แก้ขั้นที่ 4 |
| **เปลี่ยนชื่อแพ็กเกจ** | ✅ ต้อง — แก้ทั้งไฟล์ |
| **เลิก ship source มา build เป็น JS แทน** | ✅ ต้อง — ตัด `transpilePackages` ในขั้นที่ 3 ออก |

ตัวอย่างจริงของกรณีที่ต้องแก้: ตอนเพิ่ม `tw-animate-css` เป็น peer dependency
ถ้าไม่มาเพิ่มในขั้นที่ 2 โปรเจกต์ใหม่จะได้ component ที่เปิด-ปิดแบบไม่มีอนิเมชัน
โดยไม่มี error ให้เห็นเลย

> เช็คง่าย ๆ: ถ้าแก้ `peerDependencies` ใน `packages/ui/package.json` เมื่อไหร่
> ให้มาดูไฟล์นี้ด้วยทุกครั้ง

---

## ตั้ง slash command ให้ใช้ได้ทุกโฟลเดอร์

สร้างไฟล์ `~/.claude/commands/new-ds-project.md` (ไฟล์นี้อยู่ในเครื่องคุณ ไม่ได้อยู่ใน repo)
เนื้อหาให้สั่ง Claude Code ไปอ่านไฟล์นี้จาก GitHub แล้วทำตาม

ข้อดีคือ **ไม่มีวันเก่า** — พอแก้ไฟล์นี้ใน repo แล้ว push คำสั่ง `/new-ds-project`
ก็จะดึงเวอร์ชันล่าสุดมาใช้เองทันที ไม่ต้องมาอัปเดตไฟล์ในเครื่อง
