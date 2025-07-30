'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface SimpleErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class SimpleErrorBoundary extends React.Component<
  SimpleErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: SimpleErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error without preventing the default behavior
    console.error('🛡️ React Error caught by SimpleErrorBoundary:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div
            style={{
              padding: '20px',
              background: '#fee2e2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              margin: '10px',
            }}
          >
            <h3 style={{ color: '#dc2626', margin: '0 0 10px 0' }}>
              🛡️ Component Error
            </h3>
            <p style={{ color: '#7f1d1d', margin: '0' }}>
              A component error occurred. Check the console for details.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              style={{
                marginTop: '10px',
                padding: '8px 16px',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
