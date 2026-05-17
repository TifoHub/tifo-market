'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  getProductVariantBySize,
  type Product,
  type Size,
} from '@/app/lib/products'
import type { ShopifyCart } from '@/app/lib/shopify/types'

export interface CartItem {
  id?: string
  merchandiseId?: string
  product: Product
  size?: Size
  quantity: number
}

interface CartContextType {
  cartId: string | null
  items: CartItem[]
  addItem: (product: Product, size?: Size) => Promise<void>
  removeItem: (productId: string, size?: Size) => Promise<void>
  updateQuantity: (productId: string, size: Size | undefined, quantity: number) => Promise<void>
  clearCart: () => void
  totalItems: number
  totalPrice: number
  checkoutUrl?: string
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_ID_STORAGE_KEY = 'tifo-market-shopify-cart-id'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null
    try {
      return localStorage.getItem(CART_ID_STORAGE_KEY)
    } catch {
      return null
    }
  })
  const [checkoutUrl, setCheckoutUrl] = useState<string | undefined>(undefined)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (cartId) {
      localStorage.setItem(CART_ID_STORAGE_KEY, cartId)
    } else {
      localStorage.removeItem(CART_ID_STORAGE_KEY)
    }
  }, [cartId])

  const applyShopifyCart = useCallback((cart: ShopifyCart | null) => {
    if (!cart) {
      setItems([])
      setCartId(null)
      setCheckoutUrl(undefined)
      return
    }

    setCartId(cart.id)
    setCheckoutUrl(cart.checkoutUrl)
    setItems(
      cart.lines.map((line) => ({
        id: line.id,
        merchandiseId: line.merchandiseId,
        product: line.product,
        size: line.size,
        quantity: line.quantity,
      })),
    )
  }, [])

  useEffect(() => {
    if (!cartId) return

    let cancelled = false

    const loadCart = async () => {
      try {
        const res = await fetch(`/api/shopify/cart?cartId=${encodeURIComponent(cartId)}`, {
          cache: 'no-store',
        })
        const data = (await res.json()) as { cart?: ShopifyCart | null }
        if (!cancelled) {
          applyShopifyCart(data.cart ?? null)
        }
      } catch (error) {
        console.error('Failed to hydrate Shopify cart:', error)
        if (!cancelled) {
          applyShopifyCart(null)
        }
      }
    }

    void loadCart()

    return () => {
      cancelled = true
    }
  }, [applyShopifyCart, cartId])

  const ensureShopifyCart = useCallback(async () => {
    if (cartId) return cartId

    const res = await fetch('/api/shopify/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    const data = (await res.json()) as { cart?: ShopifyCart }

    if (!data.cart) {
      throw new Error('Failed to create Shopify cart')
    }

    applyShopifyCart(data.cart)
    return data.cart.id
  }, [applyShopifyCart, cartId])

  const addItem = useCallback(
    (product: Product, size?: Size) => {
      return (async () => {
        const variant = getProductVariantBySize(product, size)
        if (!variant) return

        try {
          const existingLine = items.find((item) => item.merchandiseId === variant.id)
          const resolvedCartId = await ensureShopifyCart()

          const res = await fetch('/api/shopify/cart/lines', {
            method: existingLine ? 'PATCH' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(
              existingLine
                ? {
                    cartId: resolvedCartId,
                    lines: [
                      {
                        id: existingLine.id,
                        quantity: existingLine.quantity + 1,
                      },
                    ],
                  }
                : {
                    cartId: resolvedCartId,
                    lines: [
                      {
                        merchandiseId: variant.id,
                        quantity: 1,
                      },
                    ],
                  },
            ),
          })
          const data = (await res.json()) as { cart?: ShopifyCart }
          if (data.cart) {
            applyShopifyCart(data.cart)
          }
        } catch (error) {
          console.error('Failed to add Shopify cart item:', error)
        }
      })()
    },
    [applyShopifyCart, ensureShopifyCart, items],
  )

  const removeItem = useCallback(
    (productId: string, size?: Size) => {
      return (async () => {
        const line = items.find(
          (item) => item.product.id === productId && item.size === size,
        )
        if (!line?.id || !cartId) return

        try {
          const res = await fetch('/api/shopify/cart/lines', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cartId,
              lineIds: [line.id],
            }),
          })
          const data = (await res.json()) as { cart?: ShopifyCart }
          if (data.cart) {
            applyShopifyCart(data.cart)
          }
        } catch (error) {
          console.error('Failed to remove Shopify cart item:', error)
        }
      })()
    },
    [applyShopifyCart, cartId, items],
  )

  const updateQuantity = useCallback(
    (productId: string, size: Size | undefined, quantity: number) => {
      return (async () => {
        if (quantity <= 0) {
          await removeItem(productId, size)
          return
        }

        const line = items.find(
          (item) => item.product.id === productId && item.size === size,
        )
        if (!line?.id || !cartId) return

        try {
          const res = await fetch('/api/shopify/cart/lines', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              cartId,
              lines: [
                {
                  id: line.id,
                  quantity,
                },
              ],
            }),
          })
          const data = (await res.json()) as { cart?: ShopifyCart }
          if (data.cart) {
            applyShopifyCart(data.cart)
          }
        } catch (error) {
          console.error('Failed to update Shopify cart quantity:', error)
        }
      })()
    },
    [applyShopifyCart, cartId, items, removeItem],
  )

  const clearCart = useCallback(() => {
    setItems([])
    setCartId(null)
    setCheckoutUrl(undefined)

    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_ID_STORAGE_KEY)
    }
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => {
      const unitPrice =
        getProductVariantBySize(item.product, item.size)?.price ?? item.product.price
      return sum + unitPrice * item.quantity
    },
    0,
  )

  return (
    <CartContext.Provider
      value={{
        cartId,
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
        checkoutUrl,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
