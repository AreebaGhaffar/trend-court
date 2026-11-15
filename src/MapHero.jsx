import { useCallback, useEffect, useRef, useState } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import './mapHero.css'
import Globe from './Globe.jsx'
import ClockTower from './ClockTower.jsx'
import { reducedMotion } from './useReveal.js'

// Faisalabad Clock Tower (Ghanta Ghar) — a landmark position, not a data value.
const GHANTA_GHAR = [73.0791, 31.4187]
const CITY_VIEW = { center: GHANTA_GHAR, zoom: 16.4, pitch: 64, bearing: -25 }

const GIBS = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best'
const STYLE = {
  version: 8,
  projection: { type: 'globe' },
  sources: {
    bluemarble: {
      type: 'raster', tileSize: 256, maxzoom: 8,
      tiles: [`${GIBS}/BlueMarble_ShadedRelief_Bathymetry/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpeg`],
      attribution: 'NASA Blue Marble · GIBS',
    },
    nightlights: {
      type: 'raster', tileSize: 256, maxzoom: 8,
      tiles: [`${GIBS}/VIIRS_Black_Marble/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.png`],
      attribution: 'NASA VIIRS Black Marble · GIBS',
    },
    satellite: {
      type: 'raster', tileSize: 256, maxzoom: 19,
      tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
      attribution: 'Imagery © Esri, Maxar, Earthstar Geographics',
    },
    bazaars: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
  },
  layers: [
    { id: 'space', type: 'background', paint: { 'background-color': '#02060f' } },
    {
      id: 'bluemarble', type: 'raster', source: 'bluemarble',
      paint: {
        'raster-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 6, 1, 8, 0],
        'raster-brightness-max': 0.28,
        'raster-saturation': 0.1,
      },
    },
    {
      id: 'nightlights', type: 'raster', source: 'nightlights',
      paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 0.95, 8, 0] },
    },
    {
      id: 'satellite', type: 'raster', source: 'satellite',
      paint: { 'raster-opacity': ['interpolate', ['linear'], ['zoom'], 4.5, 0, 8, 1] },
    },
    {
      id: 'bazaars-glow', type: 'line', source: 'bazaars',
      layout: { 'line-cap': 'round' },
      paint: {
        'line-color': '#E9B44C', 'line-blur': 6, 'line-opacity': 0.55,
        'line-width': ['interpolate', ['linear'], ['zoom'], 13, 3, 18, 12],
      },
    },
    {
      id: 'bazaars-line', type: 'line', source: 'bazaars',
      layout: { 'line-cap': 'round' },
      paint: {
        'line-color': '#FFD87A', 'line-opacity': 0.95,
        'line-width': ['interpolate', ['linear'], ['zoom'], 13, 1, 18, 3.5],
      },
    },
  ],
}

// Eight spokes — the eight bazaars of the old city — radiating from the tower.
function bazaarSpokes([lon, lat], metres = 330) {
  const features = []
  for (let k = 0; k < 8; k += 1) {
    const b = (k * 45 * Math.PI) / 180
    const dLat = (metres * Math.cos(b)) / 111320
    const dLon = (metres * Math.sin(b)) / (111320 * Math.cos((lat * Math.PI) / 180))
    features.push({
      type: 'Feature', properties: {},
      geometry: { type: 'LineString', coordinates: [[lon, lat], [lon + dLon, lat + dLat]] },
    })
  }
  return { type: 'FeatureCollection', features }
}

function webglSupported() {
  try {
    const c = document.createElement('canvas')
    const gl = c.getContext('webgl2') || c.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    return !!gl
  } catch {
    return false
  }
}

function HeroText({ data, onEnter }) {
  return (
    <>
      <p className="kicker">{data.meta.event} · {data.meta.team}</p>
      <h1 className="hero-title">Trend Court<span>Faisalabad on Trial</span></h1>
      <p className="hero-lede">
        Every climate trend for Faisalabad, {data.meta.period}, put on trial. The data is the
        evidence — and the verdict tells a city planner whether to act.
      </p>
      <div className="hero-actions">
        {onEnter && (
          <button type="button" className="btn btn-big hero-cta" onClick={onEnter}>
            Enter the court <span aria-hidden="true">→</span>
          </button>
        )}
        <a className="btn btn-big btn-ghost" href="#case-board">Go to the Case Board</a>
      </div>
    </>
  )
}

export default function MapHero({ data }) {
  const mapEl = useRef(null)
  const mapRef = useRef(null)
  const modeRef = useRef('space')
  const lastTouch = useRef(performance.now())
  const orbitRef = useRef(false)

  const [mode, setModeState] = useState('space') // space | flying | city
  const [night, setNight] = useState(true)
  const [orbit, setOrbit] = useState(false)
  const [failed, setFailed] = useState(() => !webglSupported())

  const setMode = (m) => { modeRef.current = m; setModeState(m) }

  useEffect(() => {
    if (failed || !mapEl.current) return undefined
    let map
    let raf = 0
    let cancelled = false
    try {
      const narrow = window.innerWidth < 760
      map = new maplibregl.Map({
        container: mapEl.current,
        style: STYLE,
        center: [20, 22],
        zoom: narrow ? 0.9 : 1.6,
        pitch: 0,
        maxPitch: 78,
        minZoom: 0.6,
        attributionControl: { compact: true },
        canvasContextAttributes: { antialias: true },
        fadeDuration: 400,
      })
    } catch {
      setFailed(true)
      return undefined
    }
    mapRef.current = map
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')

    // Keep the globe clear of the text column on wide screens.
    const applyPadding = () => {
      const w = window.innerWidth
      if (modeRef.current !== 'space') return
      map.setPadding(w >= 900 ? { left: Math.round(w * 0.3), top: 0, right: 0, bottom: 0 } : { left: 0, top: 0, right: 0, bottom: Math.round(window.innerHeight * 0.22) })
    }

    map.on('load', () => {
      if (cancelled) return
      map.getSource('bazaars').setData(bazaarSpokes(GHANTA_GHAR))
      map.setSky({
        'sky-color': '#02060f',
        'horizon-color': '#5BC0EB',
        'fog-color': '#0b1d3a',
        'fog-ground-blend': 0.5,
        'horizon-fog-blend': 0.8,
        'sky-horizon-blend': 0.6,
        'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7.5, 0],
      })
      applyPadding()
      // Pulsing pin on the tower.
      const pin = document.createElement('div')
      pin.className = 'gg-pin'
      pin.innerHTML = '<span class="gg-pulse"></span><span class="gg-dot"></span><span class="gg-label">Ghanta Ghar</span>'
      new maplibregl.Marker({ element: pin, anchor: 'center' }).setLngLat(GHANTA_GHAR).addTo(map)
    })
    // A missing tile must never break the page; only a dead style does.
    map.on('error', (e) => {
      if (e?.error?.message && /style|WebGL/i.test(e.error.message) && !map.loaded()) setFailed(true)
    })

    const touch = () => { lastTouch.current = performance.now(); orbitRef.current = false; setOrbit(false) }
      ;['mousedown', 'touchstart', 'wheel'].forEach((ev) => map.getCanvas().addEventListener(ev, touch, { passive: true }))
    window.addEventListener('resize', applyPadding)

    // Idle spin in space, optional orbit around the tower.
    let prev = performance.now()
    const tick = (now) => {
      const dt = Math.min(0.05, (now - prev) / 1000)
      prev = now
      if (!reducedMotion()) {
        if (modeRef.current === 'space' && now - lastTouch.current > 2500 && !map.isMoving()) {
          const c = map.getCenter()
          map.jumpTo({ center: [c.lng - 7 * dt, c.lat] })
        }
        if (modeRef.current === 'city' && orbitRef.current) {
          map.setBearing(map.getBearing() + 6 * dt)
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', applyPadding)
      map.remove()
      mapRef.current = null
    }
  }, [failed])

  // Day / night imagery switch.
  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    const apply = () => {
      if (!map.getLayer('nightlights')) return
      map.setLayoutProperty('nightlights', 'visibility', night ? 'visible' : 'none')
      map.setPaintProperty('bluemarble', 'raster-brightness-max', night ? 0.28 : 1)
    }
    if (map.isStyleLoaded()) apply()
    else map.once('load', apply)
  }, [night])

  const enter = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    setMode('flying')
    map.setPadding({ left: 0, top: 0, right: 0, bottom: 0 })
    if (reducedMotion()) {
      map.jumpTo(CITY_VIEW)
      setMode('city')
      return
    }
    map.once('moveend', () => setMode('city'))
    map.flyTo({ ...CITY_VIEW, duration: 9000, curve: 1.6, essential: true })
  }, [])

  const backToSpace = useCallback(() => {
    const map = mapRef.current
    if (!map) return
    orbitRef.current = false
    setOrbit(false)
    setMode('space')
    lastTouch.current = performance.now()
    const w = window.innerWidth
    map.easeTo({
      center: [data.meta.longitude - 25, 22], zoom: w < 760 ? 0.9 : 1.6, pitch: 0, bearing: 0,
      duration: reducedMotion() ? 0 : 3500,
      padding: w >= 900 ? { left: Math.round(w * 0.3), top: 0, right: 0, bottom: 0 } : { left: 0, top: 0, right: 0, bottom: Math.round(window.innerHeight * 0.22) },
    })
  }, [data.meta.longitude])

  const resetCity = useCallback(() => {
    mapRef.current?.flyTo({ ...CITY_VIEW, duration: reducedMotion() ? 0 : 2500 })
  }, [])

  const toggleOrbit = () => {
    orbitRef.current = !orbitRef.current
    setOrbit(orbitRef.current)
  }

  if (failed) {
    return (
      <section className="map-hero map-hero-fallback">
        <div className="hero-copy"><HeroText data={data} /></div>
        <div className="hero-visuals">
          <Globe lat={data.meta.latitude} lon={data.meta.longitude} size={300} />
          <ClockTower height={250} />
        </div>
      </section>
    )
  }

  return (
    <section className={`map-hero mode-${mode}`} aria-label="Interactive Earth to Faisalabad Clock Tower view">
      <div ref={mapEl} className="map-canvas" />
      <div className="map-vignette" aria-hidden="true" />

      <div className="hero-copy">
        <HeroText data={data} onEnter={enter} />
        <p className="hero-meta">
          {data.meta.city} · {data.meta.dataset}
        </p>
      </div>

      <div className="city-panel" aria-live="polite">
        <p className="kicker">{mode === 'flying' ? 'Descending…' : 'Ghanta Ghar · Faisalabad'}</p>
        <p className="city-hint">
          The eight gold lines are the eight bazaars of the old city. Drag to move, scroll to
          zoom, <strong>right-click drag</strong> (or two fingers) to rotate and tilt.
        </p>
        <div className="city-actions">
          <button type="button" className={`chip-btn${orbit ? ' on' : ''}`} onClick={toggleOrbit} aria-pressed={orbit}>
            {orbit ? '■ Stop orbit' : '↻ Helicopter orbit'}
          </button>
          <button type="button" className="chip-btn" onClick={resetCity}>⌖ Reset view</button>
          <button type="button" className="chip-btn" onClick={backToSpace}>🌍 Back to space</button>
          <a className="chip-btn gold" href="#case-board">Put the trends on trial ↓</a>
        </div>
      </div>



      <a className="scroll-cue" href="#case-board" aria-label="Scroll to the Case Board">
        <span>Case Board</span><i aria-hidden="true">↓</i>
      </a>
    </section>
  )
}