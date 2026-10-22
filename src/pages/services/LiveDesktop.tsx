import type { CSSProperties } from 'react'
import { MetaBand } from '../../components/Story'
import { LiveShow } from '../../components/show/Showcase'
import { Features, HowItWorks, Moments, NextProduct, ProductCover, ProductCta, Setup } from '../../components/svc/ProductPage'
import { HonestSheet, RelayPath } from '../../components/svc/Scenes'
import type { ScrollyStep } from '../../components/svc/Scrolly'

/*
 * Live Desktop & Control — the part of Privacy Guardian that puts the laptop's
 * real screen on the phone. Read from mobile/lib/screens/live_desktop_screen.dart
 * and crates/pg-service/src/desktop.rs: the gesture map, the quick keys, the
 * "What is open" sheet, and why the picture comes from the owner's own session.
 */

const FILM = {
  src: '/videos/live-desktop.mp4',
  poster: '/videos/live-desktop.jpg',
  duration: 36,
  title: 'Live Desktop — from a bus, the owner sees the laptop in the library, fills in and submits a form, then closes Spotify.',
  chapters: [
    { t: 0, label: 'Watch' },
    { t: 14, label: 'Control' },
    { t: 26.4, label: 'Clean up' },
  ],
}

const STORY: ScrollyStep[] = [
  {
    k: 'Watch',
    h: 'See the laptop you left behind.',
    p: 'Open Live Desktop and the laptop’s real screen is on your phone — the same windows and tabs, as they are right now.',
    at: 0,
    focus: [{ x: 625, y: 51, w: 236, h: 222, label: 'The laptop, live', end: true }],
  },
  {
    k: 'Tap',
    h: 'Pinch in, and tap where you’d click.',
    p: 'A tap on your phone is a click on the laptop, in exactly that spot. Here, the form’s roll-number box.',
    at: 1,
    focus: [{ x: 48, y: 198, w: 372, h: 52, label: 'Clicked from the phone' }],
  },
  {
    k: 'Type',
    h: 'Type on your phone.',
    p: 'What you type on your phone appears on the laptop. Esc, Tab, Enter and the arrows are one tap away.',
    at: 2,
    focus: [{ x: 625, y: 304, w: 236, h: 54, label: 'Typed here', end: true }],
  },
  {
    k: 'Submit',
    h: 'Done before the deadline.',
    p: 'Tap Submit and it happens on the laptop itself — not in some copy of it.',
    at: 3,
    focus: [{ x: 48, y: 254, w: 240, h: 53, label: 'Submitted on the laptop', below: true }],
  },
  {
    k: 'Clean up',
    h: 'See everything that’s open.',
    p: '“What is open” lists every app and browser tab on the laptop. Close one, or lock an app so it won’t open again.',
    at: 4,
    focus: [{ x: 617, y: 271, w: 252, h: 268, label: 'What is open', end: true }],
  },
  {
    k: 'Closed',
    h: 'Close it from wherever you are.',
    p: 'Spotify is gone from the laptop. Parts of Windows itself are marked, and can’t be locked.',
    at: 5,
    focus: [{ x: 364, y: 74, w: 226, h: 246, label: 'Spotify, closed' }],
  },
]

export default function LiveDesktop() {
  return (
    <article className="case-page product-page" style={{ '--accent': '#6d4aff' } as CSSProperties}>
      <ProductCover
        label="Product 01 · Live Desktop"
        brand="Live Desktop & Control"
        title={['Your Laptop,', 'In Your Pocket']}
        what="Left it on in the library? See the laptop’s real screen on your phone, then tap, type and close things — as if you never left the desk."
        tags={['#Part-of-Privacy-Guardian', '#Android']}
        kind="live"
        product="Privacy Guardian"
        film={FILM}
      />

      <MetaBand
        items={[
          { k: 'Part of', v: 'Privacy Guardian' },
          { k: 'From your phone', v: 'Watch · tap · type · close' },
          { k: 'Connection', v: 'Your paired phone only' },
        ]}
      >
        <p>
          <strong>Live Desktop</strong> rides the same paired, end-to-end encrypted connection as locking and unlocking.
          The picture comes from a small helper in your own Windows session — the screen you actually left.
        </p>
      </MetaBand>

      <Moments
        kicker="Every gesture, mapped"
        title={['Nothing new', 'to learn.']}
        lead="Each touch becomes the click, scroll or keystroke you would have made at the desk."
        items={[
          { a: 'Tap', b: 'left click' },
          { a: 'Double-tap', b: 'right click' },
          { a: 'Drag', b: 'move the pointer' },
          { a: 'Hold, then drag', b: 'scroll' },
          { a: 'Pinch', b: 'zoom 0.5× – 3×' },
          { a: 'Keyboard', b: 'type on the laptop' },
        ]}
      />

      <HowItWorks title="The form was due at 5. You were on the bus." steps={STORY} crop={[606, 0, 274, 560]} render={(step) => <LiveShow step={step} />} />

      <Setup
        title="Already paired? You’re set."
        steps={[
          { h: 'Open Privacy Guardian', p: 'On the phone you paired with your laptop.' },
          { h: 'Tap Live Desktop', p: 'The laptop’s screen appears. Pinch to zoom, tap to click.' },
          { h: 'Do what you came to do', p: 'Type, submit, switch apps, close what you left open — then just leave.' },
        ]}
      />

      <Features
        items={[
          {
            kicker: 'Honest about what it sees',
            title: ['No picture beats', 'a wrong one.'],
            text: 'A Windows service only sees a blank, invisible desktop, so the picture comes from a helper inside your signed-in session. If that helper is not running, your phone says so in plain words instead of showing a black screen.',
            facts: [
              { k: 'In the title bar', v: 'resolution · frame rate · latency' },
              { k: 'Unchanged frames', v: 'not sent again' },
            ],
            scene: <HonestSheet />,
          },
          {
            kicker: 'Same pairing, same lock',
            title: ['Only your phone', 'gets in.'],
            text: 'Live Desktop rides the connection you paired for Privacy Guardian. Phone and laptop both dial out to an always-on relay, end-to-end encrypted — the relay only ever carries ciphertext.',
            facts: [
              { k: 'Who can connect', v: 'your paired phone' },
              { k: 'What the relay sees', v: 'ciphertext' },
            ],
            scene: <RelayPath />,
          },
        ]}
      />

      <ProductCta
        title="Leave the laptop. Keep the control."
        line="Live Desktop comes with Privacy Guardian, which is not public yet. Tell me how you would use it."
        product="Privacy Guardian"
      />

      <NextProduct
        to="/services/privacy-guardian"
        label="Back to"
        brand="Privacy Guardian"
        title={['Lock It From', 'Your Phone']}
        accent="#6d4aff"
      />
    </article>
  )
}
