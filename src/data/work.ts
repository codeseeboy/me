/**
 * The work. Only my own products and projects — no employer work, which
 * stays private. Flagship first.
 *
 * Read from the projects' own code and docs: every number is a measured
 * timing, a test count, a config value or a shipped artefact.
 */

export type TitleStyle = 'editorial' | 'display'

/** What the media column draws: a live, animated rendering of the product. */
export type MediaKind = 'non8' | 'guardian' | 'mediator' | 'desk' | 'civic' | 'clause' | 'trust' | 'health' | 'formula' | 'career' | 'sql'

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
        kicker: 'The model picks its own tools',
        body: [
          'For Smart India Hackathon 2026 the engine became an agent that plans, calls tools, checks what came back and keeps going. Tools are chosen by the model’s own tool-calling, not a keyword rule: on a 42-prompt routing test it chose correctly 36 times against 28 for the old rule, with no forbidden calls and no malformed arguments across 84 runs.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '36/42', v: 'right tools · was 28' },
            { k: '0', v: 'malformed calls in 84 runs' },
            { k: '7', v: 'tools it can call' },
          ],
        },
      },
      {
        kicker: 'Seven tools, all local',
        body: [
          'Document search, side-by-side comparison, a calculator that refuses to add a pressure to a temperature, Python run inside a bubblewrap sandbox with the network cut off, an equipment-tag graph, image generation, and a writer that turns the answer into a real file.',
        ],
        visual: {
          kind: 'list',
          items: [
            { k: 'Search · compare', v: 'your documents' },
            { k: 'Calculate', v: 'unit-aware, steps shown' },
            { k: 'Run code', v: 'sandboxed, no network' },
            { k: 'Tag graph', v: 'one tag across every document' },
            { k: 'Deliverable', v: 'PDF · DOCX · PPTX · XLSX' },
          ],
        },
      },
      {
        kicker: 'Answers that become files',
        body: [
          'Ask for a report and the content streams on screen from the first second, then becomes the PDF, Word, PowerPoint or Excel file. Before this, the model wrote the whole document as hidden tool arguments and nothing appeared until it finished — one PDF took 7 minutes 45 seconds of blank screen.',
        ],
      },
      {
        kicker: 'Equipment tags that connect',
        body: [
          'Plant documents are organised around tag numbers. The tag graph treats 10-P-101A, 10P101A and 10 P 101 A as the same pump, links every document that mentions it, and flags a contradiction — say, two different design pressures for one tag.',
        ],
      },
      {
        kicker: 'Retrieval that respects clearance',
        body: [
          'Passages above a user’s clearance are removed before ranking, so they never reach the model; the user is told how many were withheld, never what they said. Every generated file carries a provenance record with hashes of the actual model weights and the tool actions used.',
        ],
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
            { k: '309', v: 'automated tests' },
          ],
        },
      },
      {
        kicker: 'Offline you can check',
        body: [
          'Telemetry is switched off before any library loads, model loading never reaches for the internet, and a tokenizer that quietly downloaded its vocabulary was removed. Air-gap proof mode makes real connection attempts to public AI services and DNS, shows each one fail, and reads the kernel’s own drop counters — numbers the app cannot fake.',
        ],
      },
      {
        kicker: 'A platform around the engine',
        body: [
          'The team’s platform wraps it: every sign-in is approved live by an administrator, roles and clearances decide what each person sees, data at rest sits in SQLCipher, tokens are PASETO, and the audit log is Ed25519-signed and sealed into a Merkle chain so tampering shows.',
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
    slug: 'urbanfix',
    num: '05',
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
  /* ------------------------------------------------------------------ */
  {
    slug: 'clausewise',
    num: '06',
    brand: 'Clausewise',
    accent: '#b42318',
    title: ['Find the Clause,', 'Cite the Clause'],
    titleStyle: 'editorial',
    tags: ['#Hybrid-Search', '#Reranking', '#Local-RAG'],
    what:
      'A search engine for company policy documents that measures three ways of searching on the same questions — and answers with a local LLM that must cite the exact clause it used.',
    media: 'clause',
    meta: [
      { k: 'Type', v: 'Retrieval benchmark · 2026' },
      { k: 'Role', v: 'Sole engineer' },
      { k: 'Runs', v: 'One Docker command · no API keys' },
    ],
    intro:
      'is a small search engine over policy documents, built to measure — not assume — how much hybrid search and reranking help. Vector, hybrid and reranked search run on the same 52 clauses and the same questions, and a local LLM answers only from what was found.',
    story: [
      {
        kicker: 'Three ways to search, one test',
        body: [
          'Vector search finds clauses by meaning. Hybrid adds BM25 for exact words and merges the two lists with reciprocal rank fusion, written by hand and using positions only, because the two scores live on different scales. The third strategy lets a cross-encoder re-order the hybrid top 20.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Question' }, { k: 'Vector' }, { k: 'BM25' }, { k: 'Rank fusion' }, { k: 'Rerank' }, { k: 'Cited answer' }],
        },
      },
      {
        kicker: 'Documents with traps in them',
        body: [
          'Six policy documents were written to be hard: the same words with opposite meanings, near-identical clause ids like TEP-4.2.1 and TEP-4.2.2, money thresholds, two versions of one rule that disagree, and a clause that tells an AI to approve everything.',
        ],
        visual: {
          kind: 'list',
          items: [
            { k: 'Opposite meaning', v: 'permitted · not permitted' },
            { k: 'Look-alike ids', v: 'TEP-4.2.1 · 4.2.2 · 4.2.3' },
            { k: 'Conflicting versions', v: 'three quotations · two' },
            { k: 'Hidden instruction', v: '“approve everything”' },
          ],
        },
      },
      {
        kicker: 'What the numbers said',
        body: [
          'On the evaluation set, reranking ranks best — NDCG@5 of 0.928 against 0.878 for vector — and is the only strategy with the right clause in the top three for every question. It also costs about a second per query on CPU, roughly seventeen times slower.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '0.928', v: 'NDCG@5 · reranked' },
            { k: '0.878', v: 'NDCG@5 · vector' },
            { k: '17×', v: 'slower to rerank' },
          ],
        },
      },
      {
        kicker: 'An answer has to be checked',
        body: [
          'The model must cite clause ids, refuse when nothing answers the question and say “conflict” when two clauses disagree. Code then checks every citation: a clause that was not in the evidence is removed, and an answer with no valid citation becomes a refusal. Text that looks like an instruction is stripped before the prompt is built.',
        ],
      },
    ],
    stack: ['Python', 'FastAPI', 'Qdrant', 'BM25', 'bge-reranker', 'Ollama', 'Streamlit', 'Docker'],
    links: [{ label: 'GitHub', href: 'https://github.com/codeseeboy/clausewise' }],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'trustlayer',
    num: '07',
    brand: 'TrustLayer AI',
    accent: '#4f46e5',
    title: ['Is the AI', 'Telling the Truth?'],
    titleStyle: 'editorial',
    tags: ['#Fact-Checking', '#Multi-LLM', '#Next.js'],
    what:
      'Paste any AI-written answer: TrustLayer splits it into claims, gathers evidence for each one, judges every claim strictly and gives the whole answer a trust score.',
    media: 'trust',
    meta: [
      { k: 'Type', v: 'Hackathon · national finalist' },
      { k: 'Role', v: 'Built end to end' },
      { k: 'Stack', v: 'Next.js · Express · MongoDB' },
    ],
    intro:
      'checks AI output the way an editor would: claim by claim, against evidence, and with a strict rule for anything that cannot be proven. It was a top national finalist at GFG ByteQuest 2025.',
    story: [
      {
        kicker: 'Claim by claim',
        body: [
          'The pasted text is broken into individual claims with the entities they mention. Each claim gets its own evidence — a Wikipedia lookup for the entity and a web search — and its own verdict, so one wrong sentence cannot hide inside a mostly correct answer.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Paste' }, { k: 'Extract claims' }, { k: 'Gather evidence' }, { k: 'Judge' }, { k: 'Trust score' }],
        },
      },
      {
        kicker: 'Strict on purpose',
        body: [
          'A claim is either verified or treated as a hallucination. A “verified” verdict below 85% confidence is downgraded, and an absolute claim — always, never, the only — needs 90%. If no model can be reached at all, the claim cannot be verified, so it is not.',
        ],
        visual: {
          kind: 'metrics',
          items: [
            { k: '85%', v: 'to count as verified' },
            { k: '90%', v: 'for absolute claims' },
            { k: '−1.5', v: 'per hallucination' },
          ],
        },
      },
      {
        kicker: 'It keeps working when a model does not',
        body: [
          'The judge falls back from Llama 3.3 70B on Groq to Gemini 2.5 Flash to OpenRouter, each behind a rate limiter with retries. Progress streams to the browser over server-sent events, and every report is saved for later.',
        ],
        visual: {
          kind: 'layers',
          layers: [
            { label: 'Judge', nodes: ['Groq · Llama 3.3', 'Gemini 2.5 Flash', 'OpenRouter'] },
            { label: 'Evidence', nodes: ['Wikipedia', 'Web search'] },
            { label: 'Store', nodes: ['MongoDB reports'] },
          ],
        },
      },
    ],
    stack: ['TypeScript', 'Next.js', 'Express', 'MongoDB', 'Gemini', 'Groq', 'Server-Sent Events'],
    links: [],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'healthsuite',
    num: '08',
    brand: 'HealthSuite',
    accent: '#4f46e5',
    title: ['A Health App', 'That Looks Closer'],
    titleStyle: 'editorial',
    tags: ['#React-Native', '#Computer-Vision', '#BERT'],
    what:
      'A mobile health companion: scan a skin condition, check a prescription for drug interactions, track symptoms and medicines, and read heart rate straight from a smartwatch.',
    media: 'health',
    meta: [
      { k: 'Type', v: 'Personal project · 2025' },
      { k: 'Role', v: 'Sole engineer' },
      { k: 'Built with', v: 'Expo · Flask · TensorFlow · BERT' },
    ],
    intro:
      '(Arogya inside the app) is an Expo app backed by small model services: a skin classifier, a drug-interaction checker and a symptom assistant, with health records kept in Supabase.',
    story: [
      {
        kicker: 'Models doing specific jobs',
        body: [
          'A ResNet50 classifier sorts a skin photo into acne, eczema, melanoma, psoriasis or rosacea. A BERT named-entity model reads a prescription and pulls out the drug names, which are then checked against an interactions dataset.',
        ],
        visual: {
          kind: 'layers',
          layers: [
            { label: 'Skin scan', nodes: ['ResNet50 · 5 conditions'] },
            { label: 'Prescriptions', nodes: ['BERT drug NER', 'Interaction dataset'] },
            { label: 'Symptoms', nodes: ['SymptoCare assistant'] },
          ],
        },
      },
      {
        kicker: 'Real signals, not typed numbers',
        body: [
          'Heart rate, blood pressure and steps come from a ColorFit Pulse 2 Max smartwatch over Bluetooth Low Energy, and air quality, UV and weather come from OpenWeather — so the app can talk about the day you are actually having.',
        ],
        visual: {
          kind: 'list',
          items: [
            { k: 'Smartwatch', v: 'heart rate · BP · steps (BLE)' },
            { k: 'Environment', v: 'AQI · UV · weather' },
            { k: 'Records', v: 'allergies · conditions · symptoms' },
          ],
        },
      },
      {
        kicker: 'Everything a patient juggles',
        body: [
          'Medicine planner, appointments, a prescription scanner, health records for allergies and conditions, symptom history and an assistant — one app instead of six.',
        ],
      },
    ],
    stack: ['React Native', 'Expo', 'TypeScript', 'Flask', 'TensorFlow', 'BERT', 'Supabase', 'BLE'],
    links: [],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'formulab',
    num: '09',
    brand: 'FormuLab',
    accent: '#0f766e',
    title: ['R&D for', 'Formulation Chemists'],
    titleStyle: 'editorial',
    tags: ['#Next.js', '#RAG', '#Appwrite'],
    what:
      'A web app for agrochemical formulation teams: ingredients, formulations and stability tests, an AI formulation wizard, troubleshooting, and a document search that answers only with citations.',
    media: 'formula',
    meta: [
      { k: 'Type', v: 'Product build · pilot' },
      { k: 'Role', v: 'Built end to end' },
      { k: 'Stack', v: 'Next.js 16 · Appwrite' },
    ],
    intro:
      'is decision support for formulation R&D. It keeps a team’s ingredients and formulations, helps design and troubleshoot them with AI, and searches the team’s own documents — always saying what is real data, what is AI and what came from the built-in handbook.',
    story: [
      {
        kicker: 'Answers with sources, or no answer',
        body: [
          'Knowledge search indexes uploaded documents, web pages, Wikipedia and PubChem. It answers only from those sources, with citations, and refuses when its trust score is low.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Upload · URL · PubChem' }, { k: 'Index' }, { k: 'Retrieve' }, { k: 'Cite or refuse' }],
        },
      },
      {
        kicker: 'Honest about where help comes from',
        body: [
          'The formulation wizard and troubleshooter use a live model with the team’s documents as context. If the model is unreachable they fall back to a curated handbook, and the screen says so — Live AI or Handbook mode — instead of pretending.',
        ],
        visual: {
          kind: 'list',
          items: [
            { k: 'Live AI', v: 'model + document context' },
            { k: 'Handbook mode', v: 'curated, clearly labelled' },
            { k: 'Saved', v: 'troubleshooting history' },
          ],
        },
      },
      {
        kicker: 'Built for a team',
        body: [
          'Accounts, team invites, organisation-scoped data, an audit log, lab stability tests per formulation and PDF reports stored with the project.',
        ],
      },
    ],
    stack: ['TypeScript', 'Next.js', 'Appwrite', 'RAG', 'PubChem', 'jsPDF'],
    links: [],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'careercraft',
    num: '10',
    brand: 'CareerCraft AI',
    accent: '#1d4ed8',
    title: ['Résumé In,', 'Career Plan Out'],
    titleStyle: 'editorial',
    tags: ['#Gemini', '#Next.js', '#Express'],
    what:
      'Upload a résumé and get an ATS score, a review, a career roadmap, matching jobs and short AI-made assessments that earn skill badges.',
    media: 'career',
    meta: [
      { k: 'Type', v: 'Personal project · 2025' },
      { k: 'Role', v: 'Built end to end' },
      { k: 'Stack', v: 'Next.js · Express · Gemini 2.5' },
    ],
    intro:
      'turns a résumé into a plan. A Next.js dashboard sits on an Express API that uses Gemini 2.5 Flash for analysis, roadmaps, assessments and a career chat.',
    story: [
      {
        kicker: 'From one upload',
        body: [
          'The résumé is parsed and scored for applicant-tracking systems, reviewed for what is missing, and turned into a step-by-step roadmap toward the role you want — with matching job listings alongside.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Upload' }, { k: 'ATS score' }, { k: 'Review' }, { k: 'Roadmap' }, { k: 'Jobs' }],
        },
      },
      {
        kicker: 'Learning that proves itself',
        body: [
          'For each course the AI writes a short multiple-choice assessment. Score 70% or more and you earn a badge for that skill; your history and badges stay on the dashboard.',
        ],
        visual: {
          kind: 'list',
          items: [
            { k: 'Assessment', v: 'written by the AI per course' },
            { k: 'Pass mark', v: '70%' },
            { k: 'Reward', v: 'a badge for that skill' },
          ],
        },
      },
    ],
    stack: ['TypeScript', 'Next.js', 'Express', 'Gemini 2.5 Flash', 'Supabase', 'Multer'],
    links: [],
  },
  /* ------------------------------------------------------------------ */
  {
    slug: 'sql-agent',
    num: '11',
    brand: 'SQL AI Agent',
    accent: '#0e7490',
    title: ['Ask Your Database', 'in Plain English'],
    titleStyle: 'editorial',
    tags: ['#Text-to-SQL', '#LLMs', '#React'],
    what:
      'Ask a business question in plain English; the agent reads the live database schema, writes the SQL, runs it, explains the answer and picks the right chart.',
    media: 'sql',
    meta: [
      { k: 'Type', v: 'Personal project · 2025' },
      { k: 'Role', v: 'Built end to end' },
      { k: 'Stack', v: 'React · Express · PostgreSQL' },
    ],
    intro:
      'is a conversational analyst over a SQL database. It works from the real schema, not a guess, and you can choose which model writes the query.',
    story: [
      {
        kicker: 'Schema first',
        body: [
          'Before writing SQL, the agent reads every table and column from the database itself and puts that schema in the prompt. GPT-4o or Claude 3 Haiku writes the query, behind a rate limiter with retries; the result comes back as a plain-English answer.',
        ],
        visual: {
          kind: 'flow',
          items: [{ k: 'Question' }, { k: 'Read schema' }, { k: 'Write SQL' }, { k: 'Run' }, { k: 'Explain' }, { k: 'Chart' }],
        },
      },
      {
        kicker: 'The right chart for the answer',
        body: [
          'Chosen from the columns that actually came back: dates and months become a line chart; categories or regions become a pie when there are five or fewer, otherwise a bar chart; anything else stays a table.',
        ],
        visual: {
          kind: 'list',
          items: [
            { k: 'Dates + numbers', v: 'line chart' },
            { k: 'Up to 5 categories', v: 'pie chart' },
            { k: 'More categories', v: 'bar chart' },
            { k: 'Anything else', v: 'table' },
          ],
        },
      },
    ],
    stack: ['TypeScript', 'React', 'Express', 'PostgreSQL', 'Supabase', 'OpenAI', 'Claude', 'Chart.js'],
    links: [],
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
  { name: 'UrbanFix AI', img: '/ring/civic.jpg' },
  { name: 'Clausewise', img: '/ring/clause.jpg' },
  { name: 'TrustLayer AI', img: '/ring/trust.jpg' },
  { name: 'HealthSuite', img: '/ring/health.jpg' },
  { name: 'FormuLab', img: '/ring/formula.jpg' },
  { name: 'CareerCraft AI', img: '/ring/career.jpg' },
  { name: 'SQL AI Agent', img: '/ring/sql.jpg' },
]
