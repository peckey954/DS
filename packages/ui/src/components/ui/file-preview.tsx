"use client"

import * as React from "react"
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  EraserIcon,
  ExternalLinkIcon,
  FileIcon,
  PanelLeftIcon,
  PencilIcon,
  PrinterIcon,
  Undo2Icon,
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
import { Separator } from "@peckey954/ui/components/ui/separator"
import { Spinner } from "@peckey954/ui/components/ui/spinner"

/**
 * หน้าต่างดูตัวอย่างไฟล์ — เลื่อนดูทุกหน้า ซูม ขีดมาร์ก พิมพ์ ดาวน์โหลด
 *
 *   const [file, setFile] = useState<PreviewFile | null>(null)
 *
 *   <FilePreview
 *     file={file}
 *     open={file !== null}
 *     onOpenChange={(open) => { if (!open) setFile(null) }}
 *     labels={{ print: "พิมพ์", download: "ดาวน์โหลด", back: "ย้อนกลับ" }}
 *   />
 *
 * วางตัวเป็น "หน้าเอกสาร" ไม่ใช่กล่องเด้ง: แถวบนมีลูกศรย้อนกลับกับชื่อไฟล์
 * แถวถัดมาเป็นเครื่องมือ ไม่มีแผงแก้เอกสารด้านข้าง
 *
 * pdf เรนเดอร์เองด้วย pdf.js ลง canvas ไม่ได้ฝากตัวอ่านของเบราว์เซอร์
 * เพราะตัวนั้นเป็นหน้าต่างของมันเอง สไตล์ของ DS ไปไม่ถึงสักจุดและขีดทับไม่ได้
 * พอวาดเองแล้วทั้งแถบเครื่องมือ · แถบหน้า · ซูม · ขีดมาร์ก เป็นของเราหมด
 *
 * ทุกหน้าต่อกันเป็นแถวยาวเลื่อนดูได้ ปุ่มเลื่อนหน้ากับรูปย่อเป็นแค่ทางลัด
 * ไม่ใช่ทางเดียวที่จะข้ามหน้า
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

/* ---------------------------------------------------------------------- */
/* pdf.js                                                                  */
/* ---------------------------------------------------------------------- */

type PdfViewport = { width: number; height: number }
type PdfPage = {
  getViewport: (opts: { scale: number }) => PdfViewport
  render: (opts: {
    canvas: HTMLCanvasElement
    viewport: PdfViewport
    transform?: number[]
  }) => { promise: Promise<void>; cancel: () => void }
}
type PdfDoc = {
  numPages: number
  getPage: (page: number) => Promise<PdfPage>
}
/* v6 ย้าย destroy() ไปไว้ที่ loading task ไม่ใช่ตัวเอกสาร
   เรียกจากตัวเอกสารจะได้ "d.destroy is not a function" */
type PdfLoadingTask = { promise: Promise<PdfDoc>; destroy: () => Promise<void> }

/* v6 ขึ้นไปรับเฉพาะอ็อบเจกต์ ส่ง url เป็นสตริงเปล่า ๆ จะโยน
   "expected either `data`, `range`, or `url` parameter" ทันที */
type PdfjsModule = {
  getDocument: (src: { url: string }) => PdfLoadingTask
}

let pdfjsPromise: Promise<PdfjsModule> | null = null

/**
 * โหลด pdf.js แบบ dynamic — ก้อนนี้ใหญ่ ไม่ควรติดไปกับ bundle แรกของหน้า
 * ทั้งที่คนส่วนใหญ่ไม่ได้เปิด pdf
 *
 * worker ชี้ไปไฟล์ที่ bundler ปล่อยออกมาเอง ไม่ใช่ CDN — DS ห้ามยิงเน็ตออกนอก
 * และต้องทำงานได้หลังกำแพง CSP ของแอปปลายทาง
 */
function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = import("pdfjs-dist").then((mod) => {
      const pdfjs = mod as unknown as PdfjsModule & {
        GlobalWorkerOptions: { workerPort: Worker | null }
      }
      pdfjs.GlobalWorkerOptions.workerPort = new Worker(
        new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url),
        { type: "module" }
      )
      return pdfjs
    })
  }
  return pdfjsPromise
}

/** วาดหน้า pdf ลง canvas ให้คมตามความละเอียดจอ */
async function renderPdfPage(
  doc: PdfDoc,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  scale: number
) {
  const page = await doc.getPage(pageNumber)
  const viewport = page.getViewport({ scale })
  const dpr = window.devicePixelRatio || 1

  canvas.width = Math.floor(viewport.width * dpr)
  canvas.height = Math.floor(viewport.height * dpr)
  canvas.style.width = `${Math.floor(viewport.width)}px`
  canvas.style.height = `${Math.floor(viewport.height)}px`

  return page.render({
    canvas,
    viewport,
    transform: dpr === 1 ? undefined : [dpr, 0, 0, dpr, 0, 0],
  })
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

/** รัศมีปลายยางลบเป็นพิกเซลบนจอ */
const ERASER_RADIUS = 12

const ZOOM_MIN = 0.5
const ZOOM_MAX = 3
const ZOOM_STEP = 0.25

/** มากกว่านี้ไม่ทำรูปย่อให้ เพราะต้องเรนเดอร์ทีละหน้าจนหน่วง */
const THUMBNAIL_LIMIT = 40

type Point = { x: number; y: number }
/** จุดเก็บเป็นสัดส่วน 0–1 ของกรอบเอกสาร จะได้ไม่เพี้ยนตอนซูมหรือตอนบันทึก */
type Stroke = { color: string; width: number; points: Point[] }

const NO_STROKES: Stroke[] = []

/* ---------------------------------------------------------------------- */
/* ชั้นขีดมาร์ก — ใช้ร่วมกันทั้งไฟล์รูปและ pdf ทีละหน้า                      */
/* ---------------------------------------------------------------------- */

type MarkupLayerProps = {
  strokes: Stroke[]
  onChange: (next: (prev: Stroke[]) => Stroke[]) => void
  enabled: boolean
  tool: "pen" | "eraser"
  /** อ่านสีจริงตอนเริ่มลาก ไม่ใช่ตอนเรนเดอร์ — สีมาจาก token ผ่านคลาส bg-* */
  getColor: () => string
  penWidth: number
  className?: string
  style?: React.CSSProperties
}

function MarkupLayer({
  strokes,
  onChange,
  enabled,
  tool,
  getColor,
  penWidth,
  className,
  style,
}: MarkupLayerProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const drawingRef = React.useRef<Stroke | null>(null)
  const erasingRef = React.useRef(false)

  const redraw = React.useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!canvas || !ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    if (rect.width === 0) return
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
      /* จุดเดียวยังไม่เป็นเส้น — ลากทับตัวเองเพื่อให้เห็นเป็นจุดกลม */
      if (stroke.points.length === 1) {
        const p = stroke.points[0]!
        ctx.lineTo(p.x * rect.width, p.y * rect.height)
      }
      ctx.stroke()
    }
  }, [strokes])

  React.useEffect(redraw, [redraw])

  /* กรอบเปลี่ยนขนาดตอนซูมหรือย่อหน้าต่าง — ต้องวาดใหม่ตามเสมอ */
  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || typeof ResizeObserver === "undefined") return
    const observer = new ResizeObserver(() => redraw())
    observer.observe(canvas)
    return () => observer.disconnect()
  }, [redraw])

  const pointAt = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = e.currentTarget.getBoundingClientRect()
    return {
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    }
  }

  /** ลบเส้นที่ปลายยางลบแตะโดน — วัดเป็นพิกเซลบนจอ ไม่ใช่สัดส่วน
      เพราะรัศมียางลบต้องเท่าเดิมเสมอไม่ว่าจะซูมอยู่เท่าไร */
  const eraseAt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = e.clientX - rect.left
    const cy = e.clientY - rect.top
    onChange((prev) =>
      prev.filter((stroke) => {
        const reach = ERASER_RADIUS + stroke.width / 2
        return !stroke.points.some((p) => {
          const dx = p.x * rect.width - cx
          const dy = p.y * rect.height - cy
          return dx * dx + dy * dy <= reach * reach
        })
      })
    )
  }

  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    if (tool === "eraser") {
      erasingRef.current = true
      return eraseAt(e)
    }
    drawingRef.current = { color: getColor(), width: penWidth, points: [pointAt(e)] }
    redraw()
  }

  const extend = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (erasingRef.current) return eraseAt(e)
    if (!drawingRef.current) return
    drawingRef.current.points.push(pointAt(e))
    redraw()
  }

  const end = () => {
    erasingRef.current = false
    const stroke = drawingRef.current
    drawingRef.current = null
    if (stroke && stroke.points.length > 0) onChange((prev) => [...prev, stroke])
  }

  return (
    <canvas
      ref={canvasRef}
      data-slot="file-preview-markup"
      style={style}
      className={cn(
        "absolute inset-0 size-full rounded-md",
        enabled ? "touch-none" : "pointer-events-none",
        enabled && (tool === "eraser" ? "cursor-cell" : "cursor-crosshair"),
        className
      )}
      onPointerDown={enabled ? start : undefined}
      onPointerMove={enabled ? extend : undefined}
      onPointerUp={enabled ? end : undefined}
      onPointerCancel={enabled ? end : undefined}
    />
  )
}

/* ---------------------------------------------------------------------- */
/* หนึ่งหน้าของ pdf                                                        */
/* ---------------------------------------------------------------------- */

type PdfPageViewProps = {
  doc: PdfDoc
  pageNumber: number
  zoom: number
  /** อยู่ใกล้ ๆ จอถึงจะวาดจริง หน้าที่เลื่อนผ่านไปไกลแล้วคืนหน่วยความจำทิ้ง */
  active: boolean
  markup: boolean
  tool: "pen" | "eraser"
  getColor: () => string
  penWidth: number
  strokes: Stroke[]
  onStrokes: (next: (prev: Stroke[]) => Stroke[]) => void
  register: (node: HTMLDivElement | null) => void
  registerCanvas: (canvas: HTMLCanvasElement | null) => void
}

function PdfPageView({
  doc,
  pageNumber,
  zoom,
  active,
  markup,
  tool,
  getColor,
  penWidth,
  strokes,
  onStrokes,
  register,
  registerCanvas,
}: PdfPageViewProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [size, setSize] = React.useState<{ w: number; h: number } | null>(null)

  /* รู้ขนาดหน้าก่อนวาดจริง เพื่อกันที่ไว้ให้ครบทุกหน้าตั้งแต่แรก
     ไม่งั้นความสูงรวมของแถวจะเปลี่ยนไปมาระหว่างเลื่อน แล้วตำแหน่งกระโดด */
  React.useEffect(() => {
    let cancelled = false
    void doc
      .getPage(pageNumber)
      .then((page) => {
        if (cancelled) return
        const viewport = page.getViewport({ scale: zoom })
        setSize({ w: Math.floor(viewport.width), h: Math.floor(viewport.height) })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [doc, pageNumber, zoom])

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!active) {
      /* คืนหน่วยความจำของหน้าที่เลื่อนผ่านไปแล้ว เอกสาร 100 หน้าถ้าเก็บ canvas
         ไว้ทุกใบกินหลายร้อยเมกะไบต์ */
      canvas.width = 0
      canvas.height = 0
      return
    }

    let task: { cancel: () => void } | null = null
    void renderPdfPage(doc, pageNumber, canvas, zoom)
      .then((t) => {
        task = t
        return t.promise
      })
      .catch(() => {
        /* ยกเลิกกลางคันตอนเลื่อนเร็ว ๆ หรือซูมเป็นเรื่องปกติ ไม่ต้องแจ้ง */
      })
    return () => task?.cancel()
  }, [doc, pageNumber, zoom, active])

  return (
    <div
      ref={register}
      data-page={pageNumber}
      className="relative shrink-0"
      style={size ? { width: size.w, height: size.h } : undefined}
    >
      <canvas
        ref={(node) => {
          canvasRef.current = node
          registerCanvas(node)
        }}
        className="block size-full rounded-md border border-border bg-background shadow-sm"
      />
      <MarkupLayer
        strokes={strokes}
        onChange={onStrokes}
        enabled={markup}
        tool={tool}
        getColor={getColor}
        penWidth={penWidth}
      />
    </div>
  )
}

/* ---------------------------------------------------------------------- */

const DEFAULT_LABELS = {
  print: "Print",
  download: "Download",
  back: "Back",
  openInNewTab: "Open in a new tab",
  unsupported: "No preview for this file type",
  unsupportedHint: "Download it to open with an app on your device",
  markup: "Markup",
  pen: "Pen",
  eraser: "Eraser",
  penColor: "Pen colour",
  penSize: "Pen size",
  undo: "Undo",
  togglePages: "Show or hide pages",
  zoomIn: "Zoom in",
  zoomOut: "Zoom out",
  resetZoom: "Reset zoom",
  previousPage: "Previous page",
  nextPage: "Next page",
  previousFile: "Previous file",
  nextFile: "Next file",
  page: "Page",
  pages: "Pages",
  loading: "Loading…",
}

type FilePreviewProps = {
  file: PreviewFile | null
  open: boolean
  onOpenChange: (open: boolean) => void
  /** ซ่อนปุ่มพิมพ์ เช่นไฟล์ที่พิมพ์แล้วไม่มีความหมาย */
  showPrint?: boolean
  showDownload?: boolean
  /** ปิดโหมดขีดมาร์ก (ค่าเริ่มต้นเปิดกับ pdf และรูป) */
  showMarkup?: boolean
  /** ซ่อนแถบรูปย่อด้านซ้ายของ pdf หลายหน้า */
  showThumbnails?: boolean
  /** สั่งพิมพ์เอง เช่นต้องเรียก endpoint ที่ทำ PDF สำหรับพิมพ์แยกต่างหาก */
  onPrint?: (file: PreviewFile) => void
  /**
   * เลื่อนไปไฟล์ก่อนหน้า/ถัดไป — ไม่ส่งมาสักตัว = ดูไฟล์เดียว ไม่โชว์ปุ่มเลื่อน
   * component ไม่ถือรายการไฟล์เอง ฝั่งที่ใช้เป็นคนสลับ `file` prop เองตอนกด
   * (เหมือน onFilesAccepted ของ FileUpload — กันไม่ให้มีสอง source of truth)
   */
  onPrevious?: () => void
  onNext?: () => void
  /** ปุ่มเลื่อนหรี่เองเมื่อชนขอบ — ไม่ส่งมาถือว่าเลื่อนได้เสมอ */
  hasPrevious?: boolean
  hasNext?: boolean
  /** ข้อความนับไฟล์ เช่น "2 / 5" — โชว์ต่อท้าย meta ใต้ชื่อไฟล์ */
  counter?: string
  /** ข้อความปุ่ม — เปลี่ยนตามภาษาของแอปได้ */
  labels?: Partial<typeof DEFAULT_LABELS>
  className?: string
}

function FilePreview({ file, ...props }: FilePreviewProps) {
  if (!file) return null
  /* key = ไฟล์ ทำให้รอยขีด หน้าปัจจุบัน และการซูมรีเซ็ตเองตอนสลับไฟล์ */
  return <FilePreviewDialog key={file.src} file={file} {...props} />
}

function FilePreviewDialog({
  file,
  open,
  onOpenChange,
  showPrint = true,
  showDownload = true,
  showMarkup = true,
  showThumbnails = true,
  onPrint,
  onPrevious,
  onNext,
  hasPrevious = true,
  hasNext = true,
  counter,
  labels,
  className,
}: FilePreviewProps & { file: PreviewFile }) {
  const l = { ...DEFAULT_LABELS, ...labels }
  const kind = detectKind(file)

  const imgRef = React.useRef<HTMLImageElement>(null)
  const thumbRefs = React.useRef<(HTMLCanvasElement | null)[]>([])
  const swatchRefs = React.useRef<(HTMLButtonElement | null)[]>([])
  const pageEls = React.useRef<Map<number, HTMLDivElement>>(new Map())
  const pageCanvases = React.useRef<Map<number, HTMLCanvasElement>>(new Map())
  const observerRef = React.useRef<IntersectionObserver | null>(null)
  const detachWheel = React.useRef<(() => void) | null>(null)
  const ratios = React.useRef<Map<number, number>>(new Map())

  const [doc, setDoc] = React.useState<PdfDoc | null>(null)
  const [pageCount, setPageCount] = React.useState(0)
  const [page, setPage] = React.useState(1)
  const [activePages, setActivePages] = React.useState<number[]>([1])
  const [pdfState, setPdfState] = React.useState<"idle" | "loading" | "failed">(
    kind === "pdf" ? "loading" : "idle"
  )

  const [markup, setMarkup] = React.useState(false)
  /* ยางลบเป็น "เครื่องมือ" ไม่ใช่ปุ่มล้างทั้งหมด — ต้องลากทับเส้นถึงจะลบ
     เหมือนยางลบจริง กดทีเดียวหายทั้งหน้าเป็นพฤติกรรมที่กู้คืนยาก */
  const [tool, setTool] = React.useState<"pen" | "eraser">("pen")
  /* ปิดแถบรูปย่อไว้ก่อนบนจอแคบ — ตัวแถบกว้างตายตัว 128px กินพื้นที่เกิน 1 ใน 3
     ของ dialog บนมือถือจนเนื้อหาเอกสารเหลือน้อยจนอ่านไม่ออก เปิดเองได้ทีหลังผ่าน
     ปุ่มสลับ ค่าเริ่มต้นเช็คแค่ตอน mount ไม่ผูก event เพราะไม่ต้องตามหน้าจอหมุน
     (FilePreview ไม่ได้ mount ค้างไว้ตั้งแต่ SSR — เปิดจากคลิกฝั่ง client เท่านั้น
     จึงไม่มีปัญหา hydration mismatch จากการเช็ค window ตรงนี้) */
  const [railOpen, setRailOpen] = React.useState(
    () => typeof window !== "undefined" && window.innerWidth >= 640
  )
  const [colorIndex, setColorIndex] = React.useState(0)
  const [width, setWidth] = React.useState<number>(PEN_SIZES[1]!)
  const [zoom, setZoom] = React.useState(1)
  /* รอยขีดแยกตามหน้า ไม่งั้นขีดหน้า 1 แล้วไปโผล่ทับหน้า 2 */
  const [strokeMap, setStrokeMap] = React.useState<Record<number, Stroke[]>>({})

  const strokesOf = React.useCallback(
    (n: number) => strokeMap[n] ?? NO_STROKES,
    [strokeMap]
  )
  const setStrokesOf = React.useCallback(
    (n: number) => (next: (prev: Stroke[]) => Stroke[]) => {
      setStrokeMap((prev) => ({ ...prev, [n]: next(prev[n] ?? NO_STROKES) }))
    },
    []
  )

  /* ปิดแล้วต้องกลับไปตั้งต้น — รอยขีดเป็นของชั่วคราวจนกว่าจะกดดาวน์โหลดออกไป
     ไม่งั้นเปิดไฟล์เดิมซ้ำแล้วเจอรอยขีดของเมื่อกี้ค้างอยู่ */
  React.useEffect(() => {
    if (open) return
    setStrokeMap({})
    setMarkup(false)
    setTool("pen")
    setZoom(1)
    setPage(1)
  }, [open])

  const isPdf = kind === "pdf" && pdfState !== "failed"
  const pdfReady = isPdf && pdfState === "idle"
  const previewable = kind !== "other"
  const canMarkup = showMarkup && (kind === "image" || pdfReady)
  const canZoom = kind === "image" || pdfReady
  const canPrint = showPrint && (previewable || onPrint !== undefined)
  const canNavigate = onPrevious !== undefined || onNext !== undefined

  /* ลูกศรซ้าย/ขวาเลื่อนไฟล์ — เหมือน MediaViewer ทุกอย่าง ยกเว้นไม่วนกลับหัวท้าย
     เพราะที่นี่ปุ่มหรี่เองตอนชนขอบ (hasPrevious/hasNext) ไม่ได้วนลูปเสมอแบบนั้น */
  React.useEffect(() => {
    if (!open || !canNavigate) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrevious) onPrevious?.()
      else if (e.key === "ArrowRight" && hasNext) onNext?.()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, canNavigate, hasPrevious, hasNext, onPrevious, onNext])

  const getPenColor = React.useCallback(() => {
    const swatch = swatchRefs.current[colorIndex]
    return swatch ? window.getComputedStyle(swatch).backgroundColor : "currentColor"
  }, [colorIndex])

  /* ---------------------------- โหลดเอกสาร ---------------------------- */

  React.useEffect(() => {
    if (kind !== "pdf") return
    let cancelled = false
    let task: PdfLoadingTask | null = null

    void loadPdfjs()
      .then((pdfjs) => {
        task = pdfjs.getDocument({ url: file.src })
        return task.promise
      })
      .then((d) => {
        if (cancelled) return
        setDoc(d)
        setPageCount(d.numPages)
        setPdfState("idle")
      })
      .catch((error: unknown) => {
        /* เปิดไม่ได้ก็ยังต้องมีอะไรให้ดู — ตกไปใช้ตัวอ่านของเบราว์เซอร์แทน
           ดีกว่าโชว์จอว่างเวลา worker โหลดไม่ผ่านในแอปปลายทางบางตัว
           แต่ต้องบอกเหตุผลใน console ด้วย ไม่งั้นคนใช้เจอหน้าตาคนละแบบ
           แล้วไม่รู้เลยว่าทำไม */
        if (cancelled) return
        console.warn(
          "[file-preview] pdf.js เปิดเอกสารไม่สำเร็จ ตกไปใช้ตัวอ่านของเบราว์เซอร์แทน",
          error
        )
        setPdfState("failed")
      })

    return () => {
      cancelled = true
      /* ปิด worker กับ network ที่ค้างอยู่ ไม่งั้น effect รอบที่สองของ StrictMode
         จะเปิดซ้อนอันเดิม */
      void task?.destroy()
    }
  }, [file.src, kind])

  /* ---------------------------- รูปย่อ ---------------------------- */

  React.useEffect(() => {
    if (!doc || !showThumbnails || pageCount < 2) return
    let cancelled = false

    void (async () => {
      const total = Math.min(pageCount, THUMBNAIL_LIMIT)
      /* ไล่ทีละใบ ไม่ยิงพร้อมกัน — pdf.js ทำงานบน worker เส้นเดียว
         ยิงพร้อมกันทั้งเล่มมีแต่จะแย่งคิวกันจนหน้าหลักมาช้า */
      for (let i = 1; i <= total; i += 1) {
        if (cancelled) return
        const canvas = thumbRefs.current[i - 1]
        if (!canvas) continue
        try {
          const task = await renderPdfPage(doc, i, canvas, 0.22)
          await task.promise
        } catch {
          return
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [doc, pageCount, showThumbnails])

  /* ------------------- พื้นที่เลื่อน: ล้อซูม + ติดตามหน้า ------------------- */

  const canZoomRef = React.useRef(canZoom)
  canZoomRef.current = canZoom

  /**
   * ผูกผ่าน callback ref ไม่ใช่ useEffect เพราะเนื้อ dialog อยู่ใน portal
   * ที่ยัง mount ไม่เสร็จตอน effect รอบแรกทำงาน (ref ยังเป็น null)
   * ถ้าไม่มี state อะไรเปลี่ยนต่อจากนั้น effect จะไม่ถูกเรียกซ้ำอีกเลย
   */
  const attachScroller = React.useCallback((node: HTMLDivElement | null) => {
    detachWheel.current?.()
    detachWheel.current = null
    observerRef.current?.disconnect()
    observerRef.current = null
    if (!node) return

    /* ซูมด้วยจีบนิ้วบนแทร็กแพดหรือ Ctrl+ล้อเมาส์ — ทั้งสองอย่างมาเป็น wheel + ctrlKey
       ต้องผูกเองด้วย passive:false เพราะ onWheel ของ React เป็น passive
       สั่ง preventDefault ไม่ได้ แล้วเบราว์เซอร์จะไปซูมทั้งหน้าเว็บแทน */
    const onWheel = (e: WheelEvent) => {
      if (!canZoomRef.current) return
      if (!e.ctrlKey && !e.metaKey) return
      e.preventDefault()
      setZoom((z) => {
        /* คูณแบบ exponential เพื่อให้จีบนิ้วเข้า-ออกได้ระยะเท่ากัน
           แล้วคุมเพดานต่อหนึ่งเหตุการณ์ไว้ ไม่งั้นล้อเมาส์หนึ่งคลิก
           (deltaY ~120) กระโดดทีเดียวเกินสองเท่า */
        const factor = Math.min(1.25, Math.max(0.8, Math.exp(-e.deltaY * 0.002)))
        /* ปัดเป็นขั้นละ 0.05 ไม่งั้น pdf ต้องเรนเดอร์ใหม่ทุกทศนิยมที่ขยับ */
        const stepped = Math.round(z * factor * 20) / 20
        return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, stepped))
      })
    }
    node.addEventListener("wheel", onWheel, { passive: false })
    detachWheel.current = () => node.removeEventListener("wheel", onWheel)

    /* หน้าไหนอยู่ในจอมากที่สุด = หน้าปัจจุบัน เลื่อนเองก็อัปเดตเลขหน้าตาม
       rootMargin เผื่อไว้รอบนอกเพื่อวาดหน้าถัดไปรอไว้ก่อนเลื่อนถึง */
    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const n = Number((entry.target as HTMLElement).dataset.page)
          if (!n) continue
          ratios.current.set(n, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        const seen = [...ratios.current.entries()]
        const near = seen.filter(([, r]) => r > 0).map(([n]) => n)
        setActivePages((prev) =>
          prev.length === near.length && prev.every((n, i) => n === near[i])
            ? prev
            : near
        )
        let best = 0
        let bestRatio = 0
        for (const [n, r] of seen) {
          if (r > bestRatio) {
            bestRatio = r
            best = n
          }
        }
        if (best) setPage(best)
      },
      { root: node, rootMargin: "300px 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    )
    pageEls.current.forEach((el) => observerRef.current?.observe(el))
  }, [])

  const registerPage = React.useCallback(
    (n: number) => (node: HTMLDivElement | null) => {
      const existing = pageEls.current.get(n)
      if (existing) observerRef.current?.unobserve(existing)
      if (node) {
        pageEls.current.set(n, node)
        observerRef.current?.observe(node)
      } else {
        pageEls.current.delete(n)
        ratios.current.delete(n)
      }
    },
    []
  )

  const registerCanvas = React.useCallback(
    (n: number) => (node: HTMLCanvasElement | null) => {
      if (node) pageCanvases.current.set(n, node)
      else pageCanvases.current.delete(n)
    },
    []
  )

  /** เลื่อนไปหน้าที่ต้องการ — ปุ่มกับรูปย่อเป็นทางลัดของการเลื่อนเท่านั้น */
  const goToPage = React.useCallback(
    (next: number) => {
      const target = Math.min(Math.max(1, next), Math.max(1, pageCount))
      const el = pageEls.current.get(target)
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
      setPage(target)
    },
    [pageCount]
  )

  /* ---------------------------- พิมพ์ / ดาวน์โหลด ---------------------------- */

  /**
   * รวมหน้าที่เห็นอยู่กับรอยขีดเป็นรูปเดียว
   * คืน null เมื่อยังไม่มีรอยขีด หรือรูปมาจากคนละ origin จนแตะ canvas ไม่ได้
   * (เบราว์เซอร์จะถือว่า canvas ปนเปื้อนแล้วโยน SecurityError ตอนดึงภาพออก)
   */
  const flatten = React.useCallback(() => {
    const strokes = strokeMap[kind === "image" ? 1 : page] ?? NO_STROKES
    const source: HTMLImageElement | HTMLCanvasElement | null | undefined =
      kind === "image" ? imgRef.current : pageCanvases.current.get(page)
    if (!source || strokes.length === 0) return null

    const w =
      source instanceof HTMLImageElement
        ? source.naturalWidth || source.clientWidth
        : source.width
    const h =
      source instanceof HTMLImageElement
        ? source.naturalHeight || source.clientHeight
        : source.height
    if (!w || !h) return null

    const canvas = document.createElement("canvas")
    canvas.width = w
    canvas.height = h
    const ctx = canvas.getContext("2d")
    if (!ctx) return null

    /* รองพื้นขาวก่อน — รูปโปร่งใสจะกลายเป็นดำสนิทถ้าไม่รอง */
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, w, h)
    ctx.drawImage(source, 0, 0, w, h)

    /* เส้นหนาเท่าที่เห็นบนจอ ต้องคูณอัตราส่วนขึ้นไปตามขนาดจริงของหน้า */
    const scale = source.clientWidth ? w / source.clientWidth : 1
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
  }, [strokeMap, kind, page])

  const handlePrint = () => {
    if (onPrint) return onPrint(file)
    /* มีรอยขีดบนหน้านี้ = พิมพ์ฉบับที่รวมรอยขีด ไม่มีก็ส่งไฟล์ต้นฉบับไปทั้งใบ */
    const marked = flatten()
    if (marked) return printInHiddenFrame(marked, true)
    printInHiddenFrame(file.src, kind === "image")
  }

  /**
   * มีรอยขีดอยู่ = ดาวน์โหลดฉบับที่รวมรอยขีดแทนไฟล์ต้นฉบับ
   * ไม่มีรอยขีดก็ปล่อยให้ <a download> ทำงานตามปกติ (คลิกขวาคัดลอกลิงก์ได้อยู่)
   */
  const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const data = flatten()
    if (!data) return
    e.preventDefault()
    const suffix = isPdf && pageCount > 1 ? `-p${page}` : ""
    const link = document.createElement("a")
    link.href = data
    link.download = file.name.replace(/(\.[^.]+)?$/, `${suffix}-markup.png`)
    link.click()
  }

  const showRail = pdfReady && showThumbnails && railOpen && pageCount > 1
  const hasToolbar = canMarkup || canZoom || (pdfReady && pageCount > 1)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        /* ต้องเป็น sm:max-w-* ไม่ใช่ max-w-* เฉย ๆ เพราะ DialogContent ตั้ง
           sm:max-w-lg ไว้ ซึ่งชนะคลาสที่ไม่มี breakpoint ตั้งแต่จอ 640px ขึ้นไป */
        className={cn(
          "gap-0 overflow-hidden p-0 sm:max-w-[min(96vw,80rem)]",
          className
        )}
      >
        {/* Dialog ต้องมี title เสมอเพื่อ screen reader — ชื่อไฟล์โชว์อยู่แล้วจึงซ่อนตัวนี้ */}
        <DialogTitle className="sr-only">{file.name}</DialogTitle>

        {/* แถวบน — ย้อนกลับ · ชื่อไฟล์ · ปุ่มที่ทำกับไฟล์ทั้งใบ */}
        <div className="flex min-w-0 items-center gap-2 border-b border-border px-3 py-2.5">
          <DialogClose asChild>
            {/* ลูกศรย้อนกลับ ไม่ใช่กากบาท — หน้านี้อ่านเป็น "หน้าเอกสาร" ที่เดินเข้ามา
                ไม่ใช่กล่องเด้งที่ปิดทิ้ง ปุ่มจึงต้องสื่อว่าถอยกลับไปหน้าเดิม */}
            <Button variant="ghost" size="icon-sm" aria-label={l.back}>
              <ArrowLeftIcon />
            </Button>
          </DialogClose>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{file.name}</p>
            {file.meta || counter ? (
              <p className="truncate text-xs text-muted-foreground">
                {file.meta}
                {file.meta && counter ? " · " : null}
                {counter}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-1">
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
                <a
                  href={file.src}
                  download={file.name}
                  aria-label={l.download}
                  onClick={handleDownload}
                >
                  <DownloadIcon />
                </a>
              </Button>
            ) : null}
          </div>
        </div>

        {/* แถวเครื่องมือ — หน้า · ขีดมาร์ก · ซูม เท่าที่ทำได้จริงกับไฟล์ชนิดนั้น */}
        {hasToolbar ? (
          <div className="flex min-w-0 flex-wrap items-center gap-2 border-b border-border bg-muted/40 px-3 py-2">
            {pdfReady && pageCount > 1 ? (
              <>
                {showThumbnails ? (
                  /* หุบแถบหน้าได้ — จอแคบแถบนี้กินที่จนหน้าเอกสารเหลือนิดเดียว */
                  <Button
                    variant={railOpen ? "secondary" : "ghost"}
                    size="icon-sm"
                    aria-label={l.togglePages}
                    aria-pressed={railOpen}
                    onClick={() => setRailOpen((on) => !on)}
                  >
                    <PanelLeftIcon />
                  </Button>
                ) : null}
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={l.previousPage}
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    <ChevronLeftIcon />
                  </Button>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {l.page} {page} / {pageCount}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label={l.nextPage}
                    disabled={page >= pageCount}
                    onClick={() => goToPage(page + 1)}
                  >
                    <ChevronRightIcon />
                  </Button>
                </div>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-5"
                />
              </>
            ) : null}

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

            {canMarkup && markup ? (
              <>
                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-5"
                />

                <div className="flex items-center gap-1" role="group" aria-label={l.markup}>
                  <Button
                    variant={tool === "pen" ? "secondary" : "ghost"}
                    size="icon-sm"
                    aria-label={l.pen}
                    aria-pressed={tool === "pen"}
                    onClick={() => setTool("pen")}
                  >
                    <PencilIcon />
                  </Button>
                  <Button
                    variant={tool === "eraser" ? "secondary" : "ghost"}
                    size="icon-sm"
                    aria-label={l.eraser}
                    aria-pressed={tool === "eraser"}
                    onClick={() => setTool("eraser")}
                  >
                    <EraserIcon />
                  </Button>
                </div>

                <Separator
                  orientation="vertical"
                  className="data-[orientation=vertical]:h-5"
                />

                <div
                  className="flex items-center gap-1"
                  role="group"
                  aria-label={l.penColor}
                >
                  {PEN_COLORS.map((color, i) => (
                    <button
                      key={color}
                      ref={(node) => {
                        swatchRefs.current[i] = node
                      }}
                      type="button"
                      aria-label={`${l.penColor} ${i + 1}`}
                      aria-pressed={colorIndex === i && tool === "pen"}
                      /* เลือกสีหรือขนาด = กลับมาโหมดปากกาให้เลย
                         ไม่ต้องกดปุ่มปากกาซ้ำอีกทีให้เสียจังหวะ */
                      onClick={() => {
                        setColorIndex(i)
                        setTool("pen")
                      }}
                      className={cn(
                        "size-6 rounded-full ring-offset-2 ring-offset-background transition-shadow",
                        "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                        colorIndex === i && tool === "pen" && "ring-2 ring-ring",
                        color
                      )}
                    />
                  ))}
                </div>

                <div
                  className="flex items-center gap-1"
                  role="group"
                  aria-label={l.penSize}
                >
                  {PEN_SIZES.map((size) => (
                    <Button
                      key={size}
                      variant={width === size && tool === "pen" ? "secondary" : "ghost"}
                      size="icon-sm"
                      aria-label={`${l.penSize} ${size}`}
                      aria-pressed={width === size && tool === "pen"}
                      onClick={() => {
                        setWidth(size)
                        setTool("pen")
                      }}
                    >
                      <span
                        className="rounded-full bg-foreground"
                        style={{ width: size + 2, height: size + 2 }}
                      />
                    </Button>
                  ))}
                </div>

                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={l.undo}
                  disabled={strokesOf(kind === "image" ? 1 : page).length === 0}
                  onClick={() =>
                    setStrokesOf(kind === "image" ? 1 : page)((prev) =>
                      prev.slice(0, -1)
                    )
                  }
                >
                  <Undo2Icon />
                </Button>
              </>
            ) : null}

            {canZoom ? (
              /* ml-auto ตั้งแต่ sm: ขึ้นไปเท่านั้น — บนจอแคบที่แถบเครื่องมือ
                 ล้นจนต้องตัดขึ้นบรรทัดใหม่ ถ้ายังดัน ml-auto จะไปลอยชิดขวา
                 บรรทัดใหม่เดี่ยว ๆ ดูเพี้ยน ปล่อยให้ไหลชิดซ้ายต่อจากกลุ่มอื่นแทน */
              <div className="flex items-center gap-1 sm:ml-auto">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={l.zoomOut}
                  disabled={zoom <= ZOOM_MIN}
                  onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
                >
                  <ZoomOutIcon />
                </Button>
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  aria-label={l.resetZoom}
                  className={cn(
                    "min-w-14 rounded-md px-1 py-0.5 text-xs text-muted-foreground tabular-nums",
                    "hover:bg-accent-hover focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
                  )}
                >
                  {Math.round(zoom * 100)}%
                </button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={l.zoomIn}
                  disabled={zoom >= ZOOM_MAX}
                  onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
                >
                  <ZoomInIcon />
                </Button>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex max-h-[76vh] min-h-[60vh] min-w-0">
          {/* แถบรูปย่อ — โผล่เฉพาะ pdf ที่มีมากกว่าหนึ่งหน้า */}
          {showRail ? (
            <aside
              aria-label={l.pages}
              className="w-32 shrink-0 space-y-2 overflow-y-auto border-r border-border bg-muted/40 p-2"
            >
              {Array.from({ length: Math.min(pageCount, THUMBNAIL_LIMIT) }).map(
                (_, i) => (
                  <button
                    key={i}
                    type="button"
                    aria-label={`${l.page} ${i + 1}`}
                    aria-current={page === i + 1}
                    onClick={() => goToPage(i + 1)}
                    className={cn(
                      "block w-full space-y-1 rounded-lg p-1 text-center transition-colors",
                      "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
                      page === i + 1 ? "bg-brand" : "hover:bg-accent-hover"
                    )}
                  >
                    {/* rounded-sm/md ผูกกับ --radius ของ DS — ห้ามใช้ rounded-xs
                        เพราะตัวนั้นเป็นค่าคงที่ของ Tailwind ไม่เปลี่ยนตามสไตล์แบรนด์ */}
                    <canvas
                      ref={(node) => {
                        thumbRefs.current[i] = node
                      }}
                      className={cn(
                        "mx-auto block max-w-full rounded-sm border bg-background",
                        page === i + 1 ? "border-primary" : "border-border"
                      )}
                    />
                    <span
                      className={cn(
                        "block text-xs tabular-nums",
                        page === i + 1
                          ? "font-medium text-primary"
                          : "text-muted-foreground"
                      )}
                    >
                      {i + 1}
                    </span>
                  </button>
                )
              )}
            </aside>
          ) : null}

          {/* relative แยกจากกล่องเลื่อน (attachScroller) เอง — ปุ่มเลื่อนไฟล์ต้อง
              ลอยนิ่งกับที่ตอนเลื่อนดูรูปซูม/หน้า pdf ไม่ใช่เลื่อนตามเนื้อหาไปด้วย */}
          <div className="relative min-w-0 flex-1">
            <div
              ref={attachScroller}
              className="flex size-full justify-center overflow-auto bg-muted/40 p-4"
            >
              {kind === "image" ? (
                /* ซูมด้วยความกว้างจริง ไม่ใช่ transform: scale — พื้นที่เลื่อนจะได้โตตาม
                   และ canvas ที่ทับอยู่รู้ขนาดใหม่เอง (รอยขีดเก็บเป็นสัดส่วนจึงไม่เพี้ยน) */
                <div
                  className="relative h-fit w-full shrink-0"
                  style={{ width: `${zoom * 100}%`, maxWidth: `${48 * zoom}rem` }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imgRef}
                    src={file.src}
                    alt={file.name}
                    className="block w-full rounded-md border border-border bg-background"
                  />
                  <MarkupLayer
                    strokes={strokesOf(1)}
                    onChange={setStrokesOf(1)}
                    enabled={markup}
                    tool={tool}
                    getColor={getPenColor}
                    penWidth={width}
                  />
                </div>
              ) : isPdf ? (
                <div className="flex h-fit w-fit flex-col items-center gap-4">
                  {pdfState === "loading" ? (
                    <div className="flex h-[50vh] items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Spinner />
                      {l.loading}
                    </div>
                  ) : null}
                  {Array.from({ length: pageCount }).map((_, i) => (
                    <PdfPageView
                      key={i + 1}
                      doc={doc!}
                      pageNumber={i + 1}
                      zoom={zoom}
                      active={activePages.includes(i + 1)}
                      markup={markup}
                      tool={tool}
                      getColor={getPenColor}
                      penWidth={width}
                      strokes={strokesOf(i + 1)}
                      onStrokes={setStrokesOf(i + 1)}
                      register={registerPage(i + 1)}
                      registerCanvas={registerCanvas(i + 1)}
                    />
                  ))}
                </div>
              ) : previewable ? (
                /* pdf ที่ pdf.js เปิดไม่ได้ กับไฟล์ข้อความ — ฝากตัวอ่านของเบราว์เซอร์
                   ครอบด้วยกรอบของ DS ให้กลืนกับที่เหลือเท่าที่ทำได้ */
                <iframe
                  src={file.src}
                  title={file.name}
                  className="h-[72vh] w-full rounded-md border border-border bg-background"
                />
              ) : (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
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

            {/* ปุ่มเลื่อนไฟล์ — คนละเรื่องกับปุ่มเลื่อนหน้า pdf ในแถบเครื่องมือด้านบน
                อันนั้นเลื่อนหน้าในไฟล์เดียวกัน อันนี้เลื่อนข้ามไฟล์ทั้งใบ */}
            {canNavigate ? (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label={l.previousFile}
                  disabled={!hasPrevious}
                  onClick={onPrevious}
                  className="absolute top-1/2 left-3 -translate-y-1/2 rounded-full shadow-md"
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  aria-label={l.nextFile}
                  disabled={!hasNext}
                  onClick={onNext}
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-full shadow-md"
                >
                  <ChevronRightIcon />
                </Button>
              </>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { FilePreview, type PreviewFile }
