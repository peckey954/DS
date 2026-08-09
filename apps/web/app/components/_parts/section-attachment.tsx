"use client";

import * as React from "react";
import {
  DownloadIcon,
  EyeIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
  RotateCwIcon,
  Trash2Icon,
  UploadIcon,
  XIcon,
} from "lucide-react";

import {
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
} from "@peckey954/ui/components/ui/attachment";
import { Button, buttonVariants } from "@peckey954/ui/components/ui/button";
import {
  FileUpload,
  FileUploadHint,
  FileUploadIcon,
  FileUploadLabel,
  type FileRejection,
} from "@peckey954/ui/components/ui/file-upload";
import {
  FilePreview,
  type PreviewFile,
} from "@peckey954/ui/components/ui/file-preview";
import {
  MediaViewer,
  type MediaItem,
} from "@peckey954/ui/components/ui/media-viewer";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@peckey954/ui/components/ui/sheet";
import { cn } from "@peckey954/ui/lib/utils";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    listHint: "แถวไฟล์ · 5 สถานะ",
    gridHint: "กริดรูป · กดเพื่อดูเต็มจอ",
    uploadHint: "ลากมาวาง หรือกดเพื่อเลือก",
    sizeHint: "3 ขนาด · แนวตั้ง",
    videoHint: "วิดีโอ · ปุ่มเล่นอยู่กลางรูป",
    sheetFileHint: "แผงแนบไฟล์ · มีความคืบหน้า",
    sheetImageHint: "แผงแนบรูป · กริดรูปย่อ",
    previewHint: "ดูตัวอย่างไฟล์ · ขีดมาร์ก · พิมพ์ · ดาวน์โหลด",
    preview: "ดูตัวอย่าง",
    print: "พิมพ์",
    markup: "ขีดมาร์ก",
    penColor: "สีปากกา",
    penSize: "ขนาดหัวปากกา",
    undo: "ย้อนกลับ",
    clearAll: "ล้างทั้งหมด",
    saveMarkup: "บันทึกสำเนา",
    noPreview: "ดูตัวอย่างไฟล์ชนิดนี้ไม่ได้",
    noPreviewHint: "ดาวน์โหลดไปเปิดด้วยโปรแกรมในเครื่อง",

    dropLabel: "ลากไฟล์มาวาง หรือกดเพื่อเลือก",
    dropHint: "รูปภาพ · PDF · Excel ไม่เกิน 5 MB ต่อไฟล์",
    dropDisabled: "ปิดรับไฟล์ชั่วคราว",
    picked: "เลือกแล้ว",
    files: "ไฟล์",
    tooLarge: "ไฟล์ใหญ่เกิน 5 MB",
    wrongType: "ชนิดไฟล์ไม่รองรับ",
    clear: "ล้างรายการ",

    remove: "เอาออก",
    download: "ดาวน์โหลด",
    retry: "ลองใหม่",
    viewFull: "ดูเต็มจอ",
    openNewTab: "เปิดในแท็บใหม่",

    stIdle: "รอส่ง",
    stUploading: "กำลังอัปโหลด 62%",
    stProcessing: "กำลังแปลงไฟล์",
    stError: "อัปโหลดไม่สำเร็จ — เครือข่ายขาดหาย",
    stDone: "PDF · 2.4 MB",

    fileReport: "ใบตรวจรับ-PO260116.pdf",
    fileSheet: "สรุปน้ำหนัก.xlsx",
    fileSlip: "ใบชั่งเที่ยวที่-1.jpg",
    fileClip: "กล้องหน้าโรงงาน.mp4",

    photo: "รูปหน้างาน",
    weighSlip: "ใบชั่ง",
    truck: "รถเข้าโรงงาน",
    bags: "กองกระสอบ",
    clip: "คลิปตอนลงของ",

    /* แผงแนบไฟล์ */
    openFileSheet: "แนบไฟล์ข้อมูล",
    fileSheetTitle: "แนบไฟล์ข้อมูล",
    fileSheetDesc: "ไฟล์ที่แนบจะถูกอ่านเข้าระบบตอนกดบันทึก",
    dropLabelSheet: "ลากไฟล์มาวาง หรือกดเพื่อเลือก",
    dropHintSheet: "Excel (xlsx, xls) และ CSV ไม่เกิน 50 MB",
    uploadBtn: "เลือกไฟล์",

    openImageSheet: "แนบรูปหน้างาน",
    imageSheetTitle: "แนบรูปหน้างาน",
    imageSheetDesc: "แนบได้ทั้งรูปและคลิป กดที่รูปเพื่อดูเต็มจอ",
    dropHintImageSheet: "JPG · PNG · MP4 ไม่เกิน 20 MB ต่อไฟล์",

    uploading: "กำลังอัปโหลด",
    done: "อัปโหลดแล้ว",
    empty: "ยังไม่มีไฟล์แนบ",
    save: "บันทึก",

    prev: "รูปก่อนหน้า",
    next: "รูปถัดไป",
    zoomIn: "ขยาย",
    zoomOut: "ย่อ",
    resetZoom: "ขนาดเดิม",
    close: "ปิด",
  },
  en: {
    listHint: "File rows · 5 states",
    gridHint: "Image grid · click to open full screen",
    uploadHint: "Drag and drop, or click to browse",
    sizeHint: "3 sizes · vertical",
    videoHint: "Video · play button centered on the frame",
    sheetFileHint: "File sheet · with progress",
    sheetImageHint: "Photo sheet · thumbnail grid",
    previewHint: "File preview · markup · print · download",
    preview: "Preview",
    print: "Print",
    markup: "Markup",
    penColor: "Pen colour",
    penSize: "Pen size",
    undo: "Undo",
    clearAll: "Clear all",
    saveMarkup: "Save a copy",
    noPreview: "No preview for this file type",
    noPreviewHint: "Download it to open with an app on your device",

    dropLabel: "Drag files here, or click to browse",
    dropHint: "Images · PDF · Excel, up to 5 MB each",
    dropDisabled: "Uploads paused",
    picked: "Selected",
    files: "files",
    tooLarge: "Larger than 5 MB",
    wrongType: "Unsupported file type",
    clear: "Clear list",

    remove: "Remove",
    download: "Download",
    retry: "Retry",
    viewFull: "View full screen",
    openNewTab: "Open in a new tab",

    stIdle: "Queued",
    stUploading: "Uploading 62%",
    stProcessing: "Converting",
    stError: "Upload failed — connection lost",
    stDone: "PDF · 2.4 MB",

    fileReport: "receiving-PO260116.pdf",
    fileSheet: "weight-summary.xlsx",
    fileSlip: "weigh-ticket-1.jpg",
    fileClip: "factory-gate-cam.mp4",

    photo: "Site photo",
    weighSlip: "Weigh ticket",
    truck: "Truck at the gate",
    bags: "Stacked bags",
    clip: "Unloading clip",

    openFileSheet: "Attach data files",
    fileSheetTitle: "Attach data files",
    fileSheetDesc: "Attached files are imported when you save",
    dropLabelSheet: "Upload or drag and drop",
    dropHintSheet: "Excel (xlsx, xls) and CSV (csv), up to 50 MB",
    uploadBtn: "Upload file",

    openImageSheet: "Attach site photos",
    imageSheetTitle: "Attach site photos",
    imageSheetDesc: "Photos and clips both work — click one to view it full screen",
    dropHintImageSheet: "JPG · PNG · MP4, up to 20 MB each",

    uploading: "Uploading",
    done: "Uploaded",
    empty: "Nothing attached yet",
    save: "Save changes",

    prev: "Previous image",
    next: "Next image",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetZoom: "Reset zoom",
    close: "Close",
  },
});

/* ภาพแทนไฟล์จริงในหน้าตัวอย่าง — พื้นเรียบ + ไอคอนรูปตรงกลาง ไม่ใช่ภาพถ่ายปลอม ๆ
   ที่ทำให้เข้าใจผิดว่า component มีรูปมาให้ ใช้แค่ตอนเปิด MediaViewer เท่านั้น
   (กล่องรูปในการ์ดใช้ placeholder ของ AttachmentMedia เองซึ่งเป็นสีจาก token)
   วาดเป็น SVG ฝังเป็น data URI จะได้ไม่ต้องมีไฟล์จริงและไม่ยิงเน็ตออกไปข้างนอก
   สีในนี้คือ "เนื้อของรูป" ไม่ใช่สีของ UI จึงเขียนเป็นค่าตรงได้ */
const PLACEHOLDER_SRC = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <rect width="800" height="600" fill="#e4e4e7"/>
    <g fill="none" stroke="#a1a1aa" stroke-width="10" stroke-linecap="round" stroke-linejoin="round">
      <rect x="310" y="230" width="180" height="140" rx="16"/>
      <circle cx="352" cy="272" r="13"/>
      <path d="M318 348 L372 296 L420 336 L446 314 L482 348"/>
    </g>
  </svg>`
)}`;

/* ไฟล์ตัวอย่างของ FilePreview ต้องเป็นไฟล์จริง ไม่งั้นกดพิมพ์แล้วไม่มีอะไรออกมา
   จึงประกอบ PDF ขึ้นตอนรันแล้วทำเป็น blob URL — ชี้ iframe ไปที่ data: URL
   จะกลายเป็นคนละ origin แล้วสั่งพิมพ์ผ่าน contentWindow ไม่ได้
   ข้อความในไฟล์เป็นอังกฤษล้วนเพราะฟอนต์มาตรฐานของ PDF ไม่มีสระไทย */
function buildSamplePdf(lines: string[]) {
  const content = [
    "BT /F1 16 Tf 60 780 Td 24 TL",
    ...lines.map((line) => `(${line.replace(/([()\\])/g, "\\$1")}) Tj T*`),
    "ET",
  ].join("\n");

  const objects = [
    "<</Type/Catalog/Pages 2 0 R>>",
    "<</Type/Pages/Kids[3 0 R]/Count 1>>",
    "<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>",
    `<</Length ${content.length}>>\nstream\n${content}\nendstream`,
    "<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>",
  ];

  /* xref ต้องบอกตำแหน่งไบต์ของทุก object — คิดจากความยาวที่สะสมมาระหว่างต่อสตริง
     (ตัวอักษรทั้งไฟล์เป็น ASCII ความยาวสตริงจึงเท่ากับจำนวนไบต์พอดี) */
  let pdf = "%PDF-1.4\n";
  const offsets: number[] = [];
  objects.forEach((body, i) => {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${body}\nendobj\n`;
  });

  const startxref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  pdf += `trailer\n<</Size ${objects.length + 1}/Root 1 0 R>>\nstartxref\n${startxref}\n%%EOF`;
  return pdf;
}

/* รูปตัวอย่างของ FilePreview ต้องเป็น PNG ไม่ใช่ SVG data URI เหมือนที่อื่น
   เพราะโหมดขีดมาร์กต้องดึงภาพออกจาก canvas ตอนบันทึกสำเนา ซึ่งบางเบราว์เซอร์
   ถือว่า canvas ที่วาด SVG ลงไปแล้ว "ปนเปื้อน" จนดึงออกไม่ได้ */
function buildPlaceholderPng(): Promise<string> {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#e4e4e7";
  ctx.fillRect(0, 0, 800, 600);
  ctx.strokeStyle = "#a1a1aa";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (typeof ctx.roundRect === "function") ctx.roundRect(310, 230, 180, 140, 16);
  else ctx.rect(310, 230, 180, 140);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(352, 272, 13, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(318, 348);
  ctx.lineTo(372, 296);
  ctx.lineTo(420, 336);
  ctx.lineTo(446, 314);
  ctx.lineTo(482, 348);
  ctx.stroke();
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(URL.createObjectURL(blob!)), "image/png");
  });
}

/* ---------------------------------------------------------------------- */
/* รายการอัปโหลดจำลอง — ของจริงต้องเอา progress มาจาก XHR/fetch ของฝั่งแอป   */
/* ---------------------------------------------------------------------- */

type Upload = {
  id: string;
  name: string;
  meta: string;
  /** 0–100 · ถึง 100 เมื่อไหร่ถือว่าเสร็จ */
  progress: number;
  kind: "file" | "image" | "video";
  src?: string;
  /** object URL ที่ต้องคืนหน่วยความจำตอนลบทิ้ง */
  revoke?: boolean;
};

function formatSize(bytes: number) {
  return bytes >= 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function useUploads(seed: Upload[]) {
  const [items, setItems] = React.useState<Upload[]>(seed);
  const nextId = React.useRef(0);
  const pending = items.some((it) => it.progress < 100);

  /* เดินความคืบหน้าให้ดูเหมือนกำลังอัปโหลดจริง หยุดเองเมื่อทุกไฟล์ถึง 100
     ผูก effect ไว้กับ pending ไม่ใช่ items ไม่งั้นตั้ง interval ใหม่ทุก tick */
  React.useEffect(() => {
    if (!pending) return;
    const timer = window.setInterval(() => {
      setItems((prev) =>
        prev.map((it) =>
          it.progress >= 100
            ? it
            : { ...it, progress: Math.min(100, it.progress + 7) }
        )
      );
    }, 260);
    return () => window.clearInterval(timer);
  }, [pending]);

  const add = React.useCallback((files: File[]) => {
    setItems((prev) => [
      ...prev,
      ...files.map((file) => {
        const image = file.type.startsWith("image/");
        const video = file.type.startsWith("video/");
        return {
          id: `${file.name}-${(nextId.current += 1)}`,
          name: file.name,
          meta: formatSize(file.size),
          progress: 0,
          kind: image ? "image" : video ? "video" : "file",
          /* พรีวิวไฟล์ที่เพิ่งเลือกด้วย object URL — ยังไม่ได้อัปขึ้นเซิร์ฟเวอร์
             ทำทุกชนิดไม่ใช่แค่รูป จะได้กดดูตัวอย่าง/พิมพ์ PDF ได้ตั้งแต่ยังไม่ส่ง */
          src: URL.createObjectURL(file),
          revoke: true,
        } satisfies Upload;
      }),
    ]);
  }, []);

  const remove = React.useCallback((id: string) => {
    setItems((prev) => {
      const gone = prev.find((it) => it.id === id);
      if (gone?.revoke && gone.src) URL.revokeObjectURL(gone.src);
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  /* คืน object URL ทั้งหมดตอนออกจากหน้า ไม่งั้นรูปค้างในหน่วยความจำ */
  const latest = React.useRef(items);
  latest.current = items;
  React.useEffect(
    () => () => {
      for (const it of latest.current) {
        if (it.revoke && it.src) URL.revokeObjectURL(it.src);
      }
    },
    []
  );

  return { items, add, remove };
}

export function SectionAttachment() {
  const t = useT();
  const c = useCopy(COPY);

  const [picked, setPicked] = React.useState<File[]>([]);
  const [rejected, setRejected] = React.useState<FileRejection[]>([]);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);
  const [clipOpen, setClipOpen] = React.useState(false);
  const [sheetViewer, setSheetViewer] = React.useState<number | null>(null);
  const [preview, setPreview] = React.useState<PreviewFile | null>(null);

  /* ไฟล์ตัวอย่างสร้างใน effect ไม่ใช่ระหว่างเรนเดอร์ เพราะ URL.createObjectURL
     ไม่มีบน server แล้วหน้านี้ถูก prerender ตอน build */
  const [sampleFiles, setSampleFiles] = React.useState<{
    pdf: string;
    xlsx: string;
    png?: string;
  } | null>(null);

  React.useEffect(() => {
    const pdf = URL.createObjectURL(
      new Blob(
        [
          buildSamplePdf([
            "Receiving note PO260116",
            "",
            "Supplier   Siam Agri Co., Ltd.",
            "Lot        PD260116/01-04",
            "Net weight 80.00 tons",
            "Checked by Somchai P.",
          ]),
        ],
        { type: "application/pdf" }
      )
    );
    const xlsx = URL.createObjectURL(
      new Blob(["lot,weight\nPD260116/01,20.00\nPD260116/02,20.00\n"], {
        type: "application/vnd.ms-excel",
      })
    );
    setSampleFiles({ pdf, xlsx });

    /* PNG ทำเสร็จช้ากว่าเพื่อน (toBlob เป็น async) ค่อยเติมเข้าไปทีหลัง */
    let png: string | undefined;
    let cancelled = false;
    void buildPlaceholderPng().then((url) => {
      if (cancelled) return URL.revokeObjectURL(url);
      png = url;
      setSampleFiles((prev) => (prev ? { ...prev, png: url } : prev));
    });

    return () => {
      cancelled = true;
      URL.revokeObjectURL(pdf);
      URL.revokeObjectURL(xlsx);
      if (png) URL.revokeObjectURL(png);
    };
  }, []);

  const previewLabels = {
    print: c.print,
    download: c.download,
    close: c.close,
    openInNewTab: c.openNewTab,
    unsupported: c.noPreview,
    unsupportedHint: c.noPreviewHint,
    markup: c.markup,
    penColor: c.penColor,
    penSize: c.penSize,
    undo: c.undo,
    clear: c.clearAll,
    saveMarkup: c.saveMarkup,
  };

  const gallery: MediaItem[] = React.useMemo(
    () => [
      { type: "image", src: PLACEHOLDER_SRC, title: c.weighSlip },
      { type: "image", src: PLACEHOLDER_SRC, title: c.truck },
      { type: "image", src: PLACEHOLDER_SRC, title: c.bags },
      { type: "image", src: PLACEHOLDER_SRC, title: c.photo },
    ],
    [c]
  );

  const viewerLabels = {
    previous: c.prev,
    next: c.next,
    zoomIn: c.zoomIn,
    zoomOut: c.zoomOut,
    reset: c.resetZoom,
    download: c.download,
    close: c.close,
  };

  const clip: MediaItem[] = [
    {
      type: "video",
      /* วิดีโอตัวอย่างเป็น data URI เปล่า ๆ ตัวเล่นจะขึ้นแต่กดเล่นไม่ได้
         พอสำหรับดูหน้าตาของ control โดยไม่ต้องแบกไฟล์วิดีโอเข้ามาใน repo */
      src: "data:video/mp4;base64,",
      poster: PLACEHOLDER_SRC,
      title: c.clip,
    },
  ];

  /* แผงแนบไฟล์ / แนบรูป — เริ่มด้วยรายการที่ "กำลังอัปโหลด" ให้เห็นหน้าตาทันที */
  const fileSheet = useUploads([
    { id: "seed-xlsx", name: "Sample.xlsx", meta: "XLSX · 1.8 MB", progress: 38, kind: "file" },
  ]);
  /* ไม่ใส่ src ให้รายการตั้งต้น — กล่องรูปจะขึ้น placeholder ของตัวเองให้
     เหมือนตอนที่เซิร์ฟเวอร์ยังไม่คืน URL ของรูปกลับมา */
  const imageSheet = useUploads([
    { id: "seed-1", name: "site-01.jpg", meta: "JPG · 820 KB", progress: 45, kind: "image" },
    { id: "seed-2", name: "site-02.jpg", meta: "JPG · 1.1 MB", progress: 25, kind: "image" },
    { id: "seed-3", name: "gate-cam.mp4", meta: "MP4 · 6.4 MB", progress: 12, kind: "video" },
  ]);

  /* รูปที่อัปเสร็จแล้วเท่านั้นถึงเปิดดูเต็มจอได้ index จึงต้องนับจากลิสต์ที่กรองแล้ว */
  const sheetMedia: MediaItem[] = imageSheet.items
    .filter((it) => it.progress >= 100)
    .map((it) => ({
      type: it.kind === "video" ? "video" : "image",
      src: it.kind === "video" ? "data:video/mp4;base64," : (it.src ?? PLACEHOLDER_SRC),
      poster: it.kind === "video" ? (it.src ?? PLACEHOLDER_SRC) : undefined,
      title: it.name,
    }));

  return (
    <Section
      id="attachment"
      title={t("section.attachment")}
      hint="attachment · file-upload · media-viewer"
    >
      {/* ---------- ลากไฟล์มาวาง ---------- */}
      <Demo name="file-upload" hint={c.uploadHint} wide bodyClassName="block">
        <div className="grid gap-4 md:grid-cols-2">
          <FileUpload
            accept="image/*,.pdf,.xlsx"
            multiple
            maxSize={5 * 1024 * 1024}
            onFilesAccepted={(f) => {
              setPicked((prev) => [...prev, ...f]);
              setRejected([]);
            }}
            onFilesRejected={setRejected}
          >
            <FileUploadIcon>
              <UploadIcon />
            </FileUploadIcon>
            <FileUploadLabel>{c.dropLabel}</FileUploadLabel>
            <FileUploadHint>{c.dropHint}</FileUploadHint>
          </FileUpload>

          <FileUpload disabled>
            <FileUploadIcon>
              <UploadIcon />
            </FileUploadIcon>
            <FileUploadLabel>{c.dropDisabled}</FileUploadLabel>
          </FileUpload>
        </div>

        {picked.length > 0 || rejected.length > 0 ? (
          <div className="mt-4 space-y-2">
            {picked.length > 0 ? (
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                  {c.picked} {picked.length} {c.files}
                </p>
                <Button variant="ghost" size="sm" onClick={() => setPicked([])}>
                  {c.clear}
                </Button>
              </div>
            ) : null}

            <AttachmentGroup>
              {picked.map((file, i) => (
                <Attachment key={`${file.name}-${i}`} size="sm">
                  <AttachmentMedia>
                    <FileTextIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                    <AttachmentDescription>
                      {formatSize(file.size)}
                    </AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction
                      aria-label={c.remove}
                      onClick={() =>
                        setPicked((prev) => prev.filter((_, j) => j !== i))
                      }
                    >
                      <XIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              ))}

              {rejected.map(({ file, reason }, i) => (
                <Attachment key={`rej-${file.name}-${i}`} size="sm" state="error">
                  <AttachmentMedia>
                    <FileTextIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                    <AttachmentDescription>
                      {reason === "too-large" ? c.tooLarge : c.wrongType}
                    </AttachmentDescription>
                  </AttachmentContent>
                </Attachment>
              ))}
            </AttachmentGroup>
          </div>
        ) : null}
      </Demo>

      {/* ---------- แถวไฟล์ 5 สถานะ ---------- */}
      <Demo name="attachment" hint={c.listHint} wide bodyClassName="block">
        <AttachmentGroup>
          <Attachment state="idle">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{c.fileReport}</AttachmentTitle>
              <AttachmentDescription>{c.stIdle}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={c.remove}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>

          <Attachment state="uploading">
            <AttachmentMedia>
              <FileSpreadsheetIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{c.fileSheet}</AttachmentTitle>
              <AttachmentDescription>{c.stUploading}</AttachmentDescription>
              <AttachmentProgress value={62} />
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={c.remove}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>

          <Attachment state="processing">
            <AttachmentMedia variant="image" />
            <AttachmentContent>
              <AttachmentTitle>{c.fileSlip}</AttachmentTitle>
              <AttachmentDescription>{c.stProcessing}</AttachmentDescription>
            </AttachmentContent>
          </Attachment>

          <Attachment state="error">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{c.fileReport}</AttachmentTitle>
              <AttachmentDescription>{c.stError}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={c.retry}>
                <RotateCwIcon />
              </AttachmentAction>
              <AttachmentAction aria-label={c.remove}>
                <XIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>

          <Attachment state="done">
            <AttachmentMedia>
              <FileTextIcon />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{c.fileReport}</AttachmentTitle>
              <AttachmentDescription>{c.stDone}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={c.download}>
                <DownloadIcon />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        </AttachmentGroup>
      </Demo>

      {/* ---------- กริดรูป — การ์ดแนวตั้ง รูปเต็มความกว้าง ---------- */}
      <Demo name="attachment" hint={c.gridHint} wide bodyClassName="block">
        <AttachmentGroup layout="grid" className="sm:grid-cols-4">
          {gallery.map((image, i) => (
            <Attachment key={image.title} orientation="vertical">
              {/* ไม่มีลูกข้างใน = ขึ้นพื้นเรียบ + ไอคอนรูปตรงกลางให้เอง
                  ของจริงใส่ <img src={...} alt={...} /> ลงไปตรงนี้ */}
              <AttachmentMedia variant="image" />
              <AttachmentContent>
                <AttachmentTitle>{image.title}</AttachmentTitle>
                <AttachmentDescription>JPG · 820 KB</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions className="absolute top-2 right-2">
                <AttachmentAction
                  aria-label={`${c.remove}: ${image.title}`}
                  variant="secondary"
                  className="rounded-full shadow-sm"
                >
                  <XIcon />
                </AttachmentAction>
              </AttachmentActions>
              <AttachmentTrigger
                aria-label={`${c.viewFull}: ${image.title}`}
                onClick={() => {
                  setViewerIndex(i);
                  setViewerOpen(true);
                }}
              />
            </Attachment>
          ))}
        </AttachmentGroup>

        <MediaViewer
          items={gallery}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          labels={viewerLabels}
        />
      </Demo>

      {/* ---------- วิดีโอ — ปุ่มเล่นอยู่กลางรูปให้เอง ---------- */}
      <Demo name="attachment" hint={c.videoHint} bodyClassName="block">
        <div className="space-y-3">
          <Attachment>
            <AttachmentMedia variant="video" />
            <AttachmentContent>
              <AttachmentTitle>{c.fileClip}</AttachmentTitle>
              <AttachmentDescription>MP4 · 18.6 MB</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label={c.download}>
                <DownloadIcon />
              </AttachmentAction>
            </AttachmentActions>
            <AttachmentTrigger
              aria-label={`${c.viewFull}: ${c.fileClip}`}
              onClick={() => setClipOpen(true)}
            />
          </Attachment>

          <Attachment orientation="vertical" className="max-w-64">
            {/* ของจริงใส่ <img src={poster} /> เป็นภาพนิ่งของคลิปลงไปได้ */}
            <AttachmentMedia variant="video" aspect="video" />
            <AttachmentContent>
              <AttachmentTitle>{c.clip}</AttachmentTitle>
              <AttachmentDescription>0:42 · MP4</AttachmentDescription>
            </AttachmentContent>
            <AttachmentTrigger
              aria-label={`${c.viewFull}: ${c.clip}`}
              onClick={() => setClipOpen(true)}
            />
          </Attachment>
        </div>

        <MediaViewer
          items={clip}
          open={clipOpen}
          onOpenChange={setClipOpen}
          labels={viewerLabels}
        />
      </Demo>

      {/* ---------- ขนาด + เปิดไฟล์ในแท็บใหม่ด้วย render ---------- */}
      <Demo name="attachment" hint={c.sizeHint} bodyClassName="block">
        <div className="space-y-2">
          {(["default", "sm", "xs"] as const).map((size) => (
            <Attachment key={size} size={size}>
              <AttachmentMedia>
                <FileTextIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{c.fileReport}</AttachmentTitle>
                <AttachmentDescription>size=&quot;{size}&quot;</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          ))}

          {/* render = เปลี่ยนแท็กของ trigger เป็น <a> เพื่อเปิดไฟล์ในแท็บใหม่ */}
          <Attachment>
            <AttachmentMedia variant="image" />
            <AttachmentContent>
              <AttachmentTitle>{c.truck}</AttachmentTitle>
              <AttachmentDescription>{c.openNewTab}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentTrigger
              render={
                <a
                  href={gallery[1]!.src}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${c.openNewTab}: ${c.truck}`}
                />
              }
            />
          </Attachment>
        </div>
      </Demo>

      {/* ---------- ดูตัวอย่างไฟล์ + สั่งพิมพ์ ---------- */}
      <Demo name="file-preview" hint={c.previewHint} wide bodyClassName="block">
        <AttachmentGroup>
          {[
            { name: c.fileReport, src: sampleFiles?.pdf, meta: "PDF · 1 หน้า", icon: <FileTextIcon /> },
            { name: c.fileSlip, src: sampleFiles?.png, meta: "JPG · 24 KB", icon: <ImageIcon /> },
            { name: c.fileSheet, src: sampleFiles?.xlsx, meta: "XLSX · 1.8 MB", icon: <FileSpreadsheetIcon /> },
          ].map((file) => (
            <Attachment key={file.name}>
              <AttachmentMedia>{file.icon}</AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{file.name}</AttachmentTitle>
                <AttachmentDescription>{file.meta}</AttachmentDescription>
              </AttachmentContent>
              <AttachmentActions>
                <AttachmentAction
                  aria-label={`${c.preview}: ${file.name}`}
                  disabled={!file.src}
                  onClick={() =>
                    file.src &&
                    setPreview({ name: file.name, src: file.src, meta: file.meta })
                  }
                >
                  <EyeIcon />
                </AttachmentAction>
              </AttachmentActions>
              {file.src ? (
                <AttachmentTrigger
                  aria-label={`${c.preview}: ${file.name}`}
                  onClick={() =>
                    setPreview({ name: file.name, src: file.src!, meta: file.meta })
                  }
                />
              ) : null}
            </Attachment>
          ))}
        </AttachmentGroup>
      </Demo>

      {/* ---------- แผงแนบไฟล์ (Sheet) ---------- */}
      <Demo name="attachment" hint={c.sheetFileHint} bodyClassName="block">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <UploadIcon />
              {c.openFileSheet}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>{c.fileSheetTitle}</SheetTitle>
              <SheetDescription>{c.fileSheetDesc}</SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-4">
              <FileUpload
                accept=".xlsx,.xls,.csv"
                multiple
                maxSize={50 * 1024 * 1024}
                onFilesAccepted={fileSheet.add}
              >
                <FileUploadIcon>
                  <UploadIcon />
                </FileUploadIcon>
                <FileUploadLabel>{c.dropLabelSheet}</FileUploadLabel>
                <FileUploadHint>{c.dropHintSheet}</FileUploadHint>
                {/* ปุ่มหลอกตา — กดที่ไหนของกล่องก็เปิดหน้าต่างเลือกไฟล์อยู่แล้ว
                    จึงเป็น span ไม่ใช่ <button> ซ้อนใน role="button" อีกชั้น */}
                <span
                  aria-hidden
                  className={cn(
                    buttonVariants({ variant: "outline-primary", size: "sm" }),
                    "pointer-events-none mt-1"
                  )}
                >
                  {c.uploadBtn}
                </span>
              </FileUpload>

              {fileSheet.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">{c.empty}</p>
              ) : (
                <AttachmentGroup>
                  {fileSheet.items.map((it) => {
                    const busy = it.progress < 100;
                    return (
                      <Attachment key={it.id} state={busy ? "uploading" : "done"}>
                        <AttachmentMedia>
                          <FileSpreadsheetIcon />
                        </AttachmentMedia>
                        <AttachmentContent>
                          <AttachmentTitle>{it.name}</AttachmentTitle>
                          <AttachmentDescription>
                            {busy
                              ? `${c.uploading} ${it.progress}%`
                              : `${it.meta} · ${c.done}`}
                          </AttachmentDescription>
                          <AttachmentProgress value={it.progress} />
                        </AttachmentContent>
                        <AttachmentActions>
                          {busy ? null : it.src ? (
                            <AttachmentAction
                              aria-label={`${c.preview}: ${it.name}`}
                              onClick={() =>
                                setPreview({
                                  name: it.name,
                                  src: it.src!,
                                  meta: it.meta,
                                })
                              }
                            >
                              <EyeIcon />
                            </AttachmentAction>
                          ) : (
                            <AttachmentAction aria-label={c.download}>
                              <DownloadIcon />
                            </AttachmentAction>
                          )}
                          <AttachmentAction
                            aria-label={`${c.remove}: ${it.name}`}
                            onClick={() => fileSheet.remove(it.id)}
                          >
                            <Trash2Icon />
                          </AttachmentAction>
                        </AttachmentActions>
                      </Attachment>
                    );
                  })}
                </AttachmentGroup>
              )}
            </div>

            <SheetFooter className="flex-row justify-end">
              <Button>{c.save}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Demo>

      {/* ---------- แผงแนบรูป (Sheet) ---------- */}
      <Demo name="attachment" hint={c.sheetImageHint} bodyClassName="block">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline">
              <ImageIcon />
              {c.openImageSheet}
            </Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-lg">
            <SheetHeader>
              <SheetTitle>{c.imageSheetTitle}</SheetTitle>
              <SheetDescription>{c.imageSheetDesc}</SheetDescription>
            </SheetHeader>

            <div className="flex-1 space-y-4 overflow-y-auto px-4">
              <FileUpload
                accept="image/*,video/*"
                multiple
                maxSize={20 * 1024 * 1024}
                onFilesAccepted={imageSheet.add}
              >
                <FileUploadIcon>
                  <UploadIcon />
                </FileUploadIcon>
                <FileUploadLabel>{c.dropLabelSheet}</FileUploadLabel>
                <FileUploadHint>{c.dropHintImageSheet}</FileUploadHint>
                <span
                  aria-hidden
                  className={cn(
                    buttonVariants({ variant: "outline-primary", size: "sm" }),
                    "pointer-events-none mt-1"
                  )}
                >
                  {c.uploadBtn}
                </span>
              </FileUpload>

              {imageSheet.items.length === 0 ? (
                <p className="text-sm text-muted-foreground">{c.empty}</p>
              ) : (
                <AttachmentGroup layout="grid">
                  {imageSheet.items.map((it) => {
                    const busy = it.progress < 100;
                    /* index ของ viewer นับจากเฉพาะรายการที่อัปเสร็จแล้ว */
                    const viewIndex = sheetMedia.findIndex(
                      (m) => m.title === it.name
                    );
                    return (
                      <Attachment
                        key={it.id}
                        orientation="vertical"
                        variant="tile"
                        state={busy ? "uploading" : "done"}
                        className="border border-border"
                      >
                        <AttachmentMedia
                          variant={it.kind === "video" ? "video" : "image"}
                        >
                          {/* ยังไม่มี URL ของรูป = ปล่อยว่างไว้ กล่องรูปขึ้น
                              พื้นเรียบ + ไอคอนรูปให้เอง
                              คลิปไม่ใส่ <img> เพราะ src เป็นไฟล์วิดีโอ ใส่แล้วรูปแตก */}
                          {it.src && it.kind === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={it.src} alt={it.name} />
                          ) : null}
                        </AttachmentMedia>

                        {/* แถบความคืบหน้าเกาะขอบล่างของรูป — การ์ด tile ไม่มีระยะใน */}
                        <AttachmentProgress
                          value={it.progress}
                          className="absolute inset-x-0 bottom-0 mt-0 rounded-none"
                        />

                        <AttachmentActions className="absolute top-1.5 right-1.5">
                          <AttachmentAction
                            aria-label={`${c.remove}: ${it.name}`}
                            variant="secondary"
                            className="rounded-full shadow-sm"
                            onClick={() => imageSheet.remove(it.id)}
                          >
                            <XIcon />
                          </AttachmentAction>
                        </AttachmentActions>

                        {busy || viewIndex < 0 ? null : (
                          <AttachmentTrigger
                            aria-label={`${c.viewFull}: ${it.name}`}
                            onClick={() => setSheetViewer(viewIndex)}
                          />
                        )}
                      </Attachment>
                    );
                  })}
                </AttachmentGroup>
              )}
            </div>

            <SheetFooter className="flex-row justify-end">
              <Button>{c.save}</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <MediaViewer
          items={sheetMedia}
          open={sheetViewer !== null}
          onOpenChange={(open) => setSheetViewer(open ? (sheetViewer ?? 0) : null)}
          index={sheetViewer ?? 0}
          onIndexChange={setSheetViewer}
          labels={viewerLabels}
        />
      </Demo>

      {/* หน้าต่างดูตัวอย่างใช้ตัวเดียวร่วมกันทั้งหมวด — เปิดจากแถวไหนก็ได้
          ไม่ต้องมี dialog ซ้อนอยู่ในทุกแถว */}
      <FilePreview
        file={preview}
        open={preview !== null}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
        labels={previewLabels}
      />
    </Section>
  );
}
