import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from '@/components/layout';
import { ProtectedRoute, PublicRoute } from '@/components/auth';
import { useAuthStore } from '@/stores/authStore';

// Pages
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ForgotPasswordPage from '@/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/ResetPasswordPage';
import EmailConfirmationPage from '@/pages/EmailConfirmationPage';
import OAuthCallbackPage from '@/pages/OAuthCallbackPage';
import CalendarPage from '@/pages/CalendarPage';
import ReportsPage from '@/pages/ReportsPage';
import ProfilePage from '@/pages/ProfilePage';
import SupportPage from '@/pages/SupportPage';
import SupportConfirmationPage from '@/pages/SupportConfirmationPage';
import NotFoundPage from '@/pages/NotFoundPage';

function App() {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  return (
    <>
      <Routes>
        {/* Public routes without layout (standalone pages) */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LandingPage />
            </PublicRoute>
          }
        />

        {/* Auth routes (standalone pages) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route path="/confirm-email/:token" element={<EmailConfirmationPage />} />
        <Route path="/oauth/callback" element={<OAuthCallbackPage />} />

        {/* Protected routes with layout */}
        <Route element={<Layout showFooter={false} />}>
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Static pages with layout */}
        <Route element={<Layout showMobileNav={false} />}>
          <Route path="/privacy" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Privacy Policy</h1></div>} />
          <Route path="/terms" element={<div className="container mx-auto px-4 py-8"><h1 className="text-2xl font-bold">Terms of Service</h1></div>} />
        </Route>

        {/* Support pages (standalone) */}
        <Route path="/support" element={<SupportPage />} />
        <Route path="/support/confirmation/:referenceId" element={<SupportConfirmationPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
