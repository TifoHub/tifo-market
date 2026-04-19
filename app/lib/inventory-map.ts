import type { InventoryMap } from '@/app/lib/supabase'
import { normalizeInventoryRowSize, toInventoryQuantity } from '@/app/lib/inventory-size'

export function buildInventoryMapFromRows(
  rows: Array<{ product_id: string; size: unknown; quantity: unknown }>,
): InventoryMap {
  const map: InventoryMap = {}
  for (const row of rows) {
    if (!map[row.product_id]) map[row.product_id] = {}
    map[row.product_id][normalizeInventoryRowSize(row.size)] = toInventoryQuantity(
      row.quantity,
    )
  }
  return map
}
