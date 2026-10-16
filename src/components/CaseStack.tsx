import type { CSSProperties, ReactNode } from 'react'
import { Link } from '../router'
import useSeen from '../hooks/useSeen'
import Showcase from './show/Showcase'
import { ArrowRight } from './Icons'
import SplitText from './SplitText'
import { CASES, caseHref, type CaseStudy } from '../data/work'

/** The double frame, the CASE label and the centre ticks — shared by every panel. */
export function Frame({ label, children, className = '' }: { label: string; children: ReactNode; className?: string }) {
  return (
    <div className={`case-frame ${className}`.trim()}>
      <span className="case-label" aria-hidden="true">
        {label}
      </span>
      <span className="tick tick--top" aria-hidden="true" />
      <span className="tick tick--left" aria-hidden="true" />
      <span className="tick tick--right" aria-hidden="true" />
      <div className="case-inner">{children}</div>
    </div>
  )
}

/** Title as the reference sets it: editorial serif with an italic second line, or poster type. */
export function CaseTitle({ c, as: Tag = 'h2', id }: { c: CaseStudy; as?: 'h1' | 'h2'; id?: string }) {
  if (c.titleStyle === 'editorial') {
    return (
      <Tag className="case-title case-title--editorial" id={id}>
        <span className="case-title-line">
          <SplitText text={c.title[0]} />
        </span>{' '}
        <span className="case-title-line case-title-line--italic">
          <SplitText text={c.title[1]} offset={c.title[0].length} />
        </span>
      </Tag>
    )
  }
  let offset = 0
  return (
    <Tag className="case-title case-title--display" id={id}>
      {c.title.map((l) => {
        const line = (
          <span className="case-title-line" key={l}>
            <SplitText text={l} offset={offset} />
          </span>
        )
        offset += l.length
        return line
      })}
    </Tag>
  )
}

/**
 * The cover content: wordmark, title, tags, the way in — and, on the case
 * page, one line saying what it is. The gallery panels stay sparse, as in
 * the reference.
 */
export function CoverContent({
  c,
  as = 'h2',
  id,
  button = true,
  line = true,
}: {
  c: CaseStudy
  as?: 'h1' | 'h2'
  id?: string
  button?: boolean
  line?: boolean
}) {
  return (
    <div className="case-cover__content">
      <span className="case-brand" style={{ ['--k' as string]: 0 }}>
        {c.brand}
      </span>
      <div className="no-hinge">
        <CaseTitle c={c} as={as} id={id} />
      </div>
      {line && (
        <p className="case-what" style={{ ['--k' as string]: 2 }}>
          {c.what}
        </p>
      )}
      <p className="case-tags" style={{ ['--k' as string]: 3 }}>
        {c.tags.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </p>
      {button && (
        <Link className="pill" to={caseHref(c)} style={{ ['--k' as string]: 4 }}>
          {c.to ? 'See the product' : 'Deep dive'} <ArrowRight />
        </Link>
      )}
    </div>
  )
}

function CasePanel({ c }: { c: CaseStudy }) {
  const [ref, seen] = useSeen<HTMLElement>(0.3)

  return (
    <section
      ref={ref}
      className={`case-section${seen ? ' is-seen' : ''}`}
      data-layout="split"
      aria-labelledby={`case-${c.slug}`}
      style={{ '--accent': c.accent } as CSSProperties}
    >
      <Frame label={`Case ${c.num}`}>
        <div className="case-cover">
          <CoverContent c={c} id={`case-${c.slug}`} line={false} />
          <div className="case-media" aria-hidden="true">
            <Showcase kind={c.media} live={seen} />
          </div>
        </div>
      </Frame>
    </section>
  )
}

export default function CaseStack() {
  return (
    <div className="case-stack" id="work">
      <h2 className="sr-only">Selected work</h2>
      {CASES.map((c) => (
        <CasePanel key={c.slug} c={c} />
      ))}
    </div>
  )
}
