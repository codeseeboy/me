import type { ReactNode } from 'react'
import { MedMark } from '../../src/components/svc/med/Ui'

/*
 * Screens for the Mediator film, on a 1600×900 desktop: an AI chat in the
 * browser, a code editor, and either your own terminal (the manual loop) or
 * Mediator's control center (the loop without you). Strings that come from
 * the product — the tool-call fence, the result marker, phase labels, the
 * completion gate and the approval — are the product's own.
 */

export function Desktop({ children }: { children: ReactNode }) {
  return <div className="mf-desk">{children}</div>
}

/* ---------------- The chat ---------------- */

export function Chat({ children, composer, armed, sending }: { children: ReactNode; composer: ReactNode; armed?: boolean; sending?: boolean }) {
  return (
    <div className="mf-chat">
      <div className="mf-chat__tabs">
        <span className="mf-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="mf-chat__tab">ChatGPT</span>
      </div>
      <div className="mf-chat__bar">
        <span className="mf-chat__url">chatgpt.com</span>
        {armed !== undefined && (
          <span className={`mf-chat__ext${armed ? ' is-on' : ''}`}>
            <MedMark />
            <i />
          </span>
        )}
      </div>
      <div className="mf-chat__log">{children}</div>
      <div className={`mf-chat__composer${sending ? ' is-sending' : ''}`}>
        <span>{composer}</span>
        <b>↑</b>
      </div>
    </div>
  )
}

export function You({ children }: { children: ReactNode }) {
  return <div className="mf-msg mf-msg--you">{children}</div>
}

export function Ai({ children }: { children: ReactNode }) {
  return (
    <div className="mf-msg mf-msg--ai">
      <i className="mf-msg__avatar" />
      <div>{children}</div>
    </div>
  )
}

export function Code({ lines, copied, hover }: { lines: string[]; copied?: boolean; hover?: boolean }) {
  return (
    <div className="mf-code">
      <div className="mf-code__head">
        <span>python</span>
        <b className={hover ? 'is-hover' : undefined}>{copied ? '✓ Copied' : '⧉ Copy code'}</b>
      </div>
      <pre>{lines.join('\n')}</pre>
    </div>
  )
}

export type Call = { tool: string; args?: Record<string, string> }

/** The fenced block the extension turns into tool calls. */
export function Fence({ call }: { call: Call }) {
  const args = Object.entries(call.args ?? {})
  return (
    <div className="mf-code mf-fence">
      <div className="mf-code__head">
        <span>mediator</span>
      </div>
      <pre>
        <span className="j-p">{'{"v":1,"calls":[{'}</span>
        <span className="j-k">"tool"</span>
        <span className="j-p">:</span>
        <span className="j-t">"{call.tool}"</span>
        {args.map(([k, v]) => (
          <span key={k}>
            <span className="j-p">,</span>
            <span className="j-k">"{k}"</span>
            <span className="j-p">:</span>
            <span className="j-s">"{v}"</span>
          </span>
        ))}
        <span className="j-p">{'}]}'}</span>
      </pre>
    </div>
  )
}

/** What the extension types back into the chat after a call. */
export function Result({ tone, children }: { tone: 'ok' | 'bad' | 'info'; children: ReactNode }) {
  return (
    <div className={`mf-msg mf-msg--you mf-result mf-result--${tone}`}>
      <span>--- MEDIATOR_TOOL_RESULT_OUTPUT ---</span>
      {children}
    </div>
  )
}

export function Dots() {
  return (
    <div className="mf-typing">
      <i />
      <i />
      <i />
    </div>
  )
}

/* ---------------- The editor ---------------- */

export type Line = [string, ('add' | 'del' | 'sel' | '')?]

export function Editor({ lines, modified, focus, by }: { lines: Line[]; modified?: boolean; focus?: boolean; by?: string }) {
  return (
    <div className={`mf-ed${focus ? ' is-focus' : ''}`}>
      <div className="mf-ed__title">
        <span className="mf-dots">
          <i />
          <i />
          <i />
        </span>
        session.py — shop
      </div>
      <div className="mf-ed__body">
        <div className="mf-ed__tree">
          <small>EXPLORER</small>
          <span>▾ src</span>
          <span>&nbsp;&nbsp;▾ auth</span>
          <span className="is-on">&nbsp;&nbsp;&nbsp;&nbsp;session.py</span>
          <span>&nbsp;&nbsp;&nbsp;&nbsp;tokens.py</span>
          <span>▾ tests</span>
          <span>&nbsp;&nbsp;test_auth.py</span>
        </div>
        <div className="mf-ed__main">
          <div className="mf-ed__tab">
            session.py {modified ? <b>●</b> : null}
            {by ? <em>{by}</em> : null}
          </div>
          <pre className="mf-ed__code">
            {lines.map(([text, kind], i) => (
              <span key={i} className={kind ? `is-${kind}` : undefined}>
                <i>{i + 1}</i>
                {text}
              </span>
            ))}
          </pre>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Your terminal / Mediator ---------------- */

export function Terminal({ children, focus }: { children: ReactNode; focus?: boolean }) {
  return (
    <div className={`mf-term${focus ? ' is-focus' : ''}`}>
      <div className="mf-term__head">TERMINAL</div>
      <pre className="mf-term__body">{children}</pre>
    </div>
  )
}

export type Tone = 'busy' | 'ok' | 'wait' | 'bad'

export function MediatorPanel({ phase, detail, tone, children }: { phase: string; detail?: string; tone: Tone; children: ReactNode }) {
  return (
    <div className="mf-med">
      <div className="mf-med__head">
        <MedMark className="mf-med__mark" />
        <b>Mediator</b>
        <span className={`mf-phase mf-phase--${tone}`}>
          <i />
          {phase}
          {detail ? <em>{detail}</em> : null}
        </span>
      </div>
      <div className="mf-med__body">{children}</div>
    </div>
  )
}

export function Activity({ rows }: { rows: [string, string, ('ok' | 'bad' | 'wait' | '')?][] }) {
  return (
    <div className="mf-act">
      {rows.map(([tool, text, tone], i) => (
        <div key={i} className="mf-act__row">
          <code className={`mf-tool${tone ? ` mf-tool--${tone}` : ''}`}>{tool}</code>
          <span>{text}</span>
        </div>
      ))}
    </div>
  )
}

export function Verification({ rows }: { rows: [string, string, 'ok' | 'warn' | 'bad' | 'none'][] }) {
  return (
    <div className="mf-ver">
      <small>VERIFICATION</small>
      {rows.map(([k, v, c]) => (
        <div key={k} className={`mf-ver__row is-${c}`}>
          <i>{c === 'ok' ? '✓' : c === 'bad' ? '✕' : c === 'warn' ? '!' : '○'}</i>
          {k}
          <b>{v}</b>
        </div>
      ))}
    </div>
  )
}

export function Approval({ decided }: { decided?: 'deny' | 'allow' }) {
  return (
    <div className={`mf-approve${decided ? ' is-decided' : ''}`}>
      <h5>
        Permission needed <span>significant</span>
      </h5>
      <p>force-push overwrites remote history; confirm intent</p>
      <code>git push --force origin main</code>
      <div>
        <span className="mf-btn mf-btn--go">Allow</span>
        <span className={`mf-btn${decided === 'deny' ? ' is-pressed' : ''}`}>Don’t allow</span>
        <small>Remember for this session</small>
      </div>
      {decided === 'deny' && <strong className="mf-approve__out">Denied — nothing ran.</strong>}
    </div>
  )
}
