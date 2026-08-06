"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@peckey954/ui/lib/utils"
import { Button } from "@peckey954/ui/components/ui/button"
import { Progress } from "@peckey954/ui/components/ui/progress"
import { Spinner } from "@peckey954/ui/components/ui/spinner"

/**
 * แถวไฟล์แนบ — ชื่อ prop และชื่อ subcomponent ตรงกับ Attachment ของ shadcn
 * (ui.shadcn.com/docs/components/base/attachment) เพื่อให้ย้ายโค้ดไปมาได้
 *
 * เขียนเองไม่ได้ดึงจาก registry ของ shadcn เพราะตัวนั้นอยู่ในชุด Base UI
 * ส่วน DS นี้ใช้ radix-ui ดึงมาตรง ๆ จะได้ dependency คนละตระกูลติดมาด้วย
 * ตัว component เป็นงาน layout ล้วน ไม่ได้ใช้ primitive อะไรเลย เขียนเองคุ้มกว่า
 *
 *   state  idle / uploading / processing / error / done
 *   size   default (48px) / sm (40px) / xs (32px)  — คุมขนาดกล่องรูปกับตัวอักษร
 *   orientation  horizontal (แถว) / vertical (การ์ดตั้ง ใช้กับกริดรูป)
 */

const attachmentVariants = cva(
  "group/attachment relative flex min-w-0 items-center gap-3 rounded-lg border border-border bg-card text-card-foreground transition-colors",
  {
    variants: {
      size: {
        default: "p-3 text-sm",
        sm: "p-2.5 text-sm",
        xs: "gap-2 p-2 text-xs",
      },
      orientation: {
        horizontal: "w-full flex-row",
        vertical: "w-full flex-col items-stretch gap-2",
      },
      state: {
        idle: "",
        uploading: "",
        processing: "",
        /* พื้นจาง /40 ไม่ใช่ --danger ทึบ เพราะแถวไฟล์อยู่ปนกับแถวปกติในลิสต์เดียวกัน
           ถ้าใช้พื้นทึบจะเด่นจนกลบแถวอื่นทั้งกอง */
        error: "border-danger-border bg-danger/40",
        done: "",
      },
    },
    defaultVariants: {
      size: "default",
      orientation: "horizontal",
      state: "done",
    },
  }
)

type AttachmentContextValue = {
  state: NonNullable<VariantProps<typeof attachmentVariants>["state"]>
  size: NonNullable<VariantProps<typeof attachmentVariants>["size"]>
}

const AttachmentContext = React.createContext<AttachmentContextValue>({
  state: "done",
  size: "default",
})

function Attachment({
  className,
  size = "default",
  orientation = "horizontal",
  state = "done",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentVariants>) {
  return (
    <AttachmentContext.Provider
      value={{ state: state ?? "done", size: size ?? "default" }}
    >
      <div
        data-slot="attachment"
        data-state={state}
        className={cn(
          attachmentVariants({ size, orientation, state }),
          className
        )}
        {...props}
      />
    </AttachmentContext.Provider>
  )
}

const mediaVariants = cva(
  "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md",
  {
    variants: {
      variant: {
        icon: "border border-border bg-muted text-muted-foreground",
        /* variant="image" ไม่มีพื้นและไม่มีขอบ เพราะรูปเต็มกรอบอยู่แล้ว
           ใส่พื้นไว้จะเห็นเป็นเส้นบาง ๆ โผล่ตอนรูปโหลดไม่ทัน */
        image: "bg-muted",
      },
      size: {
        default: "size-12 [&_svg]:size-5",
        sm: "size-10 [&_svg]:size-4",
        xs: "size-8 [&_svg]:size-4",
      },
    },
    defaultVariants: { variant: "icon", size: "default" },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> &
  Pick<VariantProps<typeof mediaVariants>, "variant">) {
  const { size, state } = React.useContext(AttachmentContext)
  const busy = state === "uploading" || state === "processing"

  return (
    <div
      data-slot="attachment-media"
      className={cn(mediaVariants({ variant, size }), className)}
      {...props}
    >
      {props.children}
      {/* ระหว่างอัปโหลดคลุมรูปด้วยฝ้าแล้ววาง spinner ทับ — ยังเห็นว่าเป็นไฟล์ไหนอยู่ */}
      {busy ? (
        <span className="absolute inset-0 flex items-center justify-center bg-background/70">
          <Spinner className="size-4" />
        </span>
      ) : null}
    </div>
  )
}

function AttachmentContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function AttachmentTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-title"
      /* truncate ต้องมาคู่กับ min-w-0 ที่ตัวแม่ ไม่งั้นชื่อไฟล์ยาว ๆ จะดันกล่องจนล้น */
      className={cn("truncate font-medium", className)}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { state } = React.useContext(AttachmentContext)
  return (
    <div
      data-slot="attachment-description"
      className={cn(
        "truncate text-xs",
        state === "error" ? "text-danger-foreground" : "text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/** แถบความคืบหน้า — โผล่เฉพาะตอน state="uploading" */
function AttachmentProgress({
  className,
  ...props
}: React.ComponentProps<typeof Progress>) {
  const { state } = React.useContext(AttachmentContext)
  if (state !== "uploading") return null
  return (
    <Progress
      data-slot="attachment-progress"
      className={cn("mt-1.5 h-1", className)}
      {...props}
    />
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn("flex shrink-0 items-center gap-1", className)}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant = "ghost",
  size = "icon-xs",
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      data-slot="attachment-action"
      variant={variant}
      size={size}
      className={className}
      {...props}
    />
  )
}

/**
 * ครอบทั้งแถวให้กดได้ เช่นกดแล้วเปิดดูรูป
 * วาง ::after ทับทั้งการ์ดแทนการครอบ <button> รอบทุกอย่าง
 * จะได้ไม่ไปซ้อนกับปุ่มลบที่อยู่ในแถวเดียวกัน (ปุ่มซ้อนปุ่มคือ HTML ที่ผิด)
 */
function AttachmentTrigger({
  className,
  ...props
}: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-slot="attachment-trigger"
      className={cn(
        "absolute inset-0 z-0 rounded-lg after:absolute after:inset-0",
        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        className
      )}
      {...props}
    />
  )
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn("flex w-full flex-col gap-2", className)}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTitle,
  AttachmentTrigger,
  attachmentVariants,
}
