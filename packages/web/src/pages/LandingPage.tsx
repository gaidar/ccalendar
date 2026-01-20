import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, Calendar, MapPin } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Country Calendar</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Track Your Travels
            <span className="block text-primary">Across the Globe</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Keep a visual record of every country you visit. See your travel history on a beautiful
            calendar, track your adventures, and watch your world map fill up with memories.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="gap-2">
                <Calendar className="h-5 w-5" />
                Start Tracking
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-20 grid gap-8 md:grid-cols-3">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Calendar View</h3>
            <p className="text-muted-foreground">
              See your travels organized by date with color-coded countries for easy visualization.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
              <Globe className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">249 Countries</h3>
            <p className="text-muted-foreground">
              Track visits to any country in the world with unique colors for each destination.
            </p>
          </div>
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">Travel Stats</h3>
            <p className="text-muted-foreground">
              View statistics about your travels and see how much of the world you have explored.
            </p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto border-t px-4 py-8">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Country Calendar. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
