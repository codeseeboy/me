import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'

/**
 * A small History-API router. React Router would work, but this site has
 * seven routes and no data loading, so the whole requirement is: keep the
 * URL honest, move focus on navigation, and restore scroll on back.
 */

interface RouterValue {
  path: string
  navigate: (to: string, opts?: { replace?: boolean }) => void
}

const RouterContext = createContext<RouterValue>({ path: '/', navigate: () => {} })

export const useRouter = () => useContext(RouterContext)

const normalise = (p: string) => {
  const clean = p.replace(/\/+$/, '')
  return clean === '' ? '/' : clean
}

/** Scroll offsets keyed by history entry, so Back returns you where you were. */
const scrollPositions = new Map<string, number>()

export function Router({ children }: { children: ReactNode }) {
  const [path, setPath] = useState(() => normalise(window.location.pathname))
  /** Set when navigation came from a link rather than the back button. */
  const cameFromLink = useRef(false)

  /** A #fragment to scroll to once the next route has rendered. */
  const pendingHash = useRef('')

  const navigate = useCallback(
    (to: string, opts?: { replace?: boolean }) => {
      const url = new URL(to, window.location.origin)
      const next = normalise(url.pathname)
      if (next === normalise(window.location.pathname)) {
        if (url.hash) document.getElementById(url.hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
        return
      }
      scrollPositions.set(window.history.state?.key ?? 'initial', window.scrollY)
      cameFromLink.current = true
      pendingHash.current = url.hash
      const key = String(Date.now())
      if (opts?.replace) window.history.replaceState({ key }, '', next + url.hash)
      else window.history.pushState({ key }, '', next + url.hash)
      setPath(next)
    },
    [],
  )

  useEffect(() => {
    const onPop = () => {
      cameFromLink.current = false
      setPath(normalise(window.location.pathname))
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  useEffect(() => {
    const hash = pendingHash.current || window.location.hash
    pendingHash.current = ''
    if (hash) {
      // Wait a frame for the new page to exist, then go to the section.
      const id = hash.slice(1)
      window.setTimeout(() => {
        const el = document.getElementById(id)
        if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 60)
        else window.scrollTo(0, 0)
      }, 60)
    } else if (cameFromLink.current) {
      window.scrollTo(0, 0)
    } else {
      const saved = scrollPositions.get(window.history.state?.key ?? 'initial')
      window.scrollTo(0, saved ?? 0)
    }
  }, [path])

  const value = useMemo(() => ({ path, navigate }), [path, navigate])
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>
}

interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  children: ReactNode
}

/**
 * A real anchor. Middle-click, ctrl-click and "open in new tab" all keep
 * working because we only intercept the plain left-click case.
 */
export function Link({ to, children, onClick, ...rest }: LinkProps) {
  const { navigate } = useRouter()
  const external = /^https?:\/\/|^mailto:|^tel:/.test(to)

  if (external) {
    const isHttp = to.startsWith('http')
    return (
      <a href={to} {...(isHttp ? { target: '_blank', rel: 'noreferrer noopener' } : {})} {...rest}>
        {children}
      </a>
    )
  }

  return (
    <a
      href={to}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        navigate(to)
      }}
      {...rest}
    >
      {children}
    </a>
  )
}

/** True when `path` is the current route, or an ancestor of it. */
export function useIsActive(to: string) {
  const { path } = useRouter()
  const target = normalise(to)
  if (target === '/') return path === '/'
  return path === target || path.startsWith(`${target}/`)
}
