"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@peckey954/ui/components/ui/select";

import { BRANDS, useBrand, type Brand } from "./providers";
import { useLocale, useT } from "@/lib/i18n";

/**
 * จุดสีตัวอย่างของแต่ละแบรนด์
 *
 * ใส่ data-brand ลงบนตัว span เอง แล้วใช้ bg-primary ธรรมดา
 * เพราะกฎ [data-brand="..."] ใน token ทำงานกับ element ไหนก็ได้ ไม่จำเป็นต้อง <html>
 * --primary จึงคลี่เป็นสีของแบรนด์นั้น ๆ โดยไม่ต้อง hardcode สีเลย (กฎข้อ 2)
 *
 * หมายเหตุ: จุดจะโชว์สีของโหมดสว่างเสมอ เพราะกฎโหมดมืดคือ
 * [data-brand="x"].dark ซึ่งต้องมีทั้งสองอย่างบน element เดียวกัน
 * ไม่ใช่ปัญหา เพราะสีหลักของสองโหมดต่างกันแค่ความสว่างเล็กน้อย
 */
function Swatch({ brand }: { brand: Brand }) {
  return (
    <span
      data-brand={brand}
      aria-hidden
      // ไม่ใส่เส้นวงรอบจุด ด้วยสองเหตุผล
      // 1. ring วาดอยู่นอกกล่อง แต่จุดนี้ชิดขอบซ้ายของ SelectValue ซึ่งมี
      //    overflow:hidden เส้นฝั่งซ้ายเลยโดนตัดหายไป 1px ดูเหมือนวงกลมแหว่ง
      // 2. span นี้ไม่ได้รับ class dark (มันอยู่บน <html>) token จึงคลี่เป็นค่า
      //    โหมดสว่างเสมอ เส้นวงจะกลายเป็นสีอ่อนเด่นผิดที่เวลาอยู่โหมดมืด
      // สีหลักของทุกแบรนด์อิ่มพอที่จะเห็นชัดบนทั้งพื้นขาวและพื้นดำอยู่แล้ว
      className="size-3 shrink-0 rounded-full bg-primary"
    />
  );
}

export function BrandSwitcher() {
  const { brand, setBrand } = useBrand();
  const locale = useLocale();
  const t = useT();
  const current = BRANDS.find((b) => b.id === brand);

  return (
    <Select value={brand} onValueChange={(value) => setBrand(value as Brand)}>
      <SelectTrigger size="sm" className="w-32" aria-label={t("brand.aria")}>
        <SelectValue>
          <span className="flex items-center gap-2">
            {current ? <Swatch brand={current.id} /> : null}
            {current ? (locale === "en-US" ? current.labelEn : current.label) : null}
          </span>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {BRANDS.map((b) => (
          <SelectItem key={b.id} value={b.id}>
            <span className="flex items-center gap-2">
              <Swatch brand={b.id} />
              {locale === "en-US" ? b.labelEn : b.label}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
