/**
 * baseFetch — low-level fetch wrapper for the BASE API v1.
 *
 * Authentication: The shop's own long-lived access token stored in
 * BASE_ACCESS_TOKEN env var (obtained from BASE Developer console).
 * No per-user OAuth2 flow required for reading the shop's own products.
 */

const BASE_API_URL = 'https://api.thebase.in'

export async function baseFetch<T>(
  path: string,
  options: RequestInit & { next?: { revalidate?: number } } = {}
): Promise<T> {
  const token = process.env.BASE_ACCESS_TOKEN
  if (!token) {
    throw new Error(
      'BASE_ACCESS_TOKEN is not configured. Add it to .env.local'
    )
  }

  const { next, ...fetchOptions } = options

  const res = await fetch(`${BASE_API_URL}${path}`, {
    ...fetchOptions,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    // next.js data cache config
    next: next ?? { revalidate: 3600 },
  })

  if (res.status === 429) {
    throw new Error('BASE API rate limit exceeded. Retry later.')
  }

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(
      `BASE API error: ${res.status} ${res.statusText}${text ? ` — ${text}` : ''}`
    )
  }

  return res.json() as Promise<T>
}
