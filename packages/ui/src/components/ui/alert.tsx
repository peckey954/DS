import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@peckey954/ui/lib/utils"

const alertVariants = cva(
  "relative grid w-full grid-cols-[0_1fr] items-start gap-y-0.5 rounded-lg border px-4 py-3 text-sm has-[>svg]:grid-cols-[calc(var(--spacing)*4)_1fr] has-[>svg]:gap-x-3 [&>svg]:size-4 [&>svg]:translate-y-0.5 [&>svg]:text-current",
  {
    variants: {
      variant: {
        default: "bg-card text-card-foreground",

        /* แบบมีสีพื้น — พื้นเป็นสีจาง /10 ทับพื้นหลังเดิม ไม่ใช่สีทึบ
           จึงกลับด้านเองอัตโนมัติในโหมดมืด ไม่ต้องเขียน dark: เลย

           ตัวอักษรใช้ token ตัวที่ตั้งมาสำหรับ "อยู่บนพื้นจาง" โดยเฉพาะ
           ห้ามใช้ text-destructive / text-warning ตรง ๆ เพราะสีไอคอนสดเกินไป
           วางบนพื้นจางแล้วคอนทราสต์ไม่ถึง 4.5:1 (วัดแล้วได้ราว 4.0)

           ไอคอนปล่อยให้รับสีจากตัวอักษร (base มี [&>svg]:text-current อยู่แล้ว)
           อย่าใส่ [&>svg]:text-warning / text-destructive ทับ — เคยลองแล้วคอนทราสต์ตก
           ต่ำกว่าเกณฑ์ 3:1 ของกราฟิก (วัดได้ 2.36–2.95) เพราะสีสดสำหรับพื้นทึบ
           มันสว่างเกินไปเมื่อวางบนพื้นจาง ตัวอย่างของ shadcn เองก็ใช้สีเดียวกับหัวข้อ

           คำอธิบายไม่ใช้ text-muted-foreground เพราะบนพื้นจางเหลือ 4.08–4.35
           ใช้สีเดียวกับหัวข้อแต่ลด opacity แทน ได้ทั้งลำดับสายตาและคอนทราสต์ */
        destructive:
          "border-destructive/30 bg-destructive/10 text-destructive-subtle *:data-[slot=alert-description]:text-destructive-subtle/85",
        warning:
          "border-warning/35 bg-warning/10 text-warning-foreground *:data-[slot=alert-description]:text-warning-foreground/85",
        /* ตามแบรนด์ — ตัวอักษรใช้ foreground ปกติ ไม่ต้องเพิ่ม token ให้ทุกแบรนด์ */
        brand:
          "border-primary/30 bg-primary/10 text-foreground *:data-[slot=alert-description]:text-foreground/80",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "col-start-2 grid justify-items-start gap-1 text-sm text-muted-foreground [&_p]:leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

export { Alert, AlertTitle, AlertDescription }
