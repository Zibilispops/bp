import type { Metadata } from 'next'
import { Space_Mono, Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SecretNav from '@/components/SecretNav'
import { LanguageProvider } from '@/components/LanguageProvider'
import { CartProvider } from '@/components/CartProvider'
import CartDrawer from '@/components/CartDrawer'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

const notoJP = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto-jp',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'BAD PRINTER — グリッチコア Tシャツ',
    template: '%s | BAD PRINTER',
  },
  description: 'Glitch-Core industrial t-shirts. Based in Japan. 工業系ビジュアル、怒れるプリンターの美学。',
  keywords: ['グリッチコア', 'Tシャツ', 'Japan', 'industrial', 'glitch', 'streetwear'],
  openGraph: {
    siteName: 'BAD PRINTER',
    locale: 'ja_JP',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${spaceMono.variable} ${notoJP.variable}`}>
      <body className="bg-black text-white font-mono antialiased min-h-screen">
        <LanguageProvider>
          <CartProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <SecretNav />
            <CartDrawer />
          </CartProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
