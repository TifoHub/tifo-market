import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createServerClient } from '@/app/lib/supabase'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(key, { apiVersion: '2026-01-28.clover' })
}

/** Checkout Session payload fields used for fulfillment (Stripe types lag API). */
type FulfillmentSession = Stripe.Checkout.Session & {
  shipping_details?: {
    name?: string | null
    address?: Stripe.Address | null
  } | null
  shipping_cost?: { amount_total?: number | null } | null
}

async function decrementInventory(
  sessionId: string,
  stripe: Stripe,
) {
  const supabase = createServerClient()

  // Retrieve all line items for this session, expanding the product to get metadata
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    expand: ['data.price.product'],
    limit: 100,
  })

  for (const item of lineItems.data) {
    const product = item.price?.product as Stripe.Product | null
    if (!product || product.deleted) continue

    const productId = product.metadata?.product_id
    const size = product.metadata?.size
    if (!productId || !size) continue

    const qty = item.quantity ?? 1

    // Decrement quantity, floor at 0
    const { error } = await supabase.rpc('decrement_inventory', {
      p_product_id: productId,
      p_size: size,
      p_qty: qty,
    })

    if (error) {
      console.error(
        `Failed to decrement inventory for ${productId} (${size}):`,
        error,
      )
    } else {
      console.log(`Decremented inventory: ${productId} (${size}) by ${qty}`)
    }
  }
}

export async function POST(req: Request) {
  const stripe = getStripe()
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    )
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 },
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`Webhook signature verification failed: ${message}`)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 },
    )
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as FulfillmentSession
      console.log(`Payment successful for session ${session.id}`)
      console.log(`Customer email: ${session.customer_details?.email}`)
      console.log(`Amount total: ${session.amount_total}`)

      const shippingDetails = session.shipping_details
      if (shippingDetails?.address) {
        const a = shippingDetails.address
        console.log(
          `Ship to: ${[a.line1, a.line2].filter(Boolean).join(', ')}, ${a.city}, ${a.state} ${a.postal_code}, ${a.country}`,
        )
        if (shippingDetails.name) console.log(`Recipient: ${shippingDetails.name}`)
      }
      if (session.shipping_cost?.amount_total != null) {
        console.log(`Shipping (cents): ${session.shipping_cost.amount_total}`)
      }

      // TODO: Fulfill the order
      // - Save order to database (use session.shipping_details + line items)
      // - Send confirmation email

      // Decrement inventory for purchased items
      try {
        await decrementInventory(session.id, stripe)
      } catch (err) {
        console.error('Failed to decrement inventory:', err)
        // Don't return an error — payment succeeded, inventory update is best-effort
      }

      break
    }

    case 'checkout.session.expired': {
      const session = event.data.object as Stripe.Checkout.Session
      console.log(`Checkout session expired: ${session.id}`)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
