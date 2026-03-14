import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#39FF14',
        'warn-orange': '#FF6600',
        'acid-yellow': '#CCFF00',
        'glitch-cyan': '#00FFFF',
        'glitch-magenta': '#FF00FF',
      },
      fontFamily: {
        mono: ['var(--font-space-mono)', 'Space Mono', 'monospace'],
        jp: ['var(--font-noto-jp)', 'Noto Sans JP', 'sans-serif'],
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)', textShadow: 'none' },
          '20%': {
            transform: 'translate(-2px, 2px)',
            textShadow: '-2px 0 #FF00FF, 2px 0 #00FFFF',
          },
          '40%': {
            transform: 'translate(-2px, -2px)',
            textShadow: '2px 0 #FF00FF, -2px 0 #00FFFF',
          },
          '60%': {
            transform: 'translate(2px, 2px)',
            textShadow: '-2px 0 #39FF14, 2px 0 #FF6600',
          },
          '80%': {
            transform: 'translate(2px, -2px)',
            textShadow: '2px 0 #39FF14, -2px 0 #FF6600',
          },
        },
        scanline: {
          '0%': { top: '-2px' },
          '100%': { top: '100%' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'glitch-clip-1': {
          '0%': { clipPath: 'inset(40% 0 61% 0)' },
          '20%': { clipPath: 'inset(92% 0 1% 0)' },
          '40%': { clipPath: 'inset(43% 0 1% 0)' },
          '60%': { clipPath: 'inset(25% 0 58% 0)' },
          '80%': { clipPath: 'inset(54% 0 7% 0)' },
          '100%': { clipPath: 'inset(58% 0 43% 0)' },
        },
        'glitch-clip-2': {
          '0%': { clipPath: 'inset(25% 0 58% 0)' },
          '15%': { clipPath: 'inset(54% 0 7% 0)' },
          '30%': { clipPath: 'inset(58% 0 43% 0)' },
          '45%': { clipPath: 'inset(40% 0 61% 0)' },
          '60%': { clipPath: 'inset(92% 0 1% 0)' },
          '75%': { clipPath: 'inset(43% 0 1% 0)' },
          '100%': { clipPath: 'inset(25% 0 58% 0)' },
        },
      },
      animation: {
        glitch: 'glitch 0.4s ease-in-out infinite',
        scanline: 'scanline 6s linear infinite',
        flicker: 'flicker 0.15s infinite',
        'glitch-1': 'glitch-clip-1 0.5s infinite linear alternate-reverse',
        'glitch-2': 'glitch-clip-2 0.5s infinite linear alternate-reverse',
      },
    },
  },
  plugins: [],
}

export default config
