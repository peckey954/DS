# ทำ design system นี้ให้อยู่ใน Figma ด้วย

เป้าหมาย: ให้ดีไซเนอร์ออกแบบใน Figma จาก component ชุดเดียวกับที่โค้ดใช้
แล้วส่งกลับมาเป็นโค้ดที่ใช้ `@peckey954/ui` ได้เลย — ไม่ต้องวาดใหม่ ไม่ต้องเขียน component ใหม่

---

## ข้อจำกัดที่ต้องรู้ก่อน

**Figma MCP อ่านอย่างเดียว เขียนกลับเข้า Figma ไม่ได้**

เครื่องมือที่มีให้มี 4 ตัว — `get_design_context`, `get_metadata`, `get_variable_defs`,
`get_screenshot` — ทั้งหมดเป็นการอ่านทั้งสิ้น

แปลว่า **สั่ง AI ให้สร้าง component library ใน Figma ไม่ได้** ต้องประกอบด้วยมือ
หรือใช้ปลั๊กอินที่เขียนได้ (เช่น Tokens Studio) ทิศทางของ MCP คือ

```
Figma  ──อ่าน──>  AI  ──เขียน──>  โค้ดใน VSCode
```

ไม่ใช่ทางกลับกัน

---

## ขั้นที่ 1 — สร้างไฟล์ library ใน Figma

**อย่าไล่ก็อป component ทีละตัว** ให้ duplicate ทั้งไฟล์เลย เร็วกว่ามากและไม่มีอะไรตกหล่น

1. เปิดไฟล์ community นี้
   [shadcn/ui components with variables](https://www.figma.com/community) — ค้นหาคำว่า
   *"shadcn ui components with variables Tailwind classes"*
2. **Duplicate to your drafts**
3. เปลี่ยนชื่อไฟล์เป็น `DS — <ชื่อแบรนด์>`

ทำไมใช้ไฟล์นี้: DS ของเราสร้างบน shadcn อยู่แล้ว component ในไฟล์นั้นจึงตรงกับโค้ดเรา
และที่สำคัญคือ **ชื่อ variables ตรงกันเกือบทั้งหมด** — ตรวจแล้วมี `primary`,
`primary-foreground`, `secondary`, `accent`, `destructive`, `background`, `foreground`,
`muted-foreground`, `border` ครบ

### สิ่งที่ต้องเติมเอง

| เรื่อง | ต้องทำอะไร |
|---|---|
| token `*-hover` | ไฟล์ community ไม่มี ต้องเพิ่ม `primary-hover` `secondary-hover` `accent-hover` `destructive-hover` |
| `multi-select` | เป็น component ที่เราทำเอง ไม่มีในไฟล์นั้น ต้องประกอบใน Figma เอง |
| `radius` | เราใช้ตัวเดียว (`--radius`) แต่ไฟล์นั้นแยกเป็น `radius-md` / `radius-lg` / `radius-full` |

---

## ขั้นที่ 2 — ยิงสีของแบรนด์เข้า Figma อัตโนมัติ

ไม่ต้องนั่งพิมพ์สีทีละค่า (มี 38 ตัวแปร × 2 โหมด × จำนวนแบรนด์)

```bash
pnpm tokens:figma
```

จะได้ไฟล์ `figma-tokens.json` ที่ root ซึ่งแปลง `hsl()` เป็น hex ให้แล้ว
พร้อมแยกเป็นชุด `siam-light` `siam-dark` `nara-light` `nara-dark`

จากนั้นใน Figma:

1. ติดตั้งปลั๊กอิน **Tokens Studio for Figma**
2. เปิดปลั๊กอิน → **Import** → เลือกไฟล์ `figma-tokens.json`
3. กด **Push to Figma** → ปลั๊กอินจะสร้าง Variables ให้ครบทุกตัว

> ปลั๊กอินนี้ **เขียนเข้า Figma ได้** ต่างจาก MCP — นี่คือเหตุผลที่ต้องใช้มันแทน

### เพิ่มแบรนด์ใหม่

สร้างไฟล์ token ใหม่ใน `packages/tokens/src/<brand>.css` แล้วรัน `pnpm tokens:figma` ใหม่
สคริปต์อ่านทุกไฟล์ในโฟลเดอร์นั้นอัตโนมัติ ไม่ต้องแก้สคริปต์

### เวลาแก้สีทีหลัง

แก้ที่ `packages/tokens/src/<brand>.css` → `pnpm tokens:figma` → import ทับใน Tokens Studio

**แก้ที่เดียว ตรงกันทั้งโค้ดและ Figma** ไม่มีทางที่สองฝั่งจะเพี้ยนจากกัน

---

## ขั้นที่ 3 — ดีไซน์ แล้วแปลงกลับเป็นโค้ด

### สิ่งที่ต้องมี

| ต้องมี | หมายเหตุ |
|---|---|
| Figma **desktop app** | MCP คุยกับแอปเดสก์ท็อป ใช้บนเว็บไม่ได้ |
| เปิด **Dev Mode MCP Server** | ในแอป → Preferences → เปิดสวิตช์ |
| แผน Figma ที่รองรับ Dev Mode | ต้องเป็น seat แบบ Dev/Full บนแผนเสียเงิน — **เช็คกับบัญชีคุณก่อน** ถ้าเป็น Starter จะใช้ไม่ได้ |

### ขั้นตอน

1. ดีไซเนอร์ออกแบบหน้าจอใน Figma โดยใช้ component จาก library
2. เปิดโปรเจกต์ปลายทางใน VSCode → เปิด Claude Code
3. เลือก frame ใน Figma แล้วสั่ง:

```
อ่านดีไซน์ที่เลือกอยู่ใน Figma แล้วสร้างหน้านี้ขึ้นมา

- ใช้ component จาก @peckey954/ui เท่านั้น ห้ามเขียน component ใหม่
- ใช้ token เท่านั้น ห้าม hardcode สีจากค่าที่อ่านได้จาก Figma
- อ่านกฎที่ AGENTS.md ก่อนเริ่ม
```

**บรรทัดที่ 2 กับ 3 ขาดไม่ได้** — โดยธรรมชาติ MCP จะคืนโค้ดที่เขียน component ใหม่ตั้งแต่ต้น
พร้อม hardcode สีเป็น hex ที่อ่านได้จาก Figma ซึ่งทำลายทั้งระบบ token ที่เราสร้างมา
ถ้าโปรเจกต์นั้นมี [AGENTS.md](AGENTS.md) อยู่ AI จะอ่านเองอยู่แล้ว แต่สั่งย้ำไว้ก็ไม่เสียหาย

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
        └── ดีไซเนอร์ออกแบบหน้าจอ
                    │
                    └── MCP อ่าน ──> Claude Code เขียนโค้ดด้วย @peckey954/ui ──> VSCode
```

---

## สิ่งที่ยังต้องทำด้วยมือ (ไม่มีเครื่องมือช่วย)

- ประกอบ component ใน Figma (ถ้าไม่ duplicate จากไฟล์ community)
- สร้าง `multi-select` ใน Figma
- ตรวจว่า component ใน Figma กับในโค้ดยังตรงกันหลังแก้โค้ด — **ไม่มีระบบเตือนอัตโนมัติ**
  ถ้าแก้ component ในโค้ดแล้วลืมแก้ใน Figma สองฝั่งจะเริ่มเพี้ยนจากกันทีละนิด

ข้อสุดท้ายคือความเสี่ยงระยะยาวที่ใหญ่ที่สุดของการมี DS สองฝั่ง ควรตกลงกันในทีมว่า
**ฝั่งไหนเป็นตัวตั้ง** เวลาสองฝั่งไม่ตรงกัน (แนะนำให้โค้ดเป็นตัวตั้ง เพราะเป็นของที่ผู้ใช้เห็นจริง)
