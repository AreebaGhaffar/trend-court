import { NavLink, Outlet } from 'react-router'
import './App.css'

const links = [
  ['/', 'Home'],
  ['/trial', 'Trial'],
  ['/evidence', 'Evidence'],
  ['/verdict', 'Verdict'],
  ['/lab', 'Method Lab'],
  ['/about', 'About'],
]

export default function App() {
  return (
    <>
      <header className="topbar">
        <NavLink to="/" className="brand">⚖ Trend Court</NavLink>
        <nav aria-label="Main">
          {links.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => (isActive ? 'navlink active' : 'navlink')}>
              {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <Outlet />
      <footer className="footer">
        <p>Trend Court — Faisalabad on Trial · Team Mind Flayer · NASA Space Apps Challenge 2026</p>
        <p>All numbers on every page are read from one file: trends.json. Rainfall is a NASA
        POWER model / reanalysis product, not rain-gauge data.</p>
      </footer>
    </>
  )
}
