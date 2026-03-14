'use client'

import { useLanguage } from './LanguageProvider'

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div
      className="flex items-center font-mono text-[11px] tracking-widest border border-white/15 shrink-0"
      role="group"
      aria-label="Language selection"
    >
      <button
        onClick={() => setLang('ja')}
        aria-pressed={lang === 'ja'}
        className={`px-2.5 py-1 transition-colors ${
          lang === 'ja'
            ? 'bg-neon-green text-black font-bold'
            : 'text-white/40 hover:text-white/80'
        }`}
      >
        JP
      </button>
      <div className="w-px self-stretch bg-white/15" />
      <button
        onClick={() => setLang('en')}
        aria-pressed={lang === 'en'}
        className={`px-2.5 py-1 transition-colors ${
          lang === 'en'
            ? 'bg-neon-green text-black font-bold'
            : 'text-white/40 hover:text-white/80'
        }`}
      >
        EN
      </button>
    </div>
  )
}
