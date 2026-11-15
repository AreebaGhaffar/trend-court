import { NavLink, Outlet, useLocation } from 'react-router'
import './App.css'
import './motion.css'

const links = [
  ['/', 'Home'],
  ['/trial', 'Trial'],
  ['/evidence', 'Evidence'],
  ['/verdict', 'Verdict'],
  ['/lab', 'Method Lab'],
  ['/about', 'About'],
]

export default function App() {
  const location = useLocation()
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
      <div key={location.pathname} className="route-fade">
        <Outlet />
      </div>
      <footer className="footer">
        <p>Trend Court — Faisalabad on Trial · Team Mind Flayer · NASA Space Apps Challenge 2026</p>

      </footer>
    </>
  )
}
