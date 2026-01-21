import { NavLink } from 'react-router-dom';
import { Calendar, BarChart3, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';

const navItems = [
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/profile', label: 'Profile', icon: User },
];

export function MobileNav() {
  const { isAuthenticated } = useAuthStore();

  // Only show for authenticated users
  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-white pb-safe md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="grid h-16 grid-cols-3">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                'flex min-h-[48px] flex-col items-center justify-center gap-1 text-xs font-medium transition-colors',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <item.icon
                  className={cn('h-5 w-5', isActive && 'text-primary')}
                  aria-hidden="true"
                />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
