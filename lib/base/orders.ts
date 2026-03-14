import { baseFetch } from './client'
import type { BaseOrder, BaseOrdersResponse } from './types'

interface GetOrdersParams {
  start_ordered?: string  // ISO date string
  end_ordered?: string    // ISO date string
  limit?: number
  offset?: number
}

/**
 * Fetch orders from BASE API.
 * Always fetches fresh (no ISR cache) — used only in the admin panel.
 */
export async function getOrders(params: GetOrdersParams = {}): Promise<BaseOrder[]> {
  const query = new URLSearchParams({
    limit: String(params.limit ?? 20),
    offset: String(params.offset ?? 0),
    ...(params.start_ordered ? { start_ordered: params.start_ordered } : {}),
    ...(params.end_ordered ? { end_ordered: params.end_ordered } : {}),
  })

  const data = await baseFetch<BaseOrdersResponse>(`/1/orders?${query}`, {
    // Admin orders: never cached
    next: { revalidate: 0 },
  })

  return data.orders
}
