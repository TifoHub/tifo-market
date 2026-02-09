'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ShoppingCart, Check } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/app/context/CartContext'
import { formatPrice, type Product, type Size } from '@/app/lib/products'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [selectedSize, setSelectedSize] = useState<Size | undefined>(
    product.sizes?.[0],
  )

  const needsSize = product.sizes && product.sizes.length > 0

  const handleAdd = () => {
    if (needsSize && !selectedSize) return
    addItem(product, selectedSize)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const categoryLabel = {
    apparel: 'Apparel',
    accessories: 'Accessories',
    collectibles: 'Collectibles',
  }

  return (
    <Card className="group overflow-hidden border-white/10 bg-zinc-950 text-white transition-all duration-300 hover:border-[#D3AF37]/40 hover:shadow-[0_0_30px_rgba(211,175,55,0.08)]">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-900">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Badge
          variant="secondary"
          className="absolute top-3 left-3 bg-black/70 text-[#D3AF37] border border-[#D3AF37]/30 text-[10px] uppercase tracking-widest"
        >
          {categoryLabel[product.category]}
        </Badge>
      </div>

      {/* Product Info */}
      <CardContent className="space-y-3 px-5 pt-4 pb-0">
        <h3 className="font-redzone text-lg tracking-wide text-white uppercase">
          {product.name}
        </h3>
        <p className="text-sm text-zinc-400 leading-relaxed font-barlow">
          {product.description}
        </p>
        <p className="text-xl font-semibold text-[#D3AF37] font-barlow">
          {formatPrice(product.price)}
        </p>

        {/* Size Selector */}
        {needsSize && (
          <div className="space-y-2">
            <p className="text-xs text-zinc-500 font-barlow uppercase tracking-wider">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes!.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`h-9 min-w-10 px-3 rounded-md border text-xs font-barlow font-medium uppercase tracking-wider transition-all duration-200
                    ${
                      selectedSize === size
                        ? 'border-[#D3AF37] bg-[#D3AF37]/10 text-[#D3AF37]'
                        : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'
                    }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Add to Cart */}
      <CardFooter className="px-5 pb-5 pt-3">
        <Button
          onClick={handleAdd}
          disabled={needsSize && !selectedSize}
          className={`w-full font-barlow uppercase tracking-wider text-sm transition-all duration-300 ${
            added
              ? 'bg-emerald-600 hover:bg-emerald-600 text-white'
              : 'bg-[#D3AF37] hover:bg-[#c4a030] text-black disabled:opacity-40 disabled:cursor-not-allowed'
          }`}
          size="lg"
        >
          {added ? (
            <>
              <Check className="size-4" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="size-4" />
              Add to Cart
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
