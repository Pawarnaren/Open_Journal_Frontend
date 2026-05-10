import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { BlogProvider } from './context/BlogContext';
import { JournalProvider } from './context/JournalContext';
import ErrorBoundary from './errors/ErrorBoundary';
import AppRouter from './router/AppRouter';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <BlogProvider>
            <JournalProvider>
              <AppRouter />

              {/* Global Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1e293b',
                    color: '#f1f5f9',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontFamily: 'Inter, sans-serif',
                  },
                  success: {
                    iconTheme: { primary: '#10b981', secondary: '#ecfdf5' },
                  },
                  error: {
                    iconTheme: { primary: '#f43f5e', secondary: '#fff1f2' },
                  },
                }}
              />

              {/* React Query Devtools (dev only) */}
              <ReactQueryDevtools initialIsOpen={false} />
            </JournalProvider>
          </BlogProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  </ErrorBoundary>
);

export default App;
