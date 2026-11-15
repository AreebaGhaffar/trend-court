import { useEffect, useRef } from 'react'
import { geoOrthographic, geoPath, geoGraticule10 } from 'd3-geo'
import { feature } from 'topojson-client'
import landTopo from 'world-atlas/land-110m.json'
import { reducedMotion } from './useReveal.js'

const land = feature(landTopo, landTopo.objects.land)
const graticule = geoGraticule10()

const shortestDelta = (from, to) => ((to - from + 540) % 360) - 180

/**
 * A 2D rotating Earth on canvas (d3-geo orthographic, no WebGL). It spins
 * slowly, eases to Faisalabad (lat/lon passed as props from trends.json meta)
 * and rests there with a pulsing gold pin. Drag to spin; on release it eases
 * back. Pixel ratio is capped at 2 and the loop stops on unmount.
 * Under prefers-reduced-motion it draws one static frame centred on the pin.
 */
export default function Globe({ lat, lon, size = 320, mini = false, label = true }) {
  const canvasRef = useRef(null)
  const dragRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || lat == null || lon == null) return undefined
    const dpr = Math.min(2, window.devicePixelRatio || 1)
    canvas.width = size * dpr
    canvas.height = size * dpr
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const projection = geoOrthographic()
      .scale(size * 0.47)
      .translate([size / 2, size / 2])
      .clipAngle(90)
    const path = geoPath(projection, ctx)
    const target = { lambda: -lon, phi: -lat }
    const state = {
      lambda: target.lambda - 140,
      phi: target.phi * 0.4,
      phase: reducedMotion() ? 'rest' : 'spin',
      t: 0,
    }

    const draw = (now) => {
      ctx.clearRect(0, 0, size, size)
      projection.rotate([state.lambda, state.phi])
      // Ocean
      const ocean = ctx.createRadialGradient(
        size * 0.38, size * 0.34, size * 0.05,
        size / 2, size / 2, size * 0.5,
      )
      ocean.addColorStop(0, '#14335F')
      ocean.addColorStop(1, '#081226')
      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.fillStyle = ocean
      ctx.fill()
      // Graticule
      ctx.beginPath()
      path(graticule)
      ctx.strokeStyle = 'rgba(91,192,235,0.16)'
      ctx.lineWidth = 0.5
      ctx.stroke()
      // Land
      ctx.beginPath()
      path(land)
      ctx.fillStyle = '#1E4066'
      ctx.fill()
      ctx.strokeStyle = 'rgba(91,192,235,0.55)'
      ctx.lineWidth = 0.6
      ctx.stroke()
      // Rim
      ctx.beginPath()
      path({ type: 'Sphere' })
      ctx.strokeStyle = 'rgba(91,192,235,0.5)'
      ctx.lineWidth = 1
      ctx.stroke()
      // Faisalabad pin — only when that hemisphere faces us
      const centre = projection.rotate()
      const visible =
        Math.cos(((centre[1] + lat) * Math.PI) / 180) *
          Math.cos((((centre[0] + lon + 540) % 360) - 180) * (Math.PI / 180)) > 0.12
      const pt = projection([lon, lat])
      if (pt && visible) {
        const [x, y] = pt
        if (!mini && !reducedMotion()) {
          const pulse = (now % 2200) / 2200
          ctx.beginPath()
          ctx.arc(x, y, 4 + pulse * 13, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(201,162,75,${0.65 * (1 - pulse)})`
          ctx.lineWidth = 1.6
          ctx.stroke()
        }
        ctx.beginPath()
        ctx.arc(x, y, mini ? 3 : 4.5, 0, Math.PI * 2)
        ctx.fillStyle = '#C9A24B'
        ctx.fill()
        ctx.strokeStyle = '#0B1526'
        ctx.lineWidth = 1.2
        ctx.stroke()
        if (label && !mini) {
          ctx.font = '600 12px Inter, sans-serif'
          ctx.fillStyle = '#E9B44C'
          ctx.fillText('Faisalabad', x + 9, y - 7)
        }
      }
    }

    if (reducedMotion()) {
      state.lambda = target.lambda
      state.phi = target.phi
      draw(0)
      return undefined
    }

    let raf = 0
    const step = (now) => {
      const drag = dragRef.current
      if (drag) {
        state.lambda = drag.lambda
        state.phi = drag.phi
      } else if (state.phase === 'spin') {
        state.lambda += 0.35
        state.t += 1
        if (state.t > 130) state.phase = 'ease'
      } else if (state.phase === 'ease' || state.phase === 'return') {
        const dl = shortestDelta(state.lambda, target.lambda)
        const dp = target.phi - state.phi
        state.lambda += dl * 0.055
        state.phi += dp * 0.055
        if (Math.abs(dl) < 0.05 && Math.abs(dp) < 0.05) {
          state.lambda = target.lambda
          state.phi = target.phi
          state.phase = 'rest'
        }
      }
      draw(now)
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)

    const onDown = (e) => {
      canvas.setPointerCapture(e.pointerId)
      dragRef.current = {
        x: e.clientX, y: e.clientY, lambda: state.lambda, phi: state.phi,
      }
    }
    const onMove = (e) => {
      const drag = dragRef.current
      if (!drag) return
      drag.lambda = drag.lambda + (e.clientX - drag.x) * 0.3
      drag.phi = Math.max(-65, Math.min(65, drag.phi - (e.clientY - drag.y) * 0.3))
      drag.x = e.clientX
      drag.y = e.clientY
    }
    const onUp = () => {
      if (!dragRef.current) return
      state.lambda = dragRef.current.lambda
      state.phi = dragRef.current.phi
      dragRef.current = null
      state.phase = 'return'
    }
    canvas.addEventListener('pointerdown', onDown)
    canvas.addEventListener('pointermove', onMove)
    canvas.addEventListener('pointerup', onUp)
    canvas.addEventListener('pointercancel', onUp)
    return () => {
      cancelAnimationFrame(raf)
      canvas.removeEventListener('pointerdown', onDown)
      canvas.removeEventListener('pointermove', onMove)
      canvas.removeEventListener('pointerup', onUp)
      canvas.removeEventListener('pointercancel', onUp)
    }
  }, [lat, lon, size, mini, label])

  if (lat == null || lon == null) return null
  return (
    <canvas
      ref={canvasRef}
      className="globe"
      style={{ width: size, aspectRatio: '1' }}
      role="img"
      aria-label={`Rotating Earth centred on Faisalabad (${lat}° N, ${lon}° E). Drag to spin.`}
    />
  )
}
