import type { ReactNode } from 'react'
import { LockGlyph, PgMark, PhoneGlyph, CheckGlyph, FingerprintGlyph } from '../../src/components/svc/pg/Ui'

/*
 * Screens for the Privacy Guardian film, at film size: the laptop's
 * 1024×640 desktop and the phone app. Same product, larger type, so a
 * viewer can read what is on screen. Product strings are the product's own.
 */

export type Tab = { id: string; title: string; color: string }

export function Chrome({ tabs, active, url, incog, children }: { tabs: Tab[]; active: string; url: string; incog?: boolean; children: ReactNode }) {
  return (
    <div className={`ps-chrome${incog ? ' ps-chrome--incog' : ''}`}>
      <div className="ps-chrome__top">
        <span className="ps-dots">
          <i />
          <i />
          <i />
        </span>
        {tabs.map((t) => (
          <span key={t.id} className={`ps-tab${t.id === active ? ' is-on' : ''}`}>
            <i style={{ background: t.color }} />
            {t.title}
          </span>
        ))}
      </div>
      <div className="ps-chrome__bar">
        <span className="ps-omni">
          <LockGlyph className="ps-omni__ic" />
          {url}
        </span>
      </div>
      <div className="ps-chrome__body">{children}</div>
    </div>
  )
}

const CHATS: [string, string][] = [
  ['Priya', 'Don’t tell anyone yet!!'],
  ['Mom', 'Did you eat?'],
  ['Project group', 'Submission is at 5'],
  ['Rahul', 'Bro send the notes'],
  ['Placement cell', 'Shortlist is out'],
]

/** WhatsApp Web: chats on the left; with `open`, Priya's conversation. */
export function Chats({ open, bubbles = 4 }: { open: boolean; bubbles?: number }) {
  const msgs: [boolean, string][] = [
    [false, 'Don’t tell anyone yet!!'],
    [false, 'I got the offer from the Pune company 🎉'],
    [true, 'Whaaat congrats!! Party tonight?'],
    [false, 'Only if you keep it secret till Monday'],
  ]
  return (
    <div className="ps-chats">
      <div className="ps-chats__list">
        {CHATS.map(([n, m], i) => (
          <div key={n} className={`ps-chats__row${open && i === 0 ? ' is-on' : ''}`}>
            <i style={{ background: ['#f9a8d4', '#fcd34d', '#86efac', '#93c5fd', '#c4b5fd'][i] }} />
            <span>
              <b>{n}</b>
              <small>{m}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="ps-chats__thread">
        {open ? (
          <>
            <div className="ps-chats__head">
              <i />
              <b>Priya</b>
            </div>
            {msgs.slice(0, bubbles).map(([me, text], i) => (
              <span key={i} className={`ps-bubble${me ? ' is-me' : ''}`}>
                {text}
              </span>
            ))}
          </>
        ) : (
          <div className="ps-chats__empty">Select a chat</div>
        )}
      </div>
    </div>
  )
}

export function Inbox() {
  const rows: [string, string, boolean][] = [
    ['HDFC Bank', 'Your account statement for September', true],
    ['Placement Cell', 'Offer letter — please sign and return', true],
    ['Google Drive', 'Passport.pdf was shared with you', false],
    ['Prof. Mehta', 'Re: internal marks and attendance', false],
    ['GitHub', 'A new sign-in to your account', false],
  ]
  return (
    <div className="ps-inbox">
      <div className="ps-inbox__h">Inbox</div>
      {rows.map(([from, subject, unread]) => (
        <div key={from} className={`ps-inbox__row${unread ? ' is-unread' : ''}`}>
          <b>{from}</b>
          <span>{subject}</span>
        </div>
      ))}
    </div>
  )
}

/** The extension's lock page, at film size. */
export function Locked({ host, state = 'form' }: { host: string; state?: 'form' | 'phone' | 'ok' }) {
  return (
    <div className="ps-lock">
      <div className="ps-lock__card">
        <span className="ps-lock__ic">
          <LockGlyph />
        </span>
        <span className="ps-lock__badge">Private</span>
        <h4>This page is locked</h4>
        <div className="ps-lock__url">{host}</div>
        {state === 'form' && (
          <>
            <span className="ps-lock__input">Enter your Privacy Guardian password</span>
            <span className="ps-lock__btn">Unlock</span>
          </>
        )}
        {state === 'phone' && (
          <div className="ps-lock__wait">
            <PhoneGlyph />
            Waiting for approval from your phone…
          </div>
        )}
        {state === 'ok' && (
          <div className="ps-lock__ok">
            <CheckGlyph />
            Unlocked. Opening…
          </div>
        )}
      </div>
    </div>
  )
}

export function Video() {
  return (
    <div className="ps-video">
      <div className="ps-video__player">
        <span className="ps-video__play" />
        <span className="ps-video__bar">
          <i />
        </span>
      </div>
      <b>Lo-fi beats to study to</b>
      <span>1.2M views · streaming now</span>
    </div>
  )
}

/** The Windows desktop, with the Start menu searching for an app. */
export function Desktop({ children, start, query = '' }: { children?: ReactNode; start?: boolean; query?: string }) {
  return (
    <div className="ps-desk">
      {start && (
        <div className="ps-start">
          <div className="ps-start__search">{query || 'Search for apps, settings and documents'}</div>
          {query.length > 2 && (
            <div className="ps-start__hit">
              <i />
              <span>
                <b>WhatsApp</b>
                <small>App</small>
              </span>
            </div>
          )}
        </div>
      )}
      {children}
      <div className="ps-taskbar">
        <i className="is-win" />
        <i />
        <i />
        <i />
        <i />
      </div>
    </div>
  )
}

/** The dialog pg-blocker shows when a locked program is started. */
export function Blocked({ exe }: { exe: string }) {
  return (
    <div className="ps-dlg">
      <div className="ps-dlg__bar">Privacy Guardian</div>
      <div className="ps-dlg__body">
        <span className="ps-dlg__ic">
          <LockGlyph />
        </span>
        <p>
          {exe} is in your private environment and did not start.
          <br />
          <br />
          Open Privacy Guardian and unlock it to use this application.
        </p>
      </div>
      <div className="ps-dlg__foot">
        <span>OK</span>
      </div>
    </div>
  )
}

export function Folder({ denied }: { denied?: boolean }) {
  return (
    <div className="ps-explorer">
      <div className="ps-explorer__bar">This PC › Documents</div>
      <div className="ps-explorer__grid">
        {['College', 'Private', 'Photos', 'Projects'].map((f) => (
          <span key={f} className={`ps-folder${f === 'Private' ? ' is-sel' : ''}`}>
            <i />
            {f}
          </span>
        ))}
      </div>
      {denied && (
        <div className="ps-dlg ps-dlg--small">
          <div className="ps-dlg__bar">Private</div>
          <div className="ps-dlg__body">
            <span className="ps-dlg__ic is-deny">✕</span>
            <p>Access is denied.</p>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The phone                                                           */
/* ------------------------------------------------------------------ */

export function Phone({ children, style }: { children: ReactNode; style?: React.CSSProperties }) {
  return (
    <div className="ps-phone" style={style}>
      <div className="ps-phone__screen">
        <div className="ps-phone__status">
          <span>4:14</span>
          <i />
          <span className="ps-phone__sys">
            <b />
            <b />
            <b />
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

export function AppBar() {
  return (
    <div className="ps-bar">
      <PgMark className="ps-bar__mark" />
      <span>
        <small>Privacy Guardian</small>
        <strong>My Laptop</strong>
      </span>
    </div>
  )
}

export function Pill({ kind, children }: { kind: 'ok' | 'open' | 'live'; children: ReactNode }) {
  return <span className={`ps-pill ps-pill--${kind}`}>{children}</span>
}

/** Home, condensed: where the laptop stands, what is open, the one-tap lock. */
export function HomeScreen({ locked, pressed }: { locked: boolean; pressed?: boolean }) {
  return (
    <div className="ps-scr">
      <AppBar />
      <div className="ps-card">
        <div className="ps-card__row">
          <Pill kind="ok">Protected</Pill>
          <small>Just now</small>
        </div>
        <h5>Protected</h5>
        <p>{locked ? 'College mode. Everything is locked.' : '2 resources temporarily unlocked.'}</p>
      </div>
      <span className={`ps-btn ps-btn--lock${pressed ? ' is-pressed' : ''}`}>
        <LockGlyph /> {pressed && !locked ? 'Locking…' : 'Lock Private'}
      </span>
      <h6 className="ps-sec">Browser tabs</h6>
      {[
        ['Priya — WhatsApp', 'web.whatsapp.com'],
        ['Inbox (2) — Gmail', 'mail.google.com'],
      ].map(([n, u]) => (
        <div className="ps-card ps-row" key={n}>
          <span>
            <strong>{locked ? 'Locked — Privacy Guardian' : n}</strong>
            <small>{u}</small>
          </span>
          <span className="ps-mini">Close</span>
        </div>
      ))}
      <h6 className="ps-sec">Active access</h6>
      {locked ? (
        <p className="ps-empty">None — every grant was revoked.</p>
      ) : (
        ['WhatsApp', 'Gmail'].map((n) => (
          <div className="ps-card ps-row" key={n}>
            <span>
              <strong>{n}</strong>
              <small>Website</small>
            </span>
            <Pill kind="open">Unlocked</Pill>
          </div>
        ))
      )}
    </div>
  )
}

/** The Protected list, with an unlock request in progress. */
export function UnlockScreen({ sheet, progress, done }: { sheet: boolean; progress: number; done: boolean }) {
  return (
    <div className="ps-scr">
      <div className="ps-title">Protected</div>
      {[
        ['WhatsApp', 'Website', done],
        ['Gmail', 'Website', false],
        ['Private', 'Folder', false],
        ['WhatsApp.exe', 'Application', false],
      ].map(([n, k, open]) => (
        <div className="ps-card ps-row" key={n as string}>
          <span>
            <strong>{n as string}</strong>
            <small>{k as string}</small>
          </span>
          {open ? <Pill kind="open">Unlocked</Pill> : n === 'WhatsApp' ? <span className="ps-mini ps-mini--go">Unlock</span> : <Pill kind="ok">Locked</Pill>}
        </div>
      ))}
      {sheet && (
        <div className="ps-scrim">
          <div className="ps-sheet">
            <span className="ps-sheet__grip" />
            <strong>{done ? 'Approved' : 'Authentication required'}</strong>
            <span>Approve access to WhatsApp on My Laptop</span>
            <span className={`ps-fp${done ? ' is-done' : ''}`} style={{ ['--p' as string]: progress }}>
              <FingerprintGlyph />
            </span>
            <small>{done ? 'Signed for this request only' : 'Touch the fingerprint sensor'}</small>
          </div>
        </div>
      )}
    </div>
  )
}

export function Toast({ children }: { children: ReactNode }) {
  return <div className="ps-toast">{children}</div>
}
