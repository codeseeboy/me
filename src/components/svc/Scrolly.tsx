import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Stage } from '../show/Stage'
import './scrolly.css'

/** A box drawn on the product, in its design pixels, saying where to look. */
export interface Focus {
  x: number
  y: number
  w: number
  h: number
  label: string
  /** Put the label under the box instead of over it. */
  below?: boolean
  /** Line the label up with the box's right edge (for boxes near the right). */
  end?: boolean
}

export interface ScrollyStep {
  /** Small label above the heading. */
  k: string
  h: string
  p: string
  /** Which step of the mockup this text shows. */
  at: number
  focus?: Focus[]
}

/** Boxes outside the phone-sized crop are hidden on phones (see scrolly.css). */
function Highlights({ boxes, crop }: { boxes: Focus[]; crop?: [number, number, number, number] }) {
  const outside = (f: Focus) => !!crop && (f.x < crop[0] || f.x + f.w > crop[0] + crop[2])
  return (
    <>
      {boxes.map((f) => (
        <span
          key={f.label}
          data-out={outside(f) ? '' : undefined}
          className={`sc-focus${f.below ? ' sc-focus--below' : ''}${f.end ? ' sc-focus--end' : ''}`}
          style={{ left: f.x, top: f.y, width: f.w, height: f.h }}
        >
          <b>{f.label}</b>
        </span>
      ))}
    </>
  )
}

/**
 * "How it works", told by scrolling: the product stays pinned beside the
 * text, and each paragraph that reaches the middle of the screen moves the
 * product to that moment. On a phone the product pins above the text.
 */
export default function Scrolly({
  steps,
  w,
  h,
  crop,
  render,
}: {
  steps: ScrollyStep[]
  w: number
  h: number
  crop?: [number, number, number, number]
  render: (step: number) => ReactNode
}) {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLElement | null)[]>([])

  useEffect(() => {
    const narrow = window.matchMedia('(max-width: 900px)').matches
    // On a phone the product covers the top half, so "the middle" is lower.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
      },
      { rootMargin: narrow ? '-62% 0px -30% 0px' : '-45% 0px -45% 0px' },
    )
    for (const el of refs.current) if (el) io.observe(el)
    return () => io.disconnect()
  }, [steps.length])

  return (
    <div className="scrolly">
      <div className="scrolly__stage">
        <div className="scrolly__box" aria-hidden="true">
          <Stage w={w} h={h} crop={crop} pad={0.05}>
            {render(steps[active].at)}
            {steps[active].focus && <Highlights key={active} boxes={steps[active].focus!} crop={crop} />}
          </Stage>
        </div>
        <ol className="scrolly__dots" aria-hidden="true">
          {steps.map((s, i) => (
            <li key={s.h} className={i === active ? 'is-on' : i < active ? 'is-done' : undefined} />
          ))}
        </ol>
      </div>
      <div className="scrolly__steps">
        {steps.map((s, i) => (
          <article
            key={s.h}
            ref={(el) => {
              refs.current[i] = el
            }}
            data-i={i}
            className={`scrolly__step${i === active ? ' is-on' : ''}`}
          >
            <span className="scrolly__k">
              {String(i + 1).padStart(2, '0')} · {s.k}
            </span>
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </article>
        ))}
      </div>
    </div>
  )
}
