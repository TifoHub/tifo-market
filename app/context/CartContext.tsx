'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Product, Size } from '@/app/lib/products'

export interface CartItem {
  product: Product
  size?: Size
  quantity: number
}

// Unique key for a cart item (same product in different sizes = different items)
function cartItemKey(productId: string, size?: Size): string {
  return size ? `${productId}__${size}` : productId
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, size?: Size) => void
  removeItem: (productId: string, size?: Size) => void
  updateQuantity: (productId: string, size: Size | undefined, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'tifo-market-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        setItems(JSON.parse(stored))
      }
    } catch {
      // ignore parse errors
    }
    setHydrated(true)
  }, [])

  // Persist cart to localStorage on change
  useEffect(() => {
    if (hydrated) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    }
  }, [items, hydrated])

  const addItem = useCallback((product: Product, size?: Size) => {
    setItems((prev) => {
      const key = cartItemKey(product.id, size)
      const existing = prev.find(
        (item) => cartItemKey(item.product.id, item.size) === key,
      )
      if (existing) {
        return prev.map((item) =>
          cartItemKey(item.product.id, item.size) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      }
      return [...prev, { product, size, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((productId: string, size?: Size) => {
    const key = cartItemKey(productId, size)
    setItems((prev) =>
      prev.filter((item) => cartItemKey(item.product.id, item.size) !== key),
    )
  }, [])

  const updateQuantity = useCallback(
    (productId: string, size: Size | undefined, quantity: number) => {
      const key = cartItemKey(productId, size)
      if (quantity <= 0) {
        setItems((prev) =>
          prev.filter((item) => cartItemKey(item.product.id, item.size) !== key),
        )
        return
      }
      setItems((prev) =>
        prev.map((item) =>
          cartItemKey(item.product.id, item.size) === key
            ? { ...item, quantity }
            : item,
        ),
      )
    },
    [],
  )

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}
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
