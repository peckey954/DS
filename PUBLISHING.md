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
| `@peckey954/tokens` | สีของแบรนด์ Blue · Green · Parich + `styles.css` (radius/density/font) + `tint.css` |

> เวอร์ชันล่าสุดที่ปล่อยแล้ว: `@peckey954/ui` **0.2.1** (6 ส.ค. 2569) ·
> `@peckey954/tokens` **0.2.0** (3 ส.ค. 2569)
>
> สองแพ็กเกจนี้ขึ้นเวอร์ชันแยกกันได้ ไม่ต้องเท่ากัน — แก้เฉพาะ component
> ก็ bump แค่ `ui` ไม่ต้องแตะ `tokens`

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

> **ห้ามใส่ token ลงไฟล์ในโปรเจกต์** เด็ดขาด ที่เดียวที่ใส่ได้คือ `~/.npmrc`
> ซึ่งอยู่นอก repo

**ถ้า `npm login` ใช้ไม่ได้ ให้ข้ามไปหัวข้อ [กู้สิทธิ์ publish](#กู้สิทธิ์-publish-เมื่อขึ้น-401--eneedauth)**
ซึ่งไม่ต้องพึ่ง `npm login` เลย

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
| `patch` | แก้บั๊ก แก้สี ปรับ spacing | 0.2.0 → 0.2.1 |
| `minor` | เพิ่ม component ใหม่ เพิ่ม prop ใหม่ | 0.2.0 → 0.3.0 |
| `major` | เปลี่ยนแล้วโปรเจกต์เดิมพัง เช่น ลบ prop เปลี่ยนชื่อ component | 0.2.0 → 1.0.0 |

```bash
cd packages/ui
npm version patch --no-git-tag-version
cd ../..

git add -A
git commit -m "chore: bump @peckey954/ui to 0.2.1"
git push

pnpm --filter @peckey954/ui publish
```

**ถ้าเปลี่ยน API ของ component ต้องกลับไปแก้ [USE-DS.md](USE-DS.md) ด้วย**
เพราะ prompt ในนั้นเขียนกฎไว้ตายตัว (เช่น `Badge` ใช้ `tone` × `appearance`)
ถ้า npm กับเอกสารไม่ตรงกัน คนที่รับ prompt ไปใช้จะเขียนโค้ดแล้วพัง

## กู้สิทธิ์ publish เมื่อขึ้น 401 / ENEEDAUTH

**อ่านตรงนี้ก่อนไปหาที่อื่น** — เจอบ่อยและแก้ได้ใน 5 นาที

### ก่อนอื่น: token ที่ใช้อยู่หมดอายุเมื่อไหร่

ตัวปัจจุบันเป็น **Granular Access Token อายุ 30 วัน สร้างเมื่อ 3 ส.ค. 2569
จะหมดอายุราว 2 ก.ย. 2569** — npm ไม่ให้ตั้งแบบ "ไม่หมดอายุ" อีกแล้ว
ตอนสร้างใหม่เลือกได้สูงสุด 90 วัน

**token หมดอายุไม่ได้ทำให้แพ็กเกจหาย** ของที่ปล่อยไปแล้วอยู่บน npm ตลอดไป
คนอื่นยัง `pnpm add` ได้ตามปกติ สิ่งเดียวที่ทำไม่ได้คือปล่อยเวอร์ชันใหม่

### เช็คสถานะ

```bash
npm whoami
```

- ขึ้น `peckey954` → auth ปกติ ปัญหาอยู่ที่อื่น
- ขึ้น `ENEEDAUTH` → token หมดอายุหรือหายไป ทำตามข้างล่าง

### วิธีแก้ — สร้าง token ใหม่ (ไม่ต้องใช้ `npm login`)

1. ล็อกอิน [npmjs.com](https://www.npmjs.com) ในเบราว์เซอร์
2. ไปที่ [Access Tokens](https://www.npmjs.com/settings/peckey954/tokens) → ลบตัวเก่าทิ้ง
3. **Generate New Token → Granular Access Token**
   - Token name: `publish-ds`
   - Expiration: 90 days
   - Permissions: **Read and write**
   - Select packages: `@peckey954/ui` และ `@peckey954/tokens`
4. กด Generate แล้ว **ก๊อป token ทันที** (โชว์ครั้งเดียว)
5. เปิดไฟล์ credentials

   ```bash
   touch ~/.npmrc && open -e ~/.npmrc
   ```

6. ใส่บรรทัดนี้ (พิมพ์เอง แล้ว **วาง** token ต่อท้าย `=` ไม่เว้นวรรค)

   ```
   //registry.npmjs.org/:_authToken=npm_xxxxxxxxxxxx
   ```

   เซฟแล้วปิด

7. เช็ค

   ```bash
   npm whoami
   ```

   ต้องขึ้น `peckey954`

8. กลับมา publish ต่อได้เลย แล้วอัปเดตวันหมดอายุที่หัวข้อนี้ด้วย

### ถ้า publish แล้วขึ้น `EOTP`

```
npm error code EOTP
npm error This operation requires a one-time password.
npm error Open this URL in your browser to authenticate:
npm error   https://www.npmjs.com/auth/cli/xxxxxxxx
```

**อันนี้ไม่ใช่ error จริง เป็นการขอยืนยัน 2FA** ทำสามขั้น

1. Cmd+คลิกลิงก์ที่มันพิมพ์ (หรือก๊อปไปวางในเบราว์เซอร์ — **รีบ ลิงก์หมดอายุเร็ว**)
2. กด **Confirm** ในหน้าเว็บ
3. กลับมาพิมพ์ `npm publish` ซ้ำอีกครั้ง คราวนี้จะผ่าน

ต้องทำแบบนี้ทีละแพ็กเกจ

### ถ้า npm ไม่ส่ง OTP ทางอีเมลมาให้

ปัญหานี้ทำให้ `npm login` ใช้ไม่ได้เลย (เจอมาแล้วตอนปล่อย 0.2.0)
ให้ข้ามไปใช้วิธี Granular Access Token ข้างบนแทน ซึ่งไม่พึ่งอีเมล

ทางแก้ถาวรคือเข้า **Account → Two-Factor Authentication** เปลี่ยนจากอีเมล
เป็น **Authenticator app** (Google Authenticator / Authy / 1Password)
เลขจะขึ้นในแอปทันที ไม่ต้องรอเมลและไม่ตกถังขยะ

### ถ้าจะปล่อยเวอร์ชันบ่อย

พิจารณาตั้ง **Trusted Publishing ผ่าน GitHub Actions** (OIDC) — npm ยืนยันตัวตน
กับ GitHub โดยตรง ไม่ต้องเก็บ token ในเครื่อง ไม่มีวันหมดอายุ ตั้งครั้งเดียวจบ

## ตรวจก่อน publish

```bash
pnpm --filter @peckey954/ui pack --pack-destination /tmp
tar tzf /tmp/peckey954-ui-<เวอร์ชัน>.tgz
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
- [ ] `npm whoami` ขึ้น `peckey954` (ถ้าไม่ขึ้น → [กู้สิทธิ์ publish](#กู้สิทธิ์-publish-เมื่อขึ้น-401--eneedauth))
- [ ] ขึ้นเวอร์ชันใน `packages/ui/package.json` (และ `tokens` ถ้าแก้ token)
- [ ] `pnpm --filter @peckey954/ui publish`
- [ ] เช็คว่าขึ้นจริง: `npm view @peckey954/ui version`
- [ ] ถ้าเปลี่ยน API → อัปเดตกฎใน `AGENTS.md` และ prompt ใน `USE-DS.md` ให้ตรง
- [ ] `REGISTRY_URL=<โดเมนจริง> pnpm registry` แล้ว commit ไฟล์ใน `apps/web/public/r`
- [ ] push ขึ้น GitHub เพื่อให้ Vercel deploy registry เวอร์ชันใหม่
