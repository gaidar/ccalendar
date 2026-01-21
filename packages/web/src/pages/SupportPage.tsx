import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Loader2, AlertCircle, ArrowLeft, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supportService } from '@/lib/supportService';
import { useAuthStore } from '@/stores/authStore';
import {
  supportTicketSchema,
  SUPPORT_CATEGORIES,
  type SupportTicketFormData,
} from '@/lib/validations/support';
import { cn } from '@/lib/utils';

export default function SupportPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SupportTicketFormData>({
    resolver: zodResolver(supportTicketSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      category: 'general',
      message: '',
    },
  });

  // Pre-fill name and email if user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue('name', user.name);
      setValue('email', user.email);
    }
  }, [isAuthenticated, user, setValue]);

  const messageValue = watch('message');
  const messageLength = messageValue?.length || 0;

  const onSubmit = async (data: SupportTicketFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await supportService.createTicket(data);
      navigate(`/support/confirmation/${response.referenceId}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to submit ticket';
      if (message.toLowerCase().includes('rate') || message.toLowerCase().includes('limit')) {
        setError('Too many requests. Please try again later.');
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Country Calendar</span>
          </Link>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <HelpCircle className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Contact Support</CardTitle>
          <CardDescription>
            Have a question or need help? Fill out the form below and we&apos;ll get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div
              className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Your name"
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  disabled={isSubmitting}
                  {...register('name')}
                />
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-500" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={isSubmitting}
                  {...register('email')}
                />
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-500" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                aria-required="true"
                aria-invalid={!!errors.category}
                aria-describedby={errors.category ? 'category-error' : undefined}
                disabled={isSubmitting}
                className={cn(
                  'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
                  errors.category && 'border-red-500'
                )}
                {...register('category')}
              >
                {SUPPORT_CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p id="category-error" className="text-sm text-red-500" role="alert">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                type="text"
                placeholder="Brief summary of your issue"
                aria-required="true"
                aria-invalid={!!errors.subject}
                aria-describedby={errors.subject ? 'subject-error' : undefined}
                disabled={isSubmitting}
                {...register('subject')}
              />
              {errors.subject && (
                <p id="subject-error" className="text-sm text-red-500" role="alert">
                  {errors.subject.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="message">Message</Label>
                <span className={cn(
                  'text-xs',
                  messageLength < 20 ? 'text-muted-foreground' :
                  messageLength > 5000 ? 'text-red-500' : 'text-muted-foreground'
                )}>
                  {messageLength}/5000
                </span>
              </div>
              <textarea
                id="message"
                placeholder="Please describe your issue in detail..."
                rows={5}
                aria-required="true"
                aria-invalid={!!errors.message}
                aria-describedby={errors.message ? 'message-error' : undefined}
                disabled={isSubmitting}
                className={cn(
                  'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none',
                  errors.message && 'border-red-500'
                )}
                {...register('message')}
              />
              {errors.message && (
                <p id="message-error" className="text-sm text-red-500" role="alert">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Ticket'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <Link
              to="/"
              className="inline-flex items-center text-primary hover:underline"
              tabIndex={isSubmitting ? -1 : 0}
            >
              <ArrowLeft className="mr-1 h-3 w-3" />
              Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
