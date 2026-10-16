import { PageCover } from '../components/Story'
import { ArrowRight } from '../components/Icons'
import { Link } from '../router'
import { AWARDS, CAPABILITIES, EDUCATION, LEADERSHIP, PROFILE, ROLES, rangeLabel } from '../data/profile'
import { CASES } from '../data/work'

/**
 * The CV, generated from the same data as the rest of the site and laid out
 * in the same order as the PDF résumé. "Print / Save as PDF" produces the
 * document; the print stylesheet strips the site around it.
 */
export default function Resume() {
  return (
    <>
      <div className="no-print">
        <PageCover
          kicker="Two pages"
          title="Résumé"
          lede="The same content as the PDF, kept in sync with this site. Print it, or save it as a PDF."
        />
        <div className="pills pills--center">
          <button className="pill" type="button" onClick={() => window.print()}>
            Print / Save as PDF <ArrowRight />
          </button>
          <a className="pill pill--ghost" href={`mailto:${PROFILE.email}`}>
            Email me
          </a>
        </div>
      </div>

      <article className="cv" aria-label="Curriculum vitae">
        <header className="cv__head">
          <h2 className="cv__name">{PROFILE.name}</h2>
          <p className="cv__role">
            {PROFILE.role} · {PROFILE.headline.join(' · ')}
          </p>
          <p className="cv__contact">
            <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
            <a href={PROFILE.linkedin}>linkedin.com/in/{PROFILE.linkedinHandle}</a>
            <a href={PROFILE.github}>github.com/{PROFILE.githubHandle}</a>
            <span>{PROFILE.location}</span>
          </p>
        </header>

        <section className="cv__sec">
          <h3 className="cv__k">Summary</h3>
          <p className="cv__p">
            {PROFILE.summary} {PROFILE.scope}
          </p>
        </section>

        <section className="cv__sec">
          <h3 className="cv__k">Professional experience</h3>
          {ROLES.map((r) => (
            <div className="cv__item" key={r.slug}>
              <div className="cv__line">
                <strong>{r.company}</strong>
                <span>{rangeLabel(r.from, r.to)}</span>
              </div>
              <div className="cv__line cv__line--sub">
                <em>{r.title}</em>
                <span>{r.place}</span>
              </div>
              <ul>
                {r.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="cv__sec">
          <h3 className="cv__k">Technical skills</h3>
          <dl className="cv__skills">
            {CAPABILITIES.map((g) => (
              <div key={g.id}>
                <dt>{g.title}</dt>
                <dd>{g.items.join(', ')}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="cv__sec">
          <h3 className="cv__k">Projects</h3>
          {CASES.map((c) => (
            <div className="cv__item" key={c.slug}>
              <div className="cv__line">
                <strong>
                  {c.brand} — {c.title.join(' ')}
                </strong>
                <span>{c.meta[0]?.v ?? 'Own product'}</span>
              </div>
              <p className="cv__sub">Tech: {c.stack.join(', ')}</p>
              <p className="cv__p">{c.what}</p>
            </div>
          ))}
        </section>

        <section className="cv__sec">
          <h3 className="cv__k">Achievements &amp; leadership</h3>
          <ul>
            {AWARDS.map((a) => (
              <li key={a.title}>
                {a.rank} — {a.title}, {a.org} ({a.when})
              </li>
            ))}
            {LEADERSHIP.map((l) => (
              <li key={l.org}>
                {l.role}, {l.org} ({l.when}){l.note ? ` — ${l.note}` : ''}
              </li>
            ))}
          </ul>
        </section>

        <section className="cv__sec">
          <h3 className="cv__k">Education</h3>
          {EDUCATION.map((e) => (
            <div className="cv__item" key={e.school}>
              <div className="cv__line">
                <strong>{e.school}</strong>
                <span>{e.place}</span>
              </div>
              <div className="cv__line cv__line--sub">
                <em>
                  {e.qualification} · {e.score.label === 'Diploma' ? e.score.value : `CGPA ${e.score.value}/10`}
                </em>
                <span>{e.years}</span>
              </div>
            </div>
          ))}
        </section>
      </article>

      <div className="pills pills--center no-print" style={{ paddingBottom: 96 }}>
        <Link className="pill pill--ghost" to="/">
          See the case studies <ArrowRight />
        </Link>
      </div>
    </>
  )
}
