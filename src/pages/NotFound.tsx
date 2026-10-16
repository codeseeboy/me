import { Link } from '../router'
import { PageCover } from '../components/Story'
import { ArrowRight } from '../components/Icons'

export default function NotFound() {
  return (
    <>
      <PageCover kicker="404" title="Nothing Here" lede="The link may be out of date. Everything on the site is one click from the header." />
      <div className="pills pills--center">
        <Link className="pill" to="/">
          Back to the work <ArrowRight />
        </Link>
        <Link className="pill pill--ghost" to="/contact">
          Contact
        </Link>
      </div>
    </>
  )
}
