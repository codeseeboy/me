import type { CSSProperties } from 'react'
import { MetaBand } from '../../components/Story'
import { MediatorShow } from '../../components/show/Showcase'
import { Features, HowItWorks, Moments, NextProduct, ProductCover, ProductCta, ProductFaq, Setup } from '../../components/svc/ProductPage'
import { McpConfig, NotDoneYet, PolicyLog } from '../../components/svc/Scenes'
import type { ScrollyStep } from '../../components/svc/Scrolly'

/*
 * Mediator — the product, the loop it removes, how it works once, and the
 * guarantees. Everything is in the code; nothing is invented.
 */

const FILM = {
  src: '/videos/mediator.mp4',
  poster: '/videos/mediator.jpg',
  duration: 58,
  title:
    'Mediator — the film: a developer copies code between ChatGPT and an editor until midnight; then the AI runs the tests and edits the files itself through Mediator, which refuses to call the task done until it is verified and asks before a force-push.',
  chapters: [
    { t: 0, label: 'The copy-paste loop' },
    { t: 21.2, label: 'Mediator' },
    { t: 25.4, label: 'Hands off' },
    { t: 43, label: 'You stay in charge' },
    { t: 50, label: 'Your AI' },
  ],
}

const HOW: ScrollyStep[] = [
  {
    k: 'Ask',
    h: 'Ask in the chat you already use.',
    p: 'Type what you want, the way you always do — in ChatGPT, Claude, Gemini, Perplexity or Kimi.',
    at: 0,
    focus: [{ x: 225, y: 89, w: 303, h: 54, label: 'You ask, as usual', end: true }],
  },
  {
    k: 'Request',
    h: 'Your AI asks Mediator for a tool.',
    p: 'Instead of telling you what to run, the AI writes one small request: “run the tests”.',
    at: 1,
    focus: [{ x: 12, y: 164, w: 516, h: 79, label: 'The AI’s request' }],
  },
  {
    k: 'Run',
    h: 'Mediator runs it on your computer.',
    p: 'It runs the tests in your project folder and types the result back into the chat — no copying, no pasting.',
    at: 2,
    focus: [
      { x: 257, y: 237, w: 271, h: 86, label: 'Result, typed back', below: true },
      { x: 558, y: 157, w: 314, h: 52, label: 'Ran on your machine', end: true },
    ],
  },
  {
    k: 'Fix',
    h: 'It fixes the bug and proves it.',
    p: 'The AI edits the file and runs the tests again. Mediator only accepts “done” once the new code has actually passed.',
    at: 4,
    focus: [{ x: 558, y: 288, w: 314, h: 74, label: 'Proven, not claimed', end: true }],
  },
  {
    k: 'Your call',
    h: 'Anything risky waits for you.',
    p: 'Something like a force-push asks you first: Allow, or Don’t allow. Dangerous commands never run at all.',
    at: 5,
    focus: [{ x: 558, y: 288, w: 314, h: 180, label: 'You decide', end: true }],
  },
]

const SETUP = [
  { h: 'Start it in your project', p: 'Mediator runs on your own computer, next to your code, and opens a small control center in your browser.' },
  { h: 'Switch it on in your AI tab', p: 'Add the Chrome extension and flip one switch in the chat you use. No API key, no new account.' },
  { h: 'Ask for the work', p: 'Describe the bug or the feature. Watch it run, and approve anything risky.' },
]

const FAQ = [
  {
    q: 'Do I need to pay for an API?',
    a: 'No. Through the extension, Mediator works inside the chat you already use, on your existing account. MCP clients like Claude Desktop or Cursor bring their own model, as usual.',
  },
  {
    q: 'Does my code leave my machine?',
    a: 'Mediator runs locally and listens on 127.0.0.1 only. The AI sees what its tool calls read — the same things you would paste into the chat yourself, minus the pasting.',
  },
  {
    q: 'Can it wreck my project?',
    a: 'Catastrophic commands are blocked outright, risky ones wait for you, and changes are checkpointed in a shadow git repository you can roll back to. Your own .git is never touched.',
  },
  {
    q: 'What about a repo I do not trust?',
    a: 'Open it as T1 and every write asks first, or T2 and Mediator refuses to start without a sandbox. Anything in its files that looks like instructions to the AI is labelled as untrusted data.',
  },
]

export default function Mediator() {
  return (
    <article className="case-page product-page" style={{ '--accent': '#15803d' } as CSSProperties}>
      <ProductCover
        label="Product 02"
        brand="Mediator"
        title={['Your AI Chat,', 'Now an Agent']}
        what="ChatGPT, Claude, Gemini — in the tab you already have open. Mediator lets it read your files, run your tests and fix what fails, on your machine, under rules you set. No API key."
        tags={['#MCP', '#Python', '#Local-first']}
        kind="mediator"
        product="Mediator"
        film={FILM}
      />

      <MetaBand
        items={[
          { k: 'Works with', v: 'ChatGPT · Claude · Gemini · Perplexity · Kimi' },
          { k: 'Runs', v: 'On your machine · 127.0.0.1' },
          { k: 'Model', v: 'None of its own · no API key' },
        ]}
      >
        <p>
          <strong>Mediator</strong> removes the copy-paste between your AI chat and your editor. The AI thinks, Mediator
          orchestrates, your computer executes — and you approve anything risky.
        </p>
      </MetaBand>

      <Moments
        kicker="The problem"
        title={['Four of six steps', 'are you.']}
        lead="The AI does the thinking. You carry text between two windows — for every bug, until well past midnight."
        items={[
          { a: 'Ask the AI', b: 'the AI' },
          { a: 'Copy its code', b: 'you', hot: true },
          { a: 'Paste it into your editor', b: 'you', hot: true },
          { a: 'Run the tests', b: 'you', hot: true },
          { a: 'Copy the error back', b: 'you', hot: true },
          { a: 'Wait for the next try', b: 'the AI' },
        ]}
      />

      <HowItWorks title="Hands off the clipboard." steps={HOW} crop={[0, 0, 540, 560]} render={(step) => <MediatorShow step={step} />} />

      <Setup title="Three steps to hands-free." steps={SETUP} />

      <Features
        items={[
          {
            kicker: 'You stay in charge',
            title: ['One policy for', 'every command.'],
            text: 'Every tool call passes the same rules. Safe work just runs, risky work waits for you, catastrophic commands never run, and a path outside the project you opened is refused. Each change is checkpointed for undo.',
            facts: [
              { k: 'pytest tests', v: 'runs' },
              { k: 'pip install · git push --force', v: 'asks you first' },
              { k: 'rm -rf /', v: 'blocked outright' },
            ],
            scene: <PolicyLog />,
          },
          {
            kicker: 'Done has to be true',
            title: ['It can’t just', 'say it’s done.'],
            text: 'Before a task is recorded as finished, Mediator checks the record: were files changed, has anything run since, did it pass. If not, it refuses — with the exact reason and what to do next.',
            facts: [
              { k: 'Edited, never run', v: 'refused' },
              { k: 'Changed after the last run', v: 'refused' },
              { k: 'Tests green on the new code', v: 'done' },
            ],
            scene: <NotDoneYet />,
          },
          {
            kicker: 'Under the hood',
            title: ['Also an MCP server', 'for your editor.'],
            text: 'Files, search, terminals, tests, git and checkpoints — one safety pipeline for all of them. Point Claude Desktop, Cursor or Cline at it and they get the same tools under the same rules.',
            facts: [
              { k: 'Tools', v: '47' },
              { k: 'Tests', v: '800+' },
              { k: 'API keys', v: 'none' },
            ],
            scene: <McpConfig />,
          },
        ]}
      />

      <ProductFaq items={FAQ} />

      <ProductCta
        title="Give your AI hands."
        line="Mediator is not public yet. Tell me what you are building and I will get you access."
        product="Mediator"
      />

      <NextProduct
        to="/services/privacy-guardian"
        label="Next product"
        brand="Privacy Guardian"
        title={['Lock It From', 'Your Phone']}
        accent="#6d4aff"
      />
    </article>
  )
}
