import { Link } from 'react-router'
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceArea, Cell,
} from 'recharts'

export function VerdictBadge({ verdict, short }) {
  const cls = verdict.startsWith('Proven')
    ? 'badge badge-proven'
    : verdict.startsWith('Not Proven')
      ? 'badge badge-notproven'
      : 'badge badge-weak'
  return <span className={cls}>{short || verdict}</span>
}

export function ConfidenceMeter({ percent }) {
  if (percent == null) return <p className="muted">No confidence label — not tested.</p>
  return (
    <div>
      <div className="meter" role="img" aria-label={`Confidence ${percent} percent`}>
        <div className="meter-fill" style={{ width: `${percent}%` }} />
      </div>
      <p className="confidence-label">{percent}% confidence</p>
    </div>
  )
}

/**
 * One shared chart for every page. If Member 1's frozen trends.json contains a
 * full annual series (26 values) it is plotted as a line with the 2020s shaded.
 * Until then, only the period means recorded in the plan are charted — the app
 * never invents annual values to fill a line.
 */
export function TrendChart({ defendant }) {
  const series = defendant.annual_series || []
  if (series.length > 1) {
    const rows = series.map((v, i) =>
      typeof v === 'object' ? v : { year: 2000 + i, value: v })
    return (
      <figure className="chart">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={rows} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={['auto', 'auto']} unit={defendant.unit === 'mm' ? ' mm' : ' °C'} />
            <Tooltip />
            <ReferenceArea x1={2020} x2={2025} fill="#c9a227" fillOpacity={0.15} label="2020s" />
            <Line type="monotone" dataKey="value" stroke="#14335f" strokeWidth={2} dot={false} />
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
    <figure className="chart">
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={rows} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="period" />
          <YAxis domain={[0, 'auto']} unit={defendant.unit === 'mm' ? ' mm' : ' °C'} />
          <Tooltip />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {rows.map((r, i) => (
              <Cell key={r.period} fill={i === 0 ? '#7a8aa0' : '#c0392b'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <figcaption>
        Period means recorded in trends.json ({defendant.variable}). The full annual
        chart appears automatically once Member 1's frozen file adds the annual series —
        this starter chart plots only tested, recorded values.
      </figcaption>
    </figure>
  )
}

export function DefendantCard({ defendant }) {
  return (
    <article className="card">
      <div className="card-head">
        <h3>{defendant.name}</h3>
        <VerdictBadge verdict={defendant.verdict} short={defendant.verdict_short} />
      </div>
      <p className="trend-size">{defendant.trend_display}</p>
      <p className="muted">{defendant.variable}</p>
      {defendant.confidence_percent != null && (
        <p>Confidence: {defendant.confidence_percent}%</p>
      )}
      {defendant.id === 'third' ? (
        <p className="muted">Not yet tested.</p>
      ) : (
        <Link className="btn" to={`/trial?defendant=${defendant.id}`}>Put on trial</Link>
      )}
    </article>
  )
}
