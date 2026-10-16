import { useEffect, useState } from 'react'
import { PageCover } from '../components/Story'
import { ExternalArrow } from '../components/Icons'
import { PROFILE } from '../data/profile'

const localTime = () =>
  new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: PROFILE.timeZone }).format(new Date())

export default function Contact() {
  const [time, setTime] = useState(localTime)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = window.setInterval(() => setTime(localTime()), 30_000)
    return () => window.clearInterval(id)
  }, [])

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${PROFILE.email}`
    }
  }

  return (
    <>
      <PageCover
        kicker={`${PROFILE.location} · ${PROFILE.timeZoneLabel}`}
        title="Get In Touch"
        lede="Email is the fastest way to reach me — I reply within a day or two. If you’re hiring, a line about the team and the problem helps more than a job description."
      />

      <section className="reach" aria-label="Ways to reach me">
        <div className="reach__mail">
          <a href={`mailto:${PROFILE.email}`}>{PROFILE.email}</a>
          <button className="pill pill--ghost" type="button" onClick={copy} aria-live="polite">
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>

        <dl className="reach__grid">
          <div>
            <dt>GitHub</dt>
            <dd>
              <a href={PROFILE.github} target="_blank" rel="noreferrer noopener">
                {PROFILE.githubHandle} <ExternalArrow />
              </a>
            </dd>
          </div>
          <div>
            <dt>LinkedIn</dt>
            <dd>
              <a href={PROFILE.linkedin} target="_blank" rel="noreferrer noopener">
                in/{PROFILE.linkedinHandle} <ExternalArrow />
              </a>
            </dd>
          </div>
          <div>
            <dt>Local time</dt>
            <dd>
              {time} {PROFILE.timeZoneLabel} · {PROFILE.location}
            </dd>
          </div>
        </dl>

        <p className="reach__status">
          <span className="live-dot" aria-hidden="true" />
          {PROFILE.status}
        </p>
      </section>
    </>
  )
}
