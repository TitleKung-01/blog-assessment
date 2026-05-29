/** Thai letters, digits, and whitespace only. */
export const THAI_AND_NUMBERS_REGEX = /^[\u0E00-\u0E7F0-9\s]+$/u;

export function isThaiAndNumbers(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return THAI_AND_NUMBERS_REGEX.test(trimmed);
}

/** @deprecated Use isThaiAndNumbers */
export function isThaiText(text: string): boolean {
  return isThaiAndNumbers(text);
}

export const MAX_BLOG_GALLERY_IMAGES = 6;

export function normalizeGalleryImages(images: string[]): string[] {
  return images
    .map((url) => url.trim())
    .filter(Boolean)
    .slice(0, MAX_BLOG_GALLERY_IMAGES);
}

/**
 * Builds a URL-friendly slug. Keeps Thai letters, Latin letters and digits,
 * collapses whitespace to dashes, and trims stray dashes.
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
