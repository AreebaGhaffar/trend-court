import Page from '../components/Page'

export default function About() {
  return (
    <Page>
      <h1 style={{ fontSize: '2.2rem' }}>Data &amp; Caveats</h1>

      <section className="panel">
        <h2>Data</h2>
        <ul>
          <li>Dataset: NASA POWER (Prediction of Worldwide Energy Resources).</li>
          <li>Region: Faisalabad, Punjab, Pakistan — 31.42°N, 73.08°E.</li>
          <li>Period: 2000–2025, 26 annual values. 2025 is a complete year.</li>
          <li>Variables: T2M — annual mean 2-metre air temperature (°C). PRECTOTCORR — annual total corrected precipitation (mm).</li>
          <li>Method: Mann-Kendall + Sen’s slope, Hamed-Rao and Yue-Pilon autocorrelation corrections, 2000–2019 sub-period check, drop-2020 sensitivity check.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Caveats — stated wherever the results appear</h2>
        <ul>
          <li>POWER precipitation is a model/reanalysis product, not rain-gauge data.</li>
          <li>The temperature fall (−0.054 °C/yr) is counterintuitive for Punjab and still needs a MODIS land-surface-temperature cross-check. Do not use it to relax heat planning.</li>
          <li>Displayed confidence is (1 − p) × 100, a frequentist approximation — not a Bayesian posterior.</li>
          <li>The change-point around 2020 is a candidate, not a proven year.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>Not tested — do not claim</h2>
        <ul>
          <li>MODIS NDVI vegetation (MOD13Q1) — named next step only.</li>
          <li>GRACE / GRACE-FO total water storage — named next step only. GRACE measures total water storage, not groundwater alone.</li>
          <li>Any place other than Faisalabad, any variable other than temperature and rainfall, any period other than 2000–2025 / 2000–2019 / 2020–2025.</li>
        </ul>
      </section>

      <section className="panel">
        <h2>AI-use declaration</h2>
        <p>
          Team Mind Flayer used Muse AI as a building helper, paired with
          Member 1, for code, debugging, checking numbers against the project
          data file, and drafting submission text. All data, statistical tests,
          and results are from the NASA dataset and methods stated above, and
          the team reviewed and verified the final project. Muse AI is not a
          registered team member.
        </p>
        <p className="fineprint">
          Built by Team Mind Flayer, Faisalabad, for the NASA International
          Space Apps Challenge 2026 — “Be An Earth System Trend Detective!”.
        </p>
      </section>
    </Page>
  )
}
