"use client"

import * as React from "react"
import {
  DownloadIcon,
  EraserIcon,
  ExternalLinkIcon,
  FileIcon,
  PencilIcon,
  PrinterIcon,
  Undo2Icon,
  XIcon,
} from "lucide-react"

import { cn } from "@peckey954/ui/lib/utils"
import { Button } from "@peckey954/ui/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@peckey954/ui/components/ui/dialog"
import { Separator } from "@peckey954/ui/components/ui/separator"

/**
 * หน้าต่างดูตัวอย่างไฟล์ — พิมพ์ ดาวน์โหลด และขีดเขียนทับรูปได้
 *
 *   const [file, setFile] = useState<PreviewFile | null>(null)
 *
 *   <FilePreview
 *     file={file}
 *     open={file !== null}
 *     onOpenChange={(open) => { if (!open) setFile(null) }}
 *     labels={{ print: "พิมพ์", download: "ดาวน์โหลด", close: "ปิด" }}
 *   />
 *
 * ชนิดไฟล์เดาจากนามสกุลให้เอง — pdf กับ text เปิดใน iframe, รูปเปิดตรง ๆ
 * ที่เหลือขึ้นกล่อง "ดูตัวอย่างไม่ได้" พร้อมปุ่มดาวน์โหลด ไม่ปล่อยให้จอว่าง
 *
 * คู่กับ MediaViewer: รูป/วิดีโอที่ต้องซูมและเลื่อนดูทีละรูปใช้ MediaViewer
 * ส่วนเอกสารทีละไฟล์ที่ต้องสั่งพิมพ์หรือขีดมาร์กใช้ตัวนี้
 */

type PreviewKind = "pdf" | "image" | "text" | "other"

type PreviewFile = {
  name: string
  src: string
  /** ไม่ส่งมาก็ได้ เดาจากนามสกุลใน name ให้ */
  kind?: PreviewKind
  /** บรรทัดเล็กใต้ชื่อไฟล์ เช่น "PDF · 2.4 MB" */
  meta?: string
}

const IMAGE_EXT = ["png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg"]
const TEXT_EXT = ["txt", "csv", "log", "md", "json", "xml"]

function detectKind(file: PreviewFile): PreviewKind {
  if (file.kind) return file.kind
  const ext = file.name.split(".").pop()?.toLowerCase() ?? ""
  if (ext === "pdf") return "pdf"
  if (IMAGE_EXT.includes(ext)) return "image"
  if (TEXT_EXT.includes(ext)) return "text"
  return "other"
}

/**
 * สั่งพิมพ์ผ่าน iframe ที่ซ่อนไว้ ไม่ใช่ window.print() ของหน้าเว็บ
 * ไม่งั้นจะได้กระดาษที่มีทั้งหน้าเว็บติดมาด้วยแทนที่จะได้แค่ไฟล์
 *
 * รูปใช้ srcdoc เพราะ iframe ที่ srcdoc จะได้ origin เดียวกับหน้าแม่ สั่งพิมพ์ได้แน่
 * ส่วน pdf ต้องชี้ src ตรง ๆ ให้ตัวอ่าน pdf ของเบราว์เซอร์รับไปเรนเดอร์
 * ถ้าไฟล์อยู่คนละ origin เบราว์เซอร์จะห้ามแตะ contentWindow — ตกไปเปิดแท็บใหม่แทน
 */
function printInHiddenFrame(src: string, asImage: boolean) {
  if (typeof document === "undefined") return

  const frame = document.createElement("iframe")
  frame.setAttribute("aria-hidden", "true")
  frame.style.cssText =
    "position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden"

  const openInTab = () => {
    frame.remove()
    window.open(src, "_blank", "noreferrer")
  }

  frame.onload = () => {
    try {
      const win = frame.contentWindow
      if (!win) throw new Error("frame has no window")
      /* รอรูปข้างในโหลดจบก่อนค่อยสั่งพิมพ์ ไม่งั้นได้กระดาษเปล่า */
      const images = Array.from(frame.contentDocument?.images ?? [])
      void Promise.all(
        images.map((img) =>
          img.complete
            ? Promise.resolve()
            : new Promise<void>((resolve) => {
                img.onload = () => resolve()
                img.onerror = () => resolve()
              })
        )
      ).then(() => {
        win.focus()
        win.print()
        /* ลบช้า ๆ — ลบทันทีหน้าต่างพิมพ์ของเบราว์เซอร์จะหาเนื้อหาไม่เจอ */
        window.setTimeout(() => frame.remove(), 1000)
      })
    } catch {
      openInTab()
    }
  }
  frame.onerror = openInTab

  document.body.appendChild(frame)

  if (asImage) {
    const safeSrc = src.replace(/"/g, "&quot;")
    frame.srcdoc = `<!doctype html><html><body style="margin:0">
      <img src="${safeSrc}" style="max-width:100%" alt="" /></body></html>`
  } else {
    frame.src = src
  }
}

/* สีปากกามาจาก token ล้วน ๆ — เก็บเป็นชื่อคลาสแล้วค่อยอ่านสีจริงที่คำนวณแล้ว
   ออกจากปุ่มตอนจะวาด (canvas รับได้แต่ค่าสีจริง ไม่รู้จัก class)
   ทำแบบนี้สีปากกาจึงเปลี่ยนตามแบรนด์และโหมดสว่าง/มืดเองเหมือนส่วนอื่นของ DS */
const PEN_COLORS = [
  "bg-destructive",
  "bg-primary",
  "bg-warning-solid",
  "bg-success-solid",
  "bg-foreground",
] as const

const PEN_SIZES = [2, 4, 8] as const

type Point = { x: number; y: number }
/** จุดเก็บเป็นสัดส่วน 0–1 ของกรอบรูป จะได้ไม่เพี้ยนตอนย่อขยายหน้าต่างหรือตอนบันทึก */
type Stroke = { color: string; width: number; points: Point[] }

const DEFAULT_LABELS = {
  print: "Print",
  download: "Download",
  close: "Close",
  openInNewTab: "Open in a new tab",
  unsupported: "No preview for this file type",
  unsupportedHint: "Download it to open with an app on your device",
  markup: "Markup",
  penColor: "Pen colour",
  penSize: "Pen size",
  undo: "Undo",
  clear: "Clear all",
  saveMarkup: "Save a copy",
}

type FilePreviewProps = {
  file: PreviewFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** ซ่อนปุ่มพิมพ์ เช่นไฟล์ที่พิมพ์แล้วไม่มีความหมาย */
  showPrint?: boolean
  showDownload?: boolean
  /** ปิดโหมดขีดมาร์กบนรูป (ค่าเริ่มต้นเปิดเฉพาะไฟล์รูป) */
  showMarkup?: boolean
  /**
   * แสดงแถบเครื่องมือของตัวอ่าน pdf ที่ติดมากับเบราว์เซอร์
   * true  = ได้เครื่องมือครบ (ขีดเขียน เลือกหน้า) แต่หน้าตาเป็นของเบราว์เซอร์ คุมสไตล์ไม่ได้
   * false = เหลือแต่เนื้อเอกสาร หน้าตาเข้ากับ DS แต่ไม่มีเครื่องมือของเบราว์เซอร์
   */
  nativeControls?: boolean
  /** สั่งพิมพ์เอง เช่นต้องเรียก endpoint ที่ทำ PDF สำหรับพิมพ์แยกต่างหาก */
  onPrint?: (file: PreviewFile) => void
  /** ข้อความปุ่ม — เปลี่ยนตามภาษาของแอปได้ */
  labels?: Partial<typeof DEFAULT_LABELS>
  className?: string
}

function FilePreview({ file, ...props }: FilePreviewProps) {
  if (!file) return null
  /* key = ไฟล์ ทำให้รอยขีดกับโหมดวาดรีเซ็ตเองตอนสลับไฟล์ ไม่ต้องมี effect ตามล้าง */
  return <FilePreviewDialog key={file.src} file={file} {...props} />
}

function FilePreviewDialog({
  file,
  open,
  onOpenChange,
  showPrint = true,
  showDownload = true,
  showMarkup = true,
  nativeControls = true,
  onPrint,
  labels,
  className,
}: FilePreviewProps & { file: PreviewFile }) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const kind = detectKind(file)
  const previewable = kind !== "other"
  const canPrint = showPrint && (previewable || onPrint !== undefined)
  const canMarkup = showMarkup && kind === "image"

  const imgRef = React.useRef<HTMLImageElement>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const swatchRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const drawingRef = React.useRef<Stroke | null>(null)

  const [markup, setMarkup] = React.useState(false)
  const [colorIndex, setColorIndex] = React.useState(0)
  const [width, setWidth] = React.useState<number>(PEN_SIZES[1]!)
  const [strokes, setStrokes] = React.useState<Stroke[]>([])

  /* วาดใหม่ทั้งกองทุกครั้งที่ strokes เปลี่ยน — undo/ล้างจึงเป็นแค่การตัดอาร์เรย์
     ไม่ต้องเก็บภาพก่อนหน้าไว้เป็นชั้น ๆ */
  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    if (canvas.width !== Math.round(rect.width * dpr)) {
      canvas.width = Math.round(rect.width * dpr)
      canvas.height = Math.round(rect.height * dpr)
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.clearRect(0, 0, rect.width, rect.height)
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    const all = drawingRef.current ? [...strokes, drawingRef.current] : strokes
    for (const stroke of all) {
      if (stroke.points.length === 0) continue
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width
      ctx.beginPath()
      stroke.points.forEach((p, i) => {
        const x = p.x * rect.width
        const y = p.y * rect.height
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      /* จุดเดียวยังไม่เป็นเส้น — ลากให้ทับตัวเองเพื่อให้เห็นเป็นจุดกลม */
      if (stroke.points.length === 1) {
        const p = stroke.points[0]!
        ctx.lineTo(p.x * rect.width, p.y * rect.height)
      }
      ctx.stroke()
    }
  }, [strokes])

  React.useEffect(redraw, [redraw])

  /* ขนาดกรอบรูปเปลี่ยนตามหน้าต่าง — ต้องปรับ canvas แล้ววาดใหม่ตาม */
  React.useEffect(() => {
    const img = imgRef.current
    if (!img || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => redraw())
    observer.observe(img)
    return () => observer.disconnect()
  }, [redraw])

  const pointAt = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }

  const startStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    /* อ่านสีจริงจากปุ่มสีที่เลือกอยู่ — ค่านี้มาจาก token ผ่านคลาส bg-* */
    const swatch = swatchRefs.current[colorIndex]
    const color = swatch
      ? window.getComputedStyle(swatch).backgroundColor
      : "currentColor"
    e.currentTarget.setPointerCapture(e.pointerId)
    drawingRef.current = { color, width, points: [pointAt(e)] }
    redraw()
  }

  const extendStroke = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawingRef.current) return
    drawingRef.current.points.push(pointAt(e))
    redraw()
  }

  const endStroke = () => {
    const stroke = drawingRef.current
    drawingRef.current = null
    if (stroke && stroke.points.length > 0) setStrokes((prev) => [...prev, stroke])
  }

  /**
   * รวมรูปกับรอยขีดเป็นไฟล์เดียวขนาดเท่าต้นฉบับ
   * คืน null เมื่อยังไม่มีรอยขีด หรือรูปมาจากคนละ origin จนแตะ canvas ไม่ได้
   * (เบราว์เซอร์จะถือว่า canvas ปนเปื้อนแล้วโยน SecurityError ตอนดึงภาพออก)
   */
  const flatten = React.useCallback(() => {
    const img = imgRef.current
    if (!img || strokes.length === 0) return null

    const w = img.naturalWidth || img.clientWidth
    const h = img.naturalHeight || img.clientHeight
    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    ctx.drawImage(img, 0, 0, w, h)
    /* เส้นหนาเท่าที่เห็นบนจอ ต้องคูณอัตราส่วนขึ้นไปตามขนาดจริงของรูป */
    const scale = img.clientWidth ? w / img.clientWidth : 1
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    for (const stroke of strokes) {
      ctx.strokeStyle = stroke.color
      ctx.lineWidth = stroke.width * scale
      ctx.beginPath()
      stroke.points.forEach((p, i) => {
        const x = p.x * w
        const y = p.y * h
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
    }

    try {
      return canvas.toDataURL("image/png")
    } catch {
      return null
    }
  }, [strokes])

  const handlePrint = () => {
    if (onPrint) return onPrint(file)
    printInHiddenFrame(flatten() ?? file.src, kind === "image")
  }

  const handleSaveMarkup = () => {
    const data = flatten()
    if (!data) return
    const link = document.createElement("a")
    link.href = data
    link.download = file.name.replace(/(\.[^.]+)?$/, "-markup.png")
    link.click()
  }

  /* ตัวอ่าน pdf ของเบราว์เซอร์เป็นหน้าต่างของมันเอง สไตล์เราไปไม่ถึง
     ปิดแถบเครื่องมือของมันได้อย่างเดียวถ้าอยากให้เหลือแต่เนื้อเอกสาร */
  const frameSrc =
    kind === "pdf" && !nativeControls
      ? `${file.src}#toolbar=0&navpanes=0&statusbar=0`
      : file.src

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "max-w-[min(96vw,64rem)] gap-0 overflow-hidden p-0",
          className
        )}
      >
        {/* Dialog ต้องมี title เสมอเพื่อ screen reader — ชื่อไฟล์โชว์อยู่แล้วจึงซ่อนตัวนี้ */}
        <DialogTitle className="sr-only">{file.name}</DialogTitle>

        <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{file.name}</p>
            {file.meta ? (
              <p className="truncate text-xs text-muted-foreground">{file.meta}</p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-1">
            {canMarkup ? (
              <Button
                variant={markup ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={markup}
                onClick={() => setMarkup((on) => !on)}
              >
                <PencilIcon />
                {l.markup}
              </Button>
            ) : null}

            {canPrint ? (
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label={l.print}
                onClick={handlePrint}
              >
                <PrinterIcon />
              </Button>
            ) : null}

            {showDownload ? (
              /* ดาวน์โหลดคือการไปที่ไฟล์ ต้องเป็น <a> ไม่ใช่ปุ่มที่ผูก onClick
                 คนใช้จะได้กด "เปิดในแท็บใหม่" หรือคัดลอกลิงก์จากเมนูคลิกขวาได้ */
              <Button asChild variant="ghost" size="icon-sm">
                <a href={file.src} download={file.name} aria-label={l.download}>
                  <DownloadIcon />
                </a>
              </Button>
            ) : null}

            <DialogClose asChild>
              <Button variant="ghost" size="icon-sm" aria-label={l.close}>
                <XIcon />
              </Button>
            </DialogClose>
          </div>
        </div>

        {/* แถบเครื่องมือขีดมาร์ก — สี ขนาดเส้น ย้อนกลับ ล้าง บันทึกสำเนา */}
        {canMarkup && markup ? (
          <div className="flex flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-4 py-2">
            <div className="flex items-center gap-1" role="group" aria-label={l.penColor}>
              {PEN_COLORS.map((color, i) => (
                <button
                  key={color}
                  ref={(node) => {
                    swatchRefs.current[i] = node
                  }}
                  type="button"
                  aria-label={`${l.penColor} ${i + 1}`}
                  aria-pressed={colorIndex === i}
                  onClick={() => setColorIndex(i)}
                  className={cn(
                    "size-6 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                    "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                    colorIndex === i && "ring-2 ring-ring",
                    color
                  )}
                />
              ))}
            </div>

            <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />

            <div className="flex items-center gap-1" role="group" aria-label={l.penSize}>
              {PEN_SIZES.map((size) => (
                <Button
                  key={size}
                  variant={width === size ? "secondary" : "ghost"}
                  size="icon-sm"
                  aria-label={`${l.penSize} ${size}`}
                  aria-pressed={width === size}
                  onClick={() => setWidth(size)}
                >
                  <span
                    className="rounded-full bg-foreground"
                    style={{ width: size + 2, height: size + 2 }}
                  />
                </Button>
              ))}
            </div>

            <Separator orientation="vertical" className="data-[orientation=vertical]:h-5" />

            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={l.undo}
              disabled={strokes.length === 0}
              onClick={() => setStrokes((prev) => prev.slice(0, -1))}
            >
              <Undo2Icon />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={l.clear}
              disabled={strokes.length === 0}
              onClick={() => setStrokes([])}
            >
              <EraserIcon />
            </Button>

            <Button
              variant="outline"
              size="sm"
              className="ml-auto"
              disabled={strokes.length === 0}
              onClick={handleSaveMarkup}
            >
              <DownloadIcon />
              {l.saveMarkup}
            </Button>
          </div>
        ) : null}

        <div className="flex min-h-[60vh] items-center justify-center bg-muted/40 p-4">
          {kind === "image" ? (
            <div className="relative w-fit">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                ref={imgRef}
                src={file.src}
                alt={file.name}
                onLoad={redraw}
                className="block max-h-[calc(75vh-2rem)] rounded-md border border-border bg-background object-contain"
              />
              <canvas
                ref={canvasRef}
                className={cn(
                  "absolute inset-0 size-full rounded-md",
                  markup ? "cursor-crosshair touch-none" : "pointer-events-none"
                )}
                onPointerDown={markup ? startStroke : undefined}
                onPointerMove={markup ? extendStroke : undefined}
                onPointerUp={markup ? endStroke : undefined}
                onPointerCancel={markup ? endStroke : undefined}
              />
            </div>
          ) : previewable ? (
            /* ครอบ iframe ด้วยกรอบของ DS — ข้างในเป็นหน้าต่างของเบราว์เซอร์
               ซึ่งสไตล์เราไปไม่ถึง อย่างน้อยขอบนอกจึงต้องเข้าชุดกับที่เหลือ */
            <iframe
              src={frameSrc}
              title={file.name}
              className="h-[72vh] w-full rounded-md border border-border bg-background"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground [&_svg]:size-5">
                <FileIcon />
              </span>
              <div className="space-y-1">
                <p className="text-sm font-medium">{l.unsupported}</p>
                <p className="text-xs text-muted-foreground">{l.unsupportedHint}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild>
                  <a href={file.src} download={file.name}>
                    <DownloadIcon />
                    {l.download}
                  </a>
                </Button>
                <Button asChild variant="outline">
                  <a href={file.src} target="_blank" rel="noreferrer">
                    <ExternalLinkIcon />
                    {l.openInNewTab}
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { FilePreview, type PreviewFile }
