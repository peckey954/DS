"use client"

import * as React from "react"
import { MinusIcon, PlusIcon } from "lucide-react"

import { cn } from "@peckey954/ui/lib/utils"

/* ช่องกรอกตัวเลข — ครอบสองหน้าตาด้วย prop เดียวกัน

   1. มีปุ่ม − / +   <NumberInput precision={2} />
   2. มีหน่วยในช่อง  <NumberInput unit="ตัน" steppers={false} />
   ใช้พร้อมกันก็ได้   <NumberInput unit="ชิ้น" />

   ทำไมไม่ใช้ <input type="number">
   - ลูกกลิ้งเมาส์เลื่อนทับช่องแล้วค่าเปลี่ยนเองโดยไม่ตั้งใจ
   - ปุ่มลูกศรของเบราว์เซอร์แต่งด้วย token ไม่ได้ หน้าตาต่างกันทุกเบราว์เซอร์
   - บังคับทศนิยมคงที่แบบ 0.00 ไม่ได้
   จึงใช้ type="text" + inputMode="decimal" แล้วคุมเองทั้งหมด */

function clampValue(n: number, min?: number, max?: number) {
  if (min != null && n < min) return min
  if (max != null && n > max) return max
  return n
}

function formatValue(n: number | null, precision?: number) {
  if (n == null || Number.isNaN(n)) return ""
  return precision != null ? n.toFixed(precision) : String(n)
}

function parseValue(text: string): number | null {
  /* ตัดทุกอย่างที่ไม่ใช่ตัวเลข จุด หรือลบ ทิ้ง — วางค่าจาก Excel ที่ติดจุลภาคมาก็ยังอ่านออก */
  const cleaned = text.replace(/[^\d.-]/g, "")
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return null
  const n = Number(cleaned)
  return Number.isNaN(n) ? null : n
}

type NumberInputProps = Omit<
  React.ComponentProps<"input">,
  "value" | "defaultValue" | "onChange" | "type"
> & {
  value?: number | null
  defaultValue?: number | null
  onValueChange?: (value: number | null) => void
  min?: number
  max?: number
  /** ปุ่ม − / + บวกลบทีละเท่าไร */
  step?: number
  /** ทศนิยมกี่ตำแหน่ง — ใส่ 2 แล้วจะจัดรูปเป็น 0.00 ตอนออกจากช่อง */
  precision?: number
  /** หน่วยที่โชว์ในช่อง เช่น ชิ้น · ตัน · กก. */
  unit?: string
  /** ปิดปุ่ม − / + เมื่ออยากได้แค่ช่องกรอกที่มีหน่วย */
  steppers?: boolean
  align?: "start" | "center" | "end"
  /** ข้อความให้ screen reader อ่าน — เปลี่ยนตามภาษาของแอปได้ */
  decrementLabel?: string
  incrementLabel?: string
}

function NumberInput({
  className,
  value: valueProp,
  defaultValue = null,
  onValueChange,
  min,
  max,
  step = 1,
  precision,
  unit,
  steppers = true,
  align = steppers ? "center" : "start",
  decrementLabel = "Decrease",
  incrementLabel = "Increase",
  disabled,
  readOnly,
  onBlur,
  onKeyDown,
  ...props
}: NumberInputProps) {
  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState<number | null>(
    defaultValue
  )
  const value = isControlled ? (valueProp ?? null) : uncontrolled

  const [text, setText] = React.useState(() => formatValue(value, precision))
  const [focused, setFocused] = React.useState(false)

  /* ค่าถูกเปลี่ยนจากข้างนอกตอนที่ไม่ได้โฟกัสอยู่ → ซิงก์ข้อความตาม
     ถ้ากำลังพิมพ์อยู่ไม่ต้องยุ่ง ไม่งั้นตัวหนังสือจะกระโดดใส่หน้า */
  React.useEffect(() => {
    if (!focused) setText(formatValue(value, precision))
  }, [value, precision, focused])

  const commit = React.useCallback(
    (next: number | null, doClamp: boolean) => {
      let v = next
      if (v != null) {
        if (doClamp) v = clampValue(v, min, max)
        /* 0.1 + 0.2 = 0.30000000000000004 — ตัดหางทิ้งตามจำนวนทศนิยมที่ตั้งไว้ */
        if (precision != null) v = Number(v.toFixed(precision))
      }
      if (!isControlled) setUncontrolled(v)
      onValueChange?.(v)
      return v
    },
    [isControlled, max, min, onValueChange, precision]
  )

  const stepBy = (direction: 1 | -1) => {
    const next = commit((value ?? 0) + direction * step, true)
    setText(formatValue(next, precision))
  }

  const atMin = min != null && value != null && value <= min
  const atMax = max != null && value != null && value >= max
  const locked = disabled || readOnly

  return (
    <div
      data-slot="number-input"
      className={cn(
        "flex h-9 w-full min-w-0 items-center rounded-md border border-input bg-transparent text-base shadow-xs transition-[color,box-shadow] md:text-sm dark:bg-input/30",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        "has-[input:disabled]:pointer-events-none has-[input:disabled]:opacity-50",
        "has-[input[aria-invalid=true]]:border-destructive has-[input[aria-invalid=true]]:ring-destructive/20 dark:has-[input[aria-invalid=true]]:ring-destructive/40",
        className
      )}
    >
      {steppers ? (
        <StepperButton
          label={decrementLabel}
          side="start"
          disabled={locked || atMin}
          onClick={() => stepBy(-1)}
        >
          <MinusIcon />
        </StepperButton>
      ) : null}

      <div
        className={cn(
          "flex min-w-0 flex-1 items-baseline gap-1.5 px-3",
          align === "center" && "justify-center",
          align === "end" && "justify-end"
        )}
      >
        <input
          data-slot="number-input-field"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          disabled={disabled}
          readOnly={readOnly}
          value={text}
          className={cn(
            "min-w-0 bg-transparent tabular-nums outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed",
            /* ชิดกลาง/ขวา ต้องไม่กิน flex-1 ไม่งั้นหน่วยจะถูกดันไปติดขอบ */
            align === "start" ? "flex-1" : "w-full flex-1",
            align === "center" && "text-center",
            align === "end" && "text-right"
          )}
          onFocus={() => setFocused(true)}
          onChange={(e) => {
            setText(e.target.value)
            /* ไม่ clamp ระหว่างพิมพ์ — ถ้า max=10 แล้วดักไว้ จะพิมพ์ 12 ไม่ได้เลย
               เพราะพอพิมพ์ 1 ต่อด้วย 2 มันจะโดนตัดเหลือ 10 ก่อน */
            commit(parseValue(e.target.value), false)
          }}
          onBlur={(e) => {
            setFocused(false)
            const next = commit(parseValue(e.target.value), true)
            setText(formatValue(next, precision))
            onBlur?.(e)
          }}
          onKeyDown={(e) => {
            if (!locked && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
              e.preventDefault()
              stepBy(e.key === "ArrowUp" ? 1 : -1)
            }
            onKeyDown?.(e)
          }}
          {...props}
        />
        {unit ? (
          <span
            data-slot="number-input-unit"
            className="shrink-0 text-muted-foreground select-none"
          >
            {unit}
          </span>
        ) : null}
      </div>

      {steppers ? (
        <StepperButton
          label={incrementLabel}
          side="end"
          disabled={locked || atMax}
          onClick={() => stepBy(1)}
        >
          <PlusIcon />
        </StepperButton>
      ) : null}
    </div>
  )
}

function StepperButton({
  label,
  side,
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & {
  label: string
  side: "start" | "end"
}) {
  return (
    <button
      type="button"
      /* ข้ามตอนกด Tab — คนใช้คีย์บอร์ดกดลูกศรขึ้นลงที่ช่องได้เลย
         เร็วกว่าการ Tab ผ่านปุ่มสองอันทุกช่อง */
      tabIndex={-1}
      aria-label={label}
      className={cn(
        "flex h-full w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        "disabled:pointer-events-none disabled:opacity-40",
        side === "start" ? "rounded-l-md" : "rounded-r-md",
        "[&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export { NumberInput, type NumberInputProps }
