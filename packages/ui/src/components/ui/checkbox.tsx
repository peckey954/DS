"use client"

import * as React from "react"
import { CheckIcon, MinusIcon } from "lucide-react"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

import { cn } from "@repo/ui/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "group/checkbox peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
        "data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground",
        "dark:bg-input/30 dark:data-[state=checked]:bg-primary dark:data-[state=indeterminate]:bg-primary",
        // ปิดใช้งาน: ใช้สีชุด muted แทนสีหลัก เพื่อให้เห็นชัดว่ากดไม่ได้
        // เขียนคู่กับ data-[state] ให้ specificity สูงกว่ากฎสีปกติด้านบน
        "disabled:cursor-not-allowed disabled:border-input disabled:bg-muted disabled:text-muted-foreground",
        "disabled:data-[state=checked]:border-input disabled:data-[state=checked]:bg-muted disabled:data-[state=checked]:text-muted-foreground",
        "disabled:data-[state=indeterminate]:border-input disabled:data-[state=indeterminate]:bg-muted disabled:data-[state=indeterminate]:text-muted-foreground",
        "dark:disabled:bg-muted dark:disabled:data-[state=checked]:bg-muted dark:disabled:data-[state=indeterminate]:bg-muted",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none"
      >
        {/* text-current จำเป็น — กันไม่ให้ context ภายนอก (เช่น CommandItem)
            บังคับสีไอคอนด้วยกฎ [&_svg:not([class*='text-'])] */}
        <CheckIcon className="size-3.5 text-current group-data-[state=indeterminate]/checkbox:hidden" />
        <MinusIcon className="hidden size-3.5 text-current group-data-[state=indeterminate]/checkbox:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
