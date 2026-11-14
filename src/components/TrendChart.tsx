import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceArea,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { annualSeries, type Defendant } from '../data/trends'

/**
 * Evidence chart. The Recharts line animates in (draws left to right) on
 * mount; the gold shaded band is the wet 2020s, 2020–2025.
 */
export default function TrendChart({ defendant }: { defendant: Defendant }) {
  return (
    <div className="chart-wrap">
      <h4>
        Exhibit — {defendant.id === 'temperature' ? 'Annual mean temperature' : 'Annual total rainfall'},{' '}
        Faisalabad, 2000–2025 · NASA POWER
      </h4>
      <ResponsiveContainer width="100%" height={320}>
        <LineChart data={annualSeries} margin={{ top: 8, right: 24, bottom: 8, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e0d0" />
          <XAxis dataKey="year" tick={{ fontSize: 12 }} interval={2} />
          <YAxis
            tick={{ fontSize: 12 }}
            domain={['auto', 'auto']}
            label={{
              value:
                defendant.id === 'temperature' ? '°C' : 'mm',
              angle: -90,
              position: 'insideLeft',
              fontSize: 12,
            }}
          />
          <Tooltip
            formatter={(value) => [
              `${value} ${defendant.id === 'temperature' ? '°C' : 'mm'}`,
              defendant.id === 'temperature' ? 'Mean temp' : 'Total rain',
            ]}
          />
          <ReferenceArea x1={2020} x2={2025} fill="#c9a227" fillOpacity={0.18} label={{ value: 'wet 2020s', fill: '#8a6d1a', fontSize: 12, position: 'insideTop' }} />
          <Line
            type="monotone"
            dataKey={defendant.dataKey}
            stroke={defendant.id === 'temperature' ? '#2e6da4' : '#c9a227'}
            strokeWidth={3}
            dot={false}
            animationDuration={1400}
            animationEasing="ease-out"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
