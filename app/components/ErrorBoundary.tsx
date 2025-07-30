'use client';

import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('🚨 DOM Nesting Error Caught:', error);
    console.error('🔍 Error Info:', errorInfo);
    console.error('📍 Component Stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '20px',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            margin: '10px',
          }}
        >
          <h2 style={{ color: '#dc2626', marginBottom: '10px' }}>
            🚨 DOM Nesting Error Detected
          </h2>
          <details style={{ marginBottom: '10px' }}>
            <summary style={{ cursor: 'pointer', color: '#dc2626' }}>
              Error Details
            </summary>
            <pre
              style={{
                background: '#fef2f2',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
              }}
            >
              {this.state.error?.toString()}
            </pre>
          </details>

          <details>
            <summary style={{ cursor: 'pointer', color: '#dc2626' }}>
              Component Stack
            </summary>
            <pre
              style={{
                background: '#fef2f2',
                padding: '10px',
                borderRadius: '4px',
                fontSize: '12px',
                overflow: 'auto',
              }}
            >
              {this.state.errorInfo?.componentStack}
            </pre>
          </details>

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
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
