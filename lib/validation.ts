/** Matches Thai letters, whitespace, digits, and common punctuation. */
export const THAI_TEXT_REGEX = /^[\u0E00-\u0E7F\s\d\p{P}]+$/u;

export function isThaiText(text: string): boolean {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return THAI_TEXT_REGEX.test(trimmed);
}
