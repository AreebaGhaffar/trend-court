import { useRef } from 'react'
import { Link } from 'react-router'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceArea, ReferenceDot, Cell,
} from 'recharts'
import { useTrends } from './data.jsx'
import { useReveal, reducedMotion } from './useReveal.js'
import { useCountUp, decimalsOf, formatSigned } from './useCountUp.js'

const AXIS_TICK = { fill: '#9DB2CC', fontSize: 12 }
const TOOLTIP_STYLE = {
  backgroundColor: '#16263D', border: '1px solid #2A3D5A', color: '#E9EFF7',
}

export function VerdictBadge({ verdict, short }) {
  const cls = verdict.startsWith('Proven')
    ? 'badge badge-proven'
    : verdict.startsWith('Not Proven')
      ? 'badge badge-notproven badge-pulse'
      : 'badge badge-weak'
  return <span className={cls}>{short || verdict}</span>
}

export function ConfidenceMeter({ percent }) {
  const text = useCountUp(
    percent,
    (v) => (percent == null ? '' : v.toFixed(decimalsOf(percent))),
  )
  if (percent == null) return <p className="muted">No confidence label — not tested.</p>
  return (
    <div>
      <div className="meter" role="img" aria-label={`Confidence ${percent} percent`}>
        <div className="meter-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="confidence-label">{text}% confidence</p>
    </div>
  )
}

const yearsIn = (text) => (String(text || '').match(/\d{4}/g) || []).map(Number)

/**
 * One shared chart for every page. If Member 1's frozen trends.json contains a
 * full annual series it is plotted as a line with the recent period shaded and
 * a dashed Sen's slope (the slope value comes from trends.json; the line is
 * anchored at the first recorded value). Until then, only the period means
 * recorded in the plan are charted — the app never invents annual values.
 * With `crossExamined`, the annual view is cut to the sub-period recorded in
 * trends.json and the shading and slope are removed.
 */
export function TrendChart({ defendant, crossExamined = false, highlightYear = null }) {
  const data = useTrends()
  const [periodStart, periodEnd] = yearsIn(data.meta.period)
  const series = defendant.annual_series || []
  if (series.length > 1) {
    let rows = series.map((v, i) =>
      typeof v === 'object' ? { ...v } : { year: (periodStart ?? 0) + i, value: v })
    const subEnd = yearsIn(defendant.subperiod_2000_2019?.label).pop()
    if (crossExamined && subEnd != null) rows = rows.filter((r) => r.year <= subEnd)
    const slope = defendant.trend_per_year
    if (!crossExamined && slope != null && rows.length > 1) {
      const first = rows[0]
      rows = rows.map((r) => ({ ...r, slope: first.value + slope * (r.year - first.year) }))
    }
    const shadeStart = yearsIn(data.change_point.candidate_period)[0]
    const highlighted = highlightYear != null
      ? rows.find((r) => r.year === highlightYear)
      : null
    return (
      <figure className="chart" role="img" aria-label={`${defendant.name} chart — trend ${defendant.trend_display}, from trends.json`}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="#2A3D5A" strokeDasharray="3 3" />
            <XAxis dataKey="year" tick={AXIS_TICK} />
            <YAxis domain={['auto', 'auto']} tick={AXIS_TICK} unit={defendant.unit === 'mm' ? ' mm' : ' °C'} />
            <Tooltip contentStyle={TOOLTIP_STYLE} />
            {!crossExamined && shadeStart != null && periodEnd != null && (
              <ReferenceArea x1={shadeStart} x2={periodEnd} fill="#C9A24B" fillOpacity={0.16}
                label={{ value: '2020s', fill: '#E9B44C', fontSize: 12 }} />
            )}
            <Line type="monotone" dataKey="value" stroke="#5BC0EB" strokeWidth={2} dot={false}
              style={{ filter: 'drop-shadow(0 0 5px rgba(91,192,235,0.65))' }} />
            {!crossExamined && slope != null && (
              <Line type="linear" dataKey="slope" stroke="#C9A24B" strokeWidth={2}
                strokeDasharray="7 5" dot={false} name="Sen's slope" />
            )}
            {highlighted && (
              <ReferenceDot x={highlighted.year} y={highlighted.value} r={6}
                fill="#E9B44C" stroke="#0B1526" strokeWidth={1.5} />
            )}
          </LineChart>
        </ResponsiveContainer>
        <figcaption>
          Annual values from trends.json ({defendant.variable}). The shaded band is the
          2020s period that drives the story.
        </figcaption>
      </figure>
    )
  }
  const rows = defendant.period_means || []
  if (!rows.length) return <p className="muted">Not tested — no chart.</p>
  return (
    <figure className="chart" role="img" aria-label={`${defendant.name} chart — trend ${defendant.trend_display}, from trends.json`}>
      <ResponsiveContainer width="100%" height={190}>
        <BarChart data={rows} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#2A3D5A" strokeDasharray="3 3" />
          <XAxis dataKey="period" tick={AXIS_TICK} />
          <YAxis domain={[0, 'auto']} tick={AXIS_TICK} unit={defendant.unit === 'mm' ? ' mm' : ' °C'} />
          <Tooltip contentStyle={TOOLTIP_STYLE} cursor={{ fill: 'rgba(91,192,235,0.08)' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={64}>
            {rows.map((r, i) => (
              <Cell key={r.period} fill={i === 0 ? '#7A8AA0' : '#D95F43'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <figcaption>
        Period means recorded in trends.json ({defendant.variable}). The full annual
        chart appears automatically once Member 1's frozen file adds the annual series —
        this starter chart plots only tested, recorded values.
      </figcaption>
      <p className="chart-note">Annual values pending</p>
    </figure>
  )
}

/**
 * Clock-style year dial for the Trial page. Only rendered when an annual
 * series exists. Drag the hand or use the arrow keys; reports the chosen
 * year through onChange.
 */
export function YearDial({ years, value, onChange }) {
  const svgRef = useRef(null)
  const dragging = useRef(false)
  const n = years.length
  const index = Math.max(0, years.indexOf(value))
  const angleFor = (i) => -90 + (i / Math.max(1, n - 1)) * 360
  const pick = (clientX, clientY) => {
    const rect = svgRef.current.getBoundingClientRect()
    const dx = clientX - (rect.left + rect.width / 2)
    const dy = clientY - (rect.top + rect.height / 2)
    let rel = (Math.atan2(dy, dx) * 180) / Math.PI + 90
    rel = ((rel % 360) + 360) % 360
    const i = Math.max(0, Math.min(n - 1, Math.round((rel / 360) * (n - 1))))
    onChange(years[i])
  }
  const handAngle = angleFor(index)
  const hx = 60 + 40 * Math.cos((handAngle * Math.PI) / 180)
  const hy = 60 + 40 * Math.sin((handAngle * Math.PI) / 180)
  return (
    <svg
      ref={svgRef}
      className="dial"
      width={120} height={120} viewBox="0 0 120 120"
      role="slider" tabIndex={0}
      aria-label="Year dial — choose a year to highlight on the chart"
      aria-valuemin={years[0]} aria-valuemax={years[n - 1]} aria-valuenow={value}
      aria-valuetext={`Year ${value}`}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); onChange(years[Math.min(n - 1, index + 1)]) }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); onChange(years[Math.max(0, index - 1)]) }
        if (e.key === 'Home') { e.preventDefault(); onChange(years[0]) }
        if (e.key === 'End') { e.preventDefault(); onChange(years[n - 1]) }
      }}
      onPointerDown={(e) => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); pick(e.clientX, e.clientY) }}
      onPointerMove={(e) => { if (dragging.current) pick(e.clientX, e.clientY) }}
      onPointerUp={() => { dragging.current = false }}
      onPointerCancel={() => { dragging.current = false }}
    >
      <circle cx={60} cy={60} r={54} fill="#0B1830" stroke="#2A3D5A" strokeWidth={2} />
      {years.map((y, i) => {
        const a = (angleFor(i) * Math.PI) / 180
        const r1 = i === index ? 42 : 47
        return (
          <line key={y}
            x1={60 + r1 * Math.cos(a)} y1={60 + r1 * Math.sin(a)}
            x2={60 + 52 * Math.cos(a)} y2={60 + 52 * Math.sin(a)}
            stroke={i === index ? '#E9B44C' : '#5BC0EB'} strokeWidth={i === index ? 2.6 : 1.4} />
        )
      })}
      <line x1={60} y1={60} x2={hx} y2={hy} stroke="#E9B44C" strokeWidth={3} strokeLinecap="round" />
      <circle cx={60} cy={60} r={5} fill="#C9A24B" />
    </svg>
  )
}

export function DefendantCard({ defendant, index = 0 }) {
  const ref = useReveal()
  const trendText = useCountUp(
    defendant.trend_per_year,
    (v) => formatSigned(v, decimalsOf(defendant.trend_per_year ?? 0)),
  )
  const confText = useCountUp(
    defendant.confidence_percent,
    (v) => v.toFixed(decimalsOf(defendant.confidence_percent ?? 0)),
  )
  const onTilt = (e) => {
    if (reducedMotion() || e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    el.style.transitionDelay = '0ms'
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(700px) rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg)`
  }
  const resetTilt = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <article
      ref={ref}
      className="card reveal"
      style={{ transitionDelay: `${index * 130}ms` }}
      onPointerMove={onTilt}
      onPointerLeave={resetTilt}
    >
      <div className="card-head">
        <h3>{defendant.name}</h3>
        <VerdictBadge verdict={defendant.verdict} short={defendant.verdict_short} />
      </div>
      {defendant.trend_per_year != null && trendText != null ? (
        <p className="trend-size">{trendText} {defendant.unit} per year</p>
      ) : (
        <p className="trend-size">{defendant.trend_display}</p>
      )}
      <p className="muted">{defendant.variable}</p>
      {defendant.confidence_percent != null && confText != null && (
        <p>Confidence: {confText}%</p>
      )}
      {defendant.id === 'third' ? (
        <p className="muted">Not yet tested.</p>
      ) : (
        <Link className="btn" to={`/trial?defendant=${defendant.id}`}>Put on trial</Link>
      )}
    </article>
  )
}
