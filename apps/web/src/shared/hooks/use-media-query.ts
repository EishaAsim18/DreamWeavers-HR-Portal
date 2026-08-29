import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia(query).matches
  })

  useEffect(() => {
    const mq = window.matchMedia(query)
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    setMatches(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [query])

  return matches
}

// These thresholds are intentionally pinned to Tailwind's `md` (768px) and
// `lg` (1024px) breakpoints — the app shell (Sidebar/Navbar/MainLayout) mixes
// JS-driven layout math with `md:`/`lg:` utility classes, so the two MUST
// agree or the sidebar/content can end up hidden, overlapping, or offset
// incorrectly at in-between widths (this previously broke tablet/phone-landscape).

/** True below the `md` breakpoint — drives the off-canvas nav drawer. */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 767px)')
}

/** True between `md` and `lg` — sidebar-capable, but not yet full desktop width. */
export function useIsTablet(): boolean {
  return useMediaQuery('(min-width: 768px) and (max-width: 1023px)')
}

/** True at/above `md` — anything here shows the fixed sidebar (matches `md:block`). */
export function useIsDesktop(): boolean {
  return useMediaQuery('(min-width: 768px)')
}
