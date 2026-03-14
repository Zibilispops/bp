import ProductCard from './ProductCard'
import type { BaseItem } from '@/lib/base/types'

interface Props {
  items: BaseItem[]
}

// Server Component
export default function ProductGrid({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="text-center py-24 text-white/20 font-mono text-sm uppercase tracking-widest">
        // NO ITEMS IN QUEUE
      </div>
    )
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-white/5" />
        <p className="text-xs uppercase tracking-widest text-white/30 font-mono">
          // PRINT QUEUE — {items.length} ITEMS ACTIVE
        </p>
        <div className="h-px flex-1 bg-white/5" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-white/5">
        {items.map((item) => (
          <div key={item.item_id} className="bg-black">
            <ProductCard item={item} />
          </div>
        ))}
      </div>
    </section>
  )
}
