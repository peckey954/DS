"use client";

import * as React from "react";
import {
  DownloadIcon,
  EyeIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  FileUpIcon,
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
  AttachmentFileIcon,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTitle,
  AttachmentTrigger,
} from "@peckey954/ui/components/ui/attachment";
import { Button, buttonVariants } from "@peckey954/ui/components/ui/button";
import { Label } from "@peckey954/ui/components/ui/label";
import { Textarea } from "@peckey954/ui/components/ui/textarea";
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
    gridHint: "กริดรูป · กดเพื่อดูเต็มจอ · มีเคสอัปโหลดพัง",
    uploadHint: "ลากมาวาง หรือกดเพื่อเลือก",
    sizeHint: "3 ขนาด · แนวตั้ง",
    videoHint: "วิดีโอ · ปุ่มเล่นอยู่กลางรูป",
    sheetFileHint: "แผงแนบไฟล์ · มีความคืบหน้า",
    sheetImageHint: "แผงแนบรูป · กริดรูปย่อ",
    previewHint: "ดูตัวอย่างไฟล์ · ขีดมาร์ก · ซูม · พิมพ์ · ดาวน์โหลด",
    tileHint: "ปุ่มอัปโหลดแบบไทล์ · การ์ดไฟล์เรียงต่อกัน · มีเคส error",
    claimTitle: "รูปภาพและเอกสารประกอบการเคลมสินค้า",
    claimHint: "อัปโหลดไฟล์สูงสุด 5 ไฟล์ รองรับไฟล์ PDF, PNG และ JPG",
    uploadTile: "อัปโหลดไฟล์",
    uploadTileHint: "อัปโหลด / ลากไฟล์มาวาง",
    claimDoc: "เอกสารเคลม",
    note: "หมายเหตุ",
    notePlaceholder: "ระบุหมายเหตุ",
    full: "แนบครบ 5 ไฟล์แล้ว",
    preview: "ดูตัวอย่าง",
    print: "พิมพ์",
    markup: "ขีดมาร์ก",
    penColor: "สีปากกา",
    penSize: "ขนาดหัวปากกา",
    undo: "เลิกทำ",
    pen: "ปากกา",
    eraser: "ยางลบ",
    togglePages: "ซ่อน/แสดงแถบหน้า",
    noPreview: "ดูตัวอย่างไฟล์ชนิดนี้ไม่ได้",
    noPreviewHint: "ดาวน์โหลดไปเปิดด้วยโปรแกรมในเครื่อง",

    dropLabel: "ลากไฟล์มาวาง หรือกดเพื่อเลือก",
    dropHint: "รูปภาพ · PDF · Excel ไม่เกิน 5 MB ต่อไฟล์",
    dropDisabled: "ปิดรับไฟล์ชั่วคราว",
    picked: "เลือกแล้ว",
    files: "ไฟล์",
    tooLarge: "ไฟล์ใหญ่เกิน 5 MB",
    /* ข้อความสั้นสำหรับการ์ดไฟล์แบบไทล์ (กว้างแค่ 112px) — ข้อความเต็มด้านบน
       ยาวเกินจะโดน truncate จนตัดคำสำคัญท้ายประโยคหายไป (เช่น "5 MB") */
    claimErrTooLarge: "ไฟล์ใหญ่เกิน",
    claimErrFailed: "อัปโหลดไม่สำเร็จ",
    wrongType: "ชนิดไฟล์ไม่รองรับ",
    clear: "ล้างรายการ",

    remove: "เอาออก",
    download: "ดาวน์โหลด",
    retry: "ลองใหม่",
    viewFull: "ดูเต็มจอ",
    openNewTab: "เปิดในแท็บใหม่",
    back: "ย้อนกลับ",
    prevPage: "หน้าก่อนหน้า",
    nextPage: "หน้าถัดไป",
    prevFile: "ไฟล์ก่อนหน้า",
    nextFile: "ไฟล์ถัดไป",
    pageLabel: "หน้า",
    pagesLabel: "หน้าเอกสาร",
    loadingDoc: "กำลังเปิดเอกสาร…",

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
    gridHint: "Image grid · click to open full screen · includes a failed-upload case",
    uploadHint: "Drag and drop, or click to browse",
    sizeHint: "3 sizes · vertical",
    videoHint: "Video · play button centered on the frame",
    sheetFileHint: "File sheet · with progress",
    sheetImageHint: "Photo sheet · thumbnail grid",
    previewHint: "File preview · markup · print · download",
    tileHint: "Tile upload button · file cards in a row · includes an error case",
    claimTitle: "Photos and documents for the claim",
    claimHint: "Up to 5 files. PDF, PNG and JPG are supported",
    uploadTile: "Upload file",
    uploadTileHint: "Upload / drag files here",
    claimDoc: "Claim document",
    note: "Note",
    notePlaceholder: "Add a note",
    full: "All 5 files attached",
    preview: "Preview",
    print: "Print",
    markup: "Markup",
    penColor: "Pen colour",
    penSize: "Pen size",
    undo: "Undo",
    pen: "Pen",
    eraser: "Eraser",
    togglePages: "Show or hide pages",
    noPreview: "No preview for this file type",
    noPreviewHint: "Download it to open with an app on your device",

    dropLabel: "Drag files here, or click to browse",
    dropHint: "Images · PDF · Excel, up to 5 MB each",
    dropDisabled: "Uploads paused",
    picked: "Selected",
    files: "files",
    tooLarge: "Larger than 5 MB",
    claimErrTooLarge: "File too large",
    claimErrFailed: "Upload failed",
    wrongType: "Unsupported file type",
    clear: "Clear list",

    remove: "Remove",
    download: "Download",
    retry: "Retry",
    viewFull: "View full screen",
    openNewTab: "Open in a new tab",
    back: "Back",
    prevPage: "Previous page",
    nextPage: "Next page",
    prevFile: "Previous file",
    nextFile: "Next file",
    pageLabel: "Page",
    pagesLabel: "Pages",
    loadingDoc: "Opening document…",

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
function buildSamplePdf(pages: string[][]) {
  const objects: string[] = ["", ""]; // 1 = catalog, 2 = pages — เติมทีหลังเพราะต้องรู้ id ลูกก่อน
  const fontId = 3;
  objects.push("<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>");

  const pageIds: number[] = [];
  pages.forEach((lines) => {
    const content = [
      "BT /F1 16 Tf 60 780 Td 24 TL",
      ...lines.map((line) => `(${line.replace(/([()\\])/g, "\\$1")}) Tj T*`),
      "ET",
    ].join("\n");

    const contentId = objects.length + 1;
    objects.push(`<</Length ${content.length}>>\nstream\n${content}\nendstream`);
    const pageId = objects.length + 1;
    objects.push(
      `<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents ${contentId} 0 R` +
        `/Resources<</Font<</F1 ${fontId} 0 R>>>>>>`
    );
    pageIds.push(pageId);
  });

  objects[0] = "<</Type/Catalog/Pages 2 0 R>>";
  objects[1] =
    `<</Type/Pages/Kids[${pageIds.map((id) => `${id} 0 R`).join(" ")}]` +
    `/Count ${pageIds.length}>>`;

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

/** จำนวนไฟล์สูงสุดของแบบฟอร์มเคลม — ครบแล้วซ่อนไทล์อัปโหลดทิ้ง */
const CLAIM_MAX = 5;

type ClaimFile = {
  id: string;
  name: string;
  date: string;
  size: string;
  /** ไม่มี = อัปโหลดสำเร็จ · "network" / "tooLarge" = พังตอนไหน เอาไว้เลือกข้อความ */
  error?: "network" | "tooLarge";
};

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
  /* ไม่ใช่ null เฉพาะตอนเปิดจากลิสต์ 3 ไฟล์ด้านล่างที่มีปุ่มเลื่อนไฟล์ — เปิดจาก
     ที่อื่น (เช่นแผงแนบไฟล์) จะเป็น null เสมอ ไม่โชว์ปุ่มเลื่อน เพราะคนละรายการกัน */
  const [previewListIndex, setPreviewListIndex] = React.useState<number | null>(
    null
  );
  const [claim, setClaim] = React.useState<ClaimFile[]>([
    { id: "c1", name: "claim-1.png", date: "2026-08-05", size: "6.6MB" },
    { id: "c2", name: "claim-2.pdf", date: "2026-08-05", size: "6.6MB" },
    { id: "c3", name: "claim-3.jpg", date: "2026-08-05", size: "6.6MB" },
    /* เคส error ของการ์ดไฟล์แบบไทล์ — กดปุ่มลองใหม่แล้วเคลียร์ error ทิ้งได้จริง */
    { id: "c4", name: "claim-4.jpg", date: "2026-08-05", size: "9.1MB", error: "tooLarge" },
  ]);

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
            [
              "Receiving note PO260116",
              "",
              "Supplier   Siam Agri Co., Ltd.",
              "Lot        PD260116/01-04",
              "Net weight 80.00 tons",
              "Checked by Somchai P.",
            ],
            [
              "Page 2 - Weighing detail",
              "",
              "Trip 1     20.00 tons",
              "Trip 2     20.00 tons",
              "Trip 3     20.00 tons",
              "Trip 4     20.00 tons",
            ],
            [
              "Page 3 - Remarks",
              "",
              "Moisture   13.2 %",
              "Impurity   1.1 %",
              "Approved by Warunee K.",
            ],
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
    openInNewTab: c.openNewTab,
    back: c.back,
    zoomIn: c.zoomIn,
    zoomOut: c.zoomOut,
    resetZoom: c.resetZoom,
    previousPage: c.prevPage,
    nextPage: c.nextPage,
    previousFile: c.prevFile,
    nextFile: c.nextFile,
    page: c.pageLabel,
    pages: c.pagesLabel,
    loading: c.loadingDoc,
    unsupported: c.noPreview,
    unsupportedHint: c.noPreviewHint,
    markup: c.markup,
    pen: c.pen,
    eraser: c.eraser,
    penColor: c.penColor,
    penSize: c.penSize,
    undo: c.undo,
    togglePages: c.togglePages,
  };

  /* 3 ไฟล์ตัวอย่างของหมวด "ดูตัวอย่างไฟล์ + สั่งพิมพ์" — แยกออกมาเป็น memo
     เพราะต้องใช้ทั้งตอนเรนเดอร์ลิสต์และตอนคำนวณปุ่มเลื่อนก่อน/ถัดไป */
  const previewFiles = React.useMemo(
    () => [
      { name: c.fileReport, src: sampleFiles?.pdf, meta: "PDF · 3 หน้า", icon: <FileTextIcon /> },
      { name: c.fileSlip, src: sampleFiles?.png, meta: "JPG · 24 KB", icon: <ImageIcon /> },
      { name: c.fileSheet, src: sampleFiles?.xlsx, meta: "XLSX · 1.8 MB", icon: <FileSpreadsheetIcon /> },
    ],
    [c, sampleFiles]
  );

  /* เปิดไฟล์เดียวจากที่ไหนก็ได้ (เช่นแผงแนบไฟล์) — ไม่มีปุ่มเลื่อน
     เพราะที่นั่นไม่ได้ผูกกับ previewFiles */
  const openPreview = (f: PreviewFile) => {
    setPreview(f);
    setPreviewListIndex(null);
  };

  /* เปิดจากลิสต์ 3 ไฟล์ตัวอย่าง — ผูก index ไว้ด้วย ปุ่มเลื่อนถึงจะรู้ว่าอยู่ไฟล์ไหน */
  const openPreviewFromList = (i: number) => {
    const f = previewFiles[i];
    if (!f?.src) return;
    setPreview({ name: f.name, src: f.src, meta: f.meta });
    setPreviewListIndex(i);
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

      {/* ---------- ปุ่มอัปโหลดแบบไทล์ + การ์ดไฟล์ ---------- */}
      <Demo name="file-upload" hint={c.tileHint} wide bodyClassName="block">
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold">{c.claimTitle}</h3>
          <p className="text-sm text-muted-foreground">{c.claimHint}</p>
        </div>

        {/* items-start = ไทล์อัปโหลดไม่ยืดสูงตามการ์ดไฟล์ที่อาจสูงกว่า */}
        <div className="mt-4 flex flex-wrap items-start gap-3">
          {claim.length < CLAIM_MAX ? (
            <FileUpload
              variant="tile"
              accept=".pdf,.png,.jpg,.jpeg"
              multiple
              onFilesAccepted={(files) =>
                setClaim((prev) =>
                  [
                    ...prev,
                    ...files.map((file) => ({
                      id: `${file.name}-${prev.length}-${file.size}`,
                      name: file.name,
                      date: new Date().toISOString(),
                      size: formatSize(file.size),
                    })),
                  ].slice(0, CLAIM_MAX)
                )
              }
            >
              <FileUploadIcon>
                <FileUpIcon />
              </FileUploadIcon>
              <FileUploadLabel>{c.uploadTileHint}</FileUploadLabel>
              {/* ปุ่มหลอกตา — กดที่ไหนของกล่องก็เปิดหน้าต่างเลือกไฟล์อยู่แล้ว
                  จึงเป็น span ไม่ใช่ <button> ซ้อนใน role="button" อีกชั้น
                  bg-background ให้ตัดกับพื้น --brand ของกล่อง อ่านเป็นปุ่มจริง ๆ */}
              <span
                aria-hidden
                className={cn(
                  buttonVariants({ variant: "outline-primary", size: "xs" }),
                  "pointer-events-none mt-0.5 bg-background"
                )}
              >
                {c.uploadTile}
              </span>
            </FileUpload>
          ) : (
            <p className="self-center text-sm text-muted-foreground">{c.full}</p>
          )}

          {claim.map((file) => (
            <Attachment
              key={file.id}
              orientation="vertical"
              size="sm"
              state={file.error ? "error" : "done"}
              /* พื้นเทาเป็นค่าเริ่มต้นของการ์ดปกติเท่านั้น — ตอน error ปล่อยให้
                 state="error" ทาพื้นแดงจางของมันเอง ไม่งั้นเทาที่ตั้งทับจะกลบสีแดงหมด */
              className={cn(
                "w-28 items-center gap-1 text-center",
                !file.error && "bg-muted/50"
              )}
            >
              {/* variant="plain" = ไอคอนลอย ไม่มีกล่องพื้นเทาครอบอีกชั้น
                  ตอน error สลับทั้งไอคอนและตัวไอคอนเองเป็นปุ่มลองใหม่ที่กดตรงนั้นได้เลย
                  แทนที่จะเป็นไอคอนไฟล์เฉย ๆ + ปุ่มลองใหม่แยกอีกจุดที่มุมการ์ด */}
              <AttachmentMedia variant="plain">
                {file.error ? (
                  <button
                    type="button"
                    aria-label={`${c.retry}: ${file.name}`}
                    onClick={() =>
                      setClaim((prev) =>
                        prev.map((it) =>
                          it.id === file.id ? { ...it, error: undefined } : it
                        )
                      )
                    }
                    className="flex size-9 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-danger"
                  >
                    <RotateCwIcon className="size-6" />
                  </button>
                ) : (
                  <AttachmentFileIcon name={file.name} />
                )}
              </AttachmentMedia>
              <AttachmentContent className="w-full items-center gap-0">
                <AttachmentTitle className="w-full text-xs">
                  {c.claimDoc}
                </AttachmentTitle>
                {/* บรรทัดที่สองมีแค่บรรทัดเดียวเสมอ ไม่ว่าปกติหรือ error —
                    การ์ดในแถวเดียวกันจะได้สูงเท่ากัน (เอาวันที่ออก เหลือแค่ขนาดไฟล์) */}
                <AttachmentDescription className="w-full">
                  {file.error
                    ? file.error === "tooLarge"
                      ? c.claimErrTooLarge
                      : c.claimErrFailed
                    : file.size}
                </AttachmentDescription>
              </AttachmentContent>
              {/* ปุ่มลบคร่อมมุมการ์ด — ลองใหม่ย้ายไปอยู่ที่ไอคอนไฟล์แล้ว
                  มุมนี้เหลือแค่ปุ่มเดียวทั้ง error และปกติ */}
              <AttachmentActions className="absolute -top-2 -right-2">
                <AttachmentAction
                  aria-label={`${c.remove}: ${file.name}`}
                  variant="secondary"
                  className="rounded-full border border-border shadow-sm"
                  onClick={() =>
                    setClaim((prev) => prev.filter((it) => it.id !== file.id))
                  }
                >
                  <XIcon />
                </AttachmentAction>
              </AttachmentActions>
            </Attachment>
          ))}
        </div>

        <div className="mt-4 space-y-2">
          <Label htmlFor="claim-note">{c.note}</Label>
          <Textarea id="claim-note" placeholder={c.notePlaceholder} rows={3} />
        </div>
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
          {gallery.map((image, i) => {
            /* ปน 2 เคส error ไว้ในกริดเดียวกัน — เครือข่ายขาดหายกับไฟล์ใหญ่เกิน
               ตัวไหนไม่ error ใส่ <img> จริงลงไป จะได้เห็นชัดว่าต่างจาก error ยังไง */
            const errorText = i === 2 ? c.stError : i === 3 ? c.tooLarge : null;
            return (
              <Attachment
                key={image.title}
                orientation="vertical"
                state={errorText ? "error" : "done"}
              >
                <AttachmentMedia variant="image">
                  {/* error = ปล่อยว่าง ให้ AttachmentMedia ขึ้นไอคอนรูปกากบาท
                      โทนแดงให้เอง · ของจริงใส่ <img src={...} alt={...} /> ตอนไม่ error */}
                  {errorText ? null : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={image.src} alt={image.title} />
                  )}
                </AttachmentMedia>
                <AttachmentContent>
                  <AttachmentTitle>{image.title}</AttachmentTitle>
                  <AttachmentDescription>
                    {errorText ?? "JPG · 820 KB"}
                  </AttachmentDescription>
                </AttachmentContent>
                <AttachmentActions className="absolute top-2 right-2 gap-1.5">
                  {errorText ? (
                    <AttachmentAction
                      aria-label={`${c.retry}: ${image.title}`}
                      variant="secondary"
                      className="rounded-full shadow-sm"
                    >
                      <RotateCwIcon />
                    </AttachmentAction>
                  ) : null}
                  <AttachmentAction
                    aria-label={`${c.remove}: ${image.title}`}
                    variant="secondary"
                    className="rounded-full shadow-sm"
                  >
                    <XIcon />
                  </AttachmentAction>
                </AttachmentActions>
                {/* รูปที่อัปพังไม่มีอะไรให้ดูเต็มจอ — ไม่ใส่ trigger */}
                {errorText ? null : (
                  <AttachmentTrigger
                    aria-label={`${c.viewFull}: ${image.title}`}
                    onClick={() => {
                      setViewerIndex(i);
                      setViewerOpen(true);
                    }}
                  />
                )}
              </Attachment>
            );
          })}
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

      {/* ---------- ดูตัวอย่างไฟล์ + สั่งพิมพ์ + เลื่อนดูหลายไฟล์ ---------- */}
      <Demo name="file-preview" hint={c.previewHint} wide bodyClassName="block">
        <AttachmentGroup>
          {previewFiles.map((file, i) => (
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
                  onClick={() => openPreviewFromList(i)}
                >
                  <EyeIcon />
                </AttachmentAction>
              </AttachmentActions>
              {file.src ? (
                <AttachmentTrigger
                  aria-label={`${c.preview}: ${file.name}`}
                  onClick={() => openPreviewFromList(i)}
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
                                openPreview({
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
          ไม่ต้องมี dialog ซ้อนอยู่ในทุกแถว ปุ่มเลื่อนไฟล์โผล่เฉพาะตอนเปิดจาก
          ลิสต์ 3 ไฟล์ตัวอย่าง (previewListIndex ไม่เป็น null) */}
      <FilePreview
        file={preview}
        open={preview !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPreview(null);
            setPreviewListIndex(null);
          }
        }}
        onPrevious={
          previewListIndex !== null
            ? () => openPreviewFromList(previewListIndex - 1)
            : undefined
        }
        onNext={
          previewListIndex !== null
            ? () => openPreviewFromList(previewListIndex + 1)
            : undefined
        }
        hasPrevious={previewListIndex !== null && previewListIndex > 0}
        hasNext={
          previewListIndex !== null && previewListIndex < previewFiles.length - 1
        }
        counter={
          previewListIndex !== null
            ? `${previewListIndex + 1} / ${previewFiles.length}`
            : undefined
        }
        labels={previewLabels}
      />
    </Section>
  );
}
