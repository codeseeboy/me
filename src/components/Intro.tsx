import { useEffect, useState } from 'react'
import { LOGO_PATH } from './Icons'

const KEY = 'sr-intro-seen'

/**
 * The opening: the SR mark draws itself while a counter runs to 100, then
 * the sheet lifts off the hero. Once per browser session, on the home page
 * only — a deep link to a case study goes straight to the case study.
 * While it plays, the hero's own entrance waits (html[data-intro]).
 */
export default function Intro() {
  const [show] = useState(() => {
    if (window.location.pathname !== '/') return false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    try {
      return !sessionStorage.getItem(KEY)
    } catch {
      return true
    }
  })
  const [n, setN] = useState(0)
  const [gone, setGone] = useState(!show)

  useEffect(() => {
    if (!show) return
    const root = document.documentElement
    root.dataset.intro = 'on'
    try {
      sessionStorage.setItem(KEY, '1')
    } catch {
      /* private mode — the intro simply plays again next time */
    }

    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1250)
      setN(Math.round(100 * (1 - Math.pow(1 - k, 2.4))))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Let the hero start as the sheet begins to lift, then remove the sheet.
    const release = window.setTimeout(() => delete root.dataset.intro, 1500)
    const done = window.setTimeout(() => setGone(true), 2300)
    return () => {
      cancelAnimationFrame(raf)
      window.clearTimeout(release)
      window.clearTimeout(done)
      delete root.dataset.intro
    }
  }, [show])

  if (gone) return null

  return (
    <div className="intro" aria-hidden="true">
      <svg className="intro__mark" viewBox="-2 -2 52 44">
        <path d={LOGO_PATH} pathLength={1} />
      </svg>
      <span className="intro__count">{String(n).padStart(3, '0')}</span>
      <span className="intro__name">Shashikant Rajput — AI Engineer</span>
    </div>
  )
}
