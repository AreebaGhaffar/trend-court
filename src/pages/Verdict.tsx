import { Link } from 'react-router-dom'
import Page from '../components/Page'
import { defendants } from '../data/trends'

export default function Verdict() {
  return (
    <Page>
      <h1 style={{ fontSize: '2.2rem' }}>Verdicts &amp; Planner Action</h1>
      <p style={{ color: '#8a93b2', lineHeight: 1.65 }}>
        The verdict is the product. A planner in Faisalabad gets a decision
        rule, not a chart to interpret alone.
      </p>

      {defendants.map((d) => (
        <section key={d.id} className="panel">
          <h2>
            {d.id === 'temperature' ? 'Temperature' : 'Rainfall'} —{' '}
            {d.slopeLabel}
          </h2>
          <span className="badge red">{d.verdict}</span>
          <p style={{ marginTop: '1rem' }}>{d.verdictReason}</p>
          <h3 style={{ marginTop: '1rem' }}>What the planner should do</h3>
          <ul>
            {d.id === 'rainfall' ? (
              <>
                <li>Plan drainage and storage for wetter years — the 2020s are wet.</li>
                <li>Keep checking: the rise is not proven as a steady 26-year climb.</li>
              </>
            ) : (
              <>
                <li>Do NOT relax heat planning — the cooling is counterintuitive and needs a MODIS land-surface-temperature cross-check.</li>
                <li>Keep heat plans in place until that cross-check is done.</li>
              </>
            )}
          </ul>
          <h3>What the planner should NOT do</h3>
          <ul>
            <li>Do not treat the trend as a guaranteed long-term climb or fall.</li>
            <li>Do not spend on the basis of a single regression line.</li>
          </ul>
        </section>
      ))}

      <section className="panel">
        <h2>The verdict rule — decided before the results</h2>
        <table>
          <thead>
            <tr>
              <th>Verdict</th>
              <th>Rule</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Proven</td>
              <td>Significant after correction on the full period AND significant on 2000–2019 alone.</td>
            </tr>
            <tr>
              <td>Not Proven — Don’t trust it yet</td>
              <td>Significant on the full period only; not significant on 2000–2019 alone.</td>
            </tr>
            <tr>
              <td>Too Weak to Trust</td>
              <td>Not significant, or not tested at all.</td>
            </tr>
          </tbody>
        </table>
        <p style={{ marginTop: '1rem' }}>
          <Link className="btn" to="/trial">Re-open the trial →</Link>
        </p>
      </section>
    </Page>
  )
}
