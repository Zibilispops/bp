'use client'

import { useCart } from './CartProvider'

export default function CartButton() {
  const { count, openCart } = useCart()

  return (
    <button
      onClick={openCart}
      aria-label={`Cart — ${count} items`}
      className="relative flex items-center gap-1.5 font-mono text-xs text-white/50 hover:text-neon-green uppercase tracking-widest transition-colors shrink-0"
    >
      {/* Minimal cart icon */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        className="shrink-0"
        aria-hidden="true"
      >
        <path
          d="M1 1h2l1.5 7h7l1.5-5H4.5"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <rect x="5.5" y="12.5" width="1" height="1" fill="currentColor" />
        <rect x="11.5" y="12.5" width="1" height="1" fill="currentColor" />
      </svg>

      {/* Count badge */}
      {count > 0 && (
        <span className="bg-neon-green text-black font-bold text-[10px] px-1.5 py-px leading-none min-w-[18px] text-center">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </button>
  )
}
