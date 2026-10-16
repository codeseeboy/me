import type { ReactNode } from 'react'
import useSeen from '../hooks/useSeen'
import SplitText from './SplitText'
import type { StoryVisual } from '../data/work'

/**
 * The building blocks of the reference's case pages, reused by every inner
 * page: a cover, a black band of facts, and story rows — a red kicker, a
 * paragraph, and a picture on the right when there is one worth drawing.
 */

export function PageCover({
  kicker,
  title,
  tags,
  lede,
  editorial,
}: {
  kicker: string
  title: string
  tags?: string[]
  lede?: ReactNode
  editorial?: boolean
}) {
  const [ref, seen] = useSeen<HTMLElement>(0.1, 600)
  return (
    <section ref={ref} className={`page-cover${seen ? ' is-seen' : ''}`}>
      <div className="case-cover__content">
        <span className="case-brand" style={{ ['--k' as string]: 0 }}>
          {kicker}
        </span>
        <h1 className={`case-title ${editorial ? 'case-title--editorial' : 'case-title--display'} page-cover__title no-hinge`}>
          <span className="case-title-line">
            <SplitText text={title} />
          </span>
        </h1>
        {lede && (
          <p className="case-what" style={{ ['--k' as string]: 2 }}>
            {lede}
          </p>
        )}
        {tags && tags.length > 0 && (
          <p className="case-tags" style={{ ['--k' as string]: 3 }}>
            {tags.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </p>
        )}
      </div>
    </section>
  )
}

export function MetaBand({ items, children }: { items: { k: string; v: ReactNode }[]; children?: ReactNode }) {
  return (
    <section className="band">
      <dl className="band__meta">
        {items.map((m) => (
          <div className="band__cell" key={m.k}>
            <dt>{m.k}</dt>
            <dd>{m.v}</dd>
          </div>
        ))}
      </dl>
      {children && <div className="band__intro">{children}</div>}
    </section>
  )
}

export function Row({
  kicker,
  title,
  children,
  aside,
  id,
}: {
  kicker: ReactNode
  title?: ReactNode
  children: ReactNode
  aside?: ReactNode
  id?: string
}) {
  const [ref, seen] = useSeen<HTMLElement>(0.18)
  return (
    <section ref={ref} id={id} className={`row${seen ? ' is-seen' : ''}${aside ? '' : ' row--solo'}`}>
      <div className="row__text">
        <h2 className="row__kicker">{kicker}</h2>
        {title && <h3 className="row__title">{title}</h3>}
        <div className="row__body">{children}</div>
      </div>
      {aside && <div className="row__aside">{aside}</div>}
    </section>
  )
}

/** Diagrams for the right-hand column. Each one restates the row's facts as a shape. */
export function Visual({ v }: { v: StoryVisual }) {
  if (v.kind === 'flow' && v.items) {
    return (
      <ol className="viz-flow" aria-label="Pipeline">
        {v.items.map((s, i) => (
          <li key={s.k} style={{ ['--k' as string]: i }}>
            <span className="viz-flow__n">{String(i + 1).padStart(2, '0')}</span>
            <span className="viz-flow__k">{s.k}</span>
          </li>
        ))}
      </ol>
    )
  }

  if (v.kind === 'layers' && v.layers) {
    return (
      <div className="viz-layers">
        {v.layers.map((l, i) => (
          <div className="viz-layers__tier" key={l.label} style={{ ['--k' as string]: i }}>
            <span className="viz-layers__label">{l.label}</span>
            <div className="viz-layers__nodes">
              {l.nodes.map((n) => (
                <span key={n}>{n}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (v.kind === 'metrics' && v.items) {
    return (
      <dl className="viz-metrics">
        {v.items.map((m, i) => (
          <div key={m.k + i} style={{ ['--k' as string]: i }}>
            <dt>{m.v}</dt>
            <dd>{m.k}</dd>
          </div>
        ))}
      </dl>
    )
  }

  if (v.kind === 'list' && v.items) {
    return (
      <dl className="viz-list">
        {v.items.map((m, i) => (
          <div key={m.k} style={{ ['--k' as string]: i }}>
            <dt>{m.k}</dt>
            <dd>{m.v}</dd>
          </div>
        ))}
      </dl>
    )
  }

  if (v.kind === 'quote' && v.text) {
    return <p className="viz-quote">{v.text}</p>
  }

  return null
}

/** Hashtag line, the reference's way of listing tags. */
export function Hashtags({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <p className={`hashtags ${className}`.trim()}>
      {items.map((s) => (
        <span key={s}>#{s.replace(/\s+/g, '-')}</span>
      ))}
    </p>
  )
}
