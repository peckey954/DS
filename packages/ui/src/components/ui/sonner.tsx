"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  // ต้องใช้ resolvedTheme ไม่ใช่ theme
  // theme คืนค่า "system" ได้ ซึ่ง sonner ไม่รู้จัก กฎโหมดมืดของมันจึงไม่ทำงาน
  // เพราะมันเช็ค [data-sonner-theme="dark"] ตรง ๆ
  const { resolvedTheme } = useTheme()

  return (
    <Sonner
      theme={(resolvedTheme ?? "system") as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        classNames: {
          // sonner ฝังสีคำอธิบายไว้ตายตัว ไม่ได้ผูกกับ token ของเราเลย
          //   ปกติ         rgb(63,63,63)
          //   โหมดมืด      rgb(232,232,232)  (ใช้ได้ก็ต่อเมื่อ data-sonner-theme = "dark" เป๊ะ)
          // ผูกกับ token แทน จะได้ตามแบรนด์และไม่พึ่ง attribute ของ sonner
          //
          // ใช้ /90 ไม่ใช่ text-muted-foreground เพราะต้องการให้เกือบขาวในโหมดมืด
          // แลกกับที่คำอธิบายเด่นเกือบเท่าหัวข้อ ซึ่งเป็นสิ่งที่ตั้งใจ
          //
          // ต้องมี ! เพราะกฎของ sonner มี specificity (0,3,0) จาก attribute 3 ตัว
          // คลาส Tailwind เดี่ยว ๆ (0,1,0) สู้ไม่ได้
          description: "text-popover-foreground/90!",
        },
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",

          /* ผูกสีของ richColors เข้ากับ token ด้วย เผื่อโปรเจกต์ไหนเปิดใช้
             ไม่งั้น sonner จะใช้สีของตัวเองที่ไม่เกี่ยวกับแบรนด์เลย
             ค่าเริ่มต้นของเราไม่ได้เปิด richColors หน้าตาจึงไม่เปลี่ยน */
          "--success-bg": "var(--success)",
          "--success-text": "var(--success-foreground)",
          "--success-border": "var(--success-border)",
          "--warning-bg": "var(--warning)",
          "--warning-text": "var(--warning-foreground)",
          "--warning-border": "var(--warning-border)",
          "--error-bg": "var(--danger)",
          "--error-text": "var(--danger-foreground)",
          "--error-border": "var(--danger-border)",
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster }
