import type { Metadata } from "next";

import {
  GalleryFooter,
  GalleryHeader,
  GalleryIntro,
} from "./_parts/gallery-chrome";
import { SectionAttachment } from "./_parts/section-attachment";
import { SectionCharts } from "./_parts/section-charts";
import { SectionFields } from "./_parts/section-fields";
import { SectionData } from "./_parts/section-data";
import { SectionDate } from "./_parts/section-date";
import { SectionFeedback } from "./_parts/section-feedback";
import { SectionForms } from "./_parts/section-forms";
import { SectionLayout } from "./_parts/section-layout";
import { SectionNavigation } from "./_parts/section-navigation";
import { SectionOverlays } from "./_parts/section-overlays";

export const metadata: Metadata = {
  title: "แกลเลอรี component — Design System",
  description: "ตัวอย่างการใช้งาน component ทั้ง 55 ตัวใน @peckey954/ui",
};

export default function ComponentsPage() {
  return (
    <div className="min-h-screen">
      <GalleryHeader />

      <main className="mx-auto max-w-6xl space-y-14 px-6 py-10">
        <GalleryIntro />

        <SectionLayout />
        <SectionForms />
        <SectionFields />
        <SectionAttachment />
        <SectionDate />
        <SectionNavigation />
        <SectionOverlays />
        <SectionFeedback />
        <SectionData />
        <SectionCharts />

        <GalleryFooter />
      </main>
    </div>
  );
}
