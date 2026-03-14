export interface CartItem {
  item_id: string
  title: string
  price: number
  image_url: string | null
  variation_id: string | null
  variation: string | null
  quantity: number
}

export function cartKey(item_id: string, variation_id: string | null): string {
  return `${item_id}::${variation_id ?? 'none'}`
}
