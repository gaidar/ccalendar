import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="font-semibold">Country Calendar</span>
          </div>

          <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>
            <Link to="/support" className="hover:text-foreground">
              Support
            </Link>
          </nav>

          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Country Calendar. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
