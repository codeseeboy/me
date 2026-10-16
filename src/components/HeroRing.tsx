import { useEffect, useRef } from 'react'
import {
  BufferGeometry,
  CanvasTexture,
  DoubleSide,
  Float32BufferAttribute,
  Group,
  LinearFilter,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  SRGBColorSpace,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RING, type RingCard } from '../data/work'

/**
 * The hero: a ring of interface cards on the inside of a cylinder, with the
 * title and two captions bent onto the same curve.
 *
 * The camera sits inside the cylinder near its back wall, so the cards at
 * the edges are closer than the one in the middle — that is what gives the
 * reference its concave, wrap-around look. Edge cards fade and blur.
 *
 * Each card is a still of one of the products, rendered from the same
 * components the case panels animate (scripts/render-films.sh makes them).
 */

const DISPLAY = 'Impact, Haettenschweiler, Anton, "Arial Narrow Bold", sans-serif'
const SANS = 'Montserrat, "Segoe UI", sans-serif'

/* ---------------------------------------------------------------- *
 * Canvas drawing
 * ---------------------------------------------------------------- */

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

const CARD_W = 460
const CARD_H = 820

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = src
  })
}

/** One phone-shaped card holding a real screen of the product. */
function drawCard(card: RingCard, img: HTMLImageElement | null) {
  const c = document.createElement('canvas')
  c.width = CARD_W
  c.height = CARD_H
  const x = c.getContext('2d')!

  roundRect(x, 4, 4, CARD_W - 8, CARD_H - 8, 46)
  x.fillStyle = '#f6f6f6'
  x.fill()

  x.save()
  roundRect(x, 4, 4, CARD_W - 8, CARD_H - 8, 46)
  x.clip()
  if (img) {
    // cover-fit the still into the card
    const k = Math.max((CARD_W - 8) / img.width, (CARD_H - 8) / img.height)
    const w = img.width * k
    const h = img.height * k
    x.drawImage(img, 4 + (CARD_W - 8 - w) / 2, 4 + (CARD_H - 8 - h) / 2, w, h)
  } else {
    x.fillStyle = '#2b2b2b'
    x.font = `700 38px ${SANS}`
    x.textAlign = 'center'
    x.fillText(card.name, CARD_W / 2, CARD_H / 2)
  }
  x.restore()

  roundRect(x, 4, 4, CARD_W - 8, CARD_H - 8, 46)
  x.lineWidth = 3
  x.strokeStyle = 'rgba(0,0,0,0.12)'
  x.stroke()
  return c
}

/** A soft copy of a canvas, for the cards at the edge of the ring. */
function blurred(src: HTMLCanvasElement) {
  const small = document.createElement('canvas')
  small.width = Math.round(src.width / 9)
  small.height = Math.round(src.height / 9)
  const s = small.getContext('2d')!
  s.imageSmoothingQuality = 'high'
  s.drawImage(src, 0, 0, small.width, small.height)

  const out = document.createElement('canvas')
  out.width = src.width
  out.height = src.height
  const o = out.getContext('2d')!
  o.imageSmoothingEnabled = true
  o.imageSmoothingQuality = 'high'
  o.drawImage(small, 0, 0, out.width, out.height)
  return out
}

type Align = 'left' | 'right' | 'center'

const STRIP_W = 2048

/** Draws text into a strip canvas. `typed` letters show as outlines while a word is being typed. */
function drawStrip(
  canvas: HTMLCanvasElement,
  text: string,
  opts: { font: string; size: number; align: Align; outline?: boolean; spacing?: number },
) {
  const x = canvas.getContext('2d')!
  x.clearRect(0, 0, canvas.width, canvas.height)
  x.font = `${opts.font}`
  if ('letterSpacing' in x && opts.spacing) (x as unknown as { letterSpacing: string }).letterSpacing = `${opts.spacing}px`
  x.textBaseline = 'alphabetic'

  const w = x.measureText(text).width
  const max = canvas.width - 20
  const sx = w > max ? max / w : 1
  const drawn = w * sx

  let left = 10
  if (opts.align === 'right') left = canvas.width - 10 - drawn
  if (opts.align === 'center') left = (canvas.width - drawn) / 2

  x.save()
  x.translate(left, canvas.height * 0.86)
  x.scale(sx, 1)
  if (opts.outline) {
    x.lineWidth = 5
    x.strokeStyle = '#000'
    x.strokeText(text, 0, 0)
  } else {
    x.fillStyle = '#000'
    x.fillText(text, 0, 0)
  }
  x.restore()
}

const TITLE_W = 3072
const TITLE_H = 300

/**
 * Paints the title. The layout is measured on the *full* word, so the
 * phrase stays centred while the word types in letter by letter instead
 * of sliding around, and a short word never leaves the title lopsided.
 */
function drawTitle(
  canvas: HTMLCanvasElement,
  opts: { typed: string; full: string; anchor?: string; outline: boolean; font: string; size: number },
) {
  const x = canvas.getContext('2d')!
  x.clearRect(0, 0, canvas.width, canvas.height)
  x.font = opts.font
  x.textBaseline = 'alphabetic'

  const wFull = opts.full ? x.measureText(opts.full).width : 0
  const gap = opts.anchor && opts.full ? opts.size * 0.34 : 0
  const wAnchor = opts.anchor ? x.measureText(opts.anchor).width : 0
  const total = wFull + gap + wAnchor
  const max = canvas.width - 40
  const sx = total > max ? max / total : 1
  const left = (canvas.width - total * sx) / 2

  x.save()
  x.translate(left, canvas.height * 0.86)
  x.scale(sx, 1)
  if (opts.typed) {
    if (opts.outline) {
      x.lineWidth = 5
      x.strokeStyle = '#000'
      x.strokeText(opts.typed, 0, 0)
    } else {
      x.fillStyle = '#000'
      x.fillText(opts.typed, 0, 0)
    }
  }
  if (opts.anchor) {
    x.fillStyle = '#000'
    x.fillText(opts.anchor, wFull + gap, 0)
  }
  x.restore()
}

/* ---------------------------------------------------------------- *
 * Geometry
 * ---------------------------------------------------------------- */

/** A strip bent onto the inside of a cylinder, spanning angles a0..a1. */
function arcStrip(radius: number, a0: number, a1: number, y0: number, y1: number, segments = 48) {
  const pos: number[] = []
  const uv: number[] = []
  const idx: number[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const a = a0 + (a1 - a0) * t
    const px = radius * Math.sin(a)
    const pz = -radius * Math.cos(a)
    pos.push(px, y0, pz, px, y1, pz)
    uv.push(t, 0, t, 1)
    if (i < segments) {
      const k = i * 2
      idx.push(k, k + 2, k + 1, k + 1, k + 2, k + 3)
    }
  }
  const g = new BufferGeometry()
  g.setAttribute('position', new Float32BufferAttribute(pos, 3))
  g.setAttribute('uv', new Float32BufferAttribute(uv, 2))
  g.setIndex(idx)
  return g
}

function textureOf(canvas: HTMLCanvasElement) {
  const t = new CanvasTexture(canvas)
  t.colorSpace = SRGBColorSpace
  t.minFilter = LinearFilter
  t.generateMipmaps = false
  t.anisotropy = 4
  return t
}

/* ---------------------------------------------------------------- *
 * Component
 * ---------------------------------------------------------------- */

const R = 6.2 // card cylinder
const RT = 5.7 // title cylinder, just in front of the cards
const SLOTS = 14
const CARD_WW = 2.35
const CARD_HH = CARD_WW * (CARD_H / CARD_W)

export default function HeroRing({
  words,
  anchor,
  captions,
}: {
  words: string[]
  anchor: string
  captions: [string, string]
}) {
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    let disposed = false
    let cleanup = () => {}

    const start = async () => {
      // Canvas text needs the web fonts in place before anything is drawn.
      try {
        await Promise.race([
          Promise.all([
            document.fonts.load(`700 34px Montserrat`),
            document.fonts.load(`600 60px Montserrat`),
            document.fonts.load(`400 200px Anton`),
          ]),
          new Promise((r) => setTimeout(r, 2500)),
        ])
      } catch {
        /* draw with whatever is available */
      }
      if (disposed) return

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      let renderer: WebGLRenderer
      try {
        renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
      } catch {
        el.dataset.fallback = 'true'
        return
      }
      renderer.setClearColor(0xffffff, 0)
      renderer.outputColorSpace = SRGBColorSpace
      renderer.domElement.className = 'ring-canvas'
      renderer.domElement.setAttribute('aria-hidden', 'true')
      el.appendChild(renderer.domElement)

      const scene = new Scene()
      const camera = new PerspectiveCamera(48, 1, 0.1, 100)

      /* ---- The ring of cards ---- */
      const ring = new Group()
      ring.rotation.z = 0.018
      ring.rotation.x = 0.02
      scene.add(ring)

      const cardGeo = new PlaneGeometry(CARD_WW, CARD_HH)
      const disposables: { dispose(): void }[] = [cardGeo]
      const cards: { sharp: Mesh; soft: Mesh }[] = []

      const stills = await Promise.race([
        Promise.all(RING.map((r) => loadImage(r.img))),
        new Promise<(HTMLImageElement | null)[]>((r) => setTimeout(() => r(RING.map(() => null)), 4000)),
      ])
      if (disposed) {
        renderer.dispose()
        renderer.domElement.remove()
        return
      }

      for (let i = 0; i < SLOTS; i++) {
        const data = RING[i % RING.length]
        const canvas = drawCard(data, stills[i % RING.length])
        const sharpTex = textureOf(canvas)
        const softTex = textureOf(blurred(canvas))
        const sharpMat = new MeshBasicMaterial({ map: sharpTex, transparent: true, side: DoubleSide, depthWrite: false })
        const softMat = new MeshBasicMaterial({ map: softTex, transparent: true, side: DoubleSide, depthWrite: false })
        disposables.push(sharpTex, softTex, sharpMat, softMat)

        const a = (i / SLOTS) * Math.PI * 2
        const sharp = new Mesh(cardGeo, sharpMat)
        const soft = new Mesh(cardGeo, softMat)
        for (const m of [sharp, soft]) {
          m.position.set(R * Math.sin(a), 0, -R * Math.cos(a))
          m.rotation.y = -a
          ring.add(m)
        }
        cards.push({ sharp, soft })
      }

      /* ---- Title and captions, bent onto the curve ---- */
      const mkStrip = (h: number, w = STRIP_W) => {
        const canvas = document.createElement('canvas')
        canvas.width = w
        canvas.height = h
        const tex = textureOf(canvas)
        const mat = new MeshBasicMaterial({ map: tex, transparent: true, side: DoubleSide, depthWrite: false })
        const mesh = new Mesh(new BufferGeometry(), mat)
        mesh.renderOrder = 2
        scene.add(mesh)
        disposables.push(tex, mat)
        return { canvas, tex, mesh }
      }

      // Wide screens: the whole phrase on line one. Phones: word, then anchor.
      const lineOne = mkStrip(TITLE_H, TITLE_W)
      const lineTwo = mkStrip(TITLE_H, TITLE_W)
      const capL = mkStrip(140)
      const capR = mkStrip(140)

      let narrow = false

      const titleFont = () => `400 250px ${DISPLAY}`
      const capFont = `600 78px ${SANS}`

      const paintCaps = () => {
        drawStrip(capL.canvas, captions[0], { font: capFont, size: 78, align: 'right', spacing: 3 })
        drawStrip(capR.canvas, captions[1], { font: capFont, size: 78, align: 'left', spacing: 3 })
        capL.tex.needsUpdate = true
        capR.tex.needsUpdate = true
      }

      /* ---- Typing the rotating word ---- */
      let wordIndex = 0
      let typed = words[0].length
      let phase: 'hold' | 'erase' | 'type' = 'hold'
      let phaseAt = performance.now()

      const paintWord = () => {
        const full = words[wordIndex]
        const base = {
          typed: full.slice(0, typed),
          full,
          outline: phase === 'type' && typed < full.length,
          font: titleFont(),
          size: 250,
        }
        if (narrow) {
          drawTitle(lineOne.canvas, base)
          drawTitle(lineTwo.canvas, { typed: '', full: '', anchor, outline: false, font: titleFont(), size: 250 })
          lineTwo.tex.needsUpdate = true
        } else {
          drawTitle(lineOne.canvas, { ...base, anchor })
        }
        lineOne.tex.needsUpdate = true
      }

      const stepTyping = (now: number) => {
        if (reduce) return
        const since = now - phaseAt
        if (phase === 'hold' && since > 2600) {
          phase = 'erase'
          phaseAt = now
        } else if (phase === 'erase' && since > 55) {
          phaseAt = now
          typed -= 1
          if (typed <= 0) {
            typed = 0
            wordIndex = (wordIndex + 1) % words.length
            phase = 'type'
          }
          paintWord()
        } else if (phase === 'type' && since > 95) {
          phaseAt = now
          typed += 1
          if (typed >= words[wordIndex].length) {
            typed = words[wordIndex].length
            phase = 'hold'
          }
          paintWord()
        }
      }

      /* ---- Layout: wide screens put the title on one line, phones on two ---- */
      const layout = () => {
        const w = el.clientWidth
        const h = el.clientHeight
        if (!w || !h) return
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))
        renderer.setSize(w, h, false)
        camera.aspect = w / h
        narrow = w / h < 0.9

        // The camera sits behind the ring's axis, so the side cards come closer.
        camera.fov = narrow ? 74 : 54
        // Wide screens lift the ring so the title sits above the cards, as in the reference.
        const lift = narrow ? 0.15 : -0.35
        camera.position.set(0, lift, narrow ? 2.0 : 3.0)
        camera.lookAt(0, lift, -R)
        camera.updateProjectionMatrix()

        const top = CARD_HH / 2
        const titleH = narrow ? 1.2 : 1.08
        const arc = (titleH * (TITLE_W / TITLE_H)) / RT

        const replace = (mesh: Mesh, geo: BufferGeometry) => {
          mesh.geometry.dispose()
          mesh.geometry = geo
        }

        // Both lines are centred on the axis, so the title sits in the middle of the screen.
        if (narrow) {
          replace(lineOne.mesh, arcStrip(RT, -arc / 2, arc / 2, top + 1.3, top + 1.3 + titleH, 96))
          replace(lineTwo.mesh, arcStrip(RT, -arc / 2, arc / 2, top + 0.15, top + 0.15 + titleH, 96))
        } else {
          replace(lineOne.mesh, arcStrip(RT, -arc / 2, arc / 2, top + 0.02, top + 0.02 + titleH, 96))
        }
        lineTwo.mesh.visible = narrow

        const capH = 0.3
        const capArc = (capH * (STRIP_W / 140)) / RT
        const capY = -top - 0.42
        const capGap = 0.17
        replace(capL.mesh, arcStrip(RT, -capArc - capGap, -capGap, capY, capY + capH))
        replace(capR.mesh, arcStrip(RT, capGap, capArc + capGap, capY, capY + capH))
        capL.mesh.visible = !narrow
        capR.mesh.visible = !narrow

        paintWord()
        paintCaps()
      }

      layout()
      const ro = new ResizeObserver(layout)
      ro.observe(el)

      /* ---- Pointer parallax: the ring leans a little toward the cursor ---- */
      let px = 0
      let tx = 0
      const onPointer = (e: PointerEvent) => {
        tx = (e.clientX / window.innerWidth - 0.5) * 2
      }
      window.addEventListener('pointermove', onPointer, { passive: true })

      /* ---- Frame loop. Pauses when the hero is covered or the tab is hidden ---- */
      const world = new Vector3()
      const camDir = new Vector3()
      let raf = 0
      let last = performance.now()
      let covered = false

      const stack = document.getElementById('work')
      const onScroll = () => {
        covered = stack ? stack.getBoundingClientRect().top < 90 : false
        if (!covered && !raf) raf = requestAnimationFrame(frame)
      }
      window.addEventListener('scroll', onScroll, { passive: true })

      const frame = (now: number) => {
        raf = 0
        const dt = Math.min(0.05, (now - last) / 1000)
        last = now

        if (!reduce) ring.rotation.y += dt * 0.06
        px += (tx - px) * 0.04
        ring.rotation.z = 0.018 + px * 0.008

        stepTyping(now)

        camera.getWorldDirection(camDir)
        for (const { sharp, soft } of cards) {
          sharp.getWorldPosition(world)
          world.sub(camera.position)
          const ahead = world.dot(camDir)
          const side = Math.abs(Math.atan2(world.x * camDir.z - world.z * camDir.x, ahead))
          const deg = (side * 180) / Math.PI
          const behind = ahead <= 0
          // 0 in the middle, 1 at the edge of the frame.
          const edge = Math.min(1, Math.max(0, (deg - 26) / 26))
          const fade = behind ? 0 : Math.min(1, Math.max(0, 1 - (deg - 58) / 14))
          ;(sharp.material as MeshBasicMaterial).opacity = (1 - edge) * fade * 0.94
          ;(soft.material as MeshBasicMaterial).opacity = edge * fade * 0.8
          sharp.visible = !behind
          soft.visible = !behind
        }

        renderer.render(scene, camera)
        if (!covered && !document.hidden) raf = requestAnimationFrame(frame)
      }

      const onVisible = () => {
        if (!document.hidden && !covered && !raf) {
          last = performance.now()
          raf = requestAnimationFrame(frame)
        }
      }
      document.addEventListener('visibilitychange', onVisible)

      raf = requestAnimationFrame(frame)
      el.dataset.ready = 'true'

      cleanup = () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        window.removeEventListener('pointermove', onPointer)
        window.removeEventListener('scroll', onScroll)
        document.removeEventListener('visibilitychange', onVisible)
        for (const s of [lineOne, lineTwo, capL, capR]) s.mesh.geometry.dispose()
        for (const d of disposables) d.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    }

    start()
    return () => {
      disposed = true
      cleanup()
    }
  }, [words, anchor, captions])

  return <div className="ring" ref={host} />
}
