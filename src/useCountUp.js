import { useEffect, useRef, useState } from 'react'
import { reducedMotion } from './useReveal.js'

/** Number of decimal places in a value's own plain string form (a one-decimal value → 1, a two-decimal value → 2). */
export function decimalsOf(value) {
  const s = String(Math.abs(value))
  if (s.includes('e') || s.includes('E')) return 0
  const part = s.split('.')[1]
  return part ? part.length : 0
}

/** Format with the sign style used by trends.json trend_display strings (a leading + for rises, − for falls). */
export function formatSigned(value, decimals) {
  const sign = value > 0 ? '+' : value < 0 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(decimals)}`
}

/**
 * Counts from 0 to `target` over ~1.2s with requestAnimationFrame, formatting
 * with the caller's formatter so the final string is exact — a value with
 * two decimals keeps two decimals, a value with three keeps three. Under
 * prefers-reduced-motion the target
 * is returned instantly. Returns null when target is null.
 */
export function useCountUp(target, format) {
  const fmtRef = useRef(format)
  useEffect(() => {
    fmtRef.current = format
  })
  const [animated, setAnimated] = useState(0)
  useEffect(() => {
    if (target == null || reducedMotion()) return undefined
    let raf = 0
    const start = performance.now()
    const duration = 1200
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setAnimated(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
      else setAnimated(target)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target])
  if (target == null) return null
  if (reducedMotion()) return format(target)
  return format(animated)
}
