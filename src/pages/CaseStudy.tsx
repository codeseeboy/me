import type { CSSProperties } from 'react'
import { Link } from '../router'
import useSeen from '../hooks/useSeen'
import Showcase from '../components/show/Showcase'
import { CoverContent, CaseTitle } from '../components/CaseStack'
import { Hashtags, MetaBand, Row, Visual } from '../components/Story'
import { ArrowRight, ExternalArrow } from '../components/Icons'
import { CASES, caseBySlug, caseHref } from '../data/work'
import NotFound from './NotFound'

export default function CaseStudy({ slug }: { slug: string }) {
  const c = caseBySlug(slug)
  const [coverRef, coverSeen] = useSeen<HTMLElement>(0.05, 400)
  const [nextRef, nextSeen] = useSeen<HTMLElement>(0.2)

  if (!c) return <NotFound />
  // A product with its own page: App sends the visitor there.
  if (c.to) return null

  const next = CASES[(CASES.indexOf(c) + 1) % CASES.length]

  return (
    <article className="case-page" style={{ '--accent': c.accent } as CSSProperties}>
      {/* ---- Cover: the same composition as the gallery panel, without the frame ---- */}
      <section ref={coverRef} className={`case-hero${coverSeen ? ' is-seen' : ''}`} data-layout="split">
        <div className="case-cover">
          <CoverContent c={c} as="h1" button={false} />
          <div className="case-media" aria-hidden="true">
            <Showcase kind={c.media} live={coverSeen} />
          </div>
        </div>
      </section>

      {/* ---- The facts, on black ---- */}
      <MetaBand items={c.meta}>
        <p>
          <strong>{c.brand}</strong> {c.intro}
        </p>
      </MetaBand>

      {/* ---- The story ---- */}
      <div className="rows">
        {c.story.map((s, i) => (
          <Row key={s.kicker} kicker={s.kicker} aside={s.visual ? <Visual v={s.visual} /> : undefined} id={`s${i + 1}`}>
            {s.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </Row>
        ))}

        <Row kicker="Built with">
          <Hashtags items={c.stack} />
        </Row>

        <Row kicker={c.links.length ? 'See it' : 'The code is private — happy to walk you through it'}>
          <div className="pills">
            {c.links.map((l) => (
              <a className="pill" key={l.href} href={l.href} target="_blank" rel="noreferrer noopener">
                {l.label} <ExternalArrow />
              </a>
            ))}
            <Link className="pill pill--ghost" to="/contact">
              Ask me about it <ArrowRight />
            </Link>
          </div>
        </Row>
      </div>

      {/* ---- Next case ---- */}
      <section ref={nextRef} className={`next${nextSeen ? ' is-seen' : ''}`} style={{ '--accent': next.accent } as CSSProperties}>
        <Link className="next__link" to={caseHref(next)}>
          <span className="next__label">Next case · {next.num}</span>
          <span className="case-brand">{next.brand}</span>
          <CaseTitle c={next} />
          <span className="pill">
            {next.to ? 'See the product' : 'Deep dive'} <ArrowRight />
          </span>
        </Link>
      </section>
    </article>
  )
}
