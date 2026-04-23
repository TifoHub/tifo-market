import Stripe from 'stripe'
import { NextResponse } from 'next/server'

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set')
  }
  return new Stripe(key, { apiVersion: '2026-01-28.clover' })
}

interface CheckoutItem {
  productId: string
  size: string
  name: string
  price: number
  quantity: number
  image: string
}

/** ISO 3166-1 alpha-2 codes, comma-separated (default US). Example: US,CA */
function shippingAllowedCountries(): Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] {
  const raw = process.env.STRIPE_SHIPPING_ALLOWED_COUNTRIES ?? 'US'
  const codes = raw
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter((c) => /^[A-Z]{2}$/.test(c))
  return (codes.length > 0 ? codes : ['US']) as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[]
}

function flatShippingCents(): number {
  const n = Number(process.env.STRIPE_FLAT_SHIPPING_CENTS ?? '800')
  if (!Number.isFinite(n) || n < 0) return 800
  return Math.round(n)
}

function expressShippingCents(standard: number): number | null {
  const raw = process.env.STRIPE_EXPRESS_SHIPPING_CENTS
  if (raw === undefined || raw === '') return null
  const n = Number(raw)
  if (!Number.isFinite(n) || n < 0) return null
  const rounded = Math.round(n)
  if (rounded === standard) return null
  return rounded
}

export async function POST(req: Request) {
  try {
    const stripe = getStripe()

    const { items }: { items: CheckoutItem[] } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'No items provided' }, { status: 400 })
    }

    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0)
    const freeShipping = totalQuantity >= 2

    const standardCents = freeShipping ? 0 : flatShippingCents()
    const expressCents = freeShipping ? null : expressShippingCents(standardCents)

    const shippingOptions: Stripe.Checkout.SessionCreateParams.ShippingOption[] = [
      {
        shipping_rate_data: {
          display_name: freeShipping ? 'Free shipping' : 'Standard shipping',
          type: 'fixed_amount',
          fixed_amount: { amount: standardCents, currency: 'usd' },
        },
      },
    ]

    if (expressCents !== null) {
      shippingOptions.push({
        shipping_rate_data: {
          display_name: 'Express shipping',
          type: 'fixed_amount',
          fixed_amount: { amount: expressCents, currency: 'usd' },
        },
      })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: items.map((item) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            metadata: {
              product_id: item.productId,
              size: item.size,
            },
            ...(item.image.startsWith('http') ? { images: [item.image] } : {}),
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      shipping_address_collection: {
        allowed_countries: shippingAllowedCountries(),
      },
      shipping_options: shippingOptions,
      phone_number_collection: { enabled: true },
      success_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shop/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/shop`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    )
  }
}
