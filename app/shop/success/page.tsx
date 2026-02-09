'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, ArrowLeft, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SuccessPage() {
  useEffect(() => {
    // Clear cart on success (in case it wasn't cleared before redirect)
    try {
      localStorage.removeItem('tifo-market-cart')
    } catch {
      // ignore
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white px-6">
      <div className="text-center max-w-md space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="size-20 text-[#D3AF37]" />
        </div>

        <h1 className="font-redzone text-4xl md:text-5xl tracking-wider text-[#D3AF37] uppercase">
          Order Confirmed
        </h1>

        <p className="font-barlow text-lg text-zinc-400 leading-relaxed">
          Thank you for your purchase! You&apos;ll receive an email confirmation shortly with your order details.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/shop">
            <Button
              className="bg-[#D3AF37] hover:bg-[#c4a030] text-black font-barlow uppercase tracking-wider"
              size="lg"
            >
              <ShoppingBag className="size-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button
              variant="outline"
              className="border-white/20 text-white hover:border-[#D3AF37] hover:text-[#D3AF37] bg-transparent hover:bg-transparent font-barlow uppercase tracking-wider"
              size="lg"
            >
              <ArrowLeft className="size-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
