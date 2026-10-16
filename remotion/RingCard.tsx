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
  Mesh,
  NON8_STEPS,
  Non8,
} from '../src/components/show/Showcase'
import '../src/components/show/show.css'
import '../src/components/show/products.css'

/*
 * The hero ring's cards: one portrait still per product — the product's own
 * screen, nothing written on top — rendered from the same components the
 * gallery animates, so the ring shows the real screens.
 *   npx remotion still remotion/index.ts Ring public/ring/non8.jpg --props='{"kind":"non8"}'
 */

export type RingKind = 'non8' | 'guardian' | 'mediator' | 'desk' | 'mesh' | 'civic'

const last = (a: number[]) => a.length - 1

const BG: Record<RingKind, string> = {
  non8: '#f7f4ee',
  guardian: 'linear-gradient(170deg,#2a2150,#0b0a15)',
  mediator: '#ffffff',
  desk: '#1b2a35',
  mesh: '#06070f',
  civic: 'linear-gradient(170deg,#e3f1e8,#c9e2d3)',
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
.rc--msh .msh { left: -210px; top: 0; width: 880px; height: 560px; border-radius: 0; box-shadow: none; transform: scale(1.465); transform-origin: 50% 0; }
.rc--msh .msh__top, .rc--msh .msh__foot { display: none; }
`

const CLS: Record<RingKind, string> = { non8: 'rc--n8', mediator: 'rc--md', desk: 'rc--dk', guardian: 'rc--pg', civic: 'rc--uf', mesh: 'rc--msh' }

export function RingCard({ kind }: { kind: RingKind }) {
  let body: ReactNode
  if (kind === 'non8') body = <Non8 step={last(NON8_STEPS)} />
  else if (kind === 'mediator') body = <MediatorShow step={last(MEDIATOR_STEPS)} />
  else if (kind === 'desk') body = <Desk step={last(DESK_STEPS)} />
  else if (kind === 'guardian') body = <Guardian step={last(GUARDIAN_STEPS)} />
  else if (kind === 'civic') body = <Civic step={last(CIVIC_STEPS)} />
  else body = <Mesh live={false} angle={0.9} />

  return (
    <div className="stage__inner" style={{ position: 'absolute', inset: 0, transform: 'none', background: BG[kind] }}>
      <style>{CSS}</style>
      <div className={`rc ${CLS[kind]}`}>{body}</div>
    </div>
  )
}
