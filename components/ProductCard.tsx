'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { formatJPY, getCheckoutUrl } from '@/lib/base/items'
import type { BaseItem } from '@/lib/base/types'

interface ProductCardProps {
  item: BaseItem
}

export default function ProductCard({ item }: ProductCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const isSoldOut = item.stock === 0

  const isNew =
    new Date(item.modified) >
    (() => {
      const d = new Date()
      d.setDate(d.getDate() - 30)
      return d
    })()
  const isLimited = !isSoldOut && item.stock > 0 && item.stock <= 5

  const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL']
  const whiteVariations = item.variations.filter(v =>
    v.variation.includes('/ White')
  )
  const sizeStock = whiteVariations.reduce<Record<string, number>>((acc, v) => {
    const label = v.variation.split(' / ')[0].trim()
    acc[label] = v.stock
    return acc
  }, {})
  const sizes = SIZE_ORDER.map(s => ({
    label: s,
    stock: sizeStock[s] ?? 0,
    available: (sizeStock[s] ?? 0) > 0,
  }))
  const hasAnyWhite = sizes.some(s => s.available)
  const checkoutUrl = getCheckoutUrl(item.item_id, process.env.NEXT_PUBLIC_BASE_STORE_NAME ?? '')

  const primaryImage = item.images[0]?.url ?? ''

  return (
    <>
      {/* Card Shell */}
      <div className="bg-[#F2F2F2] rounded-[2.5rem] border border-black/8 overflow-hidden cursor-pointer group relative">
        {/* Image Area */}
        <div
          className="aspect-[4/5] rounded-[2.5rem] overflow-hidden relative"
          onClick={() => {
            setSelected(null)
            setIsOpen(true)
          }}
        >
          {primaryImage && (
            <Image
              src={primaryImage}
              alt={item.title}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-[1.03]${isSoldOut ? ' opacity-50' : ''}`}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          )}

          {/* Sold Out Pill */}
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="border border-black/40 text-black/60 text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/60">
                SOLD OUT / 売切
              </span>
            </div>
          )}

          {/* Badge */}
          {!isSoldOut && (isNew || isLimited) && (
            <div className="absolute top-3 left-3">
              <span className="bg-[#ADFF2F] text-[#0A0A0A] font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full">
                {isLimited ? 'LIMITED' : 'NEW DROP'}
              </span>
            </div>
          )}

          {/* (+) Button */}
          {!isSoldOut && (
            <button
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#0A0A0A] text-white shadow-lg flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 ease-out"
              onClick={e => {
                e.stopPropagation()
                setSelected(null)
                setIsOpen(true)
              }}
              aria-label="Quick view"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          )}
        </div>

        {/* Info Section */}
        <div className="px-4 pt-3 pb-4">
          <h2 className="font-black tracking-tighter lowercase text-[#0A0A0A] text-lg line-clamp-2 mb-1">
            {item.title}
          </h2>
          <p className="text-[#2563eb] font-black text-xl mb-3">
            {formatJPY(item.price)}
          </p>

          {/* Social Proof Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-1.5">
                <div className="w-5 h-5 rounded-full bg-zinc-400 border border-white" />
                <div className="w-5 h-5 rounded-full bg-zinc-500 border border-white" />
                <div className="w-5 h-5 rounded-full bg-zinc-600 border border-white" />
              </div>
              <span className="text-[10px] text-black/40">12 viewing</span>
            </div>
            <span className="text-[10px] text-black/30">©2026</span>
          </div>
        </div>
      </div>

      {/* Modal Portal */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                key="modal-backdrop"
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                {/* Backdrop */}
                <div
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                  onClick={() => setIsOpen(false)}
                />

                {/* Panel */}
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  className="relative bg-[#F2F2F2] rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden"
                  initial={{ y: 32, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 24, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Close Button */}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/8 hover:bg-black/12 flex items-center justify-center transition-colors"
                    aria-label="Close"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>

                  {/* Two-Column Content */}
                  <div className="flex flex-col sm:flex-row">
                    {/* Left: Image */}
                    <div className="rounded-[2rem] m-4 sm:m-5 aspect-square sm:aspect-auto sm:min-h-[400px] bg-zinc-100 overflow-hidden relative flex-shrink-0 sm:w-[58%]">
                      {primaryImage && (
                        <Image
                          src={primaryImage}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 58vw"
                        />
                      )}
                    </div>

                    {/* Right: Details */}
                    <div className="flex flex-col justify-between px-5 sm:px-6 pb-6 pt-2 sm:pt-6 sm:w-[42%]">
                      {/* Top Section */}
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-black/40 font-medium mb-2">
                          BAD PRINTER
                        </p>
                        <h2 className="font-black tracking-tighter lowercase text-[#0A0A0A] text-2xl leading-tight mb-3">
                          {item.title}
                        </h2>
                        <p className="text-[#2563eb] font-black text-3xl mb-6">
                          {formatJPY(item.price)}
                        </p>

                        {/* Size Selector */}
                        <div className="mb-6">
                          <p className="text-[10px] uppercase tracking-widest text-black/40 font-medium mb-2">
                            {hasAnyWhite ? 'Size' : 'Availability'}
                          </p>

                          {hasAnyWhite ? (
                            <div className="flex flex-wrap gap-2">
                              {sizes.map(size => {
                                const isSelected = selected === size.label
                                const baseClasses =
                                  'rounded-full px-4 py-2 text-sm font-bold transition-all duration-150'
                                let variantClasses = ''

                                if (!size.available) {
                                  variantClasses =
                                    'border border-black/10 text-black/25 line-through cursor-not-allowed opacity-70'
                                } else if (isSelected) {
                                  variantClasses =
                                    'bg-[#0A0A0A] text-white border border-[#0A0A0A]'
                                } else {
                                  variantClasses =
                                    'border border-black/20 hover:border-black/50 text-[#0A0A0A]'
                                }

                                return (
                                  <button
                                    key={size.label}
                                    disabled={!size.available}
                                    onClick={() =>
                                      size.available &&
                                      setSelected(
                                        isSelected ? null : size.label
                                      )
                                    }
                                    className={`${baseClasses} ${variantClasses}`}
                                  >
                                    {size.label}
                                  </button>
                                )
                              })}
                            </div>
                          ) : (
                            <p className="text-sm text-black/40 uppercase tracking-widest font-medium">
                              SOLD OUT / 売切
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Bottom Section */}
                      <div>
                        {hasAnyWhite ? (
                          <a
                            href={selected ? checkoutUrl : undefined}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={
                              !selected ? e => e.preventDefault() : undefined
                            }
                            className={`block w-full text-center font-black tracking-tighter py-4 rounded-full text-sm transition-all duration-150 ${
                              selected
                                ? 'bg-[#0A0A0A] text-white hover:bg-[#2563eb]'
                                : 'bg-black/10 text-black/30 cursor-not-allowed'
                            }`}
                            aria-disabled={!selected}
                          >
                            {selected ? 'Buy Now →' : 'select a size'}
                          </a>
                        ) : (
                          <button
                            disabled
                            className="block w-full text-center font-black tracking-tighter py-4 rounded-full text-sm bg-black/10 text-black/30 cursor-not-allowed"
                          >
                            SOLD OUT / 売切
                          </button>
                        )}
                        <p className="text-center text-[10px] text-black/30 mt-3">
                          ©2026 BAD PRINTER
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
