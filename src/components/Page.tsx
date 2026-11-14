import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export default function Page({ children }: { children: ReactNode }) {
  return (
    <motion.main
      className="page"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  )
}
