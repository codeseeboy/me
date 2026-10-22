import { useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Link } from '../../router'
import useSeen from '../../hooks/useSeen'
import SplitText from '../SplitText'
import { ArrowRight } from '../Icons'
import Showcase, { type ShowKind } from '../show/Showcase'
import { Frame } from '../CaseStack'
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

/** A white photo studio: soft top light, and a glossy floor that reflects what stands on it. */
export function Studio({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`pp-studio ${className}`.trim()}>{children}</div>
}

/** The cover, framed like a gallery panel: the product running on the left, what it is on the right. */
export function ProductCover({
  label,
  brand,
  title,
  what,
  tags,
  kind,
  product,
  film,
}: {
  label: string
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
    <section ref={ref} className={`panel pp-cover${seen ? ' is-seen' : ''}`}>
      <Frame label={label}>
        <div className="pp-cover__grid">
          <Studio className="pp-cover__studio case-media">
            <Showcase kind={kind} live={seen} />
          </Studio>
          <div className="case-cover__content pp-cover__content">
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
        </div>
      </Frame>
    </section>
  )
}

export interface Moment {
  a: string
  b: string
  /** Set in red: the part that is the reader's own burden or gain. */
  hot?: boolean
}

/** One idea told in big editorial lines: a numbered list set like a contents page. */
export function Moments({ kicker, title, lead, items }: { kicker: string; title: [string, string]; lead?: string; items: Moment[] }) {
  const [ref, seen] = useSeen<HTMLElement>(0.15)
  return (
    <section ref={ref} className={`pp-moments${seen ? ' is-seen' : ''}`}>
      <header className="pp-moments__head">
        <span className="pp-kicker">{kicker}</span>
        <h2 className="pp-h2">
          {title[0]} <em>{title[1]}</em>
        </h2>
        {lead && <p className="pp-moments__lead">{lead}</p>}
      </header>
      <ol className="pp-moments__list">
        {items.map((m, i) => (
          <li key={m.a} style={{ ['--k' as string]: i }}>
            <span className="pp-moments__n">{String(i + 1).padStart(2, '0')}</span>
            <span className="pp-moments__a">{m.a}</span>
            <span className={`pp-moments__b${m.hot ? ' is-hot' : ''}`}>{m.b}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export interface Feature {
  kicker: string
  title: [string, string]
  text: string
  facts?: { k: string; v: string }[]
  scene: ReactNode
  link?: { to: string; label: string }
}

/** One feature per framed panel; on a tall screen the panels stack like the gallery. */
function FeaturePanel({ f, i }: { f: Feature; i: number }) {
  const [ref, seen] = useSeen<HTMLElement>(0.2)
  return (
    <section ref={ref} className={`panel panel--stick pp-feature${seen ? ' is-seen' : ''}`}>
      <Frame label={`Feature ${String(i + 1).padStart(2, '0')}`}>
        <div className="pp-feature__grid">
          <div className="pp-feature__text">
            <span className="pp-kicker">{f.kicker}</span>
            <h3 className="pp-feature__h">
              {f.title[0]} <em>{f.title[1]}</em>
            </h3>
            <p className="pp-feature__p">{f.text}</p>
            {f.facts && (
              <dl className="pp-feature__facts">
                {f.facts.map((x) => (
                  <div key={x.k}>
                    <dt>{x.k}</dt>
                    <dd>{x.v}</dd>
                  </div>
                ))}
              </dl>
            )}
            {f.link && (
              <Link className="pill" to={f.link.to}>
                {f.link.label} <ArrowRight />
              </Link>
            )}
          </div>
          <Studio className="pp-feature__scene">{f.scene}</Studio>
        </div>
      </Frame>
    </section>
  )
}

export function Features({ items }: { items: Feature[] }) {
  return (
    <div className="panels pp-features">
      {items.map((f, i) => (
        <FeaturePanel key={f.kicker} f={f} i={i} />
      ))}
    </div>
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
