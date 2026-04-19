/**
 * Normalize `inventory.size` from Supabase so it matches storefront `Size` keys.
 * Handles XXL/2XL, common spellings, and stray whitespace.
 */
export function normalizeInventoryRowSize(raw: unknown): string {
  let s = String(raw ?? '')
    .trim()
    .toUpperCase()
    .replace(/[\s._-]+/g, '')

  const aliases: Record<string, string> = {
    SMALL: 'S',
    SM: 'S',
    MEDIUM: 'M',
    MED: 'M',
    LARGE: 'L',
    LG: 'L',
    XLARGE: 'XL',
    XLG: 'XL',
    XXL: '2XL',
    XXLARGE: '2XL',
    '2XL': '2XL',
  }
  if (aliases[s]) return aliases[s]
  if (['S', 'M', 'L', 'XL', '2XL'].includes(s)) return s
  return s
}

export function toInventoryQuantity(raw: unknown): number {
  const n = typeof raw === 'number' ? raw : Number(raw)
  return Number.isFinite(n) ? n : 0
}
