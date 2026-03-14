'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { CartItem } from '@/lib/cart'
import { cartKey } from '@/lib/cart'

interface CartCtxValue {
  items: CartItem[]
  count: number
  total: number
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (item_id: string, variation_id: string | null) => void
  updateQty: (item_id: string, variation_id: string | null, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

const CartCtx = createContext<CartCtxValue>({
  items: [],
  count: 0,
  total: 0,
  isOpen: false,
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  openCart: () => {},
  closeCart: () => {},
})

const STORAGE_KEY = 'bp_cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setItems(JSON.parse(raw))
    } catch {}
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prev) => {
      const key = cartKey(newItem.item_id, newItem.variation_id)
      const existing = prev.find(
        (i) => cartKey(i.item_id, i.variation_id) === key
      )
      if (existing) {
        return prev.map((i) =>
          cartKey(i.item_id, i.variation_id) === key
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        )
      }
      return [...prev, newItem]
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback(
    (item_id: string, variation_id: string | null) => {
      setItems((prev) =>
        prev.filter(
          (i) => cartKey(i.item_id, i.variation_id) !== cartKey(item_id, variation_id)
        )
      )
    },
    []
  )

  const updateQty = useCallback(
    (item_id: string, variation_id: string | null, qty: number) => {
      if (qty < 1) {
        removeItem(item_id, variation_id)
        return
      }
      setItems((prev) =>
        prev.map((i) =>
          cartKey(i.item_id, i.variation_id) === cartKey(item_id, variation_id)
            ? { ...i, quantity: qty }
            : i
        )
      )
    },
    [removeItem]
  )

  const clearCart = useCallback(() => setItems([]), [])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const count = items.reduce((s, i) => s + i.quantity, 0)
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <CartCtx.Provider
      value={{ items, count, total, isOpen, addItem, removeItem, updateQty, clearCart, openCart, closeCart }}
    >
      {children}
    </CartCtx.Provider>
  )
}

export function useCart(): CartCtxValue {
  return useContext(CartCtx)
}
