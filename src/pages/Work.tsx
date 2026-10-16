import Hero from '../components/Hero'
import CaseStack from '../components/CaseStack'

/** The gallery: the ring, then one framed panel per case, stacking as you scroll. */
export default function Work() {
  return (
    <>
      <Hero />
      <CaseStack />
    </>
  )
}
