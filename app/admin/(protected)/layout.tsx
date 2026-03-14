import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = {
  title: 'Admin — Print Queue | BAD PRINTER',
  robots: { index: false, follow: false },
}

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Admin top bar */}
      <div className="border-b border-white/10 bg-zinc-950 sticky top-[57px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
            <span className="font-mono text-xs text-warn-orange uppercase tracking-widest">
              // ADMIN — PRINT QUEUE — ONLINE
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/30 font-mono">
            <span className="hidden sm:inline uppercase tracking-widest">
              {user.email}
            </span>
            <Link
              href="/admin/logout"
              className="uppercase tracking-widest hover:text-warn-orange transition-colors"
            >
              LOGOUT
            </Link>
          </div>
        </div>
      </div>

      {children}
    </div>
  )
}
