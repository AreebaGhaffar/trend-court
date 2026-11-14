import { Link, useSearchParams } from 'react-router'
import { useTrends, defendantById } from './data.jsx'
import { VerdictBadge, ConfidenceMeter, TrendChart, DefendantCard } from './components.jsx'

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
    <main className="page">
      <p className="kicker">{data.meta.event} · {data.meta.team}</p>
      <h1>Trend Court — Faisalabad on Trial</h1>
      <p className="lede">
        Every climate trend for Faisalabad, {data.meta.period}, is put on trial. The data is
        the evidence. The tool shows the confidence the trend is real, when it may have
        started, and a plain verdict — so a city water and drainage planner knows whether
        it is strong enough to act on.
      </p>
      <p className="muted">
        {data.meta.city} ({data.meta.latitude}° N, {data.meta.longitude}° E) · Data: {data.meta.dataset}
      </p>
      <h2>The Case Board</h2>
      <div className="grid">
        {data.defendants.map((d) => <DefendantCard key={d.id} defendant={d} />)}
      </div>
      <p className="note">{data.not_tested_message}</p>
    </main>
  )
}

export function Trial() {
  const data = useTrends()
  const [params] = useSearchParams()
  const d = defendantById(data, params.get('defendant') || 'rainfall')
  return (
    <main className="page">
      <h1>The Trial</h1>
      <PickDefendant current={d.id} />
      <section className="step">
        <h2>1 · The Charge</h2>
        <p className="charge">“{d.charge}.”</p>
        <p>Trend: <strong>{d.trend_display}</strong> over {data.meta.period}.</p>
      </section>
      <section className="step">
        <h2>2 · The Evidence</h2>
        <TrendChart defendant={d} />
        {d.id === 'rainfall' && <p className="note">{d.caveat}</p>}
      </section>
      <section className="step">
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
      </section>
      <section className="step">
        <h2>4 · Confidence</h2>
        <ConfidenceMeter percent={d.confidence_percent} />
        <p className="muted">{data.meta.confidence_note}</p>
      </section>
      <Link className="btn btn-big" to={`/verdict?defendant=${d.id}`}>See the verdict</Link>
    </main>
  )
}

export function Evidence() {
  const data = useTrends()
  return (
    <main className="page">
      <h1>Evidence Vault</h1>
      <p className="lede">Inspect the proof without starting a trial. Every value on this page is read from trends.json.</p>
      {data.defendants.filter((d) => d.id !== 'third').map((d) => (
        <section key={d.id} className="step">
          <h2>{d.name} — {d.trend_display}</h2>
          <TrendChart defendant={d} />
          <table className="table">
            <thead><tr><th scope="col">Check</th><th scope="col">Result</th></tr></thead>
            <tbody>
              <tr><td>Full period {data.meta.period}</td>
                <td>Significant after correction — Hamed-Rao p ≈ {d.p_hamed_rao}, Yue-Pilon p ≈ {d.p_yue_pilon}; confidence {d.confidence_percent}%</td></tr>
              <tr><td>{d.subperiod_2000_2019.label}</td>
                <td>Not significant after correction — Hamed-Rao p ≈ {d.subperiod_2000_2019.p_hamed_rao}, Yue-Pilon p ≈ {d.subperiod_2000_2019.p_yue_pilon}</td></tr>
              <tr><td>{d.drop_2020.label}</td>
                <td>{d.drop_2020.trend_per_year} per year — Hamed-Rao p ≈ {d.drop_2020.p_hamed_rao}</td></tr>
              {d.period_means.map((m) => (
                <tr key={m.period}><td>Mean, {m.period}</td><td>{m.value} {d.unit}</td></tr>
              ))}
            </tbody>
          </table>
          {d.annual_known_points?.length > 0 && (
            <>
              <h3>Wet years recorded in the plan</h3>
              <table className="table">
                <thead><tr><th scope="col">Year</th><th scope="col">Rainfall</th></tr></thead>
                <tbody>{d.annual_known_points.map((p) => (
                  <tr key={p.year}><td>{p.year}</td><td>{p.value} mm</td></tr>))}
                </tbody>
              </table>
              <p className="muted">{d.known_points_note}</p>
            </>
          )}
          <p className="note">{d.caveat}</p>
        </section>
      ))}
      <p className="note">{data.meta.annual_series_status === 'pending_member1_frozen_file'
        ? 'The full annual series for both defendants arrives with Member 1’s frozen trends.json. Until then the charts plot only the tested period means recorded in the locked plan — no annual values are invented.'
        : ''}</p>
    </main>
  )
}

export function Verdict() {
  const data = useTrends()
  const [params] = useSearchParams()
  const d = defendantById(data, params.get('defendant') || 'rainfall')
  return (
    <main className="page">
      <h1>Verdict &amp; Planner Action</h1>
      <PickDefendant current={d.id} />
      <p><VerdictBadge verdict={d.verdict} /></p>
      <p className="lede">
        {d.name} ({d.trend_display}) is <strong>{d.verdict}</strong> as a steady
        {' '}{data.meta.period} trend. It is significant on the full period, but not on
        2000–2019 alone — it is the {d.id === 'rainfall' ? 'wet' : 'changed'} 2020s, not a steady long climb or fall.
      </p>
      <div className="grid">
        <article className="card"><h3>Do</h3><p>{d.planner_do}</p></article>
        <article className="card"><h3>Do not</h3><p>{d.planner_do_not}</p></article>
      </div>
      <h2>How every verdict is decided</h2>
      <table className="table">
        <thead><tr><th scope="col">Verdict</th><th scope="col">Rule</th><th scope="col">For the planner</th></tr></thead>
        <tbody>{data.verdict_rules.map((r) => (
          <tr key={r.verdict}><td>{r.verdict}</td><td>{r.rule}</td><td>{r.planner_meaning}</td></tr>))}
        </tbody>
      </table>
    </main>
  )
}

export function Lab() {
  const data = useTrends()
  return (
    <main className="page">
      <h1>Method / Change-Point Lab</h1>
      <p className="lede">How the verdict was reached — the honesty page, where judges check validity.</p>
      <section className="step"><h2>The test</h2><p>{data.meta.method}.</p></section>
      <section className="step"><h2>The percentage on screen</h2><p>{data.meta.confidence_note}</p></section>
      <section className="step"><h2>Change-point</h2>
        <p>{data.change_point.display_text} Status: {data.change_point.status}.</p>
        <p>{data.change_point.coincident_shift}</p></section>
      <section className="step"><h2>Sensitivity checks are part of the result</h2>
        <p>Sub-period 2000–2019 alone, and the full period with 2020 dropped, are reported
        for both defendants in the <Link to="/evidence">Evidence Vault</Link>. Surviving the
        drop-2020 check strengthens the full-period result — it does not turn a 2020s-driven
        change into a steady 26-year climb.</p></section>
    </main>
  )
}

export function About() {
  const data = useTrends()
  return (
    <main className="page">
      <h1>About / Data &amp; Caveats</h1>
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
