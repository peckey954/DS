"use client";

import { useCallback } from "react";

import { useLang } from "@/components/providers";

/**
 * พจนานุกรมของแอปตัวอย่าง — แปลเฉพาะ "ป้ายกำกับโครงสร้างหน้า"
 * (หัวข้อหมวด · เมนู · ข้อความอธิบาย) ส่วนเนื้อหาตัวอย่างในแต่ละ demo
 * ยังคงเป็นภาษาไทยไว้ตั้งใจ เพื่อให้เห็นการเรนเดอร์ฟอนต์ไทยของแต่ละแบรนด์
 */
const th = {
  "brand.aria": "เลือกแบรนด์",
  "lang.aria": "เลือกภาษา",

  "page.home": "หน้าแรก",
  "page.title": "แกลเลอรี component",
  "page.subtitle": "ครบทั้ง 55 ตัวจาก @repo/ui",
  "page.intro.before": "ทุกตัวอย่างในหน้านี้ใช้ component จาก",
  "page.intro.after":
    "และสีจาก token เท่านั้น — ลองสลับแบรนด์และโหมดสว่าง/มืดที่มุมขวาบน แล้วสังเกตว่าทั้งหน้าเปลี่ยนตามโดยไม่มีการแก้โค้ด component",
  "page.footer.before": "กฎการใช้งานทั้งหมดอยู่ใน",
  "page.footer.after": "เพิ่ม component ใหม่ด้วย",

  "nav.layout": "โครงสร้าง",
  "nav.forms": "ฟอร์ม",
  "nav.date": "วันที่",
  "nav.navigation": "การนำทาง",
  "nav.overlays": "Overlay",
  "nav.feedback": "สถานะ",
  "nav.data": "แสดงข้อมูล",
  "nav.multiSelect": "multi-select",

  "section.layout": "โครงสร้าง & เลย์เอาต์",
  "section.forms": "ฟอร์ม & อินพุต",
  "section.date": "วันที่",
  "section.navigation": "การนำทาง",
  "section.overlays": "Overlay & เมนู",
  "section.feedback": "สถานะ & การแจ้งเตือน",
  "section.data": "แสดงข้อมูล",
  "section.multiSelect": "multi-select (component เสริมของเรา)",
  "section.multiSelect.desc":
    "ดรอปดาวน์เลือกหลายรายการ พร้อมช่องค้นหา · เลือกทั้งหมด · chip ของรายการที่เลือก — ประกอบจาก popover + command + checkbox + badge ของ shadcn ทั้งหมด",

  "home.eyebrow": "Design System · Multi-brand",
  "home.title": "สวัสดี นี่คือระบบดีไซน์กลาง",
  "home.brandNow": "แบรนด์ปัจจุบัน:",
  "home.subtitle":
    "— สลับแบรนด์และโหมดดู สี/ฟอนต์เปลี่ยนทั้งหน้าโดยไม่แตะโค้ด component",
  "home.galleryTitle": "แกลเลอรี component ทั้งหมด",
  "home.galleryDesc":
    "ดูตัวอย่างการใช้งาน component ทั้ง 55 ตัวใน @repo/ui จัดเป็นหมวด พร้อมสลับแบรนด์และโหมดสว่าง/มืดได้ทันที",
  "home.openGallery": "เปิดแกลเลอรี",
  "home.swatches": "สีของแบรนด์ (tokens)",
  "home.buttons": "ปุ่ม",
  "home.faq": "คำถามที่พบบ่อย",
} as const;

export type TranslationKey = keyof typeof th;

const en: Record<TranslationKey, string> = {
  "brand.aria": "Select brand",
  "lang.aria": "Select language",

  "page.home": "Home",
  "page.title": "Component gallery",
  "page.subtitle": "All 55 components from @repo/ui",
  "page.intro.before": "Every example on this page uses components from",
  "page.intro.after":
    "and colours from tokens only — switch brand and light/dark mode in the top right and watch the whole page follow, with no component code changed.",
  "page.footer.before": "All usage rules live in",
  "page.footer.after": "Add a new component with",

  "nav.layout": "Layout",
  "nav.forms": "Forms",
  "nav.date": "Date",
  "nav.navigation": "Navigation",
  "nav.overlays": "Overlays",
  "nav.feedback": "Feedback",
  "nav.data": "Data display",
  "nav.multiSelect": "multi-select",

  "section.layout": "Layout & structure",
  "section.forms": "Forms & inputs",
  "section.date": "Date",
  "section.navigation": "Navigation",
  "section.overlays": "Overlays & menus",
  "section.feedback": "Status & notifications",
  "section.data": "Data display",
  "section.multiSelect": "multi-select (our own addition)",
  "section.multiSelect.desc":
    "A multi-select dropdown with search · select all · chips for the chosen items — composed entirely from shadcn's popover + command + checkbox + badge.",

  "home.eyebrow": "Design System · Multi-brand",
  "home.title": "Hello, this is the shared design system",
  "home.brandNow": "Current brand:",
  "home.subtitle":
    "— switch brand and mode, and colours/fonts change across the page without touching component code",
  "home.galleryTitle": "Full component gallery",
  "home.galleryDesc":
    "Browse usage examples for all 55 components in @repo/ui, grouped by category, with instant brand and light/dark switching.",
  "home.openGallery": "Open gallery",
  "home.swatches": "Brand colours (tokens)",
  "home.buttons": "Buttons",
  "home.faq": "Frequently asked questions",
};

const DICT = { th, en } as const;

/** คืนฟังก์ชันแปลของภาษาปัจจุบัน */
export function useT() {
  const { lang } = useLang();
  return useCallback((key: TranslationKey) => DICT[lang][key], [lang]);
}
