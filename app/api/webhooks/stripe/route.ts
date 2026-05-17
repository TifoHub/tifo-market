import { NextResponse } from 'next/server'

/*
 * Legacy Stripe webhooks handled checkout.session.completed and Supabase inventory.
 * Commerce is Shopify-only — orders and inventory are managed in Shopify Admin.
 */

export async function POST() {
  return NextResponse.json({ received: true, ignored: true })
}
