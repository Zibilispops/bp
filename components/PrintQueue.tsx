'use client'

import { useState, useTransition } from 'react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export interface PrintOrder {
  id: string
  base_order_id: string
  item_title: string
  size: string | null
  color: string | null
  design_asset_url: string | null
  status: 'pending' | 'printed'
  created_at: string
}

interface Props {
  orders: PrintOrder[]
}

export default function PrintQueue({ orders: initial }: Props) {
  const [orders, setOrders] = useState<PrintOrder[]>(initial)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const supabase = createSupabaseBrowserClient()

  async function markPrinted(id: string) {
    setError(null)
    startTransition(async () => {
      const { error: supabaseError } = await supabase
        .from('orders')
        .update({ status: 'printed' })
        .eq('id', id)

      if (supabaseError) {
        setError(`Failed to update: ${supabaseError.message}`)
        return
      }

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'printed' as const } : o))
      )
    })
  }

  const pending = orders.filter((o) => o.status === 'pending')
  const printed = orders.filter((o) => o.status === 'printed')

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'TOTAL ORDERS', value: orders.length },
          { label: 'PENDING PRINT', value: pending.length, accent: 'warn-orange' },
          { label: 'PRINTED', value: printed.length, accent: 'neon-green' },
          { label: 'COMPLETION', value: orders.length ? `${Math.round((printed.length / orders.length) * 100)}%` : '0%' },
        ].map(({ label, value, accent }) => (
          <div key={label} className="border border-white/10 p-4">
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-mono mb-1">
              {label}
            </p>
            <p className={`text-2xl font-mono font-bold ${accent === 'warn-orange' ? 'text-warn-orange' : accent === 'neon-green' ? 'text-neon-green' : 'text-white'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 border border-warn-orange/50 bg-warn-orange/5 px-4 py-3 font-mono text-sm text-warn-orange">
          ⚠ {error}
        </div>
      )}

      {/* Orders table */}
      {orders.length === 0 ? (
        <div className="text-center py-20 text-white/20 font-mono text-sm uppercase tracking-widest">
          // NO ORDERS IN QUEUE
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full admin-table border-collapse min-w-[640px]">
            <thead>
              <tr>
                <th>ORDER ID</th>
                <th>ITEM</th>
                <th>SIZE</th>
                <th>COLOR</th>
                <th>DESIGN FILE</th>
                <th>STATUS</th>
                <th>DATE</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <span className="text-white/40 text-xs">
                      #{order.base_order_id}
                    </span>
                  </td>
                  <td>
                    <span className="text-white font-jp">{order.item_title}</span>
                  </td>
                  <td>
                    <span className="text-white/70">
                      {order.size ?? '—'}
                    </span>
                  </td>
                  <td>
                    <span className="text-white/70">
                      {order.color ?? '—'}
                    </span>
                  </td>
                  <td>
                    {order.design_asset_url ? (
                      <a
                        href={order.design_asset_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-neon-green text-xs underline hover:text-warn-orange transition-colors"
                      >
                        ↓ DL ASSET
                      </a>
                    ) : (
                      <span className="text-white/20 text-xs">—</span>
                    )}
                  </td>
                  <td>
                    <span className={order.status === 'printed' ? 'badge-printed' : 'badge-pending'}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <span className="text-white/30 text-xs">
                      {new Date(order.created_at).toLocaleDateString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      })}
                    </span>
                  </td>
                  <td>
                    {order.status === 'pending' && (
                      <button
                        onClick={() => markPrinted(order.id)}
                        disabled={isPending}
                        className="text-xs px-3 py-1.5 border border-white/20 text-white/50 font-mono uppercase tracking-widest hover:border-neon-green hover:text-neon-green transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        MARK PRINTED ✓
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
