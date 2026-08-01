"use client";

import * as React from "react";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InboxIcon,
  RocketIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@peckey954/ui/components/ui/alert";
import { Button } from "@peckey954/ui/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@peckey954/ui/components/ui/empty";
import { Progress } from "@peckey954/ui/components/ui/progress";
import { Skeleton } from "@peckey954/ui/components/ui/skeleton";
import { Spinner } from "@peckey954/ui/components/ui/spinner";

import { Demo, Section } from "./showcase";
import { defineCopy, useCopy, useT } from "@/lib/i18n";

const COPY = defineCopy({
  th: {
    alertHint: "ข้อความแจ้งเตือนแบบอยู่กับที่",
    installOk: "ติดตั้งสำเร็จแล้ว",
    installOkDesc: "เพิ่ม component ใหม่ได้ด้วยคำสั่ง pnpm dlx shadcn@latest add",
    saveFail: "บันทึกไม่สำเร็จ",
    saveFailDesc: "การเชื่อมต่อขาดหาย กรุณาลองใหม่อีกครั้ง",
    expiring: "แพ็กเกจของคุณจะหมดอายุใน 3 วัน",
    expiringDesc:
      "ต่ออายุตอนนี้เพื่อไม่ให้บริการสะดุด หรืออัปเกรดเป็นแพ็กเกจแบบเสียค่าใช้จ่ายเพื่อใช้งานต่อ",
    newFeature: "มีฟีเจอร์ใหม่มาแล้ว",
    newFeatureDesc:
      "ตอนนี้เลือกความโค้งและความห่างของทั้งระบบได้จากแถบด้านบน",
    toastHint: "แจ้งเตือนแบบ toast",
    toastPlain: "บันทึกร่างเรียบร้อยแล้ว",
    plain: "ปกติ",
    toastSuccess: "อัปโหลดไฟล์สำเร็จ",
    success: "สำเร็จ",
    toastError: "ลบไม่สำเร็จ",
    toastErrorDesc: "คุณไม่มีสิทธิ์ลบรายการนี้",
    error: "ผิดพลาด",
    toastAction: "ยกเลิกคำสั่งซื้อแล้ว",
    undo: "เลิกทำ",
    undone: "เลิกทำแล้ว",
    withAction: "มีปุ่มกด",
    progressHint: "แถบความคืบหน้า",
    skeletonHint: "โครงร่างระหว่างโหลดข้อมูล",
    spinnerHint: "ตัวหมุนระหว่างรอ",
    saving: "กำลังบันทึก…",
    emptyHint: "สถานะไม่มีข้อมูล",
    emptyTitle: "ยังไม่มีรายการ",
    emptyDesc: "เมื่อมีคำสั่งซื้อเข้ามา รายการจะแสดงที่นี่",
    createFirst: "สร้างรายการแรก",
  },
  en: {
    alertHint: "Inline notification message",
    installOk: "Installed successfully",
    installOkDesc: "Add new components with pnpm dlx shadcn@latest add",
    saveFail: "Could not save",
    saveFailDesc: "The connection dropped. Please try again.",
    expiring: "Your subscription will expire in 3 days.",
    expiringDesc:
      "Renew now to avoid service interruption or upgrade to a paid plan to continue using the service.",
    newFeature: "A new feature has arrived",
    newFeatureDesc:
      "You can now pick the corner radius and density for the whole system from the top bar.",
    toastHint: "Toast notifications",
    toastPlain: "Draft saved",
    plain: "Plain",
    toastSuccess: "File uploaded successfully",
    success: "Success",
    toastError: "Delete failed",
    toastErrorDesc: "You do not have permission to delete this item",
    error: "Error",
    toastAction: "Order cancelled",
    undo: "Undo",
    undone: "Restored",
    withAction: "With action",
    progressHint: "Progress bar",
    skeletonHint: "Placeholder while data loads",
    spinnerHint: "Spinner while waiting",
    saving: "Saving…",
    emptyHint: "Empty state",
    emptyTitle: "Nothing here yet",
    emptyDesc: "Orders will appear here once they come in",
    createFirst: "Create the first one",
  },
});

export function SectionFeedback() {
  const t = useT();
  const c = useCopy(COPY);
  const [progress, setProgress] = React.useState(35);

  return (
    <Section
      id="feedback"
      title={t("section.feedback")}
      hint="alert · sonner (toast) · progress · skeleton · spinner · empty"
    >
      {/* พื้นกล่อง demo ต้องไม่ใช่ bg-card เพราะ Alert แบบ default ก็ใช้ bg-card
          พอสีชนกันเป๊ะจะดูเหมือน Alert ไม่มีพื้นหลัง ทั้งที่จริงทึบอยู่แล้ว */}
      <Demo name="alert" hint={c.alertHint} wide bodyClassName="bg-muted/30">
        <div className="w-full space-y-3">
          <Alert>
            <CircleCheckIcon />
            <AlertTitle>{c.installOk}</AlertTitle>
            <AlertDescription>
              {c.installOkDesc}
            </AlertDescription>
          </Alert>
          <Alert variant="warning">
            <TriangleAlertIcon />
            <AlertTitle>{c.expiring}</AlertTitle>
            <AlertDescription>
              {c.expiringDesc}
            </AlertDescription>
          </Alert>
          <Alert variant="brand">
            <SparklesIcon />
            <AlertTitle>{c.newFeature}</AlertTitle>
            <AlertDescription>
              {c.newFeatureDesc}
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>{c.saveFail}</AlertTitle>
            <AlertDescription>
              {c.saveFailDesc}
            </AlertDescription>
          </Alert>
        </div>
      </Demo>

      <Demo name="sonner" hint={c.toastHint}>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast(c.toastPlain)}
          >
            {c.plain}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success(c.toastSuccess)}
          >
            {c.success}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.error(c.toastError, {
                description: c.toastErrorDesc,
              })
            }
          >
            {c.error}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast(c.toastAction, {
                action: { label: c.undo, onClick: () => toast(c.undone) },
              })
            }
          >
            {c.withAction}
          </Button>
        </div>
      </Demo>

      <Demo name="progress" hint={c.progressHint}>
        <div className="w-full space-y-3">
          <Progress value={progress} />
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{progress}%</span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProgress((p) => Math.max(0, p - 15))}
              >
                −15
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setProgress((p) => Math.min(100, p + 15))}
              >
                +15
              </Button>
            </div>
          </div>
        </div>
      </Demo>

      <Demo name="skeleton" hint={c.skeletonHint}>
        <div className="w-full space-y-3">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      </Demo>

      <Demo name="spinner" hint={c.spinnerHint}>
        <div className="flex w-full flex-wrap items-center gap-4">
          <Spinner />
          <Spinner className="size-6" />
          <Spinner className="size-8 text-muted-foreground" />
          <Button disabled size="sm">
            <Spinner />
            {c.saving}
          </Button>
        </div>
      </Demo>

      <Demo name="empty" hint={c.emptyHint}>
        <Empty className="w-full border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>{c.emptyTitle}</EmptyTitle>
            <EmptyDescription>
              {c.emptyDesc}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">
              <RocketIcon />
              {c.createFirst}
            </Button>
          </EmptyContent>
        </Empty>
      </Demo>
    </Section>
  );
}
