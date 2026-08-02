# ไฟล์สำหรับนำเข้า Figma

สร้างด้วย `pnpm tokens:figma` — **อย่าแก้ไฟล์ในโฟลเดอร์นี้ด้วยมือ**
แก้ที่ `packages/tokens/src/<brand>.css` แล้วรันสคริปต์ใหม่

## มีอะไรบ้าง

3 แบรนด์ × 2 โหมด × 2 รูปแบบ ทุกไฟล์มีเฉพาะ **สี** (52 ตัว)
ส่วน `radius` และ `font-sans` เป็นแกนสไตล์แยก ไม่ได้อยู่ในไฟล์แบรนด์แล้ว
จึงออกมาเป็นไฟล์ของตัวเอง สำหรับ collection คนละอันใน Figma

| ไฟล์ | จำนวน | ใส่ลง collection |
|---|---|---|
| `siam-light` … `parich-dark` | 6 | `mode` |
| `radius-sharp` … `radius-pill` | 4 | ความโค้ง |
| `font-ibm` `font-prompt` `font-sarabun` | 3 | ฟอนต์ (`family/sans`) |

| นามสกุล | รูปแบบ | ใช้กับ |
|---|---|---|
| `.dtcg.json` | มาตรฐาน W3C — `{ "$type": "color", "$value": "#F97316" }` | ตัวนำเข้าส่วนใหญ่ |
| `.flat.json` | คู่ชื่อกับค่า — `{ "primary": "#F97316" }` | ตัวนำเข้าที่รับแบบง่าย |

ลองแบบ `.dtcg.json` ก่อน ถ้าไม่ผ่านค่อยลอง `.flat.json`

## ตารางประกอบตอนสร้าง component ใน Figma

**Alert** — 4 variant ทุกช่องเป็น variable ตัวเดียว opacity 100%

| variant | พื้น | ตัวอักษร | เส้นขอบ |
|---|---|---|---|
| default | `card` | `card-foreground` | `border` |
| warning | `warning` | `warning-foreground` | `warning-border` |
| brand | `brand` | `foreground` | `primary` |
| destructive | `danger` | `danger-foreground` | `danger-border` |

**Badge** — ทำเป็น property 2 ตัว `Tone` (5 ค่า) x `Appearance` (3 ค่า) = 15 variant

| Tone | Solid พื้น / ตัวอักษร | Soft พื้น / ตัวอักษร | Outline เส้นขอบ / ตัวอักษร |
|---|---|---|---|
| Brand | `primary` / `primary-foreground` | `brand` / `foreground` | `primary` / `foreground` |
| Success | `success-solid` / `success-solid-foreground` | `success` / `success-foreground` | `success-border` / `success-foreground` |
| Warning | `warning-solid` / `warning-solid-foreground` | `warning` / `warning-foreground` | `warning-border` / `warning-foreground` |
| Danger | `destructive` / `destructive-foreground` | `danger` / `danger-foreground` | `danger-border` / `danger-foreground` |
| Neutral | `foreground` / `background` | `secondary` / `secondary-foreground` | `border` / `secondary-foreground` |

แบบ Soft ใช้เส้นขอบตัวเดียวกับ Outline ส่วนแบบ Solid ไม่มีเส้นขอบ

**Button `outline-primary`** — พื้น `background` · เส้นขอบ `primary` · ตัวอักษร `primary`
· hover พื้นเป็น `brand`

## วิธีใช้กับ Import mode ของ Figma

1. เปิดแผง Variables → เลือก collection ที่ component ผูกอยู่จริง (ไฟล์ shadcn
   community ใช้ชื่อ `mode`)
2. คลิกขวาที่หัวคอลัมน์โหมดที่ต้องการ → **Import mode**
3. เลือกไฟล์ของโหมดนั้น เช่น `parich-light.dtcg.json` ลงคอลัมน์ light mode

**ต้อง import ลง collection ที่ component ใช้อยู่เท่านั้น** ถ้าไปสร้าง collection ใหม่
ต่อให้ชื่อ variable ตรงกันเป๊ะ สีก็จะไม่เปลี่ยน เพราะ Figma อ้างอิงด้วย ID ไม่ใช่ชื่อ

## ผลข้างเคียงที่ต้องรู้

ในไฟล์ community ค่าของ collection `mode` เป็น **alias** ชี้ไปที่ `tw/colors`
(เห็นเป็น `neutral/950`, `red/600` แทนที่จะเป็น hex)

พอ import ค่า hex ทับ **alias จะขาด กลายเป็นค่าดิบ** — ใช้งานได้ปกติทุกอย่าง
แต่จะไม่ผูกกับชุดสีพื้นฐานอีกต่อไป ซึ่งตรงกับโครงสร้างในโค้ดเราที่ไม่มีชั้น primitive อยู่แล้ว

ถ้าอยากเก็บของเดิมไว้ ให้ **Duplicate mode** ก่อน แล้ว import ลงโหมดที่ copy มา
