import { Link } from '../router'
import useSeen from '../hooks/useSeen'
import { Row } from '../components/Story'
import { ArrowRight, R_PATH, S_PATH } from '../components/Icons'
import { AWARDS, LEADERSHIP, PRINCIPLES, PROFILE } from '../data/profile'

/** The photo, cut into the SR mark — the reference does the same with its photos. */
function Mark() {
  return (
    <svg className="about-mark" viewBox="0 0 48 40" role="img" aria-label="Photo of Shashikant inside the SR monogram">
      <defs>
        <clipPath id="sr-s">
          <path d={S_PATH} />
        </clipPath>
        <clipPath id="sr-r">
          <path d={R_PATH} clipRule="evenodd" />
        </clipPath>
      </defs>
      {/* The whole figure in the S, a close crop of the shirt and laptop in the R. */}
      <g clipPath="url(#sr-s)">
        <rect width="48" height="40" fill="#111" />
        <image href="/characters/hero2.webp" x="-3.7" y="1" width="35" height="52.5" preserveAspectRatio="xMidYMin meet" />
      </g>
      <g clipPath="url(#sr-r)">
        <rect width="48" height="40" fill="#111" />
        <image href="/characters/hero2.webp" x="10" y="-15" width="50" height="75" preserveAspectRatio="xMidYMin meet" />
      </g>
    </svg>
  )
}

/** Recognition, set as posters on black. */
function Awards() {
  const [ref, seen] = useSeen<HTMLElement>(0.15)
  return (
    <section ref={ref} className={`posters${seen ? ' is-seen' : ''}`} aria-labelledby="awards-title">
      <h2 className="posters__k" id="awards-title">
        Recognition
      </h2>
      <ol className="posters__list">
        {AWARDS.map((a, i) => (
          <li className="poster" key={a.title} style={{ ['--k' as string]: i }}>
            <span className="poster__rank">{a.rank}</span>
            <span className="poster__body">
              <strong>{a.title}</strong>
              <small>
                {a.org} · {a.when}
              </small>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

/** Teaching and leading, as three framed cards. */
function Leading() {
  const [ref, seen] = useSeen<HTMLElement>(0.15)
  return (
    <section ref={ref} className={`leads${seen ? ' is-seen' : ''}`} aria-labelledby="lead-title">
      <div className="case-cover__content leads__head">
        <span className="case-brand" style={{ ['--k' as string]: 0 }}>
          Outside the day job
        </span>
        <h2 className="case-title case-title--display" id="lead-title" style={{ ['--k' as string]: 1 }}>
          <span className="case-title-line">Teaching &amp; Leading</span>
        </h2>
      </div>
      <div className="leads__grid">
        {LEADERSHIP.map((l, i) => (
          <article className="lead" key={l.org} style={{ ['--k' as string]: i }}>
            <span className="lead__when">{l.when}</span>
            <h3 className="lead__role">{l.role}</h3>
            <p className="lead__org">{l.org}</p>
            {l.note && <p className="lead__note">{l.note}</p>}
          </article>
        ))}
      </div>
    </section>
  )
}

export default function About() {
  const [ref, seen] = useSeen<HTMLElement>(0.1, 500)

  return (
    <>
      <section ref={ref} className={`about-intro${seen ? ' is-seen' : ''}`} aria-labelledby="about-title">
        <Mark />
        <div className="about-intro__text">
          <h1 className="sr-only" id="about-title">
            About {PROFILE.name}
          </h1>
          <p>
            I’m Shashikant, an AI engineer in Mumbai. I build AI that runs where the data lives — fully offline
            assistants, agents that work inside your own tools, and native software that respects the machine it runs on.
          </p>
          <p>
            My own products are NON8, an offline AI appliance; Privacy Guardian, which locks a Windows laptop from a phone;
            Mediator, which turns an AI chat into a coding agent; and DesktopCompanion, a 5 MB desktop layer in Rust. I’m an
            AI engineer intern alongside my final year of a B.Tech in AI &amp; ML, with a CGPA of 9.8.
          </p>
        </div>
      </section>

      <Awards />

      <div className="rows">
        {PRINCIPLES.map((p) => (
          <Row
            key={p.title}
            kicker={p.title}
            aside={
              <Link className="evidence" to={`/work/${p.evidenceSlug}`}>
                <span className="evidence__k">Where it shows</span>
                <span className="evidence__v">{p.evidence}</span>
                <ArrowRight />
              </Link>
            }
          >
            <p>{p.body}</p>
          </Row>
        ))}
      </div>

      <Leading />

      <div className="rows">
        <Row kicker="What I’m looking for">
          <p>
            AI engineering where the model has to survive contact with production — LLM systems, multimodal generation,
            retrieval and the backends underneath them. Available for full-time roles from mid-2027, and open to
            contract work before then.
          </p>
          <div className="pills">
            <Link className="pill" to="/contact">
              Get in touch <ArrowRight />
            </Link>
            <Link className="pill pill--ghost" to="/experience">
              Experience
            </Link>
            <Link className="pill pill--ghost" to="/skills">
              Skills
            </Link>
            <Link className="pill pill--ghost" to="/resume">
              Résumé
            </Link>
          </div>
        </Row>
      </div>
    </>
  )
}
