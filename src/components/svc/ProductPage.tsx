import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from '../../router'
import useSeen from '../../hooks/useSeen'
import SplitText from '../SplitText'
import { ArrowRight } from '../Icons'
import Showcase, { type ShowKind } from '../show/Showcase'
import Scrolly, { type ScrollyStep } from './Scrolly'
import { FilmPlayer, type Chapter } from './Film'
import RequestAccess from './RequestAccess'
import '../../styles/product.css'

/*
 * A product page in the site's own language — the same white cover, black
 * band and story rows as a case study — so moving from the gallery into a
 * product never feels like leaving the site. One idea per section: the
 * product once at the top, how it works once, a few facts, one way to ask.
 */

export interface Film {
  src: string
  poster: string
  chapters: Chapter[]
  duration: number
  title: string
}

/** The film opens over the page on request; it never competes with the page. */
function FilmButton({ film }: { film: Film }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('is-locked')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('is-locked')
    }
  }, [open])

  return (
    <>
      <button type="button" className="pill pill--ghost pp-film-btn" onClick={() => setOpen(true)}>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M5 3.5v9l7.5-4.5z" fill="currentColor" />
        </svg>
        Watch the film · {Math.round(film.duration)} s
      </button>
      {open &&
        createPortal(
          <div className="pp-film" role="dialog" aria-modal="true" aria-label={film.title} onClick={() => setOpen(false)}>
            <div className="pp-film__box" onClick={(e) => e.stopPropagation()}>
              <FilmPlayer {...film} />
            </div>
            <button type="button" className="pp-film__x" onClick={() => setOpen(false)} aria-label="Close the film">
              ×
            </button>
          </div>,
          document.body,
        )}
    </>
  )
}

/** The cover: the product running on the left, what it is on the right. */
export function ProductCover({
  brand,
  title,
  what,
  tags,
  kind,
  product,
  film,
}: {
  brand: string
  title: [string, string]
  what: string
  tags: string[]
  kind: ShowKind
  product: string
  film?: Film
}) {
  const [ref, seen] = useSeen<HTMLElement>(0.05, 400)
  return (
    <section ref={ref} className={`case-hero pp-cover${seen ? ' is-seen' : ''}`} data-layout="split">
      <div className="case-cover">
        <div className="case-cover__content">
          <span className="case-brand" style={{ ['--k' as string]: 0 }}>
            {brand}
          </span>
          <div className="no-hinge">
            <h1 className="case-title case-title--editorial">
              <span className="case-title-line">
                <SplitText text={title[0]} />
              </span>{' '}
              <span className="case-title-line case-title-line--italic">
                <SplitText text={title[1]} offset={title[0].length} />
              </span>
            </h1>
          </div>
          <p className="case-what" style={{ ['--k' as string]: 2 }}>
            {what}
          </p>
          <p className="case-tags" style={{ ['--k' as string]: 3 }}>
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
          <div className="pp-actions" style={{ ['--k' as string]: 4 }}>
            <RequestAccess product={product} tone="pill" />
            {film && <FilmButton film={film} />}
          </div>
        </div>
        <div className="case-media" aria-hidden="true">
          <Showcase kind={kind} live={seen} />
        </div>
      </div>
    </section>
  )
}

/** How it works, told once, by scrolling through the product. */
export function HowItWorks({
  title,
  steps,
  crop,
  render,
}: {
  title: string
  steps: ScrollyStep[]
  crop?: [number, number, number, number]
  render: (step: number) => ReactNode
}) {
  return (
    <section className="pp-how" id="how">
      <header className="pp-head">
        <span className="pp-kicker">How it works</span>
        <h2 className="pp-h2">{title}</h2>
      </header>
      <Scrolly steps={steps} w={880} h={560} crop={crop} render={render} />
    </section>
  )
}

/** Getting started, in three plain steps. */
export function Setup({ title, steps }: { title: string; steps: { h: string; p: string }[] }) {
  const [ref, seen] = useSeen<HTMLElement>(0.25)
  return (
    <section ref={ref} className={`pp-setup${seen ? ' is-seen' : ''}`}>
      <header className="pp-head">
        <span className="pp-kicker">Get started</span>
        <h2 className="pp-h2">{title}</h2>
      </header>
      <ol className="pp-setup__list">
        {steps.map((s, i) => (
          <li key={s.h} style={{ ['--k' as string]: i }}>
            <span className="pp-setup__n">{String(i + 1).padStart(2, '0')}</span>
            <h3>{s.h}</h3>
            <p>{s.p}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** Straight answers, as a quiet list. */
export function ProductFaq({ items }: { items: { q: string; a: string }[] }) {
  return (
    <section className="pp-faq">
      <header className="pp-head pp-head--left">
        <span className="pp-kicker">Straight answers</span>
        <h2 className="pp-h2">Before you ask.</h2>
      </header>
      <div className="pp-faq__list">
        {items.map((f) => (
          <details className="pp-faq__item" key={f.q}>
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

/** The one call to action, on black. */
export function ProductCta({ title, line, product }: { title: string; line: string; product: string }) {
  const [ref, seen] = useSeen<HTMLElement>(0.3)
  return (
    <section ref={ref} className={`pp-cta${seen ? ' is-seen' : ''}`}>
      <h2 className="pp-cta__title">{title}</h2>
      <p className="pp-cta__line">{line}</p>
      <RequestAccess product={product} tone="pill-light" />
    </section>
  )
}

/** The next product, the way a case study points to the next case. */
export function NextProduct({ to, label, brand, title, accent }: { to: string; label: string; brand: string; title: [string, string]; accent: string }) {
  const [ref, seen] = useSeen<HTMLElement>(0.2)
  return (
    <section ref={ref} className={`next${seen ? ' is-seen' : ''}`} style={{ '--accent': accent } as CSSProperties}>
      <Link className="next__link" to={to}>
        <span className="next__label">{label}</span>
        <span className="case-brand">{brand}</span>
        <h2 className="case-title case-title--editorial">
          <span className="case-title-line">{title[0]}</span>{' '}
          <span className="case-title-line case-title-line--italic">{title[1]}</span>
        </h2>
        <span className="pill">
          See the product <ArrowRight />
        </span>
      </Link>
    </section>
  )
}
