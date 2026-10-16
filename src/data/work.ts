/**
 * The work. Only my own products and projects — no client or employer work,
 * which stays private. Six cases, flagship first.
 *
 * Read from the projects' own code and docs: every number is a measured
 * timing, a test count, a config value or a shipped artefact.
 */

export type TitleStyle = 'editorial' | 'display'

/** What the media column draws: a live, animated rendering of the product. */
export type MediaKind = 'non8' | 'guardian' | 'mediator' | 'desk' | 'mesh' | 'civic'

export interface StoryVisual {
  kind: 'flow' | 'layers' | 'metrics' | 'list' | 'quote'
  /** flow / list: ordered labels. */
  items?: { k: string; v?: string }[]
  /** layers: top-to-bottom tiers of a system. */
  layers?: { label: string; nodes: string[] }[]
  /** quote: one line set large. */
  text?: string
}

export interface StoryRow {
  kicker: string
  body: string[]
  visual?: StoryVisual
}

export interface CaseStudy {
  slug: string
  num: string
  /** Product name. Set as an uppercase wordmark above the title; used as-is in sentences. */
  brand: string
  /** The project's colour: wordmark, media accents, the dive veil. Contrast-checked on white. */
  accent: string
  title: string[]
  titleStyle: TitleStyle
  tags: string[]
  /** One sentence for the cover — what it is, for someone who has never heard of it. */
  what: string
  media: MediaKind
  /** When the product has its own page, "Deep dive" goes there instead of a case page. */
  to?: string
  /** The black band under the cover. */
  meta: { k: string; v: string }[]
  /** Continues the product name: "{brand} {intro}". */
  intro: string
  story: StoryRow[]
  stack: string[]
  links: { label: string; href: string }[]
}

export const CASES: CaseStudy[] = [
  /* ------------------------------------------------------------------ */
  {
    slug: 'non8',
    num: '01',
    brand: 'NON8',
    accent: '#17694a',
    title: ['Offline AI', 'Appliance'],
    titleStyle: 'editorial',
    tags: ['#Local-LLMs', '#Agentic-RAG', '#Air-gapped'],
    what:
      'A ChatGPT-class assistant in one box — chat, cited answers from your documents, image generation and voice — running on a single local GPU, with no cloud API and nothing leaving the machine.',
    media: 'non8',
    meta: [
      { k: 'Type', v: 'Independent product · SIH 2026' },
      { k: 'My part', v: 'The AI engine, end to end' },
      { k: 'Runs on', v: 'One 12 GB GPU · zero egress' },
    ],
    intro:
      'is a private AI appliance for places where data may not leave the building and the machine may have no network at all. In a small product team, I designed and built its AI engine — the agent, retrieval, model serving and the guarantee that nothing goes out.',
    story: [
      {
        kicker: 'Everything a hosted assistant does — offline',
        body: [
          'Ask anything, or attach a PDF, Word, Excel, PowerPoint or CSV file and get a streamed answer that says where it came from: From your documents, with citations, or From general knowledge. Dictate by voice, generate an image with /image, regenerate, export, search every past chat.',
        ],
        visual: {
          kind: 'list',
          items: [
            { k: 'Chat & code', v: 'Qwen 2.5 14B, local' },
            { k: 'Documents', v: 'cited answers' },
            { k: 'Images', v: 'SDXL on the same GPU' },
            { k: 'Voice', v: 'Whisper, on-device' },
          ],
        },
      },
      {
        kicker: 'An agent graph, not a chain',
        body: [
          'Every turn runs a LangGraph state machine: a two-stage prompt-injection firewall, a triage step that lets small talk skip retrieval entirely, hybrid search, and a final check that only labels an answer as “from your documents” when it actually cites one.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Safety' }, { k: 'Triage' }, { k: 'Retrieve' }, { k: 'Compress' }, { k: 'Respond' }, { k: 'Finalize' }],
        },
      },
      {
        kicker: 'Retrieval that holds up',
        body: [
          'Each chat gets its own FAISS index on disk, so one conversation can never read another’s files — isolation by structure, not by a filter. Dense and BM25 search run in parallel, fuse by reciprocal rank and are reranked by a local cross-encoder; scanned pages fall back to OCR.',
        ],
        visual: {
          kind: 'layers',
          layers: [
            { label: 'Search', nodes: ['FAISS · nomic-embed', 'BM25'] },
            { label: 'Fuse', nodes: ['Reciprocal rank'] },
            { label: 'Rerank', nodes: ['bge cross-encoder'] },
          ],
        },
      },
      {
        kicker: 'From answers to finished work',
        body: [
          'For Smart India Hackathon 2026 the engine became an agent. It plans, calls tools — document search, sandboxed code with the network blocked, unit-aware calculation — checks the results and writes real .docx, .xlsx and .pptx files. Passages above a user’s clearance are removed before ranking, so they never reach the model.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Plan' }, { k: 'Search' }, { k: 'Compute' }, { k: 'Check' }, { k: 'Draft' }],
        },
      },
      {
        kicker: 'Fast on a single GPU',
        body: [
          '“Hello” used to take 60–80 seconds. Keeping one 14B model resident instead of swapping two, warming it at start-up and letting trivial turns skip the pipeline brought it under one second — and a document question from 15.9 s to 2.6 s.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '0.8s', v: 'was 60–80 s' },
            { k: '2.6s', v: 'document answer' },
            { k: '157', v: 'engine tests' },
          ],
        },
      },
      {
        kicker: 'Offline you can check',
        body: [
          'Telemetry is switched off before any library loads, model loading never reaches for the internet, and a tokenizer that silently downloaded its vocabulary was removed outright. An air-gap self-test makes real connection attempts to public AI services and DNS and shows every one of them fail.',
        ],
      },
    ],
    stack: ['Python', 'FastAPI', 'LangGraph', 'Ollama', 'Qwen 2.5', 'FAISS', 'BM25', 'SDXL', 'faster-whisper', 'Tesseract', 'React'],
    links: [],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'privacy-guardian',
    num: '02',
    brand: 'Privacy Guardian',
    accent: '#6d4aff',
    title: ['Lock It From', 'Your Phone'],
    titleStyle: 'editorial',
    tags: ['#Rust', '#Flutter', '#Windows'],
    what:
      'Lock the websites, apps, folders and Chrome profiles you choose on a Windows laptop — then see its screen and unlock one thing with your fingerprint, from your phone, anywhere.',
    media: 'guardian',
    to: '/services/privacy-guardian',
    meta: [],
    intro: '',
    story: [],
    stack: ['Rust', 'Flutter', 'Chrome extension'],
    links: [],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'mediator',
    num: '03',
    brand: 'Mediator',
    accent: '#15803d',
    title: ['Your AI Chat,', 'Now an Agent'],
    titleStyle: 'editorial',
    tags: ['#MCP', '#Python', '#Agents'],
    what:
      'Connects the AI chat you already use to your files, terminal, git and tests. It runs the commands, checks its own work and asks before anything risky — with no API key.',
    media: 'mediator',
    to: '/services/mediator',
    meta: [],
    intro: '',
    story: [],
    stack: ['Python', 'MCP', 'React'],
    links: [],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'desktop-companion',
    num: '04',
    brand: 'DesktopCompanion',
    accent: '#0f62b4',
    title: ['A Desktop Layer', 'Built in Rust'],
    titleStyle: 'editorial',
    tags: ['#Rust', '#Win32', '#DirectWrite'],
    what:
      'A native Windows overlay that draws live system information straight onto the desktop — in 5.3 MB of memory, and with zero wake-ups while the screen is off.',
    media: 'desk',
    meta: [
      { k: 'Type', v: 'Systems project · 2026' },
      { k: 'Role', v: 'Sole engineer' },
      { k: 'Measured', v: '5.3 MB · 0.16% of one core' },
    ],
    intro:
      'is a Windows desktop layer written in Rust directly against Win32 — no Electron, no browser engine, no runtime. Every decision is justified against a written performance budget, and the build enforces that budget.',
    story: [
      {
        kicker: 'One window, no render loop',
        body: [
          'Text is drawn with DirectWrite into a small bitmap and handed to Windows through UpdateLayeredWindowIndirect. Only rows that changed are redrawn — at most four dirty rectangles — and there is no swap chain, no vsync wait and no repaint loop.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Sample' }, { k: 'Compare' }, { k: 'Layout' }, { k: 'Raster dirty rows' }, { k: 'Hand to DWM' }],
        },
      },
      {
        kicker: 'Two renderers, one winner',
        body: [
          'Both a software layered renderer and a DirectComposition renderer were built behind one interface and measured. The layered path won at about 4.4 MB against roughly 55 MB, and it keeps the GPU driver out of the process entirely.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '4.4MB', v: 'layered renderer' },
            { k: '55MB', v: 'DirectComposition' },
            { k: '−66%', v: 'raster time, tuned' },
          ],
        },
      },
      {
        kicker: 'Sleep is the feature',
        body: [
          'One coalescing one-second tick replaces five drifting timers. Battery and network changes arrive as Windows events instead of polls, and the clock wakes once a minute. With the display off or the session locked, every timer is cancelled.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '≤1.02', v: 'wake-ups/s, active' },
            { k: '0', v: 'wake-ups, display off' },
            { k: '1', v: 'owned thread' },
          ],
        },
      },
      {
        kicker: 'A budget the build enforces',
        body: [
          'cargo xtask measure checks working set, CPU, handles, GDI and USER objects, allocations per tick and bytes written — a regression fails the build. It holds at 5.3 MB, 226 handles, 4 GDI and 6 USER objects, with zero growth across 200 repaints.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '5.3MB', v: 'private memory' },
            { k: '0.16%', v: 'of one core' },
            { k: '299', v: 'tests' },
          ],
        },
      },
      {
        kicker: 'Native down to the digits',
        body: [
          'Numbers use tabular figures, so digits never jitter and a changing value keeps the same dirty rectangle. Text uses greyscale anti-aliasing over the wallpaper, the system’s own UI font, and per-monitor DPI.',
        ],
      },
    ],
    stack: ['Rust', 'Win32', 'DirectWrite', 'Direct2D', 'DirectComposition', 'ETW'],
    links: [],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'drone-3d',
    num: '05',
    brand: 'UAV 3D',
    accent: '#4338ca',
    title: ['Drone Video', 'to a 3D Map'],
    titleStyle: 'editorial',
    tags: ['#COLMAP', '#Photogrammetry', '#three.js'],
    what:
      'One continuous drone flight in; camera poses, a dense point cloud, a textured mesh and a 3D viewer you can measure in come out — with accuracy figures attached to every claim.',
    media: 'mesh',
    meta: [
      { k: 'Type', v: 'Computer vision · 2026' },
      { k: 'Role', v: 'Sole engineer' },
      { k: 'Runs on', v: 'Remote TITAN Xp over SSH' },
    ],
    intro:
      'turns a single pass of drone video into georeferenced 3D. Heavy processing runs on a remote GPU; the laptop drives the pipeline and serves the viewer.',
    story: [
      {
        kicker: 'Frames worth keeping',
        body: [
          'A 35-second 2560×1440 flight up a glass tower gives 211 frames; 40 keyframes are chosen by measured optical-flow overlap. COLMAP registers all 40 at 0.389 px mean reprojection error.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Video' }, { k: 'Keyframes' }, { k: 'SfM' }, { k: 'Dense MVS' }, { k: 'Mesh' }, { k: 'Viewer' }],
        },
      },
      {
        kicker: 'Dense, then solid',
        body: [
          'CUDA patch-match stereo turns the sparse model into 447,207 dense points, then a 446,613-triangle textured mesh exported as GLB.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '447K', v: 'dense points' },
            { k: '40/40', v: 'frames registered' },
            { k: '0.256', v: 'px median error' },
          ],
        },
      },
      {
        kicker: 'Real metres, not model units',
        body: [
          'On a 48-image geotagged survey, GPS goes WGS84 → ECEF → ENU and an Umeyama similarity under RANSAC recovers scale: 48 of 48 inliers at 2.38 m RMSE. A distance measured in the viewer read 142.53 m against a hand calculation of 142.4 m.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '2.38m', v: 'trajectory RMSE' },
            { k: '48/48', v: 'GPS inliers' },
            { k: '142.5m', v: 'measured in viewer' },
          ],
        },
      },
      {
        kicker: 'Honest about what it cannot see',
        body: [
          'Mirrored glass breaks every stereo matcher, so half the tower has no points — and the viewer says so, reporting texture coverage and per-point confidence instead of presenting holes as finished geometry. A Flight button steps through the real drone poses.',
        ],
      },
    ],
    stack: ['Python', 'COLMAP', 'CUDA', 'OpenCV', 'PyTorch', 'three.js', 'React', 'FastAPI'],
    links: [],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'urbanfix',
    num: '06',
    brand: 'UrbanFix AI',
    accent: '#17784a',
    title: ['Civic Issue', 'Intelligence'],
    titleStyle: 'display',
    tags: ['#SigLIP', '#YOLOv8', '#React-Native'],
    what:
      'A civic reporting platform: citizens report problems from a phone, AI classifies and scores every photo, and municipal teams track each fix to a proof of resolution.',
    media: 'civic',
    meta: [
      { k: 'Type', v: 'Final-year capstone' },
      { k: 'Role', v: 'Sole engineer, end to end' },
      { k: 'Shipped', v: 'App · API · AI service · admin' },
    ],
    intro:
      'is my capstone, built alone: a React Native app with citizen, worker and municipal roles, an Express API on Supabase, a Python AI service and a municipal admin console.',
    story: [
      {
        kicker: 'Photos in, decisions out',
        body: [
          'A municipality cannot tell from a photo what the issue is, how bad it is, whether it is a duplicate, or who owns it. UrbanFix answers all four before a person has to look.',
        ],
      },
      {
        kicker: 'A router first, specialists second',
        body: [
          'A SigLIP vision-language model routes each photo to a category zero-shot, so a new category is a prompt, not a retraining run. The category then wakes one of five YOLOv8 detectors trained for it, with YOLO-World covering open-vocabulary classes.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Photo' }, { k: 'SigLIP router' }, { k: 'Specialist' }, { k: 'Fusion' }, { k: 'Department' }],
        },
      },
      {
        kicker: 'Two opinions, one score',
        body: [
          'Router and specialist scores blend at a tuned 0.32 / 0.68, and an “other-veto” rule reclaims genuine reports the router weakly dismissed — fewer false negatives.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '0.32', v: 'router weight' },
            { k: '0.68', v: 'specialist weight' },
            { k: '5', v: 'YOLOv8 detectors' },
          ],
        },
      },
      {
        kicker: 'The platform around the model',
        body: [
          'A geo feed on PostGIS, upvotes and follows, push notifications, a status timeline that ends in a resolution proof, and points, badges and leaderboards that keep citizens reporting.',
        ],
        visual: {
          kind: 'layers',
          layers: [
            { label: 'App', nodes: ['Citizen', 'Worker', 'Municipal'] },
            { label: 'API', nodes: ['Express', 'JWT roles', 'FCM push'] },
            { label: 'Data · AI', nodes: ['Supabase PostGIS', 'FastAPI vision'] },
          ],
        },
      },
      {
        kicker: 'Built for the hardware it lands on',
        body: [
          'The vision service ships as its own Docker container, detects CUDA, falls back to CPU, and has a router-only fast mode for constrained machines.',
        ],
      },
    ],
    stack: ['Python', 'PyTorch', 'YOLOv8', 'SigLIP', 'FastAPI', 'React Native', 'Expo', 'Node.js', 'Supabase', 'PostGIS', 'Docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/codeseeboy/urban-fix-ai' }],
  },
]

export const caseBySlug = (slug: string) => CASES.find((c) => c.slug === slug)

/** Where a case's "Deep dive" goes. */
export const caseHref = (c: CaseStudy) => c.to ?? `/work/${c.slug}`

/* ------------------------------------------------------------------ *
 * The hero ring — one card per product, each a real screen.
 * ------------------------------------------------------------------ */

export interface RingCard {
  name: string
  /** A portrait still of the product's own screen, from public/. */
  img: string
}

export const RING: RingCard[] = [
  { name: 'NON8', img: '/ring/non8.jpg' },
  { name: 'Privacy Guardian', img: '/ring/guardian.jpg' },
  { name: 'Mediator', img: '/ring/mediator.jpg' },
  { name: 'DesktopCompanion', img: '/ring/desk.jpg' },
  { name: 'UAV 3D', img: '/ring/mesh.jpg' },
  { name: 'UrbanFix AI', img: '/ring/civic.jpg' },
]
