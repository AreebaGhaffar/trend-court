import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Page from '../components/Page'
import DefendantCard from '../components/DefendantCard'
import { defendants } from '../data/trends'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
}

export default function Home() {
  return (
    <Page>
      <motion.section
        className="hero"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.h1 variants={item}>
          TREND <em>COURT</em>
        </motion.h1>
        <motion.p variants={item}>
          Every climate trend for Faisalabad, 2000–2025, is put on trial. The
          data is the evidence. The court shows the probability the trend is
          real, when it may have started, and a plain verdict — so a planner
          knows whether it is strong enough to act on.
        </motion.p>
        <div className="gold-rule" />
        <motion.p variants={item} className="fineprint">
          Faisalabad, Punjab, Pakistan · 31.42°N, 73.08°E · 26 years of NASA
          POWER data · Mann-Kendall test + Sen’s slope, autocorrelation-corrected
        </motion.p>
      </motion.section>

      <motion.div
        className="cards"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={item}>
          <DefendantCard defendant={defendants[0]} exhibit="EXHIBIT A — DEFENDANT 1" />
        </motion.div>
        <motion.div variants={item}>
          <DefendantCard defendant={defendants[1]} exhibit="EXHIBIT B — DEFENDANT 2" />
        </motion.div>
        <motion.div variants={item}>
          <div className="defendant-card" style={{ cursor: 'default', opacity: 0.75 }}>
            <span className="exhibit">EXHIBIT C — DEFENDANT 3</span>
            <h3>Third defendant</h3>
            <p className="charge">
              Not yet tested. No data, no test, no claim — until a real
              dataset is retrieved and tested this weekend.
            </p>
            <div className="stat">—</div>
            <div className="fineprint">MODIS NDVI or GRACE are named next steps only.</div>
            <span className="badge grey">Too Weak to Trust / Not tested</span>
          </div>
        </motion.div>
      </motion.div>

      <section className="panel">
        <h2>How a trial works</h2>
        <ol>
          <li><strong>The charge is read.</strong> “Rainfall in Faisalabad is rising.”</li>
          <li><strong>The evidence appears.</strong> One chart, 26 years of NASA data.</li>
          <li><strong>The defence checks.</strong> Is the trend still there on 2000–2019 alone? What if 2020 is dropped?</li>
          <li><strong>The verdict is delivered.</strong> Proven, Not Proven, or Too Weak to Trust — with what the planner should and should not do.</li>
        </ol>
        <p>
          <Link className="btn" to="/trial">Enter the courtroom →</Link>{' '}
          <Link className="btn ghost" to="/evidence">See the evidence</Link>
        </p>
      </section>
    </Page>
  )
}
