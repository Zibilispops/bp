import { baseFetch } from './client'
import { MOCK_ITEMS, getMockItem } from './mock'
import type { BaseItem, BaseItemsResponse, BaseItemResponse } from './types'

const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * Fetch a paginated list of items from the shop.
 * In development: falls back to mock data when the BASE API call fails.
 */
export async function getItems(limit = 20, offset = 0): Promise<BaseItem[]> {
  try {
    const data = await baseFetch<BaseItemsResponse>(
      `/1/items?limit=${limit}&offset=${offset}`
    )
    return data.items
  } catch (err) {
    if (IS_DEV) {
      console.warn('[mock] BASE API unavailable — using mock items')
      return MOCK_ITEMS.slice(offset, offset + limit)
    }
    throw err
  }
}

/**
 * Fetch all visible item IDs — used by generateStaticParams.
 */
export async function getAllItemIds(): Promise<string[]> {
  const items = await getItems(100, 0)
  return items
    .filter((i) => i.visible === 1)
    .map((i) => i.item_id)
}

/**
 * Fetch a single item by ID.
 * In development: falls back to mock data when the BASE API call fails.
 */
export async function getItem(itemId: string): Promise<BaseItem> {
  try {
    const data = await baseFetch<BaseItemResponse>(`/1/items/${itemId}`)
    return data.item
  } catch (err) {
    if (IS_DEV) {
      console.warn(`[mock] BASE API unavailable — using mock item ${itemId}`)
      const item = getMockItem(itemId)
      if (item) return item
    }
    throw err
  }
}

/**
 * Build the direct storefront URL for an item's checkout page on BASE.
 * There is no cart/checkout API — users are redirected to the item page.
 */
export function getCheckoutUrl(itemId: string, storeName: string): string {
  return `https://${storeName}.thebase.in/items/${itemId}`
}

/**
 * Format a price number as JPY currency string.
 */
export function formatJPY(price: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
  }).format(price)
}
