import { Link } from '../router'
import useSeen from '../hooks/useSeen'
import { PageCover } from '../components/Story'
import { CAPABILITIES } from '../data/profile'
import { caseBySlug, caseHref } from '../data/work'

/**
 * One belt per capability group, alternating direction. The words are the
 * résumé's own skill lists, set as posters; the list underneath carries
 * the same information in a form that can be read at rest.
 */
function Belts() {
  return (
    <section className="belts" aria-hidden="true">
      {CAPABILITIES.map((g, i) => {
        const run = [...g.items, ...g.items]
        return (
          <div className={`belt${i % 2 ? ' belt--rev' : ''}${i % 2 ? ' belt--outline' : ''}`} key={g.id}>
            <div className="belt__track" style={{ ['--dur' as string]: `${38 + i * 6}s` }}>
              {[0, 1].map((copy) => (
                <span className="belt__run" key={copy}>
                  {run.map((w, j) => (
                    <span className="belt__word" key={`${copy}-${j}`}>
                      {w}
                      <i>✦</i>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

function Proof({ name }: { name: string }) {
  const c = caseBySlug(name)
  if (c) {
    return (
      <Link className="proof" to={caseHref(c)}>
        {c.brand}
      </Link>
    )
  }
  return <span className="proof proof--plain">{name}</span>
}

export default function Skills() {
  const [ref, seen] = useSeen<HTMLElement>(0.1)
  const total = CAPABILITIES.reduce((n, g) => n + g.items.length, 0)

  return (
    <>
      <PageCover
        kicker={`${CAPABILITIES.length} groups · ${total} skills`}
        title="Skills"
        lede="From the model itself to the layer around it and the services underneath — grouped the way the work is actually divided."
        tags={CAPABILITIES.map((g) => `#${g.title.replace(/\s+&\s+|\s+/g, '-')}`)}
      />

      <Belts />

      <section ref={ref} className={`capmap${seen ? ' is-seen' : ''}`} aria-label="Skills by group">
        {CAPABILITIES.map((g, i) => (
          <article className="capcard" id={g.id} key={g.id} style={{ ['--k' as string]: i }}>
            <span className="capcard__n">{String(i + 1).padStart(2, '0')}</span>
            <h2 className="capcard__title">{g.title}</h2>
            <p className="capcard__summary">{g.summary}</p>
            <ul className="capcard__items">
              {g.items.map((it) => (
                <li key={it}>{it}</li>
              ))}
            </ul>
            <div className="capcard__proof">
              <span>Used in</span>
              {g.proof.map((p) => (
                <Proof key={p} name={p} />
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
