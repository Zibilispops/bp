'use client'

import { useState, useEffect } from 'react'

const inputs = {
  complexity: 'Medium (3-4 colors, moderate detail)',
  cost: 'Under ¥1,500 (assume ¥1,200 as midpoint)',
  positioning: 'Mid-tier streetwear',
}

export default function PricingAnalysis() {
  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function run() {
      try {
        const response = await fetch('/api/pricing', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs),
        })
        if (!response.ok) throw new Error(`Server error: ${response.status}`)
        const data = await response.json()
        setResult(data.result)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [])

  const parseMarkdown = (text: string) =>
    text.split('\n').map((line, i) => {
      if (!line.trim()) return <div key={i} style={{ height: '0.5rem' }} />
      const boldLine = line.replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="color:#fff">$1</strong>'
      )
      return (
        <p
          key={i}
          dangerouslySetInnerHTML={{ __html: boldLine }}
          style={{ margin: '0.25rem 0' }}
        />
      )
    })

  return (
    <div
      style={{
        background: '#0a0a0a',
        minHeight: '100vh',
        padding: '2rem',
        fontFamily: 'monospace',
        color: '#e0e0e0',
      }}
    >
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div
          style={{
            borderBottom: '1px solid #222',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <p
            style={{
              color: '#555',
              fontSize: 11,
              textTransform: 'uppercase',
              letterSpacing: 3,
              margin: 0,
            }}
          >
            THREAD / Pricing Strategy
          </p>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
              margin: '0.4rem 0 0.75rem',
            }}
          >
            DTG Print Analysis
          </h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {[inputs.complexity, inputs.cost, inputs.positioning].map(
              (tag, i) => (
                <span
                  key={i}
                  style={{
                    background: '#161616',
                    border: '1px solid #2a2a2a',
                    borderRadius: 3,
                    padding: '2px 8px',
                    fontSize: 11,
                    color: '#777',
                  }}
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem', color: '#444' }}>
            <div style={{ fontSize: 12, letterSpacing: 4 }}>ANALYZING...</div>
          </div>
        )}

        {error && (
          <div
            style={{
              color: '#ff5555',
              padding: '1rem',
              background: '#1a0000',
              borderRadius: 6,
              fontSize: 13,
            }}
          >
            Error: {error}
          </div>
        )}

        {result && (
          <div
            style={{
              background: '#111',
              border: '1px solid #1e1e1e',
              borderRadius: 8,
              padding: '1.5rem',
              lineHeight: 1.9,
              fontSize: 14,
            }}
          >
            {parseMarkdown(result)}
          </div>
        )}
      </div>
    </div>
  )
}
