'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Lang } from '@/lib/i18n'

interface LangCtxValue {
  lang: Lang
  setLang: (l: Lang) => void
}

const LangCtx = createContext<LangCtxValue>({ lang: 'ja', setLang: () => {} })

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [lang, setLangState] = useState<Lang>('ja')

  // Read persisted preference from cookie on mount
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)lang=([^;]+)/)
    if (match?.[1] === 'en') setLangState('en')
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    document.cookie = `lang=${l}; path=/; max-age=31536000; SameSite=Lax`
  }

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

export function useLanguage(): LangCtxValue {
  return useContext(LangCtx)
}
