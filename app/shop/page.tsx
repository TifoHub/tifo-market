'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductCard from '@/app/components/store/ProductCard'
import CartSheet from '@/app/components/store/CartSheet'
import { type Product } from '@/app/lib/products'

type Category = 'all' | Product['category']

const categories: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'collectibles', label: 'Collectibles' },
]

export default function ShopPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [products, setProducts] = useState<Product[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  useEffect(() => {
    let cancelled = false

    const loadProducts = async () => {
      setLoadingProducts(true)
      try {
        const res = await fetch('/api/shopify/products', { cache: 'no-store' })
        const data = await res.json() as { products?: Product[] }
        if (!cancelled) {
          setProducts(data.products ?? [])
        }
      } catch (error) {
        console.error('Failed to load Shopify products:', error)
        if (!cancelled) {
          setProducts([])
        }
      } finally {
        if (!cancelled) {
          setLoadingProducts(false)
        }
      }
    }

    void loadProducts()

    return () => {
      cancelled = true
    }
  }, [])

  const filtered =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-white/5 font-barlow"
              >
                <ArrowLeft className="size-4" />
                Back
              </Button>
            </Link>
            <h1 className="font-redzone text-2xl tracking-wider text-[#D3AF37] uppercase">
              Shop
            </h1>
          </div>
          <CartSheet />
        </div>
      </header>

      {/* Hero Banner */}
      <section className="border-b border-white/5 bg-linear-to-b from-zinc-950 to-black">
        <div className="mx-auto max-w-7xl px-6 py-16 text-center">
          <h2 className="font-redzone text-5xl md:text-7xl tracking-wider text-[#D3AF37] uppercase">
            Merch
          </h2>
          <p className="mt-4 font-barlow text-lg text-zinc-400 tracking-widest uppercase">
            Rep the culture. Wear the identity.
          </p>
        </div>
      </section>

      {/* Free Shipping Banner */}
      <div className="border-b border-[#D3AF37]/10 bg-[#D3AF37]/5">
        <p className="py-2 text-center font-barlow text-xs tracking-widest uppercase text-[#D3AF37]/70">
          Free shipping on orders of 2 or more items
        </p>
      </div>

      {/* Filters */}
      <div className="border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <Button
                key={cat.value}
                variant={activeCategory === cat.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(cat.value)}
                className={`font-barlow uppercase tracking-wider text-xs transition-all duration-200 ${
                  activeCategory === cat.value
                    ? 'bg-[#D3AF37] text-black hover:bg-[#c4a030]'
                    : 'border-white/10 text-zinc-400 hover:text-white hover:border-white/30 bg-transparent hover:bg-transparent'
                }`}
              >
                {cat.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <main className="mx-auto max-w-7xl px-6 py-12">
        {loadingProducts ? (
          <div className="py-24 text-center">
            <p className="text-zinc-500 font-barlow text-lg">
              Loading products...
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {!loadingProducts && filtered.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-zinc-500 font-barlow text-lg">
              No products in this category yet.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <p className="font-barlow text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} Tifo Market. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
