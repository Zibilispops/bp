'use client'

import Link from 'next/link'
import { useLanguage } from './LanguageProvider'
import { dict } from '@/lib/i18n'

export default function Footer() {
  const { lang } = useLanguage()
  const t = dict[lang].footer
  const year = new Date().getFullYear()

  return (
    <footer className="mt-24 border-t border-white/10 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-white/30 text-xs uppercase tracking-widest font-mono">
        <span>© {year} BAD PRINTER — JAPAN</span>

        <nav className="flex flex-wrap justify-center gap-6" aria-label="Footer navigation">
          <Link
            href="/tokushoho"
            className="hover:text-neon-green transition-colors"
          >
            {t.legal}
          </Link>
        </nav>
      </div>

      {/* Decorative glitch bar */}
      <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-neon-green/20 to-transparent" />
    </footer>
  )
}
