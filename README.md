# Shashikant Rajput — portfolio

Source of my portfolio, live at [ezz-shashiii.vercel.app](https://ezz-shashiii.vercel.app). React, Vite and TypeScript.

Four pages, each built from the same sticky framed panel. Detail lives in the deep-dive
overlay, never on the panel itself — the panels stay sparse on purpose.

## Run

```bash
npm install
npm run dev
```

## Pages

| Page | Panels |
| --- | --- |
| Work | 3D hero ring + 4 case panels (NON8, UrbanFix AI, CountX, TrustLayer AI) |
| About | About · 2 experience panels · Toolkit · Before now |
| Projects | One index panel — 6 curated projects, hover reveals the shot |
| Contact | One panel — four oversized links + local clock |

## The design system

Every panel is `<Panel>`: a 1px frame with corner registration marks and a small label
top-left, sticky at the header so panels stack over each other as you scroll.

Motion is driven by one value. `usePanelReveal` publishes each panel's scroll progress as
`--case-reveal` (0 → 1); CSS does everything else:

```css
opacity: var(--case-reveal);
transform: translateY(calc((1 - var(--case-reveal)) * 48px));
```

Row lists stagger off the same value, each row resolving slightly later:

```css
--p: clamp(0, calc((var(--case-reveal) - var(--i) * var(--stagger)) * 4), 1);
```

## Content

| File | Holds |
| --- | --- |
| `src/data/profile.ts` | Name, contact, hero words, experience, skills, education, awards |
| `src/data/projects.ts` | The 4 cases, the projects index, and the hero ring cards |
| `src/data/pages.ts` | The four pages |

## Images

Placeholders live in `public/work/` — `feat-*.png` for the case panels, `ring-*.png` for the
hero ring. Swap the files, keep the names, and nothing else changes. Portrait shots work best;
ring cards are cropped to 1.34 : 3.02.

## Notes

`research/` holds a third-party bundle kept only as a motion reference. It is excluded from
linting and never imported.
