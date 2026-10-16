import { useEffect, useRef } from 'react'
import type { MediaKind } from '../../data/work'
import { Stage, at, cx, useSteps } from './Stage'
import { GUARDIAN_STEPS, Guardian, LIVE_STEPS, LiveShow, MEDIATOR_STEPS, MediatorShow } from './Products'
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
 * UAV 3D — the reconstructed cloud, turning, with the flight path.
 * ================================================================== */

type P = [number, number, number, string]

/** A deterministic cloud: a tower whose glass half is missing, the ground around it, and a flight path. */
function makeCloud(): { pts: P[]; path: [number, number, number][] } {
  let s = 7
  const rnd = () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
  const pts: P[] = []
  const tone = (y: number) => {
    const t = Math.min(1, y / 4.2)
    const r = Math.round(120 + t * 120)
    const g = Math.round(130 + t * 110)
    const b = Math.round(220 + t * 30)
    return `rgb(${r},${g},${b})`
  }
  // Tower: two solid faces, two faces that the glass hid from the matcher.
  for (let i = 0; i < 2600; i++) {
    const y = rnd() * 4.2
    const f = Math.floor(rnd() * 4)
    if ((f === 2 || f === 3) && rnd() > 0.12) continue
    const u = rnd() * 2 - 1
    const p: [number, number, number] = f === 0 ? [u, y, -1] : f === 1 ? [-1, y, u] : f === 2 ? [1, y, u] : [u, y, 1]
    pts.push([p[0] + (rnd() - 0.5) * 0.04, p[1], p[2] + (rnd() - 0.5) * 0.04, tone(y)])
  }
  // Ground.
  for (let i = 0; i < 2600; i++) {
    const a = rnd() * Math.PI * 2
    const r = 1.2 + Math.sqrt(rnd()) * 3.6
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r
    const g = Math.round(110 + rnd() * 60)
    pts.push([x, (rnd() - 0.5) * 0.03, z, `rgb(${g - 20},${g},${g - 30})`])
  }
  // A road.
  for (let i = 0; i < 500; i++) {
    const x = rnd() * 9 - 4.5
    pts.push([x, 0.01, 2.6 + rnd() * 0.5, 'rgb(90,92,104)'])
  }
  const path: [number, number, number][] = []
  for (let i = 0; i <= 40; i++) {
    const t = i / 40
    const a = -0.6 + t * 2.4
    path.push([Math.cos(a) * 3.1, 0.6 + t * 3.6, Math.sin(a) * 3.1])
  }
  return { pts, path }
}

export function Mesh({ live, angle = 0.6 }: { live: boolean; angle?: number }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const { pts, path } = makeCloud()
    const W = 880
    const H = 560
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = W * dpr
    canvas.height = H * dpr
    ctx.scale(dpr, dpr)

    const project = (x: number, y: number, z: number, a: number): [number, number, number] => {
      const ca = Math.cos(a)
      const sa = Math.sin(a)
      const rx = x * ca - z * sa
      const rz = x * sa + z * ca
      // tilt the camera down a little
      const ty = y - 1.6
      const cy = Math.cos(0.38)
      const sy = Math.sin(0.38)
      const yy = ty * cy - rz * sy
      const zz = ty * sy + rz * cy + 9.5
      const f = 620 / zz
      return [W / 2 + rx * f, H * 0.56 - yy * f, zz]
    }

    let a = angle
    let raf = 0
    let lastT = performance.now()
    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      const proj = pts.map((p) => [...project(p[0], p[1], p[2], a), p[3]] as [number, number, number, string])
      proj.sort((p, q) => q[2] - p[2])
      for (const [x, y, z, c] of proj) {
        const r = Math.max(0.7, 2.6 - z * 0.14)
        ctx.fillStyle = c
        ctx.fillRect(x, y, r, r)
      }
      // flight path + camera frustums
      ctx.strokeStyle = 'rgba(250, 204, 21, 0.9)'
      ctx.lineWidth = 1.6
      ctx.beginPath()
      path.forEach((p, i) => {
        const [x, y] = project(p[0], p[1], p[2], a)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      })
      ctx.stroke()
      ctx.fillStyle = 'rgba(250, 204, 21, 0.95)'
      path.forEach((p, i) => {
        if (i % 5) return
        const [x, y] = project(p[0], p[1], p[2], a)
        ctx.beginPath()
        ctx.moveTo(x, y - 5)
        ctx.lineTo(x + 5, y + 4)
        ctx.lineTo(x - 5, y + 4)
        ctx.closePath()
        ctx.fill()
      })
      // the measured distance: base of the tower to the road
      const m1 = project(-1, 0, 1, a)
      const m2 = project(3.2, 0, 2.8, a)
      ctx.strokeStyle = '#fb7185'
      ctx.setLineDash([5, 4])
      ctx.beginPath()
      ctx.moveTo(m1[0], m1[1])
      ctx.lineTo(m2[0], m2[1])
      ctx.stroke()
      ctx.setLineDash([])
      for (const m of [m1, m2]) {
        ctx.fillStyle = '#fb7185'
        ctx.beginPath()
        ctx.arc(m[0], m[1], 4, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.font = '600 13px Montserrat, sans-serif'
      ctx.fillStyle = '#fff1f2'
      ctx.fillText('142.5 m', (m1[0] + m2[0]) / 2 + 8, (m1[1] + m2[1]) / 2 - 8)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - lastT) / 1000)
      lastT = now
      a += dt * 0.22
      draw()
      raf = requestAnimationFrame(tick)
    }
    draw()
    if (live && !reduce) raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [live, angle])

  return (
    <div className="msh">
      <canvas ref={ref} className="msh__cv" style={{ width: 880, height: 560 }} />
      <div className="msh__top">
        <span className="msh__title">
          Dense cloud <b>447,207 points</b>
        </span>
        <span className="msh__tools">
          <i className="is-on">Points</i>
          <i>Mesh</i>
          <i>Flight</i>
          <i>Measure</i>
        </span>
      </div>
      <div className="msh__foot">
        <span>
          <b>40 / 40</b> frames registered
        </span>
        <span>
          <b>2.38 m</b> GPS RMSE
        </span>
        <span>
          <b>0.389 px</b> reprojection
        </span>
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
  mesh: [880, 560],
  civic: [640, 600],
}

const DURATIONS: Record<Exclude<ShowKind, 'mesh'>, number[]> = {
  non8: NON8_STEPS,
  guardian: GUARDIAN_STEPS,
  mediator: MEDIATOR_STEPS,
  desk: DESK_STEPS,
  civic: CIVIC_STEPS,
  live: LIVE_STEPS,
}

/** One mockup frozen at a given step — for the scroll-driven stories on the product pages. */
export function ShowAt({ kind, step }: { kind: Exclude<ShowKind, 'mesh'>; step: number }) {
  if (kind === 'non8') return <Non8 step={step} />
  if (kind === 'guardian') return <Guardian step={step} />
  if (kind === 'mediator') return <MediatorShow step={step} />
  if (kind === 'desk') return <Desk step={step} />
  if (kind === 'live') return <LiveShow step={step} />
  return <Civic step={step} />
}

function Stepped({ kind, live }: { kind: Exclude<ShowKind, 'mesh'>; live: boolean }) {
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
}

export default function Showcase({ kind, live }: { kind: ShowKind; live: boolean }) {
  const [w, h] = SIZE[kind]
  return (
    <Stage w={w} h={h} crop={CROP[kind]}>
      {kind === 'mesh' ? <Mesh live={live} /> : <Stepped kind={kind} live={live} />}
    </Stage>
  )
}
