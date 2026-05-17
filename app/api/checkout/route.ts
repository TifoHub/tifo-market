import { NextResponse } from 'next/server'

/*
 * Legacy Stripe Checkout was removed. The storefront uses Shopify Cart API +
 * Shopify-hosted checkout only. Previous implementation lived in git history.
 */

export async function POST() {
  return NextResponse.json(
    { error: 'Stripe checkout is disabled. Use Shopify checkout from the cart.' },
    { status: 410 },
  )
}
