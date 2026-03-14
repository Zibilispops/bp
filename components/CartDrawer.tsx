'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useCart } from './CartProvider'
import { useLanguage } from './LanguageProvider'
import { formatJPY } from '@/lib/base/items'

const STORE_NAME = process.env.NEXT_PUBLIC_BASE_STORE_NAME ?? 'badprinter'

export default function CartDrawer() {
  const { items, count, total, isOpen, removeItem, updateQty, clearCart, closeCart } = useCart()
  const { lang } = useLanguage()
  const closeRef = useRef<HTMLButtonElement>(null)

  const t = {
    title: lang === 'ja' ? `カート — ${count} 点` : `CART — ${count} ITEMS`,
    empty: lang === 'ja' ? 'カートは空です' : 'YOUR CART IS EMPTY',
    emptyHint: lang === 'ja' ? 'アイテムを追加してみましょう' : 'Add items to get started',
    total: lang === 'ja' ? '合計' : 'TOTAL',
    checkout: lang === 'ja' ? 'BASEで購入する →' : 'CHECKOUT ON BASE →',
    checkoutNote: lang === 'ja'
      ? '各商品のBASEページが新しいタブで開きます'
      : 'Opens a BASE page for each item in a new tab',
    clear: lang === 'ja' ? 'カートをクリア' : 'CLEAR CART',
    tax: lang === 'ja' ? '税込' : 'incl. tax',
    remove: lang === 'ja' ? '削除' : 'REMOVE',
  }

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') closeCart()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, closeCart])

  // Focus close button when opened
  useEffect(() => {
    if (isOpen) closeRef.current?.focus()
  }, [isOpen])

  function handleCheckout() {
    // Open BASE item page for each unique item in new tabs
    const seen = new Set<string>()
    items.forEach((item) => {
      if (!seen.has(item.item_id)) {
        seen.add(item.item_id)
        window.open(
          `https://${STORE_NAME}.thebase.in/items/${item.item_id}`,
          '_blank',
          'noopener,noreferrer'
        )
      }
    })
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
          onClick={closeCart}
          aria-hidden="true"
        />
      )}

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-label={t.title}
        aria-modal="true"
        className={`
          fixed top-0 right-0 h-full w-full sm:w-[420px] bg-zinc-950 border-l border-white/10 z-50
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-warn-orange">
              {t.title}
            </span>
          </div>
          <button
            ref={closeRef}
            onClick={closeCart}
            className="font-mono text-xs text-white/30 hover:text-white uppercase tracking-widest transition-colors px-2 py-1 border border-white/10 hover:border-white/30"
            aria-label="Close cart"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-6 text-center">
              <span className="text-4xl opacity-20">🖨</span>
              <p className="font-mono text-sm text-white/40 uppercase tracking-widest">
                {t.empty}
              </p>
              <p className="font-mono text-[10px] text-white/20 uppercase tracking-widest">
                {t.emptyHint}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {items.map((item) => (
                <li key={`${item.item_id}::${item.variation_id}`} className="flex gap-4 px-5 py-4">
                  {/* Thumbnail */}
                  <div className="relative w-16 h-16 shrink-0 bg-zinc-900 border border-white/10 overflow-hidden">
                    {item.image_url ? (
                      <Image src={item.image_url} alt={item.title} fill className="object-cover" sizes="64px" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white/20 font-mono">
                        N/A
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                    <p className="font-mono text-xs text-white/80 uppercase tracking-wider leading-tight line-clamp-2">
                      {item.title}
                    </p>
                    {item.variation && (
                      <p className="font-mono text-[10px] text-white/30 uppercase tracking-widest">
                        {item.variation}
                      </p>
                    )}
                    <p className="font-mono text-xs text-neon-green font-bold">
                      {formatJPY(item.price)} × {item.quantity} = {formatJPY(item.price * item.quantity)}
                    </p>

                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex items-center border border-white/15">
                        <button
                          onClick={() => updateQty(item.item_id, item.variation_id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center font-mono text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="w-7 h-7 flex items-center justify-center font-mono text-xs text-white/80 border-x border-white/15">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.item_id, item.variation_id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center font-mono text-white/50 hover:text-white hover:bg-white/5 transition-colors text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.item_id, item.variation_id)}
                        className="font-mono text-[10px] text-white/20 hover:text-warn-orange uppercase tracking-widest transition-colors"
                        aria-label={`${t.remove} ${item.title}`}
                      >
                        {t.remove}
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="shrink-0 border-t border-white/10 px-5 py-5 space-y-4">
            {/* Total */}
            <div className="flex items-baseline justify-between">
              <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                {t.total}
              </span>
              <div className="text-right">
                <span className="font-mono text-xl font-bold text-neon-green">
                  {formatJPY(total)}
                </span>
                <span className="ml-2 font-mono text-[10px] text-white/30 uppercase tracking-widest">
                  {t.tax}
                </span>
              </div>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="btn-primary w-full text-center"
            >
              {t.checkout}
            </button>

            {/* Note */}
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-widest text-center leading-relaxed">
              {t.checkoutNote}
            </p>

            {/* Clear cart */}
            <div className="text-center">
              <button
                onClick={clearCart}
                className="font-mono text-[10px] text-white/20 hover:text-warn-orange uppercase tracking-widest transition-colors"
              >
                {t.clear}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
