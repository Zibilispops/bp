# ProductCard Editorial Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild `components/ProductCard.tsx` from Glitch-Core dark to Editorial Neo-Brutalism with a Quick View modal, white-only size selector, and BASE checkout redirect.

**Architecture:** Single `'use client'` component replacing the existing Server Component. Modal co-located in the same file, rendered via `ReactDOM.createPortal` into `document.body`. Framer Motion `AnimatePresence` handles all transitions. No other files modified.

**Tech Stack:** Next.js 14 App Router, Tailwind CSS v3, Framer Motion, Lucide React, ReactDOM.createPortal

---

### Task 1: Convert to Client Component + Add State Scaffold

**Files:**
- Modify: `components/ProductCard.tsx`

**Step 1: Add `'use client'` and import state/portal hooks**

Replace the top of the file with:

```tsx
'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { formatJPY, getCheckoutUrl } from '@/lib/base/items'
import type { BaseItem } from '@/lib/base/types'

interface Props {
  item: BaseItem
}
```

**Step 2: Add state inside the component function**

At the top of `ProductCard`, before the return:

```tsx
const [isOpen, setIsOpen] = useState(false)
const [selected, setSelected] = useState<string | null>(null)
const [mounted, setMounted] = useState(false)

useEffect(() => {
  setMounted(true)
}, [])
```

> `mounted` guards `createPortal` — portals require the DOM to be available (SSR-safe).

**Step 3: Verify it compiles**

```bash
cd <project-root>
npm run build
```

Expected: build succeeds. The existing JSX is unchanged, only the top of the file changed.

**Step 4: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "refactor: convert ProductCard to client component, add modal state scaffold"
```

---

### Task 2: Redesign the Card Shell

**Files:**
- Modify: `components/ProductCard.tsx`

**Step 1: Replace the return JSX with the new card shell**

Replace the entire `return (...)` block:

```tsx
return (
  <>
    <div className="group relative bg-[#F2F2F2] rounded-[2.5rem] border border-black/8 overflow-hidden cursor-pointer">

      {/* Image container */}
      <div
        className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem]"
        onClick={() => { setSelected(null); setIsOpen(true) }}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.title}
            fill
            className={`object-cover transition-transform duration-500 group-hover:scale-[1.03] ${isSoldOut ? 'opacity-50' : ''}`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-black/10 text-xs uppercase tracking-widest">
            NO IMAGE
          </div>
        )}

        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="border border-black/40 text-black/60 text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-white/60">
              SOLD OUT / 売切
            </span>
          </div>
        )}
      </div>

      {/* Info section */}
      <div className="px-5 py-4">
        <h3 className="font-black tracking-tighter lowercase text-[#0A0A0A] text-lg leading-tight line-clamp-2">
          {item.title}
        </h3>
        <p className="mt-1 text-[#2563eb] font-black text-xl">
          {price}
        </p>

        {/* Social proof + copyright */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Mock avatar group */}
            <div className="flex -space-x-1.5">
              {['bg-zinc-400', 'bg-zinc-500', 'bg-zinc-600'].map((bg, i) => (
                <div key={i} className={`w-5 h-5 rounded-full ${bg} border-2 border-[#F2F2F2]`} />
              ))}
            </div>
            <span className="text-[10px] text-black/40 font-medium">12 viewing</span>
          </div>
          <span className="text-[10px] text-black/30">©2026</span>
        </div>
      </div>
    </div>

    {/* Portal placeholder — filled in Task 4 */}
    {mounted && isOpen && createPortal(
      <div>modal placeholder</div>,
      document.body
    )}
  </>
)
```

**Step 2: Run dev server and visually confirm card renders**

```bash
npm run dev
```

Open `http://localhost:3000`. Confirm: off-white card, black title lowercase, blue price, avatar row, ©2026.

**Step 3: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: redesign card shell — editorial neo-brutalism layout"
```

---

### Task 3: Add Floating Badge + (＋) Button

**Files:**
- Modify: `components/ProductCard.tsx`

**Step 1: Add badge logic above the return**

```tsx
const isNew = (() => {
  const modified = new Date(item.modified)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  return modified > thirtyDaysAgo
})()

const isLimited = !isSoldOut && item.stock > 0 && item.stock <= 5
```

**Step 2: Add badge inside the image container (top-left, after the Image)**

Inside the image `<div>`, after the `{isSoldOut && ...}` block:

```tsx
{/* Floating badge */}
{!isSoldOut && (isNew || isLimited) && (
  <div className="absolute top-3 left-3">
    <span className="bg-[#ADFF2F] text-[#0A0A0A] font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full">
      {isLimited ? 'LIMITED' : 'NEW DROP'}
    </span>
  </div>
)}
```

**Step 3: Add (＋) button inside the image container (bottom-right)**

```tsx
{/* Quick Add button */}
{!isSoldOut && (
  <button
    onClick={(e) => { e.stopPropagation(); setSelected(null); setIsOpen(true) }}
    className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#0A0A0A] text-white flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 ease-out"
    aria-label="Quick view"
  >
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  </button>
)}
```

> Using inline SVG for `+` avoids a Lucide import causing issues in some Next.js 14 configs. If `lucide-react` is confirmed installed, replace with `import { Plus } from 'lucide-react'` and `<Plus size={16} strokeWidth={2.5} />`.

**Step 4: Visually confirm hover behavior**

```bash
npm run dev
```

Hover a card — green-yellow badge appears (if within 30 days or limited stock), `+` button slides in bottom-right.

**Step 5: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: add floating NEW DROP/LIMITED badge and quick-add (+) button"
```

---

### Task 4: Build the Quick View Modal — Shell

**Files:**
- Modify: `components/ProductCard.tsx`

**Step 1: Add Escape key handler**

Inside the component, after the existing `useEffect`:

```tsx
useEffect(() => {
  if (!isOpen) return
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setIsOpen(false)
  }
  window.addEventListener('keydown', handleKey)
  return () => window.removeEventListener('keydown', handleKey)
}, [isOpen])
```

**Step 2: Replace the portal placeholder with the modal shell**

Replace `{mounted && isOpen && createPortal(<div>modal placeholder</div>, document.body)}` with:

```tsx
{mounted && createPortal(
  <div
    className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 transition-opacity duration-250 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
  >
    {/* Backdrop */}
    <div
      className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
    />

    {/* Modal panel */}
    <div
      role="dialog"
      aria-modal="true"
      className={`relative bg-[#F2F2F2] rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
        isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
      }`}
    >
      {/* Close button */}
      <button
        onClick={() => setIsOpen(false)}
        className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/8 hover:bg-black/12 flex items-center justify-center transition-colors"
        aria-label="Close"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>

      {/* Modal content — filled in Task 5 */}
      <div className="p-6 min-h-[200px] flex items-center justify-center text-black/30 text-sm">
        content coming in task 5
      </div>
    </div>
  </div>,
  document.body
)}
```

**Step 3: Verify modal opens and closes**

```bash
npm run dev
```

Click `+` on a card. Modal backdrop and panel should appear. Click backdrop or press Escape — should close. Panel should animate in/out (CSS transition).

**Step 4: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: add quick view modal shell with backdrop, close, and escape key"
```

---

### Task 5: Modal Content — Image + Details

**Files:**
- Modify: `components/ProductCard.tsx`

**Step 1: Replace the modal content placeholder with the full two-column layout**

Replace the `<div className="p-6 min-h-[200px]...">content coming in task 5</div>` with:

```tsx
<div className="flex flex-col sm:flex-row">
  {/* Left: product image (60%) */}
  <div className="relative sm:w-[58%] aspect-square sm:aspect-auto sm:min-h-[400px] bg-zinc-100 rounded-[2rem] m-4 sm:m-5 overflow-hidden flex-shrink-0">
    {imageUrl ? (
      <Image
        src={imageUrl}
        alt={item.title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 50vw"
      />
    ) : (
      <div className="absolute inset-0 flex items-center justify-center text-black/10 text-xs uppercase tracking-widest">
        NO IMAGE
      </div>
    )}
  </div>

  {/* Right: details (40%) */}
  <div className="flex flex-col justify-between px-5 sm:px-6 pb-6 pt-2 sm:pt-6 sm:w-[42%]">
    <div>
      {/* Brand tag */}
      <p className="text-[10px] uppercase tracking-widest text-black/40 font-medium mb-2">
        BAD PRINTER
      </p>

      {/* Title */}
      <h2 className="font-black tracking-tighter lowercase text-[#0A0A0A] text-2xl leading-tight mb-3">
        {item.title}
      </h2>

      {/* Price */}
      <p className="text-[#2563eb] font-black text-3xl mb-6">
        {price}
      </p>

      {/* Size selector — filled in Task 6 */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-black/40 font-medium mb-2">size</p>
        <p className="text-sm text-black/40">size selector coming in task 6</p>
      </div>
    </div>

    {/* Buy Now button — filled in Task 6 */}
    <div className="space-y-3">
      <button disabled className="w-full bg-black/20 text-white font-black tracking-tighter py-4 rounded-full text-sm cursor-not-allowed">
        select a size
      </button>
      <p className="text-center text-[10px] text-black/30">©2026 BAD PRINTER</p>
    </div>
  </div>
</div>
```

**Step 2: Verify two-column layout**

```bash
npm run dev
```

Open Quick View — left image, right brand/title/price/placeholder. Responsive: stacks vertically on mobile.

**Step 3: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: add modal two-column layout — image + product details"
```

---

### Task 6: Size Selector + Buy Now Button

**Files:**
- Modify: `components/ProductCard.tsx`

**Step 1: Add variation filter logic above the return**

```tsx
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL']

const whiteVariations = item.variations.filter(v =>
  v.variation.includes('/ White')
)

// Build a map: size label → stock
const sizeStock = whiteVariations.reduce<Record<string, number>>((acc, v) => {
  const label = v.variation.split(' / ')[0].trim()
  acc[label] = v.stock
  return acc
}, {})

// Sizes to render — fixed order, include all 5
const sizes = SIZE_ORDER.map(s => ({
  label: s,
  stock: sizeStock[s] ?? 0,
  available: (sizeStock[s] ?? 0) > 0,
}))

const hasAnyWhite = sizes.some(s => s.available)
const checkoutUrl = getCheckoutUrl(item.item_id)
```

**Step 2: Replace the size selector placeholder**

Replace `<p className="text-sm text-black/40">size selector coming in task 6</p>` with:

```tsx
{hasAnyWhite ? (
  <div className="flex flex-wrap gap-2">
    {sizes.map(({ label, available }) => (
      <button
        key={label}
        disabled={!available}
        onClick={() => setSelected(label)}
        className={`px-4 py-2 rounded-full text-sm font-bold border transition-all duration-150 ${
          selected === label
            ? 'bg-[#0A0A0A] text-white border-[#0A0A0A]'
            : available
            ? 'bg-transparent text-[#0A0A0A] border-black/20 hover:border-black/50'
            : 'bg-transparent text-black/25 border-black/10 line-through cursor-not-allowed'
        }`}
      >
        {label}
      </button>
    ))}
  </div>
) : (
  <p className="text-sm text-black/40 uppercase tracking-widest font-medium">
    SOLD OUT / 売切
  </p>
)}
```

**Step 3: Replace the Buy Now button placeholder**

Replace the disabled `<button>select a size</button>` with:

```tsx
{hasAnyWhite ? (
  <a
    href={selected ? checkoutUrl : undefined}
    target="_blank"
    rel="noopener noreferrer"
    onClick={!selected ? (e) => e.preventDefault() : undefined}
    className={`block w-full text-center font-black tracking-tighter py-4 rounded-full text-sm transition-all duration-150 ${
      selected
        ? 'bg-[#0A0A0A] text-white hover:bg-[#2563eb]'
        : 'bg-black/10 text-black/30 cursor-not-allowed'
    }`}
    aria-disabled={!selected}
  >
    {selected ? `Buy Now  →` : 'select a size'}
  </a>
) : (
  <button disabled className="w-full bg-black/10 text-black/30 font-black tracking-tighter py-4 rounded-full text-sm cursor-not-allowed">
    SOLD OUT / 売切
  </button>
)}
```

**Step 4: Verify size selector behaviour**

```bash
npm run dev
```

Open Quick View:
- All 5 sizes render in order XS → XL
- Sizes with no `/ White` variation (or stock=0) appear greyed, line-through
- Clicking an available size highlights it (black pill)
- "Buy Now →" activates and turns blue on hover only after a size is selected
- Clicking Buy Now opens `thebase.in` in a new tab

**Step 5: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: add white-only size selector and conditional buy now button"
```

---

### Task 7: Framer Motion Animations

**Files:**
- Modify: `components/ProductCard.tsx`

**Step 1: Install / confirm Framer Motion**

```bash
npm list framer-motion
```

If not listed:
```bash
npm install framer-motion
```

**Step 2: Add imports at top of file**

```tsx
import { motion, AnimatePresence } from 'framer-motion'
```

**Step 3: Wrap the portal contents with AnimatePresence**

Replace:
```tsx
{mounted && createPortal(
  <div className={`fixed inset-0 z-50 ... ${isOpen ? 'opacity-100 ...' : 'opacity-0 ...'}`}>
```

With:
```tsx
{mounted && createPortal(
  <AnimatePresence>
    {isOpen && (
      <motion.div
        key="modal-backdrop"
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
```

**Step 4: Animate the modal panel**

Replace:
```tsx
<div
  role="dialog"
  aria-modal="true"
  className={`relative bg-[#F2F2F2] rounded-[2.5rem] ... transition-all duration-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
>
```

With:
```tsx
<motion.div
  role="dialog"
  aria-modal="true"
  className="relative bg-[#F2F2F2] rounded-[2.5rem] w-full max-w-2xl shadow-2xl overflow-hidden"
  initial={{ y: 32, opacity: 0 }}
  animate={{ y: 0, opacity: 1 }}
  exit={{ y: 24, opacity: 0 }}
  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
>
```

Close all opened tags correctly — replace `</div>` with `</motion.div>` for both the panel and the outer wrapper, and close `</AnimatePresence>`.

**Step 5: Remove CSS transition classes from the panel**

Since Framer Motion now owns animation, remove any `transition-all duration-300 translate-y-*` classes from the panel element.

**Step 6: Verify animations**

```bash
npm run dev
```

Click `+` — backdrop fades in, panel springs up (custom ease). Close — panel drops and fades, backdrop fades. Should feel snappy, not floaty.

**Step 7: Commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: add framer motion AnimatePresence for modal entrance/exit"
```

---

### Task 8: Final Polish — Body Scroll Lock

**Files:**
- Modify: `components/ProductCard.tsx`

**Step 1: Lock body scroll when modal is open**

Add to the Escape key `useEffect` (or create a new one):

```tsx
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
  return () => {
    document.body.style.overflow = ''
  }
}, [isOpen])
```

**Step 2: Final visual check**

```bash
npm run dev
```

Verify:
- [ ] Card: off-white bg, rounded-[2.5rem], black title lowercase, blue price, avatar group, ©2026
- [ ] Badge: `NEW DROP` or `LIMITED` appears (green-yellow pill) when conditions met
- [ ] `+` button: smooth hover reveal, bottom-right, black circle
- [ ] Modal opens on `+` click, closes on backdrop click and Escape
- [ ] Left image visible, right column has brand tag, title, price, sizes, buy button
- [ ] Sizes XS–XL render; OOS = greyed + line-through; selected = black pill
- [ ] Buy Now active only after size selected, opens BASE in new tab
- [ ] Body scroll locked while modal open
- [ ] Mobile: modal stacks vertically, slides up from bottom

**Step 3: Final commit**

```bash
git add components/ProductCard.tsx
git commit -m "feat: complete ProductCard editorial redesign with quick view modal"
```

---

## File Summary

| File | Action |
|---|---|
| `components/ProductCard.tsx` | Full rewrite (client component) |
| `lib/base/items.ts` | Unchanged — `getCheckoutUrl()` used as-is |
| `lib/base/types.ts` | Unchanged |
| `components/ProductGrid.tsx` | Unchanged |

## Acceptance Criteria

- Card renders in `#F2F2F2` with `rounded-[2.5rem]`, font-black lowercase title, `#2563eb` price
- `+` button appears on hover, launches modal via portal
- Modal has two-column layout, filters to white variations only
- Size pills: XS/S/M/L/XL in fixed order, OOS greyed
- Buy Now disabled until size selected, links to BASE checkout in new tab
- Framer Motion AnimatePresence on all open/close transitions
- Body scroll locked while modal open
- `npm run build` passes
