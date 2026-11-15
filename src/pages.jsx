import { lazy, Suspense, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useTrends, defendantById } from './data.jsx'
import { VerdictBadge, ConfidenceMeter, TrendChart, DefendantCard, YearDial } from './components.jsx'
import Globe from './Globe.jsx'
import ClockTower from './ClockTower.jsx'
import { Reveal, reducedMotion } from './useReveal.js'
const MapHero = lazy(() => import('./MapHero.jsx'))
const yearsIn = (text) => (String(text || '').match(/\d{4}/g) || []).map(Number)

function PickDefendant({ current }) {
  const data = useTrends()
  return (
    <div className="pick" role="group" aria-label="Choose a defendant">
      {data.defendants.filter((d) => d.id !== 'third').map((d) => (
        <Link key={d.id} className={d.id === current ? 'pick-btn active' : 'pick-btn'}
          to={`?defendant=${d.id}`}>{d.name}</Link>
      ))}
    </div>
  )
}

export function Home() {
  const data = useTrends()
  return (
    <main>
      <Suspense fallback={<section className="map-hero" aria-busy="true" />}>
        <MapHero data={data} />
      </Suspense>
      <div className="board" id="case-board">
        <div className="board-head">
          <h2>The Case Board</h2>
          <p className="muted">Pick a defendant and put it on trial.</p>
        </div>
        <div className="grid">
          {data.defendants.map((d, i) => <DefendantCard key={d.id} defendant={d} index={i} />)}
        </div>
        <p className="note">{data.not_tested_message}</p>
      </div>
    </main>
  )
}

const TRIAL_STEPS = ['Charge', 'Evidence', 'Cross-examination', 'Confidence']

export function Trial() {
  const data = useTrends()
  const [params] = useSearchParams()
  const d = defendantById(data, params.get('defendant') || 'rainfall')
  const [activeStep, setActiveStep] = useState(0)
  const [crossExamined, setCrossExamined] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [selectedYear, setSelectedYear] = useState(null)

  const series = d.annual_series || []
  const hasSeries = series.length > 1
  const [periodStart] = yearsIn(data.meta.period)
  const dialYears = series.map((v, i) =>
    typeof v === 'object' ? v.year : (periodStart ?? 0) + i)
  const dialYear = selectedYear != null && dialYears.includes(selectedYear)
    ? selectedYear
    : dialYears[dialYears.length - 1]
  const dialRow = hasSeries
    ? series.find((v, i) => (typeof v === 'object' ? v.year : (periodStart ?? 0) + i) === dialYear)
    : null
  const dialValue = dialRow != null
    ? (typeof dialRow === 'object' ? dialRow.value : dialRow)
    : null

  const goToStep = (i) => {
    setActiveStep(i)
    const el = document.getElementById(`trial-step-${i + 1}`)
    if (el) el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }
  const startCrossExamine = () => {
    setCrossExamined(true)
    if (!reducedMotion()) setShaking(true)
  }

  return (
    <main
      className={shaking ? 'page shake' : 'page'}
      onAnimationEnd={(e) => { if (e.target === e.currentTarget) setShaking(false) }}
    >
      <h1>The Trial</h1>
      <PickDefendant current={d.id} />
      <ol className="stepper" aria-label="Trial steps">
        {TRIAL_STEPS.map((label, i) => (
          <li key={label}>
            <button
              type="button"
              className={`stepper-btn${i < activeStep ? ' done' : ''}${i === activeStep ? ' active' : ''}`}
              aria-current={i === activeStep ? 'step' : undefined}
              onClick={() => goToStep(i)}
            >
              <span className="step-dot" aria-hidden="true">{i < activeStep ? '✓' : i + 1}</span>
              {label}
            </button>
          </li>
        ))}
      </ol>
      <section className="step" id="trial-step-1">
        <h2>1 · The Charge</h2>
        <p className="charge">“{d.charge}.”</p>
        <p>Trend: <strong>{d.trend_display}</strong> over {data.meta.period}.</p>
      </section>
      <section className="step" id="trial-step-2">
        <h2>2 · The Evidence</h2>
        <TrendChart defendant={d} crossExamined={crossExamined} highlightYear={hasSeries ? dialYear : null} />
        {hasSeries && (
          <div className="dial-wrap">
            <YearDial years={dialYears} value={dialYear} onChange={setSelectedYear} />
            <p className="dial-readout">
              Year <strong>{dialYear}</strong>
              {dialValue != null && <>: <strong>{dialValue} {d.unit}</strong></>}
              {' '}— drag the dial hand or use the arrow keys.
            </p>
          </div>
        )}
        {d.id === 'rainfall' && <p className="note">{d.caveat}</p>}
      </section>
      <section className="step" id="trial-step-3">
        <h2>3 · Cross-examination</h2>
        <p>
          Checked on {d.subperiod_2000_2019.label}, this trend is{' '}
          <strong>not significant after correction</strong>{' '}
          (Hamed-Rao p ≈ {d.subperiod_2000_2019.p_hamed_rao}, Yue-Pilon p ≈ {d.subperiod_2000_2019.p_yue_pilon}).
          On the full period it is significant after correction
          (Hamed-Rao p ≈ {d.p_hamed_rao}, Yue-Pilon p ≈ {d.p_yue_pilon}), and it survives
          dropping 2020 ({d.drop_2020.trend_per_year} per year, Hamed-Rao p ≈ {d.drop_2020.p_hamed_rao}).
          The change is driven by the 2020s — that is the twist in this case.
        </p>
        <p>Candidate change-point: {data.change_point.display_text}</p>
        <div className="cross-actions">
          <button
            type="button"
            className="btn"
            aria-pressed={crossExamined}
            onClick={startCrossExamine}
            disabled={crossExamined}
          >
            Cross-examine: use 2000–2019 only
          </button>
          {crossExamined && (
            <button type="button" className="btn btn-ghost" onClick={() => setCrossExamined(false)}>
              Reset
            </button>
          )}
        </div>
        {crossExamined && (
          <p className="note">
            Cross-examined: the chart and confidence now show {d.subperiod_2000_2019.label} only —
            the 2020s are set aside. Press Reset to return to the full period.
          </p>
        )}
      </section>
      <section className="step" id="trial-step-4">
        <h2>4 · Confidence</h2>
        {crossExamined ? (
          <div className="not-significant fade-swap">
            <p className="confidence-label">Not significant</p>
            <p>
              On {d.subperiod_2000_2019.label}, the corrected Hamed-Rao p ≈{' '}
              {d.subperiod_2000_2019.p_hamed_rao} — so the confidence counter drops away:
              the trend is not significant after correction on that period alone.
            </p>
          </div>
        ) : (
          <ConfidenceMeter percent={d.confidence_percent} />
        )}
        <p className="muted">{data.meta.confidence_note}</p>
      </section>
      <Link className="btn btn-big" to={`/verdict?defendant=${d.id}`}>See the verdict</Link>
    </main>
  )
}

function RainLayer({ heavy }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        key: i,
        left: ((i * 53) % 97) + 1.5,
        height: 26 + ((i * 29) % 30),
        duration: 0.9 + ((i * 13) % 10) / 10,
        delay: -(((i * 7) % 20) / 10),
        opacity: 0.16 + ((i * 11) % 20) / 100,
      })),
    [],
  )
  if (reducedMotion()) return null
  return (
    <div className={heavy ? 'rain-layer rain-heavy' : 'rain-layer'} aria-hidden="true">
      {drops.map((drop) => (
        <span
          key={drop.key}
          className="rain-drop"
          style={{
            left: `${drop.left}%`,
            height: drop.height,
            animationDuration: `${drop.duration}s`,
            animationDelay: `${drop.delay}s`,
            '--drop-opacity': drop.opacity,
          }}
        />
      ))}
    </div>
  )
}

function EvidenceSection({ d }) {
  const data = useTrends()
  const [view, setView] = useState('full')
  const [rainHeavy, setRainHeavy] = useState(false)
  const views = [
    ['full', 'Full period'],
    ['sub', d.subperiod_2000_2019.label],
    ['drop', d.drop_2020.label],
  ]
  return (
    <section className="step">
      {d.id === 'rainfall' && <RainLayer heavy={rainHeavy} />}
      <h2>{d.name} — {d.trend_display}</h2>
      <TrendChart defendant={d} />
      <div className="toggle-group" role="group" aria-label={`Choose which check to show for ${d.name}`}>
        {views.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={view === key ? 'toggle-btn active' : 'toggle-btn'}
            aria-pressed={view === key}
            onClick={() => setView(key)}
          >
            {label}
          </button>
        ))}
      </div>
      <div key={view} className="fade-swap" aria-live="polite">
        {view === 'full' && (
          <p className="stat-line">
            Trend <strong>{d.trend_display}</strong> · Hamed-Rao p ≈ {d.p_hamed_rao} ·
            Yue-Pilon p ≈ {d.p_yue_pilon} · Confidence <strong>{d.confidence_percent}%</strong>
          </p>
        )}
        {view === 'sub' && (
          <p className="stat-line">
            <strong>Not significant after correction</strong> · Hamed-Rao p ≈{' '}
            {d.subperiod_2000_2019.p_hamed_rao} · Yue-Pilon p ≈ {d.subperiod_2000_2019.p_yue_pilon}
          </p>
        )}
        {view === 'drop' && (
          <p className="stat-line">
            Trend <strong>{d.drop_2020.trend_per_year} per year</strong> · Hamed-Rao p ≈{' '}
            {d.drop_2020.p_hamed_rao}
          </p>
        )}
      </div>
      <table className="table">
        <thead><tr><th scope="col">Check</th><th scope="col">Result</th></tr></thead>
        <tbody>
          <Reveal as="tr"><td>Full period {data.meta.period}</td>
            <td>Significant after correction — Hamed-Rao p ≈ {d.p_hamed_rao}, Yue-Pilon p ≈ {d.p_yue_pilon}; confidence {d.confidence_percent}%</td></Reveal>
          <Reveal as="tr" delay={80}><td>{d.subperiod_2000_2019.label}</td>
            <td>Not significant after correction — Hamed-Rao p ≈ {d.subperiod_2000_2019.p_hamed_rao}, Yue-Pilon p ≈ {d.subperiod_2000_2019.p_yue_pilon}</td></Reveal>
          <Reveal as="tr" delay={160}><td>{d.drop_2020.label}</td>
            <td>{d.drop_2020.trend_per_year} per year — Hamed-Rao p ≈ {d.drop_2020.p_hamed_rao}</td></Reveal>
          {d.period_means.map((m, i) => (
            <Reveal as="tr" key={m.period} delay={220 + i * 80}><td>Mean, {m.period}</td><td>{m.value} {d.unit}</td></Reveal>
          ))}
        </tbody>
      </table>
      {d.annual_known_points?.length > 0 && (
        <>
          <h3>Wet years recorded in the plan</h3>
          <div className="chips">
            {d.annual_known_points.map((p) => (
              <button
                key={p.year}
                type="button"
                className="chip"
                onMouseEnter={() => setRainHeavy(true)}
                onMouseLeave={() => setRainHeavy(false)}
                onFocus={() => setRainHeavy(true)}
                onBlur={() => setRainHeavy(false)}
              >
                {p.year} — <strong>{p.value} {d.unit}</strong>
              </button>
            ))}
          </div>
          <p className="muted">{d.known_points_note}</p>
        </>
      )}
      <p className="note">{d.caveat}</p>
    </section>
  )
}

export function Evidence() {
  const data = useTrends()
  return (
    <main className="page">
      <h1>Evidence Vault</h1>
      <p className="lede">Inspect the proof without starting a trial. Every value on this page is read from trends.json.</p>
      {data.defendants.filter((d) => d.id !== 'third').map((d) => (
        <EvidenceSection key={d.id} d={d} />
      ))}
      <p className="note">{data.meta.annual_series_status === 'pending_member1_frozen_file'
        ? 'The full annual series for both defendants arrives with Member 1’s frozen trends.json. Until then the charts plot only the tested period means recorded in the locked plan — no annual values are invented.'
        : ''}</p>
    </main>
  )
}

function FlipCard({ title, text }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      type="button"
      className={flipped ? 'flip flipped' : 'flip'}
      aria-pressed={flipped}
      aria-label={`${title} — activate to ${flipped ? 'flip back' : 'flip and read the guidance'}`}
      onClick={() => setFlipped((f) => !f)}
    >
      <span className="flip-inner">
        <span className="flip-face flip-front">
          <h3>{title}</h3>
          <span className="flip-hint">Tap to flip</span>
        </span>
        <span className="flip-face flip-back">
          <h3>{title}</h3>
          <p>{text}</p>
          <span className="flip-hint">Tap to flip back</span>
        </span>
      </span>
    </button>
  )
}

export function Verdict() {
  const data = useTrends()
  const [params] = useSearchParams()
  const d = defendantById(data, params.get('defendant') || 'rainfall')
  // Keyed by defendant so the stamp slam + shake replay on every switch.
  return <VerdictPage key={d.id} d={d} data={data} />
}

function VerdictPage({ d, data }) {
  const [shaking, setShaking] = useState(() => !reducedMotion())
  const stampText = d.verdict.split('—')[0].trim().toUpperCase()
  return (
    <main
      className={shaking ? 'page shake-long' : 'page'}
      onAnimationEnd={(e) => { if (e.target === e.currentTarget) setShaking(false) }}
    >
      <h1>Verdict &amp; Planner Action</h1>
      <PickDefendant current={d.id} />
      <div key={d.id} className="fade-swap">
        <p><VerdictBadge verdict={d.verdict} /></p>
        <p className="stamp stamp-slam" aria-hidden="true">{stampText}</p>
        <p className="lede">
          {d.name} ({d.trend_display}) is <strong>{d.verdict}</strong> as a steady
          {' '}{data.meta.period} trend. It is significant on the full period, but not on
          2000–2019 alone — it is the {d.id === 'rainfall' ? 'wet' : 'changed'} 2020s, not a steady long climb or fall.
        </p>
        <div className="flip-grid">
          <FlipCard title="Planner should" text={d.planner_do} />
          <FlipCard title="Planner should not" text={d.planner_do_not} />
        </div>
        <h2>How every verdict is decided</h2>
        <div className="scale">
          {data.verdict_rules.map((r) => {
            const lit = d.verdict === r.verdict || d.verdict.startsWith(r.verdict)
            return (
              <article key={r.verdict} className={lit ? 'scale-level lit' : 'scale-level'}>
                <h3>{r.verdict}</h3>
                <p>{r.rule}</p>
                <p className="muted">{r.planner_meaning}</p>
              </article>
            )
          })}
        </div>
      </div>
    </main>
  )
}

function StepIcon() {
  return (
    <svg className="step-icon" width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false">
      <circle className="ring" cx="10" cy="10" r="7.5" fill="none" stroke="#C9A24B" strokeWidth="1.6" strokeDasharray="4 3" />
      <circle className="dot" cx="10" cy="10" r="2.4" fill="#5BC0EB" />
    </svg>
  )
}

function ChangePointTimeline() {
  const data = useTrends()
  const [start, end] = yearsIn(data.meta.period)
  const candidate = yearsIn(data.change_point.candidate_period)[0]
  const [year, setYear] = useState(candidate ?? start)
  const trackRef = useRef(null)
  if (start == null || end == null || end <= start) return null
  const pct = ((year - start) / (end - start)) * 100
  const pick = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    const adjusted = Math.max(0, Math.min(1, (ratio - 0.04) / 0.92))
    setYear(Math.round(start + adjusted * (end - start)))
  }
  return (
    <div className="timeline">
      <div
        ref={trackRef}
        className="timeline-track"
        role="slider"
        tabIndex={0}
        aria-label="Explore the timeline — moving this marker is for exploring only and changes no result"
        aria-valuemin={start}
        aria-valuemax={end}
        aria-valuenow={year}
        aria-valuetext={`Marker at year ${year}`}
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); setYear((y) => Math.min(end, y + 1)) }
          if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); setYear((y) => Math.max(start, y - 1)) }
          if (e.key === 'Home') { e.preventDefault(); setYear(start) }
          if (e.key === 'End') { e.preventDefault(); setYear(end) }
        }}
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); pick(e.clientX) }}
        onPointerMove={(e) => { if (e.buttons === 1) pick(e.clientX) }}
      >
        <div className="timeline-marker" style={{ left: `calc(4% + ${pct * 0.92}%)` }} />
      </div>
      <div className="timeline-years"><span>{start}</span><span>{end}</span></div>
      <p className="timeline-readout">
        Marker at <strong>{year}</strong> — exploring only; this changes no result.{' '}
        {data.change_point.display_text}
      </p>
    </div>
  )
}

export function Lab() {
  const data = useTrends()
  return (
    <main className="page">
      <h1>Method / Change-Point Lab</h1>
      <p className="lede">How the verdict was reached — the honesty page, where judges check validity.</p>
      <Reveal as="section" className="step"><h2><StepIcon />The test</h2><p>{data.meta.method}.</p></Reveal>
      <Reveal as="section" className="step"><h2><StepIcon />The percentage on screen</h2><p>{data.meta.confidence_note}</p></Reveal>
      <Reveal as="section" className="step"><h2><StepIcon />Change-point</h2>
        <p>{data.change_point.display_text} Status: {data.change_point.status}.</p>
        <p>{data.change_point.coincident_shift}</p>
        <ChangePointTimeline />
      </Reveal>
      <Reveal as="section" className="step"><h2><StepIcon />Sensitivity checks are part of the result</h2>
        <p>Sub-period 2000–2019 alone, and the full period with 2020 dropped, are reported
          for both defendants in the <Link to="/evidence">Evidence Vault</Link>. Surviving the
          drop-2020 check strengthens the full-period result — it does not turn a 2020s-driven
          change into a steady 26-year climb.</p></Reveal>
    </main>
  )
}

export function About() {
  const data = useTrends()
  return (
    <main className="page">
      <h1>About / Data &amp; Caveats</h1>
      <div className="about-visuals">
        <Globe lat={data.meta.latitude} lon={data.meta.longitude} size={150} mini label={false} />
        <ClockTower height={170} silhouette />
      </div>
      <section className="step"><h2>The project</h2>
        <p>{data.meta.project}, by {data.meta.team}, for {data.meta.event} —
          challenge: “{data.meta.challenge}”. The named user is a Faisalabad city water and
          drainage planner deciding whether to plan for wetter years — and whether a small
          fall in temperature means heat planning can relax. Trend Court answers both
          honestly, including when the honest answer is “do not act on this yet.”</p></section>
      <section className="step"><h2>Data</h2>
        <p>{data.meta.dataset}. Variables: T2M (°C) and PRECTOTCORR (mm).
          Region and period: {data.meta.city} ({data.meta.latitude}° N, {data.meta.longitude}° E),
          {' '}{data.meta.period}, {data.meta.annual_values_count} annual values.
          Units are SI: °C, mm, °C per year and mm per year, coordinates in decimal degrees.</p></section>
      <section className="step"><h2>Caveats — all in one place</h2>
        <ul>
          <li>POWER precipitation is a model and reanalysis product, not rain-gauge data.</li>
          <li>The temperature fall needs a MODIS land-surface-temperature cross-check and must not be used to relax heat planning.</li>
          <li>MODIS NDVI and GRACE / GRACE-FO are future tested defendants only — not claimed results. GRACE measures total water storage, not groundwater alone.</li>
          <li>{data.not_tested_message}</li>
        </ul></section>
      <section className="step"><h2>AI-use declaration</h2>
        <p>Team Mind Flayer used Muse AI as a building helper for code, debugging, checking
          numbers against the project data file, and drafting submission text. All data,
          statistical tests, and results are from the NASA dataset and methods stated above,
          and the team reviewed and verified the final project. Muse AI is not a registered
          team member.</p></section>
    </main>
  )
}
