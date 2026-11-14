import Page from '../components/Page'
import TrendChart from '../components/TrendChart'
import { defendants } from '../data/trends'

export default function Evidence() {
  return (
    <Page>
      <h1 style={{ fontSize: '2.2rem' }}>Evidence Vault</h1>
      <p style={{ color: '#8a93b2', lineHeight: 1.65 }}>
        Every number here comes from one file, <code>src/data/trends.json</code> —
        NASA POWER, Faisalabad (31.42°N, 73.08°E), 2000–2025, 26 annual values.
        If a number is not in that file, the tool does not quote it.
      </p>

      {defendants.map((d) => (
        <section key={d.id} className="panel">
          <h2>
            Exhibit {d.id === 'temperature' ? 'A' : 'B'} —{' '}
            {d.id === 'temperature' ? 'Temperature' : 'Rainfall'}
          </h2>
          <TrendChart defendant={d} />
          <table>
            <thead>
              <tr>
                <th>Check</th>
                <th>Slope</th>
                <th>Hamed-Rao p</th>
                <th>Yue-Pilon p</th>
                <th>Significant?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Full period, 2000–2025</td>
                <td>{d.slopeLabel}</td>
                <td>{d.pHamedRao}</td>
                <td>{d.pYuePilon}</td>
                <td>Yes, after correction</td>
              </tr>
              <tr>
                <td>2000–2019 alone</td>
                <td>
                  {d.subSlope} {d.unit}
                </td>
                <td>{d.subPHamedRao}</td>
                <td>{d.subPYuePilon}</td>
                <td>No, after correction</td>
              </tr>
              <tr>
                <td>Full period, 2020 dropped</td>
                <td>
                  {d.dropSlope} {d.unit}
                </td>
                <td>{d.dropPHamedRao}</td>
                <td>—</td>
                <td>Yes — survives the outlier check</td>
              </tr>
            </tbody>
          </table>
        </section>
      ))}

      <section className="panel">
        <h2>The wet years driving the rainfall rise</h2>
        <p>
          2020: 1,075.2 mm · 2022: 667.0 mm · 2023: 707.3 mm · 2024: 620.0 mm ·
          2025: 708.6 mm. The rainfall rise is a wet-2020s story, not a steady
          26-year climb — never present it as one.
        </p>
        <p className="caveat">
          POWER precipitation (PRECTOTCORR) is a model/reanalysis product, not
          rain-gauge data. Say so wherever the rainfall result is presented.
        </p>
      </section>
    </Page>
  )
}
