'use client'

import { useLanguage } from './LanguageProvider'
import { dict } from '@/lib/i18n'

export default function HeroText() {
  const { lang } = useLanguage()
  const t = dict[lang].hero

  return (
    <>
      <p className="mt-5 text-warn-orange font-mono text-xs sm:text-sm uppercase tracking-[0.3em]">
        {t.tagline}
      </p>
      <p className="mt-3 text-white/30 font-jp text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
        {t.sub1}<br />{t.sub2}
      </p>
    </>
  )
}
