/**
 * สร้างไฟล์ shadcn registry จาก source ของ @peckey954/ui
 *
 *   node scripts/build-registry.mjs
 *   REGISTRY_URL=https://your-domain.com/r node scripts/build-registry.mjs
 *
 * ผลลัพธ์ไปอยู่ที่ apps/web/public/r/*.json ซึ่ง Next.js เสิร์ฟให้ตรง ๆ
 * เดฟปลายทางติดตั้งด้วย: pnpm dlx shadcn@latest add <REGISTRY_URL>/button.json
 *
 * หมายเหตุสำคัญ: import ภายในไลบรารีเขียนเป็น "@peckey954/ui/..." ซึ่งใช้กับ
 * โปรเจกต์ที่ก็อปโค้ดไปไม่ได้ สคริปต์นี้จึงเขียนใหม่เป็น alias "@/..." ให้
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const UI_SRC = join(ROOT, "packages/ui/src");
const TOKENS_SRC = join(ROOT, "packages/tokens/src");
const OUT_DIR = join(ROOT, "apps/web/public/r");

// ใช้ localhost เป็นค่าเริ่มต้นเพื่อให้ทดสอบในเครื่องได้ทันที
// ตอน deploy จริงให้ตั้ง REGISTRY_URL เป็นโดเมนจริงก่อน build
const REGISTRY_URL = (process.env.REGISTRY_URL ?? "http://localhost:3000/r").replace(/\/$/, "");

/** package.json ของ ui — ใช้หาเวอร์ชันของ dependency แต่ละตัว */
const uiPkg = JSON.parse(readFileSync(join(ROOT, "packages/ui/package.json"), "utf8"));

/** เขียน import ภายในไลบรารีใหม่ให้ชี้ alias ของโปรเจกต์ปลายทาง */
function rewriteImports(code) {
  return code
    .replace(/@peckey954\/ui\/components\//g, "@/components/")
    .replace(/@peckey954\/ui\/hooks\//g, "@/hooks/")
    .replace(/@peckey954\/ui\/lib\//g, "@/lib/");
}

/** ดึงรายชื่อ module ที่ไฟล์นี้ import */
function importsOf(code) {
  const specifiers = [
    ...code.matchAll(/from\s+"([^"]+)"/g),
    // dynamic import — ต้องจับด้วย ไม่งั้น dependency ที่โหลดแบบ lazy
    // (เช่น pdfjs-dist ใน file-preview) จะหายไปจาก registry ทั้งที่จำเป็น
    ...code.matchAll(/\bimport\(\s*"([^"]+)"/g),
    // ไฟล์ asset ที่ bundler ต้องปล่อยออกมา เช่น worker ของ pdf.js
    ...code.matchAll(/new URL\(\s*"([^"]+)"/g),
  ].map((m) => m[1]);
  const internal = new Set();
  const external = new Set();

  for (const spec of specifiers) {
    if (spec.startsWith("@peckey954/ui/components/ui/")) {
      internal.add(spec.replace("@peckey954/ui/components/ui/", ""));
      continue;
    }
    if (spec.startsWith("@peckey954/ui/hooks/")) {
      internal.add(spec.replace("@peckey954/ui/hooks/", ""));
      continue;
    }
    // lib/utils มากับ shadcn init อยู่แล้ว ไม่ต้องประกาศเป็น dependency
    if (spec.startsWith("@peckey954/ui/lib/")) continue;
    if (spec.startsWith(".") || spec === "react" || spec === "react-dom") continue;

    // ตัดให้เหลือชื่อแพ็กเกจ เช่น "radix-ui" หรือ "@scope/name"
    const name = spec.startsWith("@")
      ? spec.split("/").slice(0, 2).join("/")
      : spec.split("/")[0];
    external.add(name);
  }
  return { internal: [...internal], external: [...external] };
}

/** ใส่เวอร์ชันตาม package.json ของ ui เพื่อให้ปลายทางได้ของที่เข้ากันได้ */
function withVersion(name) {
  const range = uiPkg.dependencies?.[name];
  return range ? `${name}@${range}` : name;
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR, { recursive: true });

const items = [];

/* ------------------------------- hook -------------------------------- */

const hookFiles = readdirSync(join(UI_SRC, "hooks")).filter((f) => f.endsWith(".ts"));
for (const file of hookFiles) {
  const name = file.replace(/\.ts$/, "");
  const raw = readFileSync(join(UI_SRC, "hooks", file), "utf8");
  items.push({
    name,
    type: "registry:hook",
    dependencies: [],
    registryDependencies: [],
    files: [
      {
        path: `hooks/${file}`,
        content: rewriteImports(raw),
        type: "registry:hook",
        target: `hooks/${file}`,
      },
    ],
  });
}

/* ----------------------------- components ----------------------------- */

const componentFiles = readdirSync(join(UI_SRC, "components/ui")).filter((f) =>
  f.endsWith(".tsx")
);

for (const file of componentFiles) {
  const name = file.replace(/\.tsx$/, "");
  const raw = readFileSync(join(UI_SRC, "components/ui", file), "utf8");
  const { internal, external } = importsOf(raw);

  items.push({
    name,
    type: "registry:ui",
    dependencies: external.map(withVersion).sort(),
    // ต้องเป็น URL เต็ม — ถ้าใส่แค่ชื่อ shadcn จะไปดึงจาก registry ทางการแทนของเรา
    registryDependencies: internal.sort().map((dep) => `${REGISTRY_URL}/${dep}.json`),
    files: [
      {
        path: `components/ui/${file}`,
        content: rewriteImports(raw),
        type: "registry:ui",
        target: `components/ui/${file}`,
      },
    ],
  });
}

/* -------------------------------- theme -------------------------------- */
// คำศัพท์กลาง (@theme inline) + ค่าจริงของแบรนด์ ต้องมี ไม่งั้น bg-primary ไม่มีสี

items.push({
  name: "theme",
  type: "registry:file",
  dependencies: ["tw-animate-css"],
  registryDependencies: [],
  files: [
    {
      path: "styles/ds-theme.css",
      content: readFileSync(join(UI_SRC, "styles/globals.css"), "utf8"),
      type: "registry:file",
      target: "styles/ds-theme.css",
    },
    {
      path: "styles/brand-blue.css",
      content: readFileSync(join(TOKENS_SRC, "blue.css"), "utf8"),
      type: "registry:file",
      target: "styles/brand-blue.css",
    },
    {
      path: "styles/brand-green.css",
      content: readFileSync(join(TOKENS_SRC, "green.css"), "utf8"),
      type: "registry:file",
      target: "styles/brand-green.css",
    },
    /* styles.css ต้องส่งไปด้วยเสมอ — ตอนที่ย้าย --radius กับ --font-sans ออกจาก
       ไฟล์แบรนด์มาไว้ที่นี่ ลืมเพิ่มตรงนี้ คนที่ติดตั้งผ่าน registry เลยไม่มี
       --radius (มุมกลายเป็นเหลี่ยมหมด) และไม่มี --font-sans
       ตอนนี้ยังมีสี badge กลุ่มติดป้ายหมวดหมู่อยู่ในไฟล์นี้อีกด้วย */
    {
      path: "styles/ds-axes.css",
      content: readFileSync(join(TOKENS_SRC, "styles.css"), "utf8"),
      type: "registry:file",
      target: "styles/ds-axes.css",
    },
  ],
});

/* ------------------------------ เขียนไฟล์ ------------------------------ */

for (const item of items) {
  writeFileSync(
    join(OUT_DIR, `${item.name}.json`),
    JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry-item.json", ...item }, null, 2) + "\n"
  );
}

// ดัชนีรวม — ให้คนเปิดดูได้ว่ามีอะไรบ้าง
writeFileSync(
  join(OUT_DIR, "index.json"),
  JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "peckey954-ds",
      homepage: "https://github.com/peckey954/ds",
      items: items.map((i) => ({
        name: i.name,
        type: i.type,
        url: `${REGISTRY_URL}/${i.name}.json`,
      })),
    },
    null,
    2
  ) + "\n"
);

console.log(`สร้าง registry ${items.length} รายการที่ apps/web/public/r/`);
console.log(`base URL ที่ฝังไว้: ${REGISTRY_URL}`);
