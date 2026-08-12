"use client"

import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  RotateCcwIcon,
  XIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "lucide-react"

import { cn } from "@peckey954/ui/lib/utils"
import { Button } from "@peckey954/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@peckey954/ui/components/ui/dialog"

/**
 * หน้าต่างดูรูป/วิดีโอเต็มจอ — ซูมได้ เลื่อนดูทีละรูปได้
 *
 *   const [open, setOpen] = useState(false)
 *   const [index, setIndex] = useState(0)
 *
 *   <MediaViewer
 *     items={[{ type: "image", src: "/a.jpg", title: "ใบชั่ง" }]}
 *     open={open} onOpenChange={setOpen}
 *     index={index} onIndexChange={setIndex}
 *   />
 *
 * ปุ่มลูกศรซ้าย/ขวาเลื่อนรูป · + − ซูม · 0 รีเซ็ต · Esc ปิด
 */

type MediaItem = {
  type: "image" | "video"
  src: string
  title?: string
  /** ภาพนิ่งของวิดีโอตอนยังไม่เล่น */
  poster?: string
  /** ชื่อไฟล์ตอนกดดาวน์โหลด — ไม่ส่งมาเบราว์เซอร์จะตั้งชื่อเอง */
  fileName?: string
}

const ZOOM_MIN = 1
const ZOOM_MAX = 4
const ZOOM_STEP = 0.5

type MediaViewerProps = {
  items: MediaItem[]
  open: boolean
  onOpenChange: (open: boolean) => void
  /** ไม่ส่งมาก็ได้ ตัว component จะถือ index เอง */
  index?: number
  onIndexChange?: (index: number) => void
  defaultIndex?: number
  /** ซ่อนปุ่มดาวน์โหลด เช่นรูปที่ห้ามเอาออกจากระบบ */
  showDownload?: boolean
  /** ข้อความปุ่ม — เปลี่ยนตามภาษาของแอปได้ */
  labels?: Partial<{
    previous: string
    next: string
    zoomIn: string
    zoomOut: string
    reset: string
    download: string
    close: string
    counter: (current: number, total: number) => string
  }>
  className?: string
}

const DEFAULT_LABELS = {
  previous: "Previous",
  next: "Next",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  reset: "Reset zoom",
  download: "Download",
  close: "Close",
  counter: (current: number, total: number) => `${current} / ${total}`,
}

function MediaViewer({
  items,
  open,
  onOpenChange,
  index: indexProp,
  onIndexChange,
  defaultIndex = 0,
  showDownload = true,
  labels,
  className,
}: MediaViewerProps) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const controlled = indexProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState(defaultIndex)
  const index = controlled ? indexProp : uncontrolled
  const [zoom, setZoom] = React.useState(1)

  const total = items.length
  const item = items[index]

  const goTo = React.useCallback(
    (next: number) => {
      if (total === 0) return
      /* วนกลับหัวท้าย — กดขวาที่รูปสุดท้ายไปรูปแรก */
      const wrapped = (next + total) % total
      if (!controlled) setUncontrolled(wrapped)
      onIndexChange?.(wrapped)
      setZoom(1)
    },
    [controlled, onIndexChange, total]
  )

  /* เปลี่ยนรูปเมื่อไหร่ให้ซูมกลับ 1 เสมอ ไม่งั้นรูปถัดไปจะโผล่มาซูมค้างไว้ */
  React.useEffect(() => {
    setZoom(1)
  }, [index, open])

  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(index - 1)
      else if (e.key === "ArrowRight") goTo(index + 1)
      else if (e.key === "+" || e.key === "=") setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))
      else if (e.key === "-") setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))
      else if (e.key === "0") setZoom(1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, index, goTo])

  if (!item) return null
  const isImage = item.type === "image"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-[min(96vw,72rem)]",
          className
        )}
      >
        {/* Dialog ต้องมี title เสมอเพื่อ screen reader — ถ้าไฟล์ไม่มีชื่อก็ซ่อนไว้ */}
        <DialogTitle className="sr-only">
          {item.title ?? l.counter(index + 1, total)}
        </DialogTitle>

        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{item.title}</p>
            {total > 1 ? (
              <p className="text-xs text-muted-foreground tabular-nums">
                {l.counter(index + 1, total)}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {isImage ? (
              <>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={l.zoomOut}
                  disabled={zoom <= ZOOM_MIN}
                  onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
                >
                  <ZoomOutIcon />
                </Button>
                <span className="w-12 text-center text-xs text-muted-foreground tabular-nums">
                  {Math.round(zoom * 100)}%
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={l.zoomIn}
                  disabled={zoom >= ZOOM_MAX}
                  onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
                >
                  <ZoomInIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={l.reset}
                  disabled={zoom === 1}
                  onClick={() => setZoom(1)}
                >
                  <RotateCcwIcon />
                </Button>
              </>
            ) : null}
            {showDownload ? (
              /* ดาวน์โหลดคือการไปที่ไฟล์ ต้องเป็น <a> ไม่ใช่ปุ่มที่ผูก onClick
                 คนใช้จะได้คลิกขวาคัดลอกลิงก์หรือเปิดแท็บใหม่ได้ตามปกติ */
              <Button asChild variant="ghost" size="icon-sm">
                <a
                  href={item.src}
                  download={item.fileName ?? ""}
                  aria-label={l.download}
                >
                  <DownloadIcon />
                </a>
              </Button>
            ) : null}

            <DialogClose asChild>
              {/* ปุ่มไอคอนล้วน — ปุ่มอื่นในแถวนี้เป็นไอคอนหมด ปุ่มข้อความปุ่มเดียว
                  จะดูเป็นของแปลกปลอมและกินที่มากกว่าจำเป็น */}
              <Button variant="ghost" size="icon-sm" aria-label={l.close}>
                <XIcon />
              </Button>
            </DialogClose>
          </div>
        </div>

        <div className="relative flex min-h-[50vh] items-center justify-center bg-muted/40">
          {/* overflow-auto ที่ตัวครอบ — พอซูมเกินกรอบแล้วเลื่อนดูส่วนที่ล้นได้ */}
          <div className="flex max-h-[70vh] w-full items-center justify-center overflow-auto p-4">
            {isImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.src}
                alt={item.title ?? ""}
                style={{ transform: `scale(${zoom})` }}
                className="max-h-[calc(70vh-2rem)] origin-center object-contain transition-transform duration-150"
              />
            ) : (
              <video
                src={item.src}
                poster={item.poster}
                controls
                className="max-h-[calc(70vh-2rem)] w-full rounded-md"
              />
            )}
          </div>

          {total > 1 ? (
            <>
              <Button
                variant="secondary"
                size="icon"
                aria-label={l.previous}
                onClick={() => goTo(index - 1)}
                className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full shadow-md"
              >
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                aria-label={l.next}
                onClick={() => goTo(index + 1)}
                className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full shadow-md"
              >
                <ChevronRightIcon />
              </Button>
            </>
          ) : null}
        </div>

        {total > 1 ? (
          <div className="flex gap-2 overflow-x-auto border-t border-border p-3">
            {items.map((it, i) => (
              <button
                key={`${it.src}-${i}`}
                type="button"
                aria-label={it.title ?? l.counter(i + 1, total)}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className={cn(
                  "size-14 shrink-0 overflow-hidden rounded-md border transition-colors",
                  "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                  i === index
                    ? "border-primary ring-[2px] ring-primary/40"
                    : "border-border opacity-70 hover:opacity-100"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={it.type === "image" ? it.src : (it.poster ?? it.src)}
                  alt=""
                  className="size-full object-cover"
                />
              </button>
            ))}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}

export { MediaViewer, type MediaItem }
