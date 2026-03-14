/**
 * Mock BASE API data for local development.
 * Used automatically when BASE_ACCESS_TOKEN is not set or returns an error.
 */

import type { BaseItem } from './types'

// Inline SVG data-URI placeholders — no network required, no next/image host config needed
function mockImg(label: string, bg: string, fg: string): string {
  const lines = label.split(' ')
  const svgRows = lines
    .map((t, i) => `<text x="400" y="${400 + (i - (lines.length - 1) / 2) * 64}" text-anchor="middle" dominant-baseline="middle" font-size="48" font-family="monospace" fill="${fg}" font-weight="bold">${t}</text>`)
    .join('')
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800"><rect width="800" height="800" fill="${bg}"/><rect x="0" y="0" width="800" height="4" fill="${fg}" opacity="0.3"/><rect x="0" y="796" width="800" height="4" fill="${fg}" opacity="0.3"/><rect x="0" y="0" width="4" height="800" fill="${fg}" opacity="0.3"/><rect x="796" y="0" width="4" height="800" fill="${fg}" opacity="0.3"/>${svgRows}</svg>`
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`
}

export const MOCK_ITEMS: BaseItem[] = [
  {
    item_id: 'mock-001',
    title: 'GLITCH ERROR TEE — TYPE-A',
    detail: '<p>工業系プリントの原点。ノイズが走る基板回路パターン。ブラック×ネオングリーン印刷。</p><p>Heavyweight 280gsm cotton. Oversize fit.</p>',
    price: 6800,
    stock: 15,
    visible: 1,
    list_order: 1,
    modified: '2025-01-01T00:00:00+09:00',
    images: [
      { url: mockImg('GLITCH ERROR', '#111111', '#39FF14') },
      { url: mockImg('BACK PRINT', '#0a0a0a', '#FF6600') },
    ],
    variations: [
      { variation_id: 'v001-s',   variation: 'S / Black',   stock: 3, price: 6800 },
      { variation_id: 'v001-m',   variation: 'M / Black',   stock: 5, price: 6800 },
      { variation_id: 'v001-l',   variation: 'L / Black',   stock: 4, price: 6800 },
      { variation_id: 'v001-xl',  variation: 'XL / Black',  stock: 3, price: 6800 },
      { variation_id: 'v001-xxl', variation: 'XXL / Black', stock: 0, price: 6800 },
    ],
  },
  {
    item_id: 'mock-002',
    title: 'ANGRY PRINTER MONSTER — LOGO TEE',
    detail: '<p>怒れるプリンターモンスター。ブランドアイコンの大型フロントプリント。</p><p>Regular fit. 100% organic cotton.</p>',
    price: 7500,
    stock: 8,
    visible: 1,
    list_order: 2,
    modified: '2025-01-02T00:00:00+09:00',
    images: [
      { url: mockImg('ANGRY PRINTER MONSTER', '#111111', '#FF6600') },
    ],
    variations: [
      { variation_id: 'v002-s',  variation: 'S / White',  stock: 2, price: 7500 },
      { variation_id: 'v002-m',  variation: 'M / White',  stock: 3, price: 7500 },
      { variation_id: 'v002-l',  variation: 'L / White',  stock: 2, price: 7500 },
      { variation_id: 'v002-xl', variation: 'XL / White', stock: 1, price: 7500 },
    ],
  },
  {
    item_id: 'mock-003',
    title: 'PAPER JAM — LONG SLEEVE',
    detail: '<p>PAPER JAM 01 エラー。両袖に走るグリッチストライプ。裏地プリント付き。</p><p>Boxy fit. 320gsm fleece-back cotton.</p>',
    price: 9200,
    stock: 6,
    visible: 1,
    list_order: 3,
    modified: '2025-01-03T00:00:00+09:00',
    images: [
      { url: mockImg('PAPER JAM', '#0d0d0d', '#00FFFF') },
    ],
    variations: [
      { variation_id: 'v003-s',  variation: 'S / Black',  stock: 1, price: 9200 },
      { variation_id: 'v003-m',  variation: 'M / Black',  stock: 2, price: 9200 },
      { variation_id: 'v003-l',  variation: 'L / Black',  stock: 2, price: 9200 },
      { variation_id: 'v003-xl', variation: 'XL / Black', stock: 1, price: 9200 },
    ],
  },
  {
    item_id: 'mock-004',
    title: 'INK OVERFLOW — SPLATTER DROP',
    detail: '<p>インクオーバーフロー。制御不能なインク飛散グラフィック。限定カラー。</p>',
    price: 7200,
    stock: 0,
    visible: 1,
    list_order: 4,
    modified: '2025-01-04T00:00:00+09:00',
    images: [
      { url: mockImg('INK OVERFLOW', '#0a0a0a', '#FF00FF') },
    ],
    variations: [
      { variation_id: 'v004-s', variation: 'S / Black', stock: 0, price: 7200 },
      { variation_id: 'v004-m', variation: 'M / Black', stock: 0, price: 7200 },
      { variation_id: 'v004-l', variation: 'L / Black', stock: 0, price: 7200 },
    ],
  },
  {
    item_id: 'mock-005',
    title: 'ERROR 404 — OVERSIZED HEAVY TEE',
    detail: '<p>存在しないページを着る。フロントに巨大な404コード、バックに診断テキスト。</p>',
    price: 8000,
    stock: 12,
    visible: 1,
    list_order: 5,
    modified: '2025-01-05T00:00:00+09:00',
    images: [
      { url: mockImg('ERROR 404', '#111111', '#CCFF00') },
    ],
    variations: [
      { variation_id: 'v005-s',  variation: 'S / Black',  stock: 3, price: 8000 },
      { variation_id: 'v005-m',  variation: 'M / Black',  stock: 4, price: 8000 },
      { variation_id: 'v005-l',  variation: 'L / Black',  stock: 3, price: 8000 },
      { variation_id: 'v005-xl', variation: 'XL / Black', stock: 2, price: 8000 },
    ],
  },
  {
    item_id: 'mock-006',
    title: 'KERNEL PANIC — CROP TEE',
    detail: '<p>カーネルパニック。システム崩壊の美学をクロップ丈で。</p>',
    price: 6200,
    stock: 7,
    visible: 1,
    list_order: 6,
    modified: '2025-01-06T00:00:00+09:00',
    images: [
      { url: mockImg('KERNEL PANIC', '#0d0d0d', '#FF6600') },
    ],
    variations: [
      { variation_id: 'v006-xs', variation: 'XS / Black', stock: 2, price: 6200 },
      { variation_id: 'v006-s',  variation: 'S / Black',  stock: 3, price: 6200 },
      { variation_id: 'v006-m',  variation: 'M / Black',  stock: 2, price: 6200 },
    ],
  },
]

export function getMockItem(itemId: string): BaseItem | undefined {
  return MOCK_ITEMS.find((i) => i.item_id === itemId)
}
