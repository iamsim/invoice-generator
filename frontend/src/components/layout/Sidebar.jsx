import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'Clients',
    path: '/dashboard/clients',
    icon: '👥'
  },
  {
    title: 'Invoice Elements',
    path: '/dashboard/invoice-elements',
    icon: '📋'
  },
  {
    title: 'Invoices',
    path: '/dashboard/invoices',
    icon: '📄'
  }
]

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )
            }
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.title}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
