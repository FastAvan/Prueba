import { NavLink, Outlet } from 'react-router-dom'

const links = [
  { to: '/', label: 'Inicio', icon: '🏠', end: true },
  { to: '/mapa', label: 'Mapa', icon: '🗺️' },
  { to: '/lavanderia', label: 'Lavandería', icon: '🧺' },
  { to: '/menu', label: 'Menú', icon: '🍽️' },
  { to: '/reservas', label: 'Reservas', icon: '📅' },
  { to: '/ajustes', label: 'Ajustes', icon: '⚙️' },
]

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 px-4 py-3">
        <h1 className="text-lg font-semibold tracking-tight">ResiMadrid</h1>
      </header>

      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-10 border-t border-slate-800 bg-slate-900/95 backdrop-blur">
        <ul className="mx-auto flex max-w-xl justify-between px-2">
          {links.map((link) => (
            <li key={link.to} className="flex-1">
              <NavLink
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 py-2 text-xs ${
                    isActive ? 'text-emerald-400' : 'text-slate-400'
                  }`
                }
              >
                <span className="text-lg leading-none">{link.icon}</span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
