import type { CSSProperties } from 'react'

/**
 * Splits a line into characters so each can hinge in on its own, a beat
 * after the one before it. Screen readers get the line once, as plain
 * text; the per-character spans are hidden from them.
 */
export default function SplitText({ text, offset = 0 }: { text: string; offset?: number }) {
  const words = text.split(' ')
  let i = offset
  return (
    <span className="split">
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((w, wi) => (
          <span key={wi}>
            <span className="split__word">
              {[...w].map((ch, ci) => (
                <span className="split__ch" style={{ '--c': i++ } as CSSProperties} key={ci}>
                  {ch}
                </span>
              ))}
            </span>
            {wi < words.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </span>
  )
}
