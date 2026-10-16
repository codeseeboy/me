/**
 * Everything here comes from the current résumé (Aug 2026 onward) or the
 * project dossier behind it. Nothing is inferred or rounded up.
 */

export const PROFILE = {
  name: 'Shashikant Rajput',
  role: 'AI Engineer',
  location: 'Mumbai, India',
  timeZone: 'Asia/Kolkata',
  timeZoneLabel: 'IST',
  email: 'shashi2005.pvt@gmail.com',
  github: 'https://github.com/codeseeboy',
  githubHandle: 'codeseeboy',
  linkedin: 'https://www.linkedin.com/in/shashikant-rajput',
  linkedinHandle: 'shashikant-rajput',

  /** The résumé's headline, as tags. */
  headline: ['Generative AI', 'LLM Systems', 'Multimodal AI'],

  /** One sentence. What he does, stated plainly. */
  summary: 'AI engineer building LLM systems, agentic workflows and multimodal pipelines in production.',

  /** The second sentence, for places with room for it. */
  scope:
    'My work spans model fine-tuning, GPU inference optimisation and backend engineering across GCP, AWS and on-premise environments.',

  /** Availability, stated once, honestly. */
  status: 'Final-year B.Tech (AI & ML), CGPA 9.8. Open to full-time AI engineering roles from mid-2027.',
} as const

/* ------------------------------------------------------------------ *
 * Experience — newest first. Education lives separately.
 * ------------------------------------------------------------------ */

export interface Role {
  slug: string
  company: string
  /** What the work was, in general terms. Employer systems and numbers stay private. */
  note: string
  title: string
  employment: string
  place: string
  from: string
  to?: string
  points: string[]
  stack: string[]
  accent: string
}

export const ROLES: Role[] = [
  {
    slug: 'addlyft',
    company: 'Addlyft',
    note: 'Generative video and voice for advertising',
    title: 'AI Engineer Intern',
    employment: 'Internship',
    place: 'United States · Remote',
    from: '08/2026',
    points: [
      'Building multimodal generation pipelines for commercial video and voice — planning, model selection, inference and quality checks.',
      'Working on inference speed and evaluation for models that run in production.',
    ],
    stack: ['Python', 'PyTorch', 'LLMs', 'Diffusion models', 'Cloud GPUs'],
    accent: '#be123c',
  },
  {
    slug: 'indian-navy',
    company: 'Indian Navy',
    note: 'Internal software, delivered as an independent consultant',
    title: 'Independent Software Consultant',
    employment: 'Consultant',
    place: 'Mumbai',
    from: '04/2026',
    to: '05/2026',
    points: [
      'Built an internal web and mobile application with role-based access, bulk data processing and automated reporting.',
    ],
    stack: ['Flutter', 'PostgreSQL', 'Web', 'Android'],
    accent: '#1e3a8a',
  },
  {
    slug: 'cstoreexpert',
    company: 'CStoreExpert',
    note: 'Computer vision and audio for retail',
    title: 'AI Developer',
    employment: 'Freelance',
    place: 'United States · Remote',
    from: '02/2026',
    to: '08/2026',
    points: [
      'Built real-time computer-vision pipelines for retail store auditing.',
      'Built LLM-based generation services for automated in-store audio.',
    ],
    stack: ['PyTorch', 'YOLO', 'OpenCV', 'FastAPI'],
    accent: '#b8510f',
  },
  {
    slug: 'tenet-concepts',
    company: 'Tenet Concepts',
    note: 'Backend for a hiring platform',
    title: 'Backend Developer Intern',
    employment: 'Internship',
    place: 'Bangalore, India',
    from: '02/2024',
    to: '08/2024',
    points: [
      'Built serverless microservices for accounts, subscriptions and notifications on AWS.',
      'Improved database query performance through indexing and access-pattern work.',
    ],
    stack: ['TypeScript', 'Node.js', 'AWS Lambda', 'DynamoDB'],
    accent: '#1f4fd8',
  },
]

/* ------------------------------------------------------------------ *
 * Education.
 * ------------------------------------------------------------------ */

export interface Study {
  school: string
  short: string
  qualification: string
  place: string
  years: string
  score: { value: string; label: string }
  /** Which line drawing of the campus to show. */
  drawing: 'sjcem' | 'gpm'
}

export const EDUCATION: Study[] = [
  {
    school: 'St. John College of Engineering and Management',
    short: 'SJCEM',
    qualification: 'B.Tech, Artificial Intelligence and Machine Learning · University of Mumbai',
    place: 'Palghar, Maharashtra',
    years: '2024 — 2027',
    score: { value: '9.8', label: 'CGPA / 10' },
    drawing: 'sjcem',
  },
  {
    school: 'Government Polytechnic Mumbai',
    short: 'GPM',
    qualification: 'Diploma, Computer Engineering',
    place: 'Mumbai, Maharashtra',
    years: '2022 — 2024',
    score: { value: '84.33%', label: 'Diploma' },
    drawing: 'gpm',
  },
]

/* ------------------------------------------------------------------ *
 * Skills — the résumé's five groups. Proof names the work that uses it.
 * ------------------------------------------------------------------ */

export interface CapabilityGroup {
  id: string
  title: string
  /** What this group means in practice — not a list of nouns. */
  summary: string
  items: string[]
  /** Case slugs (linked) or role/project names (shown plain). */
  proof: string[]
}

export const CAPABILITIES: CapabilityGroup[] = [
  {
    id: 'genai',
    title: 'Generative AI',
    summary: 'Agents, retrieval and multimodal generation — from a prompt plan to a rendered result.',
    items: ['LLMs', 'Agentic Workflows', 'RAG', 'LangGraph', 'Tool Calling', 'Multimodal AI', 'Diffusion Models', 'Text-to-Speech', 'ComfyUI'],
    proof: ['non8', 'mediator', 'Addlyft'],
  },
  {
    id: 'models',
    title: 'Model Engineering',
    summary: 'Training, fine-tuning and shrinking models until they run fast on the hardware they have.',
    items: ['PyTorch', 'Hugging Face', 'LoRA', 'xLoRA', 'GGUF', 'AWQ', 'vLLM', 'Ollama', 'Distillation', 'GPU Inference Optimisation'],
    proof: ['non8', 'urbanfix', 'drone-3d'],
  },
  {
    id: 'llm-systems',
    title: 'LLM Systems',
    summary: 'The layer around the model — which one to call, what it may say, and how you know it worked.',
    items: ['Model Orchestration', 'Model Routing', 'Evaluation', 'Guardrails', 'Embeddings', 'Vector Search', 'Vertex AI'],
    proof: ['non8', 'mediator'],
  },
  {
    id: 'backend',
    title: 'Backend',
    summary: 'The services that carry model output to a user — and the cloud they run on.',
    items: ['Python', 'FastAPI', 'TypeScript', 'Node.js', 'REST APIs', 'Microservices', 'Docker', 'AWS', 'GCP', 'Git', 'CI/CD'],
    proof: ['urbanfix', 'privacy-guardian', 'Tenet Concepts'],
  },
  {
    id: 'data',
    title: 'Databases & Tools',
    summary: 'Where state lives, from serverless tables to vector indexes.',
    items: ['DynamoDB', 'PostgreSQL', 'MongoDB', 'Redis', 'SQLite', 'FAISS', 'ChromaDB', 'Linux', 'FFmpeg'],
    proof: ['non8', 'desktop-companion'],
  },
]

/* ------------------------------------------------------------------ *
 * How I work — each principle is anchored to something that happened.
 * ------------------------------------------------------------------ */

export interface Principle {
  title: string
  body: string
  evidence: string
  evidenceSlug: string
}

export const PRINCIPLES: Principle[] = [
  {
    title: 'Measure it, then decide',
    body:
      'DesktopCompanion has two complete renderers because the choice between them was too important to guess. The software path won at about 4.4 MB against 55 MB — and the build now fails if memory, CPU or handle counts drift past their budget.',
    evidence: 'DesktopCompanion',
    evidenceSlug: 'desktop-companion',
  },
  {
    title: 'A system should say how sure it is',
    body:
      'NON8 labels every answer as coming from your documents, with citations, or from general knowledge — and only claims a document when the answer actually cites one. Confidence that is not surfaced is not confidence.',
    evidence: 'NON8',
    evidenceSlug: 'non8',
  },
  {
    title: 'Fast enough that people use it',
    body:
      'NON8 went from 60–80 seconds for “hello” to under one second on a single GPU, and a document answer from 15.9 s to 2.6 s. Speed is the feature people notice before any other.',
    evidence: 'NON8',
    evidenceSlug: 'non8',
  },
  {
    title: 'Build for the deployment, not the demo',
    body:
      'Air-gapped means no fallback, so NON8 makes no network calls at all. The UrbanFix vision service detects CUDA and falls back to CPU, because the machine it lands on is not the machine I trained on.',
    evidence: 'UrbanFix AI',
    evidenceSlug: 'urbanfix',
  },
]

/* ------------------------------------------------------------------ *
 * Recognition and leadership.
 * ------------------------------------------------------------------ */

export interface Award {
  rank: string
  title: string
  org: string
  when: string
}

export const AWARDS: Award[] = [
  { rank: '1st', title: 'National level — standards for LLM tools', org: 'Bureau of Indian Standards (BIS)', when: 'Mar 2026' },
  { rank: 'Finalist', title: 'Top national finalist — TrustLayer AI', org: 'GFG ByteQuest', when: '2025' },
  { rank: 'Top 10', title: 'Vibe Coding Vol. 1 — Web UI hackathon', org: 'ThreadUp', when: 'Jun 2025' },
  { rank: 'Top 10', title: 'Hackanova 4.0 — national hackathon', org: 'Thakur College of Engineering & Technology', when: 'Feb 2025' },
]

export interface Lead {
  role: string
  org: string
  when: string
  note?: string
}

export const LEADERSHIP: Lead[] = [
  {
    role: 'Computer Vision Trainer',
    org: 'Wiserli',
    when: '2026',
    note: 'Ran a 10-day bootcamp for 80+ students — data collection, augmentation, training, evaluation and deployment of YOLO models.',
  },
  { role: 'Tech Team Lead', org: 'Google Developer Groups on Campus, SJCEM', when: 'Sep 2025 — Present' },
  { role: 'Technical Head', org: 'ASCAI — college AI & ML club', when: 'May 2025 — Present' },
]

/* ------------------------------------------------------------------ *
 * Date helpers. Dates are stored 'MM/YYYY' and rendered here only.
 * ------------------------------------------------------------------ */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const parse = (v: string) => {
  const [m, y] = v.split('/').map(Number)
  return { m, y }
}

export const monthLabel = (v: string) => {
  const { m, y } = parse(v)
  return `${MONTHS[m - 1]} ${y}`
}

/** Machine-readable, for <time datetime>. */
export const isoMonth = (v: string) => {
  const { m, y } = parse(v)
  return `${y}-${String(m).padStart(2, '0')}`
}

/** Inclusive, so Feb→Aug reads as the 7 months it was. */
export const spanMonths = (from: string, to?: string) => {
  const a = parse(from)
  const b = to ? parse(to) : { m: new Date().getMonth() + 1, y: new Date().getFullYear() }
  return Math.max(1, (b.y - a.y) * 12 + (b.m - a.m) + 1)
}

export const spanLabel = (from: string, to?: string) => {
  const n = spanMonths(from, to)
  if (n < 12) return `${n} mo${n > 1 ? 's' : ''}`
  const y = Math.floor(n / 12)
  const r = n % 12
  return r ? `${y} yr${y > 1 ? 's' : ''} ${r} mo${r > 1 ? 's' : ''}` : `${y} yr${y > 1 ? 's' : ''}`
}

export const rangeLabel = (from: string, to?: string) =>
  `${monthLabel(from)} — ${to ? monthLabel(to) : 'Present'}`
