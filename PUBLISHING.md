# การเผยแพร่ design system

repo นี้คือ **ตัวกลาง** ของดีไซน์ทั้งหมด แจกจ่ายออกไป 2 ช่องทางพร้อมกัน
เดฟจะเลือกใช้ทางไหนก็ได้ตามความเหมาะสม

| ช่องทาง | เดฟได้อะไร | เหมาะกับ |
|---|---|---|
| **npm (public)** | ติดตั้งเป็น dependency อัปเดตด้วย `pnpm update` | ทีมที่อยากได้ของใหม่อัตโนมัติ ไม่อยากดูแลโค้ด component เอง |
| **shadcn registry** | โค้ดถูกก็อปเข้าโปรเจกต์ แก้ได้อิสระ | คนที่อยากเป็นเจ้าของโค้ดเอง หรือต้องปรับ component ให้ต่างจากต้นฉบับ |

ทั้งสองทางใช้ source ชุดเดียวกันจาก `packages/ui` — แก้ที่เดียว ออกทั้งสองทาง

---

# ส่วนที่ 1 — publish ขึ้น npm

แพ็กเกจที่ publish:

| แพ็กเกจ | เนื้อหา |
|---|---|
| `@peckey954/ui` | component ทั้ง 55 ตัว + `cn()` + คำศัพท์กลาง (`globals.css`) |
| `@peckey954/tokens` | ค่าสี/ฟอนต์/radius ของแบรนด์ Siam และ Nara |

> เรา ship เป็น **source code** (ไม่ได้ build เป็น JS ล่วงหน้า) โปรเจกต์ปลายทาง
> จึงต้องตั้ง `transpilePackages` ใน `next.config`

## ครั้งแรก: เตรียมบัญชี npm (ทำครั้งเดียว)

### 1. สมัครบัญชี npm

1. ไปที่ https://www.npmjs.com/signup
2. **ตั้ง username เป็น `peckey954`** — สำคัญมาก เพราะ scope `@peckey954`
   จะเป็นของบัญชีที่ชื่อตรงกันเท่านั้น
   (ตรวจแล้วว่า scope นี้ยังว่างอยู่ ยังไม่มีใครใช้)
3. ยืนยันอีเมล
4. เปิด **2FA** ที่ https://www.npmjs.com/settings/~/profile — npm บังคับสำหรับคนที่ publish

### 2. ล็อกอินในเครื่อง

```bash
npm login
```

จะถามให้เปิดเบราว์เซอร์เพื่อยืนยันตัวตน ทำตามจนเสร็จ แล้วเช็คว่าได้จริง:

```bash
npm whoami
```

ขึ้น `peckey954` = พร้อม publish

> ไม่ต้องสร้างไฟล์ `.npmrc` หรือ token ใด ๆ — `npm login` จัดการให้เอง
> และ **ห้ามใส่ token ลงไฟล์ในโปรเจกต์** เด็ดขาด

## publish ครั้งแรก

```bash
pnpm --filter @peckey954/tokens publish
pnpm --filter @peckey954/ui publish
```

`publishConfig.access` ตั้งเป็น `public` ไว้แล้ว ไม่ต้องใส่ `--access public` เอง
(แพ็กเกจแบบมี scope ถ้าไม่ระบุ npm จะถือว่าเป็น private ซึ่งต้องเสียเงิน)

ถ้ามีไฟล์ค้างใน git ยังไม่ได้ commit pnpm จะไม่ยอม publish — commit ให้เรียบร้อยก่อน
หรือถ้ารู้ตัวว่าทำอะไรอยู่ ใช้ `--no-git-checks`

เสร็จแล้วดูได้ที่ https://www.npmjs.com/package/@peckey954/ui

## ขึ้นเวอร์ชันใหม่แล้ว publish ซ้ำ

npm ไม่ให้ publish ทับเวอร์ชันเดิม **ทุกครั้งที่แก้ต้องขึ้นเวอร์ชันก่อนเสมอ**

| แบบ | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| `patch` | แก้บั๊ก แก้สี ปรับ spacing | 0.1.0 → 0.1.1 |
| `minor` | เพิ่ม component ใหม่ เพิ่ม prop ใหม่ | 0.1.0 → 0.2.0 |
| `major` | เปลี่ยนแล้วโปรเจกต์เดิมพัง เช่น ลบ prop เปลี่ยนชื่อ component | 0.1.0 → 1.0.0 |

```bash
cd packages/ui
npm version patch --no-git-tag-version
cd ../..

git add -A
git commit -m "chore: bump @peckey954/ui to 0.1.1"
git push

pnpm --filter @peckey954/ui publish
```

## ตรวจก่อน publish

```bash
pnpm --filter @peckey954/ui pack --pack-destination /tmp
tar tzf /tmp/peckey954-ui-0.1.0.tgz
```

ควรเห็น `package/src/...` ครบทุก component พร้อม `package.json`, `README.md`, `LICENSE`
(สามไฟล์หลังนี้ npm ใส่ให้เสมอแม้ไม่ได้ระบุใน `files`)

---

# ส่วนที่ 2 — shadcn registry

ช่องทางนี้ทำให้เดฟรัน `pnpm dlx shadcn@latest add <url>` แล้วได้ **โค้ดจริงก็อปเข้าโปรเจกต์เขา**
เหมือนที่ใช้กับ shadcn/ui ทางการ ไม่ต้องติดตั้ง dependency ของเราเลย

## มันทำงานยังไง

`scripts/build-registry.mjs` อ่าน source จาก `packages/ui/src` แล้วสร้างไฟล์ JSON
ลง `apps/web/public/r/` ซึ่ง Next.js เสิร์ฟเป็นไฟล์ static ให้อัตโนมัติ

สคริปต์ทำ 3 อย่างที่สำคัญ:

1. **เขียน import ใหม่** จาก `@peckey954/ui/lib/utils` เป็น `@/lib/utils`
   — ถ้าไม่ทำ โค้ดที่ก็อปเข้าโปรเจกต์เดฟจะ resolve ไม่เจอ
2. **ไล่หา dependency เอง** จาก import จริงในไฟล์ พร้อมใส่เวอร์ชันให้ตรงกับที่เราใช้
3. **ใส่ `registryDependencies` เป็น URL เต็ม** — ถ้าใส่แค่ชื่อ `"button"`
   shadcn จะไปดึง button จาก registry ทางการแทนของเรา ซึ่งไม่มี size `xs`/`icon-xs` ที่เราเพิ่ม

## สร้าง registry

```bash
# ทดสอบในเครื่อง (ฝัง URL เป็น localhost:3000)
pnpm registry

# ก่อน deploy จริง ต้องระบุโดเมนจริง
REGISTRY_URL=https://ds-web-iota.vercel.app/r pnpm registry
```

`REGISTRY_URL` **ต้องตั้งให้ถูกก่อน deploy** เพราะมันถูกฝังลงใน `registryDependencies`
ของทุกไฟล์ ถ้าลืม เดฟที่ install component ที่พึ่งพา component อื่นจะไปโหลดจาก localhost ของตัวเอง

## deploy

registry คือไฟล์ static ธรรมดา deploy แอปตัวอย่างขึ้น Vercel ก็ได้ registry ไปด้วยเลย

```bash
REGISTRY_URL=https://ds-web-iota.vercel.app/r pnpm registry
git add apps/web/public/r
git commit -m "chore: rebuild registry for production"
git push
```

แล้วต่อ repo กับ Vercel (Root Directory = `apps/web`) จากนั้นเช็ค:

```
https://ds-web-iota.vercel.app/r/index.json     ← รายชื่อทั้งหมด
https://ds-web-iota.vercel.app/r/button.json    ← ตัว component
```

## อัปเดต registry เมื่อแก้ component

```bash
REGISTRY_URL=https://ds-web-iota.vercel.app/r pnpm registry
git add -A && git commit -m "chore: rebuild registry" && git push
```

> เดฟที่ใช้ทาง registry **จะไม่ได้ของใหม่อัตโนมัติ** เพราะโค้ดอยู่ในโปรเจกต์เขาแล้ว
> ต้องรันคำสั่ง add ซ้ำเองทีละ component ซึ่งเป็นข้อแลกเปลี่ยนของแนวทางนี้

---

## เช็คลิสต์ทุกครั้งที่ปล่อยของใหม่

- [ ] `pnpm build` ผ่าน
- [ ] ขึ้นเวอร์ชันใน `packages/ui/package.json` (และ `tokens` ถ้าแก้ token)
- [ ] `pnpm --filter @peckey954/ui publish`
- [ ] `REGISTRY_URL=<โดเมนจริง> pnpm registry` แล้ว commit ไฟล์ใน `apps/web/public/r`
- [ ] push ขึ้น GitHub เพื่อให้ Vercel deploy registry เวอร์ชันใหม่
