'use client';

import { useState } from 'react';

// Prevent static generation for test page
export const dynamic = 'force-dynamic';

export default function ButtonTestPage() {
  const [clickCount, setClickCount] = useState(0);
  const [testResults, setTestResults] = useState<string[]>([]);

  const addResult = (message: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const testBasicClick = () => {
    setClickCount((prev) => prev + 1);
    addResult(`✅ Basic button click works! Count: ${clickCount + 1}`);
  };

  const testEventPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addResult(
      '✅ Event propagation test - preventDefault and stopPropagation work'
    );
  };

  const testAsyncClick = async () => {
    addResult('🔄 Testing async button click...');
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      addResult('✅ Async button click completed successfully');
    } catch (error) {
      addResult(`❌ Async button click failed: ${error}`);
    }
  };

  const testNavigationButton = () => {
    addResult('🧪 Testing navigation-style button...');
    // Simulate what navigation buttons do
    window.location.href = '/test-button-functionality';
  };

  const clearResults = () => {
    setTestResults([]);
    setClickCount(0);
  };

  return (
    <div
      style={{
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        background: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      }}
    >
      <h1 style={{ color: '#2563eb', marginBottom: '20px' }}>
        🔘 Button Functionality Test
      </h1>

      <p style={{ color: '#6b7280', marginBottom: '30px' }}>
        This page tests if buttons are working properly after the ErrorBoundary
        changes.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <button
          onClick={testBasicClick}
          style={{
            padding: '10px 20px',
            background: '#10b981',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Test Basic Click (Count: {clickCount})
        </button>

        <button
          onClick={testEventPropagation}
          style={{
            padding: '10px 20px',
            background: '#f59e0b',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Test Event Propagation
        </button>

        <button
          onClick={testAsyncClick}
          style={{
            padding: '10px 20px',
            background: '#8b5cf6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Test Async Click
        </button>

        <button
          onClick={testNavigationButton}
          style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Test Navigation Button
        </button>

        <button
          onClick={clearResults}
          style={{
            padding: '10px 20px',
            background: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          Clear Results
        </button>
      </div>

      <div
        style={{
          background: '#1f2937',
          color: '#f3f4f6',
          padding: '16px',
          borderRadius: '8px',
          fontFamily: 'monospace',
          minHeight: '200px',
          maxHeight: '400px',
          overflowY: 'auto',
          fontSize: '14px',
          lineHeight: '1.5',
        }}
      >
        <div
          style={{ color: '#10b981', fontWeight: '600', marginBottom: '10px' }}
        >
          🔘 Button Test Results:
        </div>
        {testResults.length === 0 ? (
          <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>
            Click the buttons above to test functionality...
          </div>
        ) : (
          testResults.map((result, index) => (
            <div key={index} style={{ marginBottom: '4px' }}>
              {result}
            </div>
          ))
        )}
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: '#eff6ff',
          border: '1px solid #dbeafe',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ color: '#2563eb', marginTop: '0' }}>🔍 Debugging Tips:</h3>
        <ul style={{ color: '#1e40af', marginBottom: '0' }}>
          <li>
            <strong>Check Console:</strong> Open browser dev tools and check for
            JavaScript errors
          </li>
          <li>
            <strong>Network Tab:</strong> Check if any requests are failing
          </li>
          <li>
            <strong>React DevTools:</strong> Check if components are rendering
            properly
          </li>
          <li>
            <strong>Event Listeners:</strong> Verify click events are being
            attached
          </li>
        </ul>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '16px',
          background: '#fef3c7',
          border: '1px solid #fbbf24',
          borderRadius: '8px',
        }}
      >
        <h3 style={{ color: '#d97706', marginTop: '0' }}>⚠️ Common Issues:</h3>
        <ul style={{ color: '#92400e', marginBottom: '0' }}>
          <li>
            <strong>Event Binding:</strong> Components not properly hydrated
          </li>
          <li>
            <strong>CSS Issues:</strong> Pointer events disabled or overlaying
            elements
          </li>
          <li>
            <strong>JavaScript Errors:</strong> Unhandled exceptions preventing
            event handling
          </li>
          <li>
            <strong>State Issues:</strong> Component state preventing re-renders
          </li>
        </ul>
      </div>
    </div>
  );
}
