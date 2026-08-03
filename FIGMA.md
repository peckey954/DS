# Design system นี้ใน Figma

เป้าหมาย: ดีไซเนอร์ออกแบบใน Figma จาก component ชุดเดียวกับที่โค้ดใช้ แล้วส่งกลับมา
เป็นโค้ดที่ใช้ `@peckey954/ui` ได้เลย — ไม่ต้องวาดใหม่ ไม่ต้องเขียน component ใหม่

กฎการเขียนโค้ด UI อยู่ที่ [AGENTS.md](AGENTS.md) · วิธีติดตั้ง DS ในโปรเจกต์อื่นอยู่ที่
[USE-DS.md](USE-DS.md) ไฟล์นี้เฉพาะฝั่ง Figma

---

## MCP ของ Figma ทำอะไรได้บ้าง

มี 2 ชุดคนละหน้าที่ **อย่าสับสน**

| ชุด | ทำอะไรได้ | ใช้ตอนไหน |
|---|---|---|
| `figma-dev` (Dev Mode) | **อ่านอย่างเดียว** — `get_design_context` `get_metadata` `get_variable_defs` `get_screenshot` | แปลงดีไซน์เป็นโค้ด |
| `figma` (remote MCP) | **เขียนได้** — `use_figma` รัน JavaScript ผ่าน Figma Plugin API | ให้ AI วาด/แก้หน้าจอใน Figma |

```bash
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

`use_figma` สร้าง frame · วาง instance ของ component · แก้ข้อความ · ผูกตัวแปร ·
จัด auto-layout ได้ทั้งหมด ทิศทางจึงเป็นสองทางจริง ๆ

```
Figma  <──อ่าน/เขียน──>  AI  <──>  โค้ดใน VSCode
```

**แต่ยังมีอย่างที่ทำมือเร็วกว่า** — การนำเข้าตัวแปรสีทีละร้อยค่าให้ใช้ Tokens Studio
(ข้อ 2) ส่วนการประกอบ component library ครั้งแรกให้ duplicate ไฟล์ community (ข้อ 1)

### ข้อควรระวังเวลาใช้ `use_figma`

- **สคริปต์ล้มเหลว = ไม่ถูกรันเลย** ไฟล์ไม่เปลี่ยน แก้แล้วรันซ้ำได้ปลอดภัย
  **แต่ถ้า timeout ให้เช็คสถานะจริงก่อน** เพราะอาจรันไปแล้วแต่คำตอบไม่กลับมา
- **`get_metadata` ของ section ใหญ่ ๆ คืนมาเป็นแสนตัวอักษร** (section QC RM = 537,000)
  ให้เจาะเฉพาะ node ที่ต้องใช้ อย่าดึงทั้ง section
- **แก้ข้อความต้องโหลดฟอนต์ก่อน** ทุกครั้ง ไม่งั้นได้ `Cannot write to node with unloaded font`
  โหลดจาก `getStyledTextSegments(['fontName'])` ของ node นั้น อย่า hardcode ชื่อฟอนต์
- **`layoutSizing*` กับ `*AxisSizingMode` คนละชุดค่า** — `layoutSizingHorizontal` รับ
  `FIXED|HUG|FILL` ส่วน `counterAxisSizingMode` รับ `FIXED|AUTO` เท่านั้น
- ตั้ง `FILL` ได้หลัง `appendChild` เข้า auto-layout parent แล้วเท่านั้น

---

## ขั้นที่ 1 — สร้างไฟล์ library

**อย่าไล่ก็อป component ทีละตัว** ให้ duplicate ทั้งไฟล์ เร็วกว่ามากและไม่มีอะไรตกหล่น

1. เปิดไฟล์ community — ค้นหา *"shadcn ui components with variables Tailwind classes"*
2. **Duplicate to your drafts**
3. เปลี่ยนชื่อไฟล์เป็น `DS — <ชื่อแบรนด์>`

ทำไมใช้ไฟล์นี้: DS ของเราสร้างบน shadcn อยู่แล้ว component จึงตรงกับโค้ดเรา และ
**ชื่อ variables ตรงกันเกือบทั้งหมด** — `primary` `primary-foreground` `secondary`
`accent` `destructive` `background` `foreground` `muted-foreground` `border` ครบ

### สิ่งที่ต้องเติมเอง

| เรื่อง | ต้องทำอะไร |
|---|---|
| token `*-hover` | ไฟล์ community ไม่มี ต้องเพิ่ม `primary-hover` `secondary-hover` `accent-hover` `destructive-hover` |
| token สีความหมาย | `warning*` `danger*` `success*` `brand` ไม่มีในไฟล์นั้น |
| `multi-select` | เป็น component ที่เราทำเอง ต้องประกอบใน Figma เอง |
| `radius` | เราใช้ตัวเดียว (`--radius`) แต่ไฟล์นั้นแยกเป็น `radius-md` / `radius-lg` / `radius-full` |

---

## ขั้นที่ 2 — นำเข้าตัวแปร (ประมาณ 15 นาที)

```bash
git pull
pnpm tokens:figma
```

ได้ `figma-tokens.json` ที่ root — ไฟล์ Tokens Studio ที่รวม **19 ชุด** ครบทั้งสามหมวด
import ทีเดียวได้ 3 collection ไม่ต้องนำเข้าทีละโหมด

| collection | mode | ที่มา |
|---|---|---|
| `mode` | **12** — 3 แบรนด์ × สว่าง/มืด × ตามแบรนด์/แยกสี | สี 52 ตัวต่อโหมด |
| `radius` | 4 — Sharp · Standard · Friendly · Pill | `radius-sm/md/lg/xl` |
| `font` | 3 — IBM Plex Sans Thai · Prompt · Sarabun | `family/sans` |

### ขั้นตอน

1. เปิดปลั๊กอิน **Tokens Studio for Figma** ในไฟล์ที่ต้องการ
2. เมนู **Tools → Load from file/folder** → เลือก `figma-tokens.json`
3. ไปแท็บ **Themes** จะเห็นธีมจัดกลุ่มเป็น 3 collection ตามตารางข้างบน
4. กด **Export to Figma** → เลือกทุกธีม → ยืนยัน

### ⚠️ ก่อนกด Export ต้องเช็คชื่อ collection ให้ตรงก่อน

**นี่คือจุดที่พลาดบ่อยที่สุด** — Export ขึ้นเขียวหมด ค่าถูกทุกตัว แต่สีใน Figma ไม่เปลี่ยนสักนิด

สาเหตุ: Figma ผูก component กับ variable ด้วย **ID ไม่ใช่ชื่อ** ถ้า Tokens Studio ไปสร้าง
collection ใหม่ ต่อให้ตั้งชื่อ variable ตรงกันเป๊ะ component ก็ยังชี้ไปที่ตัวเดิมอยู่ดี

เปิดแผง **Variables** ในไฟล์ Figma ดูว่า collection ที่ component ผูกอยู่ชื่ออะไรจริง ๆ
(คลิก component → ดูช่อง Fill → คลิกชิปชื่อ variable → Figma บอกว่าอยู่ collection ไหน)
ถ้าไม่ตรงกับ `mode` / `radius` / `font` ให้สร้างไฟล์ใหม่ด้วยชื่อที่ถูก

```bash
FIGMA_COLLECTION=<ชื่อจริง> \
FIGMA_RADIUS_COLLECTION=<ชื่อจริง> \
FIGMA_FONT_COLLECTION=<ชื่อจริง> \
pnpm tokens:figma
```

ใน `$themes` ของไฟล์ที่สคริปต์สร้าง: `group` → ชื่อ **Collection** · `name` → ชื่อ **Mode**

### ผลข้างเคียงที่ต้องรู้

ในไฟล์ community ค่าใน collection `mode` เป็น **alias** ชี้ไป `tw/colors`
(เห็นเป็น `neutral/950`, `red/600` แทนที่จะเป็น hex)

พอ import ค่า hex ทับ **alias จะขาด กลายเป็นค่าดิบ** ใช้งานได้ปกติทุกอย่าง แต่จะไม่ผูก
กับชุดสีพื้นฐานอีก — ตรงกับโครงในโค้ดเราที่ไม่มีชั้น primitive อยู่แล้ว
ถ้าอยากเก็บของเดิมไว้ ให้ **Duplicate mode** ก่อนแล้ว import ลงตัวที่ copy มา

### ถ้าไม่อยากใช้ Tokens Studio

ในโฟลเดอร์ `figma-import/` มีไฟล์แยกรายโหมดสำหรับ Import mode ของ Figma หรือปลั๊กอินอื่น —
`*.dtcg.json` (มาตรฐาน W3C) และ `*.flat.json` (คู่ชื่อกับค่า) ลอง `.dtcg` ก่อน

### ตั้งค่าไฟล์หลัง import

- [ ] ย้าย **Parich Light** ขึ้นเป็นโหมดแรกของ collection `mode`
      โหมดแรก = ค่าเริ่มต้นของทั้งไฟล์ ทุก frame ที่ไม่ได้กำหนดโหมดจะใช้ตัวนี้
- [ ] ตั้ง `family/sans` = **Sarabun**

### เวลาแก้สีทีหลัง

แก้ที่ `packages/tokens/src/<brand>.css` → `pnpm tokens:figma` → ดูว่าไฟล์ไหนใน
`figma-import/` เปลี่ยน → import ทับเฉพาะ mode นั้น

**ไม่ต้องสร้าง component ใหม่** ถ้าเปลี่ยนแค่ค่าสี เพราะ component ผูกกับ variable อยู่แล้ว
ต้องกลับมาแก้ component ก็ต่อเมื่อมี **variant ใหม่** หรือ **โครงเปลี่ยน** เท่านั้น

---

## ขั้นที่ 3 — สร้าง / แก้ component (ประมาณ 1 ชั่วโมง)

> **กติกาข้อเดียวที่ครอบทุกอย่าง** — Figma ผูก opacity กับ variable ไม่ได้
> ทุกค่าในเอกสารนี้จึงเป็นสีทึบหมด ตั้ง opacity 100% ทุกช่อง
> ถ้าเห็นตัวเองกำลังจะลด opacity แปลว่าหยิบ token ผิดตัว

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

property `Tone` (5) × `Appearance` (3) = **15 variant**

| Tone | Solid พื้น / ตัวอักษร | Soft พื้น / ตัวอักษร | Outline เส้นขอบ / ตัวอักษร |
|---|---|---|---|
| Brand | `primary` / `primary-foreground` | `brand` / `foreground` | `primary` / `foreground` |
| Success | `success-solid` / `success-solid-foreground` | `success` / `success-foreground` | `success-border` / `success-foreground` |
| Warning | `warning-solid` / `warning-solid-foreground` | `warning` / `warning-foreground` | `warning-border` / `warning-foreground` |
| Danger | `destructive` / `destructive-foreground` | `danger` / `danger-foreground` | `danger-border` / `danger-foreground` |
| Neutral | `foreground` / `background` | `secondary` / `secondary-foreground` | `border` / `secondary-foreground` |

- Soft ใช้เส้นขอบตัวเดียวกับ Outline · Solid ไม่มีเส้นขอบ
- ทรง: มุมโค้งเต็ม (pill) · padding 2/8 · ตัวอักษร 12 · ไอคอน 12

### 3.3 ตาราง — ต้องบังคับความสูงแถวเอง

**นี่คือจุดที่ Figma ต่างจากโค้ดมากที่สุด** ในเว็บ `<table>` จัดความสูงให้ทุกช่องในแถว
เท่ากันเอง แต่ใน Figma ตารางคือ auto-layout แนวนอนของ "คอลัมน์" ซึ่งแต่ละคอลัมน์
เป็นแท่งแนวตั้งของตัวเอง **Figma จึงปล่อยให้แต่ละคอลัมน์สูงอิสระกัน**
พอหัวตารางช่องหนึ่งเป็นสองบรรทัด เส้นคั่นจะหยักขึ้นลงทันที

    ตาราง (HORIZONTAL)
      └ คอลัมน์ (VERTICAL)
           ├ Table Base / Header
           └ Table Base / Cell

**สูตรความสูง**

| แถว | ค่า |
|---|---|
| หัวตาราง | ความสูงมากสุดของทุกช่องในแถว (72px เมื่อมีสองบรรทัด) |
| แถวข้อมูล | **เนื้อหาสูงสุด + 8 บน + 8 ล่าง** |

ตั้งทุกช่องในแถวเดียวกันเป็น `FIXED` ที่ค่านั้น และตั้งช่องเป็น
`counterAxisAlignItems = "CENTER"` ช่องไฟจึงเท่ากันบนล่างจริง

> **ตัวเลขของ Figma กับของเว็บไม่เท่ากัน และไม่ต้องทำให้เท่า** — แถวที่มี input
> ในเว็บสูง **52** (input 36 + 8 + 8) แต่ใน Figma สูง **56** (input 40 + 8 + 8)
> เพราะ component คนละความสูงกัน สิ่งที่ต้องเหมือนคือ **ช่องไฟ 8px** ไม่ใช่ตัวเลขรวม

**⚠️ ห้ามใช้ `HUG` เพื่อ "วัดแล้วปล่อย"** — `Table Base / Cell` มี padding บนล่าง
เป็น **0** พอสั่ง HUG มันจะยุบลงเท่าความสูง input พอดีเป๊ะ ไม่เหลือช่องไฟเลย
(เคยพลาดมาแล้ว ได้แถวสูง 40 แทนที่จะเป็น 56)

**ปิด truncation ของ label หัวตาราง** ไม่งั้นข้อความยาวจะกลายเป็น `…`

```js
const PAD = 8;
for (const stack of table.children) {
  const cell = stack.children[1];
  const kids = (cell.children || []).filter((c) => c.height > 0);
  // ...หา max ของ kids ทุกคอลัมน์ก่อน แล้วค่อยตั้ง FIXED = max + PAD * 2
}
```

ความสูงนี้ล็อกไว้ ถ้าเพิ่มข้อความจนยาวสองบรรทัดต้องสั่งจัดใหม่
ถ้าอยากให้ยืดเอง ต้องรื้อโครงจาก "คอลัมน์" เป็น "แถว" แล้วตั้ง `STRETCH`

### 3.4 Button — เพิ่ม variant

| Variant | พื้น | ตัวอักษร | เส้นขอบ | hover |
|---|---|---|---|---|
| Outline primary | `background` | `primary` | `primary` | พื้นเป็น `brand` |

### 3.5 ไอคอน — หลัง swap ต้องผูกสีเองทุกครั้ง

**ไอคอน Lucide วาดด้วย `stroke` ไม่ใช่ `fill`** และเวลา swap ไอคอนเข้าช่อง
`Icon Leading` / `Icon Trailing` ของปุ่ม **มันเอาการผูกสีของตัวไอคอนเองติดมาด้วย**
ปุ่มคุมได้แค่สีตัวอักษร ไอคอนที่ swap เข้ามาใหม่จึงกลายเป็นสีดำ ไม่ตามสีปุ่ม

ไม่ใช่ความผิดของ component — เป็นข้อจำกัดของการ swap ใน Figma
ถ้าใช้ไอคอนที่ติดมากับปุ่มตั้งแต่แรกจะไม่เจอปัญหานี้
**ในโค้ดไม่เจอปัญหานี้** เพราะ Lucide ใช้ `stroke="currentColor"` รับสีมาเอง

**ห้ามแก้ด้วยการทาสีทับตรง ๆ** เพราะจะไม่เปลี่ยนตามเวลาสลับ variant หรือเปลี่ยน
สีแบรนด์ ให้อ่านว่าตัวอักษรของปุ่มนั้นผูกกับตัวแปรอะไร แล้วเอาตัวแปรตัวเดียวกัน
ไปผูกกับ `strokes` ของไอคอน

```js
const label = btn.findAllWithCriteria({ types: ["TEXT"] }).find((t) => t.visible);
const varId = label.fills[0]?.boundVariables?.color?.id;
const colorVar = await figma.variables.getVariableByIdAsync(varId);

for (const vec of btn.findAllWithCriteria({ types: ["VECTOR"] })) {
  if (!vec.strokes.length) continue;
  vec.strokes = vec.strokes.map((s) =>
    figma.variables.setBoundVariableForPaint(s, "color", colorVar)
  );
}
```

**เช็คเร็ว ๆ** — ถ้าไอคอนในปุ่มเป็นสีดำ แปลว่ายังไม่ได้ผูก

### 3.6 Checkbox / Radio แบบมีกรอบ

สถานะถูกเลือกต้องใช้ **พื้น `brand` + เส้นขอบ `primary`** ซึ่งเป็นชุดเดียวกับ Alert
แบบ Brand และ Badge แบบ Brand outline **ถ้าแก้ที่ใดที่หนึ่งต้องแก้ทุกที่**

### 3.7 ข้อความต้องผูกกับ text style

อย่าตั้ง font family / size / weight เองรายชิ้น ผูกกับ text style เสมอ
ไม่งั้นเปลี่ยนโหมดฟอนต์แล้วจะมีข้อความบางตัวไม่เปลี่ยนตาม

---

## 4. ความโค้ง 4 แบบ

DS มีแกนสไตล์เพิ่มมาสองแกน — **ความโค้ง** กับ **ความห่าง** แต่ใน Figma ทำเฉพาะความโค้ง

**ทำไมไม่ทำความห่างด้วย** — Tailwind แตก spacing เป็นตัวแปรทีละค่า (`p-1` ถึง `p-96`)
รวมแล้วราว **770 ตัว** กระจายใน 7 collection ถ้าทำ 3 โหมดคือต้องกรอก 2,310 ค่า
ส่วนความโค้งมีแค่ 10 ตัว × 4 โหมด = 40 ค่า **ต่างกัน 50 เท่า**

และสองแกนนี้คนละคนตัดสินใจ

| | ใครเลือก | ต้องเห็นตอนไหน |
|---|---|---|
| ความโค้ง | ดีไซเนอร์ — เป็นบุคลิกของแบรนด์ | ตอนออกแบบ |
| ความห่าง | ทีมพัฒนา — ขึ้นกับว่าแอปข้อมูลหนาแน่นแค่ไหน | ตั้งครั้งเดียวตอนเริ่มโปรเจกต์ |

ดีไซน์ที่ความห่างปกติอย่างเดียวก็พอ แล้วเดฟใส่ `data-density="compact"` บรรทัดเดียว

| โหมด | `radius-sm` | `radius-md` | `radius-lg` | `radius-xl` |
|---|---|---|---|---|
| Sharp | 0 | 0 | 0 | 4 |
| Standard | 6 | 8 | 10 | 14 |
| Friendly | 12 | 14 | 16 | 20 |
| Pill | 24 | 26 | 28 | 32 |

> Pill ไม่ได้ตั้ง 9999 เพราะ `rounded-md` ถูกใช้ทั้งปุ่มและแผงดรอปดาวน์
> ถ้าดันสุดแผงจะกลายเป็นวงรี — ตั้ง 26px แล้วปล่อยให้เบราว์เซอร์จำกัดให้เอง
> ปุ่มสูง 32–45px จึงกลายเป็นแคปซูลเต็ม ส่วนแผงสูง 174px ได้แค่มุมมน

---

## 5. อะไรยกเข้า Figma ได้บ้าง

| แกน | เข้า Figma ได้ไหม | เหตุผล |
|---|---|---|
| สี (แบรนด์ × โหมด) | ✅ 6 mode | |
| **โทนสีพื้น แยกสี** (`pure`) | ✅ 6 mode เพิ่ม | คำนวณเป็น hex ล่วงหน้าให้แล้ว |
| **โทนสีพื้น ผสมแบรนด์** (`blend`) | ✅ = 6 mode แรก | ชุดแรกคือ blend อยู่แล้ว |
| ความโค้ง | ✅ 4 mode | |
| ฟอนต์ | ✅ 3 ค่า | |
| **ความห่าง** (`data-density`) | ❌ | ทำเฉพาะในโค้ด — เหตุผลอยู่ในข้อ 4 |

**โทนสีพื้นทำเป็น collection แยกไม่ได้** เพราะมันเขียนทับตัวแปรชุดเดียวกับที่ `mode`
ถืออยู่ (`background` `card` `border` …) layer หนึ่งผูกกับตัวแปรได้ตัวเดียว
จึงต้องทำเป็น **mode เพิ่ม** ในคอลเลกชันเดิม รวมเป็น 12 mode

    3 แบรนด์ × สว่าง/มืด × ผสมแบรนด์/แยกสี = 12

`--brand` เป็น `color-mix()` จึงคำนวณไว้ล่วงหน้าในสคริปต์ (primary ผสมลง card
5% โหมดสว่าง · 10% โหมดมืด) ส่วนตัวอื่นในโทน `pure` เป็น `hsl()` ตายตัวอยู่แล้ว

`tint.css` เองไม่ได้ถูกอ่านเข้า Figma โดยตรง — `scripts/build-figma-tokens.mjs`
ข้ามไว้ใน `NOT_BRAND_FILES` เพราะ `color-mix()` แปลงเป็น hex ตายตัวไม่ได้

---

## 6. แปลงดีไซน์กลับเป็นโค้ด

### สิ่งที่ต้องมี

| ต้องมี | หมายเหตุ |
|---|---|
| Figma **desktop app** | Dev Mode MCP คุยกับแอปเดสก์ท็อป ใช้บนเว็บไม่ได้ |
| เปิด **Dev Mode MCP Server** | ในแอป → Preferences → เปิดสวิตช์ |
| แผน Figma ที่รองรับ Dev Mode | ต้องเป็น seat แบบ Dev/Full บนแผนเสียเงิน — Starter ใช้ไม่ได้ |

(ส่วน remote MCP ที่ `use_figma` ใช้ ไม่ต้องมีแอปเดสก์ท็อป)

### คำสั่ง

```
อ่านดีไซน์ที่เลือกอยู่ใน Figma แล้วสร้างหน้านี้ขึ้นมา

- ใช้ component จาก @peckey954/ui เท่านั้น ห้ามเขียน component ใหม่
- ใช้ token เท่านั้น ห้าม hardcode สีจากค่าที่อ่านได้จาก Figma
- อ่านกฎที่ AGENTS.md ก่อนเริ่ม
```

**บรรทัดที่ 2 กับ 3 ขาดไม่ได้** — โดยธรรมชาติ MCP จะคืนโค้ดที่เขียน component ใหม่
ตั้งแต่ต้นพร้อม hardcode สีเป็น hex ที่อ่านได้จาก Figma ซึ่งทำลายระบบ token ทั้งหมด
ถ้าโปรเจกต์นั้นมี `AGENTS.md` อยู่ AI จะอ่านเองอยู่แล้ว แต่สั่งย้ำไว้ก็ไม่เสียหาย

---

## 7. ตรวจงานหลังทำเสร็จ

- [ ] สลับโหมดใน `mode` แล้วสีเปลี่ยนทั้งไฟล์จริง (ไม่ใช่แค่บาง frame)
- [ ] สลับ collection ความโค้ง แล้วปุ่ม/การ์ด/input โค้งตาม
- [ ] `family/sans` เป็น Sarabun และตัวหนังสือในทุก component เปลี่ยนตาม
- [ ] Badge ครบ 15 ช่อง ไม่มีช่องไหนตั้ง opacity ต่ำกว่า 100%
- [ ] Alert แบบ Warning เป็นเหลือง (ไม่ใช่น้ำตาล) ในโหมดมืด
- [ ] Alert แบบ Destructive เป็นแดงชัด (ไม่ใช่ม่วง/น้ำตาล) ในโหมดมืด
- [ ] **ทุกช่องในแถวเดียวกันของตารางสูงเท่ากัน** เส้นคั่นลากตรงไม่หยัก
- [ ] ช่องที่มี input เหลือช่องไฟบนล่างข้างละ 8px ไม่ชนขอบตาราง
- [ ] **ไอคอนในปุ่มเป็นสีเดียวกับตัวอักษรของปุ่ม ไม่ใช่สีดำ** (ถ้าดำ = ยังไม่ได้ผูกหลัง swap)
- [ ] ข้อความทุกชิ้นผูกกับ text style ไม่ได้ตั้งฟอนต์เองรายชิ้น

---

## 8. ความเสี่ยงระยะยาว

**ไม่มีระบบเตือนอัตโนมัติว่า component ใน Figma กับในโค้ดยังตรงกันไหม**
ถ้าแก้ component ในโค้ดแล้วลืมแก้ใน Figma สองฝั่งจะเริ่มเพี้ยนจากกันทีละนิด

ควรตกลงกันในทีมว่า **ฝั่งไหนเป็นตัวตั้ง** เวลาสองฝั่งไม่ตรงกัน
(แนะนำให้โค้ดเป็นตัวตั้ง เพราะเป็นของที่ผู้ใช้เห็นจริง)

วิธีตรวจเร็ว ๆ — ส่งลิงก์ node แล้วสั่งว่า *"ตรวจว่า variable ใน Figma ตรงกับ
figma-tokens.json ไหม"* AI จะอ่านผ่าน MCP แล้วเทียบให้ทีละตัว เจอตัวไหนไม่ตรง
จะบอกชื่อกับค่าที่ควรเป็น

---

## ภาพรวมทั้งวงจร

```
packages/tokens/*.css          ← แหล่งความจริงของสี แก้ที่นี่ที่เดียว
        │
        ├── pnpm tokens:figma ──> figma-tokens.json ──> Tokens Studio ──> Figma Variables
        │
        └── npm / registry ─────────────────────────────> โค้ดในโปรเจกต์

Figma library (component + variables)
        │
        ├── ดีไซเนอร์ออกแบบหน้าจอ ──┐
        └── AI วาดผ่าน use_figma ───┤
                                    └── Dev Mode MCP อ่าน ──> โค้ดด้วย @peckey954/ui
```
