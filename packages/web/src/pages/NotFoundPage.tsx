import { Link } from 'react-router-dom';
import { Globe, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Globe className="mb-8 h-24 w-24 text-primary opacity-50" />
      <h1 className="mb-2 text-4xl font-bold">404</h1>
      <p className="mb-8 text-xl text-muted-foreground">Page not found</p>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        The page you are looking for does not exist or may have been moved.
      </p>
      <Link to="/">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>
    </div>
  );
}
