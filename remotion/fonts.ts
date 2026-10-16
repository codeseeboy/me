import { loadFont as loadInter } from '@remotion/google-fonts/Inter'
import { loadFont as loadMono } from '@remotion/google-fonts/IBMPlexMono'

// Loaded once for every film; Remotion waits for them before rendering a frame.
loadInter('normal', { weights: ['400', '500', '600', '700', '800', '900'], subsets: ['latin'] })
loadMono('normal', { weights: ['400', '500', '600'], subsets: ['latin'] })
