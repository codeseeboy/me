import type { ReactNode } from 'react'
import {
  CIVIC_STEPS,
  Civic,
  DESK_STEPS,
  Desk,
  GUARDIAN_STEPS,
  Guardian,
  MEDIATOR_STEPS,
  MediatorShow,
  NON8_STEPS,
  Non8,
} from '../src/components/show/Showcase'
import {
  CAREER_STEPS,
  CLAUSE_STEPS,
  CareerShow,
  ClauseShow,
  FORMULA_STEPS,
  FormulaShow,
  HEALTH_STEPS,
  HealthShow,
  SQL_STEPS,
  SqlShow,
  TRUST_STEPS,
  TrustShow,
} from '../src/components/show/More'
import '../src/components/show/show.css'
import '../src/components/show/products.css'
import '../src/components/show/more.css'

/*
 * The hero ring's cards: one portrait still per product — the product's own
 * screen, nothing written on top — rendered from the same components the
 * gallery animates, so the ring shows the real screens.
 *   npx remotion still remotion/index.ts Ring public/ring/non8.jpg --props='{"kind":"non8"}'
 */

export type RingKind = 'non8' | 'guardian' | 'mediator' | 'desk' | 'civic' | 'clause' | 'trust' | 'health' | 'formula' | 'career' | 'sql'

const last = (a: number[]) => a.length - 1

const BG: Record<RingKind, string> = {
  non8: '#f7f4ee',
  guardian: 'linear-gradient(170deg,#2a2150,#0b0a15)',
  mediator: '#ffffff',
  desk: '#1b2a35',
  civic: 'linear-gradient(170deg,#e3f1e8,#c9e2d3)',
  clause: '#ffffff',
  trust: '#0b0b14',
  health: 'linear-gradient(170deg,#e0e7ff,#c7d2fe)',
  formula: '#0a0e1a',
  career: '#f8fafc',
  sql: '#0f172a',
}

/* Portrait versions of the landscape screens: the side panels step aside. */
const CSS = `
.rc { position: absolute; inset: 0; overflow: hidden; }
.rc > * { position: absolute; }
.rc--n8 .n8 { inset: 0; border-radius: 0; box-shadow: none; }
.rc--n8 .n8__rail { display: none; }
.rc--n8 .n8__body { grid-template-columns: minmax(0, 1fr); }
.rc--n8 .n8__line, .rc--n8 .n8__ask p { font-size: 15px; }
.rc--md .mds { inset: 0; }
.rc--md .mds__panel { display: none; }
.rc--md .mds__chat { width: 100%; border-radius: 0; box-shadow: none; }
.rc--dk .dk { inset: 0; border-radius: 0; box-shadow: none; }
.rc--dk .dk__clock, .rc--dk .dk__notes { display: none; }
.rc--dk .dk__panel { left: 96px; top: 120px; width: 330px; }
.rc--pg .pgs { inset: 0; }
.rc--pg .pgs__laptop, .rc--pg .pgs__beam { display: none; }
.rc--pg .pgs__phone { right: auto; left: 44px; top: 20px; transform: scale(1.44); transform-origin: 0 0; }
.rc--uf .uf { inset: 0; }
.rc--uf .uf__track { display: none; }
.rc--uf .uf__phone { left: 42px; top: 20px; transform: scale(1.3); transform-origin: 0 0; }
.rc--cw .cw, .rc--tl .tl, .rc--fl .fl, .rc--cc .cc, .rc--sq .sq { inset: 0; border-radius: 0; box-shadow: none; }
.rc--cw .cw__side { display: none; }
.rc--cw .cw__body { grid-template-columns: minmax(0, 1fr); }
.rc--cw .cw__cols { grid-template-columns: minmax(0, 1fr); }
.rc--cw .cw__main { justify-content: center; }
.rc--tl .tl { grid-template-columns: minmax(0, 1fr); align-content: center; }
.rc--fl .fl { grid-template-columns: minmax(0, 1fr); }
.rc--fl .fl__side { display: none; }
.rc--fl .fl__main { justify-content: center; }
.rc--cc .cc { grid-template-columns: minmax(0, 1fr); }
.rc--cc .cc__side { display: none; }
.rc--cc .cc__main { justify-content: center; }
.rc--hs .hs { inset: 0; }
.rc--hs .hs__card { display: none; }
.rc--hs .hs__phone { left: 41px; top: 34px; transform: scale(1.3); transform-origin: 0 0; }
`

const CLS: Record<RingKind, string> = {
  non8: 'rc--n8',
  mediator: 'rc--md',
  desk: 'rc--dk',
  guardian: 'rc--pg',
  civic: 'rc--uf',
  clause: 'rc--cw',
  trust: 'rc--tl',
  health: 'rc--hs',
  formula: 'rc--fl',
  career: 'rc--cc',
  sql: 'rc--sq',
}

export function RingCard({ kind }: { kind: RingKind }) {
  let body: ReactNode
  if (kind === 'non8') body = <Non8 step={last(NON8_STEPS)} />
  else if (kind === 'mediator') body = <MediatorShow step={last(MEDIATOR_STEPS)} />
  else if (kind === 'desk') body = <Desk step={last(DESK_STEPS)} />
  else if (kind === 'guardian') body = <Guardian step={last(GUARDIAN_STEPS)} />
  else if (kind === 'civic') body = <Civic step={last(CIVIC_STEPS)} />
  else if (kind === 'clause') body = <ClauseShow step={last(CLAUSE_STEPS)} />
  else if (kind === 'trust') body = <TrustShow step={last(TRUST_STEPS)} />
  else if (kind === 'health') body = <HealthShow step={last(HEALTH_STEPS)} />
  else if (kind === 'formula') body = <FormulaShow step={last(FORMULA_STEPS)} />
  else if (kind === 'career') body = <CareerShow step={last(CAREER_STEPS)} />
  else body = <SqlShow step={last(SQL_STEPS)} />

  return (
    <div className="stage__inner" style={{ position: 'absolute', inset: 0, transform: 'none', background: BG[kind] }}>
      <style>{CSS}</style>
      <div className={`rc ${CLS[kind]}`}>{body}</div>
    </div>
  )
}
