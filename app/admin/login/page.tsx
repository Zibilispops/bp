'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createSupabaseBrowserClient()
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block border border-warn-orange/30 px-3 py-1 mb-4">
            <span className="font-mono text-xs text-warn-orange uppercase tracking-widest">
              // RESTRICTED ACCESS
            </span>
          </div>
          <h1 className="text-2xl font-bold font-mono uppercase tracking-widest text-white">
            ADMIN LOGIN
          </h1>
          <p className="mt-2 text-white/20 font-mono text-xs uppercase tracking-widest">
            Print Queue — Authorized Personnel Only
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1.5">
              EMAIL
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full bg-zinc-950 border border-white/20 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-neon-green transition-colors placeholder:text-white/20"
              placeholder="admin@badprinter.jp"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-widest text-white/30 mb-1.5">
              PASSWORD
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-zinc-950 border border-white/20 text-white font-mono text-sm px-4 py-3 focus:outline-none focus:border-neon-green transition-colors placeholder:text-white/20"
              placeholder="••••••••••"
            />
          </div>

          {error && (
            <div className="border border-warn-orange/40 bg-warn-orange/5 px-4 py-3 font-mono text-xs text-warn-orange">
              ⚠ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-center mt-2"
          >
            {loading ? 'AUTHENTICATING...' : 'LOGIN →'}
          </button>
        </form>

        <p className="mt-6 text-center">
          <a href="/" className="text-[10px] font-mono text-white/20 uppercase tracking-widest hover:text-white/50 transition-colors">
            ← BACK TO SHOP
          </a>
        </p>
      </div>
    </div>
  )
}
