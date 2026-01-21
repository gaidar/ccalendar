import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Globe, Menu, LogOut, User, Calendar, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/calendar', label: 'Calendar', icon: Calendar },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
];

export function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to={isAuthenticated ? '/calendar' : '/'}
          className="flex items-center gap-2"
          aria-label="Country Calendar Home"
        >
          <Globe className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold">Country Calendar</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          {isAuthenticated && (
            <>
              {navLinks.map(link => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )
                  }
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </NavLink>
              ))}
            </>
          )}
        </div>

        {/* Desktop Auth Buttons / User Menu */}
        <div className="hidden items-center gap-4 lg:flex">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )
                }
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{user?.name}</span>
              </NavLink>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-menu"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Mobile Menu Sheet */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="right" className="w-80" id="mobile-menu" aria-modal="true">
            <SheetHeader className="text-left">
              <SheetTitle>
                <div className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  <span>Country Calendar</span>
                </div>
              </SheetTitle>
              {isAuthenticated && user && (
                <SheetDescription className="text-left">
                  Signed in as {user.email}
                </SheetDescription>
              )}
            </SheetHeader>

            <div className="mt-6 flex flex-col gap-2">
              {isAuthenticated ? (
                <>
                  {navLinks.map(link => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        )
                      }
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </NavLink>
                  ))}

                  <NavLink
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )
                    }
                  >
                    <User className="h-5 w-5" />
                    Profile
                  </NavLink>

                  <div className="my-2 border-t" />

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <LogOut className="h-5 w-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
