import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '特定商取引法に基づく表記',
  description: '特定商取引法に基づく表記 — BAD PRINTER',
}

const ROWS: [string, string][] = [
  ['販売事業者', '合同会社 BAD PRINTER'],
  ['代表責任者', '[代表者名を入力]'],
  ['所在地', '〒XXX-XXXX [住所を入力]（請求があれば遅滞なく開示します）'],
  ['電話番号', '非公開（下記メールアドレスにてお問合せください）'],
  ['メールアドレス', 'support@badprinter.jp'],
  ['販売価格', '各商品ページに記載の通り（消費税込み）'],
  ['追加手数料', '送料：全国一律 ¥500（税込）/ 離島・一部地域は別途'],
  ['支払い方法', 'クレジットカード・コンビニ支払い・銀行振込・キャリア決済（BASE決済）'],
  ['支払い時期', 'ご注文確定時にお支払いが発生します'],
  ['商品引渡し時期', 'ご入金確認後、3〜7営業日以内に発送します'],
  ['返品・交換', '商品の性質上、お客様都合による返品・交換はお受けできません。不良品・誤配送の場合のみ対応いたします。到着から7日以内にご連絡ください。'],
  ['事業者の特記事項', 'プリント受注生産のため、在庫状況により発送が遅延する場合があります。あらかじめご了承ください。'],
]

export default function TokushohoPage() {
  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="border-b border-white/5 px-4 sm:px-6 py-3">
        <div className="max-w-3xl mx-auto">
          <p className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
            <a href="/" className="hover:text-neon-green transition-colors">SHOP</a>
            <span className="mx-2 text-white/10">/</span>
            <span>特定商取引法</span>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        {/* Title */}
        <div className="mb-10">
          <p className="text-[10px] font-mono text-warn-orange uppercase tracking-widest mb-3">
            // LEGAL DISCLOSURE — JP LAW REQUIRED
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-jp">
            特定商取引法に基づく表記
          </h1>
          <div className="mt-3 h-px bg-gradient-to-r from-neon-green/40 to-transparent" />
        </div>

        {/* Disclosure table */}
        <dl className="space-y-0 border border-white/10">
          {ROWS.map(([label, value], i) => (
            <div
              key={label}
              className={`flex flex-col sm:flex-row ${i !== ROWS.length - 1 ? 'border-b border-white/5' : ''}`}
            >
              <dt className="shrink-0 w-full sm:w-44 px-4 py-4 text-[10px] sm:text-xs uppercase tracking-wider text-white/30 font-mono bg-white/[0.02]">
                {label}
              </dt>
              <dd className="px-4 py-4 text-sm text-white/70 font-jp leading-relaxed">
                {value}
              </dd>
            </div>
          ))}
        </dl>

        {/* Footer note */}
        <p className="mt-8 text-xs text-white/20 font-mono">
          ※ 本表記は特定商取引に関する法律（昭和51年法律第57号）第11条の規定に基づき掲載しています。
        </p>
      </div>
    </div>
  )
}
