import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavLinks = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/tickets', label: 'Tickets', icon: Ticket },
];

export function AdminNav() {
  return (
    <nav className="mb-6 flex flex-wrap gap-2">
      {adminNavLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.exact}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground'
            )
          }
        >
          <link.icon className="h-4 w-4" />
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
