import { NextResponse } from 'next/server'
import { createShopifyCart, getShopifyCart } from '@/app/lib/shopify/cart'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const cartId = searchParams.get('cartId')

  if (!cartId) {
    return NextResponse.json({ error: 'cartId is required' }, { status: 400 })
  }

  try {
    const cart = await getShopifyCart(cartId)
    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Shopify cart fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to load Shopify cart' },
      { status: 500 },
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}))
    const cart = await createShopifyCart(body.lines)
    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Shopify cart create error:', error)
    return NextResponse.json(
      { error: 'Failed to create Shopify cart' },
      { status: 500 },
    )
  }
}
