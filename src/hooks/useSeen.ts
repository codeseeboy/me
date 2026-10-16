import { useEffect, useRef, useState } from 'react'

/**
 * True once the element has entered the viewport. Drives the hinge reveal.
 *
 * It fails open: without IntersectionObserver, under reduced motion, or if
 * the observer simply never fires, a timer marks the element seen anyway.
 * Readable content always beats animated content.
 */
export default function useSeen<T extends HTMLElement>(threshold = 0.25, fallbackMs = 1800) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    if (seen) return
    const el = ref.current
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || reduce || typeof IntersectionObserver === 'undefined') {
      setSeen(true)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setSeen(true)
          io.disconnect()
        }
      },
      { threshold },
    )
    io.observe(el)

    const t = window.setTimeout(() => {
      // Only force it if the element is actually on screen by now.
      const r = el.getBoundingClientRect()
      if (r.top < window.innerHeight && r.bottom > 0) setSeen(true)
    }, fallbackMs)

    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [seen, threshold, fallbackMs])

  return [ref, seen] as const
}
