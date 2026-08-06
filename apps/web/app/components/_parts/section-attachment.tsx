"use client";

import * as React from "react";
import {
  DownloadIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  ImageIcon,
  PlayIcon,
  RotateCwIcon,
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
import { Button } from "@peckey954/ui/components/ui/button";
import {
  FileUpload,
  FileUploadHint,
  FileUploadIcon,
  FileUploadLabel,
  type FileRejection,
} from "@peckey954/ui/components/ui/file-upload";
import {
  MediaViewer,
  type MediaItem,
} from "@peckey954/ui/components/ui/media-viewer";
import { cn } from "@peckey954/ui/lib/utils";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    listHint: "แถวไฟล์ · 5 สถานะ",
    gridHint: "กริดรูป · กดเพื่อดูเต็มจอ",
    uploadHint: "ลากมาวาง หรือกดเพื่อเลือก",
    sizeHint: "3 ขนาด · แนวตั้ง",
    videoHint: "วิดีโอ · กดเพื่อเล่นเต็มจอ",

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
    videoHint: "Video · click to play full screen",

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

    prev: "Previous image",
    next: "Next image",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetZoom: "Reset zoom",
    close: "Close",
  },
});

/* รูปตัวอย่างวาดเป็น SVG แล้วฝังเป็น data URI — ไม่ต้องมีไฟล์จริงในโปรเจกต์
   และไม่ยิงเน็ตออกไปข้างนอก สีดึงจาก token ที่ส่งเข้ามาเป็นพารามิเตอร์ */
function sampleImage(label: string, from: string, to: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/>
    </linearGradient></defs>
    <rect width="800" height="600" fill="url(#g)"/>
    <text x="400" y="310" text-anchor="middle" font-family="sans-serif"
      font-size="44" fill="#ffffff" opacity="0.9">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function SectionAttachment() {
  const t = useT();
  const c = useCopy(COPY);

  const [picked, setPicked] = React.useState<File[]>([]);
  const [rejected, setRejected] = React.useState<FileRejection[]>([]);
  const [viewerOpen, setViewerOpen] = React.useState(false);
  const [viewerIndex, setViewerIndex] = React.useState(0);
  const [clipOpen, setClipOpen] = React.useState(false);

  const gallery: MediaItem[] = React.useMemo(
    () => [
      { type: "image", src: sampleImage("1", "#2563eb", "#7c3aed"), title: c.weighSlip },
      { type: "image", src: sampleImage("2", "#059669", "#0891b2"), title: c.truck },
      { type: "image", src: sampleImage("3", "#ea580c", "#dc2626"), title: c.bags },
      { type: "image", src: sampleImage("4", "#7c3aed", "#db2777"), title: c.photo },
    ],
    [c]
  );

  const viewerLabels = {
    previous: c.prev,
    next: c.next,
    zoomIn: c.zoomIn,
    zoomOut: c.zoomOut,
    reset: c.resetZoom,
    close: c.close,
  };

  const clip: MediaItem[] = [
    {
      type: "video",
      /* วิดีโอตัวอย่างเป็น data URI เปล่า ๆ ตัวเล่นจะขึ้นแต่กดเล่นไม่ได้
         พอสำหรับดูหน้าตาของ control โดยไม่ต้องแบกไฟล์วิดีโอเข้ามาใน repo */
      src: "data:video/mp4;base64,",
      poster: sampleImage("▶", "#0f172a", "#334155"),
      title: c.clip,
    },
  ];

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
                      {(file.size / 1024).toFixed(0)} KB
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
            <AttachmentMedia variant="image">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={gallery[0]!.src} alt="" className="size-full object-cover" />
            </AttachmentMedia>
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

      {/* ---------- ขนาด + แนวตั้ง ---------- */}
      <Demo name="attachment" hint={c.sizeHint} bodyClassName="block">
        <div className="space-y-2">
          {(["default", "sm", "xs"] as const).map((size) => (
            <Attachment key={size} size={size}>
              <AttachmentMedia>
                <FileTextIcon />
              </AttachmentMedia>
              <AttachmentContent>
                <AttachmentTitle>{c.fileReport}</AttachmentTitle>
                <AttachmentDescription>size="{size}"</AttachmentDescription>
              </AttachmentContent>
            </Attachment>
          ))}

          <Attachment orientation="vertical">
            <AttachmentMedia variant="image" className="size-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gallery[1]!.src}
                alt=""
                className="aspect-video w-full object-cover"
              />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{c.truck}</AttachmentTitle>
              <AttachmentDescription>orientation="vertical"</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        </div>
      </Demo>

      {/* ---------- กริดรูป + ดูเต็มจอ ---------- */}
      <Demo name="media-viewer" hint={c.gridHint} bodyClassName="block">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {gallery.map((it, i) => (
            <button
              key={it.src}
              type="button"
              aria-label={`${c.viewFull}: ${it.title}`}
              onClick={() => {
                setViewerIndex(i);
                setViewerOpen(true);
              }}
              className={cn(
                "group relative overflow-hidden rounded-md border border-border",
                "focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.src}
                alt={it.title ?? ""}
                className="aspect-square w-full object-cover transition-transform duration-200 group-hover:scale-105"
              />
              <span className="absolute inset-0 flex items-center justify-center bg-foreground/0 text-background opacity-0 transition-[background-color,opacity] group-hover:bg-foreground/40 group-hover:opacity-100">
                <ImageIcon className="size-5" />
              </span>
            </button>
          ))}
        </div>

        <MediaViewer
          items={gallery}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          index={viewerIndex}
          onIndexChange={setViewerIndex}
          labels={viewerLabels}
        />
      </Demo>

      {/* ---------- วิดีโอ ---------- */}
      <Demo name="media-viewer" hint={c.videoHint} bodyClassName="block">
        <Attachment className="relative">
          <AttachmentMedia variant="image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={clip[0]!.poster} alt="" className="size-full object-cover" />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{c.fileClip}</AttachmentTitle>
            <AttachmentDescription>MP4 · 18.6 MB</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions>
            {/* ปุ่มต้องอยู่เหนือ AttachmentTrigger ที่คลุมทั้งการ์ด จึงต้องยก z ขึ้น */}
            <AttachmentAction
              aria-label={c.download}
              className="relative z-10"
              onClick={(e) => e.stopPropagation()}
            >
              <DownloadIcon />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger
            aria-label={`${c.viewFull}: ${c.fileClip}`}
            onClick={() => setClipOpen(true)}
          />
          <span className="pointer-events-none absolute top-1/2 left-3 flex size-6 -translate-y-1/2 items-center justify-center rounded-full bg-foreground/70 text-background">
            <PlayIcon className="size-3" />
          </span>
        </Attachment>

        <MediaViewer
          items={clip}
          open={clipOpen}
          onOpenChange={setClipOpen}
          labels={viewerLabels}
        />
      </Demo>
    </Section>
  );
}
