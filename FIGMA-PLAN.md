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

## 1. นำเข้า variable (ประมาณ 20 นาที)

### 1.1 สี — collection `mode`

ทำ 6 รอบ รอบละโหมด · โหมดละ **52 สี**

| ไฟล์ | ลงคอลัมน์ |
|---|---|
| `figma-import/siam-light.dtcg.json` | Siam Light |
| `figma-import/siam-dark.dtcg.json` | Siam Dark |
| `figma-import/nara-light.dtcg.json` | Nara Light |
| `figma-import/nara-dark.dtcg.json` | Nara Dark |
| `figma-import/parich-light.dtcg.json` | Parich Light |
| `figma-import/parich-dark.dtcg.json` | Parich Dark |

วิธี: แผง **Variables** → เลือก collection **`mode`** → คลิกขวาหัวคอลัมน์ → **Import mode**

ถ้าตัว import ไม่รับ `.dtcg.json` ให้ใช้ `.flat.json` แทน

**ตรวจหลังทำ:** ต้องเห็น `success` `success-solid` `warning-solid` `danger` `brand` ในลิสต์

### 1.2 ความโค้ง — collection ที่เก็บ `radius-*`

| ไฟล์ | โหมด | ปุ่ม |
|---|---|---|
| `radius-sharp` | Sharp | 0px |
| `radius-standard` | Standard | 8px |
| `radius-friendly` | Friendly | 14px |
| `radius-pill` | Pill | แคปซูล |

### 1.3 ฟอนต์ — `tw/font` → `family/sans`

| ไฟล์ | ค่า |
|---|---|
| `font-ibm` | IBM Plex Sans Thai |
| `font-prompt` | Prompt |
| `font-sarabun` | Sarabun |

**ตอนนี้ในไฟล์คุณยังเป็น `Inter` อยู่** (ตรวจด้วย MCP แล้ว) ต้องเปลี่ยนข้อนี้

---

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
| **โทนสีพื้น** (`data-tint`) | ❌ | ใช้ `color-mix()` แปลงเป็น hex ตายตัวไม่ได้ |
| **ความห่าง** (`data-density`) | ❌ | ตัดสินใจไว้แล้วว่าทำเฉพาะในโค้ด (ตัวเลือก B) |

`packages/tokens/src/tint.css` ถูกข้ามใน `scripts/build-figma-tokens.mjs` โดยตั้งใจ
ถ้าอยากได้โทนพวกนี้ใน Figma ต้องคำนวณค่าออกมาเป็น hex ล่วงหน้าแล้วทำเป็น mode แยก
(`pure` ทำง่ายเพราะเป็นค่าคงที่ชุดเดียวใช้ได้ทุกแบรนด์ ส่วน `blend` ต้องทำ 6 ชุด)

---

## 5. ตรวจงานหลังทำเสร็จ

- [ ] สลับโหมดใน `mode` แล้วสีเปลี่ยนทั้งไฟล์จริง (ไม่ใช่แค่บาง frame)
- [ ] สลับ collection ความโค้ง แล้วปุ่ม/การ์ด/input โค้งตาม
- [ ] `family/sans` เป็น Sarabun และตัวหนังสือในทุก component เปลี่ยนตาม
- [ ] Badge ครบ 15 ช่อง ไม่มีช่องไหนตั้ง opacity ต่ำกว่า 100%
- [ ] Alert แบบ Warning เป็นเหลือง (ไม่ใช่น้ำตาล) ในโหมดมืด
- [ ] Alert แบบ Destructive เป็นแดงชัด (ไม่ใช่ม่วง/น้ำตาล) ในโหมดมืด

---

## 6. เมื่อ DS เปลี่ยนอีกในอนาคต

```bash
git pull && pnpm tokens:figma
```

แล้วดูว่าไฟล์ไหนใน `figma-import/` เปลี่ยน แล้ว import ทับเฉพาะ mode นั้น
**ไม่ต้องสร้าง component ใหม่** ถ้าเปลี่ยนแค่ค่าสี เพราะ component ผูกกับ variable อยู่แล้ว

ต้องกลับมาแก้ component ก็ต่อเมื่อมี **variant ใหม่** หรือ **โครงเปลี่ยน** เท่านั้น
