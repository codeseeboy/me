import type { CSSProperties } from 'react'
import { MetaBand } from '../../components/Story'
import { Guardian } from '../../components/show/Showcase'
import { Features, HowItWorks, Moments, NextProduct, ProductCover, ProductCta, ProductFaq, Setup } from '../../components/svc/ProductPage'
import { BuiltToHold, EveryWayIn, LivePoster } from '../../components/svc/Scenes'
import type { ScrollyStep } from '../../components/svc/Scrolly'

/*
 * Privacy Guardian — the product, then how it works once, then the few facts
 * that matter. Every claim stays inside docs/SECURITY-MODEL.md §7.
 */

const FILM = {
  src: '/videos/privacy-guardian.mp4',
  poster: '/videos/privacy-guardian.jpg',
  duration: 58,
  title: 'Privacy Guardian — the film: someone sits at your laptop, you lock it from your phone, and unlock one thing with your fingerprint.',
  chapters: [
    { t: 0, label: 'The problem' },
    { t: 17, label: 'See it. Lock it.' },
    { t: 27.4, label: 'Every way in' },
    { t: 39, label: 'Still usable' },
    { t: 44.2, label: 'Unlock' },
  ],
}

const HOW: ScrollyStep[] = [
  {
    k: 'The problem',
    h: 'Someone else sits down.',
    p: 'Your laptop is signed in to everything — chats, mail, files. Anyone using it can read them. No password needed.',
    at: 0,
    focus: [{ x: 12, y: 127, w: 616, h: 330, label: 'Your chats — open to anyone' }],
  },
  {
    k: 'Lock',
    h: 'You lock it from your phone.',
    p: 'Your phone shows what is open on the laptop. Tap Lock Private once and everything you protect locks at the same moment — even if you are far away.',
    at: 2,
    focus: [{ x: 633, y: 462, w: 222, h: 59, label: 'One tap', end: true }],
  },
  {
    k: 'Every way in',
    h: 'Every way in is locked.',
    p: 'A new tab, Incognito, another Chrome profile, the desktop app — all show the same lock. Everything you did not protect, like YouTube, keeps working.',
    at: 3,
    focus: [{ x: 160, y: 190, w: 320, h: 180, label: 'Locked everywhere' }],
  },
  {
    k: 'Unlock',
    h: 'Need one thing back? Use your fingerprint.',
    p: 'Ask for WhatsApp, and the request appears on your phone. Your fingerprint approves that one request — nothing else.',
    at: 4,
    focus: [{ x: 625, y: 329, w: 238, h: 202, label: 'Your fingerprint', end: true }],
  },
  {
    k: 'Only that',
    h: 'Only that one thing opens.',
    p: 'WhatsApp is back; Gmail stays locked until you say so. One more tap locks everything again.',
    at: 5,
    focus: [{ x: 633, y: 205, w: 222, h: 98, label: 'WhatsApp open · Gmail locked', end: true }],
  },
]

const SETUP = [
  { h: 'Install it on your laptop', p: 'A small Windows service and a Chrome & Edge extension. It runs quietly in the background.' },
  { h: 'Pair your phone', p: 'Open the app on your Android phone and enter the one-time code your laptop shows. You do this once.' },
  { h: 'Choose what to protect', p: 'Pick the apps, websites, folders and Chrome profiles that are yours. Everything else stays free for whoever uses the laptop.' },
]

const FAQ = [
  {
    q: 'Can someone get around it?',
    a: 'Someone who deliberately makes themselves an administrator on your laptop can undo browser, app and folder locks — that is how Windows works, and I would rather say so. For files that must stay safe even then, there is the Vault: AES-256-GCM encryption with an Argon2id-wrapped key, so a locked vault is only ciphertext on disk.',
  },
  {
    q: 'Do I need my phone with me?',
    a: 'No. Locks keep working with your phone off or offline. To unlock without it, use your password at the laptop — or Windows Hello.',
  },
  {
    q: 'Does it work when I am far away?',
    a: 'Yes. Your phone and laptop both connect out to an always-on relay, end-to-end encrypted — the relay only ever sees ciphertext. Pair once at home; that is the whole setup.',
  },
  {
    q: 'Does it track what I do?',
    a: 'It keeps a log of locks, unlocks, mode changes and failed attempts. It never records page addresses, page content, keystrokes or file contents, and the log is hash-chained so edits to it are detectable.',
  },
]

export default function PrivacyGuardian() {
  return (
    <article className="case-page product-page" style={{ '--accent': '#6d4aff' } as CSSProperties}>
      <ProductCover
        label="Product 01"
        brand="Privacy Guardian"
        title={['Lock It From', 'Your Phone']}
        what="Lend your laptop without lending your private stuff. Lock the websites, apps, folders and Chrome profiles you choose — and unlock one of them with your fingerprint, from anywhere."
        tags={['#Windows', '#Android', '#Rust']}
        kind="guardian"
        product="Privacy Guardian"
        film={FILM}
      />

      <MetaBand
        items={[
          { k: 'You need', v: 'A Windows laptop · an Android phone' },
          { k: 'It locks', v: 'Websites · apps · folders · Chrome profiles' },
          { k: 'Only you unlock', v: 'With your fingerprint' },
        ]}
      >
        <p>
          <strong>Privacy Guardian</strong> is for the moment someone else is at your laptop. The rest of the laptop stays
          usable — only what you chose to protect locks, and only your phone can open it again.
        </p>
      </MetaBand>

      <Moments
        kicker="When you’d use it"
        title={['Whenever someone', 'else is at it.']}
        lead="You keep the laptop usable for them — and keep your private things private."
        items={[
          { a: 'Lending it to a friend', b: 'they get YouTube, not your chats' },
          { a: 'Leaving it in the library', b: 'lock it from the bus' },
          { a: 'Presenting in class', b: 'your mail stays shut' },
          { a: 'Family on your laptop', b: 'your folders stay yours' },
        ]}
      />

      <HowItWorks title="Lend the laptop. Keep your life." steps={HOW} crop={[606, 0, 274, 560]} render={(step) => <Guardian step={step} />} />

      <Setup title="Three steps, once." steps={SETUP} />

      <Features
        items={[
          {
            kicker: 'What it locks',
            title: ['Every way in hits', 'the same lock.'],
            text: 'The lock is on the thing, not the route to it. Typed, bookmarked, Incognito, the Start menu, a shortcut or a terminal — the same lock answers every time.',
            facts: [
              { k: 'Websites', v: 'Chrome & Edge, even Incognito' },
              { k: 'Apps', v: 'stopped by Windows before they start' },
              { k: 'Files & folders', v: 'Access is denied' },
              { k: 'Chrome profiles', v: 'the whole profile, on disk' },
            ],
            scene: <EveryWayIn />,
          },
          {
            kicker: 'Built to hold',
            title: ['Stop the app.', 'The lock stays.'],
            text: 'Locks live in the registry and the filesystem, where Windows enforces them — so stopping Privacy Guardian unlocks nothing. If its settings ever fail their integrity check, it seals everything until it is repaired.',
            facts: [
              { k: 'Service stopped', v: 'still locked' },
              { k: 'Settings tampered with', v: 'it seals' },
              { k: 'Phone off', v: 'locks hold' },
            ],
            scene: <BuiltToHold />,
          },
          {
            kicker: 'Live Desktop & Control',
            title: ['Left it open?', 'Use it from your phone.'],
            text: 'See the laptop’s real screen on your phone, then tap, type and close what you left open — from the bus, the canteen, anywhere.',
            scene: <LivePoster />,
            link: { to: '/services/privacy-guardian/live', label: 'Explore Live Desktop' },
          },
        ]}
      />

      <ProductFaq items={FAQ} />

      <ProductCta
        title="Want it on your laptop?"
        line="Privacy Guardian is not public yet. Tell me how you would use it and I will set you up."
        product="Privacy Guardian"
      />

      <NextProduct to="/services/mediator" label="Next product" brand="Mediator" title={['Your AI Chat,', 'Now an Agent']} accent="#15803d" />
    </article>
  )
}
