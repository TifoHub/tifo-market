import { NextResponse } from 'next/server'
import { createPublicClient, type InventoryMap } from '@/app/lib/supabase'

export async function GET() {
  try {
    const supabase = createPublicClient()

    const { data, error } = await supabase
      .from('inventory')
      .select('product_id, size, quantity')

    if (error) {
      console.error('Supabase inventory fetch error:', error)
      return NextResponse.json(
        { error: 'Failed to fetch inventory' },
        { status: 500 },
      )
    }

    // Transform rows into { productId: { size: quantity } } map
    const inventoryMap: InventoryMap = {}
    for (const row of data ?? []) {
      if (!inventoryMap[row.product_id]) {
        inventoryMap[row.product_id] = {}
      }
      inventoryMap[row.product_id][row.size] = row.quantity
    }

    return NextResponse.json(inventoryMap)
  } catch (err) {
    console.error('Inventory API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
