'use client'

type AllowedTag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'

interface GlitchTextProps {
  text: string
  className?: string
  as?: AllowedTag
}

/**
 * GlitchText — renders text with a CSS pseudo-element glitch effect on hover.
 * Uses data-text attribute so before/after can replicate the content via CSS.
 */
export default function GlitchText({
  text,
  className = '',
  as: Tag = 'h1',
}: GlitchTextProps) {
  return (
    <Tag
      data-text={text}
      className={`glitch-text ${className}`}
    >
      {text}
    </Tag>
  )
}
