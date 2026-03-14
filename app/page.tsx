import { getItems } from '@/lib/base/items'
import ProductGrid from '@/components/ProductGrid'
import GlitchText from '@/components/GlitchText'
import HeroText from '@/components/HeroText'
import type { BaseItem } from '@/lib/base/types'

// ISR: revalidate the home page every hour
export const revalidate = 3600

export const metadata = {
  title: 'BAD PRINTER — グリッチコア Tシャツ | SHOP',
}

export default async function HomePage() {
  let items: BaseItem[] = []
  try {
    items = await getItems(20)
  } catch (err) {
    console.error('Failed to fetch BASE items:', err)
  }
  const visibleItems = items.filter((i) => i.visible === 1)

  return (
    <div className="min-h-screen">
      {/* ---- Hero ---- */}
      <section className="relative scanlines noise overflow-hidden border-b border-white/10 py-28 sm:py-40 px-4 text-center">

        {/* Moving scanline bar */}
        <div className="absolute w-full h-0.5 bg-neon-green/20 animate-scanline pointer-events-none" />

        {/* Large brand name */}
        <GlitchText
          text="BAD PRINTER"
          as="h1"
          className="text-5xl sm:text-7xl md:text-9xl font-bold tracking-tighter text-white uppercase leading-none"
        />

        {/* Tagline + subtitle — language-aware */}
        <HeroText />

        {/* Decorative corner brackets */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-neon-green/40 pointer-events-none" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-neon-green/40 pointer-events-none" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-neon-green/40 pointer-events-none" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-neon-green/40 pointer-events-none" />

        {/* Status line */}
        <div className="absolute bottom-3 left-0 right-0 flex justify-center">
          <span className="font-mono text-[10px] text-white/20 tracking-widest uppercase">
            SYS: READY — {visibleItems.length} ITEMS LOADED — PRINT QUEUE ACTIVE
          </span>
        </div>
      </section>

      {/* ---- Product Grid ---- */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        <ProductGrid items={visibleItems} />
      </section>
    </div>
  )
}
