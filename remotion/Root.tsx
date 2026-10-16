import { Composition } from 'remotion'
import './fonts'
import './style.css'
import './kit.css'
import '../src/styles/pg.css'
import '../src/styles/med.css'
import { Test } from './films/Test'
import { PgFilm, PG_SECONDS } from './films/PgFilm'
import { LiveFilm, LIVE_SECONDS } from './films/LiveFilm'
import { MedFilm, MED_SECONDS } from './films/MedFilm'
import { FPS, H, W } from './kit'
import { RingCard } from './RingCard'

export function Root() {
  return (
    <>
      <Composition id="Test" component={Test} durationInFrames={60} fps={FPS} width={W} height={H} />
      <Composition id="LiveFilm" component={LiveFilm} defaultProps={{ clean: false }} durationInFrames={LIVE_SECONDS * FPS} fps={FPS} width={W} height={H} />
      <Composition id="MedFilm" component={MedFilm} defaultProps={{ clean: false }} durationInFrames={MED_SECONDS * FPS} fps={FPS} width={W} height={H} />
      <Composition id="Ring" component={RingCard} defaultProps={{ kind: 'non8' as const }} durationInFrames={1} fps={FPS} width={460} height={820} />
      <Composition id="PgFilm" component={PgFilm} defaultProps={{ clean: false }} durationInFrames={PG_SECONDS * FPS} fps={FPS} width={W} height={H} />
    </>
  )
}
