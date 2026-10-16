import '../styles/svc.css'
import { Link } from '../router'
import { PageCover } from '../components/Story'
import Showcase, { type ShowKind } from '../components/show/Showcase'
import useSeen from '../hooks/useSeen'
import { PgMark } from '../components/svc/pg/Ui'
import { MedMark } from '../components/svc/med/Ui'

/** A door's product, running while the door is on screen. */
function DoorShow({ kind }: { kind: ShowKind }) {
  const [ref, seen] = useSeen<HTMLDivElement>(0.3)
  return (
    <div className="svc-door__film" ref={ref} aria-hidden="true">
      <div className="svc-door__show">
        <Showcase kind={kind} live={seen} />
      </div>
    </div>
  )
}

/**
 * The products, side by side. Each card already wears its product's own
 * colours and runs the product itself, so the click into the page reads
 * as walking through a door.
 */
export default function Services() {
  return (
    <>
      <PageCover
        kicker="Services"
        title="Built By Me"
        lede="Two products I designed and built end to end. Neither is public — each page shows exactly what it does, and access is by request."
      />

      <section className="svc-doors">
        <Link className="svc-door svc-door--pg" to="/services/privacy-guardian">
          <span className="svc-door__top">
            <PgMark className="svc-door__mark" />
            Windows + Android
          </span>
          <h2 className="svc-door__name">Privacy Guardian</h2>
          <p className="svc-door__line">
            Lend your laptop without lending your private stuff. Lock sites, apps, folders and Chrome profiles — and
            unlock them from your phone with a fingerprint.
          </p>
          <span className="svc-door__go">
            Explore Privacy Guardian <i aria-hidden="true">→</i>
          </span>
          <DoorShow kind="guardian" />
        </Link>

        <Link className="svc-door svc-door--med" to="/services/mediator">
          <span className="svc-door__top">
            <MedMark className="svc-door__mark svc-door__mark--med" />
            Local agent runtime · MCP
          </span>
          <h2 className="svc-door__name">Mediator</h2>
          <p className="svc-door__line">
            Turn the AI chat you already use into a coding agent that reads your code, runs your tests and fixes what
            fails — no API key.
          </p>
          <span className="svc-door__go">
            Explore Mediator <i aria-hidden="true">→</i>
          </span>
          <DoorShow kind="mediator" />
        </Link>

        <Link className="svc-door svc-door--live" to="/services/privacy-guardian/live">
          <div className="svc-door__copy">
            <span className="svc-door__top">
              <PgMark className="svc-door__mark" />
              Part of Privacy Guardian
            </span>
            <h2 className="svc-door__name">Live Desktop &amp; Control</h2>
            <p className="svc-door__line">
              Your laptop’s real screen on your phone — then tap, type and close what you left open, from anywhere.
            </p>
            <span className="svc-door__go">
              Explore Live Desktop <i aria-hidden="true">→</i>
            </span>
          </div>
          <DoorShow kind="live" />
        </Link>
      </section>
    </>
  )
}
