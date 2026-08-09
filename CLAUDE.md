# CLAUDE.md

## อ่าน [AGENTS.md](AGENTS.md) ก่อนเขียนโค้ดทุกครั้ง

กฎทั้งหมดของ design system นี้อยู่ใน **[AGENTS.md](AGENTS.md)** — ไฟล์นี้เป็นแค่ตัวชี้ทาง
ห้ามเขียนโค้ด UI โดยไม่อ่าน AGENTS.md ก่อน

สรุปสั้น ๆ (รายละเอียดเต็มอยู่ใน AGENTS.md):

1. ใช้ component จาก `@peckey954/ui/components/ui/*` เสมอ ห้ามเขียนเองถ้ามีอยู่แล้ว (มี 60 ตัว)
2. ใช้ token เท่านั้น (`bg-primary`, `text-foreground`, `bg-muted`, `border-border`, `text-muted-foreground` …) — ห้าม hardcode สี เช่น `#hex`, `bg-blue-500`, `bg-[...]`
3. ต่อ className ด้วย `cn()` จาก `@peckey954/ui/lib/utils`
4. เปลี่ยนสี/ฟอนต์ แก้ที่ `packages/tokens/src/<brand>.css` เท่านั้น ไม่แก้ในตัว component
5. dark/light จัดการด้วย token เขียนสีชุดเดียวพอ ไม่ต้องเขียน `dark:` คู่กับสี
6. เพิ่ม component ใหม่ด้วย `cd apps/web && pnpm dlx shadcn@latest add <name>`

## คำสั่ง

```bash
pnpm install
pnpm dev      # http://localhost:3000
pnpm build    # เช็ค type ให้ด้วย (pnpm lint ยังใช้ไม่ได้ — ดู AGENTS.md)
```
