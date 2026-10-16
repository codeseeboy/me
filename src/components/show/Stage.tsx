import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * Draws a product mockup at its own design size and scales the whole thing
 * to fit its box — both width and height, never above 1:1. The mockup can
 * never spill into a border, whatever the screen.
 *
 * `crop` is the part worth keeping in a narrow box (a phone): that
 * region alone is shown, larger, instead of the whole screen shrunk down.
 */
export function Stage({
  w,
  h,
  pad = 0.05,
  crop,
  children,
}: {
  w: number
  h: number
  pad?: number
  crop?: [number, number, number, number]
  children: ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [fit, setFit] = useState({ k: 0, narrow: false })

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const W = el.clientWidth
      const H = el.clientHeight
      if (!W || !H) return
      const narrow = !!crop && W < 560
      const bw = narrow ? crop![2] : w
      const bh = narrow ? crop![3] : h
      setFit({ k: Math.min(1, (W * (1 - pad * 2)) / bw, (H * (1 - pad * 2)) / bh), narrow })
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [w, h, pad, crop])

  const { k, narrow } = fit
  const style = { transform: `translate(-50%, -50%) scale(${k})`, visibility: k ? 'visible' : 'hidden' } as const

  return (
    <div className="stage" ref={ref}>
      {narrow && crop ? (
        <div className="stage__inner stage__inner--crop" style={{ width: crop[2], height: crop[3], ...style }}>
          <div className="stage__shift" style={{ width: w, height: h, left: -crop[0], top: -crop[1] }}>
            {children}
          </div>
        </div>
      ) : (
        <div className="stage__inner" style={{ width: w, height: h, ...style }}>
          {children}
        </div>
      )}
    </div>
  )
}

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Steps a mockup through its story while it is on screen: 0, 1, 2 … last,
 * holding each for its duration, then starting over. Off screen (and for
 * reduced motion) it rests on the last, complete step.
 */
export function useSteps(durations: number[], active: boolean) {
  const last = durations.length - 1
  const [step, setStep] = useState(last)

  useEffect(() => {
    if (!active || reduced()) {
      setStep(last)
      return
    }
    let i = 0
    let t = 0
    setStep(0)
    const next = () => {
      t = window.setTimeout(() => {
        i = i >= last ? 0 : i + 1
        setStep(i)
        next()
      }, durations[i])
    }
    next()
    return () => window.clearTimeout(t)
    // durations is a constant array per mockup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, last])

  return step
}

export const cx = (...c: (string | false | undefined)[]) => c.filter(Boolean).join(' ')

/** `on(n)` → true once the story has reached step n. */
export const at = (step: number) => (n: number) => step >= n
