import { NextResponse } from 'next/server'
import { getStorefrontProducts } from '@/app/lib/shopify/products'

export async function GET() {
  try {
    const products = await getStorefrontProducts()
    return NextResponse.json({ products })
  } catch (error) {
    console.error('Shopify products error:', error)
    return NextResponse.json(
      { error: 'Failed to load Shopify products' },
      { status: 500 },
    )
  }
}
