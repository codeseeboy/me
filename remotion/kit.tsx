import type { CSSProperties, ReactNode } from 'react'
import { Easing, interpolate } from 'remotion'

/*
 * The shared vocabulary of the product films. Every value is a function of
 * time in seconds (t), so a frame always renders the same way.
 */

export const FPS = 30
export const W = 1920
export const H = 1080

export const easeOut = Easing.bezier(0.22, 1, 0.36, 1)
export const easeInOut = Easing.bezier(0.65, 0, 0.35, 1)
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45)

/** Eased 0→1 progress of t through [a, b]. */
export const tw = (t: number, a: number, b: number, e = easeOut) =>
  interpolate(t, [a, b], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e })

/** 1 inside [a, b], fading in and out over f seconds. */
export const env = (t: number, a: number, b: number, f = 0.35) => Math.min(tw(t, a, a + f, easeInOut), 1 - tw(t, b - f, b, easeInOut))

/** Keyframed number: [[t, v], ...]. */
export function kf(t: number, frames: [number, number][], e = easeInOut) {
  return interpolate(
    t,
    frames.map((f) => f[0]),
    frames.map((f) => f[1]),
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e },
  )
}

export const lerp = (a: number, b: number, p: number) => a + (b - a) * p

export const typed = (s: string, p: number) => s.slice(0, Math.round(s.length * Math.min(1, Math.max(0, p))))

/* ------------------------------------------------------------------ */
/* Titles                                                              */
/* ------------------------------------------------------------------ */

export type Line = [number, number, string, string?]

/** Big lower-third captions, word by word — the narration of the film. */
export function Caption({ t, lines, tone = 'dark' }: { t: number; lines: Line[]; tone?: 'dark' | 'light' }) {
  const c = lines.find(([a, b]) => t >= a && t < b)
  if (!c) return null
  const [a, b, title, sub] = c
  const out = tw(t, b - 0.35, b, easeIn)
  return (
    <div className={`fk-cap fk-cap--${tone}`} style={{ opacity: 1 - out }}>
      <p className="fk-cap__title">
        {title.split(' ').map((w, i) => {
          const p = tw(t, a + i * 0.06, a + i * 0.06 + 0.55)
          return (
            <span key={i} className="fk-cap__w">
              <span style={{ transform: `translateY(${(1 - p) * 105}%)`, opacity: p }}>{w}</span>
            </span>
          )
        })}
      </p>
      {sub && (
        <p className="fk-cap__sub" style={{ opacity: tw(t, a + 0.35, a + 0.9), transform: `translateY(${(1 - tw(t, a + 0.35, a + 0.9)) * 16}px)` }}>
          {sub}
        </p>
      )}
    </div>
  )
}

/** The chapter tag in the corner: where we are in the story. */
export function Chapter({ t, items, tone = 'dark' }: { t: number; items: [number, number, string][]; tone?: 'dark' | 'light' }) {
  const c = items.find(([a, b]) => t >= a && t < b)
  if (!c) return null
  const [a, b, label] = c
  return (
    <div className={`fk-chap fk-chap--${tone}`} style={{ opacity: env(t, a, b, 0.4), transform: `translateY(${(1 - tw(t, a, a + 0.5)) * -14}px)` }}>
      <i />
      {label}
    </div>
  )
}

/** A label with a leader line pointing at something on screen. */
export function Callout({
  x,
  y,
  dx = 120,
  dy = -90,
  show,
  children,
  tone = 'violet',
}: {
  x: number
  y: number
  dx?: number
  dy?: number
  show: number
  children: ReactNode
  tone?: 'violet' | 'red' | 'green' | 'amber' | 'blue'
}) {
  if (show <= 0) return null
  const len = Math.hypot(dx, dy)
  const ang = (Math.atan2(dy, dx) * 180) / Math.PI
  const lx = x + dx
  const ly = y + dy
  return (
    <>
      <span className={`fk-dot fk-dot--${tone}`} style={{ left: x, top: y, opacity: show, transform: `translate(-50%, -50%) scale(${0.4 + show * 0.6})` }} />
      <span
        className={`fk-lead fk-lead--${tone}`}
        style={{ left: x, top: y, width: len * show, transform: `rotate(${ang}deg)`, opacity: show }}
      />
      <span
        className={`fk-label fk-label--${tone}`}
        style={{
          left: lx,
          top: ly,
          opacity: tw(show, 0.5, 1),
          transform: `translate(${dx < 0 ? '-100%' : '0'}, -50%) translateX(${dx < 0 ? -14 : 14}px)`,
        }}
      >
        {children}
      </span>
    </>
  )
}

/* ------------------------------------------------------------------ */
/* Pointers                                                            */
/* ------------------------------------------------------------------ */

/** A mouse pointer moving through [t, x, y] keyframes, blurred when fast. */
export function Pointer({ t, path, show = 1, scale = 1.4 }: { t: number; path: [number, number, number][]; show?: number; scale?: number }) {
  if (show <= 0) return null
  const at = (s: number) => [kf(s, path.map((p) => [p[0], p[1]])), kf(s, path.map((p) => [p[0], p[2]]))]
  const [x, y] = at(t)
  const [px, py] = at(t - 1 / 30)
  const v = Math.hypot(x - px, y - py)
  return (
    <svg
      className="fk-pointer"
      viewBox="0 0 16 20"
      style={{
        left: x,
        top: y,
        opacity: show,
        width: 22 * scale,
        height: 28 * scale,
        filter: `blur(${Math.min(2.5, v / 22)}px) drop-shadow(0 3px 6px rgb(0 0 0 / 45%))`,
      }}
    >
      <path d="M1 1 L1 16 L5 12 L8 19 L11 18 L8 11 L14 11 Z" fill="#fff" stroke="#111" strokeWidth="1.1" />
    </svg>
  )
}

/** A click or a tap: a ring that grows and fades. */
export function Tap({ t, at, x, y, color = '#fff', size = 90 }: { t: number; at: number; x: number; y: number; color?: string; size?: number }) {
  const p = tw(t, at, at + 0.55)
  if (t < at || p >= 1) return null
  return (
    <span
      className="fk-tap"
      style={{ left: x, top: y, width: size, height: size, borderColor: color, opacity: 1 - p, transform: `translate(-50%, -50%) scale(${0.2 + p * 1.1})` }}
    />
  )
}

/** A thumb coming in from the bottom of the frame to press a point. */
export function Thumb({ t, path, press = [] }: { t: number; path: [number, number, number][]; press?: number[] }) {
  const x = kf(t, path.map((p) => [p[0], p[1]]))
  const y = kf(t, path.map((p) => [p[0], p[2]]))
  const down = press.some((p) => t >= p && t < p + 0.22)
  return (
    <div className="fk-thumb" style={{ left: x, top: y, transform: `translate(-50%, 0) rotate(-14deg) scale(${down ? 0.94 : 1})` }}>
      <i />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Signals                                                             */
/* ------------------------------------------------------------------ */

/** A comet along a curve from one place to another, with a fading trail. */
export function Signal({
  t,
  a,
  b,
  from,
  to,
  bend = -160,
  color = '#8b6bff',
  label,
}: {
  t: number
  a: number
  b: number
  from: [number, number]
  to: [number, number]
  bend?: number
  color?: string
  label?: string
}) {
  const u = tw(t, a, b, easeInOut)
  const fade = 1 - tw(t, b, b + 0.6)
  if (t < a || fade <= 0) return null
  const c: [number, number] = [(from[0] + to[0]) / 2, (from[1] + to[1]) / 2 + bend]
  const pt = (k: number): [number, number] => {
    const q = Math.min(1, Math.max(0, k))
    return [
      (1 - q) * (1 - q) * from[0] + 2 * (1 - q) * q * c[0] + q * q * to[0],
      (1 - q) * (1 - q) * from[1] + 2 * (1 - q) * q * c[1] + q * q * to[1],
    ]
  }
  const d = `M${from[0]} ${from[1]} Q${c[0]} ${c[1]} ${to[0]} ${to[1]}`
  const [hx, hy] = pt(u)
  return (
    <svg className="fk-signal" viewBox={`0 0 ${W} ${H}`} style={{ opacity: fade }}>
      <path d={d} pathLength={1} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={3} strokeDasharray="0.01 0.012" />
      <path d={d} pathLength={1} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" strokeDasharray="1 1" strokeDashoffset={1 - u} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
      {u < 1 &&
        Array.from({ length: 10 }, (_, i) => {
          const [x, y] = pt(u - i * 0.018)
          return <circle key={i} cx={x} cy={y} r={Math.max(2, 14 - i * 1.3)} fill={i ? color : '#fff'} opacity={1 - i / 10} />
        })}
      {u < 1 && <circle cx={hx} cy={hy} r={40} fill={color} opacity={0.22} style={{ filter: 'blur(14px)' }} />}
      {label && u > 0.15 && u < 0.95 && (
        <foreignObject x={hx - 160} y={hy - 74} width={320} height={50}>
          <div className="fk-signal__label" style={{ borderColor: color }}>
            {label}
          </div>
        </foreignObject>
      )}
    </svg>
  )
}

/** A ring that bursts out of a point. */
export function Burst({ t, at, x, y, color, size = 340 }: { t: number; at: number; x: number; y: number; color: string; size?: number }) {
  const p = tw(t, at, at + 0.9)
  if (t < at || p >= 1) return null
  return (
    <span
      className="fk-burst"
      style={{ left: x, top: y, width: size, height: size, borderColor: color, opacity: 1 - p, transform: `translate(-50%, -50%) scale(${0.1 + p})` }}
    />
  )
}

/* ------------------------------------------------------------------ */
/* People, seen from behind                                            */
/* ------------------------------------------------------------------ */

export type Who = 'you' | 'stranger'

const LOOK: Record<Who, { top: string; topDark: string; hair: string; skin: string }> = {
  you: { top: '#34507a', topDark: '#1d2f4d', hair: '#17110d', skin: '#b98260' },
  stranger: { top: '#8a3b3b', topDark: '#4d1f22', hair: '#2b1810', skin: '#c9926c' },
}

/**
 * A person from behind: head, hair, shoulders — no face. Cinematic and
 * readable at a glance, which is all a scene needs from a person.
 */
export function Person({ who, style, tilt = 0 }: { who: Who; style?: CSSProperties; tilt?: number }) {
  const c = LOOK[who]
  const g = `fk-p-${who}`
  return (
    <svg className="fk-person" viewBox="0 0 520 560" style={style} aria-hidden="true">
      <defs>
        <linearGradient id={`${g}-top`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={c.top} />
          <stop offset="1" stopColor={c.topDark} />
        </linearGradient>
        <linearGradient id={`${g}-rim`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.85" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#ffe2b8" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      {/* torso */}
      <path d="M40 560 C40 430 110 372 205 356 L315 356 C410 372 480 430 480 560 Z" fill={`url(#${g}-top)`} />
      <path d="M40 560 C40 430 110 372 205 356 L315 356 C410 372 480 430 480 560 Z" fill={`url(#${g}-rim)`} />
      {/* hood / collar fold */}
      <path d="M190 356 C215 396 305 396 330 356" fill="none" stroke="rgb(0 0 0 / 28%)" strokeWidth="10" strokeLinecap="round" />
      {/* neck */}
      <path d="M222 300 L298 300 L306 362 C285 374 235 374 214 362 Z" fill={c.skin} />
      <path d="M222 300 L298 300 L300 330 C285 338 236 338 220 330 Z" fill="rgb(0 0 0 / 18%)" />
      <g transform={`rotate(${tilt} 260 300)`}>
        {/* ears */}
        <ellipse cx="166" cy="210" rx="16" ry="28" fill={c.skin} />
        <ellipse cx="354" cy="210" rx="16" ry="28" fill={c.skin} />
        {/* head, seen from behind: mostly hair */}
        <ellipse cx="260" cy="196" rx="96" ry="112" fill={c.skin} />
        {who === 'you' ? (
          <path d="M162 214 C150 120 196 78 260 78 C324 78 370 120 358 214 C352 262 330 292 260 300 C190 292 168 262 162 214 Z" fill={c.hair} />
        ) : (
          <>
            <path d="M156 222 C140 116 192 70 260 70 C328 70 380 116 364 222 C372 300 360 352 330 370 L190 370 C160 352 148 300 156 222 Z" fill={c.hair} />
            <ellipse cx="260" cy="82" rx="46" ry="38" fill={c.hair} />
          </>
        )}
        <path d="M200 112 C228 92 300 92 330 120" fill="none" stroke="rgb(255 255 255 / 10%)" strokeWidth="8" strokeLinecap="round" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Places                                                              */
/* ------------------------------------------------------------------ */

/** A library reading table at dusk: shelves, a window, warm light. */
export function Library({ blur = 0 }: { blur?: number }) {
  const spines = Array.from({ length: 64 }, (_, i) => i)
  const hue = ['#5b3a29', '#2f4a43', '#6d5a3a', '#3a3350', '#7a3b2e', '#40362a', '#2c3b55', '#5f4b2b']
  return (
    <div className="fk-room fk-room--library" style={{ filter: blur ? `blur(${blur}px)` : undefined }}>
      <div className="fk-window" />
      <div className="fk-shelves">
        {[0, 1, 2].map((row) => (
          <div className="fk-shelf" key={row}>
            {spines.map((i) => (
              <i
                key={i}
                style={{
                  height: `${68 + ((i * 37 + row * 11) % 30)}%`,
                  width: 14 + ((i * 13 + row) % 12),
                  background: hue[(i * 5 + row * 3) % hue.length],
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="fk-lamp" />
    </div>
  )
}

/** A college canteen: hanging lights, a counter, cool daylight. */
export function Canteen({ blur = 0 }: { blur?: number }) {
  return (
    <div className="fk-room fk-room--canteen" style={{ filter: blur ? `blur(${blur}px)` : undefined }}>
      {[14, 36, 58, 80].map((x) => (
        <span key={x} className="fk-pendant" style={{ left: `${x}%` }}>
          <i />
        </span>
      ))}
      <div className="fk-counter" />
      <div className="fk-tables" />
    </div>
  )
}

/** A desk surface with a laptop sitting on it, screen facing us. */
export function Desk({ children, mug = true }: { children?: ReactNode; mug?: boolean }) {
  return (
    <div className="fk-desk">
      {children}
      {mug && <span className="fk-mug" />}
      <span className="fk-notebook" />
    </div>
  )
}

/** A laptop, front view; whatever is passed is its screen at 1280×800. */
export function Laptop({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="fk-laptop" style={style}>
      <div className="fk-laptop__lid">
        <div className="fk-laptop__screen">
          <div className="fk-laptop__ui">{children}</div>
          <span className="fk-laptop__glare" />
        </div>
      </div>
      <div className="fk-laptop__base" />
    </div>
  )
}

/** One half of a split screen, with its place written on it. */
export function Panel({ label, sub, children, style }: { label: string; sub?: string; children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="fk-panel" style={style}>
      {children}
      <div className="fk-panel__tag">
        <b>{label}</b>
        {sub ? <span>{sub}</span> : null}
      </div>
    </div>
  )
}

/** The end card: mark, name and one line. */
export function EndCard({ t, at, mark, name, line, sub, tone = 'dark' }: { t: number; at: number; mark: ReactNode; name: string; line: string; sub: string; tone?: 'dark' | 'light' }) {
  const p = tw(t, at, at + 0.9)
  return (
    <div className={`fk-end fk-end--${tone}`} style={{ opacity: tw(t, at - 0.3, at + 0.3) }}>
      <div className="fk-end__mark" style={{ transform: `scale(${0.6 + 0.4 * p})`, opacity: p }}>
        {mark}
      </div>
      <p className="fk-end__name" style={{ opacity: tw(t, at + 0.3, at + 1), transform: `translateY(${(1 - tw(t, at + 0.3, at + 1)) * 30}px)` }}>
        {name}
      </p>
      <p className="fk-end__line" style={{ opacity: tw(t, at + 0.7, at + 1.4) }}>
        {line}
      </p>
      <p className="fk-end__sub" style={{ opacity: tw(t, at + 1.1, at + 1.8) }}>
        {sub}
      </p>
    </div>
  )
}
