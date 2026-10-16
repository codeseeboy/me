/**
 * The site mark and the handful of icons it uses. Inline SVG, so nothing
 * extra is fetched and every icon inherits `currentColor`.
 */

/** "SR", drawn as two blocky glyphs. Used in the header, footer and About. */
export const S_PATH = 'M0 0H22V9H9V15.5H22V40H0V31H13V24.5H0Z'
/** The R's counter is cut out by the even-odd fill rule. */
export const R_PATH = 'M26 0H48V22H41L48 40H41.5L34.5 22H31V40H26ZM31 6V16H43V6Z'
export const LOGO_PATH = S_PATH + R_PATH

export function Logo({ className, title = 'Shashikant Rajput' }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 40" role="img" aria-label={title}>
      <path d={LOGO_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  )
}

export function PinIcon() {
  return (
    <svg width="11" height="13" viewBox="0 0 16 19" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C4.1 0 1 3.1 1 6.9 1 12 8 19 8 19s7-7 7-12.1C15 3.1 11.9 0 8 0zm0 9.6a2.7 2.7 0 1 1 0-5.4 2.7 2.7 0 0 1 0 5.4z"
      />
    </svg>
  )
}

export function GitHubIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 16 16" aria-hidden="true">
      <path
        fill="currentColor"
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
      />
    </svg>
  )
}

export function LinkedInIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="2.2" cy="2.2" r="1.9" fill="currentColor" />
      <rect x="0.5" y="5.4" width="3.4" height="10.1" fill="currentColor" />
      <path
        fill="currentColor"
        d="M5.9 5.4h3.2v1.4c.45-.8 1.55-1.65 3.2-1.65 3.3 0 3.7 2.15 3.7 4.95v5.4h-3.35v-4.8c0-1.15-.02-2.6-1.6-2.6-1.6 0-1.85 1.25-1.85 2.5v4.9H5.9z"
      />
    </svg>
  )
}

export function ArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true">
      <path d="M1.5 7h10.2M7.6 2.6 12 7l-4.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function ArrowLeft({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true">
      <path d="M12.5 7H2.3M6.4 2.6 2 7l4.4 4.4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

export function ArrowDown({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" aria-hidden="true">
      <path d="M7 1v11M2.6 7.6 7 12l4.4-4.4" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export function ExternalArrow({ size = 11 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 9 9.2 2.8M4 2.5h5.5V8" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
