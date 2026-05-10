import React from 'react';
import logger from '../utils/logger';

const MODULE = 'ErrorBoundary';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    logger.error(MODULE, 'Render crash captured', {
      message: error.message,
      stack: error.stack,
      componentStack: info.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
          <div className="glass-card p-10 max-w-lg w-full text-center space-y-6">
            <div className="w-16 h-16 bg-danger-600/20 rounded-2xl flex items-center justify-center mx-auto">
              <span className="text-3xl">⚠️</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 mb-2">Something went wrong</h1>
              <p className="text-slate-400 text-sm">
                An unexpected error occurred. The error has been logged for debugging.
              </p>
              {import.meta.env.DEV && (
                <pre className="mt-4 text-left text-xs text-danger-400 bg-slate-900 rounded-lg p-4 overflow-auto max-h-40">
                  {this.state.error?.message}
                </pre>
              )}
            </div>
            <button onClick={this.handleReset} className="btn-primary">
              Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
