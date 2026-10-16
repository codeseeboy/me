import type { ReactNode } from 'react'

/*
 * The laptop side of Privacy Guardian, redrawn from the product itself:
 * the extension's lock page (ext/pg-ext/blocked.html + styles.css), the
 * blocker's launch dialog (crates/pg-blocker) and what Windows shows for a
 * locked folder. Words are the product's own.
 */

export function PgMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        <linearGradient id="pgx-mark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8b6bff" />
          <stop offset="1" stopColor="#4a2fc0" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="24" fill="url(#pgx-mark)" />
      <path d="M50 16 L78 25 V50 C78 69 65 81 50 88 C35 81 22 69 22 50 V25 Z" fill="#fff" />
      <circle cx="50" cy="46" r="8" fill="#5b3fd0" />
      <path d="M46 51 L44 64 H56 L54 51 Z" fill="#5b3fd0" />
    </svg>
  )
}

export function LockGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

export function PhoneGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  )
}

export function CheckGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export function FingerprintGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
      <path d="M6.5 7.5a7 7 0 0 1 11 0" />
      <path d="M5 11a7 7 0 0 1 14 0v1.5" />
      <path d="M8 19c1-1.5 1.5-3.5 1.5-6.5a2.5 2.5 0 0 1 5 0c0 3-.5 5.5-1.5 7.5" />
      <path d="M12 12.5c0 3-.6 5.6-1.8 7.5" />
      <path d="M16.6 16.5c.3-1.2.4-2.5.4-4" />
    </svg>
  )
}

export type Tab = { id: string; title: string; color: string }

/** A Chrome window. */
export function Browser({
  tabs,
  active,
  url,
  onTab,
  children,
  incognito,
  className = '',
}: {
  tabs: Tab[]
  active: string
  url: string
  onTab?: (id: string) => void
  children: ReactNode
  incognito?: boolean
  className?: string
}) {
  return (
    <div className={`pgx-browser${incognito ? ' pgx-browser--incog' : ''} ${className}`.trim()}>
      <div className="pgx-browser__top">
        <span className="pgx-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <div className="pgx-tabs" role={onTab ? 'tablist' : undefined}>
          {tabs.map((t) => {
            const on = t.id === active
            const inner = (
              <>
                <i className="pgx-fav" style={{ background: t.color }} />
                <span>{t.title}</span>
              </>
            )
            return onTab ? (
              <button key={t.id} type="button" role="tab" aria-selected={on} className={`pgx-tab${on ? ' is-on' : ''}`} onClick={() => onTab(t.id)}>
                {inner}
              </button>
            ) : (
              <span key={t.id} className={`pgx-tab${on ? ' is-on' : ''}`}>
                {inner}
              </span>
            )
          })}
        </div>
      </div>
      <div className="pgx-browser__bar">
        <span className="pgx-omni">
          <LockGlyph className="pgx-omni__ic" />
          {url}
        </span>
      </div>
      <div className="pgx-browser__body">{children}</div>
    </div>
  )
}

/**
 * The lock page the extension shows in place of a protected site. The real
 * block is the browser's own policy; this page only explains it and offers
 * the ways to unlock.
 */
export function LockPage({
  host,
  state = 'form',
  onPhone,
}: {
  host: string
  state?: 'form' | 'phone' | 'success'
  onPhone?: () => void
}) {
  return (
    <div className="pgx-lockpage">
      <div className="pgx-lockcard">
        <span className="pgx-lockcard__icon">
          <LockGlyph />
        </span>
        <span className="pgx-lockcard__badge">Private</span>
        <h4>This page is locked</h4>
        <p className="pgx-lockcard__sub">
          This is locked. Please enter the password or contact Shashikant to unlock it, or approve from your phone.
        </p>
        <div className="pgx-lockcard__url">{host}</div>

        {state === 'form' && (
          <>
            <span className="pgx-lockcard__label">Password</span>
            <span className="pgx-lockcard__input">Enter your Privacy Guardian password</span>
            <div className="pgx-lockcard__actions">
              <span className="pgx-btn pgx-btn--primary">Unlock</span>
              <span className="pgx-btn">Go back</span>
            </div>
            {onPhone && (
              <button type="button" className="pgx-lockcard__phone" onClick={onPhone}>
                <PhoneGlyph /> Approve from my phone instead
              </button>
            )}
          </>
        )}

        {state === 'phone' && (
          <div className="pgx-lockcard__wait">
            <span className="pgx-lockcard__pulse">
              <PhoneGlyph />
            </span>
            <strong>Waiting for approval from your phone…</strong>
            <span>Open Privacy Guardian on your phone and approve this request.</span>
          </div>
        )}

        {state === 'success' && (
          <div className="pgx-lockcard__ok">
            <span>
              <CheckGlyph />
            </span>
            <strong>Unlocked. Opening…</strong>
          </div>
        )}
      </div>
    </div>
  )
}

/** A neutral chat web app — what is on the other side of the lock. */
export function ChatSite({ accent = '#25a36a' }: { accent?: string }) {
  return (
    <div className="pgx-site">
      <div className="pgx-site__list">
        {['Mom', 'Project group', 'Rahul', 'Placement cell', 'Priya'].map((n, i) => (
          <div key={n} className={`pgx-site__row${i === 1 ? ' is-on' : ''}`}>
            <i style={{ background: i === 1 ? accent : undefined }} />
            <span>
              <b>{n}</b>
              <small>{['Call me when free', 'Submission is at 5', 'Bro send the notes', 'Shortlist is out', 'Where are you?'][i]}</small>
            </span>
          </div>
        ))}
      </div>
      <div className="pgx-site__thread">
        <span className="pgx-bubble">Submission is at 5 today</span>
        <span className="pgx-bubble pgx-bubble--me">I’ll push the final build by 4</span>
        <span className="pgx-bubble">Send me the report too</span>
        <span className="pgx-bubble pgx-bubble--me">Sharing the drive link now</span>
      </div>
    </div>
  )
}

export function MailSite() {
  return (
    <div className="pgx-mail">
      {[
        ['Placement Cell', 'Interview schedule — final round'],
        ['Bank', 'Your statement for September'],
        ['GitHub', 'Security alert on your repository'],
        ['Professor', 'Re: project report feedback'],
        ['Drive', 'Passport.pdf was shared with you'],
      ].map(([from, subject], i) => (
        <div key={i} className="pgx-mail__row">
          <b>{from}</b>
          <span>{subject}</span>
        </div>
      ))}
    </div>
  )
}

export function VideoSite() {
  return (
    <div className="pgx-video">
      {Array.from({ length: 6 }, (_, i) => (
        <span key={i}>
          <i />
          <b />
        </span>
      ))}
    </div>
  )
}

/** The dialog crates/pg-blocker shows when a locked program is started. */
export function BlockedLaunch({ exe = 'Code.exe' }: { exe?: string }) {
  return (
    <div className="pgx-windlg" role="img" aria-label={`${exe} is in your private environment and did not start.`}>
      <div className="pgx-windlg__bar">Privacy Guardian</div>
      <div className="pgx-windlg__body">
        <span className="pgx-windlg__ic">
          <LockGlyph />
        </span>
        <p>
          {exe} is in your private environment and did not start.
          <br />
          <br />
          Open Privacy Guardian and unlock it to use this application.
        </p>
      </div>
      <div className="pgx-windlg__foot">
        <span>OK</span>
      </div>
    </div>
  )
}

export function Terminal({ lines }: { lines: ReactNode[] }) {
  return (
    <div className="pgx-term">
      <div className="pgx-term__bar">Windows PowerShell</div>
      <pre>
        {lines.map((l, i) => (
          <span key={i}>{l}</span>
        ))}
      </pre>
    </div>
  )
}

export function Explorer() {
  return (
    <div className="pgx-explorer">
      <div className="pgx-explorer__bar">
        <span>This PC</span>›<span>Documents</span>
      </div>
      <div className="pgx-explorer__grid">
        {['Projects', 'Private', 'College', 'Photos'].map((f) => (
          <span key={f} className={`pgx-folder${f === 'Private' ? ' is-sel' : ''}`}>
            <i />
            {f}
          </span>
        ))}
      </div>
      <div className="pgx-windlg pgx-windlg--small">
        <div className="pgx-windlg__bar">Private</div>
        <div className="pgx-windlg__body">
          <span className="pgx-windlg__ic pgx-windlg__ic--deny">✕</span>
          <p>Access is denied.</p>
        </div>
      </div>
    </div>
  )
}

export function ProfilePicker() {
  return (
    <div className="pgx-profiles">
      <p className="pgx-profiles__h">Who’s using Chrome?</p>
      <div className="pgx-profiles__row">
        {[
          ['Work', true],
          ['Personal', true],
          ['Guest', false],
        ].map(([n, locked]) => (
          <span key={n as string} className={`pgx-avatar${locked ? ' is-locked' : ''}`}>
            <i>
              {(n as string)[0]}
              {locked ? (
                <b>
                  <LockGlyph />
                </b>
              ) : null}
            </i>
            {n as string}
          </span>
        ))}
      </div>
    </div>
  )
}

export function Laptop({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`pgx-laptop ${className}`.trim()}>
      <div className="pgx-laptop__lid">
        <div className="pgx-laptop__screen">{children}</div>
      </div>
      <div className="pgx-laptop__base" />
    </div>
  )
}
