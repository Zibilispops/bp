'use client'

import { useState } from 'react'
import Image from 'next/image'
import { formatJPY, getCheckoutUrl } from '@/lib/base/items'
import type { BaseItem, BaseItemVariation } from '@/lib/base/types'
import { useLanguage } from './LanguageProvider'
import { useCart } from './CartProvider'
import { dict } from '@/lib/i18n'

const STORE_NAME =
  process.env.NEXT_PUBLIC_BASE_STORE_NAME ?? 'badprinter'

interface Props {
  item: BaseItem
}

export default function ProductDetail({ item }: Props) {
  const { lang } = useLanguage()
  const { addItem, items, openCart } = useCart()
  const t = dict[lang].product

  const [selectedVar, setSelectedVar] = useState<BaseItemVariation | null>(
    item.variations[0] ?? null
  )
  const [activeImg, setActiveImg] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 })

  const displayPrice = formatJPY(selectedVar?.price ?? item.price)
  const imageUrl = item.images[activeImg]?.url ?? null
  const checkoutUrl = getCheckoutUrl(item.item_id, STORE_NAME)

  const varInStock = selectedVar ? selectedVar.stock > 0 : item.stock > 0

  // Check if this exact variation is already in cart
  const inCart = items.some(
    (i) => i.item_id === item.item_id && i.variation_id === (selectedVar?.variation_id ?? null)
  )

  function handleAddToCart() {
    addItem({
      item_id: item.item_id,
      title: item.title,
      price: selectedVar?.price ?? item.price,
      image_url: item.images[0]?.url ?? null,
      variation_id: selectedVar?.variation_id ?? null,
      variation: selectedVar?.variation ?? null,
      quantity: 1,
    })
  }

  const addLabel = lang === 'ja'
    ? (inCart ? 'カートに追加済み ✓' : 'カートに追加 +')
    : (inCart ? 'IN CART ✓' : 'ADD TO CART +')

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  return (
    <article className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

      {/* ---- Left: Images ---- */}
      <div>
        {/* Main image with zoom */}
        <div
          className="relative aspect-square bg-zinc-950 border border-white/10 overflow-hidden cursor-crosshair select-none"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleMouseMove}
          role="img"
          aria-label={item.title}
        >
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {isZoomed && (
                <div
                  aria-hidden="true"
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                    backgroundSize: '280%',
                    backgroundRepeat: 'no-repeat',
                  }}
                />
              )}
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-white/10 text-xs uppercase tracking-widest">
              NO IMAGE
            </div>
          )}

          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-neon-green/60 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-neon-green/60 pointer-events-none" />

          <div className="absolute bottom-2 right-2 text-[9px] font-mono text-white/20 uppercase tracking-widest pointer-events-none">
            HOVER TO ZOOM
          </div>
        </div>

        {/* Thumbnails */}
        {item.images.length > 1 && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {item.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`relative w-14 h-14 border transition-colors ${
                  i === activeImg
                    ? 'border-neon-green'
                    : 'border-white/10 hover:border-white/40'
                }`}
                aria-label={`View image ${i + 1}`}
              >
                <Image src={img.url} alt="" fill className="object-cover" sizes="56px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ---- Right: Info ---- */}
      <div className="flex flex-col gap-6">
        {/* Title */}
        <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-white leading-tight font-jp">
          {item.title}
        </h1>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-3xl sm:text-4xl font-mono font-bold text-neon-green">
            {displayPrice}
          </span>
          <span className="text-xs text-white/30 font-mono uppercase tracking-widest">
            {t.includingTax}
          </span>
        </div>

        {/* Variation / Size selector */}
        {item.variations.length > 0 && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 font-mono">
              {t.sizeSelect}
            </p>
            <div className="flex flex-wrap gap-2">
              {item.variations.map((v) => {
                const outOfStock = v.stock === 0
                const isSelected = selectedVar?.variation_id === v.variation_id

                return (
                  <button
                    key={v.variation_id}
                    onClick={() => !outOfStock && setSelectedVar(v)}
                    disabled={outOfStock}
                    aria-pressed={isSelected}
                    className={`
                      px-3 py-2 border text-xs sm:text-sm font-mono uppercase tracking-widest
                      transition-colors duration-150
                      ${isSelected
                        ? 'border-neon-green text-neon-green bg-neon-green/5'
                        : 'border-white/20 text-white/60 hover:border-white/60 hover:text-white/90'
                      }
                      ${outOfStock
                        ? 'opacity-25 cursor-not-allowed line-through'
                        : 'cursor-pointer'
                      }
                    `}
                  >
                    {v.variation}
                    {outOfStock && t.varSoldOut}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Add to Cart + direct link */}
        <div className="pt-2 flex flex-col gap-3">
          {varInStock ? (
            <>
              <button
                onClick={inCart ? openCart : handleAddToCart}
                className={`btn-primary w-full sm:w-auto text-center transition-all ${
                  inCart ? 'bg-white/10 text-neon-green border border-neon-green/50 hover:bg-neon-green/10' : ''
                }`}
              >
                {addLabel}
              </button>
              <a
                href={checkoutUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[11px] text-white/30 hover:text-white/60 uppercase tracking-widest transition-colors text-center sm:text-left"
              >
                {t.buyNow}
              </a>
            </>
          ) : (
            <button disabled className="btn-primary w-full sm:w-auto text-center opacity-30 cursor-not-allowed">
              {t.soldOutBtn}
            </button>
          )}
        </div>

        {/* Stock info */}
        {selectedVar && (
          <p className="text-xs font-mono text-white/30 uppercase tracking-widest">
            {selectedVar.stock > 0 ? t.stock(selectedVar.stock) : t.outOfStock}
          </p>
        )}

        {/* Description */}
        {item.detail && (
          <div className="border-t border-white/10 pt-6">
            <p className="text-[10px] uppercase tracking-widest text-white/30 mb-3 font-mono">
              {t.description}
            </p>
            <div
              className="text-sm text-white/60 leading-relaxed font-jp space-y-2 [&_a]:text-neon-green [&_a:hover]:text-warn-orange"
              dangerouslySetInnerHTML={{ __html: item.detail }}
            />
          </div>
        )}
      </div>
    </article>
  )
}
