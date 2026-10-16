import '../../styles/svc.css'
import { PROFILE } from '../../data/profile'

/**
 * The only call to action on a service page. Neither service is public, so
 * there is no demo, no repository and no sign-up — only a direct request,
 * pre-addressed so the visitor just has to say who they are.
 *
 * "pill" is the site's own black pill; "pill-light" the same on a black band.
 */
export default function RequestAccess({ product, tone }: { product: string; tone: 'pg' | 'med' | 'pill' | 'pill-light' }) {
  const subject = encodeURIComponent(`Access request — ${product}`)
  const body = encodeURIComponent(
    `Hi Shashikant,\n\nI'd like to use ${product}.\n\nWho I am:\nWhat I want to use it for:\n`,
  )
  const href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`
  const arrow = (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <path d="M1.5 7h10.2M7.6 2.6 12 7l-4.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
  if (tone === 'pill' || tone === 'pill-light') {
    return (
      <a className={`pill ${tone === 'pill' ? 'pill--solid' : 'pill--light'}`} href={href}>
        Request access {arrow}
      </a>
    )
  }
  return (
    <a className={`svc-cta svc-cta--${tone}`} href={href}>
      <span className="svc-cta__roll" data-t="Request access">
        <span>Request access</span>
      </span>
      {arrow}
    </a>
  )
}
