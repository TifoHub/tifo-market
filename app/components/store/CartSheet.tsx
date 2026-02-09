'use client'

import React, { useState } from 'react'
import { ShoppingCart, Minus, Plus, Trash2, Loader2 } from 'lucide-react'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/app/context/CartContext'
import { formatPrice } from '@/app/lib/products'
import Image from 'next/image'

export default function CartSheet() {
  const { items, updateQuantity, removeItem, totalItems, totalPrice, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (items.length === 0) return

    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            name: item.size
              ? `${item.product.name} (${item.size})`
              : item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.image,
          })),
        }),
      })

      const data = await res.json()

      if (data.url) {
        clearCart()
        window.location.href = data.url
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative border-white/20 bg-transparent text-white hover:border-[#D3AF37] hover:text-[#D3AF37] hover:bg-transparent"
        >
          <ShoppingCart className="size-5" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 size-5 items-center justify-center rounded-full bg-[#D3AF37] p-0 text-[10px] font-bold text-black">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex flex-col border-white/10 bg-zinc-950 text-white w-full sm:max-w-md"
      >
        <SheetHeader>
          <SheetTitle className="font-redzone text-2xl tracking-wider text-[#D3AF37] uppercase">
            Your Cart
          </SheetTitle>
          <SheetDescription className="text-zinc-400 font-barlow">
            {totalItems === 0
              ? 'Your cart is empty.'
              : `${totalItems} item${totalItems !== 1 ? 's' : ''} in your cart.`}
          </SheetDescription>
        </SheetHeader>

        <Separator className="bg-white/10" />

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto space-y-4 px-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500">
              <ShoppingCart className="size-16 mb-4 opacity-30" />
              <p className="font-barlow text-lg">Nothing here yet</p>
              <p className="font-barlow text-sm mt-1">Browse the shop and add some items.</p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}__${item.size ?? 'none'}`}
                className="flex gap-4 rounded-lg border border-white/5 bg-zinc-900/50 p-3"
              >
                {/* Thumbnail */}
                <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-zinc-800">
                  <Image
                    src={item.product.image}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>

                {/* Details */}
                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <h4 className="font-redzone text-sm tracking-wide uppercase truncate">
                      {item.product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-sm text-[#D3AF37] font-barlow font-semibold">
                        {formatPrice(item.product.price)}
                      </p>
                      {item.size && (
                        <Badge
                          variant="outline"
                          className="text-[10px] border-white/15 text-zinc-400 font-barlow px-1.5 py-0"
                        >
                          {item.size}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon-xs"
                        className="border-white/10 bg-transparent text-white hover:border-[#D3AF37] hover:text-[#D3AF37] hover:bg-transparent"
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.quantity - 1)
                        }
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center text-sm font-barlow font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon-xs"
                        className="border-white/10 bg-transparent text-white hover:border-[#D3AF37] hover:text-[#D3AF37] hover:bg-transparent"
                        onClick={() =>
                          updateQuantity(item.product.id, item.size, item.quantity + 1)
                        }
                      >
                        <Plus />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      className="text-zinc-500 hover:text-red-400 hover:bg-transparent"
                      onClick={() => removeItem(item.product.id, item.size)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with total & checkout */}
        {items.length > 0 && (
          <SheetFooter className="border-t border-white/10 pt-4">
            <div className="w-full space-y-4">
              <div className="flex items-center justify-between font-barlow">
                <span className="text-zinc-400 uppercase tracking-wider text-sm">Total</span>
                <span className="text-2xl font-semibold text-[#D3AF37]">
                  {formatPrice(totalPrice)}
                </span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#D3AF37] hover:bg-[#c4a030] text-black font-barlow uppercase tracking-wider text-sm h-12 transition-all duration-300"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Proceed to Checkout'
                )}
              </Button>
              <p className="text-center text-xs text-zinc-500 font-barlow">
                Secure checkout powered by Stripe
              </p>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
