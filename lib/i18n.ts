export type Lang = 'ja' | 'en'

export const dict = {
  ja: {
    nav: {
      shop: 'SHOP',
      legal: '特商法',
    },
    hero: {
      tagline: '// グリッチコア Tシャツ — TOKYO, JAPAN',
      sub1: 'プリントキューからあなたのエラーを着ろ。',
      sub2: '工業系ビジュアル、怒れるプリンターの美学。',
    },
    product: {
      sizeSelect: '// SIZE / VARIANT — SELECT',
      buyNow: 'BUY NOW — BASEで購入 →',
      redirect: 'BASE の決済画面に移動します',
      soldOutBtn: 'SOLD OUT / 完売',
      varSoldOut: ' (売切)',
      includingTax: '税込',
      stock: (n: number) => `STOCK: ${n} 点在庫あり`,
      outOfStock: 'STOCK: 完売',
      description: '// DESCRIPTION',
    },
    footer: {
      legal: '特定商取引法に基づく表記',
    },
  },
  en: {
    nav: {
      shop: 'SHOP',
      legal: 'LEGAL',
    },
    hero: {
      tagline: '// GLITCH-CORE T-SHIRTS — TOKYO, JAPAN',
      sub1: 'Wear your error from the print queue.',
      sub2: 'Industrial visuals. The aesthetics of an angry printer.',
    },
    product: {
      sizeSelect: '// SIZE / VARIANT — SELECT',
      buyNow: 'BUY NOW — Purchase on BASE →',
      redirect: 'You will be redirected to BASE checkout',
      soldOutBtn: 'SOLD OUT',
      varSoldOut: ' (sold out)',
      includingTax: 'incl. tax',
      stock: (n: number) => `STOCK: ${n} REMAINING`,
      outOfStock: 'STOCK: OUT OF STOCK',
      description: '// DESCRIPTION',
    },
    footer: {
      legal: 'Specified Commercial Transactions',
    },
  },
} as const
