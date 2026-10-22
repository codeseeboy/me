import type { MediaKind } from '../../data/work'
import { Stage, at, cx, useSteps } from './Stage'
import { GUARDIAN_STEPS, Guardian, LIVE_STEPS, LiveShow, MEDIATOR_STEPS, MediatorShow } from './Products'
import {
  CAREER_STEPS,
  CLAUSE_STEPS,
  CareerShow,
  ClauseShow,
  FORMULA_STEPS,
  FormulaShow,
  HEALTH_STEPS,
  HealthShow,
  SQL_STEPS,
  SqlShow,
  TRUST_STEPS,
  TrustShow,
} from './More'
import './show.css'

export { GUARDIAN_STEPS, Guardian, LIVE_STEPS, LiveShow, MEDIATOR_STEPS, MediatorShow }

/*
 * One live rendering per product, drawn in that product's own look and
 * stepped through the thing it does. Text is real interface copy from each
 * codebase; document contents and numbers that only illustrate are kept
 * plausible and small.
 */

/* ================================================================== *
 * NON8 — a question about a document, answered offline with citations.
 * ================================================================== */

export const NON8_STEPS = [900, 650, 750, 800, 650, 600, 600, 3600]

export function Non8({ step }: { step: number }) {
  const on = at(step)
  const rows: [number, string, string][] = [
    [1, 'Understanding your question', ''],
    [2, 'Searching your documents', '6 passages'],
    [3, 'Reviewing the most relevant', '3 kept'],
  ]
  return (
    <div className="n8">
      <div className="n8__bar">
        <i />
        <i />
        <i />
        <span className="n8__url">non8 · this appliance</span>
        <span className="n8__off">
          <b /> Offline · 0 bytes out
        </span>
      </div>
      <div className="n8__body">
        <aside className="n8__rail">
          <span className="n8__logo">
            <svg viewBox="0 0 32 16" aria-hidden="true">
              <path d="M8 3a5 5 0 1 0 0 10c3 0 5-5 8-5s5 5 8 5a5 5 0 1 0 0-10c-3 0-5 5-8 5S11 3 8 3z" />
            </svg>
            <span>
              non8
              <small>Local AI</small>
            </span>
          </span>
          {['Ask', 'Library'].map((n, i) => (
            <span className={cx('n8__nav', i === 0 && 'is-on')} key={n}>
              {n}
            </span>
          ))}
          <span className="n8__sec">Administration</span>
          {['Sign-in requests', 'People', 'Roles', 'Activity', 'Machines'].map((n, i) => (
            <span className="n8__nav" key={n}>
              {n}
              {i === 0 && <em>1</em>}
            </span>
          ))}
          <span className="n8__me">
            <i>AD</i> admin
          </span>
        </aside>

        <main className="n8__main">
          <header className="n8__head">Pump maintenance — SOP check</header>
          <div className="n8__log">
            <div className={cx('n8__ask', 'sh', on(0) && 'is-on')}>
              <span className="n8__file">
                <svg viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M4 1.5h5l3.5 3.5v9.5h-8.5z M9 1.5V5h3.5" />
                </svg>
                SOP_Maintenance_v4.pdf <small>38 pages</small>
              </span>
              <p>What must be done before opening the pump casing?</p>
            </div>

            <ol className="n8__think">
              {rows.map(([n, t, d]) => (
                <li key={t} className={cx('sh', on(n) && 'is-on', on(n + 1) && 'is-done')}>
                  <i />
                  {t}
                  {d && <small>{d}</small>}
                </li>
              ))}
            </ol>

            <div className={cx('n8__ans', 'sh', on(4) && 'is-on')}>
              <span className="n8__src">From your documents</span>
              <p className={cx('n8__line', 'sh', on(4) && 'is-on')}>Before opening the casing:</p>
              <p className={cx('n8__line', 'sh', on(4) && 'is-on')}>
                1. Isolate the motor at the MCC and apply your personal lock. <cite>SOP p.12</cite>
              </p>
              <p className={cx('n8__line', 'sh', on(5) && 'is-on')}>
                2. Close suction and discharge valves, then drain the casing. <cite>SOP p.13</cite>
              </p>
              <p className={cx('n8__line', 'sh', on(6) && 'is-on')}>
                3. Confirm zero pressure on the gauge before loosening bolts. <cite>SOP p.14</cite>
              </p>
              <span className={cx('n8__meta', 'sh', on(7) && 'is-on')}>
                2.6 s · Qwen 2.5 14B · on this machine
                <span>Copy · Read aloud · Regenerate</span>
              </span>
            </div>
          </div>
          <div className="n8__input">
            Ask non8 anything about your documents
            <span>
              <i className="n8__mic" />
              <i className="n8__send" />
            </span>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ================================================================== *
 * DesktopCompanion — numbers on the wallpaper; only what changed is redrawn.
 * ================================================================== */

const DESK_VALUES: string[][] = [
  ['22%', '11.0 / 16 GiB', 'Intel UHD', '79% · AC', '265 / 475 GiB'],
  ['18%', '11.0 / 16 GiB', 'Intel UHD', '79% · AC', '265 / 475 GiB'],
  ['18%', '11.2 / 16 GiB', 'Intel UHD', '79% · AC', '265 / 475 GiB'],
  ['26%', '11.2 / 16 GiB', 'Intel UHD', '79% · AC', '265 / 475 GiB'],
  ['26%', '11.2 / 16 GiB', 'Intel UHD', '80% · AC', '265 / 475 GiB'],
  ['21%', '11.2 / 16 GiB', 'Intel UHD', '80% · AC', '265 / 475 GiB'],
]
const DESK_BARS = [
  [22, 69, 0, 79, 56],
  [18, 69, 0, 79, 56],
  [18, 70, 0, 79, 56],
  [26, 70, 0, 79, 56],
  [26, 70, 0, 80, 56],
  [21, 70, 0, 80, 56],
]
const DESK_DIRTY = [0, 0, 1, 0, 3, 0]

export const DESK_STEPS = [1300, 1300, 1300, 1300, 1300, 1300]

export function Desk({ step }: { step: number }) {
  const v = DESK_VALUES[step]
  const bars = DESK_BARS[step]
  const rows = ['CPU', 'Memory', 'GPU', 'Battery', 'Disk']
  return (
    <div className="dk">
      <div className="dk__sky" />
      <div className="dk__ridge dk__ridge--far" />
      <div className="dk__ridge" />
      <div className="dk__icons">
        {['This PC', 'Projects', 'Recycle Bin'].map((n) => (
          <span key={n}>
            <i />
            {n}
          </span>
        ))}
      </div>

      <div className="dk__panel">
        <span className="dk__k">System</span>
        {rows.map((r, i) => (
          <div className={cx('dk__row', step > 0 && DESK_DIRTY[step] === i && 'is-dirty')} key={r + step * 0}>
            <span>{r}</span>
            <b>{v[i]}</b>
            {i !== 2 && (
              <em>
                <i style={{ width: `${bars[i]}%` }} />
              </em>
            )}
          </div>
        ))}
      </div>

      <div className="dk__clock">
        <strong>12:41</strong>
        <span>Thursday, 16 October</span>
      </div>

      <div className="dk__notes">
        <span>
          <b>5.3 MB</b> memory
        </span>
        <span>
          <b>0.16%</b> of one core
        </span>
        <span>
          <b>0</b> wake-ups, screen off
        </span>
      </div>

      <div className="dk__task">
        {[0, 1, 2, 3, 4].map((i) => (
          <i key={i} className={cx(i === 0 && 'is-start')} />
        ))}
      </div>
    </div>
  )
}

/* ================================================================== *
 * UrbanFix AI — a photo in, a category, a department and a fix out.
 * ================================================================== */

export const CIVIC_STEPS = [900, 1300, 900, 900, 900, 3000]

export function Civic({ step }: { step: number }) {
  const on = at(step)
  const stages = ['Reported', 'Assigned', 'In progress', 'Resolved']
  const reached = on(5) ? 4 : on(4) ? 2 : on(3) ? 1 : 0
  return (
    <div className="uf">
      <div className="uf__phone">
        <div className="uf__screen">
          <span className="uf__time">9:41</span>
          <span className="uf__h">Report an issue</span>
          <div className="uf__photo">
            <div className="uf__road" />
            <div className="uf__hole" />
            <span className={cx('uf__scan', on(1) && !on(2) && 'is-on')} />
            <span className={cx('uf__box', 'sh', on(2) && 'is-on')}>
              <em>pothole · 0.94</em>
            </span>
          </div>
          <span className="uf__loc">
            <i /> Station Road, near bus stop
          </span>
          <div className={cx('uf__ai', 'sh', on(3) && 'is-on')}>
            <span className="uf__k">AI check</span>
            <p>
              <b>Roads &amp; potholes</b> → Public Works
            </p>
            <p className="uf__chips">
              <i className="hi">Severity · High</i>
              <i>No duplicate nearby</i>
            </p>
          </div>
          <span className="uf__btn">Submit report</span>
        </div>
      </div>

      <div className={cx('uf__track', 'sh', on(3) && 'is-on')}>
        <span className="uf__k">Status</span>
        <ol>
          {stages.map((s, i) => (
            <li key={s} className={cx(i < reached && 'is-done', i === reached - 1 && 'is-now')}>
              <i />
              {s}
              {i === 3 && <small>with a proof photo</small>}
            </li>
          ))}
        </ol>
        <div className="uf__score">
          <span>
            Router <b>0.32</b>
          </span>
          <span>
            Specialist <b>0.68</b>
          </span>
        </div>
      </div>
    </div>
  )
}

/* ================================================================== *
 * The switch the gallery and the case pages use.
 * ================================================================== */

export type ShowKind = MediaKind | 'live'

export const SIZE: Record<ShowKind, [number, number]> = {
  live: [880, 560],
  non8: [880, 560],
  guardian: [880, 560],
  mediator: [880, 560],
  desk: [880, 560],
  civic: [640, 600],
  clause: [880, 560],
  trust: [880, 560],
  health: [880, 560],
  formula: [880, 560],
  career: [880, 560],
  sql: [880, 560],
}

const DURATIONS: Record<ShowKind, number[]> = {
  non8: NON8_STEPS,
  guardian: GUARDIAN_STEPS,
  mediator: MEDIATOR_STEPS,
  desk: DESK_STEPS,
  civic: CIVIC_STEPS,
  live: LIVE_STEPS,
  clause: CLAUSE_STEPS,
  trust: TRUST_STEPS,
  health: HEALTH_STEPS,
  formula: FORMULA_STEPS,
  career: CAREER_STEPS,
  sql: SQL_STEPS,
}

/** One mockup frozen at a given step — for the scroll-driven stories on the product pages. */
export function ShowAt({ kind, step }: { kind: ShowKind; step: number }) {
  switch (kind) {
    case 'non8':
      return <Non8 step={step} />
    case 'guardian':
      return <Guardian step={step} />
    case 'mediator':
      return <MediatorShow step={step} />
    case 'desk':
      return <Desk step={step} />
    case 'live':
      return <LiveShow step={step} />
    case 'clause':
      return <ClauseShow step={step} />
    case 'trust':
      return <TrustShow step={step} />
    case 'health':
      return <HealthShow step={step} />
    case 'formula':
      return <FormulaShow step={step} />
    case 'career':
      return <CareerShow step={step} />
    case 'sql':
      return <SqlShow step={step} />
    default:
      return <Civic step={step} />
  }
}

function Stepped({ kind, live }: { kind: ShowKind; live: boolean }) {
  const step = useSteps(DURATIONS[kind], live)
  return <ShowAt kind={kind} step={step} />
}

/** On a phone, the part of each screen that tells the story. */
export const CROP: Partial<Record<ShowKind, [number, number, number, number]>> = {
  live: [606, 0, 274, 560],
  non8: [188, 40, 692, 520],
  guardian: [606, 0, 274, 560],
  mediator: [0, 0, 540, 560],
  desk: [0, 0, 470, 560],
  civic: [0, 0, 310, 600],
  clause: [200, 38, 680, 522],
  trust: [470, 0, 410, 560],
  health: [60, 0, 310, 560],
  formula: [190, 0, 690, 560],
  career: [170, 0, 710, 560],
  sql: [0, 0, 880, 560],
}

export default function Showcase({ kind, live }: { kind: ShowKind; live: boolean }) {
  const [w, h] = SIZE[kind]
  return (
    <Stage w={w} h={h} crop={CROP[kind]}>
      <Stepped kind={kind} live={live} />
    </Stage>
  )
}
