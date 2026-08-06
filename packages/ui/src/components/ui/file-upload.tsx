"use client"

import * as React from "react"

import { cn } from "@peckey954/ui/lib/utils"

/**
 * กล่องลากไฟล์มาวาง + กดเพื่อเลือกไฟล์
 *
 * ไม่ได้เก็บรายการไฟล์ไว้เอง — ส่งออกทาง onFilesAccepted แล้วให้ฝั่งที่ใช้
 * เป็นคนถือ state เพราะแต่ละหน้าจัดการไฟล์ไม่เหมือนกัน (บางที่อัปทันที
 * บางที่รอกดบันทึก) ถ้าเก็บไว้ในนี้จะกลายเป็นสอง source of truth
 *
 *   <FileUpload accept="image/*" multiple onFilesAccepted={add}>
 *     <FileUploadIcon><UploadIcon /></FileUploadIcon>
 *     <FileUploadLabel>ลากไฟล์มาวาง หรือกดเพื่อเลือก</FileUploadLabel>
 *     <FileUploadHint>PNG · JPG ไม่เกิน 5 MB</FileUploadHint>
 *   </FileUpload>
 */

type FileRejection = {
  file: File
  /** too-large = เกิน maxSize · wrong-type = ไม่ตรงกับ accept */
  reason: "too-large" | "wrong-type"
}

type FileUploadProps = Omit<
  React.ComponentProps<"div">,
  "onDrop" | "onDragOver" | "onDragLeave"
> & {
  accept?: string
  multiple?: boolean
  /** ขนาดสูงสุดต่อไฟล์ หน่วยเป็นไบต์ */
  maxSize?: number
  disabled?: boolean
  onFilesAccepted?: (files: File[]) => void
  /** ไฟล์ที่ไม่ผ่านเงื่อนไข พร้อมเหตุผล — เอาไปขึ้นข้อความเตือนเอง */
  onFilesRejected?: (rejections: FileRejection[]) => void
  inputProps?: React.ComponentProps<"input">
}

/** เทียบกับค่าใน accept ได้ทั้ง image/* · .pdf · application/pdf */
function matchesAccept(file: File, accept?: string) {
  if (!accept) return true
  return accept.split(",").some((raw) => {
    const rule = raw.trim().toLowerCase()
    if (!rule) return false
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule)
    if (rule.endsWith("/*")) return file.type.startsWith(rule.slice(0, -1))
    return file.type.toLowerCase() === rule
  })
}

function FileUpload({
  className,
  children,
  accept,
  multiple = false,
  maxSize,
  disabled,
  onFilesAccepted,
  onFilesRejected,
  inputProps,
  ...props
}: FileUploadProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  /* นับความลึกของ dragenter/dragleave แทนการตั้ง true/false ตรง ๆ
     เพราะลากผ่านลูกข้างในทีนึงจะยิง dragleave ของตัวแม่ออกมาด้วย
     ถ้าไม่นับ กรอบจะกะพริบตลอดเวลาที่ลากอยู่เหนือกล่อง */
  const depth = React.useRef(0)
  const [dragging, setDragging] = React.useState(false)

  const handleFiles = React.useCallback(
    (list: FileList | null) => {
      if (!list?.length) return
      const incoming = multiple ? Array.from(list) : [list[0]!]
      const accepted: File[] = []
      const rejected: FileRejection[] = []

      for (const file of incoming) {
        if (!matchesAccept(file, accept)) {
          rejected.push({ file, reason: "wrong-type" })
        } else if (maxSize != null && file.size > maxSize) {
          rejected.push({ file, reason: "too-large" })
        } else {
          accepted.push(file)
        }
      }

      if (accepted.length) onFilesAccepted?.(accepted)
      if (rejected.length) onFilesRejected?.(rejected)
    },
    [accept, maxSize, multiple, onFilesAccepted, onFilesRejected]
  )

  const open = () => {
    if (!disabled) inputRef.current?.click()
  }

  return (
    <div
      data-slot="file-upload"
      data-dragging={dragging || undefined}
      data-disabled={disabled || undefined}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      className={cn(
        "flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-transparent px-6 py-8 text-center transition-colors",
        "hover:border-ring hover:bg-accent/40",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        "data-[dragging]:border-primary data-[dragging]:bg-brand",
        "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          open()
        }
      }}
      onDragEnter={(e) => {
        e.preventDefault()
        if (disabled) return
        depth.current += 1
        setDragging(true)
      }}
      onDragOver={(e) => {
        /* ต้อง preventDefault ที่ dragover ด้วย ไม่งั้นเบราว์เซอร์จะเปิดไฟล์
           ในแท็บใหม่แทนที่จะยิง drop ให้เรา */
        e.preventDefault()
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        depth.current -= 1
        if (depth.current <= 0) {
          depth.current = 0
          setDragging(false)
        }
      }}
      onDrop={(e) => {
        e.preventDefault()
        depth.current = 0
        setDragging(false)
        if (!disabled) handleFiles(e.dataTransfer.files)
      }}
      {...props}
    >
      {children}
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(e) => {
          handleFiles(e.target.files)
          /* เคลียร์ค่าทิ้ง ไม่งั้นเลือกไฟล์เดิมซ้ำครั้งที่สองจะไม่ยิง onChange */
          e.target.value = ""
        }}
        {...inputProps}
      />
    </div>
  )
}

function FileUploadIcon({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-upload-icon"
      className={cn(
        "flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5",
        className
      )}
      {...props}
    />
  )
}

function FileUploadLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="file-upload-label"
      className={cn("text-sm font-medium", className)}
      {...props}
    />
  )
}

function FileUploadHint({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="file-upload-hint"
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  FileUpload,
  FileUploadHint,
  FileUploadIcon,
  FileUploadLabel,
  type FileRejection,
}
