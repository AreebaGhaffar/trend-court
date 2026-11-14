import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Nav from './components/Nav'
import Home from './pages/Home'
import Trial from './pages/Trial'
import Evidence from './pages/Evidence'
import Verdict from './pages/Verdict'
import Lab from './pages/Lab'
import About from './pages/About'

export default function App() {
  const location = useLocation()
  return (
    <div>
      <Nav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/trial" element={<Trial />} />
          <Route path="/evidence" element={<Evidence />} />
          <Route path="/verdict" element={<Verdict />} />
          <Route path="/lab" element={<Lab />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </AnimatePresence>
      <footer className="footer">
        Trend Court — Faisalabad on Trial · Team Mind Flayer · NASA Space Apps
        Challenge 2026 · Challenge: Be An Earth System Trend Detective!
        <br />
        Data: NASA POWER, Faisalabad (31.42°N, 73.08°E), 2000–2025.
      </footer>
    </div>
  )
}
