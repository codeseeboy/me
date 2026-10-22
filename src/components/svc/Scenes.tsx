import type { CSSProperties, ReactNode } from 'react'
import { Stage } from '../show/Stage'
import './scenes.css'

/*
 * The feature panels' pictures: real screens, drawn at a fixed design size
 * and scaled by <Stage>. Every message is the product's own wording —
 * pg-blocker's message box, Windows' own errors, Mediator's completion
 * check, the phone app's "What is open" sheet.
 */

const W = 760
const H = 520

const d = (n: number) => ({ ['--d' as string]: n }) as CSSProperties

function Scene({ children }: { children: ReactNode }) {
  return (
    <Stage w={W} h={H} pad={0.06}>
      <div className="scn">{children}</div>
    </Stage>
  )
}

/** A Windows 11 title bar: icon, title, and the three caption buttons. */
function WinBar({ title, icon, dark = false }: { title: string; icon?: ReactNode; dark?: boolean }) {
  return (
    <div className={`scn-bar${dark ? ' scn-bar--dark' : ''}`}>
      {icon}
      <span className="scn-bar__t">{title}</span>
      <span className="scn-bar__btns" aria-hidden="true">
        <i className="min" />
        <i className="max" />
        <i className="x" />
      </span>
    </div>
  )
}

function Lock({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  )
}

/** The message pg-blocker shows when a protected app is launched (crates/pg-blocker). */
function BlockedBox({ app, style }: { app: string; style?: CSSProperties }) {
  return (
    <div className="scn-win scn-msg scn-in" style={style}>
      <WinBar title="Privacy Guardian" />
      <div className="scn-msg__body">
        <span className="scn-msg__i">i</span>
        <p>
          {app} is in your private environment and did not start.
          <br />
          <br />
          Open Privacy Guardian and unlock it to use this application.
        </p>
      </div>
      <div className="scn-msg__foot">
        <span className="scn-btn scn-btn--primary">OK</span>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Privacy Guardian                                                    */
/* ------------------------------------------------------------------ */

/** Three ways in — an Incognito tab, the app, the folder — and the same lock on each. */
export function EveryWayIn() {
  return (
    <Scene>
      <span className="scn-tag scn-in" style={{ left: 0, top: 0, ...d(0) }}>
        Website · even Incognito
      </span>
      <div className="scn-win scn-chrome scn-in" style={{ left: 0, top: 26, width: 500, height: 290, ...d(0) }}>
        <div className="scn-chrome__tabs">
          <span className="scn-chrome__tab">
            <i className="incog" />
            New Incognito tab
          </span>
          <span className="scn-bar__btns" aria-hidden="true">
            <i className="min" />
            <i className="max" />
            <i className="x" />
          </span>
        </div>
        <div className="scn-chrome__url">
          <Lock size={12} /> web.whatsapp.com
        </div>
        <div className="scn-chrome__page">
          <div className="scn-lock">
            <span className="scn-lock__ic">
              <Lock size={20} />
            </span>
            <span className="scn-lock__chip">Private</span>
            <b>This page is locked</b>
            <span className="scn-lock__field">web.whatsapp.com</span>
            <span className="scn-lock__field scn-lock__field--in">Enter your Privacy Guardian password</span>
            <span className="scn-lock__btn">Unlock</span>
          </div>
        </div>
      </div>

      <span className="scn-tag scn-in" style={{ left: 380, top: 86, ...d(1) }}>
        App · from the Start menu
      </span>
      <BlockedBox app="WhatsApp.exe" style={{ left: 380, top: 112, width: 380, ...d(1) }} />

      <span className="scn-tag scn-in" style={{ left: 220, top: 324, ...d(2) }}>
        Folder · any route
      </span>
      <div className="scn-win scn-err scn-in" style={{ left: 220, top: 350, width: 400, ...d(2) }}>
        <WinBar title="Location is not available" />
        <div className="scn-msg__body">
          <span className="scn-msg__i scn-msg__i--x">×</span>
          <p>
            D:\Private is not accessible.
            <br />
            <br />
            Access is denied.
          </p>
        </div>
        <div className="scn-msg__foot">
          <span className="scn-btn scn-btn--primary">OK</span>
        </div>
      </div>
    </Scene>
  )
}

/** Stop the service; the app still does not start, because Windows holds the lock. */
export function BuiltToHold() {
  return (
    <Scene>
      <div className="scn-win scn-term scn-in" style={{ left: 0, top: 0, width: 640, height: 400, ...d(0) }}>
        <div className="scn-term__tabs">
          <span className="scn-term__tab">
            <i />
            Administrator: Windows PowerShell
          </span>
          <span className="scn-bar__btns scn-bar__btns--dark" aria-hidden="true">
            <i className="min" />
            <i className="max" />
            <i className="x" />
          </span>
        </div>
        <pre className="scn-term__body">
          <span className="p">PS C:\&gt;</span> Stop-Service PrivacyGuardian{'\n'}
          <span className="p">PS C:\&gt;</span> Get-Service PrivacyGuardian{'\n'}
          {'\n'}
          <span className="h">Status   Name               DisplayName</span>
          {'\n'}
          <span className="h">------   ----               -----------</span>
          {'\n'}
          <span className="w">Stopped</span>  PrivacyGuardian    Privacy Guardian{'\n'}
          {'\n'}
          <span className="p">PS C:\&gt;</span> Start-Process WhatsApp.exe{'\n'}
          <span className="p">PS C:\&gt;</span> <i className="caret" />
        </pre>
      </div>
      <BlockedBox app="WhatsApp.exe" style={{ left: 330, top: 250, width: 420, ...d(2) }} />
    </Scene>
  )
}

/** The Live Desktop film's still, as a door to its own page. */
export function LivePoster() {
  return (
    <Scene>
      <figure className="scn-poster scn-in" style={d(0)}>
        <img src="/videos/live-desktop.jpg" alt="" loading="lazy" />
      </figure>
    </Scene>
  )
}

/* ------------------------------------------------------------------ */
/* Mediator                                                            */
/* ------------------------------------------------------------------ */

const ACTIVITY: [string, string, string, 'ran' | 'ask' | 'deny' | 'block' | 'save'][] = [
  ['run_tests', 'pytest tests', 'Ran', 'ran'],
  ['checkpoint', 'before edit_file · session.py', 'Saved', 'save'],
  ['run_command', 'pip install requests', 'Asked you', 'ask'],
  ['run_command', 'git push --force origin main', 'You said no', 'deny'],
  ['read_file', '../../.ssh/id_rsa', 'Outside the project', 'block'],
  ['run_command', 'rm -rf /', 'Blocked', 'block'],
]

/** Mediator's control center: every tool call, and what the policy did with it. */
export function PolicyLog() {
  return (
    <Scene>
      <div className="scn-win scn-cc scn-in" style={{ left: 20, top: 10, width: 720, height: 470, ...d(0) }}>
        <div className="scn-cc__bar">
          <span className="scn-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="scn-cc__url">127.0.0.1:8765 · Mediator</span>
        </div>
        <div className="scn-cc__head">
          <b>Activity</b>
          <span>shop · mode: ask</span>
        </div>
        <ol className="scn-cc__list">
          {ACTIVITY.map(([tool, arg, verdict, tone], i) => (
            <li key={arg} className="scn-in" style={d(1 + i * 0.5)}>
              <code className="scn-cc__tool">{tool}</code>
              <code className="scn-cc__arg">{arg}</code>
              <span className={`scn-badge scn-badge--${tone}`}>{verdict}</span>
            </li>
          ))}
        </ol>
      </div>
    </Scene>
  )
}

/** The AI says it is done; Mediator's completion check says it is not — in its own words. */
export function NotDoneYet() {
  return (
    <Scene>
      <div className="scn-win scn-chat scn-in" style={{ left: 40, top: 0, width: 680, height: 500, ...d(0) }}>
        <div className="scn-cc__bar">
          <span className="scn-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="scn-cc__url">chatgpt.com</span>
        </div>
        <div className="scn-chat__log">
          <p className="scn-chat__ai scn-in" style={d(0.5)}>
            Fixed the expiry check. Marking the task as done.
          </p>
          <code className="scn-chat__call scn-in" style={d(1)}>
            {'{"tool":"finish_task"}'}
          </code>
          <div className="scn-chat__res is-bad scn-in" style={d(2)}>
            <b>NOT COMPLETE — Mediator will not record this task as done yet.</b>
            <span>1. files changed after the last verification, so nothing has exercised the current code</span>
            <span>&nbsp;&nbsp;&nbsp;→ Re-run the tests or build now that the latest edits are in place.</span>
          </div>
          <p className="scn-chat__ai scn-in" style={d(3)}>
            Running the tests first.
          </p>
          <code className="scn-chat__call scn-in" style={d(3.5)}>
            {'{"tool":"run_tests","path":"tests"}'}
          </code>
          <div className="scn-chat__res is-ok scn-in" style={d(4.5)}>
            <span>run_tests: 42 passed</span>
          </div>
        </div>
      </div>
    </Scene>
  )
}

/** Plugged into an MCP client: the config from docs/17_MCP_QUICKSTARTS.md. */
export function McpConfig() {
  return (
    <Scene>
      <div className="scn-win scn-code scn-in" style={{ left: 20, top: 20, width: 720, height: 440, ...d(0) }}>
        <div className="scn-code__tabs">
          <span className="scn-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span className="scn-code__tab">claude_desktop_config.json</span>
        </div>
        <pre className="scn-code__body">
          {[
            ['{'],
            ['  ', ['k', '"mcpServers"'], ': {'],
            ['    ', ['k', '"mediator"'], ': {'],
            ['      ', ['k', '"command"'], ': ', ['s', '"python"'], ','],
            ['      ', ['k', '"args"'], ': ['],
            ['        ', ['s', '"-m"'], ', ', ['s', '"mediator.mcp.stdio"'], ','],
            ['        ', ['s', '"--workspace"'], ', ', ['s', '"C:\\\\path\\\\to\\\\project"'], ','],
            ['        ', ['s', '"--mode"'], ', ', ['s', '"ask"']],
            ['      ]'],
            ['    }'],
            ['  }'],
            ['}'],
          ].map((line, i) => (
            <span key={i} className="scn-code__ln">
              <i>{i + 1}</i>
              {line.map((part, j) =>
                typeof part === 'string' ? (
                  <span key={j}>{part}</span>
                ) : (
                  <span key={j} className={part[0]}>
                    {part[1]}
                  </span>
                ),
              )}
            </span>
          ))}
        </pre>
      </div>
      <div className="scn-clients scn-in" style={d(2)}>
        {['Claude Desktop', 'Cursor', 'Cline'].map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
    </Scene>
  )
}

/* ------------------------------------------------------------------ */
/* Live Desktop                                                        */
/* ------------------------------------------------------------------ */

/** A phone in the scene, with the same titanium band as the product mockups. */
function Phone({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div className="scn-phone scn-in" style={style}>
      <div className="scn-phone__screen">
        <div className="scn-phone__status">
          <span>4:14</span>
          <i />
          <span className="scn-phone__sys" />
        </div>
        {children}
      </div>
    </div>
  )
}

/** No picture is better than a wrong one: the phone app's own message (live_desktop_screen.dart). */
export function HonestSheet() {
  return (
    <Scene>
      <Phone style={{ left: 250, top: 0, ...d(0) }}>
        <div className="scn-live__bar">
          <b>Live Desktop</b>
          <span>1920x1080 • 14 FPS • 62ms</span>
        </div>
        <div className="scn-live__sheet scn-in" style={d(1.2)}>
          <span className="scn-live__grip" />
          <b className="scn-live__h">What is open</b>
          <span className="scn-live__k">Open applications</span>
          <p className="scn-live__card">
            The laptop could not list what is open. That usually means the desktop helper is not running — nothing is
            shown rather than the wrong thing.
          </p>
        </div>
      </Phone>
    </Scene>
  )
}

/** Phone and laptop both dial out to a relay that only ever carries ciphertext. */
export function RelayPath() {
  return (
    <Scene>
      <div className="scn-relay">
        <div className="scn-relay__node scn-in" style={d(0)}>
          <span className="scn-relay__dev scn-relay__dev--laptop">
            <i />
          </span>
          <b>Your laptop</b>
          <small>helper in your own session</small>
        </div>
        <div className="scn-relay__node scn-relay__node--mid scn-in" style={d(1)}>
          <span className="scn-relay__hub">
            <Lock size={26} />
          </span>
          <b>Relay</b>
          <small>sees only ciphertext</small>
        </div>
        <div className="scn-relay__node scn-in" style={d(2)}>
          <span className="scn-relay__dev scn-relay__dev--phone">
            <i />
          </span>
          <b>Your phone</b>
          <small>the one you paired</small>
        </div>
        <svg className="scn-relay__wire" viewBox="0 0 760 520" aria-hidden="true">
          <path d="M265 279 C 300 279, 300 246, 338 246" />
          <path d="M422 246 C 470 246, 500 266, 539 266" />
        </svg>
        {[0, 1, 2].map((i) => (
          <span key={i} className="scn-relay__pkt" style={d(i)}>
            8f3a…c2
          </span>
        ))}
      </div>
    </Scene>
  )
}
