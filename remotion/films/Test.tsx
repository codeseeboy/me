import { useCurrentFrame } from 'remotion'
import { Browser, ChatSite } from '../../src/components/svc/pg/Ui'
import { Callout, Caption, Chapter, Desk, Laptop, Library, Person } from '../kit'

export function Test() {
  const t = useCurrentFrame() / 30 + 3
  return (
    <div className="fk-film pg">
      <Library blur={3} />
      <Desk />
      <Laptop style={{ left: 410, top: 150 }}>
        <Browser tabs={[{ id: 'w', title: 'WhatsApp', color: '#25d366' }, { id: 'g', title: 'Inbox — Gmail', color: '#ea4335' }]} active="w" url="web.whatsapp.com">
          <ChatSite />
        </Browser>
      </Laptop>
      <Person who="stranger" style={{ left: 160, top: 520 }} />
      <Callout x={600} y={250} dx={-80} dy={-120} show={1}>
        Your WhatsApp<small>still signed in</small>
      </Callout>
      <Chapter t={t} items={[[0, 10, '01 · The problem']]} />
      <Caption t={t} lines={[[0, 10, 'Someone else sits down.', 'Everything is already signed in.']]} />
    </div>
  )
}
