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
        <h2>Change-point: confirmed by Pettitt’s test — and not coincident</h2>
        <p>
          Pettitt’s change-point test (1979), run in{' '}
          <code>analysis/pettitt_test.py</code> on the 26 annual values, confirms
          a single change-point year for each series at p &lt; 0.05:
        </p>
        <ul>
          <li>
            Temperature: K = 111, p ≈ 0.035. Split after 2010 — the new regime
            starts in 2011 (2000–2010 mean 26.64 °C → 2011–2025 mean 25.87 °C).
          </li>
          <li>
            Rainfall: K = 117, p ≈ 0.022. Split after 2018 — the new regime
            starts in 2019 (2000–2018 mean 381.49 mm → 2019–2025 mean 667.61 mm).
          </li>
        </ul>
        <p>
          Neither is significant at p &lt; 0.01. The earlier “candidate
          change-point around 2020” is therefore wrong as a single year, and
          there is <strong>no coincident regime shift</strong>: the two confirmed
          change-points are 8 years apart (2011 vs 2019). Do not quote 2020 as
          the change-point year, and do not claim the two series shifted
          together. The rainfall rise is still a wet-2020s story in the
          sub-period sense, but Pettitt’s formal change-point for rainfall is
          the start of 2019, not 2020.
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
