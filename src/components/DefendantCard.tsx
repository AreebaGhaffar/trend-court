import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { Defendant } from '../data/trends'

export default function DefendantCard({
  defendant,
  exhibit,
}: {
  defendant: Defendant
  exhibit: string
}) {
  const navigate = useNavigate()
  return (
    <motion.button
      layoutId={`defendant-${defendant.id}`}
      className="defendant-card"
      whileHover={{ y: -6, rotate: -0.5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      onClick={() => navigate(`/trial?d=${defendant.id}`)}
      type="button"
    >
      <span className="exhibit">{exhibit}</span>
      <h3>{defendant.id === 'temperature' ? 'Temperature' : 'Rainfall'}</h3>
      <p className="charge">{defendant.charge}</p>
      <div className="stat">{defendant.slopeLabel}</div>
      <div className="fineprint">2000–2025 · Faisalabad · NASA POWER</div>
      <span className="badge red">{defendant.verdict}</span>
    </motion.button>
  )
}
