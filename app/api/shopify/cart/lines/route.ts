import { NextResponse } from 'next/server'
import {
  addShopifyCartLines,
  removeShopifyCartLines,
  updateShopifyCartLines,
} from '@/app/lib/shopify/cart'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const cart = await addShopifyCartLines(body.cartId, body.lines)
    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Shopify cart add lines error:', error)
    return NextResponse.json(
      { error: 'Failed to add Shopify cart lines' },
      { status: 500 },
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json()
    const cart = await updateShopifyCartLines(body.cartId, body.lines)
    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Shopify cart update lines error:', error)
    return NextResponse.json(
      { error: 'Failed to update Shopify cart lines' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const cart = await removeShopifyCartLines(body.cartId, body.lineIds)
    return NextResponse.json({ cart })
  } catch (error) {
    console.error('Shopify cart remove lines error:', error)
    return NextResponse.json(
      { error: 'Failed to remove Shopify cart lines' },
      { status: 500 },
    )
  }
}
