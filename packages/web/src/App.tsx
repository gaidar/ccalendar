import { lazy, Suspense, useEffect, memo } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { Layout } from '@/components/layout';
import { ProtectedRoute, PublicRoute, AdminRoute } from '@/components/auth';
import { useAuthStore } from '@/stores/authStore';

// Loading component for Suspense boundaries
const PageLoader = memo(function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
});

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/ResetPasswordPage'));
const EmailConfirmationPage = lazy(() => import('@/pages/EmailConfirmationPage'));
const OAuthCallbackPage = lazy(() => import('@/pages/OAuthCallbackPage'));
const CalendarPage = lazy(() => import('@/pages/CalendarPage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const SupportPage = lazy(() => import('@/pages/SupportPage'));
const SupportConfirmationPage = lazy(() => import('@/pages/SupportConfirmationPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Admin Pages (grouped in a single lazy import to reduce chunks)
const AdminDashboardPage = lazy(() =>
  import('@/pages/admin').then(module => ({ default: module.AdminDashboardPage }))
);
const AdminUsersPage = lazy(() =>
  import('@/pages/admin').then(module => ({ default: module.AdminUsersPage }))
);
const AdminUserEditPage = lazy(() =>
  import('@/pages/admin').then(module => ({ default: module.AdminUserEditPage }))
);
const AdminTicketsPage = lazy(() =>
  import('@/pages/admin').then(module => ({ default: module.AdminTicketsPage }))
);
const AdminTicketDetailPage = lazy(() =>
  import('@/pages/admin').then(module => ({ default: module.AdminTicketDetailPage }))
);

function App() {
  const { initialize, isInitialized } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) {
      initialize();
    }
  }, [initialize, isInitialized]);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
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

          {/* Admin routes with layout */}
          <Route element={<Layout showFooter={false} />}>
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboardPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsersPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <AdminRoute>
                  <AdminUserEditPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/tickets"
              element={
                <AdminRoute>
                  <AdminTicketsPage />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/tickets/:referenceId"
              element={
                <AdminRoute>
                  <AdminTicketDetailPage />
                </AdminRoute>
              }
            />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
