# การ publish design system ขึ้น GitHub Packages

repo นี้คือ **ตัวกลาง** ของดีไซน์ทั้งหมด โปรเจกต์อื่น ๆ (คนละ repo) จะดึงไปใช้
ผ่าน npm package ส่วนตัวที่โฮสต์บน GitHub Packages

มี 2 แพ็กเกจที่ publish:

| แพ็กเกจ | เนื้อหา |
|---|---|
| `@peckey954/ui` | component ทั้ง 55 ตัว + `cn()` + คำศัพท์กลาง (`globals.css`) |
| `@peckey954/tokens` | ค่าสี/ฟอนต์/radius ของแบรนด์ Siam และ Nara |

> เรา ship เป็น **source code** (ไม่ได้ build เป็น JS ล่วงหน้า) โปรเจกต์ปลายทาง
> จึงต้องตั้ง `transpilePackages` ใน `next.config` — อธิบายไว้ใน
> [USING-IN-OTHER-PROJECTS.md](USING-IN-OTHER-PROJECTS.md)

---

## ครั้งแรก: เตรียม token (ทำครั้งเดียว)

### 1. สร้าง Personal Access Token บน GitHub

1. เข้า https://github.com/settings/tokens
2. กด **Generate new token** → เลือก **Generate new token (classic)**
   (ต้องเป็น classic เท่านั้น — fine-grained token ยังใช้กับ npm registry ของ
   GitHub Packages ไม่ได้)
3. ตั้งชื่อ เช่น `npm-packages` และเลือกวันหมดอายุ
4. ติ๊กสิทธิ์:
   - ✅ **`write:packages`** — สำหรับ publish
   - ✅ **`read:packages`** — สำหรับติดตั้งในโปรเจกต์อื่น
   - ✅ **`repo`** — จำเป็นเฉพาะเมื่อ repo `ds` ตั้งเป็น private
5. กด **Generate token** แล้ว **คัดลอกเก็บไว้ทันที** (GitHub แสดงให้ดูครั้งเดียว)

### 2. เก็บ token ไว้ที่ `~/.npmrc`

token เป็นความลับ **ห้ามใส่ในไฟล์ของโปรเจกต์** เด็ดขาด ให้เก็บไว้ที่ home directory:

```bash
echo "//npm.pkg.github.com/:_authToken=ใส่_TOKEN_ตรงนี้" >> ~/.npmrc
```

หรือเปิดแก้เองด้วย `nano ~/.npmrc` แล้วเพิ่มบรรทัด:

```
//npm.pkg.github.com/:_authToken=ghp_xxxxxxxxxxxxxxxxxxxx
```

จำกัดสิทธิ์ไฟล์ให้อ่านได้เฉพาะเรา:

```bash
chmod 600 ~/.npmrc
```

> `.npmrc` ที่อยู่ใน repo (root ของโปรเจกต์) มีแค่บรรทัดชี้ registry
> ไม่มี token — ปลอดภัยที่จะ commit

### 3. ตรวจว่าล็อกอินสำเร็จ

```bash
npm whoami --registry=https://npm.pkg.github.com
```

ถ้าขึ้นชื่อ `peckey954` แปลว่าใช้ได้แล้ว

---

## publish ครั้งแรก

publish **tokens ก่อน** แล้วค่อย ui (ไม่ได้บังคับตามลำดับ แต่ทำแบบนี้จะไม่สับสน):

```bash
pnpm --filter @peckey954/tokens publish
pnpm --filter @peckey954/ui publish
```

ถ้าติดว่ามีไฟล์ค้างใน git ยังไม่ได้ commit pnpm จะไม่ยอม publish — commit ให้เรียบร้อยก่อน
หรือถ้ารู้ตัวว่าทำอะไรอยู่ ใช้:

```bash
pnpm --filter @peckey954/tokens publish --no-git-checks
```

publish เสร็จแล้วดูได้ที่ https://github.com/peckey954?tab=packages

---

## ขึ้นเวอร์ชันใหม่แล้ว publish ซ้ำ

npm ไม่ให้ publish ทับเวอร์ชันเดิม **ทุกครั้งที่แก้ต้องขึ้นเวอร์ชันก่อนเสมอ**

### 1. เลือกว่าจะขึ้นเวอร์ชันแบบไหน

| แบบ | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|
| `patch` | แก้บั๊ก แก้สี ปรับ spacing | 0.1.0 → 0.1.1 |
| `minor` | เพิ่ม component ใหม่ เพิ่ม prop ใหม่ | 0.1.0 → 0.2.0 |
| `major` | เปลี่ยนแล้วโปรเจกต์เดิมพัง เช่น ลบ prop เปลี่ยนชื่อ component | 0.1.0 → 1.0.0 |

### 2. ขึ้นเวอร์ชัน

```bash
cd packages/ui
npm version patch --no-git-tag-version
cd ../..
```

(`--no-git-tag-version` = ไม่สร้าง git tag ให้อัตโนมัติ ถ้าอยากได้ tag ก็เอาออก)

หรือจะเปิด `packages/ui/package.json` แล้วแก้เลข `"version"` เองก็ได้

### 3. commit แล้ว publish

```bash
git add -A
git commit -m "chore: bump @peckey954/ui to 0.1.1"
git push
pnpm --filter @peckey954/ui publish
```

### 4. อัปเดตในโปรเจกต์ปลายทาง

ไปที่โปรเจกต์ที่ใช้ DS อยู่ แล้วรัน:

```bash
pnpm update @peckey954/ui
```

---

## ข้อควรรู้

- **ชื่อ scope ต้องตรงกับชื่อ GitHub** — GitHub Packages บังคับว่า `@peckey954/*`
  ต้อง publish จากบัญชี `peckey954` เท่านั้น ถ้าเปลี่ยนชื่อ GitHub ต้องเปลี่ยนชื่อแพ็กเกจตาม
- **repo private = แพ็กเกจ private** — คนอื่นจะติดตั้งได้ต้องมี token ที่มี `read:packages`
  และต้องได้รับสิทธิ์เข้าถึง repo ด้วย
- **`files: ["src"]`** — เรา ship เฉพาะโฟลเดอร์ `src` เท่านั้น ถ้าเพิ่มโฟลเดอร์อื่น
  ที่จำเป็นต้องใช้ตอนรัน อย่าลืมเพิ่มเข้าไปในรายการนี้
- **ทดสอบก่อน publish** ได้ด้วย `pnpm --filter @peckey954/ui pack` ซึ่งจะสร้างไฟล์ `.tgz`
  ให้ดูว่ามีไฟล์อะไรถูกใส่เข้าไปบ้าง
