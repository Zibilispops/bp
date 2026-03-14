// BASE API response type definitions
// Reference: https://docs.thebase.in/api/

export interface BaseItemImage {
  url: string
}

export interface BaseItemVariation {
  variation_id: string
  variation: string   // e.g. "S / Black", "M / White"
  stock: number
  price: number
}

export interface BaseItem {
  item_id: string
  title: string
  detail: string          // HTML description
  price: number
  stock: number
  visible: 1 | 0
  list_order: number
  modified: string        // ISO timestamp (JST)
  images: BaseItemImage[]
  variations: BaseItemVariation[]
}

export interface BaseItemsResponse {
  items: BaseItem[]
  total_count: number
}

export interface BaseItemResponse {
  item: BaseItem
}

// --- Orders ---

export interface BaseOrderItem {
  item_id: string
  variation_id: string
  variation: string       // e.g. "M / Black"
  title: string
  price: number
  amount: number          // quantity
}

export interface BaseOrder {
  order_id: string
  ordered: string         // ISO timestamp (JST)
  cancel: string | null
  payment_date: string | null
  payment_method: string  // "creditcard" | "cod" | "cvs" | "base_bt" | "atobarai" | ...
  delivery_date: string
  delivery_time_zone: string
  is_paid: boolean
  is_dispatched: boolean
  is_cancelled: boolean
  total: number
  ordered_items: BaseOrderItem[]
}

export interface BaseOrdersResponse {
  orders: BaseOrder[]
  total_count: number
}
