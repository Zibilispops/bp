import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getItem, getAllItemIds, formatJPY } from '@/lib/base/items'
import ProductDetail from '@/components/ProductDetail'

// ISR: revalidate product pages every hour
export const revalidate = 3600

interface Props {
  params: { item_id: string }
}

/**
 * Pre-render all visible product pages at build time.
 * New products added after build are handled by ISR (fallback: 'blocking').
 */
export async function generateStaticParams() {
  try {
    const ids = await getAllItemIds()
    return ids.map((item_id) => ({ item_id }))
  } catch {
    // If BASE API is unavailable at build time, fall back to no pre-rendering
    return []
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const item = await getItem(params.item_id)
    return {
      title: item.title,
      description: `${item.title} — ${formatJPY(item.price)} — BAD PRINTER`,
      openGraph: {
        title: item.title,
        images: item.images[0]?.url ? [{ url: item.images[0].url }] : [],
      },
    }
  } catch {
    return { title: 'Product Not Found' }
  }
}

export default async function ProductPage({ params }: Props) {
  let item

  try {
    item = await getItem(params.item_id)
  } catch {
    notFound()
  }

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-white/5 px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            <a href="/" className="hover:text-neon-green transition-colors">SHOP</a>
            <span className="mx-2 text-white/10">/</span>
            <span className="text-white/40 truncate">{item.title}</span>
          </p>
        </div>
      </div>

      <ProductDetail item={item} />
    </div>
  )
}
