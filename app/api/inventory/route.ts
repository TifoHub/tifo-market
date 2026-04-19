import { NextResponse } from 'next/server'
import { buildInventoryMapFromRows } from '@/app/lib/inventory-map'
import { createPublicClient } from '@/app/lib/supabase'

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

    const inventoryMap = buildInventoryMapFromRows(data ?? [])

    return NextResponse.json(inventoryMap)
  } catch (err) {
    console.error('Inventory API error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    )
  }
}
