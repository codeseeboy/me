import type { CSSProperties, ReactNode } from 'react'

/**
 * Line drawings of the two campuses, in the manner of an architect's
 * elevation. Every stroke has pathLength 1, so CSS can draw it by its
 * dash offset; the parent sets --draw (0 → 1) from scroll position and
 * each stroke starts at its own --s, so the building draws itself as the
 * section passes. Greenery is drawn in green and washed in at the end.
 */

const s = (n: number) => ({ '--s': n }) as CSSProperties

function Ink({ d, at = 0, leaf }: { d: string; at?: number; leaf?: boolean }) {
  return <path className={leaf ? 'ink leaf' : 'ink'} d={d} pathLength={1} style={s(at)} />
}

function Box({ x, y, w, h, at = 0 }: { x: number; y: number; w: number; h: number; at?: number }) {
  return <Ink d={`M${x} ${y}H${x + w}V${y + h}H${x}Z`} at={at} />
}

/** A round-canopied tree: trunk, branches, three overlapping crowns. */
function Tree({ x, y, r, at }: { x: number; y: number; r: number; at: number }) {
  const c = (dx: number, dy: number, rr: number) =>
    `M${x + dx - rr} ${y + dy}a${rr} ${rr} 0 1 0 ${rr * 2} 0a${rr} ${rr} 0 1 0 ${-rr * 2} 0`
  return (
    <g>
      <circle className="wash" cx={x} cy={y - r * 2.2} r={r * 1.3} />
      <Ink leaf d={`M${x} ${y}V${y - r * 1.3}M${x} ${y - r * 0.8}l${-r * 0.5} ${-r * 0.55}M${x} ${y - r}l${r * 0.45} ${-r * 0.5}`} at={at} />
      <Ink leaf d={c(0, -r * 2.4, r)} at={at + 0.04} />
      <Ink leaf d={c(-r * 0.75, -r * 1.85, r * 0.75)} at={at + 0.08} />
      <Ink leaf d={c(r * 0.8, -r * 1.8, r * 0.8)} at={at + 0.1} />
    </g>
  )
}

/** A coconut palm — Mumbai. */
function Palm({ x, y, h, at }: { x: number; y: number; h: number; at: number }) {
  const tx = x + h * 0.18
  const ty = y - h
  const frond = (dx: number, dy: number) => `M${tx} ${ty}q${dx * 0.5} ${-Math.abs(dy) * 0.6 - 14} ${dx} ${dy}`
  return (
    <g>
      <Ink leaf d={`M${x} ${y}q${h * 0.04} ${-h * 0.55} ${h * 0.18} ${-h}`} at={at} />
      {[
        [-70, 22],
        [-54, 40],
        [64, 20],
        [52, 42],
        [-20, -34],
        [26, -30],
      ].map(([dx, dy], i) => (
        <Ink key={i} leaf d={frond(dx, dy)} at={at + 0.05 + i * 0.02} />
      ))}
    </g>
  )
}

function Grass({ xs, y, at }: { xs: number[]; y: number; at: number }) {
  return (
    <>
      {xs.map((x, i) => (
        <Ink key={x} leaf d={`M${x} ${y}l3 -9M${x + 5} ${y}l1 -12M${x + 9} ${y}l-2 -8`} at={at + i * 0.01} />
      ))}
    </>
  )
}

function Bird({ x, y, at }: { x: number; y: number; at: number }) {
  return <Ink d={`M${x} ${y}q5 -6 10 0q5 -6 10 0`} at={at} />
}

/** An architect's title block in the corner of the sheet. */
function Caption({ text }: { text: string }) {
  return (
    <>
      <Ink d="M330 446H780" at={0.74} />
      <text className="ink-text ink-text--small" x="780" y="462" textAnchor="end">
        {text}
      </text>
    </>
  )
}

/* ---- St. John College of Engineering and Management, Palghar ---- */

function Sjcem() {
  const floors = [210, 257.5, 305, 352.5]
  const winX = (from: number) => Array.from({ length: 5 }, (_, i) => from + 12 + i * 38)
  return (
    <>
      {/* Palghar's hills behind the campus */}
      <Ink d="M20 330 C120 270 200 300 270 280 S420 230 520 270 S700 250 780 300" at={0} />
      <Bird x={560} y={92} at={0.05} />
      <Bird x={588} y={108} at={0.07} />

      {/* Paper behind the building, so the hills pass behind it */}
      <path className="paper" d="M140 400V202H345V130H455V202H660V400Z" />

      {/* Wings */}
      <Ink d="M150 400V210H650V400" at={0.08} />
      <Ink d="M140 202H660V210H140Z" at={0.1} />
      {floors.slice(1).map((y, i) => (
        <Ink key={y} d={`M150 ${y}H345M455 ${y}H650`} at={0.14 + i * 0.02} />
      ))}
      {floors.map((y, f) =>
        [...winX(150), ...winX(455)].map((x, i) => <Box key={`${f}-${i}`} x={x} y={y + 12} w={22} h={26} at={0.22 + f * 0.04 + i * 0.006} />),
      )}

      {/* Tower, sign, glass, entrance */}
      <Ink d="M345 400V130H455V400" at={0.12} />
      <Ink d="M336 130H464" at={0.16} />
      <Box x={360} y={146} w={80} h={24} at={0.3} />
      <text className="ink-text" x="400" y="163" textAnchor="middle">
        SJCEM
      </text>
      <Box x={378} y={182} w={44} h={160} at={0.34} />
      {[214, 246, 278, 310].map((y, i) => (
        <Ink key={y} d={`M378 ${y}H422`} at={0.38 + i * 0.02} />
      ))}
      <Ink d="M400 182V342" at={0.4} />
      <Ink d="M365 345H435" at={0.44} />
      <Box x={382} y={350} w={36} h={50} at={0.46} />

      {/* Ground, steps and the walk */}
      <Ink d="M20 400H780" at={0.06} />
      <Ink d="M362 406H438M354 412H446" at={0.5} />
      <Ink d="M384 412L330 440M416 412L470 440" at={0.56} />

      {/* Greenery */}
      <Tree x={90} y={400} r={34} at={0.5} />
      <Tree x={705} y={400} r={30} at={0.56} />
      <Tree x={200} y={400} r={18} at={0.62} />
      <Tree x={605} y={400} r={18} at={0.64} />
      <Grass xs={[40, 120, 250, 520, 640, 750]} y={400} at={0.7} />
      <Caption text="FRONT ELEVATION · SJCEM · PALGHAR" />
    </>
  )
}

/* ---- Government Polytechnic Mumbai ---- */

function Gpm() {
  const arch = (x: number, y: number, w: number, h: number) => {
    const r = w / 2
    return `M${x} ${y + h}V${y + r}A${r} ${r} 0 0 1 ${x + w} ${y + r}V${y + h}Z`
  }
  const left = [150, 192, 234, 276]
  const right = [494, 536, 578, 620]
  return (
    <>
      <Bird x={210} y={86} at={0.04} />
      <Bird x={236} y={100} at={0.06} />

      {/* Main block, two storeys */}
      <Ink d="M120 400V236H680V400" at={0.06} />
      <Ink d="M110 236H690M110 228H690" at={0.1} />
      <Ink d="M120 318H330M470 318H680" at={0.14} />
      {[248, 330].map((y, f) =>
        [...left, ...right].map((x, i) => <Ink key={`${f}-${i}`} d={arch(x, y, 26, 58)} at={0.2 + f * 0.06 + i * 0.008} />),
      )}

      {/* Portico: pediment, entablature, columns */}
      <Ink d="M318 228L400 176L482 228" at={0.24} />
      <Ink d="M340 222L400 186L460 222" at={0.28} />
      <Ink d="M326 236H474V250H326Z" at={0.3} />
      {[338, 368, 398, 428, 458].map((x, i) => (
        <Ink key={x} d={`M${x} 250V392M${x + 6} 250V392M${x - 3} 392H${x + 9}`} at={0.34 + i * 0.03} />
      ))}
      <Ink d="M384 392V330A16 16 0 0 1 416 330V392" at={0.5} />
      <Ink d="M320 400H480M312 408H488M304 416H496" at={0.52} />

      {/* Ground and greenery — a Mumbai palm on the right */}
      <Ink d="M20 416H780" at={0.04} />
      <Tree x={70} y={416} r={30} at={0.5} />
      <Palm x={735} y={416} h={190} at={0.54} />
      <Palm x={690} y={416} h={130} at={0.6} />
      <Grass xs={[30, 140, 230, 560, 620]} y={416} at={0.68} />
      <Caption text="FRONT ELEVATION · GOVT. POLYTECHNIC · MUMBAI" />
    </>
  )
}

export default function CollegeDrawing({ kind, label }: { kind: 'sjcem' | 'gpm'; label: string }): ReactNode {
  return (
    <svg className="drawing" viewBox="0 0 800 470" role="img" aria-label={label}>
      {kind === 'sjcem' ? <Sjcem /> : <Gpm />}
    </svg>
  )
}
