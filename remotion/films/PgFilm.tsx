import type { CSSProperties } from 'react'
import { useCurrentFrame } from 'remotion'
import './pgScreens.css'
import { PgMark } from '../../src/components/svc/pg/Ui'
import {
  Burst,
  Callout,
  Canteen,
  Caption,
  Chapter,
  Desk,
  EndCard,
  FPS,
  H,
  Laptop,
  Library,
  Person,
  Pointer,
  Signal,
  Tap,
  Thumb,
  W,
  env,
  kf,
  lerp,
  tw,
  typed,
  type Line,
} from '../kit'
import { Blocked, Chats, Chrome, Desktop, Folder, HomeScreen, Inbox, Locked, Phone, Toast, UnlockScreen, Video, type Tab } from './pgScreens'

/*
 * Privacy Guardian — the film. A library desk, a laptop left open, and
 * someone else sitting down. Then the owner, somewhere else, sees what is
 * open, locks it with one tap, and later unlocks just one thing with a
 * fingerprint. Every screen and string is the product's own.
 */

export const PG_SECONDS = 58

const TABS: Tab[] = [
  { id: 'wa', title: 'WhatsApp', color: '#25d366' },
  { id: 'gm', title: 'Inbox — Gmail', color: '#ea4335' },
  { id: 'yt', title: 'YouTube', color: '#ff0033' },
]
const URL: Record<string, string> = { wa: 'web.whatsapp.com', gm: 'mail.google.com', yt: 'www.youtube.com' }

const LINES: Line[] = [
  [0.4, 5.4, 'You step away for two minutes.', 'Your laptop stays open — and signed in to everything.'],
  [5.8, 9.2, 'Someone else sits down.'],
  [9.4, 12.8, 'Your private chats are right there.'],
  [12.9, 16.9, 'So is your mail.', 'Bank statements. Offer letters. All of it.'],
  [17.4, 22.3, 'On your phone, you see what’s open.', 'Privacy Guardian shows your laptop’s tabs and apps.'],
  [22.4, 27.2, 'One tap: Lock Private.', 'Everything you protect locks — instantly.'],
  [27.6, 33.4, 'Incognito. The app. The folder.'],
  [33.5, 38.8, 'Every way in hits the same lock.', 'Enforced by Windows and the browser — not a pop-up.'],
  [39.2, 44.0, 'The rest of the laptop still works.', 'They can watch YouTube. They can’t read your life.'],
  [45.2, 48.6, 'Back at your desk?'],
  [48.7, 52.9, 'One fingerprint. Just what you need.', 'Approved on your phone — for this one request.'],
]

const CHAPTERS: [number, number, string][] = [
  [0, 17, '01 · The problem'],
  [17, 27.4, '02 · See it. Lock it.'],
  [27.4, 39, '03 · Every way in'],
  [39, 44.2, '04 · Still usable'],
  [44.2, 53, '05 · Unlock'],
]

/* Where things are on the laptop's 1024×640 screen. */
const UI = {
  tabWa: [136, 27],
  tabGm: [288, 27],
  tabYt: [437, 27],
  priya: [150, 137],
  start: [432, 616],
  hit: [512, 519],
  folder: [299, 191],
} as const

const POINTER: [number, number, number][] = [
  [6.8, 900, 600],
  [9.7, 150, 137],
  [10.6, 640, 330],
  [12.4, 640, 330],
  [12.8, 288, 27],
  [13.6, 520, 250],
  [15.2, 560, 300],
  [15.5, 136, 27],
  [16.4, 600, 360],
  [23.0, 600, 360],
  [24.2, 640, 430],
  [27.7, 288, 27],
  [28.6, 520, 300],
  [29.0, 520, 70],
  [31.4, 520, 300],
  [31.7, 432, 616],
  [32.8, 512, 519],
  [34.6, 512, 360],
  [35.7, 299, 191],
  [38.2, 600, 400],
  [39.2, 437, 27],
  [40.2, 520, 260],
  [43.8, 560, 300],
]

const CLICKS: [number, number, number][] = [
  [10.0, 150, 137],
  [12.9, 288, 27],
  [15.6, 136, 27],
  [28.0, 288, 27],
  [31.8, 432, 616],
  [33.0, 512, 519],
  [36.0, 299, 191],
  [39.4, 437, 27],
]

/* Laptop geometry in the world (1920×1080 at camera scale 1). */
const SCREEN_X = 428
const SCREEN_Y = 168
const UI_K = 1064 / 1024

type Cam = { x: number; y: number; s: number }

function camAt(t: number): Cam {
  const x = kf(t, [
    [0, 960],
    [8.4, 960],
    [9.6, 960],
    [44.0, 960],
    [45.0, 960],
    [45.8, 1250],
  ])
  const y = kf(t, [
    [0, 570],
    [8.4, 550],
    [9.6, 500],
    [44.0, 500],
    [45.0, 560],
  ])
  const s = kf(t, [
    [0, 1],
    [8.4, 1.04],
    [9.6, 1.55],
    [16.8, 1.6],
    [27.8, 1.55],
    [44.0, 1.6],
    [45.0, 1],
    [45.8, 0.9],
  ])
  return { x, y, s }
}

/** A point on the laptop's screen, in frame coordinates for a camera. */
function screenToFrame(ux: number, uy: number, cam: Cam, vw = W, vh = H, ox = 0, oy = 0): [number, number] {
  const wx = SCREEN_X + ux * UI_K
  const wy = SCREEN_Y + uy * UI_K
  return [ox + vw / 2 + (wx - cam.x) * cam.s, oy + vh / 2 + (wy - cam.y) * cam.s]
}

/** What the laptop shows at time t. */
function LaptopScreen({ t }: { t: number }) {
  const active = t >= 39.4 && t < 44.0 ? 'yt' : (t >= 12.9 && t < 15.6) || (t >= 28.0 && t < 31.6) ? 'gm' : 'wa'
  const locked = t >= 23.6 && !(t >= 49.7)
  const opening = t >= 49.7 && t < 50.5
  const incog = t >= 28.8 && t < 31.6
  const windows = t >= 31.6 && t < 38.6

  if (windows) {
    const explorer = t >= 34.8
    return (
      <Desktop start={t >= 31.8 && t < 33.1} query={typed('whatsapp', tw(t, 32.0, 32.6))}>
        {t >= 33.1 && t < 34.8 && (
          <div style={{ opacity: tw(t, 33.1, 33.35), transform: `translate(0, 0) scale(${lerp(0.94, 1, tw(t, 33.1, 33.4))})`, position: 'absolute', inset: 0 }}>
            <Blocked exe="WhatsApp.exe" />
          </div>
        )}
        {explorer && <Folder denied={t >= 36.15} />}
      </Desktop>
    )
  }

  let body
  if (opening) body = <Locked host={URL[active]} state="ok" />
  else if (locked && active !== 'yt') body = <Locked host={URL[active]} />
  else if (active === 'gm') body = <Inbox />
  else if (active === 'yt') body = <Video />
  else body = <Chats open={t >= 10.0 && t < 44} bubbles={Math.min(4, Math.max(0, Math.floor((t - 10.0) / 0.3) + 1))} />

  return (
    <>
      <Chrome tabs={TABS} active={active} url={URL[active]}>
        {body}
      </Chrome>
      {incog && (
        <div
          style={{
            position: 'absolute',
            inset: '34px 60px 50px',
            opacity: tw(t, 28.8, 29.0),
            transform: `scale(${lerp(0.94, 1, tw(t, 28.8, 29.1))})`,
            borderRadius: 12,
            overflow: 'hidden',
            boxShadow: '0 30px 70px rgb(0 0 0 / 50%)',
          }}
        >
          <Chrome tabs={[{ id: 'i', title: 'New Incognito tab', color: '#9aa0a6' }]} active="i" url={t < 29.9 ? typed('web.whatsapp.com', tw(t, 29.1, 29.8)) || ' ' : 'web.whatsapp.com'} incog>
            {t >= 30.1 ? <Locked host="web.whatsapp.com" /> : <div style={{ height: '100%', background: '#202124' }} />}
          </Chrome>
        </div>
      )}
      {locked && t < 24.3 && <div className="fk-flash" style={{ background: '#7c5cfc', opacity: 0.55 * (1 - tw(t, 23.6, 24.3)) }} />}
      {opening && <div className="fk-flash" style={{ background: '#22c55e', opacity: 0.4 * (1 - tw(t, 49.7, 50.3)) }} />}
    </>
  )
}

/** The library: desk, laptop, and whoever is sitting at it. */
function World({ t, cam, vw, vh }: { t: number; cam: Cam; vw: number; vh: number }) {
  const youOut = tw(t, 2.4, 3.6, (x) => x * x)
  const youUp = tw(t, 1.8, 2.4)
  const youBack = tw(t, 45.0, 46.4)
  const strangerIn = tw(t, 5.6, 6.8)
  const strangerOut = tw(t, 44.2, 45.2, (x) => x * x)
  const tilt = kf(t, [
    [23.5, 0],
    [23.9, -10],
    [24.6, 7],
    [25.2, 0],
    [30.1, 0],
    [30.4, -6],
    [31.0, 0],
  ])
  const pointerShow = env(t, 6.8, 44.0, 0.3)

  const youStyle: CSSProperties =
    t < 5
      ? { left: 140 - youOut * 1000, top: 600 - youUp * 60 }
      : { left: lerp(-760, 140, youBack), top: 600 + (1 - youBack) * 30, opacity: youBack }
  const strangerStyle: CSSProperties = {
    left: lerp(1900, 140, strangerIn) + strangerOut * 1700,
    top: 600 + (1 - strangerIn) * 30 - Math.sin(strangerIn * Math.PI) * 20,
  }

  return (
    <div
      className="fk-layer"
      style={{ width: W, height: H, transformOrigin: '0 0', transform: `translate(${vw / 2 - cam.x * cam.s}px, ${vh / 2 - cam.y * cam.s}px) scale(${cam.s})` }}
    >
      <Library blur={4} />
      <Desk />
      <Laptop style={{ left: 410, top: 150 }}>
        <LaptopScreen t={t} />
        <Pointer t={t} path={POINTER} show={pointerShow} scale={1.2} />
        {CLICKS.map(([at, x, y]) => (
          <Tap key={at} t={t} at={at} x={x} y={y} color="#7c5cfc" size={70} />
        ))}
      </Laptop>
      {(t < 5 || t >= 45) && <Person who="you" style={{ ...youStyle, width: 560 }} />}
      {t >= 5.6 && t < 45.4 && <Person who="stranger" tilt={tilt} style={{ ...strangerStyle, width: 560 }} />}
    </div>
  )
}

/** `clean` drops the captions and chapter tag — for the short loops on the site. */
export function PgFilm({ clean = false }: { clean?: boolean }) {
  const t = useCurrentFrame() / FPS
  const split = tw(t, 17.0, 18.2) - tw(t, 27.0, 28.0)

  /* Left panel: the library. Full frame, or the left part of a split. */
  const L = { x: lerp(0, 40, split), y: lerp(0, 40, split), w: lerp(W, 1100, split), h: lerp(H, 1000, split), r: lerp(0, 34, split) }
  const base = camAt(t)
  const cam: Cam = {
    x: lerp(base.x, 830, split),
    y: lerp(base.y, 560, split),
    s: lerp(base.s, 0.74, split),
  }

  /* Right panel: you, somewhere else, with your phone. */
  const R = { x: lerp(W + 40, 1160, split), y: 40, w: 720, h: 1000 }
  const PH = { x: 300, y: 150, k: 1.0 }
  const lockBtn: [number, number] = [R.x + PH.x + 190 * PH.k, R.y + PH.y + 310 * PH.k]

  /* Act 5: the phone comes in over the scene. */
  const pip = tw(t, 45.6, 46.4) * (1 - tw(t, 52.6, 53.2))
  const PIP = { x: 1400, y: lerp(1100, 160, pip), k: 0.95 }
  const unlockBtn: [number, number] = [PIP.x + 290 * PIP.k, PIP.y + 168 * PIP.k]
  const fp: [number, number] = [PIP.x + 190 * PIP.k, PIP.y + 666 * PIP.k]
  const fpProgress = tw(t, 47.8, 48.9, (x) => x)
  const approved = t >= 48.9

  /* Callouts on the close-up screen. */
  const full = split <= 0.001 && t < 44.2
  const at = (ux: number, uy: number) => screenToFrame(ux, uy, cam)

  const laptopCenter = screenToFrame(512, 300, cam, L.w, L.h, L.x, L.y)

  return (
    <div className="fk-film pg" style={{ background: '#0b0b10' }}>
      <div className="fk-panel" style={{ left: L.x, top: L.y, width: L.w, height: L.h, borderRadius: L.r, boxShadow: split ? undefined : 'none' }}>
        <World t={t} cam={cam} vw={L.w} vh={L.h} />
        {split > 0.6 && <div className="fk-panel__tag" style={{ opacity: tw(split, 0.6, 1) }}>
          <b>Your desk</b>
          <span>Library · 4:14 PM</span>
        </div>}
      </div>

      {split > 0.001 && (
        <div className="fk-panel" style={{ left: R.x, top: R.y, width: R.w, height: R.h }}>
          <Canteen blur={6} />
          <Phone style={{ left: PH.x, top: PH.y, transform: `scale(${PH.k})`, transformOrigin: '0 0' }}>
            <HomeScreen locked={t >= 23.6} pressed={t >= 22.6 && t < 23.6} />
            {t >= 23.8 && t < 26.9 && <Toast>Everything locked.</Toast>}
          </Phone>
          {t >= 18.6 && t < 22.2 && (
            <span className="fk-ring" style={{ left: PH.x + 18 * PH.k, top: PH.y + 390 * PH.k, width: 344 * PH.k, height: 196 * PH.k, opacity: env(t, 18.6, 22.2, 0.3) }} />
          )}
          <div className="fk-panel__tag">
            <b>You</b>
            <span>Canteen · 200 m away</span>
          </div>
        </div>
      )}

      {split > 0.5 && t < 27 && (
        <Thumb
          t={t}
          path={[
            [21.4, lockBtn[0] + 40, 1180],
            [22.4, lockBtn[0], lockBtn[1] - 20],
            [23.4, lockBtn[0], lockBtn[1] - 20],
            [24.4, lockBtn[0] + 60, 1200],
          ]}
          press={[22.6]}
        />
      )}
      <Tap t={t} at={22.6} x={lockBtn[0]} y={lockBtn[1]} color="#c4b5fd" size={120} />
      <Signal t={t} a={22.75} b={23.6} from={[lockBtn[0] - 120, lockBtn[1]]} to={laptopCenter} bend={-220} label="Lock Private" />
      <Burst t={t} at={23.6} x={laptopCenter[0]} y={laptopCenter[1]} color="#a78bfa" size={520} />

      {/* Act 5: phone over the scene */}
      {pip > 0.001 && (
        <Phone style={{ left: PIP.x, top: PIP.y, transform: `scale(${PIP.k})`, transformOrigin: '0 0', zIndex: 33 }}>
          <UnlockScreen sheet={t >= 47.1 && t < 50.3} progress={fpProgress} done={approved} />
        </Phone>
      )}
      {pip > 0.5 && (
        <Thumb
          t={t}
          path={[
            [46.2, unlockBtn[0] + 40, 1180],
            [46.8, unlockBtn[0], unlockBtn[1] - 20],
            [47.1, unlockBtn[0], unlockBtn[1] - 20],
            [47.6, fp[0], fp[1] - 50],
            [48.9, fp[0], fp[1] - 50],
            [49.8, fp[0] + 80, 1200],
          ]}
          press={[46.9, 47.6, 47.9, 48.2, 48.5]}
        />
      )}
      <Tap t={t} at={46.9} x={unlockBtn[0]} y={unlockBtn[1]} color="#4ade80" size={110} />
      <Signal t={t} a={49.0} b={49.7} from={[fp[0] - 80, fp[1] - 120]} to={screenToFrame(512, 300, camAt(t))} bend={-240} color="#4ade80" label="Approved · WhatsApp" />
      <Burst t={t} at={49.7} {...(() => { const [x, y] = screenToFrame(512, 300, camAt(t)); return { x, y } })()} color="#4ade80" size={460} />

      {/* Close-up callouts */}
      {full && (
        <>
          <Callout {...(() => { const [x, y] = at(640, 205); return { x, y } })()} dx={150} dy={-150} show={env(t, 10.9, 12.7, 0.3)}>
            Private chats<small>open to whoever sits down</small>
          </Callout>
          <Callout {...(() => { const [x, y] = at(300, 175); return { x, y } })()} dx={260} dy={-140} show={env(t, 13.7, 15.4, 0.3)}>
            Your bank statement
          </Callout>
          <Callout {...(() => { const [x, y] = at(512, 300); return { x, y } })()} dx={360} dy={-200} show={env(t, 30.3, 31.5, 0.25)} tone="red">
            Incognito<small>Locked</small>
          </Callout>
          <Callout {...(() => { const [x, y] = at(560, 250); return { x, y } })()} dx={340} dy={-190} show={env(t, 33.4, 34.7, 0.25)} tone="red">
            The desktop app<small>Did not start</small>
          </Callout>
          <Callout {...(() => { const [x, y] = at(512, 400); return { x, y } })()} dx={360} dy={-200} show={env(t, 36.4, 38.5, 0.25)} tone="red">
            The folder<small>Access is denied</small>
          </Callout>
          <Callout {...(() => { const [x, y] = at(437, 34); return { x, y } })()} dx={300} dy={170} show={env(t, 40.2, 43.7, 0.3)} tone="green">
            Not protected<small>free for whoever has the laptop</small>
          </Callout>
        </>
      )}

      {t >= 28.7 && t < 29.7 && (
        <div className="fk-keys" style={{ right: 120, top: 150, opacity: env(t, 28.7, 29.7, 0.2) }}>
          <span>Ctrl</span>
          <span>Shift</span>
          <span>N</span>
        </div>
      )}

      {!clean && <Chapter t={t} items={CHAPTERS} />}
      {!clean && (
        <Caption
          t={t}
          lines={LINES}
          box={{ left: L.x, right: Math.max(W - L.x - L.w, pip * 560), bottom: H - L.y - L.h, r: L.r }}
        />
      )}
      {t >= 52.8 && <EndCard t={t} at={53.4} mark={<PgMark />} name="Privacy Guardian" line="Your laptop, unlocked. Your private stuff, not." sub="Windows + Android · Access by request" />}
      <div className="fk-flash" style={{ zIndex: 70, background: '#000', opacity: Math.max(1 - tw(t, 0, 0.5), tw(t, 57.3, 58)) }} />
    </div>
  )
}
