import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useIsActive, useRouter } from '../router'
import { PROFILE } from '../data/profile'
import { ArrowLeft, GitHubIcon, LinkedInIcon, Logo, PinIcon } from './Icons'
import Intro from './Intro'

export const NAV = [
  { to: '/', label: 'Work' },
  { to: '/services', label: 'Services' },
  { to: '/about', label: 'About' },
  { to: '/experience', label: 'Experience' },
  { to: '/resume', label: 'Résumé' },
  { to: '/contact', label: 'Contact' },
]

function Tab({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  const { path } = useRouter()
  const sub = useIsActive(to)
  // "Work" also owns the case-study pages underneath it; "About" owns skills.
  const active = to === '/' ? path === '/' || path.startsWith('/work/') : to === '/about' ? sub || path === '/skills' : sub
  return (
    <Link className="tab" to={to} aria-current={active ? 'page' : undefined} onClick={onClick}>
      {label}
    </Link>
  )
}

function Socials() {
  return (
    <>
      <a className="hdr-mail" href={`mailto:${PROFILE.email}`}>
        {PROFILE.email}
      </a>
      <a className="hdr-icon" href={PROFILE.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub">
        <GitHubIcon />
      </a>
      <a className="hdr-icon" href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
        <LinkedInIcon />
      </a>
    </>
  )
}

function Header({ dark }: { dark: boolean }) {
  const [open, setOpen] = useState(false)
  const { path } = useRouter()

  useEffect(() => setOpen(false), [path])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('is-locked')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('is-locked')
    }
  }, [open])

  return (
    <header className={`site-header${dark ? ' site-header--dark' : ''}${open ? ' site-header--open' : ''}`}>
      <div className="site-header__bar">
        <div className="site-header__left">
          <Link className="brand" to="/" aria-label={`${PROFILE.name} — home`}>
            <Logo />
          </Link>
          <span className="where">
            <PinIcon />
            {PROFILE.location}
          </span>
        </div>

        <nav className="tabs" aria-label="Main">
          {NAV.map((n) => (
            <Tab key={n.to} {...n} />
          ))}
        </nav>

        <div className="site-header__right">
          <Socials />
          <button
            className="menu-btn"
            type="button"
            aria-expanded={open}
            aria-controls="menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className="menu" id="menu" hidden={!open}>
        <nav className="menu__nav" aria-label="Menu">
          {NAV.map((n, i) => (
            <span className="menu__item" key={n.to} style={{ ['--k' as string]: i }}>
              <Tab {...n} onClick={() => setOpen(false)} />
            </span>
          ))}
        </nav>
        <div className="menu__foot">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <a href={PROFILE.github} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
          <a href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener">
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  )
}

function Footer({ footRef }: { footRef: React.RefObject<HTMLElement | null> }) {
  return (
    <footer className="site-footer" ref={footRef}>
      <div className="site-footer__inner">
        <div className="site-footer__links">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <a className="hdr-icon" href={PROFILE.github} target="_blank" rel="noreferrer noopener" aria-label="GitHub">
            <GitHubIcon />
          </a>
          <a className="hdr-icon" href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener" aria-label="LinkedIn">
            <LinkedInIcon />
          </a>
        </div>
        <Logo className="site-footer__mark" />
        <p className="site-footer__year">{new Date().getFullYear()}</p>
        <nav className="site-footer__nav" aria-label="Footer">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const { path } = useRouter()
  const main = useRef<HTMLElement>(null)
  const foot = useRef<HTMLElement>(null)
  const first = useRef(true)
  const [dark, setDark] = useState(false)
  /** Bumped on every navigation, to replay the curtain. */
  const [wipe, setWipe] = useState(0)
  const onCase = path.startsWith('/work/')

  // Keyboard and screen-reader users land on the new page, not the header.
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    main.current?.focus({ preventScroll: true })
    setWipe((n) => n + 1)
  }, [path])

  // The header turns white-on-black once the black footer reaches it.
  useEffect(() => {
    let raf = 0
    const check = () => {
      raf = 0
      const f = foot.current
      setDark(!!f && f.getBoundingClientRect().top < 40)
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(check)
    }
    check()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [path])

  return (
    <>
      <Intro />
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      {onCase ? (
        <Link className="back-pill" to="/">
          <ArrowLeft /> Gallery
        </Link>
      ) : (
        <Header dark={dark} />
      )}

      <main id="main" ref={main} tabIndex={-1} className={onCase ? 'main main--case' : 'main'} key={path}>
        {children}
      </main>

      <Footer footRef={foot} />

      {/* A black curtain lifts off every new page, so a route change reads as
          a cut in a film rather than a content swap. Keyed to replay. */}
      {wipe > 0 && (
        <div className="curtain" key={wipe} aria-hidden="true">
          <Logo className="curtain__mark" title="" />
        </div>
      )}
    </>
  )
}
