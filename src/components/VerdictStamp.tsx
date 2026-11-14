import { motion } from 'framer-motion'

/** Gavel verdict stamp: drops in with a stiff spring, like a judge's stamp. */
export default function VerdictStamp({ verdict }: { verdict: string }) {
  return (
    <motion.div
      initial={{ scale: 2.4, opacity: 0, rotate: -18 }}
      animate={{ scale: 1, opacity: 1, rotate: -6 }}
      transition={{ type: 'spring', stiffness: 320, damping: 16, delay: 0.35 }}
    >
      <span className="stamp">{verdict}</span>
    </motion.div>
  )
}
