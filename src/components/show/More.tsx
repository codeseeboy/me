import { at, cx } from './Stage'
import './show.css'
import './more.css'

/*
 * Six more products, each in its own app's colours and layout and stepped
 * through the one thing it does. Interface wording follows each codebase;
 * sample questions and data are illustrative but true where they state a fact.
 */

/* ================================================================== *
 * Clausewise — one question, three ways to search, one cited answer.
 * Example from the project README: vector search puts PRC-4.1 first for
 * "ACP-4.2"; BM25 matches the id exactly.
 * ================================================================== */

export const CLAUSE_STEPS = [900, 900, 900, 1000, 3600]

const CW_COLS: { name: string; ndcg: string; rows: [string, boolean][] }[] = [
  { name: 'vector', ndcg: '0.878', rows: [['PRC-4.1', false], ['ACP-4.2', true], ['ACP-4.1', false]] },
  { name: 'hybrid', ndcg: '0.794', rows: [['ACP-4.2', true], ['ACP-4.1', false], ['PRC-4.1', false]] },
  { name: 'hybrid + rerank', ndcg: '0.928', rows: [['ACP-4.2', true], ['ACP-4.1', false], ['TEP-4.2.1', false]] },
]

export function ClauseShow({ step }: { step: number }) {
  const on = at(step)
  return (
    <div className="cw">
      <div className="cw__bar">
        <i />
        <i />
        <i />
        <span>localhost:8501 · Clausewise</span>
      </div>
      <div className="cw__body">
        <aside className="cw__side">
          <strong>Clausewise</strong>
          <small>Policy search</small>
          <span className="cw__k">Index</span>
          <p>52 clauses · 6 documents</p>
          <span className="cw__k">Models</span>
          <p>bge-small · bge-reranker-base · qwen2.5 7B</p>
          <span className="cw__k">Runs on</span>
          <p>this machine · no API keys</p>
        </aside>
        <main className="cw__main">
          <div className={cx('cw__q', 'sh', on(0) && 'is-on')}>
            <span>Question</span>
            Summarise clause ACP-4.2.
          </div>
          <div className="cw__cols">
            {CW_COLS.map((c, i) => (
              <div key={c.name} className={cx('cw__col', 'sh', on(i + 1) && 'is-on', i === 2 && 'is-best')}>
                <header>
                  {c.name}
                  <em>NDCG@5 {c.ndcg}</em>
                </header>
                {c.rows.map(([id, ok], r) => (
                  <div key={id} className={cx('cw__hit', ok && 'is-ok', r === 0 && !ok && 'is-miss')}>
                    <b>{r + 1}</b>
                    <code>{id}</code>
                    {r === 0 && <span>{ok ? '✓' : '✕'}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className={cx('cw__ans', 'sh', on(4) && 'is-on')}>
            <span className="cw__k">Answer · from the clauses found</span>
            <p>
              Access rights must be reviewed every 90 days by the Department Head. <cite>ACP-4.2</cite>
            </p>
            <small>✓ Every citation was in the evidence</small>
          </div>
        </main>
      </div>
    </div>
  )
}

/* ================================================================== *
 * TrustLayer AI — paste an answer, check it claim by claim.
 * Score: verified +1, hallucinated −1.5, normalised — 2 of 3 → 67%.
 * ================================================================== */

export const TRUST_STEPS = [1000, 1000, 1100, 1100, 3600]

const TL_CLAIMS: { t: string; ok: boolean; src: string }[] = [
  { t: 'Completed in 1889 for the World’s Fair', ok: true, src: 'Wikipedia · Eiffel Tower' },
  { t: 'The tallest structure in Europe', ok: false, src: 'Web search · 3 sources' },
  { t: 'Built by Gustave Eiffel’s company', ok: true, src: 'Wikipedia · Gustave Eiffel' },
]

export function TrustShow({ step }: { step: number }) {
  const on = at(step)
  return (
    <div className="tl">
      <div className="tl__left">
        <span className="tl__k">Paste AI-generated response</span>
        <p className="tl__text">
          The Eiffel Tower was <mark className={cx(on(1) && 'is-on')}>completed in 1889 for the World’s Fair</mark>. It is{' '}
          <mark className={cx(on(1) && 'is-on', on(3) && 'is-bad')}>the tallest structure in Europe</mark>, and it was{' '}
          <mark className={cx(on(1) && 'is-on')}>built by Gustave Eiffel’s company</mark>.
        </p>
        <span className="tl__btn">Verify response</span>
        <ul className={cx('tl__log', 'sh', on(2) && 'is-on')}>
          <li>› 3 claims extracted</li>
          <li>› Wikipedia: Eiffel Tower — found</li>
          <li>› Web search: tallest structures in Europe</li>
          <li>› Judge: Llama 3.3 70B on Groq</li>
        </ul>
      </div>
      <div className="tl__right">
        <div className={cx('tl__score', 'sh', on(4) && 'is-on')}>
          <svg viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r="15.5" />
            <circle className="tl__arc" cx="18" cy="18" r="15.5" style={{ strokeDasharray: `${0.67 * 97.4} 97.4` }} />
          </svg>
          <span>
            <b>67%</b>
            Trust score
          </span>
          <em>Caution — hallucination detected</em>
        </div>
        <ul className="tl__claims">
          {TL_CLAIMS.map((c) => (
            <li key={c.t} className={cx('sh', on(3) && 'is-on', c.ok ? 'is-ok' : 'is-bad')}>
              <i>{c.ok ? '✓' : '✕'}</i>
              <span>
                {c.t}
                <small>{c.src}</small>
              </span>
              <em>{c.ok ? 'Verified' : 'Hallucinated'}</em>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

/* ================================================================== *
 * HealthSuite — a prescription in, the drugs found, the interaction out;
 * the smartwatch and skin scan alongside.
 * ================================================================== */

export const HEALTH_STEPS = [1000, 1000, 1200, 1100, 3400]

const SKIN = [
  ['Eczema', 74],
  ['Psoriasis', 14],
  ['Acne', 6],
  ['Rosacea', 4],
  ['Melanoma', 2],
] as const

export function HealthShow({ step }: { step: number }) {
  const on = at(step)
  return (
    <div className="hs">
      <div className="hs__phone">
        <div className="hs__screen">
          <span className="hs__time">9:41</span>
          <span className="hs__h">Drug interactions</span>
          <span className="hs__k">Prescription</span>
          <p className="hs__rx">
            <mark className={cx(on(1) && 'is-on')}>Warfarin</mark> 5 mg once daily · <mark className={cx(on(1) && 'is-on')}>Aspirin</mark>{' '}
            75 mg after food
          </p>
          <div className={cx('hs__chips', 'sh', on(1) && 'is-on')}>
            <span className="hs__k">Drugs found · BERT</span>
            <p>
              <i>Warfarin</i>
              <i>Aspirin</i>
            </p>
          </div>
          <div className={cx('hs__alert', 'sh', on(2) && 'is-on')}>
            <strong>Interaction found</strong>
            <p>Warfarin + Aspirin — a higher risk of bleeding. Ask your doctor before taking them together.</p>
          </div>
          <div className="hs__tabs">
            {['Home', 'Scan', 'Meds', 'Health', 'Me'].map((t, i) => (
              <i key={t} className={cx(i === 2 && 'is-on')}>
                {t}
              </i>
            ))}
          </div>
        </div>
      </div>

      <div className={cx('hs__card', 'hs__watch', 'sh', on(3) && 'is-on')}>
        <span className="hs__k">ColorFit Pulse 2 Max · live</span>
        <p>
          <b>78</b> bpm
          <span className="hs__beat" />
        </p>
        <small>118/76 mmHg · 6,240 steps</small>
      </div>
      <div className={cx('hs__card', 'hs__skin', 'sh', on(4) && 'is-on')}>
        <span className="hs__k">Skin scan · ResNet50</span>
        {SKIN.map(([n, v]) => (
          <div className="hs__bar" key={n}>
            <span>{n}</span>
            <em>
              <i style={{ width: `${v}%` }} />
            </em>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ================================================================== *
 * FormuLab — ask the team's knowledge base; answer with sources or not at all.
 * Imidacloprid's water solubility (0.61 g/L at 20 °C) is the PubChem value.
 * ================================================================== */

export const FORMULA_STEPS = [1000, 1100, 1200, 3600]

export function FormulaShow({ step }: { step: number }) {
  const on = at(step)
  return (
    <div className="fl">
      <aside className="fl__side">
        <span className="fl__logo">
          <i /> FormuLab
        </span>
        {['Dashboard', 'Formulations', 'Ingredients', 'Knowledge', 'Troubleshoot', 'Reports', 'Settings'].map((n) => (
          <span key={n} className={cx('fl__nav', n === 'Knowledge' && 'is-on')}>
            {n}
          </span>
        ))}
      </aside>
      <main className="fl__main">
        <div className="fl__top">
          <strong>Knowledge</strong>
          <span className="fl__live">● Live AI</span>
        </div>
        <div className={cx('fl__q', 'sh', on(0) && 'is-on')}>What is the water solubility of imidacloprid?</div>
        <ul className={cx('fl__src', 'sh', on(1) && 'is-on')}>
          <li>
            <i>PubChem</i> Imidacloprid · physical properties
          </li>
          <li>
            <i>Upload</i> SC_formulation_notes.pdf · p. 4
          </li>
          <li>
            <i>Wikipedia</i> Imidacloprid
          </li>
        </ul>
        <div className={cx('fl__ans', 'sh', on(2) && 'is-on')}>
          <p>
            About <b>0.61 g/L at 20 °C</b> — low enough that suspension concentrates are the usual choice over solutions. <cite>PubChem</cite>{' '}
            <cite>SC_formulation_notes.pdf</cite>
          </p>
          <span className="fl__trust">Trust: high · answered from 2 sources</span>
        </div>
        <p className={cx('fl__note', 'sh', on(3) && 'is-on')}>
          AI output assists R&amp;D and needs validation by a qualified scientist before lab or production use.
        </p>
      </main>
    </div>
  )
}

/* ================================================================== *
 * CareerCraft AI — one résumé in; score, gaps, roadmap and jobs out.
 * ================================================================== */

export const CAREER_STEPS = [900, 1000, 1000, 1000, 3600]

export function CareerShow({ step }: { step: number }) {
  const on = at(step)
  return (
    <div className="cc">
      <aside className="cc__side">
        <span className="cc__logo">CareerCraft</span>
        {['Dashboard', 'Resume', 'Career', 'Skills', 'Jobs', 'Learning'].map((n) => (
          <span key={n} className={cx('cc__nav', n === 'Resume' && 'is-on')}>
            {n}
          </span>
        ))}
      </aside>
      <main className="cc__main">
        <div className={cx('cc__file', 'sh', on(0) && 'is-on')}>
          <i>PDF</i>
          <span>
            resume.pdf
            <small>Uploaded · analysed by Gemini 2.5 Flash</small>
          </span>
        </div>
        <div className="cc__row">
          <div className={cx('cc__score', 'sh', on(1) && 'is-on')}>
            <svg viewBox="0 0 36 36" aria-hidden="true">
              <circle cx="18" cy="18" r="15.5" />
              <circle className="cc__arc" cx="18" cy="18" r="15.5" style={{ strokeDasharray: `${0.78 * 97.4} 97.4` }} />
            </svg>
            <span>
              <b>78</b>
              ATS score
            </span>
          </div>
          <div className={cx('cc__gaps', 'sh', on(2) && 'is-on')}>
            <span className="cc__k">Missing for “Backend Engineer”</span>
            <p>
              <i>Docker</i>
              <i>CI/CD</i>
              <i>System design</i>
              <i>Testing</i>
            </p>
          </div>
        </div>
        <div className={cx('cc__road', 'sh', on(3) && 'is-on')}>
          <span className="cc__k">Your roadmap</span>
          <ol>
            <li className="is-done">Containerise a project with Docker</li>
            <li>Add a CI pipeline with tests</li>
            <li>Design a URL shortener end to end</li>
          </ol>
        </div>
        <div className={cx('cc__jobs', 'sh', on(4) && 'is-on')}>
          <span className="cc__k">Matching jobs</span>
          <div>
            <strong>Backend Engineer Intern</strong>
            <small>Bengaluru · Node.js · Postgres</small>
            <em>86% match</em>
          </div>
          <div>
            <strong>Software Engineer, Platform</strong>
            <small>Remote · TypeScript · AWS</small>
            <em>79% match</em>
          </div>
        </div>
      </main>
    </div>
  )
}

/* ================================================================== *
 * SQL AI Agent — a question in English; schema, SQL, answer and chart out.
 * Four regions → a pie, per the agent's own chart rule (≤ 5 categories).
 * ================================================================== */

export const SQL_STEPS = [900, 1000, 1200, 1000, 3600]

const PIE: [string, number, string][] = [
  ['West', 34, '#22d3ee'],
  ['North', 28, '#38bdf8'],
  ['South', 22, '#818cf8'],
  ['East', 16, '#64748b'],
]

export function SqlShow({ step }: { step: number }) {
  const on = at(step)
  let acc = 0
  const stops = PIE.map(([, v, c]) => {
    const s = `${c} ${acc}% ${acc + v}%`
    acc += v
    return s
  }).join(', ')
  return (
    <div className="sq">
      <div className="sq__top">
        <strong>AI Data Agent</strong>
        <span>
          Model <b>GPT-4o</b>
        </span>
      </div>
      <div className="sq__log">
        <p className={cx('sq__you', 'sh', on(0) && 'is-on')}>Which region brought in the most sales last quarter?</p>
        <span className={cx('sq__chip', 'sh', on(1) && 'is-on')}>Read schema · 6 tables · sales_data, orders, customer_data …</span>
        <pre className={cx('sq__sql', 'sh', on(2) && 'is-on')}>
          <span>SQL</span>
          {`SELECT region, SUM(amount) AS total_sales
FROM sales_data
WHERE sale_date >= date_trunc('quarter', now()) - interval '3 months'
  AND sale_date <  date_trunc('quarter', now())
GROUP BY region
ORDER BY total_sales DESC;`}
        </pre>
        <div className={cx('sq__ans', 'sh', on(3) && 'is-on')}>
          <p>The West led last quarter with 34% of sales, ahead of the North at 28%.</p>
          <div className={cx('sq__chart', on(4) && 'is-on')}>
            <span className="sq__pie" style={{ background: `conic-gradient(${stops})` }} />
            <ul>
              {PIE.map(([n, v, c]) => (
                <li key={n}>
                  <i style={{ background: c }} />
                  {n} <b>{v}%</b>
                </li>
              ))}
            </ul>
            <em>Pie · 4 regions</em>
          </div>
        </div>
      </div>
    </div>
  )
}
