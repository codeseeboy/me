import type { CSSProperties } from 'react'
import useSeen from '../hooks/useSeen'
import { Frame } from '../components/CaseStack'
import { PageCover } from '../components/Story'
import Education from '../components/Education'
import { ROLES, isoMonth, monthLabel, rangeLabel, spanLabel, type Role } from '../data/profile'

/* ---------------------------------------------------------------- *
 * The timeline — the whole career on one axis, before any detail.
 * ---------------------------------------------------------------- */

const AXIS_FROM = 2024
const AXIS_TO = 2027 // exclusive: the axis ends at the start of 2027

const at = (mmYYYY: string) => {
  const [m, y] = mmYYYY.split('/').map(Number)
  return ((y - AXIS_FROM) * 12 + (m - 1)) / ((AXIS_TO - AXIS_FROM) * 12)
}

const now = () => {
  const d = new Date()
  return `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`
}

interface Lane {
  label: string
  sub: string
  from: string
  to?: string
}

/** Work only — education has its own place, on the About page. */
const LANES: Lane[] = ROLES.map((r) => ({ label: r.company, sub: r.title, from: r.from, to: r.to }))

function Timeline() {
  const [ref, seen] = useSeen<HTMLElement>(0.2)
  const today = at(now())
  const years = Array.from({ length: AXIS_TO - AXIS_FROM }, (_, i) => AXIS_FROM + i)

  return (
    <section
      ref={ref}
      className={`tl${seen ? ' is-seen' : ''}`}
      aria-label="Career timeline"
      style={{ ['--years' as string]: years.length }}
    >
      <div className="tl__axis" aria-hidden="true">
        <span className="tl__label-col" />
        <div className="tl__years">
          {years.map((y) => (
            <span key={y}>{y}</span>
          ))}
        </div>
      </div>

      <ol className="tl__lanes">
        {LANES.map((l, i) => {
          const a = at(l.from)
          const b = l.to ? at(l.to) + 1 / ((AXIS_TO - AXIS_FROM) * 12) : today
          return (
            <li className="tl__lane" key={l.label} style={{ ['--k' as string]: i }}>
              <span className="tl__name">
                <strong>{l.label}</strong>
                <small>{l.sub}</small>
              </span>
              <span className="tl__track">
                <span
                  className={`tl__bar${l.to ? '' : ' tl__bar--live'}`}
                  style={{ left: `${a * 100}%`, width: `${Math.max(0.012, b - a) * 100}%` }}
                />
              </span>
              <span className="sr-only">{l.to ? rangeLabel(l.from, l.to) : `${rangeLabel(l.from)}`}</span>
            </li>
          )
        })}
      </ol>

      <div className="tl__now" aria-hidden="true">
        <span className="tl__label-col" />
        <div className="tl__nowtrack">
          <span style={{ left: `${today * 100}%` }}>Now</span>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- *
 * One framed panel per role.
 * ---------------------------------------------------------------- */

/** The role as a poster: when, for how long, and what kind of work — nothing about the employer's systems. */
function RolePoster({ r }: { r: Role }) {
  const [m, y] = monthLabel(r.from).split(' ')
  return (
    <div className="role-poster">
      <span className="role-poster__k">{r.employment}</span>
      <span className="role-poster__year">{y}</span>
      <span className="role-poster__span">
        {m} — {r.to ? monthLabel(r.to) : 'Now'} · {spanLabel(r.from, r.to)}
      </span>
      <span className="role-poster__note">{r.note}</span>
    </div>
  )
}

function RolePanel({ r, i }: { r: Role; i: number }) {
  const [ref, seen] = useSeen<HTMLElement>(0.25)

  return (
    <section
      ref={ref}
      className={`panel panel--stick${seen ? ' is-seen' : ''}`}
      aria-labelledby={`role-${r.slug}`}
      style={{ '--accent': r.accent } as CSSProperties}
    >
      <Frame label={`Role ${String(i + 1).padStart(2, '0')}`} className="panel__frame">
        <div className="role">
          <div className="role__text case-cover__content">
            <span className="role__when" style={{ ['--k' as string]: 0 }}>
              <time dateTime={isoMonth(r.from)}>{rangeLabel(r.from, r.to)}</time>
              <i>·</i>
              {spanLabel(r.from, r.to)}
              {!r.to && <em className="role__live">Now</em>}
            </span>

            <h2 className="role__co" id={`role-${r.slug}`} style={{ ['--k' as string]: 1 }}>
              {r.company}
            </h2>

            <p className="role__title" style={{ ['--k' as string]: 2 }}>
              {r.title} · {r.place}
            </p>

            <ul className="role__points" style={{ ['--k' as string]: 3 }}>
              {r.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>

            <p className="case-tags role__tags" style={{ ['--k' as string]: 4 }}>
              {r.stack.map((s) => (
                <span key={s}>#{s.replace(/\s+/g, '-')}</span>
              ))}
            </p>
          </div>

          <div className="case-media role__media" aria-hidden="true">
            <RolePoster r={r} />
          </div>
        </div>
      </Frame>
    </section>
  )
}

export default function Experience() {
  return (
    <>
      <PageCover
        kicker="Career"
        title="Experience"
        lede="Three roles, from serverless backends to multimodal generation. Employer systems stay private — my own products are on the Work page."
        tags={['#AI-Engineering', '#Computer-Vision', '#Backend']}
      />

      <header className="chapter chapter--dark">
        <span className="chapter__k">Chapter 01</span>
        <h2 className="chapter__title">Work</h2>
      </header>

      <Timeline />

      <div className="panels">
        {ROLES.map((r, i) => (
          <RolePanel key={r.slug} r={r} i={i} />
        ))}
      </div>

      <Education />
    </>
  )
}
