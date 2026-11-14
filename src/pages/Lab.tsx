import Page from '../components/Page'
import { defendants } from '../data/trends'

export default function Lab() {
  return (
    <Page>
      <h1 style={{ fontSize: '2.2rem' }}>Method / Change-Point Lab</h1>
      <p style={{ color: '#8a93b2', lineHeight: 1.65 }}>
        How the court reaches its verdicts — no black boxes. Every step can be
        checked against <code>src/data/trends.json</code> and the saved NASA
        POWER annual file.
      </p>

      <section className="panel">
        <h2>The test</h2>
        <p>
          Mann-Kendall trend test (two-sided) with Sen’s slope, with
          autocorrelation correction by the Hamed-Rao (1998) modified variance
          method and Yue-Pilon pre-whitening. Corrected p-values are reported,
          not only uncorrected ones.
        </p>
        <ul>
          <li>Temperature: Sen’s slope −0.054 °C/yr, Hamed-Rao p ≈ 0.0057, Yue-Pilon p ≈ 0.018.</li>
          <li>Rainfall: Sen’s slope +13.5 mm/yr, Hamed-Rao p ≈ 0.0005, Yue-Pilon p ≈ 0.0047.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>The confidence label — read this carefully</h2>
        <p>
          Displayed confidence = (1 − Hamed-Rao p) × 100. Temperature: 99.4%.
          Rainfall: 99.95%. This is a <strong>frequentist confidence
          approximation</strong> used as a plain-language label. It is{' '}
          <strong>not a Bayesian posterior probability</strong> — no Bayesian
          model was fitted. If a genuine Bayesian change-point model is fitted
          later, with its priors and output shown, its posterior may replace
          this label — and only then may the app call the number Bayesian.
        </p>
      </section>

      <section className="panel">
        <h2>Change-point: a candidate around 2020</h2>
        <p>
          Neither trend is significant on 2000–2019 alone after correction,
          and both are significant once the 2020s are included. That points to
          a candidate regime shift around 2020. It is a candidate, not a proven
          single year — confirm it with a named change-point test (for example
          Pettitt’s test) before the demo quotes a change-point year. If the
          test does not confirm a single year, say “candidate shift around
          2020 — not confirmed to a single year.”
        </p>
        <p>
          Coincident shift: because the temperature and rainfall candidates fall
          in the same period, the tool may flag a coincident regime shift
          around 2020 — as two series changing in the same period, not as
          proof that one caused the other.
        </p>
      </section>

      <section className="panel">
        <h2>Sensitivity checks</h2>
        <table>
          <thead>
            <tr>
              <th>Defendant</th>
              <th>Drop 2020</th>
              <th>Survives?</th>
            </tr>
          </thead>
          <tbody>
            {defendants.map((d) => (
              <tr key={d.id}>
                <td>{d.id === 'temperature' ? 'Temperature' : 'Rainfall'}</td>
                <td>
                  {d.dropSlope} {d.unit}, Hamed-Rao p ≈ {d.dropPHamedRao}
                </td>
                <td>Yes</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </Page>
  )
}
