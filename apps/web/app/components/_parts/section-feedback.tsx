"use client";

import * as React from "react";
import {
  CircleAlertIcon,
  InboxIcon,
  RocketIcon,
  TerminalIcon,
} from "lucide-react";
import { toast } from "sonner";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@repo/ui/components/ui/alert";
import { Button } from "@repo/ui/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/ui/components/ui/empty";
import { Progress } from "@repo/ui/components/ui/progress";
import { Skeleton } from "@repo/ui/components/ui/skeleton";
import { Spinner } from "@repo/ui/components/ui/spinner";

import { Demo, Section } from "./showcase";

export function SectionFeedback() {
  const [progress, setProgress] = React.useState(35);

  return (
    <Section
      id="feedback"
      title="สถานะ & การแจ้งเตือน"
      hint="alert · sonner (toast) · progress · skeleton · spinner · empty"
    >
      <Demo name="alert" hint="ข้อความแจ้งเตือนแบบอยู่กับที่" wide>
        <div className="w-full space-y-3">
          <Alert>
            <TerminalIcon />
            <AlertTitle>ติดตั้งสำเร็จแล้ว</AlertTitle>
            <AlertDescription>
              เพิ่ม component ใหม่ได้ด้วยคำสั่ง pnpm dlx shadcn@latest add
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <CircleAlertIcon />
            <AlertTitle>บันทึกไม่สำเร็จ</AlertTitle>
            <AlertDescription>
              การเชื่อมต่อขาดหาย กรุณาลองใหม่อีกครั้ง
            </AlertDescription>
          </Alert>
        </div>
      </Demo>

      <Demo name="sonner" hint="แจ้งเตือนแบบ toast">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast("บันทึกร่างเรียบร้อยแล้ว")}
          >
            ปกติ
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("อัปโหลดไฟล์สำเร็จ")}
          >
            สำเร็จ
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.error("ลบไม่สำเร็จ", {
                description: "คุณไม่มีสิทธิ์ลบรายการนี้",
              })
            }
          >
            ผิดพลาด
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast("ยกเลิกคำสั่งซื้อแล้ว", {
                action: { label: "เลิกทำ", onClick: () => toast("เลิกทำแล้ว") },
              })
            }
          >
            มีปุ่มกด
          </Button>
        </div>
      </Demo>

      <Demo name="progress" hint="แถบความคืบหน้า">
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

      <Demo name="skeleton" hint="โครงร่างระหว่างโหลดข้อมูล">
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

      <Demo name="spinner" hint="ตัวหมุนระหว่างรอ">
        <div className="flex w-full flex-wrap items-center gap-4">
          <Spinner />
          <Spinner className="size-6" />
          <Spinner className="size-8 text-muted-foreground" />
          <Button disabled size="sm">
            <Spinner />
            กำลังบันทึก…
          </Button>
        </div>
      </Demo>

      <Demo name="empty" hint="สถานะไม่มีข้อมูล">
        <Empty className="w-full border border-dashed border-border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>ยังไม่มีรายการ</EmptyTitle>
            <EmptyDescription>
              เมื่อมีคำสั่งซื้อเข้ามา รายการจะแสดงที่นี่
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">
              <RocketIcon />
              สร้างรายการแรก
            </Button>
          </EmptyContent>
        </Empty>
      </Demo>
    </Section>
  );
}
