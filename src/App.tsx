import { lazy, Suspense, useEffect, type ComponentType } from 'react'
import Layout from './components/Layout'
import { useRouter } from './router'
import Work from './pages/Work'
import CaseStudy from './pages/CaseStudy'
import About from './pages/About'
import Experience from './pages/Experience'
import Skills from './pages/Skills'
import Resume from './pages/Resume'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import Services from './pages/Services'
import { PROFILE } from './data/profile'
import { caseBySlug } from './data/work'

const SITE = 'Shashikant Rajput'

// The product pages carry their own films and styles; load them on demand.
const PrivacyGuardian = lazy(() => import('./pages/services/PrivacyGuardian'))
const Mediator = lazy(() => import('./pages/services/Mediator'))
const LiveDesktop = lazy(() => import('./pages/services/LiveDesktop'))

/** Title and description per route — for tabs, search results and link previews. */
function meta(path: string): { title: string; description: string } {
  if (path.startsWith('/work/')) {
    const c = caseBySlug(path.slice('/work/'.length))
    if (c) return { title: `${c.brand} — ${c.title.join(' ')} · ${SITE}`, description: c.what }
    return { title: `Not found · ${SITE}`, description: '' }
  }
  switch (path) {
    case '/':
      return { title: `${SITE} — AI Engineer`, description: `${PROFILE.summary} ${PROFILE.scope}` }
    case '/about':
      return {
        title: `About · ${SITE}`,
        description: 'AI engineer building LLM systems, agentic workflows and multimodal pipelines. Recognition, teaching, and how I work.',
      }
    case '/experience':
      return {
        title: `Experience · ${SITE}`,
        description: 'Roles and education: AI engineering, software consulting and backend development, alongside a B.Tech in AI & ML.',
      }
    case '/skills':
      return {
        title: `Skills · ${SITE}`,
        description: 'Generative AI, model engineering, LLM systems, backend and data — grouped the way the work is divided.',
      }
    case '/resume':
      return { title: `Résumé · ${SITE}`, description: `Curriculum vitae for ${SITE}, AI/ML engineer in Mumbai.` }
    case '/services':
      return {
        title: `Services · ${SITE}`,
        description: 'Privacy Guardian and Mediator — two products designed and built end to end. Access by request.',
      }
    case '/services/privacy-guardian':
      return {
        title: `Privacy Guardian — your laptop stays yours · ${SITE}`,
        description:
          'Lock websites, apps, folders and Chrome profiles on Windows, and unlock them from your phone with a fingerprint — from anywhere, through an end-to-end encrypted relay.',
      }
    case '/services/privacy-guardian/live':
      return {
        title: `Live Desktop & Control — your laptop, in your pocket · ${SITE}`,
        description:
          'Part of Privacy Guardian: see your laptop’s real screen on your phone, then tap, type and close what you left open — from anywhere.',
      }
    case '/services/mediator':
      return {
        title: `Mediator — AI thinks, Mediator orchestrates, your computer executes · ${SITE}`,
        description:
          'A local-first agent runtime that connects the AI you already use to your files, terminal, git and tests — under a command policy, approvals and a completion gate.',
      }
    case '/contact':
      return { title: `Contact · ${SITE}`, description: `Get in touch with ${SITE} — ${PROFILE.email}` }
    default:
      return { title: `Not found · ${SITE}`, description: '' }
  }
}

function setTag(selector: string, attr: string, value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value)
}

/** The product pages, each its own lazily loaded chunk. */
const PRODUCTS: Record<string, ComponentType> = {
  '/services/privacy-guardian': PrivacyGuardian,
  '/services/privacy-guardian/live': LiveDesktop,
  '/services/mediator': Mediator,
}

function Route({ path }: { path: string }) {
  if (path === '/') return <Work />
  if (path.startsWith('/work/')) return <CaseStudy slug={path.slice('/work/'.length)} />
  if (path === '/about') return <About />
  if (path === '/experience') return <Experience />
  if (path === '/skills') return <Skills />
  if (path === '/resume') return <Resume />
  if (path === '/contact') return <Contact />
  if (path === '/services') return <Services />
  const Product = PRODUCTS[path]
  if (Product)
    return (
      <Suspense fallback={<div className="svc-wait" />}>
        <Product />
      </Suspense>
    )
  return <NotFound />
}

export default function App() {
  const { path, navigate } = useRouter()

  // Old addresses from earlier versions of the site still land somewhere useful.
  useEffect(() => {
    if (path === '/projects' || path === '/design') navigate('/', { replace: true })
    else if (path.startsWith('/projects/')) navigate(`/work/${path.slice('/projects/'.length)}`, { replace: true })
    else if (path.startsWith('/work/')) {
      const c = caseBySlug(path.slice('/work/'.length))
      // Products with their own page live there; retired cases go back to the gallery.
      if (c?.to) navigate(c.to, { replace: true })
      else if (!c) navigate('/', { replace: true })
    }
  }, [path, navigate])

  useEffect(() => {
    const { title, description } = meta(path)
    document.title = title
    const url = `${window.location.origin}${path}`
    setTag('meta[name="description"]', 'content', description)
    setTag('meta[property="og:title"]', 'content', title)
    setTag('meta[property="og:description"]', 'content', description)
    setTag('meta[property="og:url"]', 'content', url)
    setTag('link[rel="canonical"]', 'href', url)
  }, [path])

  return (
    <Layout>
      <Route path={path} />
    </Layout>
  )
}
