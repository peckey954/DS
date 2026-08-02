# แผนปรับ Figma ให้ตรงกับ Design System

ไฟล์นี้คือ **checklist ที่ทำตามได้ทีละข้อ** สำหรับยกของจากโค้ดขึ้น Figma
ค่าทั้งหมดมาจาก `pnpm tokens:figma` ซึ่งอ่านจากไฟล์ token จริง ไม่ได้พิมพ์ซ้ำด้วยมือ

> อัปเดตล่าสุด: หลัง commit ที่เพิ่มสถานะ success · badge แบบ tone x appearance ·
> ปุ่ม outline-primary · แก้สีโหมดมืดของ warning/danger

---

## 0. ก่อนเริ่ม

```bash
git pull
pnpm tokens:figma      # สร้างไฟล์ใหม่ใน figma-import/ ถ้าเพิ่งแก้ token
```

**สิ่งที่ต้องรู้ก่อนกดอะไรใน Figma**

- Figma อ้างอิง variable ด้วย **ID ไม่ใช่ชื่อ** ถ้าสร้าง collection ใหม่ ต่อให้ชื่อ
  variable ตรงกันเป๊ะ component เดิมก็จะไม่เปลี่ยนสี **ต้อง import ทับ collection เดิมเสมอ**
- ในไฟล์ community ค่าใน collection `mode` เป็น alias ชี้ไป `tw/colors`
  พอ import ค่า hex ทับ **alias จะขาด กลายเป็นค่าดิบ** ใช้งานได้ปกติ แต่จะไม่ผูกกับ
  ชุดสีพื้นฐานอีก — ตรงกับโครงในโค้ดเราที่ไม่มีชั้น primitive อยู่แล้ว
  ถ้าอยากเก็บของเดิมไว้ ให้ **Duplicate mode** ก่อนแล้ว import ลงตัวที่ copy มา
- **Figma ผูก opacity กับ variable ไม่ได้** ทุกค่าในเอกสารนี้จึงเป็นสีทึบหมด
  ตั้ง opacity 100% ทุกช่อง ถ้าเห็นตัวเองกำลังจะลด opacity แปลว่าหยิบ token ผิดตัว

---

## 1. นำเข้า variable ด้วย Tokens Studio (ประมาณ 15 นาที)

`figma-tokens.json` เป็นไฟล์ Tokens Studio ที่รวม **13 ชุด** ครบทั้งสามหมวดในไฟล์เดียว
import ทีเดียวได้ 3 collection ไม่ต้องนำเข้าทีละโหมด

| collection | mode | ที่มา |
|---|---|---|
| `mode` | Blue/Green/Parich x Light/Dark = 6 | สี 52 ตัวต่อโหมด |
| `radius` | Sharp · Standard · Friendly · Pill | `radius-sm/md/lg/xl` + ค่าคงที่ของ Tailwind |
| `font` | IBM Plex Sans Thai · Prompt · Sarabun | `family/sans` |

### ขั้นตอน

1. เปิดปลั๊กอิน **Tokens Studio for Figma** ในไฟล์ที่ต้องการ
2. เมนู **Tools → Load from file/folder** → เลือก `figma-tokens.json`
3. ไปแท็บ **Themes** จะเห็น 13 ธีมจัดกลุ่มเป็น 3 collection ตามตารางข้างบน
4. กด **Export to Figma** → เลือกทุกธีม → ยืนยัน

### ก่อนกด Export ต้องเช็คชื่อ collection ให้ตรงก่อน

เปิดแผง **Variables** ในไฟล์ Figma แล้วดูว่า collection ที่ component ผูกอยู่ชื่ออะไรจริง ๆ
ถ้าไม่ตรงกับ `mode` / `radius` / `font` ให้สร้างไฟล์ใหม่ด้วยชื่อที่ถูก

```bash
FIGMA_COLLECTION=<ชื่อจริง> \
FIGMA_RADIUS_COLLECTION=<ชื่อจริง> \
FIGMA_FONT_COLLECTION=<ชื่อจริง> \
pnpm tokens:figma
```

**นี่คือจุดที่พลาดบ่อยที่สุด** ถ้าชื่อไม่ตรง Tokens Studio จะสร้าง collection ใหม่ที่
ไม่มีใครใช้ Export ขึ้นเขียวหมดแต่สีใน Figma ไม่เปลี่ยนสักนิด เพราะ Figma ผูก
component กับ variable ด้วย **ID ไม่ใช่ชื่อ**

### ถ้าไม่อยากใช้ Tokens Studio

ในโฟลเดอร์ `figma-import/` มีไฟล์แยกรายโหมดให้ใช้กับปลั๊กอินตัวอื่นหรือ Import mode
ของ Figma — `*.dtcg.json` (มาตรฐาน W3C) และ `*.flat.json` (คู่ชื่อกับค่า)

## 2. ตั้งค่าไฟล์ (5 นาที)

- [ ] ย้าย **Parich Light** ขึ้นเป็นโหมดแรกของ collection `mode`
      โหมดแรก = ค่าเริ่มต้นของทั้งไฟล์ ทุก frame ที่ไม่ได้กำหนดโหมดจะใช้ตัวนี้
- [ ] ตั้ง `family/sans` = **Sarabun**

---

## 3. สร้าง / แก้ component (ประมาณ 1 ชั่วโมง)

### 3.1 Alert — 4 variant

property `Variant` = Default · Warning · Brand · Destructive

| Variant | พื้น | ตัวอักษร | เส้นขอบ |
|---|---|---|---|
| Default | `card` | `card-foreground` | `border` |
| Warning | `warning` | `warning-foreground` | `warning-border` |
| Brand | `brand` | `foreground` | `primary` |
| Destructive | `danger` | `danger-foreground` | `danger-border` |

โครง: มุมโค้ง `radius-lg` · ขอบ 1px · padding 12/16 · ช่องไฟไอคอน-ข้อความ 12 · ไอคอน 16

**ไอคอนใช้สีเดียวกับตัวอักษร ห้ามใช้สีสด** — เคยลองแล้วคอนทราสต์เหลือ 2.36–2.95
ต่ำกว่าเกณฑ์ 3:1 ของกราฟิก คำอธิบายใช้สีเดียวกับหัวข้อแต่ opacity 85% (Brand ใช้ 80%)

### 3.2 Badge — property 2 ตัว

property `Tone` (5) x `Appearance` (3) = **15 variant**

| Tone | Solid พื้น / ตัวอักษร | Soft พื้น / ตัวอักษร | Outline เส้นขอบ / ตัวอักษร |
|---|---|---|---|
| Brand | `primary` / `primary-foreground` | `brand` / `foreground` | `primary` / `foreground` |
| Success | `success-solid` / `success-solid-foreground` | `success` / `success-foreground` | `success-border` / `success-foreground` |
| Warning | `warning-solid` / `warning-solid-foreground` | `warning` / `warning-foreground` | `warning-border` / `warning-foreground` |
| Danger | `destructive` / `destructive-foreground` | `danger` / `danger-foreground` | `danger-border` / `danger-foreground` |
| Neutral | `foreground` / `background` | `secondary` / `secondary-foreground` | `border` / `secondary-foreground` |

- Soft ใช้เส้นขอบตัวเดียวกับ Outline
- Solid ไม่มีเส้นขอบ
- ทรง: มุมโค้งเต็ม (pill) · padding 2/8 · ตัวอักษร 12 · ไอคอน 12

### 3.3 Button — เพิ่ม variant

| Variant | พื้น | ตัวอักษร | เส้นขอบ | hover |
|---|---|---|---|---|
| Outline primary | `background` | `primary` | `primary` | พื้นเป็น `brand` |

### 3.4 Checkbox / Radio แบบมีกรอบ

สถานะถูกเลือกต้องใช้ **พื้น `brand` + เส้นขอบ `primary`** ซึ่งเป็นชุดเดียวกับ Alert
แบบ Brand และ Badge แบบ Brand outline **ถ้าแก้ที่ใดที่หนึ่งต้องแก้ทุกที่**

---

## 4. สิ่งที่ยกเข้า Figma ไม่ได้ (อ่านให้จบก่อนจะงง)

| แกน | เข้า Figma ได้ไหม | เหตุผล |
|---|---|---|
| สี (แบรนด์ x โหมด) | ✅ 6 mode | |
| ความโค้ง | ✅ 4 mode | |
| ฟอนต์ | ✅ 3 ค่า | |
| **โทนสีพื้น แยกสี** (`pure`) | ✅ 6 mode เพิ่ม | คำนวณเป็น hex ล่วงหน้าให้แล้ว |
| **โทนสีพื้น ผสมแบรนด์** (`blend`) | ✅ = mode เดิม | ชุด 6 mode แรกคือ blend อยู่แล้ว |
| **ความห่าง** (`data-density`) | ❌ | ตัดสินใจไว้แล้วว่าทำเฉพาะในโค้ด (ตัวเลือก B) |

**โทนสีพื้นทำเป็น collection แยกไม่ได้** เพราะมันเขียนทับตัวแปรชุดเดียวกับที่ `mode`
ถืออยู่ (`background` `card` `border` …) layer หนึ่งผูกกับตัวแปรได้ตัวเดียว
จึงต้องทำเป็น **mode เพิ่ม** ในคอลเลกชันเดิม รวมเป็น 12 mode

    3 แบรนด์ x สว่าง/มืด x ตามแบรนด์/แยกสี = 12

`--brand` เป็น `color-mix()` จึงคำนวณไว้ล่วงหน้าในสคริปต์ (primary ผสมลง card
5% โหมดสว่าง · 10% โหมดมืด) ส่วนตัวอื่นในโทน `pure` เป็น `hsl()` ตายตัวอยู่แล้ว

---

## 5. ตรวจงานหลังทำเสร็จ

- [ ] สลับโหมดใน `mode` แล้วสีเปลี่ยนทั้งไฟล์จริง (ไม่ใช่แค่บาง frame)
- [ ] สลับ collection ความโค้ง แล้วปุ่ม/การ์ด/input โค้งตาม
- [ ] `family/sans` เป็น Sarabun และตัวหนังสือในทุก component เปลี่ยนตาม
- [ ] Badge ครบ 15 ช่อง ไม่มีช่องไหนตั้ง opacity ต่ำกว่า 100%
- [ ] Alert แบบ Warning เป็นเหลือง (ไม่ใช่น้ำตาล) ในโหมดมืด
- [ ] Alert แบบ Destructive เป็นแดงชัด (ไม่ใช่ม่วง/น้ำตาล) ในโหมดมืด

---

## 5.5 ทำงานสองทาง — VS Code กับ Figma MCP

**MCP ของ Figma อ่านได้อย่างเดียว เขียนไม่ได้** สร้าง variable หรือ component ให้ไม่ได้
ข้อ 1-3 จึงต้องทำมือเสมอ แต่หลังจากนั้นใช้ MCP ได้เต็มที่

| ทิศทาง | ทำได้ | วิธี |
|---|---|---|
| โค้ด -> Figma | ค่า token | `pnpm tokens:figma` แล้ว import |
| โค้ด -> Figma | component | ทำมือ ใช้ตารางในข้อ 3 |
| Figma -> โค้ด | อ่านดีไซน์แล้วเขียนโค้ด | ส่งลิงก์ frame ให้ AI แล้วให้ใช้ `get_design_context` |
| Figma -> โค้ด | ตรวจว่า variable ตรงกับโค้ดไหม | `get_variable_defs` แล้วเทียบกับ `figma-tokens.json` |

**วิธีให้สองฝั่งตรงกันเสมอ** — หลัง import ทุกครั้ง ให้ส่งลิงก์ node มาแล้วสั่งว่า
"ตรวจว่า variable ใน Figma ตรงกับ figma-tokens.json ไหม" AI จะอ่านผ่าน MCP แล้วเทียบ
ให้ทีละตัว เจอตัวไหนไม่ตรงจะบอกชื่อกับค่าที่ควรเป็น

**เวลาให้ AI ออกแบบหน้าใหม่ใน Figma แล้วแปลงเป็นโค้ด** ต้องบอกให้มันอ่าน
`AGENTS.md` ก่อนเสมอ ไม่งั้นมันจะเขียน component ขึ้นมาใหม่แทนที่จะใช้ของที่มีอยู่แล้ว

## 6. เมื่อ DS เปลี่ยนอีกในอนาคต

```bash
git pull && pnpm tokens:figma
```

แล้วดูว่าไฟล์ไหนใน `figma-import/` เปลี่ยน แล้ว import ทับเฉพาะ mode นั้น
**ไม่ต้องสร้าง component ใหม่** ถ้าเปลี่ยนแค่ค่าสี เพราะ component ผูกกับ variable อยู่แล้ว

ต้องกลับมาแก้ component ก็ต่อเมื่อมี **variant ใหม่** หรือ **โครงเปลี่ยน** เท่านั้น
