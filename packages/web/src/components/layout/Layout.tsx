import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { useAuthStore } from '@/stores/authStore';

interface LayoutProps {
  showHeader?: boolean;
  showFooter?: boolean;
  showMobileNav?: boolean;
}

export function Layout({
  showHeader = true,
  showFooter = true,
  showMobileNav = true,
}: LayoutProps) {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
      >
        Skip to main content
      </a>

      {showHeader && <Header />}

      <main
        id="main-content"
        className={`flex-1 ${isAuthenticated && showMobileNav ? 'pb-16 md:pb-0' : ''}`}
        tabIndex={-1}
      >
        <Outlet />
      </main>

      {showFooter && <Footer />}

      {showMobileNav && <MobileNav />}
    </div>
  );
}
