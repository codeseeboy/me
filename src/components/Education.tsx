import { useEffect, useRef, useState } from 'react'
import { Frame } from './CaseStack'
import CollegeDrawing from './CollegeDrawing'
import { EDUCATION, type Study } from '../data/profile'

/**
 * Sets --draw on the element from 0 (its top just entering the viewport)
 * to 1 (its top three-quarters of the way up), so the drawing inside is
 * scrubbed by scroll rather than played on a timer.
 */
function useDrawProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--draw', '1')
      setDone(true)
      return
    }
    let raf = 0
    const update = () => {
      raf = 0
      const vh = window.innerHeight
      const top = el.getBoundingClientRect().top
      const p = Math.max(0, Math.min(1, (vh * 0.92 - top) / (vh * 0.7)))
      el.style.setProperty('--draw', p.toFixed(3))
      if (p > 0.55) setDone(true)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return [ref, done] as const
}

/** Counts a score up from zero once, keeping its decimals and suffix. */
function CountUp({ value, run }: { value: string; run: boolean }) {
  const target = Number.parseFloat(value)
  const decimals = (value.split('.')[1] ?? '').replace(/\D/g, '').length
  const suffix = value.replace(/[\d.]/g, '')
  const [n, setN] = useState(run ? 0 : target)

  useEffect(() => {
    if (!run || Number.isNaN(target)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setN(target)
      return
    }
    let raf = 0
    const start = performance.now()
    const tick = (t: number) => {
      const k = Math.min(1, (t - start) / 1400)
      setN(target * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, target])

  return (
    <>
      {n.toFixed(decimals)}
      {suffix}
    </>
  )
}

function School({ e, i }: { e: Study; i: number }) {
  const [ref, done] = useDrawProgress<HTMLElement>()
  return (
    <section ref={ref} className={`panel school${done ? ' is-seen' : ''}`} aria-labelledby={`school-${e.drawing}`}>
      <Frame label={`Campus ${String(i + 1).padStart(2, '0')} · ${e.years}`} className="panel__frame">
        <div className="school__grid">
          <div className="school__art">
            <CollegeDrawing kind={e.drawing} label={`Line drawing of the ${e.school} campus`} />
          </div>
          <div className="school__text">
            <span className="school__years">{e.years}</span>
            <h3 className="school__name" id={`school-${e.drawing}`}>
              {e.school}
            </h3>
            <p className="school__q">{e.qualification}</p>
            <p className="school__score">
              <strong>
                <CountUp value={e.score.value} run={done} />
              </strong>
              <span>{e.score.label}</span>
            </p>
            <p className="school__place">{e.place}</p>
          </div>
        </div>
      </Frame>
    </section>
  )
}

export default function Education() {
  return (
    <div className="edu-chapter" id="education">
      <header className="chapter">
        <span className="chapter__k">Chapter 02</span>
        <h2 className="chapter__title">Education</h2>
        <p className="chapter__lede">A diploma in computer engineering in Mumbai, then a B.Tech in AI &amp; ML in Palghar.</p>
      </header>
      {EDUCATION.map((e, i) => (
        <School key={e.school} e={e} i={i} />
      ))}
    </div>
  )
}
