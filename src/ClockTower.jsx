import { useEffect, useState } from 'react'

const hand = (cx, cy, length, angleDeg, width, color) => {
  const a = ((angleDeg - 90) * Math.PI) / 180
  return (
    <line
      x1={cx} y1={cy}
      x2={cx + length * Math.cos(a)} y2={cy + length * Math.sin(a)}
      stroke={color} strokeWidth={width} strokeLinecap="round"
    />
  )
}

/**
 * An original SVG of Faisalabad's Clock Tower (Ghanta Ghar). The clock hands
 * show the real local time, updated every second. Eight thin lines radiate
 * from the base — the eight bazaars of the old city. With `silhouette`, the
 * tower is drawn in muted night colours (About page).
 */
export default function ClockTower({ height = 240, silhouette = false }) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const s = now.getSeconds()
  const m = now.getMinutes() + s / 60
  const h = (now.getHours() % 12) + m / 60
  const cx = 100
  const cy = 74

  const stone = silhouette ? '#22344F' : '#2A4162'
  const stoneDark = silhouette ? '#182740' : '#1D3150'
  const trim = silhouette ? '#3A5070' : '#C9A24B'
  const face = silhouette ? '#2A3D5A' : '#F4EDDA'
  const handColor = silhouette ? '#8FA5C4' : '#0F1B2D'
  const bazaar = silhouette ? 'rgba(143,165,196,0.35)' : 'rgba(201,162,75,0.5)'

  // Eight bazaars radiating from the tower base (base centre ≈ (100, 208)).
  const bazaars = Array.from({ length: 8 }, (_, i) => {
    const angle = ((155 + i * 10) * Math.PI) / 180
    return {
      x2: 100 + 96 * Math.cos(angle),
      y2: 208 + 44 * Math.sin(angle),
      key: i,
    }
  })

  return (
    <svg
      className="clock-tower"
      viewBox="0 0 200 235"
      style={{ height, width: 'auto' }}
      role="img"
      aria-label="Faisalabad Clock Tower (Ghanta Ghar), its clock showing the real local time, with eight lines for the eight bazaars"
    >
      {bazaars.map((b) => (
        <line key={b.key} x1={100} y1={208} x2={b.x2} y2={b.y2} stroke={bazaar} strokeWidth={1.4} />
      ))}
      {/* base platform */}
      <rect x={62} y={196} width={76} height={12} rx={2} fill={stoneDark} stroke={trim} strokeWidth={0.8} />
      {/* tower body, gently tapering */}
      <path d="M74 196 L82 108 L118 108 L126 196 Z" fill={stone} stroke={trim} strokeWidth={0.8} />
      {/* balcony */}
      <rect x={76} y={100} width={48} height={8} rx={2} fill={stoneDark} stroke={trim} strokeWidth={0.8} />
      {/* clock housing */}
      <rect x={78} y={48} width={44} height={54} rx={4} fill={stone} stroke={trim} strokeWidth={0.8} />
      {/* clock face */}
      <circle cx={cx} cy={cy} r={21} fill={face} stroke={trim} strokeWidth={1.6} />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180
        const inner = i % 3 === 0 ? 16.5 : 18.5
        return (
          <line
            key={i}
            x1={cx + inner * Math.sin(a)} y1={cy - inner * Math.cos(a)}
            x2={cx + 20 * Math.sin(a)} y2={cy - 20 * Math.cos(a)}
            stroke={handColor} strokeWidth={i % 3 === 0 ? 1.6 : 0.9}
          />
        )
      })}
      {hand(cx, cy, 11, h * 30, 2.6, handColor)}
      {hand(cx, cy, 16, m * 6, 1.9, handColor)}
      {hand(cx, cy, 18.5, s * 6, 0.9, silhouette ? '#8FA5C4' : '#B3543F')}
      <circle cx={cx} cy={cy} r={2.1} fill={trim} />
      {/* dome and finial */}
      <path d="M78 48 Q100 22 122 48 Z" fill={stoneDark} stroke={trim} strokeWidth={0.8} />
      <line x1={100} y1={30} x2={100} y2={16} stroke={trim} strokeWidth={1.6} />
      <circle cx={100} cy={13} r={3} fill={trim} />
      {/* arched window below the clock */}
      <path d="M93 132 a7 9 0 0 1 14 0 v10 h-14 Z" fill={stoneDark} stroke={trim} strokeWidth={0.7} />
    </svg>
  )
}
