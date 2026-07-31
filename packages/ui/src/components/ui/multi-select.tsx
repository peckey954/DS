"use client"

import * as React from "react"
import { ChevronDownIcon, XIcon } from "lucide-react"

import { cn } from "@peckey954/ui/lib/utils"
import { Badge } from "@peckey954/ui/components/ui/badge"
import { Checkbox } from "@peckey954/ui/components/ui/checkbox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@peckey954/ui/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@peckey954/ui/components/ui/popover"

/** 1 ตัวเลือกในดรอปดาวน์ */
export type MultiSelectOption = {
  /** ค่าที่ใช้อ้างอิง — ต้องไม่ซ้ำกัน */
  value: string
  /** ข้อความหลักของแถว และข้อความที่แสดงบน chip */
  label: string
  /** ป้ายเล็กหน้าข้อความหลัก เช่น รหัสสินค้า */
  badge?: React.ReactNode
  /** บรรทัดคำอธิบายใต้ข้อความหลัก */
  description?: React.ReactNode
  /** เนื้อหาชิดขวาของแถว เช่น จำนวนคงเหลือ */
  meta?: React.ReactNode
  /** คำเพิ่มเติมที่ใช้ค้นหาได้ นอกเหนือจาก label */
  keywords?: string[]
  disabled?: boolean
}

export type MultiSelectProps = {
  options: MultiSelectOption[]
  /** โหมดควบคุมจากภายนอก */
  value?: string[]
  /** ค่าเริ่มต้นเมื่อไม่ได้ควบคุมจากภายนอก */
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
  /** ข้อความเมื่อยังไม่ได้เลือกอะไร */
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  selectAllLabel?: string
  /** ซ่อนแถวเลือกทั้งหมดด้านบน */
  hideSelectAll?: boolean
  /** ซ่อนตัวเลขจำนวนที่เลือกมุมขวาของกล่อง */
  hideCount?: boolean
  /** แสดง chip ได้สูงสุดกี่อัน ที่เหลือยุบเป็น +n */
  maxChips?: number
  disabled?: boolean
  id?: string
  name?: string
  className?: string
  contentClassName?: string
  "aria-label"?: string
  "aria-labelledby"?: string
}

function searchTextOf(option: MultiSelectOption) {
  return [
    option.label,
    typeof option.description === "string" ? option.description : "",
    ...(option.keywords ?? []),
  ]
    .join(" ")
    .toLowerCase()
}

function MultiSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder = "เลือกรายการ",
  searchPlaceholder = "ค้นหา",
  emptyText = "ไม่พบรายการที่ค้นหา",
  selectAllLabel = "เลือกทั้งหมด",
  hideSelectAll = false,
  hideCount = false,
  maxChips,
  disabled = false,
  id,
  name,
  className,
  contentClassName,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")
  const [uncontrolled, setUncontrolled] = React.useState<string[]>(
    defaultValue ?? []
  )

  const selected = value ?? uncontrolled
  const selectedSet = React.useMemo(() => new Set(selected), [selected])

  const commit = React.useCallback(
    (next: string[]) => {
      if (value === undefined) setUncontrolled(next)
      onValueChange?.(next)
    },
    [onValueChange, value]
  )

  const toggle = React.useCallback(
    (optionValue: string) => {
      commit(
        selectedSet.has(optionValue)
          ? selected.filter((v) => v !== optionValue)
          : [...selected, optionValue]
      )
    },
    [commit, selected, selectedSet]
  )

  // กรองเอง (shouldFilter={false}) เพื่อให้ "เลือกทั้งหมด" ทำงานกับผลค้นหาปัจจุบัน
  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return options
    return options.filter((o) => searchTextOf(o).includes(q))
  }, [options, search])

  const selectable = React.useMemo(
    () => filtered.filter((o) => !o.disabled),
    [filtered]
  )
  const selectedInView = selectable.filter((o) => selectedSet.has(o.value))
  const allSelected =
    selectable.length > 0 && selectedInView.length === selectable.length
  const someSelected = selectedInView.length > 0 && !allSelected

  const toggleAll = React.useCallback(() => {
    const inView = selectable.map((o) => o.value)
    if (allSelected) {
      const drop = new Set(inView)
      commit(selected.filter((v) => !drop.has(v)))
      return
    }
    const next = new Set(selected)
    inView.forEach((v) => next.add(v))
    commit([...next])
  }, [allSelected, commit, selectable, selected])

  // เรียงตามลำดับใน options เพื่อให้ chip ไม่สลับที่เวลาเลือกซ้ำ
  const selectedOptions = React.useMemo(
    () => options.filter((o) => selectedSet.has(o.value)),
    [options, selectedSet]
  )
  const shownChips =
    maxChips != null ? selectedOptions.slice(0, maxChips) : selectedOptions
  const hiddenChipCount = selectedOptions.length - shownChips.length

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        if (disabled && next) return
        setOpen(next)
        if (!next) setSearch("")
      }}
    >
      <PopoverTrigger asChild>
        <div
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-disabled={disabled || undefined}
          tabIndex={disabled ? -1 : 0}
          data-slot="multi-select-trigger"
          data-state={open ? "open" : "closed"}
          data-disabled={disabled || undefined}
          // div ไม่มีพฤติกรรม Enter/Space แบบ button จึงต้องผูกเอง
          onKeyDown={(e) => {
            if (disabled) return
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setOpen(true)
            }
          }}
          className={cn(
            "flex min-h-9 w-full cursor-pointer items-center gap-2 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs transition-[color,box-shadow] outline-none",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "data-[state=open]:border-ring data-[state=open]:ring-[3px] data-[state=open]:ring-ring/50",
            "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50",
            "dark:bg-input/30",
            className
          )}
          {...props}
        >
          <div className="flex flex-1 flex-wrap items-center gap-1.5">
            {selectedOptions.length === 0 ? (
              <span className="text-muted-foreground">{placeholder}</span>
            ) : (
              <>
                {shownChips.map((option) => (
                  <Badge
                    key={option.value}
                    variant="outline"
                    className="gap-1 border-primary/40 py-1 pr-1 pl-2 text-primary"
                  >
                    <span className="truncate">{option.label}</span>
                    <span
                      role="button"
                      tabIndex={-1}
                      aria-label={`เอา ${option.label} ออก`}
                      className="grid size-4 place-content-center rounded-sm transition-colors hover:bg-primary/10"
                      onPointerDown={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (!disabled) toggle(option.value)
                      }}
                    >
                      <XIcon className="size-3" />
                    </span>
                  </Badge>
                ))}
                {hiddenChipCount > 0 ? (
                  <Badge variant="secondary" className="py-1">
                    +{hiddenChipCount}
                  </Badge>
                ) : null}
              </>
            )}
          </div>

          {!hideCount && selectedOptions.length > 0 ? (
            <Badge className="min-w-6 justify-center">
              {selectedOptions.length}
            </Badge>
          ) : null}
          <ChevronDownIcon
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180"
            )}
          />
          {name
            ? selectedOptions.map((option) => (
                <input
                  key={option.value}
                  type="hidden"
                  name={name}
                  value={option.value}
                />
              ))
            : null}
        </div>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className={cn(
          "w-(--radix-popover-trigger-width) min-w-(--radix-popover-trigger-width) p-0",
          contentClassName
        )}
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={search}
            onValueChange={setSearch}
            placeholder={searchPlaceholder}
          />
          <CommandList className="max-h-72">
            <CommandEmpty>{emptyText}</CommandEmpty>

            {!hideSelectAll && selectable.length > 0 ? (
              <>
                <CommandGroup>
                  <CommandItem
                    value="__select_all__"
                    onSelect={toggleAll}
                    className="gap-3"
                  >
                    <Checkbox
                      checked={
                        allSelected ? true : someSelected ? "indeterminate" : false
                      }
                      tabIndex={-1}
                      aria-hidden
                      className="pointer-events-none"
                    />
                    <span className="flex-1 font-medium">{selectAllLabel}</span>
                    <span className="text-xs text-muted-foreground">
                      {selectedInView.length}/{selectable.length}
                    </span>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
              </>
            ) : null}

            <CommandGroup>
              {filtered.map((option) => {
                const isSelected = selectedSet.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                    onSelect={() => toggle(option.value)}
                    className="items-start gap-3 py-2.5"
                    aria-selected={isSelected}
                  >
                    <Checkbox
                      checked={isSelected}
                      tabIndex={-1}
                      aria-hidden
                      className="pointer-events-none mt-0.5"
                    />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {option.badge != null ? (
                          <Badge variant="secondary">{option.badge}</Badge>
                        ) : null}
                        <span className="truncate font-medium">
                          {option.label}
                        </span>
                      </div>
                      {option.description != null ? (
                        <span className="text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      ) : null}
                    </div>
                    {option.meta != null ? (
                      <div className="shrink-0 self-center text-sm">
                        {option.meta}
                      </div>
                    ) : null}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export { MultiSelect }
