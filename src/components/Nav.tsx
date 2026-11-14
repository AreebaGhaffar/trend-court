import { NavLink } from 'react-router-dom'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/trial', label: 'The Trial' },
  { to: '/evidence', label: 'Evidence Vault' },
  { to: '/verdict', label: 'Verdicts' },
  { to: '/lab', label: 'Method Lab' },
  { to: '/about', label: 'Data & Caveats' },
]

export default function Nav() {
  return (
    <header className="topnav">
      <NavLink className="brand" to="/">
        ⚖ TREND COURT <span>· Faisalabad on Trial</span>
      </NavLink>
      <nav className="navlinks">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </header>
  )
}
