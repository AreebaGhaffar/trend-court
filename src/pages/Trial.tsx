import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import Page from '../components/Page'
import TrendChart from '../components/TrendChart'
import VerdictStamp from '../components/VerdictStamp'
import { defendants, getDefendant } from '../data/trends'

export default function Trial() {
  const [params, setParams] = useSearchParams()
  const defendant = getDefendant(params.get('d') ?? 'rainfall')

  return (
    <Page>
      <motion.div
        layoutId={`defendant-${defendant.id}`}
        style={{ background: '#101a3d', border: '1px solid rgba(201,162,39,0.4)', borderRadius: 16, padding: '1.5rem' }}
      >
        <span style={{ color: '#c9a227', fontSize: '0.75rem', letterSpacing: '0.2em', fontWeight: 700 }}>
          THE TRIAL · FAISALABAD ON TRIAL
        </span>
        <h1 style={{ fontSize: '2rem', marginTop: '0.5rem' }}>
          {defendant.id === 'temperature' ? 'Temperature' : 'Rainfall'} on trial
        </h1>
        <p style={{ color: '#8a93b2', margin: '0.5rem 0 0' }}>
          Charge: {defendant.charge} {defendant.variable}.
        </p>
      </motion.div>

      <div className="picker" role="group" aria-label="Pick a defendant">
        {defendants.map((d) => (
          <button
            key={d.id}
            type="button"
            className={d.id === defendant.id ? 'on' : ''}
            onClick={() => setParams({ d: d.id })}
          >
            {d.id === 'temperature' ? '🌡 Temperature' : '🌧 Rainfall'}
          </button>
        ))}
      </div>

      <TrendChart defendant={defendant} />

      <section className="panel">
        <h2>The evidence, in numbers</h2>
        <div className="kv">
          <div>
            <div className="k">Trend, 2000–2025</div>
            <div className="v">{defendant.slopeLabel}</div>
            <div className="s">Sen’s slope</div>
          </div>
          <div>
            <div className="k">Confidence (label)</div>
            <div className="v">{defendant.confidenceLabel}</div>
            <div className="s">(1 − Hamed-Rao p) × 100</div>
          </div>
          <div>
            <div className="k">Hamed-Rao p</div>
            <div className="v">{defendant.pHamedRao}</div>
            <div className="s">Yue-Pilon p: {defendant.pYuePilon}</div>
          </div>
          <div>
            <div className="k">First 5 yrs → last 5 yrs</div>
            <div className="v">
              {defendant.first5Mean} → {defendant.last5Mean}
            </div>
            <div className="s">2000–2004 → 2021–2025</div>
          </div>
        </div>
        <p className="fineprint" style={{ marginTop: '1rem' }}>
          Displayed confidence is a frequentist confidence approximation,
          (1 − p) × 100 using the Hamed-Rao corrected p-value. It is <strong>not</strong> a
          Bayesian posterior — no Bayesian model was fitted.
        </p>
      </section>

      <section className="panel" style={{ textAlign: 'center' }}>
        <h2>The defence checks</h2>
        <p>
          On 2000–2019 alone, this trend is <strong>not significant</strong> after
          correction (Hamed-Rao p ≈ {defendant.subPHamedRao}, slope{' '}
          {defendant.subSlope} {defendant.unit}). It survives dropping the
          outlier year 2020 (slope {defendant.dropSlope} {defendant.unit},
          Hamed-Rao p ≈ {defendant.dropPHamedRao}) — but that does not turn a
          2020s-driven change into a steady 26-year climb.
        </p>
        <div style={{ margin: '1.5rem 0' }}>
          <VerdictStamp verdict="Not Proven" />
        </div>
        <p style={{ fontSize: '1.1rem' }}>
          <strong>{defendant.verdict}</strong>
        </p>
        <p>{defendant.verdictReason}</p>
        <p className="caveat">
          Candidate change-point around 2020 — to be confirmed by a named
          change-point test. It is a candidate, not a proven year.
        </p>
      </section>
    </Page>
  )
}
