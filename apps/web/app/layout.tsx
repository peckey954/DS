import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai, Prompt, Sarabun } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

// ฟอนต์ไทยของแต่ละแบรนด์ — ผูกไว้กับ CSS variable
// token ของแบรนด์ (blue/green) จะเลือกว่าจะใช้ตัวไหนผ่าน --font-sans
const ibmThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-thai",
  display: "swap",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Design System — Multi-brand",
  description: "shadcn-based design system: สลับสี / ฟอนต์ / dark-light ต่อแบรนด์",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      data-brand="blue"
      suppressHydrationWarning
      className={`${ibmThai.variable} ${prompt.variable} ${sarabun.variable}`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
