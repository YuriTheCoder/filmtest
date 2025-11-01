import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/queryClient';
import { router } from './routes';
import { useEffect } from 'react';
import { useThemeStore } from './store/themeStore';
import ErrorBoundary from './components/common/ErrorBoundary';

function App() {
  const theme = useThemeStore((state) => state.theme);

  // Initialize theme on mount
  useEffect(() => {
    document.documentElement.classList.add(theme);
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: theme === 'dark' ? '#1a1a1a' : '#ffffff',
            color: theme === 'dark' ? '#ffffff' : '#0a0a0a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
