import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ReCAPTCHA from 'react-google-recaptcha';
import { Globe, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OAuthButtons } from '@/components/features/OAuthButtons';
import { useAuthStore } from '@/stores/authStore';
import { authService } from '@/lib/authService';
import { api } from '@/lib/api';
import { logger } from '@/lib/logger';
import { loginSchema, type LoginFormData } from '@/lib/validations/auth';
import { toast } from 'sonner';

interface AuthConfigResponse {
  providers: string[];
  captcha: {
    required: boolean;
    siteKey: string | null;
  };
}

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuthStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaConfig, setCaptchaConfig] = useState<{ required: boolean; siteKey: string | null }>({
    required: false,
    siteKey: null,
  });
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const from = (location.state as { from?: string })?.from || '/calendar';

  // Fetch auth config (including CAPTCHA settings)
  useEffect(() => {
    async function fetchAuthConfig() {
      try {
        const data = await api.get<AuthConfigResponse>('/auth/providers');
        setCaptchaConfig(data.captcha);
      } catch (error) {
        logger.error('Failed to fetch auth config', error);
      }
    }
    fetchAuthConfig();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = useCallback(async (data: LoginFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Get CAPTCHA token if required
      let captchaToken: string | undefined;
      if (captchaConfig.required && recaptchaRef.current) {
        captchaToken = recaptchaRef.current.getValue() || undefined;
        if (!captchaToken) {
          setError('Please complete the CAPTCHA verification.');
          setIsSubmitting(false);
          return;
        }
      }

      const response = await authService.login({
        ...data,
        captchaToken,
      });
      login(response.accessToken, response.user);

      if (!response.user.isConfirmed) {
        toast.info('Please confirm your email to access all features', {
          duration: 5000,
        });
      }

      navigate(from, { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';

      // Reset CAPTCHA on error
      recaptchaRef.current?.reset();

      if (message.toLowerCase().includes('locked')) {
        setError('Too many login attempts. Please try again in 15 minutes.');
      } else if (message.toLowerCase().includes('captcha')) {
        setError('CAPTCHA verification failed. Please try again.');
      } else if (
        message.toLowerCase().includes('invalid') ||
        message.toLowerCase().includes('credentials')
      ) {
        setError('Invalid email or password. Please try again.');
        setValue('password', '');
      } else {
        setError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [captchaConfig.required, login, navigate, from, setValue]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link to="/" className="mx-auto mb-4 flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">Country Calendar</span>
          </Link>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
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

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-muted-foreground hover:text-primary"
                  tabIndex={isSubmitting ? -1 : 0}
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                aria-required="true"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? 'password-error' : undefined}
                disabled={isSubmitting}
                {...register('password')}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-red-500" role="alert">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                )}
              />
              <Label
                htmlFor="rememberMe"
                className="text-sm font-normal text-muted-foreground cursor-pointer"
              >
                Keep me logged in for 30 days
              </Label>
            </div>

            {captchaConfig.required && captchaConfig.siteKey && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={captchaConfig.siteKey}
                  theme="light"
                />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <OAuthButtons />

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              to="/register"
              className="text-primary hover:underline"
              tabIndex={isSubmitting ? -1 : 0}
            >
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
