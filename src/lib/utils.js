import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

/**
 * Utility function for combining CSS class names
 * @param {...string} inputs - CSS class names to combine
 * @returns {string} Combined class names with duplicates removed
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
