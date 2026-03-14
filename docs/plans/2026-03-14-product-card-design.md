# ProductCard — Editorial Neo-Brutalism Redesign
**Date:** 2026-03-14
**Status:** Approved

## Overview

Rebuild `components/ProductCard.tsx` from Glitch-Core dark theme to "Splash" Editorial Neo-Brutalism. Add a Quick View modal with white-only size selector and BASE checkout redirect.

## Approach

Self-contained `'use client'` component. Card + modal co-located in `components/ProductCard.tsx`. Modal rendered via `ReactDOM.createPortal` into `document.body`. Framer Motion `AnimatePresence` for transitions.

No other files changed (`ProductGrid`, `lib/base/*`, `lib/base/types.ts` all untouched).

## Design System

| Token | Value |
|---|---|
| BG_PRIMARY | `#F2F2F2` |
| TEXT_PRIMARY | `#0A0A0A` |
| ACCENT | `#2563eb` (Electric Blue) |
| BADGE | `#ADFF2F` (Green-Yellow) |
| Border radius | `rounded-[2.5rem]` (card, modal), `rounded-[2rem]` (modal image) |
| Font style | `font-black tracking-tighter` lowercase headers |

## Card Layout

- `aspect-[4/5]` image, `rounded-[2.5rem]`, `bg-[#F2F2F2]`
- Hover: image scale 1.03 (500ms ease)
- Floating badge top-left: `NEW DROP` if modified < 30 days; `LIMITED` if stock ≤ 5
- Floating `(+)` button bottom-right: `bg-[#0A0A0A]` `w-10 h-10` `rounded-full`, appears on hover (opacity 0→1, scale 0.75→1, 0.2s)
- Info section: title (font-black, lowercase, tracking-tighter), price in `#2563eb`, mock avatar group + "12 viewing", `©2026`
- Sold out: image `opacity-50`, `SOLD OUT / 売切` pill (preserved from existing)

## Quick View Modal

- Trigger: `(+)` button → `setIsOpen(true)`, reset `selected` to `null`
- Portal: `ReactDOM.createPortal` → `document.body`
- Backdrop: `bg-black/60 backdrop-blur-sm`, click to close
- Panel: `bg-[#F2F2F2]` `rounded-[2.5rem]` `max-w-2xl` `p-6` `shadow-2xl`
- Layout: left 60% image (`rounded-[2rem]`), right 40% details
- Details: brand tag, title, `¥` price (`text-[#2563eb]` `font-black` `text-3xl`), size pills, Buy Now button, `©2026 BAD PRINTER`

## Size Pills

- Fixed order: `XS / S / M / L / XL`
- Filter: `item.variations.filter(v => v.variation.includes('/ White'))`
- Display label: `v.variation.split(' / ')[0]`
- Unselected: `border border-black/20 rounded-full`
- Selected: `bg-[#0A0A0A] text-white rounded-full`
- OOS (stock=0 or missing): `opacity-30 line-through cursor-not-allowed`
- If no white variations at all: single `SOLD OUT / 売切` state, button disabled

## Checkout

```ts
// Buy Now → href
getCheckoutUrl(item.item_id) // → https://{STORE_NAME}.thebase.in/items/{item_id}
```

`<a target="_blank">`. Size is NOT passed — BASE handles selection on their storefront.
Button: `disabled` + `opacity-50` if `selected === null`.

## Animation

| Element | Entrance | Exit |
|---|---|---|
| Backdrop | opacity 0→1, 0.25s | opacity 1→0, 0.2s |
| Modal panel | y:32→0, opacity 0→1, 0.3s, ease `[0.16,1,0.3,1]` | y:0→24, opacity 1→0, 0.2s |
| `(+)` button | opacity 0→1, scale 0.75→1, 0.2s on card hover | — |
| Size pill | layoutId color swap, 0.15s | — |

## Accessibility

- Backdrop click → close
- `Escape` keydown → close (`useEffect`)
- `aria-modal="true"` on panel
- `Buy Now` disabled if no size selected
