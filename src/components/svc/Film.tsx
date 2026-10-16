import { useCallback, useEffect, useRef, useState } from 'react'

const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Plays a muted video while it is on screen, and pauses it when it is not. */
function useAutoplay(ref: React.RefObject<HTMLVideoElement | null>, threshold = 0.35, enabled = true) {
  useEffect(() => {
    const v = ref.current
    if (!v || !enabled || reduced() || typeof IntersectionObserver === 'undefined') return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold },
    )
    io.observe(v)
    return () => io.disconnect()
  }, [ref, threshold, enabled])
}

export type Chapter = { t: number; label: string }

/**
 * A product film: muted autoplay in view, a segmented progress bar that is
 * also the chapter list, play/pause and fullscreen. Nothing here has sound.
 */
export function FilmPlayer({
  src,
  poster,
  chapters,
  duration,
  title,
  autoplay = true,
}: {
  src: string
  poster: string
  chapters: Chapter[]
  duration: number
  title: string
  /** Off: the film waits for a click, so it reads as one section of the page, not the page. */
  autoplay?: boolean
}) {
  const box = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLVideoElement>(null)
  const [time, setTime] = useState(0)
  const [playing, setPlaying] = useState(false)
  useAutoplay(ref, 0.35, autoplay)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    let raf = 0
    const tick = () => {
      setTime(v.currentTime)
      raf = requestAnimationFrame(tick)
    }
    const onPlay = () => {
      setPlaying(true)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(tick)
    }
    const onPause = () => {
      setPlaying(false)
      cancelAnimationFrame(raf)
      setTime(v.currentTime)
    }
    v.addEventListener('play', onPlay)
    v.addEventListener('pause', onPause)
    return () => {
      cancelAnimationFrame(raf)
      v.removeEventListener('play', onPlay)
      v.removeEventListener('pause', onPause)
    }
  }, [])

  const toggle = useCallback(() => {
    const v = ref.current
    if (!v) return
    if (v.paused) v.play().catch(() => {})
    else v.pause()
  }, [])

  const seek = (s: number) => {
    const v = ref.current
    if (!v) return
    v.currentTime = s
    setTime(s)
    v.play().catch(() => {})
  }

  const full = () => {
    const el = box.current
    if (!el) return
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    else el.requestFullscreen?.().catch(() => {})
  }

  const ends = chapters.map((_, i) => (i + 1 < chapters.length ? chapters[i + 1].t : duration))
  const current = chapters.findIndex((c, i) => time >= c.t && time < ends[i])

  return (
    <figure className="film" ref={box}>
      <div className="film__frame">
        <video
          ref={ref}
          className="film__video"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          onClick={toggle}
          aria-label={title}
        />
        <button type="button" className={`film__play${playing ? ' is-playing' : ''}`} onClick={toggle} aria-label={playing ? 'Pause film' : 'Play film'}>
          {playing ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button type="button" className="film__full" onClick={full} aria-label="Full screen">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      <figcaption className="film__chapters">
        {chapters.map((c, i) => {
          const span = ends[i] - c.t
          const fill = Math.min(1, Math.max(0, (time - c.t) / span))
          return (
            <button
              key={c.label}
              type="button"
              className={`film__ch${i === current ? ' is-on' : ''}`}
              style={{ flexGrow: span }}
              onClick={() => seek(c.t + 0.05)}
            >
              <span className="film__bar">
                <i style={{ transform: `scaleX(${fill})` }} />
              </span>
              <span className="film__label">
                <b>{String(i + 1).padStart(2, '0')}</b> {c.label}
              </span>
            </button>
          )
        })}
      </figcaption>
    </figure>
  )
}
