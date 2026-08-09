"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { ImageIcon, PlayIcon } from "lucide-react"

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
 *   state        idle / uploading / processing / error / done
 *   size         default (48px) / sm (40px) / xs (32px)  — คุมกล่องรูปกับตัวอักษร
 *   orientation  horizontal (แถว) / vertical (การ์ดตั้ง ใช้กับกริดรูป)
 *   variant      card (มีขอบมีพื้น) / tile (รูปเต็มกรอบ ไม่มีขอบไม่มีระยะใน)
 */

const attachmentVariants = cva(
  "group/attachment relative flex min-w-0 transition-colors",
  {
    variants: {
      size: {
        default: "gap-3 p-3 text-sm",
        sm: "gap-3 p-2.5 text-sm",
        xs: "gap-2 p-2 text-xs",
      },
      orientation: {
        horizontal: "w-full flex-row items-center",
        vertical: "w-full flex-col items-stretch gap-2",
      },
      variant: {
        card: "rounded-lg border border-border bg-card text-card-foreground",
        /* tile = รูปคือทั้งการ์ด ใช้กับกริดรูปที่ไม่มีชื่อไฟล์กำกับ
           ต้อง overflow-hidden เพราะแถบ progress ไปเกาะขอบล่างของรูป
           และปิดมุมโค้งของกล่องรูปข้างใน ไม่งั้นจะเห็นมุมโค้งสองชั้นซ้อนกัน */
        tile: "gap-0 overflow-hidden rounded-lg p-0 *:data-[slot=attachment-media]:rounded-none",
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
      variant: "card",
      state: "done",
    },
  }
)

type AttachmentContextValue = {
  state: NonNullable<VariantProps<typeof attachmentVariants>["state"]>
  size: NonNullable<VariantProps<typeof attachmentVariants>["size"]>
  orientation: NonNullable<VariantProps<typeof attachmentVariants>["orientation"]>
}

const AttachmentContext = React.createContext<AttachmentContextValue>({
  state: "done",
  size: "default",
  orientation: "horizontal",
})

function Attachment({
  className,
  size = "default",
  orientation = "horizontal",
  variant = "card",
  state = "done",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentVariants>) {
  return (
    <AttachmentContext.Provider
      value={{
        state: state ?? "done",
        size: size ?? "default",
        orientation: orientation ?? "horizontal",
      }}
    >
      <div
        data-slot="attachment"
        data-state={state}
        className={cn(
          attachmentVariants({ size, orientation, variant, state }),
          className
        )}
        {...props}
      />
    </AttachmentContext.Provider>
  )
}

const mediaVariants = cva(
  /* จัดรูป/วิดีโอที่วางไว้ข้างในให้เต็มกรอบเอง ฝั่งที่ใช้เขียนแค่ <img src alt /> พอ
     ไม่ต้องจำว่าต้องใส่ size-full object-cover ทุกครั้ง */
  [
    "relative flex shrink-0 items-center justify-center overflow-hidden rounded-md",
    "[&>img]:size-full [&>img]:object-cover [&>video]:size-full [&>video]:object-cover",
  ],
  {
    variants: {
      variant: {
        icon: "border border-border bg-muted text-muted-foreground",
        /* image/video ไม่มีพื้นทึบและไม่มีขอบ เพราะรูปเต็มกรอบอยู่แล้ว
           ใส่ขอบไว้จะเห็นเป็นเส้นบาง ๆ โผล่ตอนรูปโหลดไม่ทัน */
        image: "bg-muted text-muted-foreground",
        video: "bg-muted text-muted-foreground",
      },
      /* เจาะจง [&>svg] ไม่ใช่ [&_svg] เพราะกฎแบบลูกหลานจะไปคุมขนาดปุ่มเล่นวิดีโอ
         กับ spinner ที่ซ้อนอยู่ข้างในด้วย แล้วสั่งทับจากตัวมันเองไม่ได้ (specificity สูงกว่า) */
      size: {
        default: "size-12 [&>svg]:size-5",
        sm: "size-10 [&>svg]:size-4",
        xs: "size-8 [&>svg]:size-4",
      },
      /* การ์ดแนวตั้ง = รูปกินเต็มความกว้าง แล้วคุมความสูงด้วยสัดส่วนแทนขนาดคงที่ */
      fill: {
        true: "size-auto w-full [&>svg]:size-8",
        false: "",
      },
      aspect: {
        square: "aspect-square",
        video: "aspect-video",
        auto: "",
      },
    },
    defaultVariants: { variant: "icon", size: "default", fill: false },
  }
)

function AttachmentMedia({
  className,
  variant = "icon",
  aspect = "square",
  fill,
  children,
  ...props
}: React.ComponentProps<"div"> &
  Pick<VariantProps<typeof mediaVariants>, "variant" | "aspect"> & {
    /** บังคับให้รูปกินเต็มความกว้าง — ปกติดูจาก orientation ของ Attachment ให้เอง */
    fill?: boolean
  }) {
  const { size, state, orientation } = React.useContext(AttachmentContext)
  const busy = state === "uploading" || state === "processing"
  const filled = fill ?? orientation === "vertical"
  /* toArray ไม่ใช่ count — count นับ {cond ? <img/> : null} เป็น 1 ทั้งที่ว่างเปล่า */
  const empty = React.Children.toArray(children).length === 0

  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(
        mediaVariants({ variant, size, fill: filled, aspect: filled ? aspect : "auto" }),
        className
      )}
      {...props}
    >
      {busy ? (
        /* ระหว่างอัปโหลด "แทนที่" ไอคอน/รูปด้วย spinner ไปเลย ไม่วางซ้อนกัน
           ซ้อนกันแล้วอ่านไม่ออกว่ากำลังโหลดหรือเป็นไฟล์อะไรกันแน่
           ไม่ต้องกำหนดขนาด spinner — กฎ [&>svg] ของกล่องคุมให้ตามขนาดการ์ดอยู่แล้ว */
        <Spinner />
      ) : (
        <>
          {/* variant="image" ที่ยังไม่มีรูปจริง = พื้นเรียบ + ไอคอนรูปตรงกลาง
              ฝั่งที่ใช้ไม่ต้องหารูป placeholder มาใส่เอง */}
          {empty && variant === "image" ? <ImageIcon /> : children}

          {/* ปุ่มเล่นวางกลางรูปเสมอ — ไม่ใช่มุมใดมุมหนึ่ง เพราะมุมเป็นที่ของปุ่มลบ
              pointer-events-none ให้คลิกทะลุไปโดน AttachmentTrigger ที่คลุมการ์ดอยู่ */}
          {variant === "video" ? (
            <span
              data-slot="attachment-play"
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-full bg-foreground/70 text-background shadow-sm",
                  filled ? "size-10 [&_svg]:size-5" : "size-6 [&_svg]:size-3"
                )}
              >
                <PlayIcon className="translate-x-px fill-current" />
              </span>
            </span>
          ) : null}
        </>
      )}
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
      /* z-10 ติดมาให้เลย — ปุ่มต้องลอยเหนือ AttachmentTrigger ที่คลุมทั้งการ์ด
         ไม่งั้นกดปุ่มลบแล้วไปโดน trigger แทน */
      className={cn("relative z-10 flex shrink-0 items-center gap-1", className)}
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
 * วาง absolute ทับทั้งการ์ดแทนการครอบ <button> รอบทุกอย่าง
 * จะได้ไม่ไปซ้อนกับปุ่มลบที่อยู่ในแถวเดียวกัน (ปุ่มซ้อนปุ่มคือ HTML ที่ผิด)
 *
 * ส่ง render มาเพื่อเปลี่ยนแท็กได้ เช่นเปิดไฟล์ในแท็บใหม่ต้องเป็น <a> ไม่ใช่ <button>
 *   <AttachmentTrigger render={<a href={src} target="_blank" aria-label="เปิดไฟล์" />} />
 */
function AttachmentTrigger({
  className,
  render,
  ...props
}: React.ComponentProps<"button"> & {
  /** element ที่จะเอาไปเรนเดอร์แทน <button> — className กับ props ที่เหลือถูกยัดใส่ให้ */
  render?: React.ReactElement
}) {
  const classes = cn(
    "absolute inset-0 z-0 rounded-[inherit]",
    "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
    className
  )

  if (React.isValidElement(render)) {
    const rendered = render as React.ReactElement<{ className?: string }>
    return React.cloneElement(rendered, {
      "data-slot": "attachment-trigger",
      ...props,
      className: cn(classes, rendered.props.className),
    } as React.HTMLAttributes<HTMLElement>)
  }

  return (
    <button
      type="button"
      data-slot="attachment-trigger"
      className={classes}
      {...props}
    />
  )
}

const groupVariants = cva("w-full", {
  variants: {
    layout: {
      list: "flex flex-col gap-2",
      /* กริดรูป — สั่งจำนวนคอลัมน์ทับได้ด้วย className เช่น "grid-cols-4" */
      grid: "grid grid-cols-2 gap-3 sm:grid-cols-3",
    },
  },
  defaultVariants: { layout: "list" },
})

function AttachmentGroup({
  className,
  layout = "list",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof groupVariants>) {
  return (
    <div
      data-slot="attachment-group"
      data-layout={layout}
      className={cn(groupVariants({ layout }), className)}
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
