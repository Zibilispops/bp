'use client'

import Link from 'next/link'
import GlitchText from './GlitchText'
import LanguageSwitcher from './LanguageSwitcher'
import CartButton from './CartButton'
import { useLanguage } from './LanguageProvider'
import { dict } from '@/lib/i18n'

export default function Header() {
  const { lang } = useLanguage()
  const t = dict[lang].nav

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-3 sm:gap-4">

        {/* Language switcher — top left */}
        <LanguageSwitcher />

        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-3 group flex-1 min-w-0" aria-label="BAD PRINTER — Home">
          <div className="w-9 h-9 shrink-0 bg-neon-green flex items-center justify-center text-black font-bold text-[10px] leading-none tracking-tighter select-none">
            BAD<br />PRT
          </div>
          <GlitchText
            text="BAD PRINTER"
            as="span"
            className="text-base sm:text-xl font-bold tracking-widest text-white uppercase hidden sm:block"
          />
        </Link>

        {/* Nav + Cart */}
        <nav
          className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm text-white/50 uppercase tracking-widest font-mono shrink-0"
          aria-label="Main navigation"
        >
          <Link href="/" className="hover:text-neon-green transition-colors">
            {t.shop}
          </Link>
          <Link href="/tokushoho" className="hover:text-neon-green transition-colors">
            {t.legal}
          </Link>
          <CartButton />
        </nav>

      </div>
    </header>
  )
}
