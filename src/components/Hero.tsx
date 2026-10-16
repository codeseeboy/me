import { Suspense, lazy } from 'react'
import { ArrowDown } from './Icons'
import { PROFILE } from '../data/profile'

// Three.js is the heaviest thing on the site; it loads after first paint.
const HeroRing = lazy(() => import('./HeroRing'))

const WORDS = ['AI', 'ML', 'LLM', 'SYSTEMS']
const ANCHOR = 'ENGINEER'
const CAPTIONS: [string, string] = ['BUILDS PRODUCTS END TO END', 'OFFLINE AI / AGENTS / SYSTEMS']

export default function Hero() {
  const jump = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = document.getElementById('work')
    if (!target) return
    e.preventDefault()
    const top = target.getBoundingClientRect().top + window.scrollY - 52
    window.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <section className="hero" aria-labelledby="hero-title">
      {/* The canvas title is decorative; this is the real one. */}
      <h1 className="sr-only" id="hero-title">
        {PROFILE.name} — AI / ML engineer. {PROFILE.summary}
      </h1>

      <Suspense fallback={<div className="ring" />}>
        <HeroRing words={WORDS} anchor={ANCHOR} captions={CAPTIONS} />
      </Suspense>

      <img
        className="hero__character"
        src="/characters/hero2.webp"
        alt=""
        width={760}
        height={1140}
        fetchPriority="high"
        decoding="async"
      />

      <a className="explore" href="#work" onClick={jump}>
        <span>Explore</span>
        <ArrowDown />
      </a>
    </section>
  )
}
