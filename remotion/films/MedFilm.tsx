import type { ReactNode } from 'react'
import { useCurrentFrame } from 'remotion'
import './medScreens.css'
import { MedMark } from '../../src/components/svc/med/Ui'
import { Burst, Caption, Chapter, EndCard, FPS, Person, Pointer, Signal, Tap, env, kf, lerp, tw, typed, type Line as CapLine } from '../kit'
import {
  Activity,
  Ai,
  Approval,
  Chat,
  Code,
  Desktop,
  Dots,
  Editor,
  Fence,
  MediatorPanel,
  Result,
  Terminal,
  Verification,
  You,
  type Line,
  type Tone,
} from './medScreens'

/*
 * Mediator — the film. Act 1 is the loop people live in: prompt, copy,
 * paste, run, fail, copy the error back, again, while the clock runs.
 * Then the same bug with Mediator: one request, and the AI runs the tests,
 * edits the file, is refused when it claims "done" too early, verifies,
 * and stops for a person before a risky command.
 */

export const MED_SECONDS = 58

const K = 0.9 // desktop (1600×900) at 1440×810, centred, with room for captions below it
const DX = 240
const DY = 45

const CAPTIONS: CapLine[] = [
  [0.4, 3.3, '11:40 PM. One failing test.', 'Your AI chat is open in the next window.'],
  [4.4, 9.0, 'You ask. You copy. You paste.'],
  [9.1, 13.5, 'You run it. It fails. You copy the error back.'],
  [13.7, 18.4, 'Again. And again.', 'Every fix is a round trip — and you’re the one making it.'],
  [18.7, 21.2, 'You’re not coding anymore.', 'You’re carrying text between two windows.'],
  [25.6, 28.0, 'Same bug. Now with Mediator.', 'Switch it on for this tab. Ask once.'],
  [28.2, 31.6, 'It runs your tests itself.', 'And reads the exact failure.'],
  [31.8, 35.2, 'It fixes the code — in your files.'],
  [35.4, 37.6, 'It can’t just say “done”.', 'Mediator checks first — and refuses.'],
  [37.7, 42.8, 'So it verifies. Then it’s done.', 'No copying. No pasting. No switching windows.'],
  [43.4, 46.6, 'Something risky? It waits for you.', 'Force-push, package installs, network commands.'],
  [46.7, 49.8, 'You said no. Nothing ran.', 'And rm -rf / is blocked outright.'],
]

const CHAPTERS: [number, number, string][] = [
  [0, 21.2, '01 · The copy-paste loop'],
  [21.2, 25.4, '02 · Mediator'],
  [25.4, 43, '03 · Hands off'],
  [43, 50, '04 · You stay in charge'],
  [50, 54.2, '05 · Your AI'],
]

const STEPS = [
  'Write the prompt',
  'ChatGPT writes code',
  'Copy it',
  'Switch to your editor',
  'Paste it',
  'Run the tests',
  'It fails again',
  'Copy the error',
  'Back to ChatGPT',
  'Send it. Wait.',
]
const STEP_AT = [4.3, 5.5, 6.7, 7.5, 8.2, 9.0, 9.9, 10.7, 11.6, 12.5, 13.6]

const OLD: Line[] = [
  ['class Session:'],
  ['    def refresh(self, token):'],
  ['        if token.issued_at + TTL < now():'],
  ['            raise TokenExpired()'],
  ['        return self.renew(token)'],
]

const SUGGESTED = ['def refresh(self, token):', '    if token.expires_at < now():', '        raise TokenExpired()', '    return self.renew(token)']

/* ------------------------------------------------------------------ */
/* Act 1 — the loop                                                    */
/* ------------------------------------------------------------------ */

function loopEditor(t: number): { lines: Line[]; focus: boolean } {
  const focus = t >= 7.9 && t < 9.0
  if (t < 8.2) return { lines: OLD, focus }
  if (t < 8.5) return { lines: OLD.map((l, i) => (i >= 1 && i <= 3 ? [l[0], 'sel'] : l)), focus }
  if (t < 13.6)
    return {
      lines: [['class Session:'], ...SUGGESTED.map((s) => ['    ' + s, t < 9.4 ? 'add' : ''] as Line)],
      focus,
    }
  // montage: the file keeps changing
  const k = Math.floor((t - 13.6) / 0.8) % 2
  return { lines: [['class Session:'], ...SUGGESTED.map((s, i) => ['    ' + s, i === 1 + k ? 'add' : ''] as Line)], focus: false }
}

function LoopTerminal({ t }: { t: number }) {
  const runs = t < 13.6 ? 0 : Math.min(6, Math.floor((t - 13.6) / 0.8) + 1)
  return (
    <Terminal focus={t >= 9.0 && t < 11.6}>
      {t >= 9.0 ? (
        <>
          <span className="t-p">PS C:\work\shop&gt;</span> {typed('pytest tests', tw(t, 9.1, 9.6, (x) => x))}
          {t >= 9.9 && (
            <>
              {'\n'}
              <span className="t-dim">..........</span>
              <span className="t-bad">F</span>
              <span className="t-dim">...............</span>
              {'\n'}
              <span className="t-bad">FAILED</span> tests/test_auth.py::test_login_refresh
              {'\n'}
              <span className={`t-bad${t >= 10.8 && t < 11.6 ? ' t-sel' : ''}`}>AttributeError: 'Token' object has no attribute 'expires_at'</span>
            </>
          )}
          {Array.from({ length: runs }, (_, i) => (
            <span key={i}>
              {'\n'}
              <span className="t-p">PS C:\work\shop&gt;</span> pytest tests{'  '}
              <span className="t-bad">1 failed</span>
            </span>
          ))}
        </>
      ) : (
        <span className="t-p">PS C:\work\shop&gt; </span>
      )}
    </Terminal>
  )
}

function LoopChat({ t }: { t: number }) {
  const prompt = 'My login test fails after the refactor. Here’s session.py — can you fix it?'
  const streamed = Math.floor(tw(t, 5.6, 6.6, (x) => x) * SUGGESTED.length)
  const error = 'Still failing: AttributeError: Token has no attribute expires_at'
  let composer: ReactNode = <em>Message ChatGPT</em>
  if (t >= 4.4 && t < 5.4) composer = typed(prompt, tw(t, 4.4, 5.2, (x) => x))
  else if (t >= 12.2 && t < 12.65) composer = error

  const montage = t >= 13.6 ? Math.min(6, Math.floor((t - 13.6) / 0.8) + 1) : 0
  return (
    <Chat composer={composer} sending={(t >= 5.3 && t < 5.5) || (t >= 12.55 && t < 12.75)}>
      {t >= 5.4 && <You>{prompt}</You>}
      {t >= 5.6 && (
        <Ai>
          Try this:
          <Code lines={SUGGESTED.slice(0, Math.max(1, streamed))} copied={t >= 7.1 && t < 9} hover={t >= 6.9 && t < 7.1} />
        </Ai>
      )}
      {t >= 12.65 && <You>{error}</You>}
      {t >= 12.8 && t < 13.6 && <Dots />}
      {Array.from({ length: montage }, (_, i) =>
        i % 2 === 0 ? (
          <Ai key={i}>
            Sorry about that — try this instead:
            <Code lines={['    if token.exp < now():', '        raise TokenExpired()']} />
          </Ai>
        ) : (
          <You key={i}>Still failing. Same error. 😩</You>
        ),
      )}
    </Chat>
  )
}

/* ------------------------------------------------------------------ */
/* Act 3 / 4 — with Mediator                                           */
/* ------------------------------------------------------------------ */

const FIXED: Line[] = [
  ['class Session:'],
  ['    def refresh(self, token):'],
  ['        if token.issued_at + TTL < now():', 'del'],
  ['        if token.expires_at <= now():', 'add'],
  ['            raise TokenExpired()'],
  ['        return self.renew(token)'],
]

function phase(t: number): [string, string, Tone] {
  const P: [number, string, string, Tone][] = [
    [0, 'Ready', '', 'ok'],
    [26.8, 'ChatGPT thinking', '', 'busy'],
    [28.2, 'ChatGPT → Mediator', 'run_tests', 'busy'],
    [28.8, 'Mediator → System', 'pytest', 'busy'],
    [30.6, 'Mediator → ChatGPT', '1 failed', 'busy'],
    [32.0, 'ChatGPT → Mediator', 'edit_file', 'busy'],
    [33.0, 'Mediator → System', 'edit_file', 'busy'],
    [35.4, 'ChatGPT → Mediator', 'finish_task', 'busy'],
    [36.0, 'Mediator → ChatGPT', 'refused', 'bad'],
    [37.6, 'Mediator → System', 'pytest', 'busy'],
    [39.2, 'Mediator → ChatGPT', '42 passed', 'busy'],
    [40.2, 'Ready', 'task complete', 'ok'],
    [43.2, 'ChatGPT → Mediator', 'run_command', 'busy'],
    [43.8, 'Waiting for approval', 'git push', 'wait'],
    [45.6, 'Mediator → ChatGPT', 'denied', 'busy'],
    [46.6, 'Ready', '', 'ok'],
  ]
  let cur = P[0]
  for (const p of P) if (t >= p[0]) cur = p
  return [cur[1], cur[2], cur[3]]
}

function HandsChat({ t }: { t: number }) {
  const ask = 'The login test fails after the refactor. Fix it.'
  const composer: ReactNode = t >= 26.0 && t < 26.75 ? typed(ask, tw(t, 26.0, 26.6, (x) => x)) : <em>Message ChatGPT</em>
  const at = (s: number) => t >= s
  return (
    <Chat composer={composer} armed sending={t >= 26.65 && t < 26.85}>
      {at(26.8) && <You>{ask}</You>}
      {at(26.9) && !at(27.6) && <Dots />}
      {at(27.6) && (
        <Ai>
          I’ll run the tests first.
          <Fence call={{ tool: 'run_tests', args: { path: 'tests' } }} />
        </Ai>
      )}
      {at(30.9) && (
        <Result tone="bad">
          run_tests: 1 failed, 41 passed{'\n'}test_login_refresh · tests/test_auth.py:42{'\n'}AssertionError: token expired
        </Result>
      )}
      {at(32.0) && (
        <Ai>
          Refresh compares against the wrong expiry.
          <Fence call={{ tool: 'edit_file', args: { path: 'src/auth/session.py' } }} />
        </Ai>
      )}
      {at(34.6) && <Result tone="info">edit_file: src/auth/session.py +1 −1</Result>}
      {at(35.4) && (
        <Ai>
          Done — the bug is fixed.
          <Fence call={{ tool: 'finish_task' }} />
        </Ai>
      )}
      {at(36.8) && <Result tone="bad">NOT COMPLETE — Mediator will not record this task as done yet.</Result>}
      {at(37.6) && (
        <Ai>
          <Fence call={{ tool: 'run_tests', args: { path: 'tests' } }} />
        </Ai>
      )}
      {at(39.2) && <Result tone="ok">run_tests: 42 passed</Result>}
      {at(39.8) && (
        <Ai>
          <Fence call={{ tool: 'finish_task' }} />
        </Ai>
      )}
      {at(40.8) && <Result tone="ok">finish_task: accepted</Result>}
      {at(43.2) && (
        <Ai>
          Pushing the fix.
          <Fence call={{ tool: 'run_command', args: { command: 'git push --force origin main' } }} />
        </Ai>
      )}
      {at(46.2) && <Result tone="bad">run_command: denied by the user — nothing ran.</Result>}
    </Chat>
  )
}

function HandsPanel({ t }: { t: number }) {
  const [label, detail, tone] = phase(t)
  let body: ReactNode = <p className="mf-idle">Waiting for the first call…</p>
  const rows: [string, string, ('ok' | 'bad' | 'wait' | '')?][] = []
  if (t >= 28.8) rows.push(['run_tests', t < 30.4 ? 'Running pytest tests…' : '1 failed, 41 passed', t < 30.4 ? '' : 'bad'])
  if (t >= 33.0) rows.push(['edit_file', 'Edited src/auth/session.py · +1 −1', 'ok'])
  if (t >= 36.0) rows.push(['finish_task', 'Refused — not verified since the last edit', 'bad'])
  if (t >= 37.6) rows.push(['run_tests', t < 38.6 ? 'Running pytest tests…' : '42 passed', t < 38.6 ? '' : 'ok'])

  if (t >= 43.8)
    body = <Approval decided={t >= 45.6 ? 'deny' : undefined} />
  else if (t >= 40.2)
    body = (
      <Verification
        rows={[
          ['Code changed', '1 edit(s)', 'ok'],
          ['Edits since last run', 'Verified', 'ok'],
          ['Last verification', 'Passed', 'ok'],
          ['Task complete', 'Complete', 'ok'],
        ]}
      />
    )
  else if (t >= 36.0 && t < 37.6)
    body = (
      <div className="mf-gate">
        <b>NOT COMPLETE — Mediator will not record this task as done yet.</b>
        1. files changed after the last verification, so nothing has exercised the current code
      </div>
    )
  else if (rows.length)
    body = (
      <>
        {((t >= 28.8 && t < 32.0) || (t >= 37.6 && t < 40.2)) && (
          <div className="mf-out">
            <span className="t-p">$</span> pytest tests{'\n'}
            {t < 32 ? (
              t >= 29.6 ? (
                <>
                  <span className="t-bad">1 failed</span>, <span className="t-ok">41 passed</span> in 3.8s
                </>
              ) : (
                <span className="t-dim">{'.'.repeat(Math.floor(tw(t, 28.9, 29.6, (x) => x) * 30))}</span>
              )
            ) : t >= 38.4 ? (
              <span className="t-ok">42 passed in 3.6s</span>
            ) : (
              <span className="t-dim">{'.'.repeat(Math.floor(tw(t, 37.7, 38.4, (x) => x) * 30))}</span>
            )}
          </div>
        )}
        <Activity rows={rows.slice(-3)} />
      </>
    )

  return (
    <MediatorPanel phase={label} detail={detail} tone={tone}>
      {body}
    </MediatorPanel>
  )
}

function handsEditor(t: number): { lines: Line[]; modified: boolean; by?: string } {
  if (t < 33.0) return { lines: OLD, modified: false }
  if (t < 33.5) return { lines: OLD.map((l, i) => (i === 2 ? [l[0], 'del'] : l)), modified: false }
  return { lines: t < 36.5 ? FIXED : FIXED.filter((l) => l[1] !== 'del').map((l) => [l[0]] as Line), modified: true, by: 'edited by Mediator' }
}

/* ------------------------------------------------------------------ */
/* The mark                                                            */
/* ------------------------------------------------------------------ */

const STROKES: [string, string][] = [
  ['M15 66 V22 L45 42', '#e8edf4'],
  ['M85 66 V22 L55 42', '#e8edf4'],
  ['M55 58 L80 76', '#e8edf4'],
  ['M45 58 L20 76', '#3b82f6'],
]

function MarkDraw({ p, d }: { p: number; d: number }) {
  return (
    <svg viewBox="0 0 100 100" style={{ width: 260, height: 260, overflow: 'visible' }}>
      <g fill="none" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round">
        {STROKES.map(([path, c], i) => (
          <path key={i} d={path} stroke={c} pathLength={1} strokeDasharray="1 1" strokeDashoffset={1 - Math.min(1, Math.max(0, p * 1.6 - i * 0.2))} />
        ))}
      </g>
      <path d="M50 42 L57 49 L50 56 L43 49 Z" fill="#3b82f6" style={{ transform: `scale(${d})`, transformOrigin: '50px 49px', filter: 'drop-shadow(0 0 6px #3b82f6)' }} />
    </svg>
  )
}

function clockAt(t: number) {
  const m = Math.round(
    kf(
      t,
      [
        [4.3, 0],
        [13.6, 6],
        [16.1, 29],
        [18.6, 51],
      ],
      (x) => x,
    ),
  )
  const total = 23 * 60 + 40 + m
  const h24 = Math.floor(total / 60) % 24
  const mm = String(total % 60).padStart(2, '0')
  const h = h24 % 12 === 0 ? 12 : h24 % 12
  return `${h}:${mm} ${h24 >= 12 ? 'PM' : 'AM'}`
}

/* ------------------------------------------------------------------ */

/** `clean` drops the captions and chapter tag — for the short loops on the site. */
export function MedFilm({ clean = false }: { clean?: boolean }) {
  const t = useCurrentFrame() / FPS

  /* Act 1 framing: a dark room, then into the monitor. */
  const push = tw(t, 3.4, 4.3)
  const roomScale = lerp(1, (1600 * K) / 1092, push)
  const freeze = tw(t, 18.6, 19.2)

  /* Act 4 framing: into Mediator's panel for the approval. */
  const zin = tw(t, 43.6, 44.4) * (1 - tw(t, 46.8, 47.6))
  const zs = lerp(K, 2.0, zin)
  const fx = lerp(800, 1188, zin)
  const fy = lerp(450, 718, zin)
  const camX = 960 - fx * zs
  const camY = lerp(450, 470, zin) - fy * zs

  const loopStep = t < 13.6 ? STEP_AT.findIndex((a, i) => t >= a && t < STEP_AT[i + 1]) : Math.floor((t - 13.6) / 0.25) % 10
  const round = t < 13.6 ? 1 : Math.min(3, 2 + Math.floor((t - 13.6) / 2.5))

  const ed = handsEditor(t)
  const le = loopEditor(t)

  const D = (x: number, y: number): [number, number] => [DX + x * K, DY + y * K]

  return (
    <div className="fk-film med" style={{ background: '#07090d' }}>
      {/* ---- Act 1 ---- */}
      {t < 21.4 && (
        <div className="fk-layer" style={{ opacity: 1 - tw(t, 20.8, 21.4), filter: freeze ? `grayscale(${freeze}) brightness(${1 - 0.45 * freeze})` : undefined }}>
          {t < 4.3 ? (
            <div className="fk-layer">
              <div
                className="fk-layer"
                style={{
                  transformOrigin: '0 0',
                  transform: `translate(${960 - 960 * roomScale}px, ${lerp(441, 450, push) - 441 * roomScale}px) scale(${roomScale})`,
                }}
              >
                <div className="mf-room" />
                <div className="mf-monitor">
                  <div className="mf-monitor__screen">
                    <div>
                      <Desktop>
                        <LoopChat t={t} />
                        <Editor lines={OLD} />
                        <LoopTerminal t={t} />
                      </Desktop>
                    </div>
                  </div>
                  <div className="mf-monitor__stand" />
                  <div className="mf-monitor__foot" />
                </div>
                <Person who="you" style={{ left: 120, top: 560, width: 560, opacity: 1 - push }} />
              </div>
            </div>
          ) : (
            <div className="fk-layer" style={{ transformOrigin: '0 0', transform: `translate(${DX}px, ${DY}px) scale(${K})` }}>
              <Desktop>
                <LoopChat t={t} />
                <Editor lines={le.lines} focus={le.focus} />
                <LoopTerminal t={t} />
                <Pointer
                  t={t}
                  scale={1.1}
                  show={env(t, 4.4, 18.6, 0.3)}
                  path={
                    t < 13.6
                      ? [
                          [4.4, 600, 820],
                          [5.2, 714, 816],
                          [6.6, 680, 600],
                          [6.95, 672, 571],
                          [7.3, 672, 571],
                          [7.95, 1210, 205],
                          [8.9, 1210, 205],
                          [9.1, 1000, 640],
                          [11.4, 1000, 672],
                          [12.0, 380, 816],
                          [12.4, 714, 816],
                          [13.6, 600, 700],
                        ]
                      : Array.from({ length: 21 }, (_, i) => {
                          const pts: [number, number][] = [
                            [672, 560],
                            [1210, 205],
                            [1000, 660],
                            [380, 816],
                          ]
                          const [x, y] = pts[i % 4]
                          return [13.6 + i * 0.25, x, y] as [number, number, number]
                        })
                  }
                />
                {(
                  [
                    [5.35, 714, 816],
                    [7.1, 672, 571],
                    [8.0, 1210, 205],
                    [9.1, 1000, 640],
                    [12.6, 714, 816],
                  ] as [number, number, number][]
                ).map(([at, x, y]) => (
                  <Tap key={at} t={t} at={at} x={x} y={y} color="#f59e0b" size={70} />
                ))}
              </Desktop>
            </div>
          )}
        </div>
      )}

      {t >= 4.3 && t < 18.6 && loopStep >= 0 && (
        <>
          <div className="mf-step" key={`${round}-${loopStep}`}>
            <b>{loopStep + 1}</b>
            <span>{STEPS[loopStep]}</span>
            <small>Round trip {round}</small>
          </div>
          <div className="mf-clock">
            {clockAt(t)}
            <small>still on the same bug</small>
          </div>
        </>
      )}
      {[
        [8.2, 9.0, ['Ctrl', 'V']],
        [10.8, 11.6, ['Ctrl', 'C']],
        [12.15, 12.6, ['Ctrl', 'V']],
      ].map(([a, b, keys]) =>
        t >= (a as number) && t < (b as number) ? (
          <div key={a as number} className="fk-keys" style={{ right: 90, top: 200, opacity: env(t, a as number, b as number, 0.15) }}>
            {(keys as string[]).map((k) => (
              <span key={k}>{k}</span>
            ))}
          </div>
        ) : null,
      )}

      {/* ---- Act 2: the mark ---- */}
      {t >= 21.0 && t < 25.8 && (
        <div className="fk-layer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: env(t, 21.0, 25.4, 0.4), background: 'radial-gradient(50% 50% at 50% 45%, #0f2a1c, #07090d 70%)' }}>
          <MarkDraw p={tw(t, 21.5, 22.7, (x) => x)} d={tw(t, 22.5, 22.9)} />
          <p style={{ marginTop: 30, fontSize: 128, fontWeight: 800, letterSpacing: '-0.055em', color: '#fff', opacity: tw(t, 22.6, 23.2), transform: `translateY(${(1 - tw(t, 22.6, 23.3)) * 30}px)` }}>Mediator</p>
          <p style={{ marginTop: 18, fontSize: 52, fontWeight: 650, letterSpacing: '-0.02em', color: '#4ade80', opacity: tw(t, 23.3, 23.9) }}>What if your AI could run it itself?</p>
        </div>
      )}
      <Burst t={t} at={22.8} x={960} y={420} color="#22c55e" size={620} />

      {/* ---- Acts 3 & 4: with Mediator ---- */}
      {t >= 25.2 && t < 50.4 && (
        <div className="fk-layer" style={{ opacity: tw(t, 25.4, 25.9) * (1 - tw(t, 49.8, 50.4)) }}>
          <div className="fk-layer" style={{ transformOrigin: '0 0', transform: `translate(${camX}px, ${camY}px) scale(${zs})` }}>
            <Desktop>
              <HandsChat t={t} />
              <Editor lines={ed.lines} modified={ed.modified} by={ed.by} />
              <div style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - tw(t, 25.6, 26.4)) * 400}px)` }}>
                <HandsPanel t={t} />
              </div>
              {t >= 25.6 && t < 27.0 && (
                <div className="mf-popup" style={{ opacity: env(t, 25.6, 27.0, 0.25) }}>
                  <b>Agent on this tab</b>
                  <span>
                    <i /> Let the AI use your tools here
                  </span>
                </div>
              )}
              <Pointer
                t={t}
                scale={1.1}
                show={env(t, 44.2, 46.4, 0.3)}
                path={[
                  [44.2, 1300, 880],
                  [45.3, 1018, 774],
                  [46.4, 1030, 790],
                ]}
              />
              <Tap t={t} at={45.6} x={1018} y={774} color="#f87171" size={80} />
            </Desktop>
          </div>
        </div>
      )}
      {/* tool calls travelling between the chat and Mediator */}
      {zin < 0.05 && (
        <>
          <Signal t={t} a={28.2} b={28.8} from={D(420, 760)} to={D(1188, 640)} bend={-120} color="#22c55e" label="run_tests" />
          <Signal t={t} a={30.3} b={30.9} from={D(1188, 640)} to={D(420, 760)} bend={-120} color="#3b82f6" label="result" />
          <Signal t={t} a={32.4} b={33.0} from={D(420, 760)} to={D(1188, 280)} bend={-160} color="#22c55e" label="edit_file" />
          <Signal t={t} a={35.6} b={36.0} from={D(420, 760)} to={D(1188, 640)} bend={-120} color="#22c55e" label="finish_task" />
          <Signal t={t} a={36.3} b={36.8} from={D(1188, 640)} to={D(420, 760)} bend={-120} color="#ef4444" label="refused" />
          <Signal t={t} a={37.6} b={38.0} from={D(420, 760)} to={D(1188, 640)} bend={-120} color="#22c55e" label="run_tests" />
          <Signal t={t} a={38.7} b={39.2} from={D(1188, 640)} to={D(420, 760)} bend={-120} color="#3b82f6" label="42 passed" />
        </>
      )}
      <Burst t={t} at={38.4} x={D(1188, 0)[0]} y={D(0, 700)[1]} color="#22c55e" size={420} />
      <Burst t={t} at={33.4} x={D(1188, 0)[0]} y={D(0, 200)[1]} color="#22c55e" size={360} />

      {/* ---- Act 5: your AI ---- */}
      {t >= 49.8 && t < 54.6 && (
        <div className="fk-layer" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 50, opacity: env(t, 49.8, 54.6, 0.4), background: 'radial-gradient(60% 60% at 50% 40%, #0f1e38, #07090d 70%)' }}>
          <p style={{ fontSize: 84, fontWeight: 800, letterSpacing: '-0.045em', color: '#fff', textAlign: 'center', lineHeight: 1.05 }}>
            Works with the AI
            <br />
            you already use.
          </p>
          <div className="mf-chips">
            {['ChatGPT', 'Claude', 'Gemini', 'Perplexity', 'Kimi', 'Claude Desktop', 'Cursor', 'Cline'].map((n, i) => {
              const p = tw(t, 50.6 + i * 0.12, 51.1 + i * 0.12)
              return (
                <span key={n} className={i >= 5 ? 'is-mcp' : undefined} style={{ opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                  {n}
                </span>
              )
            })}
          </div>
          <p style={{ fontSize: 40, fontWeight: 650, color: '#4ade80', opacity: tw(t, 51.8, 52.4) }}>No API key. No new model.</p>
        </div>
      )}

      {!clean && <Chapter t={t} items={CHAPTERS} />}
      {!clean && <Caption t={t} lines={CAPTIONS} />}
      {t >= 54.0 && (
        <EndCard t={t} at={54.5} mark={<MedMark />} name="Mediator" line="Turn your AI chat into a coding agent." sub="Local-first agent runtime · Access by request" />
      )}
      <div className="fk-flash" style={{ zIndex: 70, background: '#000', opacity: Math.max(1 - tw(t, 0, 0.5), tw(t, 57.3, 58)) }} />
    </div>
  )
}
