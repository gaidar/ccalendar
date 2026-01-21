import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Globe,
  Calendar,
  MapPin,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    icon: Calendar,
    title: 'Calendar View',
    description:
      'See your travels organized by date with color-coded countries for easy visualization.',
  },
  {
    icon: Globe,
    title: '249 Countries',
    description:
      'Track visits to any country in the world with unique colors for each destination.',
  },
  {
    icon: MapPin,
    title: 'Travel Stats',
    description:
      'View statistics about your travels and see how much of the world you have explored.',
  },
  {
    icon: BarChart3,
    title: 'Export Reports',
    description:
      'Export your travel data to CSV or Excel for personal records or visa applications.',
  },
];

const benefits = [
  'Free to get started',
  'No credit card required',
  'Secure and private',
  'Access from any device',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed inset-x-0 top-0 z-50 border-b bg-white/80 backdrop-blur-sm">
        <nav className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold">Country Calendar</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/register">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-24">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/4 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute right-1/4 top-20 h-[400px] w-[400px] translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />
        </div>

        <div className="container mx-auto px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
              <Sparkles className="h-4 w-4 text-primary" />
              Free to use - No credit card required
            </div>

            <h1 className="animate-fade-in text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Track Your Travels
              <span className="mt-2 block bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
                Across the Globe
              </span>
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600 sm:text-xl">
              Keep a visual record of every country you visit. See your travel history on a
              beautiful calendar, track your adventures, and watch your world map fill up with
              memories.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="w-full gap-2 sm:w-auto">
                  <Calendar className="h-5 w-5" />
                  Start Tracking Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  I already have an account
                </Button>
              </Link>
            </div>

            {/* Benefits list */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {benefits.map(benefit => (
                <span key={benefit} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to track your travels
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Simple, beautiful, and powerful tools to document your journey around the world.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className="group rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Get started in minutes
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to start tracking your travels.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Create your account',
                description: 'Sign up for free with your email or social account.',
              },
              {
                step: '2',
                title: 'Add your travels',
                description: 'Select dates and countries you have visited on the calendar.',
              },
              {
                step: '3',
                title: 'Track & share',
                description: 'View your stats, export reports, and share your journey.',
              },
            ].map(item => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-br from-primary to-indigo-600 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to track your adventures?
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Join thousands of travelers who are documenting their journeys with Country Calendar.
            </p>
            <div className="mt-8">
              <Link to="/register">
                <Button
                  size="lg"
                  variant="secondary"
                  className="gap-2 bg-white text-primary hover:bg-gray-100"
                >
                  Get Started for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              <span className="font-semibold">Country Calendar</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <Link to="/privacy" className="hover:text-foreground">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-foreground">
                Terms of Service
              </Link>
              <Link to="/support" className="hover:text-foreground">
                Support
              </Link>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Country Calendar
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
