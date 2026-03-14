import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getOrders } from '@/lib/base/orders'
import PrintQueue from '@/components/PrintQueue'
import type { PrintOrder } from '@/components/PrintQueue'

// Admin page: always fresh, never cached
export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const supabase = await createSupabaseServerClient()

  // Fetch paid orders from BASE API in parallel with Supabase data
  let baseOrders: Awaited<ReturnType<typeof getOrders>> = []
  try {
    baseOrders = await getOrders({ limit: 50 })
  } catch (err) {
    console.error('Failed to fetch BASE orders:', err)
  }

  const paidOrders = baseOrders.filter((o) => o.is_paid && !o.is_cancelled)

  // Upsert new paid orders into Supabase (idempotent via unique base_order_id)
  if (paidOrders.length > 0) {
    const upsertRows = paidOrders.map((order) => {
      const firstItem = order.ordered_items[0]
      const parts = firstItem?.variation?.split(' / ') ?? []
      const size = parts[0] ?? null
      const color = parts[1] ?? null

      return {
        base_order_id: order.order_id,
        item_title: firstItem?.title ?? 'Unknown Item',
        size,
        color,
      }
    })

    await supabase
      .from('orders')
      .upsert(upsertRows, { onConflict: 'base_order_id', ignoreDuplicates: true })
  }

  // Fetch the current print queue from Supabase
  const { data: printQueue, error } = await supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12 font-mono text-warn-orange text-sm">
        ⚠ Failed to load print queue: {error.message}
      </div>
    )
  }

  return <PrintQueue orders={(printQueue as PrintOrder[]) ?? []} />
}
