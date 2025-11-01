import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

// Layouts
import RootLayout from '@/components/layout/RootLayout';

// Pages - Lazy loaded
const Home = lazy(() => import('@/pages/Home'));
const Movies = lazy(() => import('@/pages/Movies'));
const MovieDetail = lazy(() => import('@/pages/MovieDetail'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Profile = lazy(() => import('@/pages/Profile'));
const Favorites = lazy(() => import('@/pages/Favorites'));
const Watchlist = lazy(() => import('@/pages/Watchlist'));
const AdminDashboard = lazy(() => import('@/pages/Admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/Admin/Users'));
const AdminSync = lazy(() => import('@/pages/Admin/Sync'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-primary"></div>
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

// Admin route wrapper
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'ADMIN';
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoader />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: 'movies',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Movies />
          </Suspense>
        ),
      },
      {
        path: 'movies/:slug',
        element: (
          <Suspense fallback={<PageLoader />}>
            <MovieDetail />
          </Suspense>
        ),
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<PageLoader />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Profile />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'favorites',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Favorites />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'watchlist',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<PageLoader />}>
              <Watchlist />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminDashboard />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminUsers />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: 'admin/sync',
        element: (
          <AdminRoute>
            <Suspense fallback={<PageLoader />}>
              <AdminSync />
            </Suspense>
          </AdminRoute>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);
