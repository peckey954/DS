import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** รวม className อย่างปลอดภัย (แก้ conflict ของ Tailwind ให้อัตโนมัติ) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
