import type { ReactNode } from 'react'

/*
 * Mediator, redrawn from the product: the tool-call fence the extension
 * parses (extension/content/parser.js), the result frame it injects
 * (content/provider.js), the extension popup and the control center
 * (ui/src/dashboard). Labels are the product's own.
 */

export function MedMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 66 V22 L45 42" stroke="currentColor" />
        <path d="M85 66 V22 L55 42" stroke="currentColor" />
        <path d="M55 58 L80 76" stroke="currentColor" />
        <path d="M45 58 L20 76" stroke="#3b82f6" />
      </g>
      <path d="M50 42 L57 49 L50 56 L43 49 Z" fill="#3b82f6" />
    </svg>
  )
}

/** A browser tab with an AI chat in it, and the Mediator extension armed. */
export function ChatWindow({ url = 'chatgpt.com', children, footer }: { url?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="mdx-chat">
      <div className="mdx-chat__bar">
        <span className="mdx-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="mdx-chat__url">{url}</span>
        <span className="mdx-chat__ext" title="Mediator extension — armed on this tab">
          <MedMark />
          <i />
        </span>
      </div>
      <div className="mdx-chat__log">{children}</div>
      <div className="mdx-chat__composer">{footer ?? 'Message ChatGPT'}</div>
    </div>
  )
}

export function UserMsg({ children }: { children: ReactNode }) {
  return <div className="mdx-msg mdx-msg--user">{children}</div>
}

export function AiMsg({ children }: { children: ReactNode }) {
  return <div className="mdx-msg mdx-msg--ai">{children}</div>
}

export type Call = { tool: string; args?: Record<string, string> }

/** The one fenced block per turn that the extension turns into tool calls. */
export function Fence({ calls }: { calls: Call[] }) {
  return (
    <div className="mdx-fence">
      <div className="mdx-fence__head">
        <span>mediator</span>
        <i aria-hidden="true">⧉</i>
      </div>
      <pre>
        <span className="j-p">{'{'}</span>
        <span className="j-k">"v"</span>
        <span className="j-p">:</span>
        <span className="j-n">1</span>
        <span className="j-p">,</span>
        <span className="j-k">"calls"</span>
        <span className="j-p">:[</span>
        {calls.map((c, i) => (
          <span key={i}>
            {'\n  '}
            <span className="j-p">{'{'}</span>
            <span className="j-k">"id"</span>
            <span className="j-p">:</span>
            <span className="j-s">"c{i + 1}"</span>
            <span className="j-p">,</span>
            <span className="j-k">"tool"</span>
            <span className="j-p">:</span>
            <span className="j-t">"{c.tool}"</span>
            <span className="j-p">,</span>
            <span className="j-k">"args"</span>
            <span className="j-p">:{'{'}</span>
            {Object.entries(c.args ?? {}).map(([k, v], j) => (
              <span key={k}>
                {j ? <span className="j-p">,</span> : null}
                {k === '…' ? (
                  <span className="j-p">…</span>
                ) : (
                  <>
                    <span className="j-k">"{k}"</span>
                    <span className="j-p">:</span>
                    {v.startsWith('[') ? <span className="j-p">{v}</span> : <span className="j-s">"{v}"</span>}
                  </>
                )}
              </span>
            ))}
            <span className="j-p">{'}}'}</span>
          </span>
        ))}
        {'\n'}
        <span className="j-p">{']}'}</span>
      </pre>
    </div>
  )
}

/** What the extension types back into the conversation after a call runs. */
export function ResultMsg({ children, tone }: { children: ReactNode; tone?: 'ok' | 'bad' }) {
  return (
    <div className={`mdx-msg mdx-msg--user mdx-result${tone ? ` mdx-result--${tone}` : ''}`}>
      <span className="mdx-result__mark">--- MEDIATOR_TOOL_RESULT_OUTPUT ---</span>
      {children}
    </div>
  )
}

export function Typing() {
  return (
    <div className="mdx-typing" aria-label="The assistant is writing">
      <i />
      <i />
      <i />
    </div>
  )
}

/** The extension popup — where the loop is switched on, per tab. */
export function Popup() {
  return (
    <div className="mdx-popup">
      <div className="mdx-popup__head">
        <MedMark className="mdx-popup__mark" />
        <span>
          <b>Mediator</b>
          <small>AI agent runtime</small>
        </span>
        <em>v0.1.0</em>
      </div>
      <div className="mdx-popup__card mdx-popup__conn">
        <i />
        <span>
          <b>Connected</b>
          <small>C:\Users\you\projects\shop</small>
        </span>
      </div>
      <div className="mdx-popup__card">
        <div className="mdx-popup__row">
          <small className="mdx-popup__label">Agent on this tab</small>
          <span className="mdx-popup__chip">chatgpt</span>
        </div>
        <div className="mdx-popup__toggle">
          <span className="mdx-switch is-on">
            <i />
          </span>
          <b>Let the AI use your tools here</b>
        </div>
        <small className="mdx-popup__note">On. 13 tool calls so far.</small>
        <span className="mdx-popup__btn">→ Send setup message to the chat</span>
        <small className="mdx-popup__note">Do this once per conversation so the AI knows which tools it has.</small>
      </div>
      <span className="mdx-popup__primary">Open control center</span>
      <small className="mdx-popup__foot">Approvals, terminals, file changes and history live there.</small>
    </div>
  )
}

export function Terminal({ title = 'Your workspace · shop', children }: { title?: string; children: ReactNode }) {
  return (
    <div className="mdx-term">
      <div className="mdx-term__bar">
        <span className="mdx-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        {title}
      </div>
      <div className="mdx-term__body">{children}</div>
    </div>
  )
}

export function Diff({ lines }: { lines: [' ' | '+' | '-', string][] }) {
  return (
    <div className="mdx-diff">
      {lines.map(([k, t], i) => (
        <span key={i} className={k === '+' ? 'is-add' : k === '-' ? 'is-del' : undefined}>
          {k} {t}
        </span>
      ))}
    </div>
  )
}
