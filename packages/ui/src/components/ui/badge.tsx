import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@peckey954/ui/lib/utils"

/**
 * Badge แยกเป็น 2 มิติ ตรงกับที่ Figma ใช้ property 2 ตัว
 *
 *   tone        สีตามความหมาย — brand / success / warning / danger / neutral
 *   appearance  แบบ           — solid (เข้ม) / soft (อ่อน) / outline (เส้นขอบ)
 *
 * ทำไมถึงส่งค่าผ่านตัวแปร --bdg-* แทนที่จะเขียน 15 คู่ผสม
 * เพราะ tone x appearance = 5 x 3 = 15 แบบ ถ้าเขียนตรง ๆ ทุกคู่ต้องแก้ 3 ที่
 * ทุกครั้งที่เพิ่มสีใหม่ วิธีนี้ tone ตั้งค่าสี appearance หยิบไปใช้
 * เพิ่ม tone ใหม่ = เพิ่มบรรทัดเดียว
 *
 * ค่าที่ tone ต้องตั้งให้ครบ 6 ตัว
 *   --bdg-solid        พื้นทึบ
 *   --bdg-on-solid     ตัวอักษรบนพื้นทึบ
 *   --bdg-solid-hover  พื้นทึบตอน hover (ใช้เมื่อ badge เป็นลิงก์)
 *   --bdg-surface      พื้นอ่อน
 *   --bdg-text         ตัวอักษรบนพื้นอ่อนและบนแบบ outline
 *   --bdg-border       เส้นขอบ
 */
const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      tone: {
        /* brand ใช้ --primary ที่มีอยู่แล้ว ไม่สร้าง token ซ้ำ
           เส้นขอบใช้ --primary เต็ม ให้ตรงกับกรอบ radio ตอนถูกเลือกและ Alert brand */
        brand:
          "[--bdg-solid:var(--primary)] [--bdg-on-solid:var(--primary-foreground)] [--bdg-solid-hover:var(--primary-hover)] [--bdg-surface:var(--brand)] [--bdg-text:var(--foreground)] [--bdg-border:var(--primary)]",
        success:
          "[--bdg-solid:var(--success-solid)] [--bdg-on-solid:var(--success-solid-foreground)] [--bdg-solid-hover:var(--success-solid-hover)] [--bdg-surface:var(--success)] [--bdg-text:var(--success-foreground)] [--bdg-border:var(--success-border)]",
        warning:
          "[--bdg-solid:var(--warning-solid)] [--bdg-on-solid:var(--warning-solid-foreground)] [--bdg-solid-hover:var(--warning-solid-hover)] [--bdg-surface:var(--warning)] [--bdg-text:var(--warning-foreground)] [--bdg-border:var(--warning-border)]",
        /* danger ใช้ --destructive ที่มีอยู่แล้วเป็นพื้นทึบ ไม่สร้าง token ซ้ำ */
        danger:
          "[--bdg-solid:var(--destructive)] [--bdg-on-solid:var(--destructive-foreground)] [--bdg-solid-hover:var(--destructive-hover)] [--bdg-surface:var(--danger)] [--bdg-text:var(--danger-foreground)] [--bdg-border:var(--danger-border)]",
        /* neutral แบบทึบใช้ --foreground เป็นพื้น จะได้ต่างจากแบบอ่อนจริง ๆ
           ถ้าใช้ --secondary ทั้งคู่ solid กับ soft จะหน้าตาเหมือนกัน */
        neutral:
          "[--bdg-solid:var(--foreground)] [--bdg-on-solid:var(--background)] [--bdg-solid-hover:var(--muted-foreground)] [--bdg-surface:var(--secondary)] [--bdg-text:var(--secondary-foreground)] [--bdg-border:var(--border)]",

        /* ----- สีติดป้ายหมวดหมู่ ไม่ผูกกับความหมาย -----
           ห้าเอาไปใช้แทนสีสถานะ (success/warning/danger) เด็ดขาด
           คนอ่านจะแยกไม่ออกว่าสีไหนแปลว่า "ผ่าน" สีไหนแค่ "หมวด A"
           ค่าอยู่ใน packages/tokens/src/styles.css ใช้ร่วมทุกแบรนด์ */
        info:
          "[--bdg-solid:var(--info-solid)] [--bdg-on-solid:var(--info-solid-foreground)] [--bdg-solid-hover:var(--info-solid-hover)] [--bdg-surface:var(--info)] [--bdg-text:var(--info-foreground)] [--bdg-border:var(--info-border)]",
        teal:
          "[--bdg-solid:var(--teal-solid)] [--bdg-on-solid:var(--teal-solid-foreground)] [--bdg-solid-hover:var(--teal-solid-hover)] [--bdg-surface:var(--teal)] [--bdg-text:var(--teal-foreground)] [--bdg-border:var(--teal-border)]",
        sky:
          "[--bdg-solid:var(--sky-solid)] [--bdg-on-solid:var(--sky-solid-foreground)] [--bdg-solid-hover:var(--sky-solid-hover)] [--bdg-surface:var(--sky)] [--bdg-text:var(--sky-foreground)] [--bdg-border:var(--sky-border)]",
        indigo:
          "[--bdg-solid:var(--indigo-solid)] [--bdg-on-solid:var(--indigo-solid-foreground)] [--bdg-solid-hover:var(--indigo-solid-hover)] [--bdg-surface:var(--indigo)] [--bdg-text:var(--indigo-foreground)] [--bdg-border:var(--indigo-border)]",
        purple:
          "[--bdg-solid:var(--purple-solid)] [--bdg-on-solid:var(--purple-solid-foreground)] [--bdg-solid-hover:var(--purple-solid-hover)] [--bdg-surface:var(--purple)] [--bdg-text:var(--purple-foreground)] [--bdg-border:var(--purple-border)]",
        pink:
          "[--bdg-solid:var(--pink-solid)] [--bdg-on-solid:var(--pink-solid-foreground)] [--bdg-solid-hover:var(--pink-solid-hover)] [--bdg-surface:var(--pink)] [--bdg-text:var(--pink-foreground)] [--bdg-border:var(--pink-border)]",
        orange:
          "[--bdg-solid:var(--orange-solid)] [--bdg-on-solid:var(--orange-solid-foreground)] [--bdg-solid-hover:var(--orange-solid-hover)] [--bdg-surface:var(--orange)] [--bdg-text:var(--orange-foreground)] [--bdg-border:var(--orange-border)]",
      },
      appearance: {
        solid:
          "bg-(--bdg-solid) text-(--bdg-on-solid) [a&]:hover:bg-(--bdg-solid-hover)",
        soft: "border-(--bdg-border) bg-(--bdg-surface) text-(--bdg-text)",
        outline: "border-(--bdg-border) text-(--bdg-text)",
      },
    },
    defaultVariants: {
      tone: "brand",
      appearance: "solid",
    },
  }
)

function Badge({
  className,
  tone,
  appearance,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ tone, appearance }), className)}
      {...props}
    />
  )
}

/**
 * ปุ่มปิดใน badge — ใช้กับ chip ที่ลบออกได้
 *
 * รับสีจากตัวอักษรของ badge เอง (`currentColor`) จึงเปลี่ยนตาม tone
 * และ appearance ให้อัตโนมัติ ไม่ต้องส่งสีเข้ามา
 *
 *   <Badge tone="info" appearance="soft">
 *     ลูกค้าใหม่
 *     <BadgeButton aria-label="ลบ" onClick={remove}><XIcon /></BadgeButton>
 *   </Badge>
 */
function BadgeButton({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="badge-button"
      className={cn(
        "-mr-1 inline-flex size-4 shrink-0 items-center justify-center rounded-full text-current transition-[background-color,opacity]",
        "opacity-70 hover:bg-current/20 hover:opacity-100",
        "focus-visible:ring-[2px] focus-visible:ring-current/50 focus-visible:outline-none",
        "disabled:pointer-events-none disabled:opacity-40",
        "[&>svg]:size-3 [&>svg]:shrink-0",
        className
      )}
      {...props}
    />
  )
}


export { Badge, BadgeButton, badgeVariants }
