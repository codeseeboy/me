import { useCurrentFrame } from 'remotion'
import './pgScreens.css'
import './liveFilm.css'
import { PgMark } from '../../src/components/svc/pg/Ui'
import { Callout, Caption, Chapter, Desk, EndCard, FPS, H, Laptop, Library, Pointer, Tap, Thumb, W, env, kf, lerp, tw, typed, type Line } from '../kit'
import { AppBar, Phone, Pill, Toast } from './pgScreens'

/*
 * Live Desktop & Control — the film. The owner is on a bus; the laptop is
 * open in the library with a form due at 5 PM. On the phone they watch the
 * laptop's real screen, pinch in, tap a field, type, submit — and close the
 * app they left open. The app's own controls: tap is a click, the virtual
 * keyboard types, "What is open" lists apps with Lock and Close.
 */

export const LIVE_SECONDS = 36

const LINES: Line[] = [
  [0.4, 4.0, 'Away from your desk?', 'Your laptop is still open in the library.'],
  [4.1, 8.0, 'Open Live Desktop.', 'Your laptop’s real screen — on your phone.'],
  [8.2, 13.9, 'Your laptop. In your pocket.', 'Pinch to zoom in on anything.'],
  [14.2, 18.4, 'Then take control.', 'Tap and type — it happens on the laptop.'],
  [18.5, 22.5, 'Fill it in. Hit submit.'],
  [22.6, 26.3, 'Done — before the 5 PM deadline.'],
  [26.5, 31.8, 'Close what you left open.', 'Every app and browser tab, one tap away.'],
]

const CHAPTERS: [number, number, string][] = [
  [0, 14, '01 · Watch'],
  [14, 26.4, '02 · Control'],
  [26.4, 32, '03 · Clean up'],
]

/* Form geometry on the laptop's 1024×640 screen. */
const FIELD: [number, number] = [512, 300]
const SUBMIT: [number, number] = [512, 452]

/** The laptop's screen: a college form in Chrome, Spotify left open behind it. */
function Portal({ t }: { t: number }) {
  const focused = t >= 14.9
  const roll = typed('21CS042', tw(t, 17.5, 18.1, (x) => x))
  const submitted = t >= 19.3
  const spotify = t < 28.1
  const clock = t < 19 ? '4:52 PM' : '4:53 PM'
  return (
    <div className="lv-desk">
      {spotify && (
        <div className="lv-spotify">
          <div className="lv-spotify__bar">Spotify</div>
          <div className="lv-spotify__art" />
          <b>Late night focus</b>
          <span>Playing on this laptop</span>
        </div>
      )}
      <div className="lv-win">
        <div className="ps-chrome__top">
          <span className="ps-dots">
            <i />
            <i />
            <i />
          </span>
          <span className="ps-tab is-on">
            <i style={{ background: '#2563eb' }} />
            Internship form
          </span>
          <span className="ps-tab">
            <i style={{ background: '#25d366' }} />
            WhatsApp
          </span>
        </div>
        <div className="ps-chrome__bar">
          <span className="ps-omni">portal.college.edu/internship</span>
        </div>
        <div className="lv-form">
          <p className="lv-form__h">Summer internship — application</p>
          <p className="lv-form__due">Closes today at 5:00 PM</p>
          <label>Roll number</label>
          <span className={`lv-input${focused ? ' is-focus' : ''}`}>
            {roll || <em>Enter your roll number</em>}
            {focused && !submitted && <i className="lv-caret" />}
          </span>
          <label>Resume</label>
          <span className="lv-file">✓ Resume_final.pdf</span>
          <span className={`lv-submit${submitted ? ' is-done' : ''}`}>{submitted ? '✓ Submitted at 4:53 PM' : 'Submit application'}</span>
        </div>
      </div>
      <div className="ps-taskbar">
        <i className="is-win" />
        <i />
        <i />
        <i />
        <b className="lv-clock">{clock}</b>
      </div>
    </div>
  )
}

const MIRROR = { x: 18, y: 122, w: 318 }
const FOCUS: [number, number] = [512, 330]
const MK = MIRROR.w / 1024

/** Where a point on the laptop screen appears inside the phone's mirror. */
function inMirror(ux: number, uy: number, zoom: number, fx: number, fy: number): [number, number] {
  const ox = fx * MK
  const oy = fy * MK
  return [MIRROR.x + ox + (ux * MK - ox) * zoom, MIRROR.y + oy + (uy * MK - oy) * zoom]
}

function LiveView({ t, zoom }: { t: number; zoom: number }) {
  const lag = Math.max(0, t - 0.25)
  const text = typed('21CS042', tw(t, 15.8, 17.0, (x) => x))
  return (
    <div className="ps-scr">
      <div className="lv-head">
        <b>Live desktop</b>
        <Pill kind="live">LIVE</Pill>
        <small>1920×1080</small>
      </div>
      <div className="lv-mirror" style={{ height: 640 * MK }}>
        <div className="lv-mirror__in" style={{ transform: `scale(${MK * zoom})`, transformOrigin: '0 0', left: (1 - zoom) * FOCUS[0] * MK, top: (1 - zoom) * FOCUS[1] * MK }}>
          <Portal t={lag} />
        </div>
      </div>
      <div className="lv-chips">
        <span>Switch app</span>
        <span className={t >= 26.5 && t < 26.9 ? 'is-pressed' : undefined}>What is open</span>
        <span className="is-lock">Lock Private</span>
      </div>
      <h6 className="ps-sec">Virtual keyboard</h6>
      <div className="lv-type">
        <span>{text || <em>Type text to send to laptop...</em>}</span>
        <b className={t >= 17.2 && t < 17.5 ? 'is-pressed' : undefined}>Type</b>
      </div>
      <div className="lv-chips lv-chips--2">
        <span>Left Click Center</span>
        <span>Right Click Center</span>
      </div>
      {t >= 26.8 && t < 31.6 && (
        <div className="ps-scrim" style={{ opacity: tw(t, 26.8, 27.1) }}>
          <div className="lv-sheet" style={{ transform: `translateY(${(1 - tw(t, 26.8, 27.3)) * 100}%)` }}>
            <span className="ps-sheet__grip" />
            <b className="lv-sheet__h">What is open</b>
            <h6 className="ps-sec">Open applications</h6>
            {[
              ['Chrome', '#4285f4', false],
              ['Spotify', '#1db954', true],
              ['Code', '#2f80ed', true],
            ]
              .filter(([n]) => !(n === 'Spotify' && t >= 28.1))
              .map(([n, c, lockable]) => (
                <div className="ps-card ps-row lv-app" key={n as string}>
                  <i style={{ background: c as string }} />
                  <span>
                    <strong>{n as string}</strong>
                  </span>
                  {lockable ? <span className="ps-mini">Lock</span> : null}
                  <span className={`ps-mini${n === 'Spotify' && t >= 27.8 ? ' is-hit' : ''}`}>Close</span>
                </div>
              ))}
          </div>
        </div>
      )}
      {t >= 28.2 && t < 31.4 && <Toast>Spotify closed.</Toast>}
    </div>
  )
}

function HomeView({ t }: { t: number }) {
  return (
    <div className="ps-scr">
      <AppBar />
      <div className="ps-card">
        <div className="ps-card__row">
          <Pill kind="ok">Protected</Pill>
          <small>Just now</small>
        </div>
        <h5>Protected</h5>
        <p>College mode. Everything is locked.</p>
      </div>
      <div className={`ps-card lv-livecard${t >= 3.1 && t < 3.5 ? ' is-pressed' : ''}`}>
        <span className="lv-livecard__ic" />
        <span>
          <strong>
            Live Desktop &amp; Control <Pill kind="live">LIVE</Pill>
          </strong>
          <small>View live Windows screen, move cursor, tap, scroll, and type.</small>
        </span>
      </div>
      <h6 className="ps-sec">Applications</h6>
      {['chrome', 'Spotify', 'Code'].map((n) => (
        <div className="ps-card ps-row" key={n}>
          <span>
            <strong>{n}</strong>
          </span>
          <span className="ps-mini">Close</span>
        </div>
      ))}
    </div>
  )
}

/** `clean` drops the captions and chapter tag — for the short loops on the site. */
export function LiveFilm({ clean = false }: { clean?: boolean }) {
  const t = useCurrentFrame() / FPS

  /* The layout widens the phone's half once the live view is open. */
  const grow = tw(t, 8.0, 9.2)
  const L = { x: 40, y: 40, w: lerp(1100, 780, grow), h: 1000 }
  const R = { x: lerp(1160, 840, grow), y: 40, w: lerp(720, 1040, grow), h: 1000 }
  const PK = lerp(1.0, 1.12, grow)
  const PX = lerp(R.x + R.w - 380 - 40, R.x + (R.w - 380 * PK) / 2, grow)
  const PY = R.y + (R.h - 823 * PK) / 2
  const zoom = kf(t, [
    [9.6, 1],
    [11.0, 1.75],
    [21.4, 1.75],
    [22.6, 1],
  ])

  const phonePt = (px: number, py: number): [number, number] => [PX + (13 + px) * PK, PY + (13 + py) * PK]
  const mirrorPt = (ux: number, uy: number) => {
    const [mx, my] = inMirror(ux, uy, zoom, FOCUS[0], FOCUS[1])
    return phonePt(mx, my)
  }

  const live = t >= 3.6
  const liveCard = phonePt(190, 315)
  const field = mirrorPt(...FIELD)
  const submit = mirrorPt(...SUBMIT)
  const typeBtn = phonePt(301, 452)
  const typeInput = phonePt(140, 452)
  const whatOpen = phonePt(177, 356)
  const closeSpotify = phonePt(296, 636)

  /* Laptop camera inside the left panel. */
  const s = lerp(0.74, 0.58, grow)
  const cam = { x: 960, y: 520 }
  const laptopPt = (ux: number, uy: number): [number, number] => [
    L.x + L.w / 2 + (428 + ux * (1064 / 1024) - cam.x) * s,
    L.y + L.h / 2 + (168 + uy * (1064 / 1024) - cam.y) * s,
  ]

  return (
    <div className="fk-film pg" style={{ background: '#0b0b10' }}>
      <div className="fk-panel" style={{ left: L.x, top: L.y, width: L.w, height: L.h }}>
        <div className="fk-layer" style={{ width: W, height: H, transformOrigin: '0 0', transform: `translate(${L.w / 2 - cam.x * s}px, ${L.h / 2 - cam.y * s}px) scale(${s})` }}>
          <Library blur={4} />
          <Desk mug={false} />
          <Laptop style={{ left: 410, top: 150 }}>
            <Portal t={t} />
            <Pointer
              t={t}
              path={[
                [13.6, 760, 560],
                [14.8, FIELD[0], FIELD[1]],
                [18.2, FIELD[0], FIELD[1]],
                [18.9, SUBMIT[0], SUBMIT[1]],
                [26, SUBMIT[0] + 40, SUBMIT[1] + 40],
              ]}
              show={env(t, 13.6, 26.2, 0.3)}
              scale={1.3}
            />
            <Tap t={t} at={14.9} x={FIELD[0]} y={FIELD[1]} color="#2563eb" size={80} />
            <Tap t={t} at={19.0} x={SUBMIT[0]} y={SUBMIT[1]} color="#2563eb" size={80} />
          </Laptop>
        </div>
        <div className="fk-panel__tag">
          <b>Your desk</b>
          <span>Library · nobody there</span>
        </div>
      </div>

      <div className="fk-panel" style={{ left: R.x, top: R.y, width: R.w, height: R.h }}>
        <div className="lv-street">
          {Array.from({ length: 18 }, (_, i) => (
            <i
              key={i}
              style={{
                left: `${(i * 53) % 100}%`,
                top: `${10 + ((i * 37) % 60)}%`,
                width: 40 + ((i * 29) % 90),
                height: 40 + ((i * 29) % 90),
                background: ['#f59e0b', '#ef4444', '#60a5fa', '#fbbf24', '#a78bfa'][i % 5],
                transform: `translateX(${-((t * 30 + i * 40) % 260)}px)`,
              }}
            />
          ))}
        </div>
        <div className="fk-panel__tag">
          <b>You</b>
          <span>On the bus home</span>
        </div>
      </div>

      <Phone style={{ left: PX, top: PY, transform: `scale(${PK})`, transformOrigin: '0 0', zIndex: 30 }}>
        {live ? (
          <div style={{ opacity: tw(t, 3.6, 3.9) }}>
            <LiveView t={t} zoom={zoom} />
          </div>
        ) : (
          <HomeView t={t} />
        )}
      </Phone>

      {/* Pinch: two fingertips spreading apart on the mirror */}
      {t >= 9.4 && t < 11.3 && (
        <>
          {[-1, 1].map((d) => {
            const sp = tw(t, 9.6, 11.0)
            const [cx, cy] = mirrorPt(FOCUS[0], FOCUS[1])
            return <span key={d} className="lv-finger" style={{ left: cx + d * lerp(18, 110, sp), top: cy + d * lerp(10, 60, sp), opacity: env(t, 9.4, 11.3, 0.25) }} />
          })}
        </>
      )}

      <Thumb
        t={t}
        path={[
          [2.2, liveCard[0] + 60, 1200],
          [3.0, liveCard[0], liveCard[1] - 20],
          [3.4, liveCard[0], liveCard[1] - 20],
          [4.2, liveCard[0] + 80, 1250],
          [13.8, field[0] + 60, 1250],
          [14.5, field[0], field[1] - 20],
          [15.0, field[0], field[1] - 20],
          [15.6, typeInput[0], typeInput[1] - 20],
          [17.0, typeInput[0], typeInput[1] - 20],
          [17.2, typeBtn[0], typeBtn[1] - 20],
          [18.0, typeBtn[0], typeBtn[1] - 20],
          [18.5, submit[0], submit[1] - 20],
          [19.1, submit[0], submit[1] - 20],
          [20.0, submit[0] + 80, 1250],
          [25.8, whatOpen[0] + 60, 1250],
          [26.4, whatOpen[0], whatOpen[1] - 20],
          [27.2, whatOpen[0], whatOpen[1] - 20],
          [27.7, closeSpotify[0], closeSpotify[1] - 20],
          [28.3, closeSpotify[0], closeSpotify[1] - 20],
          [29.2, closeSpotify[0] + 80, 1250],
        ]}
        press={[3.1, 14.7, 15.7, 17.25, 18.6, 26.5, 27.8]}
      />
      <Tap t={t} at={3.1} x={liveCard[0]} y={liveCard[1]} color="#4ade80" size={110} />
      <Tap t={t} at={14.7} x={field[0]} y={field[1]} color="#60a5fa" size={110} />
      <Tap t={t} at={17.25} x={typeBtn[0]} y={typeBtn[1]} color="#c4b5fd" size={100} />
      <Tap t={t} at={18.6} x={submit[0]} y={submit[1]} color="#60a5fa" size={110} />
      <Tap t={t} at={26.5} x={whatOpen[0]} y={whatOpen[1]} color="#c4b5fd" size={100} />
      <Tap t={t} at={27.8} x={closeSpotify[0]} y={closeSpotify[1]} color="#f87171" size={100} />

      <Callout {...(() => { const [x, y] = mirrorPt(60, 300); return { x, y } })()} dx={-200} dy={90} show={env(t, 5.0, 8.4, 0.3)} tone="green">
        Your laptop — live
      </Callout>
      <Callout {...(() => { const [x, y] = laptopPt(FIELD[0], FIELD[1]); return { x, y } })()} dx={120} dy={-190} show={env(t, 15.0, 18.3, 0.3)} tone="blue">
        Your tap lands here
      </Callout>
      <Callout {...(() => { const [x, y] = laptopPt(950, 260); return { x, y } })()} dx={-160} dy={-200} show={env(t, 28.2, 31.4, 0.3)} tone="red">
        Spotify — closed
      </Callout>

      {!clean && <Chapter t={t} items={CHAPTERS} />}
      {!clean && <Caption t={t} lines={LINES} />}
      {t >= 31.8 && <EndCard t={t} at={32.3} mark={<PgMark />} name="Live Desktop & Control" line="Your laptop, in your pocket." sub="Part of Privacy Guardian · Windows + Android" />}
      <div className="fk-flash" style={{ zIndex: 70, background: '#000', opacity: Math.max(1 - tw(t, 0, 0.5), tw(t, 35.3, 36)) }} />
    </div>
  )
}
