'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Hidden keyboard shortcut: press B then P (within 1s) to navigate to admin.
 * Not linked anywhere — security through obscurity for the shop owner.
 */
export default function SecretNav() {
  const router = useRouter()
  const lastKey = useRef<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Ignore when typing in inputs/textareas
      const tag = (e.target as HTMLElement).tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return

      const key = e.key.toLowerCase()

      if (lastKey.current === 'b' && key === 'p') {
        if (timer.current) clearTimeout(timer.current)
        lastKey.current = null
        router.push('/admin/login')
        return
      }

      lastKey.current = key
      if (timer.current) clearTimeout(timer.current)
      timer.current = setTimeout(() => {
        lastKey.current = null
      }, 1000)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      if (timer.current) clearTimeout(timer.current)
    }
  }, [router])

  return null
}
