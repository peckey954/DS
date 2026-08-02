/**
 * แปลง token CSS ของแต่ละแบรนด์ -> JSON ที่ import เข้า Figma ได้ผ่าน Tokens Studio
 *
 *   node scripts/build-figma-tokens.mjs
 *
 * ผลลัพธ์: figma-tokens.json ที่ root
 *
 * ทำไมต้องมี: Figma MCP อ่านอย่างเดียว เขียน variables เข้า Figma ไม่ได้
 * แต่ปลั๊กอิน Tokens Studio เขียนได้ ไฟล์นี้คือสะพานระหว่างสองฝั่ง
 * แก้สีใน packages/tokens ที่เดียว แล้วรันสคริปต์นี้ push เข้า Figma ได้เลย
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOKENS_SRC = join(ROOT, "packages/tokens/src");

/** hsl(221 83% 53%) -> #2563eb  (Figma variables รับเป็น hex) */
function hslToHex(input) {
  const m = input.match(
    /hsl\(\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*(?:\/\s*([\d.]+%?))?\s*\)/
  );
  if (!m) return null;
  const h = parseFloat(m[1]);
  const s = parseFloat(m[2]) / 100;
  const l = parseFloat(m[3]) / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const mm = l - c / 2;
  const seg = Math.floor(h / 60) % 6;
  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][seg];
  const hex = (v) =>
    Math.round((v + mm) * 255)
      .toString(16)
      .padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

/** 0.625rem -> 10 (Figma ใช้หน่วย px เป็นตัวเลข) */
function remToPx(value) {
  const m = value.match(/([\d.]+)rem/);
  return m ? Math.round(parseFloat(m[1]) * 16) : null;
}

/**
 * หาชื่อฟอนต์จริงจาก layout ของแอปตัวอย่าง
 * เดาจากชื่อ CSS variable ไม่ได้ เพราะ --font-ibm-thai จริง ๆ คือ "IBM Plex Sans Thai"
 * ถ้าเดาผิดดีไซเนอร์จะไปตั้งฟอนต์ที่ไม่มีอยู่จริงใน Figma
 */
function loadFontMap() {
  const map = {};
  try {
    const layout = readFileSync(join(ROOT, "apps/web/app/layout.tsx"), "utf8");
    // จับ:  const x = IBM_Plex_Sans_Thai({ ... variable: "--font-ibm-thai" ... })
    const re = /=\s*([A-Z][A-Za-z0-9_]*)\s*\(\{([\s\S]*?)\}\)/g;
    let m;
    while ((m = re.exec(layout))) {
      const v = m[2].match(/variable:\s*"(--[a-z0-9-]+)"/i);
      if (v) map[v[1]] = m[1].replace(/_/g, " ");
    }
  } catch {
    /* ไม่มีไฟล์ก็ปล่อยผ่าน ไปใช้ fallback ด้านล่าง */
  }
  return map;
}

const FONT_MAP = loadFontMap();
const unknownFonts = new Set();

/** var(--font-ibm-thai), ui-sans-serif, ... -> "IBM Plex Sans Thai" */
function fontName(value) {
  const m = value.match(/var\((--font-[a-z0-9-]+)\)/i);
  if (!m) return value.split(",")[0].trim();
  if (FONT_MAP[m[1]]) return FONT_MAP[m[1]];
  unknownFonts.add(m[1]);
  // fallback: แปลงจากชื่อตัวแปร ซึ่งอาจไม่ตรงชื่อฟอนต์จริง
  return m[1]
    .replace("--font-", "")
    .split("-")
    .map((w) => (w.length <= 3 ? w.toUpperCase() : w[0].toUpperCase() + w.slice(1)))
    .join(" ");
}

/** อ่านบล็อก CSS ทั้งหมดในไฟล์แบรนด์ คืน { selector: { var: value } } */
function parseBrandFile(css) {
  const blocks = {};
  const re = /\[data-brand="([^"]+)"\](\.dark)?\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const mode = m[2] ? "dark" : "light";
    const vars = {};
    for (const line of m[3].split("\n")) {
      const v = line.match(/--([a-z0-9-]+)\s*:\s*([^;]+);/i);
      if (v) vars[v[1].trim()] = v[2].trim();
    }
    blocks[`${m[1]}-${mode}`] = vars;
  }
  return blocks;
}

/** แปลง 1 บล็อกเป็นรูปแบบของ Tokens Studio */
function toTokenSet(vars) {
  const set = {};
  const skipped = [];

  for (const [name, raw] of Object.entries(vars)) {
    if (name === "radius") {
      const px = remToPx(raw);
      if (px != null) set[name] = { value: String(px), type: "borderRadius" };
      else skipped.push(`${name}: ${raw}`);
      continue;
    }
    if (name === "font-sans") {
      set[name] = { value: fontName(raw), type: "fontFamilies" };
      continue;
    }
    const hex = hslToHex(raw);
    if (hex) set[name] = { value: hex, type: "color" };
    // แปลงไม่ได้ต้องดังออกมา ไม่ใช่หายเงียบ ๆ ไม่งั้น Figma จะขาด variable
    // โดยไม่มีใครรู้ (รองรับเฉพาะ hsl() — ถ้าเขียนเป็น hex หรือ oklch จะตกตรงนี้)
    else skipped.push(`${name}: ${raw}`);
  }
  return { set, skipped };
}

const out = {};
const summary = [];
const allSkipped = [];

/* ไฟล์ที่ไม่ได้เก็บสีของแบรนด์ ต้องข้าม
   - styles.css  เป็นแกนความโค้ง/ความห่าง อ่านแยกอยู่ด้านล่างแล้ว
   - tint.css    ใช้ color-mix() ซึ่งแปลงเป็น hex ตายตัวไม่ได้ */
const NOT_BRAND_FILES = new Set(["styles.css", "tint.css"]);

for (const file of readdirSync(TOKENS_SRC).filter(
  (f) => f.endsWith(".css") && !NOT_BRAND_FILES.has(f)
)) {
  const blocks = parseBrandFile(readFileSync(join(TOKENS_SRC, file), "utf8"));
  for (const [setName, vars] of Object.entries(blocks)) {
    const { set, skipped } = toTokenSet(vars);
    out[setName] = set;
    summary.push({ ชุด: setName, ตัวแปร: Object.keys(set).length, แปลงไม่ได้: skipped.length });
    if (skipped.length) allSkipped.push({ setName, skipped });
  }
}

const setOrder = Object.keys(out);

/**
 * $themes คือส่วนที่บอก Tokens Studio ว่าจะเขียนลง Figma ตรงไหน
 *   group -> ชื่อ Collection
 *   name  -> ชื่อ Mode ภายใน collection นั้น
 *
 * ต้องตั้ง group ให้ตรงกับ collection ที่ component ผูกอยู่จริง ไม่งั้น Tokens Studio
 * จะสร้าง collection ใหม่ที่ไม่มีใครใช้ แล้วสีใน Figma จะไม่เปลี่ยนแม้ import สำเร็จ
 *
 * ไฟล์ shadcn community ใช้ collection ชื่อ "mode" — เปลี่ยนได้ด้วย:
 *   FIGMA_COLLECTION=<ชื่อ> pnpm tokens:figma
 */
const FIGMA_COLLECTION = process.env.FIGMA_COLLECTION ?? "mode";

const titled = (s) => s[0].toUpperCase() + s.slice(1);

out.$themes = setOrder.map((name) => {
  const [brand, mode] = name.split("-");
  return {
    id: name,
    // ตั้งชื่อ mode ให้ไม่ชนกับ Light/Dark เดิมของไฟล์ จะได้ไม่ทับธีมต้นฉบับ
    name: `${titled(brand)} ${titled(mode)}`,
    group: FIGMA_COLLECTION,
    selectedTokenSets: { [name]: "enabled" },
  };
});
out.$metadata = { tokenSetOrder: setOrder };

writeFileSync(join(ROOT, "figma-tokens.json"), JSON.stringify(out, null, 2) + "\n");

/* ------------------- ไฟล์แยกรายโหมด สำหรับ Import mode ------------------- */
// Figma มีเมนู "Import mode" ที่นำเข้าลงคอลัมน์โหมดโดยตรง ไม่ต้องผ่านปลั๊กอิน
// แต่ยังไม่แน่ชัดว่ารับ schema ไหน จึงออกให้ 2 รูปแบบต่อโหมด
const IMPORT_DIR = join(ROOT, "figma-import");
mkdirSync(IMPORT_DIR, { recursive: true });

for (const setName of setOrder) {
  // เอาเฉพาะสี — radius กับ font อยู่คนละ collection (tw/border-radius, tw/font)
  // ถ้าปนไปด้วยจะไปสร้างตัวแปรเกินใน collection ของสี
  const colors = Object.entries(out[setName]).filter(([, v]) => v.type === "color");

  // แบบ A — DTCG ($value / $type) เป็นมาตรฐานกลางที่เครื่องมือส่วนใหญ่รองรับ
  const dtcg = {};
  for (const [k, v] of colors) dtcg[k] = { $type: v.type, $value: v.value.toUpperCase() };
  writeFileSync(
    join(IMPORT_DIR, `${setName}.dtcg.json`),
    JSON.stringify(dtcg, null, 2) + "\n"
  );

  // แบบ B — flat ชื่อ -> ค่า เผื่อตัวนำเข้าที่รับแค่คู่ key/value ธรรมดา
  const flat = {};
  for (const [k, v] of colors) flat[k] = v.value.toUpperCase();
  writeFileSync(
    join(IMPORT_DIR, `${setName}.flat.json`),
    JSON.stringify(flat, null, 2) + "\n"
  );
}
console.log(`\nไฟล์แยกรายโหมดอยู่ที่ figma-import/ (อย่างละ .dtcg.json และ .flat.json)`);

/* --------------------- ไฟล์ความโค้ง สำหรับ Figma --------------------- */
/* อ่านค่าจาก styles.css โดยตรง จะได้ไม่มีตัวเลขซ้ำสองที่แล้วหลุดกัน
   สเกลคำนวณตามสูตรใน packages/ui/src/styles/globals.css:
     sm = r − 4px · md = r − 2px · lg = r · xl = r + 4px
   ส่วน none/xs/2xl/3xl/4xl/full เป็นค่าคงที่ของ Tailwind ที่เราไม่ได้ override */
const stylesCss = readFileSync(join(TOKENS_SRC, "styles.css"), "utf8");
const radiusStyles = {};
for (const m of stylesCss.matchAll(
  /html\[data-radius="([^"]+)"\]\s*\{[^}]*?--radius:\s*([\d.]+)rem/g
)) {
  radiusStyles[m[1]] = parseFloat(m[2]) * 16; // rem -> px
}

const FIXED_RADIUS = { "radius-none": 0, "radius-xs": 2, "radius-2xl": 16, "radius-3xl": 24, "radius-4xl": 32, "radius-full": 9999 };

for (const [style, px] of Object.entries(radiusStyles)) {
  const scale = {
    ...FIXED_RADIUS,
    "radius-sm": Math.max(0, px - 4),
    "radius-md": Math.max(0, px - 2),
    "radius-lg": px,
    "radius-xl": px + 4,
  };
  const order = ["radius-none","radius-xs","radius-sm","radius-md","radius-lg","radius-xl","radius-2xl","radius-3xl","radius-4xl","radius-full"];

  const dtcg = {};
  const flat = {};
  for (const k of order) {
    dtcg[k] = { $type: "number", $value: scale[k] };
    flat[k] = scale[k];
  }
  writeFileSync(join(IMPORT_DIR, `radius-${style}.dtcg.json`), JSON.stringify(dtcg, null, 2) + "\n");
  writeFileSync(join(IMPORT_DIR, `radius-${style}.flat.json`), JSON.stringify(flat, null, 2) + "\n");
}
console.log(
  `ไฟล์ความโค้ง ${Object.keys(radiusStyles).length} แบบ: ${Object.entries(radiusStyles)
    .map(([k, v]) => `${k}(${v}px)`)
    .join(" · ")}`
);

/* --------------------- ไฟล์ฟอนต์ สำหรับ Figma ---------------------- */
/* ฟอนต์ย้ายออกจากไฟล์แบรนด์มาเป็นแกน data-font แล้ว จึงต้องอ่านจาก styles.css
   เหมือนที่ทำกับความโค้ง ไม่งั้น Figma จะไม่มี variable ฟอนต์เลย */
const fontStyles = {};
for (const m of stylesCss.matchAll(
  /html\[data-font="([^"]+)"\]\s*\{[^}]*?--font-sans:\s*var\((--font-[a-z-]+)\)/g
)) {
  fontStyles[m[1]] = fontName(`--font-sans: var(${m[2]})`);
}

for (const [style, family] of Object.entries(fontStyles)) {
  writeFileSync(
    join(IMPORT_DIR, `font-${style}.dtcg.json`),
    JSON.stringify({ "family/sans": { $type: "fontFamily", $value: family } }, null, 2) + "\n"
  );
  writeFileSync(
    join(IMPORT_DIR, `font-${style}.flat.json`),
    JSON.stringify({ "family/sans": family }, null, 2) + "\n"
  );
}
console.log(
  `ไฟล์ฟอนต์ ${Object.keys(fontStyles).length} แบบ: ${Object.entries(fontStyles)
    .map(([k, v]) => `${k}(${v})`)
    .join(" · ")}`
);

console.table(summary);
console.log(`\nเขียนไฟล์ figma-tokens.json แล้ว — ${setOrder.length} ชุด: ${setOrder.join(", ")}`);

if (allSkipped.length) {
  console.error("\n❌ มี token ที่แปลงไม่ได้ — Figma จะขาด variable เหล่านี้:");
  for (const { setName, skipped } of allSkipped)
    for (const line of skipped) console.error(`   ${setName} -> ${line}`);
  console.error("   รองรับเฉพาะรูปแบบ hsl() เท่านั้น");
  process.exitCode = 1;
}

if (unknownFonts.size) {
  console.warn(
    `\n⚠️  หาชื่อฟอนต์จริงไม่เจอสำหรับ: ${[...unknownFonts].join(", ")}\n` +
      `   ชื่อที่ใส่ให้อาจไม่ตรงกับฟอนต์จริงใน Figma\n` +
      `   แก้ได้โดยโหลดฟอนต์นั้นใน apps/web/app/layout.tsx ด้วย next/font/google`
  );
}
