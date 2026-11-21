import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** The one button style used across the whole site (lime green, dark text) */
export const brandButton =
  "bg-brand text-brand-ink hover:bg-brand-dark font-semibold rounded-md transition-colors";

export function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}