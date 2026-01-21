import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, Loader2, AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/lib/authService';
import {
  resendConfirmationSchema,
  type ResendConfirmationFormData,
} from '@/lib/validations/auth';

type ConfirmationStatus = 'loading' | 'success' | 'error' | 'expired';

export default function EmailConfirmationPage() {
  const { token } = useParams<{ token: string }>();
  const [status, setStatus] = useState<ConfirmationStatus>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendConfirmationFormData>({
    resolver: zodResolver(resendConfirmationSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    async function confirmEmail() {
      if (!token) {
        setStatus('error');
        setErrorMessage('Invalid confirmation link.');
        return;
      }

      try {
        await authService.confirmEmail(token);
        setStatus('success');
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Confirmation failed';

        if (message.toLowerCase().includes('expired')) {
          setStatus('expired');
          setErrorMessage('This confirmation link has expired.');
        } else if (
          message.toLowerCase().includes('invalid') ||
          message.toLowerCase().includes('not found')
        ) {
          setStatus('error');
          setErrorMessage('This confirmation link is invalid.');
        } else if (message.toLowerCase().includes('already confirmed')) {
          setStatus('success');
        } else {
          setStatus('error');
          setErrorMessage(message);
        }
      }
    }

    confirmEmail();
  }, [token]);

  const onResendSubmit = async (data: ResendConfirmationFormData) => {
    setIsResending(true);
    setResendError(null);

    try {
      await authService.resendConfirmation(data.email);
      setResendSuccess(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend';

      if (message.toLowerCase().includes('rate') || message.toLowerCase().includes('limit')) {
        setResendError('Too many requests. Please try again later.');
      } else {
        // Show success regardless to prevent email enumeration
        setResendSuccess(true);
      }
    } finally {
      setIsResending(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex items-center gap-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Country Calendar</span>
            </div>
            <div className="mx-auto mb-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
            <CardTitle className="text-xl">Confirming your email...</CardTitle>
            <CardDescription>Please wait while we verify your email address.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Link to="/" className="mx-auto mb-4 flex items-center gap-2">
              <Globe className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">Country Calendar</span>
            </Link>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-600">Email Confirmed!</CardTitle>
            <CardDescription>
              Your email has been confirmed. You can now access all features.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Link to="/login">
              <Button>Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error or expired status with resend option
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Country Calendar</span>
          </Link>
          {!showResendForm && !resendSuccess ? (
            <>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle className="text-xl text-red-600">
                {status === 'expired' ? 'Link Expired' : 'Confirmation Failed'}
              </CardTitle>
              <CardDescription>{errorMessage}</CardDescription>
            </>
          ) : resendSuccess ? (
            <>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Check your email</CardTitle>
              <CardDescription>
                If an account exists with this email, you will receive a new confirmation link.
              </CardDescription>
            </>
          ) : (
            <>
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Resend Confirmation</CardTitle>
              <CardDescription>
                Enter your email address to receive a new confirmation link.
              </CardDescription>
            </>
          )}
        </CardHeader>
        <CardContent>
          {!showResendForm && !resendSuccess ? (
            <div className="flex flex-col items-center gap-3">
              <Button onClick={() => setShowResendForm(true)}>Resend Confirmation Email</Button>
              <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
                Back to Login
              </Link>
            </div>
          ) : resendSuccess ? (
            <div className="text-center">
              <Link to="/login">
                <Button variant="outline">Back to Login</Button>
              </Link>
            </div>
          ) : (
            <>
              {resendError && (
                <div
                  className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600"
                  role="alert"
                  aria-live="polite"
                >
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{resendError}</span>
                </div>
              )}

              <form onSubmit={handleSubmit(onResendSubmit)} className="space-y-4" noValidate>
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
                    disabled={isResending}
                    {...register('email')}
                  />
                  {errors.email && (
                    <p id="email-error" className="text-sm text-red-500" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={isResending}>
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Confirmation Email'
                  )}
                </Button>
              </form>

              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowResendForm(false)}
                  className="text-sm text-muted-foreground hover:text-primary"
                  disabled={isResending}
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
